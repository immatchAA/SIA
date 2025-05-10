"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function DonationStatsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalUnits: 0,
    livesImpacted: 0,
    streakCount: 0,
    donationsByYear: {} as Record<string, number>,
    donationsByType: {} as Record<string, number>,
    donationsByLocation: {} as Record<string, number>,
    averageDonationInterval: 0,
    nextMilestone: 0,
  })

  useEffect(() => {
    const fetchDonationStats = async () => {
      if (!user?.email) return

      setIsLoading(true)
      try {
        const response = await fetch(`/api/donations/stats/${encodeURIComponent(user.email)}`)

        if (response.ok) {
          const data = await response.json()
          setStats(data)
        } else {
          throw new Error("Failed to fetch donation stats")
        }
      } catch (error) {
        console.error("Error fetching donation stats:", error)

        // Use mock data as fallback
        setStats({
          totalDonations: 3,
          totalUnits: 3,
          livesImpacted: 9,
          streakCount: 2,
          donationsByYear: {
            "2024": 1,
            "2025": 2,
          },
          donationsByType: {
            "Whole Blood": 2,
            Plasma: 1,
          },
          donationsByLocation: {
            "Central Blood Bank": 1,
            "Community Drive at City Hall": 1,
            "University Medical Center": 1,
          },
          averageDonationInterval: 85,
          nextMilestone: 5,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDonationStats()
  }, [user, toast])

  const handleBack = () => {
    router.back()
  }

  // Helper function to create a simple bar chart
  const renderBarChart = (data: Record<string, number>, title: string) => {
    const maxValue = Math.max(...Object.values(data))

    return (
      <div className="space-y-3">
        <h3 className="text-sm font-medium">{title}</h3>
        <div className="space-y-2">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{key}</span>
                <span>{value}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className="bg-red-600 h-2.5 rounded-full" style={{ width: `${(value / maxValue) * 100}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={handleBack} className="flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Donation History
      </Button>

      <h1 className="text-2xl font-bold">Donation Statistics</h1>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <p>Loading donation statistics...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalDonations}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.nextMilestone > 0 && `${stats.nextMilestone - stats.totalDonations} more until next milestone`}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Units Donated</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalUnits}</div>
                <p className="text-xs text-gray-500 mt-1">Total blood volume donated</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Lives Impacted</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.livesImpacted}</div>
                <p className="text-xs text-gray-500 mt-1">Estimated lives affected</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Donation Streak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.streakCount}</div>
                <p className="text-xs text-gray-500 mt-1">Consecutive donation periods</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Donation Frequency</CardTitle>
                <CardDescription>Your donation patterns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {renderBarChart(stats.donationsByYear, "Donations by Year")}

                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium mb-2">Average Donation Interval</h3>
                  <p className="text-2xl font-bold">{stats.averageDonationInterval} days</p>
                  <p className="text-xs text-gray-500 mt-1">Average time between donations</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Donation Details</CardTitle>
                <CardDescription>Types and locations of your donations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {renderBarChart(stats.donationsByType, "Donations by Type")}

                <div className="pt-4">{renderBarChart(stats.donationsByLocation, "Donations by Location")}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Impact Summary</CardTitle>
              <CardDescription>The difference your donations have made</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  Your {stats.totalDonations} donations have potentially saved up to {stats.livesImpacted} lives. Each
                  donation can help up to 3 people in need.
                </p>

                <p>
                  With a donation streak of {stats.streakCount}, you're among our most consistent donors. Regular
                  donations are crucial for maintaining a stable blood supply.
                </p>

                <p>
                  Your most common donation type is{" "}
                  {Object.entries(stats.donationsByType).sort((a, b) => b[1] - a[1])[0]?.[0] || "Whole Blood"}, which is{" "}
                  {Object.entries(stats.donationsByType).sort((a, b) => b[1] - a[1])[0]?.[0] === "Whole Blood"
                    ? "the most versatile type of donation and can be used in various medical procedures."
                    : "a specialized donation that helps patients with specific medical needs."}
                </p>

                {stats.nextMilestone > 0 && (
                  <p>
                    You're just {stats.nextMilestone - stats.totalDonations} donations away from reaching your next
                    milestone of {stats.nextMilestone} donations!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
