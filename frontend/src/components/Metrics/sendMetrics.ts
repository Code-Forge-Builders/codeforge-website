import { apiHttpClient } from "@/lib/httpClient";

export async function sendMetrics(locale: string) {
  await apiHttpClient.post("/metrics", {
    headers: { "Accept-Language": locale },
  });
}