"use client"
import { useState } from "react"
import { BucketEnum, IGetVisitsByRangeResponse } from "../../services/getVisitsByRange"
import { Line, LineChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts"

export interface IVisitMetricsChartProps {
  initialData: IGetVisitsByRangeResponse
}

export default function VisitMetricsChart({ initialData }: IVisitMetricsChartProps) {
  const [data, setData] = useState<IGetVisitsByRangeResponse>(initialData)

  const chartData = data.points.map((point) => {
    let formattedAccessAt = "";

    if (data.bucket === BucketEnum.HOUR) {
      formattedAccessAt = new Date(point.access_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    } else if (data.bucket === BucketEnum.DAY) {
      formattedAccessAt = new Date(point.access_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    } else if (data.bucket === BucketEnum.WEEK) {
      formattedAccessAt = new Date(point.access_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    }
    return {
      access_at: formattedAccessAt,
      visit_count: point.visit_count,
    }
  })

  return <div className="w-full h-full">
    <h2 className="text-lg font-bold">Visits by Period</h2>
    <div className="w-full mt-2 p-6 bg-white rounded-lg">
      <ResponsiveContainer width="100%" height={300} className="my-4 p-4">
        <LineChart data={chartData}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e5e7eb"
          />
          <Line type="monotone" dataKey="visit_count" stroke="#8884d8" />
          <XAxis
            dataKey="access_at"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            interval={0}
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
      </ResponsiveContainer>
    </div>
  </div>
}