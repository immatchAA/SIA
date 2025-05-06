"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, Clock, Droplet, MapPin, ThumbsUp } from "lucide-react"
import { DashboardNav } from "@/components/dashboard-nav"
import { DashboardHeader } from "@/components/dashboard-header"

import { useEffect, useState } from "react"
import { userAPI } from "@/lib/api"

export default function HistoryPage() {
  const [donations, setDonations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDonations = async () => {
      setLoading(true)
      try {
        // Replace with your actual API endpoint if different
        const data = await userAPI.getDonationHistory?.() || []
        setDonations(data)
      } catch (error) {
        setDonations([])
      } finally {
        setLoading(false)
      }
    }
    fetchDonations()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="flex">
        <DashboardNav />
        <main className="flex-1 p-6">
          <div className="flex flex-col space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Donation History</h1>
            </div>

            <Tabs defaultValue="donations" className="w-full mt-6">
              <div className="flex justify-end mb-6">
                <TabsList className="grid w-[400px] grid-cols-2">
                  <TabsTrigger value="donations">Donations</TabsTrigger>
                  <TabsTrigger value="requests">Requests</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="donations" className="space-y-6">
                {/* Donation Stats */}
                <div className="grid gap-6 md:grid-cols-4">
                  <Card>
                    <CardContent className="p-6 flex flex-row items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Donations</p>
                        <h3 className="text-3xl font-bold mt-1">
                          {loading ? '--' : donations.length}
                        </h3>
                      </div>
                      <div className="bg-red-100 p-3 rounded-full">
                        <Droplet className="h-6 w-6 text-red-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 flex flex-row items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">This Year</p>
                        <h3 className="text-3xl font-bold mt-1">
                          {loading ? '--' : donations.filter((d) => {
                            if (!d.date) return false;
                            const year = new Date(d.date).getFullYear();
                            return year === new Date().getFullYear();
                          }).length}
                        </h3>
                      </div>
                      <div className="bg-red-100 p-3 rounded-full">
                        <Calendar className="h-6 w-6 text-red-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 flex flex-row items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Emergency</p>
                        <h3 className="text-3xl font-bold mt-1">
  {loading ? '--' : donations.filter((d) => d.emergency === true).length}
</h3>
                      </div>
                      <div className="bg-red-100 p-3 rounded-full">
                        <Clock className="h-6 w-6 text-red-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 flex flex-row items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Lives Saved</p>
                        <h3 className="text-3xl font-bold mt-1">
                          {loading ? '--' : donations.length === 0 ? 0 : donations.length * 3}
                        </h3>
                      </div>
                      <div className="bg-red-100 p-3 rounded-full">
                        <ThumbsUp className="h-6 w-6 text-red-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Donation History */}
                <Card>
                  <CardHeader>
                    <CardTitle>Your Donation History</CardTitle>
                    <CardDescription>Record of all your blood donations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {[...Array(5)].map((_, i) => {
                        const date = new Date()
                        date.setMonth(date.getMonth() - i * 2)
                        const formattedDate = date.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })

                        return (
                          <div
                            key={i}
                            className="flex flex-col md:flex-row md:items-center justify-between border-b pb-6 last:border-0 last:pb-0"
                          >
                            <div className="flex items-start space-x-4">
                              <div className="bg-red-100 text-red-600 p-3 rounded-lg">
                                <Droplet className="h-6 w-6" />
                              </div>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <h3 className="font-medium">Whole Blood Donation</h3>
                                  <Badge
                                    variant={i === 0 ? "default" : "outline"}
                                    className={
                                      i === 0 ? "bg-red-600 hover:bg-red-700" : "bg-red-50 text-red-600 hover:bg-red-50"
                                    }
                                  >
                                    {i === 0 ? "Emergency" : "Regular"}
                                  </Badge>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center text-sm text-muted-foreground space-y-1 sm:space-y-0 sm:space-x-4 mt-1">
                                  <div className="flex items-center">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    <span>{formattedDate}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    <span>{i % 2 === 0 ? "City Hospital Blood Center" : "Community Blood Drive"}</span>
                                  </div>
                                </div>
                                {i === 0 && (
                                  <div className="mt-2 text-sm">
                                    <span className="text-red-600 font-medium">Recipient:</span> Emergency trauma
                                    patient
                                  </div>
                                )}
                                {i === 1 && (
                                  <div className="mt-2 text-sm">
                                    <span className="text-red-600 font-medium">Recipient:</span> Maria Rodriguez (Cancer
                                    treatment)
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 mt-4 md:mt-0">
                              <Button variant="outline" size="sm">
                                View Certificate
                              </Button>
                              {i < 2 && (
                                <Button variant="outline" size="sm" className="flex items-center">
                                  <ThumbsUp className="h-3 w-3 mr-1" />
                                  Thank You Note
                                </Button>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="requests" className="space-y-6">
                {/* Request Stats */}
                <div className="grid gap-6 md:grid-cols-4">
                  <Card>
                    <CardContent className="p-6 flex flex-row items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
                        <h3 className="text-3xl font-bold mt-1">8</h3>
                      </div>
                      <div className="bg-red-100 p-3 rounded-full">
                        <Droplet className="h-6 w-6 text-red-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 flex flex-row items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Fulfilled</p>
                        <h3 className="text-3xl font-bold mt-1">7</h3>
                      </div>
                      <div className="bg-red-100 p-3 rounded-full">
                        <ThumbsUp className="h-6 w-6 text-red-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 flex flex-row items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Emergency</p>
                        <h3 className="text-3xl font-bold mt-1">
  {loading ? '--' : donations.filter((d) => d.emergency === true).length}
</h3>
                      </div>
                      <div className="bg-red-100 p-3 rounded-full">
                        <Clock className="h-6 w-6 text-red-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 flex flex-row items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Avg. Response Time</p>
                        <h3 className="text-xl font-bold mt-1">4.2 hours</h3>
                      </div>
                      <div className="bg-red-100 p-3 rounded-full">
                        <Clock className="h-6 w-6 text-red-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Request History */}
                <Card>
                  <CardHeader>
                    <CardTitle>Your Request History</CardTitle>
                    <CardDescription>Record of all your blood requests</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {[...Array(4)].map((_, i) => {
                        const date = new Date()
                        date.setMonth(date.getMonth() - i)
                        const formattedDate = date.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })

                        const status = i === 0 ? "Active" : i === 3 ? "Expired" : "Fulfilled"

                        return (
                          <div key={i} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-2">
                                <Badge
                                  className={`
                                  ${
                                    status === "Active"
                                      ? "bg-blue-600 hover:bg-blue-700"
                                      : status === "Fulfilled"
                                        ? "bg-green-600 hover:bg-green-700"
                                        : "bg-gray-600 hover:bg-gray-700"
                                  }
                                `}
                                >
                                  {status}
                                </Badge>
                                <Badge variant="outline" className="bg-red-50 text-red-600 hover:bg-red-50">
                                  {i === 0 || i === 2 ? "O-" : "B+"}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className={`
                                  ${
                                    i === 0
                                      ? "bg-red-50 text-red-600"
                                      : i === 1
                                        ? "bg-amber-50 text-amber-600"
                                        : "bg-blue-50 text-blue-600"
                                  }
                                `}
                                >
                                  {i === 0 ? "Critical" : i === 1 ? "Moderate" : "Non-urgent"}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">Posted on {formattedDate}</p>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm">
                                  {i === 0
                                    ? "City Hospital, Emergency Ward"
                                    : i === 1
                                      ? "Memorial Medical Center, Room 305"
                                      : i === 2
                                        ? "University Hospital, Oncology Dept"
                                        : "Community Health Center"}
                                </p>
                              </div>
                              <p className="text-sm mt-2">
                                {i === 0
                                  ? "Emergency surgery scheduled. Need 2 units of O- blood urgently."
                                  : i === 1
                                    ? "Scheduled transfusion for anemia treatment. Need 1 unit of B+ blood."
                                    : i === 2
                                      ? "Cancer treatment support. Need 2 units of O- blood."
                                      : "Regular checkup transfusion. Need 1 unit of B+ blood."}
                              </p>
                            </div>

                            {status === "Fulfilled" && (
                              <div className="mt-4 pt-4 border-t">
                                <h4 className="text-sm font-medium mb-2">Donors who responded:</h4>
                                <div className="flex flex-wrap gap-2">
                                  {[...Array(i === 1 ? 1 : 2)].map((_, j) => (
                                    <div
                                      key={j}
                                      className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1"
                                    >
                                      <Avatar className="h-6 w-6">
                                        <AvatarFallback className="text-xs bg-red-100 text-red-600">
                                          {j === 0 ? "JS" : "LM"}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="text-xs font-medium">
                                        {j === 0 ? "James Smith" : "Lisa Miller"}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {status === "Active" && (
                              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                                <p className="text-sm text-muted-foreground">3 donors have responded so far</p>
                                <Button size="sm" className="bg-red-600 hover:bg-red-700">
                                  View Responses
                                </Button>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}

