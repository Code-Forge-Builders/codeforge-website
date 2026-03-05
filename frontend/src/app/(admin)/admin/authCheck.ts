import { apiHttpClient } from "@/lib/httpClient";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function authCheck() {
  const cookieStore = await cookies()
  const authToken = cookieStore.get('auth_token')
  if (!authToken) {
    redirect('/auth/login')
  }
  
  try {
    await apiHttpClient.get<{ message: string, user: { id: string, name: string, login: string } }>(
      '/auth/check-auth',
      {
        credentials: 'include',
        headers: {
          Cookie: cookieStore.toString(),
        }
      }
    )
  } catch (error) {
    redirect('/auth/login')
  }
}