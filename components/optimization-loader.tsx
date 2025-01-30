"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { TrendingUp, Calculator, LineChart, Binary, ArrowRight } from "lucide-react"
import { OptimizationSurface } from "@/components/optimization-surface"

// Generate a large set of realistic investment options
const generateInvestmentOptions = () => {
  const categories = ["ISA", "Bond", "Savings", "Fixed Rate", "Notice Account"]
  const providers = ["Barclays", "HSBC", "Nationwide", "Santander", "Halifax", "Virgin", "Marcus", "Atom", "Paragon"]
  const options = []

  for (let i = 0; i < 85; i++) {
    const baseRate = 3 + Math.random() * 4 // 3% to 7%
    const provider = providers[Math.floor(Math.random() * providers.length)]
    const category = categories[Math.floor(Math.random() * categories.length)]

    options.push({
      name: `${provider} ${category}`,
      rate: Number(baseRate.toFixed(2)),
    })
  }

  return options.sort((a, b) => a.rate - b.rate)
}

const investmentOptions = generateInvestmentOptions()

interface OptimizationLoaderProps {
  onComplete: () => void
}

export function OptimizationLoader({ onComplete }: OptimizationLoaderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [bestOption, setBestOption] = useState({
    rate: 4.0,
    returns: 200,
    irr: 4.2,
  })
  const [isUpdating, setIsUpdating] = useState(false)
  const [investmentsConsidered, setInvestmentsConsidered] = useState(0)
  const [spinPosition, setSpinPosition] = useState(0)

  const updateBestOption = useCallback((updateCount: number) => {
    setIsUpdating(true)
    const improvement = Math.max(0.1, 1 - updateCount / 12) // Smaller improvements as we progress
    setBestOption((prev) => ({
      rate: prev.rate + Math.random() * 0.3 * improvement,
      returns: prev.returns + Math.random() * 25 * improvement,
      irr: prev.irr + Math.random() * 0.2 * improvement,
    }))
    setTimeout(() => setIsUpdating(false), 300)
  }, [])

  useEffect(() => {
    // Continuous spinning animation
    const spinInterval = setInterval(() => {
      setSpinPosition((prev) => (prev + 1) % investmentOptions.length)
      setInvestmentsConsidered((prev) => Math.min(investmentOptions.length, prev + 1))
    }, 80)

    // Update progress and best option with decreasing frequency
    let updateCount = 0
    const maxUpdates = 12
    const updateInterval = setInterval(
      () => {
        updateCount++
        setProgress(updateCount * (100 / maxUpdates))

        if (updateCount <= maxUpdates) {
          updateBestOption(updateCount)
          if (updateCount === maxUpdates) {
            setTimeout(onComplete, 1000)
          }
        }
      },
      1000 + updateCount * 500,
    ) // Increased delay between updates

    return () => {
      clearInterval(spinInterval)
      clearInterval(updateInterval)
    }
  }, [onComplete, updateBestOption])

  // Calculate visible options with proper wrapping
  const visibleOptions = useMemo(() => {
    const totalVisible = 7 // Odd number for symmetry
    const halfVisible = Math.floor(totalVisible / 2)
    const options = []

    for (let i = -halfVisible; i <= halfVisible; i++) {
      const wrappedIndex = (spinPosition + i + investmentOptions.length) % investmentOptions.length
      options.push({
        ...investmentOptions[wrappedIndex],
        position: i,
      })
    }

    return options
  }, [spinPosition])

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card
          className={cn(
            "w-full max-w-[600px] p-6 space-y-6 transition-colors duration-500",
            isUpdating && "bg-green-100 dark:bg-green-900",
          )}
        >
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Optimizing Investment Strategy</h2>
            <p className="text-muted-foreground flex items-center justify-center gap-2">
              <Binary className="h-4 w-4" />
              Analyzing {investmentOptions.length} investment products
            </p>
          </div>

          {/* Spinning Wheel Display */}
          <div className="relative h-[280px] overflow-hidden rounded-lg border bg-muted/50">
            {typeof window !== 'undefined' && <OptimizationSurface irr={bestOption.irr} progress={progress} />}
          </div>

          {/* Optimization Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-1">
                <Calculator className="h-4 w-4" />
                Optimization Progress
              </span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Investments Considered */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-1">
                <ArrowRight className="h-4 w-4" />
                Investments Considered
              </span>
              <span>
                {investmentsConsidered} / {investmentOptions.length}
              </span>
            </div>
            <Progress value={(investmentsConsidered / investmentOptions.length) * 100} className="h-2" />
          </div>

          {/* Best option found summary */}
          <AnimatePresence mode="wait">
            <motion.div
              key={bestOption.rate}
              className="space-y-2 p-4 rounded-lg bg-muted"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-2">
                <LineChart className="h-4 w-4" />
                <h3 className="font-semibold">Best Solution Found</h3>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Rate</div>
                  <div className="font-bold">{bestOption.rate.toFixed(2)}%</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Returns</div>
                  <div className="font-bold">£{bestOption.returns.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">IRR</div>
                  <div className="font-bold">{bestOption.irr.toFixed(2)}%</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </Card>
      </div>
    </div>
  )
}

