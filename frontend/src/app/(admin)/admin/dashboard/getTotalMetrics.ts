import { apiHttpClient } from "@/lib/httpClient"
import { IGetVisitsByRangePayload } from "./services/getVisitsByRange"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export interface TotalMetricsDto {
  value: number
  change: number
  label: string
  is_percentage: boolean
  is_integer: boolean
}

export async function getTotalMetrics(payload: IGetVisitsByRangePayload) {
  const cookieStore = await cookies()
  const authToken = cookieStore.get('auth_token')
  if (!authToken) {
    redirect('/auth/login')
  }
  try {
    const response = await apiHttpClient.get<TotalMetricsDto[]>('/analytics/total-metrics', {
      credentials: "include",
      cache: "no-store",
      headers: {
        Cookie: cookieStore.toString(),
      },
      query: payload as Record<string, string>,
    })
    return response
  }
  catch {
    redirect('/auth/login')
  }
}
