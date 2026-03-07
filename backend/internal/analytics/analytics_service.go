package analytics

import (
	"codeforge/website-prospecting-api/internal/db"
	"fmt"
	"time"
)

type AnalyticsService interface {
	GetVisitsGroupedByPeriod(filter TimeSeriesFilterDto) (GetVisitResponseDto, error)
}

type analyticsService struct {
}

func NewAnalyticsService() AnalyticsService {
	return &analyticsService{}
}

func (s *analyticsService) GetVisitsGroupedByPeriod(filter TimeSeriesFilterDto) (GetVisitResponseDto, error) {
	if err := validateFilter(filter); err != nil {
		return GetVisitResponseDto{}, err
	}

	// Check if it has period, if so, use the period to get the data
	if filter.Period != nil && AllowedPeriods[*filter.Period] {
		now := time.Now().UTC()
		filter.EndDate = &now
		switch *filter.Period {
		case "24h":
			startDate := now.Add(-time.Hour * 24).UTC()
			filter.StartDate = &startDate
		case "7d":
			startDate := now.Add(-time.Hour * 24 * 7).UTC()
			filter.StartDate = &startDate
		case "30d":
			startDate := now.Add(-time.Hour * 24 * 30).UTC()
			filter.StartDate = &startDate
		case "90d":
			startDate := now.Add(-time.Hour * 24 * 90).UTC()
			filter.StartDate = &startDate
		}
	}

	bucket := "day"

	var PeriodBucketMap = map[string]string{
		"24h": "hour",
		"7d":  "day",
		"30d": "day",
		"90d": "week",
	}

	if filter.Period != nil {
		if b, ok := PeriodBucketMap[*filter.Period]; ok {
			bucket = b
		}
	} else if filter.StartDate != nil && filter.EndDate != nil {
		duration := filter.EndDate.Sub(*filter.StartDate)

		// Edge cases: there is no period, but we got start and end date
		maxTimeForHourBucket := time.Hour * 24 * 2   // 48 hours
		maxTimeForDailyBucket := time.Hour * 24 * 60 // 60 days

		switch {
		case duration <= maxTimeForHourBucket:
			bucket = "hour"
		case duration <= maxTimeForDailyBucket:
			bucket = "day"
		default:
			bucket = "week"
		}
	}

	var BucketIntervalMap = map[string]string{
		"hour": "1 hour",
		"day":  "1 day",
		"week": "1 week",
	}

	interval := "1 day"

	if i, ok := BucketIntervalMap[bucket]; ok {
		interval = i
	}

	timeSeriesPoints := []TimeSeriesPointsDto{}

	err := db.DB.Raw(`
		SELECT
			series.access_at AS access_at,
			COALESCE(m.visit_count, 0) AS visit_count
		FROM generate_series(
			date_trunc(?::text, ?::timestamp),
			date_trunc(?::text, ?::timestamp),
			?::interval
		) AS series(access_at)
		LEFT JOIN (
			SELECT
				date_trunc(?::text, access_at) AS access_at,
				COUNT(*) AS visit_count
			FROM metrics
			WHERE access_at BETWEEN ? AND ?
			GROUP BY 1
		) m ON m.access_at = series.access_at
		ORDER BY series.access_at
	`,
		bucket, *filter.StartDate,
		bucket, *filter.EndDate,
		interval,
		bucket,
		filter.StartDate,
		filter.EndDate,
	).Scan(&timeSeriesPoints).Error

	if err != nil {
		return GetVisitResponseDto{}, err
	}

	return GetVisitResponseDto{
		Bucket: bucket,
		Points: timeSeriesPoints,
	}, nil
}

func validateFilter(filter TimeSeriesFilterDto) error {
	if filter.Period != nil {
		if !AllowedPeriods[*filter.Period] {
			return fmt.Errorf("period is not allowed")
		}
		return nil
	}

	if filter.StartDate == nil || filter.EndDate == nil {
		return fmt.Errorf("start date and end date are required")
	}

	if filter.StartDate.After(*filter.EndDate) {
		return fmt.Errorf("invalid date range")
	}

	diff := filter.EndDate.Sub(*filter.StartDate)
	if diff > time.Hour*24*365 {
		return fmt.Errorf("date range is too long, max is 1 year")
	}

	return nil
}
