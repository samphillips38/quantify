"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HelpCircle, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface ComparisonMetric {
  label: string
  current: number
  optimized: number
  tooltip: string
}

const metrics: ComparisonMetric[] = [
  {
    label: "Total Returns",
    current: 1102.5,
    optimized: 1450.75,
    tooltip: "Expected returns over the investment period",
  },
  {
    label: "Effective Rate",
    current: 3.6,
    optimized: 5.87,
    tooltip: "Annual percentage yield after tax",
  },
  {
    label: "Tax Efficiency",
    current: 220.5,
    optimized: 0,
    tooltip: "Amount paid in tax",
  },
  {
    label: "Risk Score",
    current: 3.2,
    optimized: 3.4,
    tooltip: "Risk rating from 1 (lowest) to 5 (highest)",
  },
]

export function InvestmentComparison() {
  const formatValue = (value: number, isPercentage = false, isCurrency = true) => {
    if (isPercentage) return `${value.toFixed(1)}%`
    if (isCurrency) return `£${value.toFixed(2)}`
    return value.toFixed(1)
  }

  const calculateDifference = (current: number, optimized: number, isPercentage = false) => {
    const difference = optimized - current
    const percentageChange = ((optimized - current) / current) * 100

    return {
      value: isPercentage ? `${difference.toFixed(1)}%` : `£${difference.toFixed(2)}`,
      percentage: `${percentageChange.toFixed(1)}%`,
      isPositive: difference > 0,
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Investment Comparison
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>Compare your current investments with our optimized recommendation</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border">
          <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 border-b">
            <div className="font-medium">Metric</div>
            <div className="text-right font-medium">Current</div>
            <div className="text-right font-medium">Optimized</div>
          </div>
          <div className="divide-y">
            {metrics.map((metric) => {
              const isPercentage = metric.label.includes("Rate") || metric.label.includes("Score")
              const isCurrency = !isPercentage
              const difference = calculateDifference(metric.current, metric.optimized, isPercentage)

              return (
                <div key={metric.label} className="p-4">
                  <div className="grid grid-cols-3 gap-4 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{metric.label}</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>{metric.tooltip}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="text-right">{formatValue(metric.current, isPercentage, isCurrency)}</div>
                    <div className="text-right font-medium text-primary">
                      {formatValue(metric.optimized, isPercentage, isCurrency)}
                    </div>
                  </div>
                  <div className="flex justify-end items-center gap-2">
                    <div
                      className={cn(
                        "flex items-center gap-1 text-sm",
                        difference.isPositive ? "text-green-600" : "text-red-600",
                      )}
                    >
                      {difference.isPositive ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      <span>{difference.percentage} change</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

