import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, BadgePercent, Wallet } from "lucide-react"
import Link from "next/link"
import { InvestmentComparison } from "@/components/investment-comparison"
import { Badge } from "@/components/ui/badge"

export default function ResultsPage() {
  return (
    <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Your Optimal Investment Plan</h1>
        <p className="text-muted-foreground">
          Based on your requirements, here are our recommended investment products
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Investment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Total Investment</div>
                <div className="text-2xl font-bold">£5,000</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Expected Return</div>
                <div className="text-2xl font-bold text-green-600">£290</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Average Rate</div>
                <div className="text-2xl font-bold">5.87%</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Time Period</div>
                <div className="text-2xl font-bold">1 Year</div>
              </div>
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link href="/optimize">Try Different Amount</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add the comparison component */}
      <div className="mb-6 md:mb-8">
        <InvestmentComparison />
      </div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6 md:mb-8">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-sm">Recommended</div>
          <CardHeader>
            <CardTitle>Fixed Rate ISA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <BadgePercent className="h-4 w-4" />
                <span className="font-bold">5.75% APR</span>
              </div>
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                <span>£3,000 (60%)</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-4">
                <Badge variant="outline" className="border-blue-500 text-blue-500">
                  Cash ISA
                </Badge>
                <Badge variant="outline" className="border-green-500 text-green-500">
                  Fixed Rate
                </Badge>
                <Badge variant="outline" className="border-purple-500 text-purple-500">
                  Tax Free
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                A tax-free fixed rate ISA offering competitive returns with Nationwide Building Society
              </p>
              <Button asChild className="w-full">
                <Link href="https://www.nationwide.co.uk" target="_blank">
                  Open Account <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>1-Year Fixed Bond</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <BadgePercent className="h-4 w-4" />
                <span className="font-bold">6.05% APR</span>
              </div>
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                <span>£2,000 (40%)</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-4">
                <Badge variant="outline" className="border-gray-500 text-gray-500">
                  Savings Account
                </Badge>
                <Badge variant="outline" className="border-green-500 text-green-500">
                  Fixed Rate
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                A fixed-term savings account with Atom Bank offering higher returns for locking away your money
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="https://www.atombank.co.uk" target="_blank">
                  Open Account <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

