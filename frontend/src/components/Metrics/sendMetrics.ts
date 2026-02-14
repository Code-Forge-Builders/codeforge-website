export async function sendMetrics(locale: string) {
  const response = await fetch("http://localhost:8080/api/metrics", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": locale,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to send metrics");
  }
}