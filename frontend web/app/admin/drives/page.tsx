"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, MapPin, Users, CalendarIcon, Plus, Search, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RoleGuard } from "@/components/auth/role-guard"
import { AdminNav } from "@/components/admin/admin-nav"
import { AdminHeader } from "@/components/admin/admin-header"
import { useAuth } from "@/lib/context/auth-context"
import { toast } from "@/components/ui/use-toast"

// Mock data for donation drives
const mockDrives = [
  {
    id: "drive-1",
    title: "City Hospital Blood Drive",
    location: "City Hospital, 123 Main St",
    date: "2025-05-15",
    time: "09:00 - 17:00",
    status: "upcoming",
    capacity: 50,
    registered: 32,
    description:
      "Join us for our monthly blood drive at City Hospital. All blood types are needed, especially O- and AB+.",
    organizer: "City Hospital",
    createdAt: "2025-04-01",
  },
  {
    id: "drive-2",
    title: "Community Center Donation Event",
    location: "Downtown Community Center",
    date: "2025-05-22",
    time: "10:00 - 16:00",
    status: "upcoming",
    capacity: 75,
    registered: 41,
    description:
      "A special blood donation event at our community center. Free health checkups will be provided to all donors.",
    organizer: "Red Cross",
    createdAt: "2025-04-05",
  },
  {
    id: "drive-3",
    title: "University Campus Drive",
    location: "State University Student Union",
    date: "2025-05-28",
    time: "11:00 - 18:00",
    status: "upcoming",
    capacity: 100,
    registered: 67,
    description:
      "Calling all students and faculty! Join our campus-wide blood drive and help save lives in our community.",
    organizer: "State University",
    createdAt: "2025-04-10",
  },
  {
    id: "drive-4",
    title: "Corporate Office Blood Drive",
    location: "TechCorp Headquarters",
    date: "2025-04-10",
    time: "09:00 - 15:00",
    status: "completed",
    capacity: 40,
    registered: 38,
    description: "Our quarterly blood drive for TechCorp employees and nearby businesses.",
    organizer: "TechCorp",
    createdAt: "2025-03-15",
  },
  {
    id: "drive-5",
    title: "Emergency Blood Drive",
    location: "Memorial Hospital",
    date: "2025-04-05",
    time: "08:00 - 20:00",
    status: "completed",
    capacity: 100,
    registered: 112,
    description:
      "Emergency blood drive in response to recent shortages. All blood types urgently needed, especially O- and O+.",
    organizer: "Memorial Hospital",
    createdAt: "2025-03-30",
  },
]

