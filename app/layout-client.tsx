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
        
        // Check if Magic is ready
        if (!magic) {
          throw new Error('Magic SDK is not initialized')
        }

        const isLoggedIn = await magic.user.isLoggedIn()
        console.log('[Layout] User logged in:', isLoggedIn)
        
        if (isLoggedIn) {
          try {
            const token = await magic.user.getIdToken()
            console.log('[Layout] Got DID token:', token ? 'present' : 'missing')
            
            const response = await fetch('http://127.0.0.1:5000/api/users/auth', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            })

            if (!response.ok) {
              const text = await response.text()
              console.error('[Layout] API error:', response.status, text)
              throw new Error(`API error: ${text}`)
            }

            const data = await response.json()
            console.log('[Layout] Parsed user data:', data.user)
            setUser({ ...data.user, loading: false })
          } catch (error) {
            console.error('[Layout] Authentication error:', error)
            // If there's an auth error, log out the user
            await magic.user.logout()
            setUser({ loading: false })
            router.push('/login')
          }
        } else {
          if (window.location.pathname !== '/login') {
            router.push('/login')
          }
          setUser({ loading: false })
        }
      } catch (error) {
        console.error('[Layout] Error checking user:', error)
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