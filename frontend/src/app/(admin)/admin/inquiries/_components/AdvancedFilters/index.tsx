'use client'

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { FaSliders } from "react-icons/fa6"
import Input from "@/app/(admin)/_components/Input"
import Modal from "../../../_components/Modal"
import { dateInputToEndIso, dateInputToStartIso, isoToDateInput } from "@/utils/date"

export default function AdvancedFilters() {
  const lastThirtyDays = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  const today = new Date().toISOString().split("T")[0]
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const startDefault = searchParams.get("start_date") || lastThirtyDays
  const endDefault = searchParams.get("end_date") || today

  const [open, setOpen] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const startDateRef = useRef<HTMLInputElement>(null)
  const endDateRef = useRef<HTMLInputElement>(null)

  const appliedCount = useMemo(() => {
    let n = 0
    if (startDefault) n++
    if (endDefault) n++
    return n
  }, [searchParams])

  const handleApply = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const params = new URLSearchParams(searchParams.toString())
      const start = startDateRef.current?.value?.trim() ?? ""
      const end = endDateRef.current?.value?.trim() ?? ""
      if (start) params.set("start_date", dateInputToStartIso(start))
      else params.delete("start_date")
      if (end) params.set("end_date", dateInputToEndIso(end))
      else params.delete("end_date")
      params.delete("page")
      router.push(`${pathname}?${params.toString()}`)
      setOpen(false)
    },
    [pathname, router, searchParams]
  )

  useEffect(() => {
    if (!open) return
    const onPointerDown = (ev: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(ev.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [open])

  const handleClear = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("start_date")
    params.delete("end_date")
    router.push(`${pathname}?${params.toString()}`)
    setOpen(false)
  }, [pathname, router, searchParams])

  return (
    <div ref={containerRef}>
      <button
        type="button"
        className="flex flex-row items-center gap-2 px-4 py-2 rounded-lg border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50 cursor-pointer whitespace-nowrap"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <FaSliders className="shrink-0" aria-hidden />
        <span>Filters</span>
        {appliedCount > 0 ? (
          <span className="min-w-[1.25rem] h-5 px-1.5 inline-flex items-center justify-center rounded-full bg-gray-900 text-white text-xs font-medium">
            {appliedCount}
          </span>
        ) : null}
      </button>
      {open ? (
        <Modal title="Filters" onClose={() => setOpen(false)}>
          <form
            onSubmit={handleApply}
            className="flex flex-col gap-3"
            role="dialog"
            aria-label="Filters"
          >
            <h3 className="text-md font-medium text-zinc-900">Creation date</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                key={`start-${startDefault ?? "none"}`}
                ref={startDateRef}
                label="From"
                id="inquiries-adv-start"
                type="date"
                defaultValue={isoToDateInput(startDefault)}
              />
              <Input
                key={`end-${endDefault ?? "none"}`}
                ref={endDateRef}
                label="To"
                id="inquiries-adv-end"
                type="date"
                defaultValue={isoToDateInput(endDefault)}
              />
            </div>
            <div className="flex flex-row gap-2 justify-end flex-wrap">
              <button
                type="button"
                className="px-3 py-2 rounded-md border border-zinc-300 text-zinc-700 hover:bg-zinc-100 cursor-pointer text-sm"
                onClick={handleClear}
              >
                Clear dates
              </button>
              <button
                type="submit"
                className="px-3 py-2 rounded-md bg-gray-900 text-white hover:bg-zinc-800 cursor-pointer text-sm"
              >
                Apply
              </button>
            </div>
          </form>
        </Modal>
      ) : null}
    </div>
  )
}
