"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Bell } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

type Notification = {
  id: number
  title: string
  message: string
  createdAt: string
}

export function NotificationsList() {
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/notifications")
        const data = await response.json()
        setNotifications(data)
      } catch (error) {
        console.error("Error fetching notifications:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load notifications. Please try again.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotifications()
  }, [toast])

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch (error) {
      return "Unknown time"
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Notifications</h2>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <p>Loading notifications...</p>
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card key={notification.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Bell className="h-4 w-4 text-red-600" />
                  {notification.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-2">{formatTime(notification.createdAt)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <h3 className="text-lg font-medium mb-2">No Notifications</h3>
          <p className="text-gray-500">You don't have any notifications at the moment.</p>
        </div>
      )}
    </div>
  )
}
