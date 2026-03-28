import { apiHttpClient } from "@/lib/httpClient"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export interface IGetInquiriesPayload {
  search?: string
}

export interface Inquiries {
  customer_name: string
  customer_email: string
  customer_phone: string
  state: number
  created_at: string
}

export interface InquiriesResponseBody {
  inquiries: Inquiries[]
  page: number
  page_size: number
  order_by: string
  order: string
  total: number
}

export default async function getInquiries(payload: IGetInquiriesPayload): Promise<InquiriesResponseBody> {
  const cookieStore = await cookies()
  const authToken = cookieStore.get('auth_token')
  if (!authToken) {
    redirect('/auth/login')
  }

  try {
    const result = await apiHttpClient.get<InquiriesResponseBody>("/inquiries", {
      credentials: "include",
      cache: "no-store",
      headers: {
        Cookie: cookieStore.toString(),
      },
      query: payload as Record<string, string>
    })

    return result
  }
  catch (error) {
    throw error
  }
}
