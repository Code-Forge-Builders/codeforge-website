package metrics

type CreateMetricsDto struct {
	UserAgent string
	Ip        string
	Locale    string
}

type IPAPIResponse struct {
	Country string `json:"country"`
	Region  string `json:"region"`
	City    string `json:"city"`
}
