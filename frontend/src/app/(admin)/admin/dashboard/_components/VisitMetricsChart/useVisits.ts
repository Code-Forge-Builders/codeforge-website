import { useEffect, useState } from "react"
import { getVisitsByRange, IGetVisitsByRangeResponse, PeriodEnum } from "../../services/getVisitsByRange"
import { useSearchParams } from "next/navigation"

export function useVisits(initialData: IGetVisitsByRangeResponse) {
  const [visits, setVisits] = useState<IGetVisitsByRangeResponse>(initialData)

  const searchParams = useSearchParams()
  const period = searchParams.get("period")
  const startDate = searchParams.get("startDate")
  const endDate = searchParams.get("endDate")

  useEffect(() => {
    if (period === PeriodEnum.CUSTOM) {
      getVisitsByRange({
        start_date: startDate ?? undefined,
        end_date: endDate ?? undefined,
      }).then((data) => {
        setVisits(data)
      })
    }
    else {
      getVisitsByRange({
        period: period as PeriodEnum ?? PeriodEnum.DAY,
      }).then((data) => {
        setVisits(data)
      })
    }
  }, [period, startDate, endDate])

  return {
    visits,
  }
}