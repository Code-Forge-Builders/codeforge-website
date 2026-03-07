import VisitMetricsChart from "./_components/VisitMetricsChart"
import { getVisitsByRange, PeriodEnum } from "./services/getVisitsByRange"

export default async function Dashboard() {
  const visitPoints = await getVisitsByRange({
    period: PeriodEnum.DAY,
  })

  return <div className="flex flex-col gap-4">
    <h1 className="text-2xl font-bold">Dashboard</h1>
    <div>
      <VisitMetricsChart initialData={visitPoints} />
    </div>
  </div>
}