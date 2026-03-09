"use client"
import { useState } from "react"
import { BucketEnum, IGetVisitsByRangePayload, IGetVisitsByRangeResponse } from "../../services/getVisitsByRange"
import { Line, LineChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, BarChart, Bar } from "recharts"
import { useVisits } from "./useVisits"

export interface IVisitMetricsChartProps {
  initialData: IGetVisitsByRangeResponse
  payload: IGetVisitsByRangePayload
}

export enum ChartType {
  LINE = "line",
  BAR = "bar",
}

const LABEL_LENGTH = 60;

export default function VisitMetricsChart({ initialData }: IVisitMetricsChartProps) {
  const [width, setWidth] = useState(1000)
  const [chartType, setChartType] = useState<ChartType>(ChartType.LINE)

  const { visits } = useVisits(initialData)

  const chartData = visits.points.map((point) => {
    let formattedAccessAt = "";

    if (visits.bucket === BucketEnum.HOUR) {
      formattedAccessAt = new Date(point.access_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    } else if (visits.bucket === BucketEnum.DAY) {
      formattedAccessAt = new Date(point.access_at).toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' })
    } else if (visits.bucket === BucketEnum.WEEK) {
      formattedAccessAt = new Date(point.access_at).toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' })
    }
    return {
      access_at: formattedAccessAt,
      visit_count: point.visit_count,
    }
  })
  
  const interval = Math.max(0, Math.floor((chartData.length * LABEL_LENGTH) / width))

  return <div className="w-full h-full">
    <div className="flex flex-row justify-between items-center">
      <h2 className="text-xl font-bold">Visits by Period</h2>
      <select value={chartType} onChange={(event) => setChartType(event.target.value as ChartType)} className="px-2 py-1 rounded-sm cursor-pointer border border-gray-900">
        <option value={ChartType.LINE}>Line</option>
        <option value={ChartType.BAR}>Bar</option>
      </select>
    </div>
    <ResponsiveContainer width="100%" height={300} className="my-4 p-4" onResize={(width) => setWidth(width)}>
      {chartType === ChartType.LINE ? <LineChart data={chartData}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#e5e7eb"
        />
        <Line type="monotone" dataKey="visit_count" name="Visits" stroke="#8884d8" strokeWidth={2} />
        <XAxis
          dataKey="access_at"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#6b7280", fontSize: 12 }}
          interval={interval}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#6b7280", fontSize: 12 }}
          interval={0}
        />
        <Tooltip />
        <Legend />
      </LineChart>
      :
      <BarChart data={chartData}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#e5e7eb"
        />
        <Bar dataKey="visit_count" name="Visits" fill="#8884d8" />
        <XAxis dataKey="access_at" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} interval={interval} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} interval={0} />
        <Tooltip />
        <Legend />
      </BarChart>
      }
    </ResponsiveContainer>
  </div>
}