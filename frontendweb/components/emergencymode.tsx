"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"

export function EmergencyMode() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isEmergencyMode, setIsEmergencyMode] = useState(false)
  const [emergencyType, setEmergencyType] = useState("")
  const [message, setMessage] = useState("")
  
  // Toggle Emergency Mode
  const toggleEmergencyMode = async () => {
    if (!user?.email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to use Emergency Mode.",
      })
      return
    }

    if (!emergencyType) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select an emergency type.",
      })
      return
    }

    try {
      const response = await fetch("/api/emergency-mode", {
        method: "POST",
        body: JSON.stringify({ email: user.email, emergencyType, message }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        setIsEmergencyMode(true)
        toast({
          title: "Emergency Mode Activated",
          description: "Your request has been sent to nearby donors.",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to activate Emergency Mode.",
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Emergency Mode</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="emergencyType" className="text-sm font-medium">
                Emergency Type:
              </label>
              <Input
                id="emergencyType"
                value={emergencyType}
                onChange={(e) => setEmergencyType(e.target.value)}
                placeholder="Personal Emergency or Family Emergency"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Message:
              </label>
              <Input
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Provide additional details"
              />
            </div>
            <Button
              onClick={toggleEmergencyMode}
              className="bg-red-600 hover:bg-red-700"
            >
              {isEmergencyMode ? "Emergency Mode Active" : "Activate Emergency Mode"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
