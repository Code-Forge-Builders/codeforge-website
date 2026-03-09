import VisitMetricsChart from "./_components/VisitMetricsChart"
import { BucketEnum, getVisitsByRange, IGetVisitsByRangePayload, IGetVisitsByRangeResponse, PeriodEnum } from "./services/getVisitsByRange"
import Card from "./_components/Card"
import FiltersSelector from "./_components/VisitMetricsChart/FiltersSelector"
import { getTotalMetrics, TotalMetricsDto } from "./getTotalMetrics"
import { getVisitorsByRegion, VisitorsByRegionDto } from "./getVisitorsByRegion"
import VisitorsByRegionChart from "./_components/VisitorsByRegionChart"

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

  let totalMetrics: TotalMetricsDto[];

  try {
    totalMetrics = await getTotalMetrics(payload)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    totalMetrics = [
      {
        value: 0,
        change: 0,
        label: "Total Visits",
        is_percentage: false,
        is_integer: true,
      },
      {
        value: 0,
        change: 0,
        label: "Total Unique Visitors",
        is_percentage: false,
        is_integer: true,
      },
      {
        value: 0,
        change: 0,
        label: "Total Leads",
        is_percentage: false,
        is_integer: true,
      },
      {
        value: 0,
        change: 0,
        label: "Total Conversion Rate",
        is_percentage: true,
        is_integer: false,
      },
    ]
  }

  let visitorsByRegion: VisitorsByRegionDto[] = []

  try {
    visitorsByRegion = await getVisitorsByRegion(payload)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    visitorsByRegion = []
  }

  const formatValue = (metric: TotalMetricsDto) => {
    const hasFloatPart = metric.value % 1 !== 0
    if (metric.is_integer) {
      return metric.value.toFixed(0)
    }
    else if (metric.is_percentage) {
      if (hasFloatPart) {
        return metric.value.toFixed(2) + "%"
      }
      else {
        return metric.value.toFixed(0) + "%"
      }
    }
    else {
      if (hasFloatPart) {
        return metric.value.toFixed(2)
      }
      else {
        return metric.value.toFixed(0)
      }
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
      {totalMetrics.map((metric) => (
        <Card key={metric.label}>
          <h2 className="text-xl font-bold">{metric.label}</h2>
          <h1 className="text-3xl font-bold">
            {formatValue(metric)}
          </h1>
        </Card>
      ))}
    </div>
    <div className="flex flex-row gap-4">
      <Card className="flex-2">
        <VisitMetricsChart initialData={visitPoints} payload={payload} />
      </Card>
      <Card className="flex-1">
        <VisitorsByRegionChart initialData={visitorsByRegion} />
      </Card>
    </div>

  </div>
}