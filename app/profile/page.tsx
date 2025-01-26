"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Camera, PiggyBank, History, TrendingUp, Mail, User } from "lucide-react"

// This would come from your backend/auth system in a real app
const userProfile = {
  name: "John Doe",
  email: "john.doe@example.com",
  role: "Premium Member",
  joinDate: "January 2024",
  stats: {
    optimizations: 12,
    activeInvestments: 3,
    totalInvested: "£25,000",
    averageReturn: "5.8%"
  }
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="mx-auto max-w-4xl w-full px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold mb-8">Profile</h1>
      
      <div className="space-y-6">
        {/* Profile Overview Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="" alt={userProfile.name} />
                  <AvatarFallback className="text-lg">
                    {userProfile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <h2 className="text-xl font-semibold">{userProfile.name}</h2>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{userProfile.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{userProfile.role}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Investment Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium">Total Optimizations</h3>
              </div>
              <p className="text-2xl font-bold mt-2">{userProfile.stats.optimizations}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <PiggyBank className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium">Active Investments</h3>
              </div>
              <p className="text-2xl font-bold mt-2">{userProfile.stats.activeInvestments}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium">Total Invested</h3>
              </div>
              <p className="text-2xl font-bold mt-2">{userProfile.stats.totalInvested}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium">Average Return</h3>
              </div>
              <p className="text-2xl font-bold mt-2">{userProfile.stats.averageReturn}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 