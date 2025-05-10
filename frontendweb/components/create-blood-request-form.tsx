"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
const urgencyLevels = ["Standard", "Moderate", "Urgent", "Critical"]

export function CreateBloodRequestForm() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    bloodType: "",
    unitsNeeded: "",
    urgencyLevel: "",
    location: "",
    neededByDate: "",
    neededByTime: "",
    reason: "",
    additionalNotes: "",
    contactByEmail: true,
    contactByPhone: false,
    contactInApp: true,
    shareContact: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user?.email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to create a blood request.",
      })
      return
    }

    setIsLoading(true)

    try {
      // Ensure we're sending the exact structure expected by the backend
      const requestData = {
        ...formData,
        createdByEmail: user.email,
      }

      const response = await fetch("/api/blood-request/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Blood request created successfully.",
        })
        router.push("/dashboard/blood-requests")
      } else {
        const data = await response.json()
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || "Failed to create blood request.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="bloodType">Blood Type Required</Label>
              <Select
                value={formData.bloodType}
                onValueChange={(value) => handleSelectChange("bloodType", value)}
                required
              >
                <SelectTrigger id="bloodType">
                  <SelectValue placeholder="Select blood type" />
                </SelectTrigger>
                <SelectContent>
                  {bloodTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="unitsNeeded">Units Needed</Label>
              <Input
                id="unitsNeeded"
                name="unitsNeeded"
                value={formData.unitsNeeded}
                onChange={handleChange}
                placeholder="e.g., 2 units"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="urgencyLevel">Urgency Level</Label>
              <Select
                value={formData.urgencyLevel}
                onValueChange={(value) => handleSelectChange("urgencyLevel", value)}
                required
              >
                <SelectTrigger id="urgencyLevel">
                  <SelectValue placeholder="Select urgency level" />
                </SelectTrigger>
                <SelectContent>
                  {urgencyLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Hospital or clinic name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="neededByDate">Needed By (Date)</Label>
              <Input
                id="neededByDate"
                name="neededByDate"
                type="date"
                value={formData.neededByDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="neededByTime">Needed By (Time)</Label>
              <Input
                id="neededByTime"
                name="neededByTime"
                type="time"
                value={formData.neededByTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Request</Label>
            <Textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Briefly describe why the blood is needed"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalNotes">Additional Notes</Label>
            <Textarea
              id="additionalNotes"
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleChange}
              placeholder="Any additional information that might be helpful"
            />
          </div>

          <div className="space-y-3">
            <Label>Contact Preferences</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="contactByEmail"
                  checked={formData.contactByEmail}
                  onCheckedChange={(checked) => handleCheckboxChange("contactByEmail", checked as boolean)}
                />
                <Label htmlFor="contactByEmail">Contact me by email</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="contactByPhone"
                  checked={formData.contactByPhone}
                  onCheckedChange={(checked) => handleCheckboxChange("contactByPhone", checked as boolean)}
                />
                <Label htmlFor="contactByPhone">Contact me by phone</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="contactInApp"
                  checked={formData.contactInApp}
                  onCheckedChange={(checked) => handleCheckboxChange("contactInApp", checked as boolean)}
                />
                <Label htmlFor="contactInApp">Contact me through the app</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="shareContact"
                  checked={formData.shareContact}
                  onCheckedChange={(checked) => handleCheckboxChange("shareContact", checked as boolean)}
                />
                <Label htmlFor="shareContact">Share my contact information with potential donors</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Blood Request"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
