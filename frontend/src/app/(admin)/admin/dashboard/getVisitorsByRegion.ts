import { apiHttpClient } from "@/lib/httpClient"
import { IGetVisitsByRangePayload } from "./services/getVisitsByRange"

export interface VisitorsByRegionDto {
  country: string
  region: string
  city: string
  unique_visitors: number
}

export async function getVisitorsByRegion(payload: IGetVisitsByRangePayload) {
  const response = await apiHttpClient.get<VisitorsByRegionDto[]>("/analytics/visitors-by-region", {
    credentials: "include",
    query: payload as Record<string, string>,
  })
  return response
}

