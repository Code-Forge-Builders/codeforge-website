import VisitMetricsChart from "./_components/VisitMetricsChart"
import { BucketEnum, getVisitsByRange, IGetVisitsByRangePayload, IGetVisitsByRangeResponse, PeriodEnum } from "./services/getVisitsByRange"
import Card from "./_components/Card"
import FiltersSelector from "./_components/VisitMetricsChart/FiltersSelector"

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
  } catch (_) {
    visitPoints = {
      bucket: BucketEnum.DAY,
      points: [],
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
        <h2 className="text-xl font-bold">Total Visits</h2>
        <h1 className="text-3xl font-bold">2354</h1>
      </Card>
      <Card>
        <h2 className="text-xl font-bold">Total Unique Visitors</h2>
        <h1 className="text-3xl font-bold">28</h1>
      </Card>
      <Card>
        <h2 className="text-xl font-bold">Total Leads</h2>
        <h1 className="text-3xl font-bold">12</h1>
      </Card>
      <Card>
        <h2 className="text-xl font-bold">Total Conversion Rate</h2>
        <h1 className="text-3xl font-bold">42.86%</h1>
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