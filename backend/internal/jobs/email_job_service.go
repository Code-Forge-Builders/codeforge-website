package jobs

type EmailJobService interface {
	Start() error
	Stop() error

	Enqueue(job *BackgroundJob) error
}