export default function AdminDrivesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [showNewDriveForm, setShowNewDriveForm] = useState(false)
  const [newDrive, setNewDrive] = useState({
    title: "",
    location: "",
    date: "",
    time: "",
    capacity: "",
    description: "",
    organizer: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewDrive((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setNewDrive((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreateDrive = (e) => {
    e.preventDefault()

    // Validate form
    if (!newDrive.title || !newDrive.location || !newDrive.date || !newDrive.time || !newDrive.capacity) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields.",
      })
      return
    }

    // In a real app, this would send data to an API
    toast({
      title: "Drive created",
      description: "The donation drive has been successfully created.",
    })

    // Reset form and hide it
    setNewDrive({
      title: "",
      location: "",
      date: "",
      time: "",
      capacity: "",
      description: "",
      organizer: "",
    })
    setShowNewDriveForm(false)
  }

  return (
    <RoleGuard allowedRoles={["admin"]}>
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <div className="flex">
          <AdminNav />
          <main className="flex-1 p-6">
            <div className="flex flex-col space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold">Donation Drives</h1>
                  <p className="text-muted-foreground">Manage blood donation events and campaigns</p>
                </div>
                <Button className="bg-red-600 hover:bg-red-700" onClick={() => setShowNewDriveForm(!showNewDriveForm)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Drive
                </Button>
              </div>

              {showNewDriveForm && (
                <Card>
                  <CardHeader>
                    <CardTitle>Create New Donation Drive</CardTitle>
                    <CardDescription>Fill in the details to create a new blood donation drive</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleCreateDrive}>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Drive Title</Label>
                          <Input
                            id="title"
                            name="title"
                            placeholder="Enter drive title"
                            value={newDrive.title}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="organizer">Organizer</Label>
                          <Input
                            id="organizer"
                            name="organizer"
                            placeholder="Enter organizing institution"
                            value={newDrive.organizer}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          name="location"
                          placeholder="Enter drive location"
                          value={newDrive.location}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="date">Date</Label>
                          <Input
                            id="date"
                            name="date"
                            type="date"
                            value={newDrive.date}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="time">Time</Label>
                          <Input
                            id="time"
                            name="time"
                            placeholder="e.g., 09:00 - 17:00"
                            value={newDrive.time}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="capacity">Capacity</Label>
                          <Input
                            id="capacity"
                            name="capacity"
                            type="number"
                            placeholder="Maximum number of donors"
                            value={newDrive.capacity}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          name="description"
                          placeholder="Enter drive description and requirements"
                          value={newDrive.description}
                          onChange={handleInputChange}
                          rows={4}
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" type="button" onClick={() => setShowNewDriveForm(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-red-600 hover:bg-red-700">
                        Create Drive
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              )}

              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search drives..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>

              <Tabs defaultValue="upcoming">
                <TabsList className="mb-4">
                  <TabsTrigger value="upcoming">Upcoming Drives</TabsTrigger>
                  <TabsTrigger value="completed">Completed Drives</TabsTrigger>
                  <TabsTrigger value="draft">Draft Drives</TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mockDrives
                      .filter((drive) => drive.status === "upcoming")
                      .map((drive) => (
                        <Card key={drive.id} className="overflow-hidden">
                          <div className="bg-red-600 h-2" />
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-lg">{drive.title}</CardTitle>
                              <Badge>Upcoming</Badge>
                            </div>
                            <CardDescription className="flex items-center mt-1">
                              <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                              {drive.location}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex items-center text-sm">
                              <Calendar className="h-4 w-4 mr-2 text-red-600" />
                              <span>{new Date(drive.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Clock className="h-4 w-4 mr-2 text-red-600" />
                              <span>{drive.time}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Users className="h-4 w-4 mr-2 text-red-600" />
                              <span>
                                {drive.registered} / {drive.capacity} registered
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{drive.description}</p>
                          </CardContent>
                          <CardFooter className="flex justify-between">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button size="sm" className="bg-red-600 hover:bg-red-700">
                              Manage
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="completed">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mockDrives
                      .filter((drive) => drive.status === "completed")
                      .map((drive) => (
                        <Card key={drive.id} className="overflow-hidden">
                          <div className="bg-gray-400 h-2" />
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-lg">{drive.title}</CardTitle>
                              <Badge variant="outline">Completed</Badge>
                            </div>
                            <CardDescription className="flex items-center mt-1">
                              <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                              {drive.location}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex items-center text-sm">
                              <Calendar className="h-4 w-4 mr-2 text-gray-600" />
                              <span>{new Date(drive.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Clock className="h-4 w-4 mr-2 text-gray-600" />
                              <span>{drive.time}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Users className="h-4 w-4 mr-2 text-gray-600" />
                              <span>
                                {drive.registered} / {drive.capacity} participated
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{drive.description}</p>
                          </CardContent>
                          <CardFooter className="flex justify-between">
                            <Button variant="outline" size="sm">
                              Archive
                            </Button>
                            <Button variant="outline" size="sm">
                              View Report
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="draft">
                  <div className="flex flex-col items-center justify-center p-12 text-center">
                    <div className="rounded-full bg-gray-100 p-4 mb-4">
                      <CalendarIcon className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium">No draft drives</h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-4">You haven't created any draft drives yet.</p>
                    <Button onClick={() => setShowNewDriveForm(true)} className="bg-red-600 hover:bg-red-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Drive
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </RoleGuard>
  )
}
