"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { PeriodEnum, IGetVisitsByRangePayload } from "../../services/getVisitsByRange"
import { VisitorsByRegionDto, getVisitorsByRegion } from "../../getVisitorsByRegion"

export function useVisitorsByRegion(initialData: VisitorsByRegionDto[]) {
  const [visitorsByRegion, setVisitorsByRegion] = useState<VisitorsByRegionDto[]>(initialData)

  const searchParams = useSearchParams()
  const period = searchParams.get("period")
  const startDate = searchParams.get("startDate")
  const endDate = searchParams.get("endDate")

  useEffect(() => {
    let payload: IGetVisitsByRangePayload

    if (period === PeriodEnum.CUSTOM) {
      payload = {
        start_date: startDate ?? undefined,
        end_date: endDate ?? undefined,
      }
    } else {
      payload = {
        period: (period as PeriodEnum) ?? PeriodEnum.DAY,
      }
    }

    getVisitorsByRegion(payload).then((data) => {
      setVisitorsByRegion(data)
    })
  }, [period, startDate, endDate])

  return {
    visitorsByRegion,
  }
}

