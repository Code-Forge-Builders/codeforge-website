package metrics

import (
	"codeforge/website-prospecting-api/internal/db"
	"codeforge/website-prospecting-api/internal/utils"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

func CreateRecord(createMetricsDto CreateMetricsDto) (*Metrics, error) {
	ipInfo := getRegionFromIp(createMetricsDto.Ip)

	IpHash := utils.HashIpUnrecoverable(createMetricsDto.Ip)

	metrics := Metrics{
		AccessAt:  time.Now(),
		UserAgent: createMetricsDto.UserAgent,
		IpHash:    IpHash,
		Locale:    createMetricsDto.Locale,
		Country:   ipInfo.Country,
		Region:    ipInfo.Region,
	}

	result := db.DB.Create(&metrics)

	if result.Error != nil {
		return nil, fmt.Errorf("error during creation of metrics record: %w", result.Error)
	}

	return &metrics, nil
}

func getRegionFromIp(ip string) IPAPIResponse {
	endpoint := fmt.Sprintf("https://ipapi.co/%s/json", ip)
	res, err := http.Get(endpoint)
	if err != nil {
		return IPAPIResponse{}
	}

	defer res.Body.Close()
	var data IPAPIResponse
	json.NewDecoder(res.Body).Decode(&data)
	return data
}
