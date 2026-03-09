import VisitMetricsChart from "./_components/VisitMetricsChart"
import { BucketEnum, getVisitsByRange, IGetVisitsByRangePayload, IGetVisitsByRangeResponse, PeriodEnum } from "./services/getVisitsByRange"
import Card from "./_components/Card"
import FiltersSelector from "./_components/VisitMetricsChart/FiltersSelector"
import { getTotalMetrics, IGetTotalMetricsResponse } from "./getTotalMetrics"

export default async function Dashboard({ searchParams }: { searchParams: Promise<IGetVisitsByRangePayload> }) {
  const { period, start_date, end_date } = await searchParams
  let payload: IGetVisitsByRangePayload;
  
  if (period === PeriodEnum.CUSTOM) {
    payload = {
      start_date: start_date ?? undefined,
      end_date: end_date ?? undefined,
    }
  }
  else {
    payload = {
      period: period ?? PeriodEnum.DAY,
    }
  }
  let visitPoints: IGetVisitsByRangeResponse;

  try {
    visitPoints = await getVisitsByRange(payload)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    visitPoints = {
      bucket: BucketEnum.DAY,
      points: [],
    }
  }

  let totalMetrics: IGetTotalMetricsResponse;

  try {
    totalMetrics = await getTotalMetrics(payload)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    totalMetrics = {
      total_visits: {
        value: 0,
        change: 0,
        label: "Total Visits",
      },
      total_unique_visitors: {
        value: 0,
        change: 0,
        label: "Total Unique Visitors",
      },
      total_leads: {
        value: 0,
        change: 0,
        label: "Total Leads",
      },
      total_conversion_rate: {
        value: 0,
        change: 0,
        label: "Total Conversion Rate",
      },
    }
  }

  return <div className="flex flex-col gap-4">
    <Card>
      <div className="flex flex-row justify-between gap-2">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <FiltersSelector period={period ?? PeriodEnum.DAY} />
      </div>
    </Card>
    <div className="flex flex-row gap-4">
      <Card>
        <h2 className="text-xl font-bold">{totalMetrics.total_visits.label}</h2>
        <h1 className="text-3xl font-bold">{totalMetrics.total_visits.value}</h1>
      </Card>
      <Card>
        <h2 className="text-xl font-bold">{totalMetrics.total_unique_visitors.label}</h2>
        <h1 className="text-3xl font-bold">{totalMetrics.total_unique_visitors.value}</h1>
      </Card>
      <Card>
        <h2 className="text-xl font-bold">{totalMetrics.total_leads.label}</h2>
        <h1 className="text-3xl font-bold">{totalMetrics.total_leads.value}</h1>
      </Card>
      <Card>
        <h2 className="text-xl font-bold">{totalMetrics.total_conversion_rate.label}</h2>
        <h1 className="text-3xl font-bold">{totalMetrics.total_conversion_rate.value.toFixed(2)}%</h1>
      </Card>
    </div>
    <div className="flex flex-row gap-4">
      <Card className="flex-2">
        <VisitMetricsChart initialData={visitPoints} payload={payload} />
      </Card>
      <Card className="flex-1">
        <h2 className="text-xl font-bold">Visitors by region</h2>
      </Card>
    </div>

  </div>
}