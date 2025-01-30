import { createContext } from 'react'

export interface User {
  email?: string
  issuer?: string
  publicAddress?: string
  loading?: boolean
  investments?: Array<{
    name: string
    amount: number
    rate: number
    provider: string
  }>
  totalInvested?: number
  isaAllowanceRemaining?: number
  totalReturns?: number
  returnRate?: number
  yearOverYearChange?: number
}

export const UserContext = createContext<[User | undefined, (user: User) => void]>([undefined, () => {}]) 