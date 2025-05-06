"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, Plus, Eye, Edit, Trash2 } from "lucide-react"
import { RoleGuard } from "@/components/auth/role-guard"
import { AdminNav } from "@/components/admin/admin-nav"
import { AdminHeader } from "@/components/admin/admin-header"
import { DriveAnnouncementForm } from "@/components/admin/drive-announcement-form"
import { useAuth } from "@/lib/context/auth-context"

// Mock data for announcements
const mockAnnouncements = [
  {
    id: "ann-1",
    title: "Urgent: Blood Shortage for Type O-",
    message:
      "We are experiencing a critical shortage of O- blood. If you are an O- donor, please consider donating as soon as possible.",
    urgencyLevel: "urgent",
    createdAt: "2025-04-25T10:30:00",
    publishedAt: "2025-04-25T10:30:00",
    status: "published",
    author: "Admin",
    views: 1245,
    targetAudience: "donors",
  },
  {
    id: "ann-2",
    title: "New Donation Drive at City Hospital",
    message:
      "We're excited to announce a new donation drive at City Hospital on May 15th. Register now to secure your spot!",
    urgencyLevel: "normal",
    createdAt: "2025-04-20T14:15:00",
    publishedAt: "2025-04-20T14:15:00",
    status: "published",
    author: "Admin",
    views: 876,
    targetAudience: "all",
  },
  {
    id: "ann-3",
    title: "Thank You to Our Donors",
    message:
      "We want to extend our heartfelt thanks to all donors who participated in last week's emergency drive. You helped save 112 lives!",
    urgencyLevel: "low",
    createdAt: "2025-04-15T09:45:00",
    publishedAt: "2025-04-15T09:45:00",
    status: "published",
    author: "Admin",
    views: 543,
    targetAudience: "donors",
  },
  {
    id: "ann-4",
    title: "Blood Drive Results for Q1 2025",
    message: "Check out the amazing results from our Q1 blood drives. We've collected over 1,500 units of blood!",
    urgencyLevel: "normal",
    createdAt: "2025-04-10T16:20:00",
    publishedAt: null,
    status: "draft",
    author: "Admin",
    views: 0,
    targetAudience: "all",
  },
  {
    id: "ann-5",
    title: "New Mobile App Features",
    message:
      "We've updated our mobile app with new features to make donation scheduling easier. Download the latest version now!",
    urgencyLevel: "normal",
    createdAt: "2025-04-05T11:10:00",
    publishedAt: null,
    status: "scheduled",
    scheduledFor: "2025-05-01T09:00:00",
    author: "Admin",
    views: 0,
    targetAudience: "all",
  },
]

