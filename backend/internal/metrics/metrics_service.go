package metrics

import (
	"codeforge/website-prospecting-api/internal/db"
	"codeforge/website-prospecting-api/internal/metrics/models"
	"codeforge/website-prospecting-api/internal/utils"
	"fmt"
	"time"
)

func CreateRecord(createMetricsDto CreateMetricsDto) (*models.Metrics, error) {
	IpHash := utils.HashIpUnrecoverable(createMetricsDto.Ip)

	metrics := models.Metrics{
		AccessAt:  time.Now(),
		UserAgent: createMetricsDto.UserAgent,
		IpHash:    IpHash,
		Locale:    createMetricsDto.Locale,
	}

	result := db.DB.Create(&metrics)

	if result.Error != nil {
		return nil, fmt.Errorf("error during creation of metrics record: %w", result.Error)
	}

	return &metrics, nil
}
