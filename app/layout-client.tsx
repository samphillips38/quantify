"use client"

import { useState, useEffect } from "react"
import { UserContext, User } from "@/lib/UserContext"
import { useRouter } from "next/navigation"
import { magic } from "@/lib/magic"
import { MainNav } from "@/components/main-nav"
import { LoadingSpinner } from "@/components/loading-spinner"
import { DashboardProvider } from "@/components/dashboard-provider"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000'

export function LayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User>()
  const [loadingState, setLoadingState] = useState<string>("Initializing...")
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      try {
        setUser({ loading: true })
        
        setLoadingState("Checking Magic SDK initialization...")
        if (!magic) {
          throw new Error('Magic SDK not initialized')
        }

        setLoadingState("Checking authentication status...")
        const isLoggedIn = await magic.user.isLoggedIn()
        
        if (!isLoggedIn) {
          if (window.location.pathname !== '/login') {
            setLoadingState("Redirecting to login...")
            router.push('/login')
          }
          setUser({ loading: false })
          return
        }

        setLoadingState("Getting authentication token...")
        const token = await magic.user.getIdToken()
        
        setLoadingState("Validating user session...")
        const response = await fetch(`${API_URL}/api/users/auth`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error(await response.text())
        }

        setLoadingState("Loading user data...")
        const data = await response.json()
        setUser({ ...data.user, loading: false })
        setLoadingState("")
      } catch (error) {
        console.error('Auth error:', error)
        setUser({ loading: false })
        setLoadingState("Redirecting to login due to error...")
        router.push('/login')
      }
    }

    checkUser()
  }, [router])

  if (loadingState) {
    return <LoadingSpinner message={loadingState} />
  }

  return (
    <UserContext.Provider value={[user, setUser]}>
      <DashboardProvider>
        <div className="relative flex min-h-screen flex-col">
          {user && !user.loading && <MainNav />}
          <main className="flex-1">{children}</main>
        </div>
      </DashboardProvider>
    </UserContext.Provider>
  )
} 