export default function AdminAnnouncementsPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [showNewAnnouncementForm, setShowNewAnnouncementForm] = useState(false)

  const getUrgencyBadge = (level) => {
    switch (level) {
      case "urgent":
        return <Badge className="bg-red-600">Urgent</Badge>
      case "high":
        return <Badge className="bg-amber-600">High</Badge>
      case "normal":
        return <Badge className="bg-blue-600">Normal</Badge>
      case "low":
        return <Badge className="bg-green-600">Low</Badge>
      default:
        return <Badge className="bg-blue-600">Normal</Badge>
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-600">Published</Badge>
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      case "scheduled":
        return <Badge className="bg-purple-600">Scheduled</Badge>
      default:
        return <Badge variant="outline">Draft</Badge>
    }
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
                  <h1 className="text-3xl font-bold">Announcements</h1>
                  <p className="text-muted-foreground">Manage and publish announcements for users</p>
                </div>
                <Button
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => setShowNewAnnouncementForm(!showNewAnnouncementForm)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Announcement
                </Button>
              </div>

              {showNewAnnouncementForm && (
                <DriveAnnouncementForm
                  onSuccess={() => setShowNewAnnouncementForm(false)}
                  onCancel={() => setShowNewAnnouncementForm(false)}
                />
              )}

              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search announcements..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>

              <Tabs defaultValue="all">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="published">Published</TabsTrigger>
                  <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                  <TabsTrigger value="draft">Drafts</TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  <Card>
                    <CardHeader>
                      <CardTitle>All Announcements</CardTitle>
                      <CardDescription>View and manage all announcements</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <div className="grid grid-cols-12 bg-muted/50 p-3 text-sm font-medium">
                          <div className="col-span-4">Title</div>
                          <div className="col-span-2">Status</div>
                          <div className="col-span-2">Urgency</div>
                          <div className="col-span-2">Date</div>
                          <div className="col-span-1">Views</div>
                          <div className="col-span-1 text-right">Actions</div>
                        </div>
                        {mockAnnouncements.map((announcement) => (
                          <div key={announcement.id} className="grid grid-cols-12 items-center border-t p-3">
                            <div className="col-span-4 font-medium">{announcement.title}</div>
                            <div className="col-span-2">{getStatusBadge(announcement.status)}</div>
                            <div className="col-span-2">{getUrgencyBadge(announcement.urgencyLevel)}</div>
                            <div className="col-span-2 text-sm text-muted-foreground">
                              {new Date(announcement.createdAt).toLocaleDateString()}
                            </div>
                            <div className="col-span-1 flex items-center">
                              <Eye className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                              <span className="text-sm">{announcement.views}</span>
                            </div>
                            <div className="col-span-1 flex justify-end space-x-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="published">
                  <Card>
                    <CardHeader>
                      <CardTitle>Published Announcements</CardTitle>
                      <CardDescription>Currently active announcements visible to users</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <div className="grid grid-cols-12 bg-muted/50 p-3 text-sm font-medium">
                          <div className="col-span-4">Title</div>
                          <div className="col-span-2">Urgency</div>
                          <div className="col-span-2">Published</div>
                          <div className="col-span-2">Audience</div>
                          <div className="col-span-1">Views</div>
                          <div className="col-span-1 text-right">Actions</div>
                        </div>
                        {mockAnnouncements
                          .filter((a) => a.status === "published")
                          .map((announcement) => (
                            <div key={announcement.id} className="grid grid-cols-12 items-center border-t p-3">
                              <div className="col-span-4 font-medium">{announcement.title}</div>
                              <div className="col-span-2">{getUrgencyBadge(announcement.urgencyLevel)}</div>
                              <div className="col-span-2 text-sm text-muted-foreground">
                                {new Date(announcement.publishedAt).toLocaleDateString()}
                              </div>
                              <div className="col-span-2 capitalize text-sm">
                                {announcement.targetAudience === "all" ? "Everyone" : announcement.targetAudience}
                              </div>
                              <div className="col-span-1 flex items-center">
                                <Eye className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                                <span className="text-sm">{announcement.views}</span>
                              </div>
                              <div className="col-span-1 flex justify-end space-x-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="scheduled">
                  <Card>
                    <CardHeader>
                      <CardTitle>Scheduled Announcements</CardTitle>
                      <CardDescription>Announcements scheduled for future publication</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <div className="grid grid-cols-12 bg-muted/50 p-3 text-sm font-medium">
                          <div className="col-span-4">Title</div>
                          <div className="col-span-2">Urgency</div>
                          <div className="col-span-3">Scheduled For</div>
                          <div className="col-span-2">Audience</div>
                          <div className="col-span-1 text-right">Actions</div>
                        </div>
                        {mockAnnouncements
                          .filter((a) => a.status === "scheduled")
                          .map((announcement) => (
                            <div key={announcement.id} className="grid grid-cols-12 items-center border-t p-3">
                              <div className="col-span-4 font-medium">{announcement.title}</div>
                              <div className="col-span-2">{getUrgencyBadge(announcement.urgencyLevel)}</div>
                              <div className="col-span-3 text-sm text-muted-foreground">
                                {new Date(announcement.scheduledFor).toLocaleString()}
                              </div>
                              <div className="col-span-2 capitalize text-sm">
                                {announcement.targetAudience === "all" ? "Everyone" : announcement.targetAudience}
                              </div>
                              <div className="col-span-1 flex justify-end space-x-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="draft">
                  <Card>
                    <CardHeader>
                      <CardTitle>Draft Announcements</CardTitle>
                      <CardDescription>Announcements that are not yet published</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <div className="grid grid-cols-12 bg-muted/50 p-3 text-sm font-medium">
                          <div className="col-span-5">Title</div>
                          <div className="col-span-2">Urgency</div>
                          <div className="col-span-2">Created</div>
                          <div className="col-span-2">Author</div>
                          <div className="col-span-1 text-right">Actions</div>
                        </div>
                        {mockAnnouncements
                          .filter((a) => a.status === "draft")
                          .map((announcement) => (
                            <div key={announcement.id} className="grid grid-cols-12 items-center border-t p-3">
                              <div className="col-span-5 font-medium">{announcement.title}</div>
                              <div className="col-span-2">{getUrgencyBadge(announcement.urgencyLevel)}</div>
                              <div className="col-span-2 text-sm text-muted-foreground">
                                {new Date(announcement.createdAt).toLocaleDateString()}
                              </div>
                              <div className="col-span-2 text-sm">{announcement.author}</div>
                              <div className="col-span-1 flex justify-end space-x-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </RoleGuard>
  )
}
