"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { PiggyBank, Trash2, Plus, PoundSterling, Clock } from "lucide-react"
import { OptimizationLoader } from "@/components/optimization-loader"
import { FormattedMoneyInput } from "@/components/formatted-money-input"
import { Input } from "@/components/ui/input"

interface SavingsGoal {
  id: string
  amount: string
  duration: string
}

export default function OptimizePage() {
  const router = useRouter()
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([{ id: "1", amount: "", duration: "" }])
  const [isaAllowance, setIsaAllowance] = useState("")
  const [yearlyIncome, setYearlyIncome] = useState("")

  const currentInvestments = {
    savingsAccounts: 15000,
    isaSavings: 8000,
    gilts: 5000,
  }

  const addSavingsGoal = () => {
    setSavingsGoals([...savingsGoals, { id: Date.now().toString(), amount: "", duration: "" }])
  }

  const removeSavingsGoal = (id: string) => {
    if (savingsGoals.length > 1) {
      setSavingsGoals(savingsGoals.filter((goal) => goal.id !== id))
    }
  }

  const updateSavingsGoal = (id: string, field: keyof SavingsGoal, value: string) => {
    setSavingsGoals(savingsGoals.map((goal) => (goal.id === id ? { ...goal, [field]: value } : goal)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const hasValidGoals = savingsGoals.every((goal) => {
      const amount = Number.parseInt(goal.amount || "0")
      const duration = Number.parseInt(goal.duration || "0")
      return amount > 0 && duration > 0
    })

    if (!hasValidGoals) {
      alert("Please enter valid amounts and durations for all savings goals")
      return
    }

    setIsOptimizing(true)
  }

  const handleOptimizationComplete = () => {
    router.push("/optimize/results")
  }

  const remainingIsaAllowance = 20000 - Number.parseInt(isaAllowance || "0")
  const isaAllowancePercentage = (Number.parseInt(isaAllowance || "0") / 20000) * 100

  return (
    <>
      <div className="container max-w-3xl py-10">
        <Card>
          <CardHeader>
            <CardTitle>Investment Optimization</CardTitle>
            <CardDescription>Let us help you find the optimal investment strategy</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Current Investments Summary */}
            <div className="grid gap-6 mb-6">
              <h3 className="font-semibold">Current Investment Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground">Savings Accounts</div>
                    <div className="text-2xl font-bold">£{currentInvestments.savingsAccounts.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Including ISA: £{currentInvestments.isaSavings.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground">Gilts</div>
                    <div className="text-2xl font-bold">£{currentInvestments.gilts.toLocaleString()}</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Separator className="my-6" />

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ISA Allowance Progress */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>ISA Allowance Usage</Label>
                  <span className="text-sm text-muted-foreground">
                    £{Number.parseInt(isaAllowance || "0").toLocaleString()} / £20,000
                  </span>
                </div>
                <Progress value={isaAllowancePercentage} className="h-2" />
                <p className="text-sm text-muted-foreground">Remaining: £{remainingIsaAllowance.toLocaleString()}</p>
              </div>

              {/* ISA and Income Information */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="isa-used">ISA Allowance Used</Label>
                  <FormattedMoneyInput
                    id="isa-used"
                    value={isaAllowance}
                    onChange={(value) => {
                      const numericValue = Math.min(20000, Math.max(0, Number.parseInt(value || "0")))
                      setIsaAllowance(numericValue.toString())
                    }}
                    icon={<PiggyBank className="h-4 w-4" />}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearly-income">Yearly Non-Savings Income</Label>
                  <FormattedMoneyInput
                    id="yearly-income"
                    value={yearlyIncome}
                    onChange={setYearlyIncome}
                    icon={<PoundSterling className="h-4 w-4" />}
                  />
                </div>
              </div>

              <Separator />

              {/* Savings Goals */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Savings Goals</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addSavingsGoal}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Goal
                  </Button>
                </div>

                <div className="space-y-4">
                  {savingsGoals.map((goal) => (
                    <Card key={goal.id}>
                      <CardContent className="pt-6">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor={`amount-${goal.id}`}>Amount to Save</Label>
                            <FormattedMoneyInput
                              id={`amount-${goal.id}`}
                              value={goal.amount}
                              onChange={(value) => updateSavingsGoal(goal.id, "amount", value)}
                              icon={<PoundSterling className="h-4 w-4" />}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`duration-${goal.id}`}>Lock-away Period (months)</Label>
                            <div className="relative">
                              <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                id={`duration-${goal.id}`}
                                type="number"
                                placeholder="12"
                                className="pl-9"
                                value={goal.duration}
                                onChange={(e) => updateSavingsGoal(goal.id, "duration", e.target.value)}
                                min={1}
                              />
                            </div>
                          </div>
                        </div>

                        {savingsGoals.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="mt-4 text-destructive"
                            onClick={() => removeSavingsGoal(goal.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove Goal
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full">
                Find Optimal Investment Strategy
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {isOptimizing && <OptimizationLoader onComplete={handleOptimizationComplete} />}
    </>
  )
}

