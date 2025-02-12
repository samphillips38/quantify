"use client"

import { useContext } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CircleIcon as CirclePoundIcon, PiggyBankIcon, TrendingUpIcon } from "lucide-react"
import { InvestmentPieChart } from "@/components/investment-pie-chart"
import { DashboardContext, defaultDashboardData, Investment } from "@/lib/DashboardContext"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function DashboardPage() {
  const dashboardContext = useContext(DashboardContext)
  const dashboardData = dashboardContext?.[0] ?? defaultDashboardData

  if (!dashboardContext?.[0]) {
    return <LoadingSpinner message="Loading dashboard data..." />
  }

  return (
    <div className="container px-4 py-6 md:py-10 max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Your Investment Overview</h1>

      <div className="grid gap-4 md:grid-cols-3 mb-6 md:mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
            <CirclePoundIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{dashboardData.totalInvested.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.yearOverYearChange >= 0 ? "+" : ""}{dashboardData.yearOverYearChange}% from last year
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ISA Allowance Remaining</CardTitle>
            <PiggyBankIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{dashboardData.isaAllowanceRemaining.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">of £20,000 annual allowance</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{dashboardData.totalReturns.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{dashboardData.returnRate}% return rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="w-full overflow-hidden">
          <InvestmentPieChart investments={dashboardData.investments} />
        </div>
        <Card className="w-full overflow-hidden">
          <CardHeader>
            <CardTitle>Current Investments</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-4">
              {dashboardData.investments.map((investment: Investment) => (
                <div key={investment.name} className="flex items-center justify-between border-b pb-4">
                  <div className="min-w-0 flex-1 pr-4">
                    <div className="font-medium truncate">{investment.name}</div>
                    <div className="text-sm text-muted-foreground truncate">{investment.provider}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-medium">£{investment.amount.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">{investment.rate}% APR</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

