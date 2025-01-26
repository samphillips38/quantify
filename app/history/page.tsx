"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, TrendingUp } from "lucide-react"

// Sample optimization history data
const optimizationHistory = [
  {
    id: 1,
    date: "2024-01-20",
    amount: 10000,
    duration: "2 years",
    products: [
      { name: "Nationwide Fixed ISA", allocation: 60 },
      { name: "Atom Bank Bond", allocation: 40 },
    ],
    returns: 575,
    rate: 5.75,
    irr: 5.87,
  },
  {
    id: 2,
    date: "2024-01-15",
    amount: 5000,
    duration: "1 year",
    products: [{ name: "Halifax ISA", allocation: 100 }],
    returns: 225,
    rate: 4.5,
    irr: 4.5,
  },
  // Add more history items...
]

export default function HistoryPage() {
  const router = useRouter()
  const [timeFilter, setTimeFilter] = useState("all")

  const filteredHistory = optimizationHistory.filter((item) => {
    if (timeFilter === "all") return true
    const date = new Date(item.date)
    const now = new Date()
    const monthsAgo = (now.getFullYear() - date.getFullYear()) * 12 + now.getMonth() - date.getMonth()
    return monthsAgo <= Number.parseInt(timeFilter)
  })

  return (
    <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      <div className="flex flex-col gap-4 md:gap-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Optimization History</h1>
            <p className="text-muted-foreground">View and analyze your previous investment optimizations</p>
          </div>
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="1">Last Month</SelectItem>
              <SelectItem value="3">Last 3 Months</SelectItem>
              <SelectItem value="6">Last 6 Months</SelectItem>
              <SelectItem value="12">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredHistory.map((item) => (
            <Card
              key={item.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => router.push(`/optimize/results?id=${item.id}`)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                  <Badge>£{item.amount.toLocaleString()}</Badge>
                </div>
                <CardTitle className="text-lg">{item.duration} Investment Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Returns</div>
                      <div className="font-bold">£{item.returns}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Rate</div>
                      <div className="font-bold">{item.rate}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">IRR</div>
                      <div className="font-bold">{item.irr}%</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Allocation</div>
                    <div className="space-y-2">
                      {item.products.map((product, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm truncate">{product.name}</span>
                          <span className="text-sm font-medium">{product.allocation}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

