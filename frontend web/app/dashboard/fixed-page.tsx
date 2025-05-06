"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Bell, Calendar, Clock, Droplet, Heart, MapPin, Medal, User, Loader2 } from "lucide-react"
import { DashboardNav } from "@/components/dashboard-nav"
import { DashboardHeader } from "@/components/dashboard-header"
import { userAPI, getCurrentUser } from "@/lib/api"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const [userType, setUserType] = useState("donor")
  const [donationCount, setDonationCount] = useState<number>(0) // Always start at zero
  const [donationLoading, setDonationLoading] = useState<boolean>(false) // Skip loading state
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [userData, setUserData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true)
      
      try {
        // Check for user in localStorage
        const user = getCurrentUser()
        console.log('Retrieved user from localStorage:', user)
        
        if (!user) {
          console.log('No authenticated user found, redirecting to login')
          // Use window.location for a clean redirect that breaks the loop
          window.location.href = '/login'
          return
        }
        
        // Add default role if missing
        const userWithDefaults = {
          ...user,
          role: user.role || 'DONOR',
          name: user.name || 'User',
          isNewUser: true // Force new user state
        }
        
        // Set user data from localStorage with defaults
        setUserData(userWithDefaults)
        setUserType(userWithDefaults.role.toLowerCase() === 'patient' ? 'patient' : 'donor')
        console.log('User authenticated with defaults:', userWithDefaults)
      } catch (error) {
        console.error('Authentication error:', error)
        setError('Authentication error: ' + (error instanceof Error ? error.message : String(error)))
      } finally {
        setIsLoading(false)
      }
    }
    
    checkAuth()
  }, [])
  
  // Each donation saves 3 lives (as before)
  const livesSaved = donationCount * 3;

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-red-600 mb-4" />
        <h2 className="text-xl font-medium">Loading your dashboard...</h2>
      </div>
    )
  }
  
  // Show error state if there's an error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-medium mb-2 text-red-600">Error Loading Dashboard</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <div className="mb-4 p-3 bg-gray-100 rounded text-left overflow-auto max-h-60">
            <pre className="text-xs">{JSON.stringify({userData, donationCount}, null, 2)}</pre>
          </div>
          <Button 
            onClick={() => window.location.href = '/login'}
            className="bg-red-600 hover:bg-red-700"
          >
            Go to Login
          </Button>
        </div>
      </div>
    )
  }
  
  // Ensure we have a user before rendering the dashboard
  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium mb-2">Not authenticated</h2>
          <p className="text-gray-500 mb-4">Please log in to continue</p>
          <Button 
            onClick={() => window.location.href = '/login'}
            className="bg-red-600 hover:bg-red-700"
          >
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  // Basic dashboard with simple error handling
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="flex">
        <DashboardNav />
        <main className="flex-1 p-6">
          <div className="flex flex-col space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Dashboard</h1>
            </div>

            <Tabs defaultValue="donor" className="w-full mt-6" onValueChange={setUserType}>
              <div className="flex justify-end mb-6">
                <TabsList className="grid w-[400px] grid-cols-2">
                  <TabsTrigger value="donor">Donor View</TabsTrigger>
                  <TabsTrigger value="patient">Patient View</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="donor" className="space-y-6">
                {/* Donor Stats */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardContent className="p-6 flex flex-row items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Donations</p>
                        <h3 className="text-3xl font-bold mt-1">0</h3>
                        <p className="text-xs text-red-600 mt-1">Ready for your first donation!</p>
                      </div>
                      <div className="bg-red-100 p-3 rounded-full">
                        <Droplet className="h-6 w-6 text-red-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 flex flex-row items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Lives Saved</p>
                        <h3 className="text-3xl font-bold mt-1">0</h3>
                      </div>
                      <div className="bg-red-100 p-3 rounded-full">
                        <Heart className="h-6 w-6 text-red-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 flex flex-row items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Next Eligible</p>
                        <h3 className="text-xl font-bold mt-1">No donations yet</h3>
                      </div>
                      <div className="bg-red-100 p-3 rounded-full">
                        <Calendar className="h-6 w-6 text-red-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 flex flex-row items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Donor Rank</p>
                        <h3 className="text-3xl font-bold mt-1">--</h3>
                        <p className="text-xs text-blue-600 mt-1">Ready to start your journey!</p>
                      </div>
                      <div className="p-3 rounded-full bg-blue-100">
                        <Medal className="h-6 w-6 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Donor Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle>Donation Progress</CardTitle>
                    <CardDescription>Track your donation journey and achievements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">Platinum Donor Status</p>
                          <p className="text-sm text-muted-foreground">0/20 donations</p>
                        </div>
                        <Progress value={0} className="h-2 bg-red-100" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">Emergency Responder Badge</p>
                          <p className="text-sm text-muted-foreground">0/5 emergency donations</p>
                        </div>
                        <Progress value={0} className="h-2 bg-red-100" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">Consistent Donor</p>
                          <p className="text-sm text-muted-foreground">0/12 months</p>
                        </div>
                        <Progress value={0} className="h-2 bg-red-100" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Rest of dashboard content omitted for brevity */}
                {/* This would include Nearby Requests, Upcoming Drives, etc. */}
              </TabsContent>

              <TabsContent value="patient" className="space-y-6">
                {/* Patient view content omitted for brevity */}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
