import { apiHttpClient } from "@/lib/httpClient";

export interface InquiryBodyPayload {
  customer_name: string
  customer_email: string
  customer_phone: string
  service_key: string
  project_description: string
}

export interface Inquiry {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  service_key: string
  project_description: string
}

export async function submitInquiry(inquiryPayload: InquiryBodyPayload) {
  return apiHttpClient.post<Inquiry>("/inquiries", { body: inquiryPayload });
}