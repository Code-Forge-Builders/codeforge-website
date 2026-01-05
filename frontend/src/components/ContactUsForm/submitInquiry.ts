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
  const response = await fetch('http://localhost:8080/api/inquiries', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(inquiryPayload)
  });

  if (!response.ok) throw new Error(`Failed to send inquiry to api`);

  const data: Inquiry = await response.json()

  return data
}