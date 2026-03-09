import { apiHttpClient } from "@/lib/httpClient"
import { IGetVisitsByRangePayload } from "./services/getVisitsByRange"

export interface TotalMetricsDto {
  value: number
  change: number
  label: string
  is_percentage: boolean
  is_integer: boolean
}

export async function getTotalMetrics(payload: IGetVisitsByRangePayload) {
  const response = await apiHttpClient.get<TotalMetricsDto[]>('/analytics/total-metrics', {
    credentials: "include",
    query: payload as Record<string, string>,
  })
  return response
}