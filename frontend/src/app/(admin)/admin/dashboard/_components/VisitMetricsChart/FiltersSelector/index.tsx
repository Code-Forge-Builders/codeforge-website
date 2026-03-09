'use client'
import { FormEvent, useCallback, useEffect, useRef, useState } from "react"
import { PeriodEnum } from "../../../services/getVisitsByRange"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import Input from "@/app/(admin)/_components/Input"
import { FaCheck } from "react-icons/fa"

interface IFiltersSelectorProps {
  period: PeriodEnum
}

const OPTIONS = Object.values(PeriodEnum).map((option) => ({
  label: option,
  value: option,
}))

const DEFAULT_DATE = new Date().toISOString().split("T")[0]

export default function FiltersSelector({ period }: IFiltersSelectorProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [selectedOption, setSelectedOption] = useState<PeriodEnum>(period)

  const startDateRef = useRef<HTMLInputElement>(null)
  const endDateRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setSelectedOption(period)
  }, [period])

  const handleSetPeriod = useCallback((option: PeriodEnum) => {
    if (option !== PeriodEnum.CUSTOM) {
      setSelectedOption(option)
      const params = new URLSearchParams()
      if (params.get("period") !== option) {
        params.set("period", option)
        router.push(`${pathname}?${params.toString()}`)
      }
    }
    else {
      setSelectedOption(PeriodEnum.CUSTOM)
    }
  }, [pathname, router, setSelectedOption])

  const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const startDate = startDateRef.current?.value
    const endDate = endDateRef.current?.value
    if (startDate && endDate) {
      const params = new URLSearchParams(searchParams.toString())
      const from = new Date(startDate + "T00:00:00Z")
      const to = new Date(endDate + "T23:59:59Z")
      params.set("period", PeriodEnum.CUSTOM)
      params.set("startDate", from.toISOString())
      params.set("endDate", to.toISOString())
      router.push(`${pathname}?${params.toString()}`)
    }
  }, [pathname, router, searchParams])

  return <div className="flex flex-col gap-2 items-end">
    <div className="flex flex-row gap-2">
      {OPTIONS.map((option) => (
        <button key={option.value} onClick={() => handleSetPeriod(option.value)} className={`px-2 py-1 rounded-full cursor-pointer border border-gray-900 ${option.value === selectedOption ? "bg-gray-900 text-white" : "text-gray-900"}`}>
          {option.label}
        </button>
      ))}
    </div>
    {selectedOption === PeriodEnum.CUSTOM && (
      <form onSubmit={handleSubmit} className="flex flex-row gap-2">
        <Input ref={startDateRef} label="Start Date" id="start-date" type="date" defaultValue={DEFAULT_DATE} onChange={(event) => {
          if (endDateRef.current) {
            endDateRef.current.setAttribute("min", event.target.value)
          }
        }} max={DEFAULT_DATE} />
        <Input ref={endDateRef} label="End Date" id="end-date" type="date" defaultValue={DEFAULT_DATE} onChange={(event) => {
          if (startDateRef.current) {
            startDateRef.current.setAttribute("max", event.target.value)
          }
        }} min={DEFAULT_DATE} />
        <div className="flex flex-col justify-end">
          <button className="flex flex-row items-center gap-2 p-3 rounded-sm cursor-pointer border border-gray-900 bg-gray-900 text-white" type="submit"><FaCheck /></button>
        </div>
      </form>
    )}
  </div>
}