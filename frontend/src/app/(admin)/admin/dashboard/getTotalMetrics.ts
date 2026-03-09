import { apiHttpClient } from "@/lib/httpClient"
import { IGetVisitsByRangePayload } from "./services/getVisitsByRange"

interface TotalMetricsDto {
  value: number
  change: number
  label: string
}

export interface IGetTotalMetricsResponse {
  total_visits: TotalMetricsDto
  total_unique_visitors: TotalMetricsDto
  total_leads: TotalMetricsDto
  total_conversion_rate: TotalMetricsDto
}

export async function getTotalMetrics(payload: IGetVisitsByRangePayload) {
  const response = await apiHttpClient.get<IGetTotalMetricsResponse>('/analytics/total-metrics', {
    credentials: "include",
    query: payload as Record<string, string>,
  })
  return response
}