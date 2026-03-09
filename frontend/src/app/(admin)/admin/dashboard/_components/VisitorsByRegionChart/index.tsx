"use client"

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts"
import { VisitorsByRegionDto } from "../../getVisitorsByRegion"
import { useVisitorsByRegion } from "./useVisitorsByRegion"

interface VisitorsByRegionChartProps {
  initialData: VisitorsByRegionDto[]
}

const COLORS = [
  "#6366F1",
  "#EC4899",
  "#10B981",
  "#F59E0B",
  "#3B82F6",
  "#EF4444",
  "#8B5CF6",
  "#14B8A6",
  "#F97316",
  "#22C55E",
]

export default function VisitorsByRegionChart({ initialData }: VisitorsByRegionChartProps) {
  const { visitorsByRegion } = useVisitorsByRegion(initialData)

  const chartData = visitorsByRegion.map((item) => {
    const labelParts = [item.country || "Unknown", item.region || "Unknown", item.city || "Unknown"]
    return {
      name: labelParts.join(" / "),
      value: item.unique_visitors,
    }
  })

  return (
    <div className="w-full h-full">
      <h2 className="text-xl font-bold mb-2">Visitors by region</h2>
      {chartData.length === 0 ? (
        <p className="text-sm text-gray-500">No data available for the selected period.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300} className="my-4">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

