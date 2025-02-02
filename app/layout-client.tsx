"use client"

import { useState, useEffect } from "react"
import { UserContext, User } from "@/lib/UserContext"
import { useRouter } from "next/navigation"
import { magic } from "@/lib/magic"
import { MainNav } from "@/components/main-nav"

export function LayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User>()
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      try {
        setUser({ loading: true })
        const isLoggedIn = await magic.user.isLoggedIn()
        
        if (isLoggedIn) {
          const didToken = await magic.user.getIdToken()
          // Get user data from your API
          const res = await fetch('/api/user', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${didToken}`,
            },
          })
          
          if (res.ok) {
            const userData = await res.json()
            setUser({ ...userData, loading: false })
          } else {
            throw new Error('Failed to get user data')
          }
        } else {
          if (window.location.pathname !== '/login') {
            router.push('/login')
          }
          setUser({ loading: false })
        }
      } catch (error) {
        console.error('Error loading user:', error)
        setUser({ loading: false })
        router.push('/login')
      }
    }

    checkUser()
  }, [])

  return (
    <UserContext.Provider value={[user, setUser]}>
      <div className="relative flex min-h-screen flex-col">
        {user && !user.loading && <MainNav />}
        <main className="flex-1">{children}</main>
      </div>
    </UserContext.Provider>
  )
} 