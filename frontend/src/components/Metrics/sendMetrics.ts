import { httpClient } from "@/lib/httpClient";

export async function sendMetrics(locale: string) {
  await httpClient.post("/metrics", {
    headers: { "Accept-Language": locale },
  });
}