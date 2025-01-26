"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cell, Pie, PieChart, ResponsiveContainer, Legend } from "recharts"
import { cn } from "@/lib/utils"

const data = [
  {
    name: "Cash ISAs",
    value: 10000,
    color: "hsl(var(--chart-1))",
  },
  {
    name: "Fixed Rate Savings",
    value: 5000,
    color: "hsl(var(--chart-2))",
  },
  {
    name: "Variable Rate Savings",
    value: 9500,
    color: "hsl(var(--chart-3))",
  },
  {
    name: "Gilts",
    value: 5000,
    color: "hsl(var(--chart-4))",
  },
]

const renderLegend = (props: any) => {
  const { payload } = props

  return (
    <div className="flex flex-wrap justify-center gap-2 text-xs sm:text-sm mt-4 px-2">
      {payload.map((entry: any, index: number) => (
        <div key={`legend-${index}`} className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-sm shrink-0" style={{ backgroundColor: entry.color }} />
          <span className="truncate">{entry.value}</span>
          <span className="font-medium shrink-0">£{data[index].value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}

export function InvestmentPieChart() {
  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <CardHeader>
        <CardTitle>Investment Distribution</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="w-full" style={{ height: "350px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 0, right: 0, bottom: 40, left: 0 }}>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={50}
                paddingAngle={2}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend content={renderLegend} verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

