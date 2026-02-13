package jobs

import (
	"codeforge/website-prospecting-api/internal/db"
	"codeforge/website-prospecting-api/internal/email"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"time"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type EmailJobWorker interface {
	Start() error
	Stop() error
}

type EmailJobPayload struct {
	To           []string
	Subject      string
	TemplateName string
	Data         any
}

type emailJobWorker struct {
	emailService email.EmailService
	stopChan     chan struct{}
}

func NewEmailJobWorker(emailService email.EmailService) EmailJobWorker {
	return &emailJobWorker{
		emailService: emailService,
		stopChan:     make(chan struct{}),
	}
}

func (w *emailJobWorker) Start() error {
	w.stopChan = make(chan struct{})
	go w.run()
	return nil
}

func (w *emailJobWorker) Stop() error {
	select {
	case <-w.stopChan:
		// Job is already stopped
	default:
		close(w.stopChan)
	}

	return nil
}

func (w *emailJobWorker) claimNextJob(tx *gorm.DB) (*BackgroundJob, error) {
	now := time.Now()
	job := BackgroundJob{}

	result := tx.
		Clauses(clause.Locking{
			Strength: "UPDATE",
			Options:  "SKIP LOCKED",
		}).
		Where("status = ?", BackgroundJobStatusPending).
		Where("type = ?", BackgroundJobTypeEmail).
		Where("locked_at IS NULL OR locked_at < ?", now.Add(-1*time.Minute)).
		Where("attempts < max_attempts").
		Where("updated_at < ?", now.Add(-1*time.Minute)). // If the job was tried on the last minute, skip it to avoid sequential retries
		Order("created_at ASC").
		Order("updated_at ASC").
		First(&job)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to get next email job: %v", result.Error)
	}

	job.Status = BackgroundJobStatusInProgress
	job.LockedAt = &now
	job.UpdatedAt = now

	result = tx.Save(&job)
	if result.Error != nil {
		return nil, fmt.Errorf("failed to claim email job: %v", result.Error)
	}

	return &job, nil
}

func (w *emailJobWorker) processJob(job *BackgroundJob) error {
	now := time.Now()
	payload := EmailJobPayload{}
	err := json.Unmarshal(job.Payload, &payload)
	if err != nil {
		return fmt.Errorf("failed to unmarshal email job payload: %v", err)
	}

	newEmail := email.Email{
		To:      payload.To,
		Subject: payload.Subject,
	}

	job.UpdatedAt = now // Update the updated_at timestamp to the current time
	job.Attempts++      // Increment the attempts count just before rendering the template

	newEmail.HTML, err = email.RenderTemplate(payload.TemplateName, payload.Data)
	if err != nil {
		// Setup to pending state or dead letter again - failure on rendering, not sending email
		job.Status = BackgroundJobStatusPending
		job.UpdatedAt = now
		job.LockedAt = nil

		if job.Attempts >= job.MaxAttempts {
			job.Status = BackgroundJobStatusFailed // Dead letter
		} else {
			job.Status = BackgroundJobStatusPending // Retry
		}

		result := db.DB.Save(job)
		if result.Error != nil {
			return fmt.Errorf("failed to update email job: %v", result.Error)
		}
		return fmt.Errorf("failed to render email template: %v", err)
	}

	err = w.emailService.SendEmail(newEmail)

	if err != nil {
		job.LockedAt = nil

		if job.Attempts >= job.MaxAttempts {
			job.Status = BackgroundJobStatusFailed // Dead letter
		} else {
			job.Status = BackgroundJobStatusPending // Retry
		}

		result := db.DB.Save(job)
		if result.Error != nil {
			return fmt.Errorf("failed to update email job: %v", result.Error)
		}
		return fmt.Errorf("failed to send email: %v", err)
	}

	job.Status = BackgroundJobStatusSuccess
	job.FinishedAt = &now // Update the finished_at timestamp to the current time
	job.LockedAt = nil
	job.UpdatedAt = now

	result := db.DB.Save(job)
	if result.Error != nil {
		return fmt.Errorf("failed to update email job: %v", result.Error)
	}

	return nil
}

func (w *emailJobWorker) run() {
	for {
		select {
		case <-w.stopChan:
			return
		default:
			var job *BackgroundJob
			err := db.DB.Transaction(func(tx *gorm.DB) error {
				var err error
				job, err = w.claimNextJob(tx)
				return err
			})

			if err != nil {
				time.Sleep(1 * time.Second) // Wait a bit to avoid db hammering
				continue
			}

			if job == nil { // No job found, wait a bit to avoid db hammering
				time.Sleep(1 * time.Second)
				continue
			}

			err = w.processJob(job)
			if err != nil {
				log.Printf("failed to process email job: %v\n", err)
				continue
			}
		}
	}
}
