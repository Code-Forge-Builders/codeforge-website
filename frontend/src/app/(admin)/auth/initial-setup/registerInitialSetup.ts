import { apiHttpClient } from "@/lib/httpClient"

export interface IPayloadRegisterInitialSetup {
  name: string
  login: string
  password: string
  confirm_password: string
}

export interface IUser {
  id: string
  name: string
  login: string
  password_hash: string
  created_at: string
  updated_at: string
}

export default async function registerInitialSetup(payload: IPayloadRegisterInitialSetup) {
  const user = await apiHttpClient.post<IUser>('/auth/initial-register', {
    body: payload
  })

  return user
}