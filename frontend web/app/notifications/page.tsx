"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Calendar, Droplet, Heart, MapPin } from "lucide-react"
import { DashboardNav } from "@/components/dashboard-nav"
import { DashboardHeader } from "@/components/dashboard-header"

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="flex">
        <DashboardNav />
        <main className="flex-1 p-6">
          <div className="flex flex-col space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Notifications</h1>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  Mark All as Read
                </Button>
                <Button variant="outline" size="sm">
                  Settings
                </Button>
              </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <div className="flex justify-start mb-6">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="unread">Unread</TabsTrigger>
                  <TabsTrigger value="requests">Blood Requests</TabsTrigger>
                  <TabsTrigger value="drives">Donation Drives</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="all" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Notification Center</CardTitle>
                    <CardDescription>You have 7 unread notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Emergency Blood Request */}
                    <div className="flex items-start space-x-4 p-3 bg-red-50 rounded-lg border border-red-100">
                      <div className="bg-red-100 p-2 rounded-full">
                        <Droplet className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium">Emergency Blood Request</h3>
                            <Badge className="bg-red-600">Critical</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">10 minutes ago</p>
                        </div>
                        <p className="text-sm mt-1">
                          Urgent O- blood needed at City Hospital for emergency surgery. You are 2.5 miles away.
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Button size="sm" className="bg-red-600 hover:bg-red-700">
                            Respond Now
                          </Button>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Donation Drive Reminder */}
                    <div className="flex items-start space-x-4 p-3 rounded-lg border">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">Donation Drive Tomorrow</h3>
                          <p className="text-xs text-muted-foreground">2 hours ago</p>
                        </div>
                        <p className="text-sm mt-1">
                          Reminder: You're signed up for the Community Center Blood Drive tomorrow at 10:00 AM.
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Button size="sm" variant="outline">
                            View Event
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 border-red-200">
                            Cancel RSVP
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Donation Eligibility */}
                    <div className="flex items-start space-x-4 p-3 rounded-lg border">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Heart className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">You're Eligible to Donate Again</h3>
                          <p className="text-xs text-muted-foreground">Yesterday</p>
                        </div>
                        <p className="text-sm mt-1">
                          It's been 8 weeks since your last donation. You're now eligible to donate whole blood again!
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Button size="sm" variant="outline">
                            Find Donation Center
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Thank You Note */}
                    <div className="flex items-start space-x-4 p-3 rounded-lg border">
                      <Avatar>
                        <AvatarFallback className="bg-purple-100 text-purple-600">MR</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">Thank You Note from Maria Rodriguez</h3>
                          <p className="text-xs text-muted-foreground">2 days ago</p>
                        </div>
                        <p className="text-sm mt-1">
                          "Your donation helped me during my cancer treatment. I can't thank you enough for your
                          generosity."
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Button size="sm" variant="outline">
                            Reply
                          </Button>
                          <Button size="sm" variant="ghost">
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Badge Earned */}
                    <div className="flex items-start space-x-4 p-3 rounded-lg border">
                      <div className="bg-amber-100 p-2 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-amber-600"
                        >
                          <circle cx="12" cy="8" r="7"></circle>
                          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">New Badge Earned: Lifesaver</h3>
                          <p className="text-xs text-muted-foreground">3 days ago</p>
                        </div>
                        <p className="text-sm mt-1">
                          Congratulations! You've earned the "Lifesaver" badge for donating blood 10 times. Keep up the
                          great work!
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Button size="sm" variant="outline">
                            View Badges
                          </Button>
                          <Button size="sm" variant="ghost">
                            Share
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Nearby Request */}
                    <div className="flex items-start space-x-4 p-3 rounded-lg border">
                      <div className="bg-red-100 p-2 rounded-full">
                        <MapPin className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">New Blood Request Near You</h3>
                          <p className="text-xs text-muted-foreground">4 days ago</p>
                        </div>
                        <p className="text-sm mt-1">
                          A patient at Memorial Hospital (3.2 miles away) needs O+ blood for a scheduled procedure.
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Button size="sm" variant="outline">
                            View Request
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* System Update */}
                    <div className="flex items-start space-x-4 p-3 rounded-lg border">
                      <div className="bg-gray-100 p-2 rounded-full">
                        <Bell className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">RedWeb System Update</h3>
                          <p className="text-xs text-muted-foreground">1 week ago</p>
                        </div>
                        <p className="text-sm mt-1">
                          We've updated our platform with new features to better connect donors and patients. Check out
                          what's new!
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Button size="sm" variant="outline">
                            Learn More
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Load More
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="unread" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Unread Notifications</CardTitle>
                    <CardDescription>You have 7 unread notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Similar content as "all" tab but only unread notifications */}
                    <div className="flex items-start space-x-4 p-3 bg-red-50 rounded-lg border border-red-100">
                      <div className="bg-red-100 p-2 rounded-full">
                        <Droplet className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium">Emergency Blood Request</h3>
                            <Badge className="bg-red-600">Critical</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">10 minutes ago</p>
                        </div>
                        <p className="text-sm mt-1">
                          Urgent O- blood needed at City Hospital for emergency surgery. You are 2.5 miles away.
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Button size="sm" className="bg-red-600 hover:bg-red-700">
                            Respond Now
                          </Button>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Donation Drive Reminder */}
                    <div className="flex items-start space-x-4 p-3 rounded-lg border">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">Donation Drive Tomorrow</h3>
                          <p className="text-xs text-muted-foreground">2 hours ago</p>
                        </div>
                        <p className="text-sm mt-1">
                          Reminder: You're signed up for the Community Center Blood Drive tomorrow at 10:00 AM.
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Button size="sm" variant="outline">
                            View Event
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 border-red-200">
                            Cancel RSVP
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="requests" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Blood Request Notifications</CardTitle>
                    <CardDescription>Blood requests that match your profile</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Emergency Blood Request */}
                    <div className="flex items-start space-x-4 p-3 bg-red-50 rounded-lg border border-red-100">
                      <div className="bg-red-100 p-2 rounded-full">
                        <Droplet className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium">Emergency Blood Request</h3>
                            <Badge className="bg-red-600">Critical</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">10 minutes ago</p>
                        </div>
                        <p className="text-sm mt-1">
                          Urgent O- blood needed at City Hospital for emergency surgery. You are 2.5 miles away.
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Button size="sm" className="bg-red-600 hover:bg-red-700">
                            Respond Now
                          </Button>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Nearby Request */}
                    <div className="flex items-start space-x-4 p-3 rounded-lg border">
                      <div className="bg-red-100 p-2 rounded-full">
                        <MapPin className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">New Blood Request Near You</h3>
                          <p className="text-xs text-muted-foreground">4 days ago</p>
                        </div>
                        <p className="text-sm mt-1">
                          A patient at Memorial Hospital (3.2 miles away) needs O+ blood for a scheduled procedure.
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Button size="sm" variant="outline">
                            View Request
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="drives" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Donation Drive Notifications</CardTitle>
                    <CardDescription>Updates about blood donation events</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Donation Drive Reminder */}
                    <div className="flex items-start space-x-4 p-3 rounded-lg border">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">Donation Drive Tomorrow</h3>
                          <p className="text-xs text-muted-foreground">2 hours ago</p>
                        </div>
                        <p className="text-sm mt-1">
                          Reminder: You're signed up for the Community Center Blood Drive tomorrow at 10:00 AM.
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Button size="sm" variant="outline">
                            View Event
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 border-red-200">
                            Cancel RSVP
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* New Drive */}
                    <div className="flex items-start space-x-4 p-3 rounded-lg border">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">New Blood Drive Announced</h3>
                          <p className="text-xs text-muted-foreground">3 days ago</p>
                        </div>
                        <p className="text-sm mt-1">
                          University Campus is hosting a blood drive on May 24, 2025. They're especially looking for O
                          and B type donors.
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Button size="sm" variant="outline">
                            RSVP
                          </Button>
                          <Button size="sm" variant="ghost">
                            View Details
                          </Button>
                        </div>
                      </div>
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

