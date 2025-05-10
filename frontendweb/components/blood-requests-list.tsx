"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Plus } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/components/ui/use-toast"

type BloodRequest = {
  bloodType: string
  urgencyLevel: string
  location: string
  neededByDate: string
  neededByTime: string
  reason: string
  additionalNotes: string
  contactByEmail: boolean
  contactByPhone: boolean
  contactInApp: boolean
  shareContact: boolean
  createdByEmail: string
}

export function BloodRequestsList() {
  const [allRequests, setAllRequests] = useState<BloodRequest[]>([])
  const [myRequests, setMyRequests] = useState<BloodRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true)
      try {
        // Fetch all requests
        const allResponse = await fetch("/api/blood-request/get")
        const allData = await allResponse.json()
        setAllRequests(allData)

        // Fetch user's requests if logged in
        if (user?.email) {
          const myResponse = await fetch(`/api/blood-request/user/${user.email}`)
          const myData = await myResponse.json()
          setMyRequests(myData)
        }
      } catch (error) {
        console.error("Error fetching blood requests:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load blood requests. Please try again.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchRequests()
  }, [user, toast])

  const activateEmergency = async (requestId: string) => {
    try {
      // The backend expects the ID as plain text in the request body
      const response = await fetch("/api/emergency/activate", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: requestId,
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Emergency mode activated for this request.",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to activate emergency mode.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred. Please try again.",
      })
    }
  }

  const getUrgencyColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "critical":
        return "bg-red-500"
      case "urgent":
        return "bg-orange-500"
      case "moderate":
        return "bg-yellow-500"
      default:
        return "bg-green-500"
    }
  }

  const renderRequestCard = (request: BloodRequest) => (
    <Card key={request.bloodType + request.location} className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{request.bloodType} Blood Needed</CardTitle>
            <p className="text-sm text-gray-500 mt-1">{request.location}</p>
          </div>
          <Badge className={getUrgencyColor(request.urgencyLevel)}>{request.urgencyLevel}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-2">
          <div>
            <p className="text-sm font-medium">Reason:</p>
            <p className="text-sm">{request.reason}</p>
          </div>
          <div className="flex justify-between text-sm">
            <span>Needed by: {request.neededByDate}</span>
            <span>Time: {request.neededByTime}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-3 border-t">
        <Link href="/dashboard/messages">
          <Button variant="outline" size="sm">
            Contact
          </Button>
        </Link>
        {request.urgencyLevel !== "Critical" && (
          <Button
            size="sm"
            className="bg-red-600 hover:bg-red-700"
            onClick={() => activateEmergency(request.bloodType + request.location)}
          >
            <AlertTriangle className="h-4 w-4 mr-1" />
            Emergency
          </Button>
        )}
      </CardFooter>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all">All Requests</TabsTrigger>
              <TabsTrigger value="my">My Requests</TabsTrigger>
            </TabsList>
            <Button asChild className="bg-red-600 hover:bg-red-700">
              <Link href="/dashboard/blood-requests/create">
                <Plus className="h-4 w-4 mr-1" />
                New Request
              </Link>
            </Button>
          </div>

          <TabsContent value="all" className="mt-0">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <p>Loading requests...</p>
              </div>
            ) : allRequests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allRequests.map(renderRequestCard)}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg">
                <h3 className="text-lg font-medium mb-2">No Blood Requests</h3>
                <p className="text-gray-500 mb-4">There are no blood requests at the moment.</p>
                <Button asChild className="bg-red-600 hover:bg-red-700">
                  <Link href="/dashboard/blood-requests/create">Create Request</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="my" className="mt-0">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <p>Loading your requests...</p>
              </div>
            ) : myRequests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myRequests.map(renderRequestCard)}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg">
                <h3 className="text-lg font-medium mb-2">No Requests Created</h3>
                <p className="text-gray-500 mb-4">You haven't created any blood requests yet.</p>
                <Button asChild className="bg-red-600 hover:bg-red-700">
                  <Link href="/dashboard/blood-requests/create">Create Request</Link>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
