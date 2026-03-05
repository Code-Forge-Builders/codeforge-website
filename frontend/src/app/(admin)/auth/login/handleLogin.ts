import { apiHttpClient } from "@/lib/httpClient"

export interface ILoginPayload {
  login: string
  password: string
}

export interface ILoginResponse {
  token: string
  expires_at: string
  user: {
    id: string
    name: string
    login: string
  }
}

export default async function handleLogin(payload: ILoginPayload): Promise<ILoginResponse> {
  return await apiHttpClient.post<ILoginResponse>('/auth/login', {
    credentials: "include",
    body: payload
  })
}