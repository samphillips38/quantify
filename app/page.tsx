"use client"

import { useContext } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CircleIcon as CirclePoundIcon, PiggyBankIcon, TrendingUpIcon } from "lucide-react"
import { InvestmentPieChart } from "@/components/investment-pie-chart"
import { UserContext } from "@/lib/UserContext"

interface Investment {
  name: string
  amount: number
  rate: number
  provider: string
}

// Fallback data in case API fails
const fallbackData = {
  totalInvested: 24500,
  isaAllowanceRemaining: 15500,
  totalReturns: 2350,
  returnRate: 9.6,
  yearOverYearChange: 20.1,
  investments: [
    { name: "Cash ISA", amount: 10000, rate: 4.5, provider: "Nationwide" },
    { name: "Fixed Rate Bond", amount: 5000, rate: 5.2, provider: "Barclays" },
    { name: "Premium Bonds", amount: 9500, rate: 4.65, provider: "NS&I" },
  ]
}

async function getDashboardData() {
  try {
    // Add timeout to fetch
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      cache: 'no-store'
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return fallbackData
  }
}

export default function DashboardPage() {
  const [user] = useContext(UserContext)

  if (!user || user.loading) {
    return <div>Loading...</div>
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
            <div className="text-2xl font-bold">£{(user.totalInvested ?? 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {(user.yearOverYearChange ?? 0) >= 0 ? "+" : ""}{user.yearOverYearChange ?? 0}% from last year
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ISA Allowance Remaining</CardTitle>
            <PiggyBankIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{(user.isaAllowanceRemaining ?? 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">of £20,000 annual allowance</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{(user.totalReturns ?? 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{user.returnRate ?? 0}% return rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="w-full overflow-hidden">
          <InvestmentPieChart investments={user.investments ?? []} />
        </div>
        <Card className="w-full overflow-hidden">
          <CardHeader>
            <CardTitle>Current Investments</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-4">
              {(user.investments ?? []).map((investment: Investment) => (
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

