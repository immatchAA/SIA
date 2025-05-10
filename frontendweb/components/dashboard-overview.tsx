"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Droplet, Calendar, AlertTriangle, ArrowRight } from "lucide-react"
import { useAuth } from "@/context/auth-context"

export function DashboardOverview() {
  const { user } = useAuth()
  const [bloodRequests, setBloodRequests] = useState([])
  const [donationDrives, setDonationDrives] = useState([])
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch data for the dashboard
    const fetchDashboardData = async () => {
      try {
        setIsLoading(false)
       
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      }
    }

    fetchDashboardData()
  }, [user])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button asChild className="bg-red-600 hover:bg-red-700">
          <Link href="/dashboard/blood-requests/create">Create Blood Request</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Blood Requests</CardTitle>
              <CardDescription>Your active requests</CardDescription>
            </div>
            <Droplet className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-gray-500 mt-1">No active blood requests</p>
            <Button asChild variant="link" className="p-0 h-auto mt-4 text-red-600">
              <Link href="/dashboard/blood-requests" className="flex items-center">
                View all requests
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Donation Drives</CardTitle>
              <CardDescription>Upcoming drives</CardDescription>
            </div>
            <Calendar className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-gray-500 mt-1">No upcoming donation drives</p>
            <Button asChild variant="link" className="p-0 h-auto mt-4 text-red-600">
              <Link href="/dashboard/donation-drives" className="flex items-center">
                View all drives
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Emergency Requests</CardTitle>
              <CardDescription>Urgent blood needs</CardDescription>
            </div>
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-gray-500 mt-1">No emergency requests</p>
            <Button asChild variant="link" className="p-0 h-auto mt-4 text-red-600">
              <Link href="/dashboard/emergency" className="flex items-center">
                View emergencies
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Blood Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-6">
                <p>Loading...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center py-6">
                  <p className="text-gray-500">No recent blood requests</p>
                  <Button asChild className="mt-4 bg-red-600 hover:bg-red-700">
                    <Link href="/dashboard/blood-requests/create">Create Request</Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Donation Drives</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-6">
                <p>Loading...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center py-6">
                  <p className="text-gray-500">No upcoming donation drives</p>
                  <Button asChild className="mt-4 bg-red-600 hover:bg-red-700">
                    <Link href="/dashboard/donation-drives/create">Create Drive</Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
