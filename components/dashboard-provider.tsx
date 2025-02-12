"use client"

import { useState, useEffect, useContext } from "react"
import { DashboardContext, DashboardData, defaultDashboardData } from "@/lib/DashboardContext"
import { UserContext } from "@/lib/UserContext"
import { magic } from "@/lib/magic"

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [dashboardData, setDashboardData] = useState<DashboardData>()
  const userContext = useContext(UserContext)
  const user = userContext?.[0]

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (dashboardData || !user?.email) return

      try {
        if (!magic) throw new Error("Magic SDK is not initialized")

        const token = await magic.user.getIdToken()
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/${user.email}/dashboard`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          }
        )

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

        const data = await response.json()
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid data structure received from API')
        }

        setDashboardData(data)
      } catch (error) {
        console.error('Error loading dashboard:', error)
        throw error // Let the error propagate to show proper error UI
      }
    }

    fetchDashboardData()
  }, [user, dashboardData])

  return (
    <DashboardContext.Provider value={[dashboardData, setDashboardData]}>
      {children}
    </DashboardContext.Provider>
  )
} 