"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, MapPin, Clock, Phone, Mail, MessageSquare } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"

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

export function EmergencyDashboard() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [emergencyRequests, setEmergencyRequests] = useState<BloodRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchEmergencyRequests = async () => {
      setIsLoading(true)
      try {
        // Fetch all blood requests
        const response = await fetch("/api/blood-request/get")
        const allRequests = await response.json()

        // Filter for urgent and critical requests only
        const urgentRequests = allRequests.filter(
          (request: BloodRequest) => request.urgencyLevel === "Urgent" || request.urgencyLevel === "Critical",
        )

        setEmergencyRequests(urgentRequests)
      } catch (error) {
        console.error("Error fetching emergency requests:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load emergency requests. Please try again.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchEmergencyRequests()
  }, [toast])

  const handleRespond = async (bloodType: string, location: string) => {
    try {
      // Create a unique identifier for the request
      const requestId = `${bloodType}-${location}`

      // Call the emergency activation endpoint
      const response = await fetch("/api/emergency/activate", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: requestId,
      })

      if (response.ok) {
        toast({
          title: "Response Sent",
          description: "Thank you for responding to this emergency request. The requester will be notified.",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to respond to the emergency request.",
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

  const getTimeDistance = (dateStr: string, timeStr: string) => {
    try {
      const [year, month, day] = dateStr.split("-").map(Number)
      const [hours, minutes] = timeStr.split(":").map(Number)

      const date = new Date(year, month - 1, day, hours, minutes)
      const now = new Date()

      const diffMs = date.getTime() - now.getTime()
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

      if (diffDays < 0) return "Needed immediately"
      if (diffDays === 0) return "Needed today"
      if (diffDays === 1) return "Needed tomorrow"
      return `Needed in ${diffDays} days`
    } catch (e) {
      return "Needed as soon as possible"
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
        <div>
          <h3 className="font-medium text-red-800">Emergency Mode</h3>
          <p className="text-sm text-red-700">
            Emergency requests are urgent blood needs that require immediate attention. If you can help, please respond
            as soon as possible.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <p>Loading emergency requests...</p>
        </div>
      ) : emergencyRequests.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {emergencyRequests.map((request, index) => (
            <Card key={index} className="border-red-200 shadow-sm">
              <CardHeader className="bg-red-50 border-b border-red-100">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <CardTitle className="text-lg text-red-800">Emergency Blood Request</CardTitle>
                    </div>
                    <CardDescription className="mt-1">Urgency: {request.urgencyLevel}</CardDescription>
                  </div>
                  <Badge className="bg-red-600">{request.bloodType} Needed</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{request.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{getTimeDistance(request.neededByDate, request.neededByTime)}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-1">Reason:</h4>
                  <p className="text-gray-700">{request.reason}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Contact Options:</h4>
                  <div className="flex gap-2">
                    {request.contactByPhone && (
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        Call
                      </Button>
                    )}
                    {request.contactByEmail && (
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        Email
                      </Button>
                    )}
                    {request.contactInApp && (
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        Message
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <p className="text-sm text-gray-500">Requested by {request.createdByEmail}</p>
                <Button
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => handleRespond(request.bloodType, request.location)}
                >
                  I Can Help
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <h3 className="text-lg font-medium mb-2">No Emergency Requests</h3>
          <p className="text-gray-500 mb-4">There are no emergency blood requests at the moment.</p>
          <Button asChild className="bg-red-600 hover:bg-red-700">
            <a href="/dashboard/blood-requests/create">Create Blood Request</a>
          </Button>
        </div>
      )}
    </div>
  )
}
