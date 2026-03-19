import { apiHttpClient } from "@/lib/httpClient"
import { cookies } from "next/headers"
export interface IGetUserResponse {
  message: string
  user: {
    id: string
    name: string
    login: string
  }
}

export default async function getUser() {
  const cookieStore = await cookies()
  const authToken = cookieStore.get('auth_token')
  if (!authToken) {
    throw new Error('Unauthorized')
  }

  return apiHttpClient.get<IGetUserResponse>('/auth/get-user', {
    credentials: "include",
    cache: "no-store",
    headers: {
      Cookie: cookieStore.toString(),
    },
  })
}