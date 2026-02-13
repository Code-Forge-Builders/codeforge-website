package jobs

import (
	"codeforge/website-prospecting-api/internal/config"
	"codeforge/website-prospecting-api/internal/email"
	"log"
	"runtime"
)

const (
	minEmailJobWorkersAmount = 2
)

func CalculateEmailJobWorkersAmount() int { // Calculate the number of workers, limiting between 2 and max amount
	cfg, err := config.Load()
	if err != nil {
		log.Printf("failed to load config: %v", err)
		return minEmailJobWorkersAmount
	}
	cpus := runtime.NumCPU()

	workers := int(float64(cpus) * cfg.JobWorkerAmountFactor)

	if workers < minEmailJobWorkersAmount {
		workers = minEmailJobWorkersAmount
	}

	if workers > cfg.EmailJobWorkersMaxAmount {
		workers = cfg.EmailJobWorkersMaxAmount
	}

	return workers
}

func SetupEmailJobWorkers() []EmailJobWorker {
	workersAmount := CalculateEmailJobWorkersAmount()

	workers := make([]EmailJobWorker, 0, workersAmount)

	emailConfig, err := email.LoadEmailConfig()
	if err != nil {
		log.Printf("failed to load email config: %v", err)
		return nil
	}

	emailService := email.NewEmailService(*emailConfig)

	for i := 0; i < workersAmount; i++ {
		worker := NewEmailJobWorker(emailService)
		worker.Start()
		workers = append(workers, worker)
	}

	return workers
}

func StopEmailJobWorkers(workers []EmailJobWorker) {
	for _, worker := range workers {
		worker.Stop()
	}
}
