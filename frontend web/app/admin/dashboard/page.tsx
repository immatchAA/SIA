"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  BarChart3,
  Bell,
  Calendar,
  CheckCircle,
  Droplet,
  FileText,
  Filter,
  HospitalIcon as HospitalSquare,
  Search,
  Settings,
  Users,
  XCircle,
} from "lucide-react"
import { RoleGuard } from "@/components/auth/role-guard"
import { AdminNav } from "@/components/admin/admin-nav"
import { AdminHeader } from "@/components/admin/admin-header"
import { useAuth } from "@/lib/context/auth-context"

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("overview")

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
                  <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                  <p className="text-muted-foreground">
                    Welcome back, {user?.name}. Here's what's happening with RedWeb today.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </div>

              {/* Stats Overview */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardContent className="p-6 flex flex-row items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                      <h3 className="text-3xl font-bold mt-1">2,543</h3>
                      <p className="text-xs text-green-600 mt-1">+12% from last month</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 flex flex-row items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Donors</p>
                      <h3 className="text-3xl font-bold mt-1">1,832</h3>
                      <p className="text-xs text-green-600 mt-1">+8% from last month</p>
                    </div>
                    <div className="bg-red-100 p-3 rounded-full">
                      <Droplet className="h-6 w-6 text-red-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 flex flex-row items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Blood Requests</p>
                      <h3 className="text-3xl font-bold mt-1">342</h3>
                      <p className="text-xs text-amber-600 mt-1">+24% from last month</p>
                    </div>
                    <div className="bg-amber-100 p-3 rounded-full">
                      <Bell className="h-6 w-6 text-amber-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 flex flex-row items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Donation Drives</p>
                      <h3 className="text-3xl font-bold mt-1">28</h3>
                      <p className="text-xs text-green-600 mt-1">+4 from last month</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <Calendar className="h-6 w-6 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="users">Users</TabsTrigger>
                  <TabsTrigger value="requests">Blood Requests</TabsTrigger>
                  <TabsTrigger value="drives">Donation Drives</TabsTrigger>
                  <TabsTrigger value="hospitals">Hospitals</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  {/* Activity Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Platform Activity</CardTitle>
                      <CardDescription>User registrations, blood requests, and donations over time</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80 flex items-center justify-center">
                      <div className="flex flex-col items-center text-muted-foreground">
                        <BarChart3 className="h-16 w-16 mb-2" />
                        <p>Activity chart visualization would appear here</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Latest actions across the platform</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="flex items-start space-x-4 border-b pb-4 last:border-0 last:pb-0">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback
                                className={`
                                ${
                                  i % 3 === 0
                                    ? "bg-red-100 text-red-600"
                                    : i % 3 === 1
                                      ? "bg-blue-100 text-blue-600"
                                      : "bg-green-100 text-green-600"
                                }
                              `}
                              >
                                {i % 3 === 0 ? "JD" : i % 3 === 1 ? "MR" : "AK"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-medium">
                                {i % 5 === 0
                                  ? "New user registered"
                                  : i % 5 === 1
                                    ? "Blood request created"
                                    : i % 5 === 2
                                      ? "Donation drive scheduled"
                                      : i % 5 === 3
                                        ? "Donor approved"
                                        : "Emergency request fulfilled"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {i % 5 === 0
                                  ? "John Doe registered as a donor"
                                  : i % 5 === 1
                                    ? "Maria Rodriguez requested O- blood"
                                    : i % 5 === 2
                                      ? "City Hospital scheduled a donation drive"
                                      : i % 5 === 3
                                        ? "Admin approved Alex Kim as a donor"
                                        : "Emergency request for B+ blood was fulfilled"}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {i === 1
                                  ? "Just now"
                                  : i === 2
                                    ? "5 minutes ago"
                                    : i === 3
                                      ? "1 hour ago"
                                      : i === 4
                                        ? "3 hours ago"
                                        : "Yesterday"}
                              </p>
                            </div>
                            <Badge
                              className={`
                              ${
                                i % 5 === 0
                                  ? "bg-blue-600"
                                  : i % 5 === 1
                                    ? "bg-amber-600"
                                    : i % 5 === 2
                                      ? "bg-green-600"
                                      : i % 5 === 3
                                        ? "bg-purple-600"
                                        : "bg-red-600"
                              }
                            `}
                            >
                              {i % 5 === 0
                                ? "User"
                                : i % 5 === 1
                                  ? "Request"
                                  : i % 5 === 2
                                    ? "Drive"
                                    : i % 5 === 3
                                      ? "Admin"
                                      : "Emergency"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View All Activity
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="users" className="space-y-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div>
                        <CardTitle>User Management</CardTitle>
                        <CardDescription>Manage donors, patients, and administrators</CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="search"
                            placeholder="Search users..."
                            className="pl-9 w-[300px]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                        <Button variant="outline" size="icon">
                          <Filter className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="donors" className="w-full">
                        <TabsList className="mb-4">
                          <TabsTrigger value="donors">Donors</TabsTrigger>
                          <TabsTrigger value="patients">Patients</TabsTrigger>
                          <TabsTrigger value="admins">Admins</TabsTrigger>
                          <TabsTrigger value="pending">Pending Approval</TabsTrigger>
                        </TabsList>

                        <TabsContent value="donors" className="space-y-4">
                          <div className="rounded-md border">
                            <div className="grid grid-cols-8 bg-muted/50 p-3 text-sm font-medium">
                              <div className="col-span-2">Name</div>
                              <div className="col-span-2">Email</div>
                              <div>Blood Type</div>
                              <div>Status</div>
                              <div>Donations</div>
                              <div className="text-right">Actions</div>
                            </div>
                            {[1, 2, 3, 4, 5].map((i) => (
                              <div key={i} className="grid grid-cols-8 items-center border-t p-3">
                                <div className="col-span-2 flex items-center space-x-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-red-100 text-red-600 text-xs">
                                      {i === 1 ? "JD" : i === 2 ? "MR" : i === 3 ? "AK" : i === 4 ? "TP" : "SL"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="font-medium">
                                    {i === 1
                                      ? "John Doe"
                                      : i === 2
                                        ? "Maria Rodriguez"
                                        : i === 3
                                          ? "Alex Kim"
                                          : i === 4
                                            ? "Tara Patel"
                                            : "Sam Lee"}
                                  </span>
                                </div>
                                <div className="col-span-2 text-muted-foreground">
                                  {i === 1
                                    ? "john.doe@example.com"
                                    : i === 2
                                      ? "maria.r@example.com"
                                      : i === 3
                                        ? "alex.kim@example.com"
                                        : i === 4
                                          ? "tara.p@example.com"
                                          : "sam.lee@example.com"}
                                </div>
                                <div>
                                  <Badge variant="outline" className="bg-red-50 text-red-600 hover:bg-red-50">
                                    {i === 1 ? "O+" : i === 2 ? "A-" : i === 3 ? "B+" : i === 4 ? "AB+" : "O-"}
                                  </Badge>
                                </div>
                                <div>
                                  <Badge
                                    className={`
                                    ${i === 3 ? "bg-amber-500" : "bg-green-600"}
                                  `}
                                  >
                                    {i === 3 ? "Restricted" : "Active"}
                                  </Badge>
                                </div>
                                <div className="font-medium">
                                  {i === 1 ? "12" : i === 2 ? "8" : i === 3 ? "3" : i === 4 ? "15" : "6"}
                                </div>
                                <div className="flex justify-end space-x-2">
                                  <Button variant="outline" size="sm">
                                    View
                                  </Button>
                                  <Button variant="outline" size="sm" className="text-red-600">
                                    {i === 3 ? "Activate" : "Restrict"}
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </TabsContent>

                        <TabsContent value="patients" className="space-y-4">
                          <div className="rounded-md border">
                            <div className="grid grid-cols-8 bg-muted/50 p-3 text-sm font-medium">
                              <div className="col-span-2">Name</div>
                              <div className="col-span-2">Email</div>
                              <div>Blood Type</div>
                              <div>Hospital</div>
                              <div>Requests</div>
                              <div className="text-right">Actions</div>
                            </div>
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="grid grid-cols-8 items-center border-t p-3">
                                <div className="col-span-2 flex items-center space-x-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                                      {i === 1 ? "ER" : i === 2 ? "JW" : "LT"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="font-medium">
                                    {i === 1 ? "Emma Roberts" : i === 2 ? "James Wilson" : "Lisa Thompson"}
                                  </span>
                                </div>
                                <div className="col-span-2 text-muted-foreground">
                                  {i === 1
                                    ? "emma.r@example.com"
                                    : i === 2
                                      ? "james.w@example.com"
                                      : "lisa.t@example.com"}
                                </div>
                                <div>
                                  <Badge variant="outline" className="bg-red-50 text-red-600 hover:bg-red-50">
                                    {i === 1 ? "AB-" : i === 2 ? "O-" : "B+"}
                                  </Badge>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {i === 1 ? "City Hospital" : i === 2 ? "Memorial Medical" : "University Hospital"}
                                </div>
                                <div className="font-medium">{i === 1 ? "3" : i === 2 ? "1" : "5"}</div>
                                <div className="flex justify-end space-x-2">
                                  <Button variant="outline" size="sm">
                                    View
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    Requests
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </TabsContent>

                        <TabsContent value="admins" className="space-y-4">
                          <div className="rounded-md border">
                            <div className="grid grid-cols-7 bg-muted/50 p-3 text-sm font-medium">
                              <div className="col-span-2">Name</div>
                              <div className="col-span-2">Email</div>
                              <div>Organization</div>
                              <div>Level</div>
                              <div className="text-right">Actions</div>
                            </div>
                            {[1, 2].map((i) => (
                              <div key={i} className="grid grid-cols-7 items-center border-t p-3">
                                <div className="col-span-2 flex items-center space-x-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">
                                      {i === 1 ? "RJ" : "DM"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="font-medium">{i === 1 ? "Robert Johnson" : "Diana Miller"}</span>
                                </div>
                                <div className="col-span-2 text-muted-foreground">
                                  {i === 1 ? "robert.j@redweb.org" : "diana.m@redweb.org"}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {i === 1 ? "RedWeb Central" : "City Blood Bank"}
                                </div>
                                <div>
                                  <Badge className={i === 1 ? "bg-purple-600" : "bg-blue-600"}>
                                    {i === 1 ? "Super Admin" : "Admin"}
                                  </Badge>
                                </div>
                                <div className="flex justify-end space-x-2">
                                  <Button variant="outline" size="sm">
                                    View
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    Permissions
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </TabsContent>

                        <TabsContent value="pending" className="space-y-4">
                          <div className="rounded-md border">
                            <div className="grid grid-cols-7 bg-muted/50 p-3 text-sm font-medium">
                              <div className="col-span-2">Name</div>
                              <div className="col-span-2">Email</div>
                              <div>Type</div>
                              <div>Registered</div>
                              <div className="text-right">Actions</div>
                            </div>
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="grid grid-cols-7 items-center border-t p-3">
                                <div className="col-span-2 flex items-center space-x-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-amber-100 text-amber-600 text-xs">
                                      {i === 1 ? "KL" : i === 2 ? "BT" : "MC"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="font-medium">
                                    {i === 1 ? "Kevin Lee" : i === 2 ? "Brian Taylor" : "Michelle Chen"}
                                  </span>
                                </div>
                                <div className="col-span-2 text-muted-foreground">
                                  {i === 1
                                    ? "kevin.l@example.com"
                                    : i === 2
                                      ? "brian.t@redweb.org"
                                      : "michelle.c@example.com"}
                                </div>
                                <div>
                                  <Badge
                                    className={`
                                    ${i === 1 ? "bg-red-600" : i === 2 ? "bg-purple-600" : "bg-blue-600"}
                                  `}
                                  >
                                    {i === 1 ? "Donor" : i === 2 ? "Admin" : "Patient"}
                                  </Badge>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {i === 1 ? "Today" : i === 2 ? "Yesterday" : "3 days ago"}
                                </div>
                                <div className="flex justify-end space-x-2">
                                  <Button variant="outline" size="sm" className="text-green-600">
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                  <Button variant="outline" size="sm" className="text-red-600">
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="text-sm text-muted-foreground">Showing 5 of 248 users</div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" disabled>
                          Previous
                        </Button>
                        <Button variant="outline" size="sm">
                          Next
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="requests" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Blood Requests</CardTitle>
                      <CardDescription>Manage and monitor blood donation requests</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="active" className="w-full">
                        <TabsList className="mb-4">
                          <TabsTrigger value="active">Active</TabsTrigger>
                          <TabsTrigger value="emergency">Emergency</TabsTrigger>
                          <TabsTrigger value="fulfilled">Fulfilled</TabsTrigger>
                          <TabsTrigger value="expired">Expired</TabsTrigger>
                        </TabsList>

                        <TabsContent value="active" className="space-y-4">
                          <div className="rounded-md border">
                            <div className="grid grid-cols-7 bg-muted/50 p-3 text-sm font-medium">
                              <div>ID</div>
                              <div>Patient</div>
                              <div>Blood Type</div>
                              <div>Location</div>
                              <div>Created</div>
                              <div>Status</div>
                              <div className="text-right">Actions</div>
                            </div>
                            {[1, 2, 3, 4].map((i) => (
                              <div key={i} className="grid grid-cols-7 items-center border-t p-3">
                                <div className="text-sm font-mono">REQ-{1000 + i}</div>
                                <div className="font-medium">
                                  {i === 1
                                    ? "Emma Roberts"
                                    : i === 2
                                      ? "James Wilson"
                                      : i === 3
                                        ? "Lisa Thompson"
                                        : "Kevin Lee"}
                                </div>
                                <div>
                                  <Badge variant="outline" className="bg-red-50 text-red-600 hover:bg-red-50">
                                    {i === 1 ? "AB-" : i === 2 ? "O-" : i === 3 ? "B+" : "A+"}
                                  </Badge>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {i === 1
                                    ? "City Hospital"
                                    : i === 2
                                      ? "Memorial Medical"
                                      : i === 3
                                        ? "University Hospital"
                                        : "Community Clinic"}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {i === 1 ? "Today" : i === 2 ? "Yesterday" : i === 3 ? "3 days ago" : "1 week ago"}
                                </div>
                                <div>
                                  <Badge
                                    className={`
                                    ${i === 2 ? "bg-amber-500" : "bg-blue-600"}
                                  `}
                                  >
                                    {i === 2 ? "Urgent" : "Active"}
                                  </Badge>
                                </div>
                                <div className="flex justify-end space-x-2">
                                  <Button variant="outline" size="sm">
                                    View
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    Match Donors
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="drives" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Donation Drives</CardTitle>
                      <CardDescription>Manage blood donation events and campaigns</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-end mb-4">
                        <Button className="bg-red-600 hover:bg-red-700">
                          <Calendar className="h-4 w-4 mr-2" />
                          Create New Drive
                        </Button>
                      </div>

                      <div className="rounded-md border">
                        <div className="grid grid-cols-7 bg-muted/50 p-3 text-sm font-medium">
                          <div className="col-span-2">Event Name</div>
                          <div>Location</div>
                          <div>Date</div>
                          <div>Organizer</div>
                          <div>Status</div>
                          <div className="text-right">Actions</div>
                        </div>
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="grid grid-cols-7 items-center border-t p-3">
                            <div className="col-span-2 font-medium">
                              {i === 1
                                ? "City Hospital Blood Drive"
                                : i === 2
                                  ? "Community Center Donation Event"
                                  : "University Campus Drive"}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {i === 1 ? "City Hospital" : i === 2 ? "Downtown Community Center" : "State University"}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {i === 1 ? "May 10, 2025" : i === 2 ? "May 17, 2025" : "May 24, 2025"}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {i === 1 ? "City Hospital" : i === 2 ? "Red Cross" : "State University"}
                            </div>
                            <div>
                              <Badge
                                className={`
                                ${i === 1 ? "bg-green-600" : i === 2 ? "bg-amber-500" : "bg-blue-600"}
                              `}
                              >
                                {i === 1 ? "Confirmed" : i === 2 ? "Pending" : "Planning"}
                              </Badge>
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="hospitals" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Hospital Management</CardTitle>
                      <CardDescription>Manage partner hospitals and medical facilities</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-end mb-4">
                        <Button className="bg-red-600 hover:bg-red-700">
                          <HospitalSquare className="h-4 w-4 mr-2" />
                          Add Hospital
                        </Button>
                      </div>

                      <div className="rounded-md border">
                        <div className="grid grid-cols-6 bg-muted/50 p-3 text-sm font-medium">
                          <div className="col-span-2">Hospital Name</div>
                          <div>Location</div>
                          <div>Blood Bank</div>
                          <div>Patients</div>
                          <div className="text-right">Actions</div>
                        </div>
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="grid grid-cols-6 items-center border-t p-3">
                            <div className="col-span-2 font-medium">
                              {i === 1
                                ? "City Hospital"
                                : i === 2
                                  ? "Memorial Medical Center"
                                  : i === 3
                                    ? "University Hospital"
                                    : "Community Health Center"}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {i === 1
                                ? "Downtown, New York"
                                : i === 2
                                  ? "Midtown, New York"
                                  : i === 3
                                    ? "Uptown, New York"
                                    : "Brooklyn, New York"}
                            </div>
                            <div>
                              <Badge
                                className={`
                                ${i === 4 ? "bg-red-600" : "bg-green-600"}
                              `}
                              >
                                {i === 4 ? "No" : "Yes"}
                              </Badge>
                            </div>
                            <div className="font-medium">{i === 1 ? "42" : i === 2 ? "28" : i === 3 ? "35" : "18"}</div>
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                              <Button variant="outline" size="sm">
                                Inventory
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
