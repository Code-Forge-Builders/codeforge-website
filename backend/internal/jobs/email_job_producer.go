package jobs

import (
	"codeforge/website-prospecting-api/internal/db"
	"fmt"
	"time"
)

type EmailJobProducer interface {
	Enqueue(job *BackgroundJob) error
}

type emailJobProducer struct {
}

func (p *emailJobProducer) Enqueue(job *BackgroundJob) error {
	job.Status = BackgroundJobStatusPending
	job.Attempts = 0
	job.MaxAttempts = 3
	job.CreatedAt = time.Now()
	job.UpdatedAt = time.Now()

	result := db.DB.Create(job)

	if result.Error != nil {
		return fmt.Errorf("failed to enqueue email job: %v", result.Error)
	}

	return nil
}