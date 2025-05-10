"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Plus, Users } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

type DonationDrive = {
  id: number
  driveTitle: string
  organizedBy: string
  date: string
  startTime: string
  endTime: string
  venueName: string
  address: string
  city: string
  bloodTypesNeeded: string
  urgentNeed: boolean
  urgentBloodType: string
  description: string
  additionalInfo: string
}

export function DonationDrivesList() {
  const [drives, setDrives] = useState<DonationDrive[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchDrives = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/auth/all")
        const data = await response.json()
        setDrives(data)
      } catch (error) {
        console.error("Error fetching donation drives:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load donation drives. Please try again.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDrives()
  }, [toast])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Upcoming Donation Drives</h2>
        <Button asChild className="bg-red-600 hover:bg-red-700">
          <Link href="/dashboard/donation-drives/create">
            <Plus className="h-4 w-4 mr-1" />
            New Drive
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <p>Loading donation drives...</p>
        </div>
      ) : drives.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {drives.map((drive) => (
            <Card key={drive.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{drive.driveTitle}</CardTitle>
                  {drive.urgentNeed && <Badge className="bg-red-500">Urgent Need</Badge>}
                </div>
                <p className="text-sm text-gray-500">Organized by {drive.organizedBy}</p>
              </CardHeader>
              <CardContent className="pb-3 space-y-3">
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{drive.date}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span>
                    {drive.startTime} - {drive.endTime}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  <span>
                    {drive.venueName}, {drive.city}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Blood types needed: {drive.bloodTypesNeeded}</span>
                </div>
                {drive.urgentNeed && (
                  <div className="mt-2">
                    <Badge variant="outline" className="text-red-600 border-red-600">
                      Urgent need for {drive.urgentBloodType}
                    </Badge>
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-3 border-t">
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/dashboard/donation-drives/${drive.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <h3 className="text-lg font-medium mb-2">No Donation Drives</h3>
          <p className="text-gray-500 mb-4">There are no upcoming donation drives at the moment.</p>
          <Button asChild className="bg-red-600 hover:bg-red-700">
            <Link href="/dashboard/donation-drives/create">Create Drive</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
