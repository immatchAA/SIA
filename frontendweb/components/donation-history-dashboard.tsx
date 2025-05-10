"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, Award, AlertCircle, Plus, BarChart3 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

type Donation = {
  id: number
  donationDate: string
  location: string
  bloodType: string
  units: number
  donationType: "Whole Blood" | "Plasma" | "Platelets" | "Double Red Cells"
  notes?: string
}

export function DonationHistoryDashboard() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [donations, setDonations] = useState<Donation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [nextEligibleDate, setNextEligibleDate] = useState<string | null>(null)
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalUnits: 0,
    livesImpacted: 0,
    streakCount: 0,
    lastDonation: null as string | null,
  })

  useEffect(() => {
    const fetchDonationHistory = async () => {
      if (!user?.email) return

      setIsLoading(true)
      try {
        const response = await fetch(`/api/donations/history/${encodeURIComponent(user.email)}`)

        if (response.ok) {
          const data = await response.json()
          setDonations(data.donations)
          setNextEligibleDate(data.nextEligibleDate)
          setStats(data.stats)
        } else {
          throw new Error("Failed to fetch donation history")
        }
      } catch (error) {
        console.error("Error fetching donation history:", error)

        // Use mock data as fallback
        const mockDonations = [
          {
            id: 1,
            donationDate: "2025-04-15",
            location: "Central Blood Bank",
            bloodType: user?.bloodType ?? "A+",
            units: 1,
            donationType: "Whole Blood" as const,
            notes: "Regular donation",
          },
          {
            id: 2,
            donationDate: "2025-02-10",
            location: "Community Drive at City Hall",
            bloodType: user?.bloodType ?? "A+",
            units: 1,
            donationType: "Whole Blood" as const,
          },
          {
            id: 3,
            donationDate: "2024-11-05",
            location: "University Medical Center",
            bloodType: user?.bloodType || "A+",
            units: 1,
            donationType: "Plasma" as const,
            notes: "Special request for plasma",
          },
        ]

        setDonations(mockDonations)

        // Calculate next eligible date (56 days after last donation for whole blood)
        const lastDonation = new Date("2025-04-15")
        const eligibleDate = new Date(lastDonation)
        eligibleDate.setDate(eligibleDate.getDate() + 56)
        setNextEligibleDate(eligibleDate.toISOString().split("T")[0])

        // Set mock stats
        setStats({
          totalDonations: 3,
          totalUnits: 3,
          livesImpacted: 9,
          streakCount: 2,
          lastDonation: "2025-04-15",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDonationHistory()
  }, [user, toast])

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date)
    } catch (e) {
      return dateString
    }
  }

  const getDaysUntilEligible = () => {
    if (!nextEligibleDate) return null

    const today = new Date()
    const eligible = new Date(nextEligibleDate)

    // If already eligible
    if (today >= eligible) return 0

    const diffTime = Math.abs(eligible.getTime() - today.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysUntilEligible = getDaysUntilEligible()
  const isEligible = daysUntilEligible === 0

  const getEligibilityStatus = () => {
    if (isEligible) {
      return {
        status: "Eligible",
        message: "You are eligible to donate blood now!",
        color: "bg-green-500",
      }
    } else if (daysUntilEligible) {
      return {
        status: "Waiting Period",
        message: `You will be eligible to donate in ${daysUntilEligible} days`,
        color: "bg-amber-500",
      }
    } else {
      return {
        status: "Unknown",
        message: "We couldn't determine your eligibility status",
        color: "bg-gray-500",
      }
    }
  }

  const eligibility = getEligibilityStatus()

  const getAchievements = () => {
    const achievements = []

    if (stats.totalDonations >= 1) {
      achievements.push({
        name: "First Time Donor",
        description: "Completed your first blood donation",
        icon: <Award className="h-8 w-8 text-red-600" />,
        unlocked: true,
      })
    }

    if (stats.totalDonations >= 3) {
      achievements.push({
        name: "Regular Donor",
        description: "Completed 3 or more donations",
        icon: <Award className="h-8 w-8 text-red-600" />,
        unlocked: true,
      })
    }

    if (stats.totalDonations >= 5) {
      achievements.push({
        name: "Bronze Donor",
        description: "Completed 5 or more donations",
        icon: <Award className="h-8 w-8 text-amber-600" />,
        unlocked: stats.totalDonations >= 5,
      })
    }

    if (stats.totalDonations >= 10) {
      achievements.push({
        name: "Silver Donor",
        description: "Completed 10 or more donations",
        icon: <Award className="h-8 w-8 text-gray-400" />,
        unlocked: stats.totalDonations >= 10,
      })
    }

    if (stats.totalDonations >= 25) {
      achievements.push({
        name: "Gold Donor",
        description: "Completed 25 or more donations",
        icon: <Award className="h-8 w-8 text-yellow-500" />,
        unlocked: stats.totalDonations >= 25,
      })
    }

    if (stats.streakCount >= 3) {
      achievements.push({
        name: "Consistent Donor",
        description: "Donated regularly for 3 consecutive periods",
        icon: <Award className="h-8 w-8 text-blue-600" />,
        unlocked: stats.streakCount >= 3,
      })
    }

    return achievements
  }

  const achievements = getAchievements()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Donation Status</CardTitle>
            <CardDescription>Your current eligibility</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge className={eligibility.color}>{eligibility.status}</Badge>
              <p className="text-sm">{eligibility.message}</p>

              {!isEligible && daysUntilEligible && (
                <div className="pt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Waiting period</span>
                    <span>{daysUntilEligible} days left</span>
                  </div>
                  <Progress value={100 - (daysUntilEligible / 56) * 100} className="h-2" />
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            {isEligible && (
              <Button asChild className="w-full bg-red-600 hover:bg-red-700">
                <Link href="/dashboard/donation-drives">Find a Donation Drive</Link>
              </Button>
            )}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Donation Stats</CardTitle>
            <CardDescription>Your contribution impact</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-2xl font-bold">{stats.totalDonations}</p>
                <p className="text-xs text-gray-500">Total Donations</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold">{stats.totalUnits}</p>
                <p className="text-xs text-gray-500">Units Donated</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold">{stats.livesImpacted}</p>
                <p className="text-xs text-gray-500">Lives Impacted</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold">{stats.streakCount}</p>
                <p className="text-xs text-gray-500">Donation Streak</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/donation-history/stats">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Detailed Stats
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Last Donation</CardTitle>
            <CardDescription>Your most recent contribution</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.lastDonation ? (
              <div className="space-y-2">
                <p className="font-medium">{formatDate(stats.lastDonation)}</p>
                <p className="text-sm text-gray-500">
                  {donations.length > 0 ? donations[0].location : "Location not available"}
                </p>
                <p className="text-sm text-gray-500">
                  {donations.length > 0
                    ? `${donations[0].units} unit(s) of ${donations[0].donationType}`
                    : "Details not available"}
                </p>
              </div>
            ) : (
              <div className="py-2">
                <p className="text-sm text-gray-500">No donations recorded yet</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/donation-history/add">
                <Plus className="h-4 w-4 mr-2" />
                Add Donation
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="history">
        <TabsList>
          <TabsTrigger value="history">Donation History</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Donation History</CardTitle>
              <CardDescription>Record of all your blood donations</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <p>Loading donation history...</p>
                </div>
              ) : donations.length > 0 ? (
                <div className="space-y-4">
                  {donations.map((donation) => (
                    <Card key={donation.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                              <span className="font-medium">{formatDate(donation.donationDate)}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                              <span>{donation.location}</span>
                            </div>
                          </div>

                          <div className="mt-4 md:mt-0 space-y-2">
                            <Badge className="bg-red-600">{donation.bloodType}</Badge>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-gray-500" />
                              <span>
                                {donation.units} unit(s) of {donation.donationType}
                              </span>
                            </div>
                          </div>
                        </div>

                        {donation.notes && (
                          <div className="mt-4 pt-4 border-t">
                            <p className="text-sm text-gray-600">{donation.notes}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Donations Yet</h3>
                  <p className="text-gray-500 mb-4">You haven't recorded any blood donations yet.</p>
                  <Button asChild className="bg-red-600 hover:bg-red-700">
                    <Link href="/dashboard/donation-history/add">Record Your First Donation</Link>
                  </Button>
                </div>
              )}
            </CardContent>
            {donations.length > 0 && (
              <CardFooter className="flex justify-end">
                <Button asChild className="bg-red-600 hover:bg-red-700">
                  <Link href="/dashboard/donation-history/add">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Donation
                  </Link>
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Achievements</CardTitle>
              <CardDescription>Badges earned through your donation journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {achievements.map((achievement, index) => (
                  <Card key={index} className={`overflow-hidden ${!achievement.unlocked ? "opacity-50" : ""}`}>
                    <CardContent className="p-6 text-center">
                      <div className="flex justify-center mb-4">{achievement.icon}</div>
                      <h3 className="font-bold mb-1">{achievement.name}</h3>
                      <p className="text-sm text-gray-500">{achievement.description}</p>
                      {!achievement.unlocked && (
                        <Badge variant="outline" className="mt-3">
                          Locked
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
