import { apiHttpClient } from "@/lib/httpClient";

export default async function checkInitialSetup(): Promise<boolean> {
  const { setup_done } = await apiHttpClient.get<{ setup_done: boolean }>('/auth/check-initial-setup')

  return setup_done
}