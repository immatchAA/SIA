"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Droplet, MapPin, Search, Users } from "lucide-react"
import { DashboardNav } from "@/components/dashboard-nav"
import { DashboardHeader } from "@/components/dashboard-header"

export default function DrivesPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const upcomingDrives = [
    {
      id: 1,
      title: "City Hospital Blood Drive",
      organizer: "City Hospital",
      date: "May 10, 2025",
      time: "9:00 AM - 5:00 PM",
      location: "City Hospital, Main Lobby",
      address: "123 Medical Center Blvd, New York, NY",
      distance: "2.5 miles",
      bloodTypesNeeded: ["All types", "O- urgently needed"],
      registered: true,
      attendees: 42,
      description:
        "Join us for our monthly blood drive at City Hospital. All blood types are welcome, but we have an urgent need for O- donors. Refreshments will be provided.",
    },
    {
      id: 2,
      title: "Community Center Donation Event",
      organizer: "Red Cross",
      date: "May 17, 2025",
      time: "10:00 AM - 4:00 PM",
      location: "Downtown Community Center",
      address: "456 Main Street, New York, NY",
      distance: "1.2 miles",
      bloodTypesNeeded: ["All types"],
      registered: false,
      attendees: 28,
      description:
        "The Red Cross is hosting a blood drive at the Downtown Community Center. Walk-ins are welcome, but appointments are preferred. Free parking available.",
    },
    {
      id: 3,
      title: "University Campus Drive",
      organizer: "State University",
      date: "May 24, 2025",
      time: "11:00 AM - 6:00 PM",
      location: "State University, Student Union",
      address: "789 University Ave, New York, NY",
      distance: "3.8 miles",
      bloodTypesNeeded: ["O+", "O-", "B+", "B-"],
      registered: false,
      attendees: 56,
      description:
        "State University is hosting a blood drive for students, faculty, and community members. We're especially in need of O and B type donors. Student volunteers will be on hand to assist.",
    },
    {
      id: 4,
      title: "Corporate Office Blood Drive",
      organizer: "Tech Innovations Inc.",
      date: "June 5, 2025",
      time: "8:00 AM - 2:00 PM",
      location: "Tech Innovations Headquarters",
      address: "101 Innovation Way, New York, NY",
      distance: "4.5 miles",
      bloodTypesNeeded: ["All types"],
      registered: false,
      attendees: 35,
      description:
        "Tech Innovations is opening their doors to the public for a blood drive in partnership with the Blood Center. Appointments are required. Free parking in the visitor garage.",
    },
    {
      id: 5,
      title: "Neighborhood Association Drive",
      organizer: "Westside Neighborhood Association",
      date: "June 12, 2025",
      time: "12:00 PM - 7:00 PM",
      location: "Westside Community Park",
      address: "222 Park Lane, New York, NY",
      distance: "0.8 miles",
      bloodTypesNeeded: ["A+", "A-", "AB+", "AB-"],
      registered: false,
      attendees: 19,
      description:
        "Our neighborhood association is hosting a blood drive in the park pavilion. A and AB blood types are especially needed. Family-friendly event with activities for children while parents donate.",
    },
  ]

  const pastDrives = [
    {
      id: 101,
      title: "Emergency Response Drive",
      organizer: "City Emergency Services",
      date: "April 15, 2025",
      time: "8:00 AM - 8:00 PM",
      location: "City Convention Center",
      address: "555 Convention Way, New York, NY",
      bloodTypesNeeded: ["All types"],
      attended: true,
      attendees: 124,
      description: "Emergency blood drive in response to the recent natural disaster. Thank you to all who donated!",
    },
    {
      id: 102,
      title: "Faith Community Blood Drive",
      organizer: "Interfaith Council",
      date: "April 2, 2025",
      time: "9:00 AM - 3:00 PM",
      location: "Community Church",
      address: "777 Faith Street, New York, NY",
      bloodTypesNeeded: ["All types"],
      attended: false,
      attendees: 45,
      description: "Monthly blood drive organized by the Interfaith Council. Thank you to all donors and volunteers.",
    },
    {
      id: 103,
      title: "Spring College Drive",
      organizer: "City College",
      date: "March 20, 2025",
      time: "10:00 AM - 5:00 PM",
      location: "City College Gymnasium",
      address: "888 College Road, New York, NY",
      bloodTypesNeeded: ["O+", "O-", "A+", "A-"],
      attended: true,
      attendees: 87,
      description:
        "Annual spring blood drive at City College. Thank you to all the students and faculty who participated!",
    },
  ]

  const filteredUpcomingDrives = upcomingDrives.filter(
    (drive) =>
      drive.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drive.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drive.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredPastDrives = pastDrives.filter(
    (drive) =>
      drive.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drive.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drive.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="flex">
        <DashboardNav />
        <main className="flex-1 p-6">
          <div className="flex flex-col space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Donation Drives</h1>
              <Button className="bg-red-600 hover:bg-red-700">Create Drive</Button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by name, organizer, or location..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline">Filter</Button>
              <Button variant="outline">Sort by: Date</Button>
            </div>

            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="upcoming">Upcoming Drives</TabsTrigger>
                <TabsTrigger value="past">Past Drives</TabsTrigger>
                <TabsTrigger value="my-drives">My Drives</TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="space-y-6">
                {filteredUpcomingDrives.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-10">
                      <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No donation drives found</h3>
                      <p className="text-muted-foreground mt-1">Try adjusting your search criteria</p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredUpcomingDrives.map((drive) => (
                    <Card key={drive.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle>{drive.title}</CardTitle>
                            <CardDescription>Organized by {drive.organizer}</CardDescription>
                          </div>
                          {drive.registered ? (
                            <Badge className="bg-green-600">Registered</Badge>
                          ) : (
                            <Button size="sm" className="bg-red-600 hover:bg-red-700">
                              Register
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center text-sm">
                              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{drive.date}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{drive.time}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                              <div>
                                <div>{drive.location}</div>
                                <div className="text-xs text-muted-foreground">{drive.address}</div>
                              </div>
                            </div>
                            <div className="flex items-center text-sm">
                              <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{drive.attendees} people registered</span>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm mb-2">
                              <span className="font-medium">Blood Types Needed:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {drive.bloodTypesNeeded.map((type, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="bg-red-50 text-red-600 hover:bg-red-50"
                                  >
                                    {type}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{drive.description}</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{drive.distance} away</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Share
                          </Button>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="past" className="space-y-6">
                {filteredPastDrives.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-10">
                      <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No past drives found</h3>
                      <p className="text-muted-foreground mt-1">Try adjusting your search criteria</p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredPastDrives.map((drive) => (
                    <Card key={drive.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle>{drive.title}</CardTitle>
                            <CardDescription>Organized by {drive.organizer}</CardDescription>
                          </div>
                          {drive.attended ? (
                            <Badge className="bg-blue-600">Attended</Badge>
                          ) : (
                            <Badge variant="outline">Missed</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center text-sm">
                              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{drive.date}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{drive.time}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                              <div>
                                <div>{drive.location}</div>
                                <div className="text-xs text-muted-foreground">{drive.address}</div>
                              </div>
                            </div>
                            <div className="flex items-center text-sm">
                              <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{drive.attendees} people attended</span>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm mb-2">
                              <span className="font-medium">Blood Types Needed:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {drive.bloodTypesNeeded.map((type, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="bg-gray-100 text-gray-600 hover:bg-gray-100"
                                  >
                                    {type}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{drive.description}</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end">
                        <div className="flex space-x-2">
                          {drive.attended && (
                            <Button variant="outline" size="sm">
                              View Certificate
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="my-drives" className="space-y-6">
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <Droplet className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">You haven't created any drives yet</h3>
                    <p className="text-muted-foreground mt-1">Create a blood donation drive to help your community</p>
                    <Button className="mt-4 bg-red-600 hover:bg-red-700">Create Your First Drive</Button>
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

