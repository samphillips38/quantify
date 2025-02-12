import { createContext, Dispatch, SetStateAction } from 'react'

export interface Investment {
  name: string
  amount: number
  rate: number
  provider: string
}

export interface DashboardData {
  totalInvested: number
  isaAllowanceRemaining: number
  totalReturns: number
  returnRate: number
  yearOverYearChange: number
  investments: Investment[]
}

export const defaultDashboardData: DashboardData = {
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

type DashboardContextType = [DashboardData | undefined, Dispatch<SetStateAction<DashboardData | undefined>>]

export const DashboardContext = createContext<DashboardContextType | undefined>(undefined) 