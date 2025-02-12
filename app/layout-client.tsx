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
        
        if (!magic) {
          throw new Error('Magic SDK not initialized')
        }

        const isLoggedIn = await magic.user.isLoggedIn()
        
        if (!isLoggedIn) {
          if (window.location.pathname !== '/login') {
            router.push('/login')
          }
          setUser({ loading: false })
          return
        }

        const token = await magic.user.getIdToken()
        const response = await fetch('http://127.0.0.1:5000/api/users/auth', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error(await response.text())
        }

        const data = await response.json()
        setUser({ ...data.user, loading: false })
      } catch (error) {
        console.error('Auth error:', error)
        setUser({ loading: false })
        router.push('/login')
      }
    }

    checkUser()
  }, [router])

  return (
    <UserContext.Provider value={[user, setUser]}>
      <div className="relative flex min-h-screen flex-col">
        {user && !user.loading && <MainNav />}
        <main className="flex-1">{children}</main>
      </div>
    </UserContext.Provider>
  )
} 