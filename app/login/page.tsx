"use client"

import { useContext, useState, useEffect } from "react"
import { UserContext } from "@/lib/UserContext"
import { useRouter } from "next/navigation"
import { magic } from "@/lib/magic"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Login() {
  const [user, setUser] = useContext(UserContext)
  const [email, setEmail] = useState("")
  const router = useRouter()

  useEffect(() => {
    user?.issuer && router.push('/')
  }, [user])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const didToken = await magic.auth.loginWithMagicLink({
        email,
      })

      // First validate the token
      const authRes = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${didToken}`,
        },
      })

      if (authRes.ok) {
        // Then create/update user data
        const userRes = await fetch('/api/user', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${didToken}`,
          },
        })

        if (userRes.ok) {
          const userData = await userRes.json()
          setUser({ ...userData.user, loading: false })
          router.push('/')
        }
      }
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to Quantify</CardTitle>
          <CardDescription>Enter your email to sign in or create an account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Send Magic Link
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 