import { apiHttpClient } from "@/lib/httpClient"

export enum PeriodEnum {
  DAY = "24h",
  WEEK = "7d",
  THIRTY_DAYS = "30d",
  NINETY_DAYS = "90d",
  CUSTOM = "custom",
}

export enum BucketEnum {
  HOUR = "hour",
  DAY = "day",
  WEEK = "week",
}

export interface IGetVisitsByRangePayload {
  start_date?: string
  end_date?: string
  period?: PeriodEnum
}

export interface IGetVisitsByRangeResponse {
  bucket: BucketEnum
  points: {
    access_at: string
    visit_count: number
  }[]
}

export async function getVisitsByRange(payload: IGetVisitsByRangePayload) {
  const points = await apiHttpClient.get<IGetVisitsByRangeResponse>("/analytics/visits-grouped-by-period", {
    query: payload as Record<string, string>,
  })
  return points
}