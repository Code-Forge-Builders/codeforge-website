package analytics

import "time"

var AllowedPeriods = map[string]bool{
	"24h": true,
	"7d":  true,
	"30d": true,
	"90d": true,
}

type TimeSeriesFilterDto struct {
	StartDate *time.Time `json:"start_date" form:"start_date" query:"start_date"`
	EndDate   *time.Time `json:"end_date" form:"end_date" query:"end_date"`
	Period    *string    `json:"period" form:"period" query:"period"`
}

type TimeSeriesPointsDto struct {
	AccessAt   time.Time `json:"access_at"`
	VisitCount int       `json:"visit_count"`
}

type GetVisitResponseDto struct {
	Bucket string                `json:"bucket"`
	Points []TimeSeriesPointsDto `json:"points"`
}
