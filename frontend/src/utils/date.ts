export function isoToDateInput(iso: string | null): string {
  if (!iso) return ""
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  return d.toISOString().split("T")[0]
}
  
export function dateInputToStartIso(dateStr: string): string {
  return new Date(`${dateStr}T00:00:00.000Z`).toISOString()
}
  
export function dateInputToEndIso(dateStr: string): string {
  return new Date(`${dateStr}T23:59:59.999Z`).toISOString()
}