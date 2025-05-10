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

export function CreateDonationDriveForm() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    driveTitle: "",
    organizedBy: "",
    date: "",
    startTime: "",
    endTime: "",
    venueName: "",
    address: "",
    city: "",
    bloodTypesNeeded: "",
    urgentNeed: false,
    urgentBloodType: "",
    description: "",
    additionalInfo: "",
  })

  const [selectedBloodTypes, setSelectedBloodTypes] = useState<string[]>([])

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

  const handleBloodTypeToggle = (type: string) => {
    setSelectedBloodTypes((prev) => {
      const newTypes = prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]

      // Update the bloodTypesNeeded field in formData
      setFormData((prev) => ({ ...prev, bloodTypesNeeded: newTypes.join(",") }))

      return newTypes
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user?.email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to create a donation drive.",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          createdByEmail: user.email,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Donation drive created successfully.",
        })
        router.push("/dashboard/donation-drives")
      } else {
        const data = await response.json()
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || "Failed to create donation drive.",
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
          <div className="space-y-2">
            <Label htmlFor="driveTitle">Drive Title</Label>
            <Input
              id="driveTitle"
              name="driveTitle"
              value={formData.driveTitle}
              onChange={handleChange}
              placeholder="e.g., Community Blood Drive"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="organizedBy">Organized By</Label>
            <Input
              id="organizedBy"
              name="organizedBy"
              value={formData.organizedBy}
              onChange={handleChange}
              placeholder="Organization or individual name"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                name="startTime"
                type="time"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                name="endTime"
                type="time"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="venueName">Venue Name</Label>
              <Input
                id="venueName"
                name="venueName"
                value={formData.venueName}
                onChange={handleChange}
                placeholder="e.g., Community Center"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street address"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City name"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Blood Types Needed</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {bloodTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`bloodType-${type}`}
                    checked={selectedBloodTypes.includes(type)}
                    onCheckedChange={() => handleBloodTypeToggle(type)}
                  />
                  <Label htmlFor={`bloodType-${type}`} className="cursor-pointer">
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="urgentNeed"
                checked={formData.urgentNeed}
                onCheckedChange={(checked) => handleCheckboxChange("urgentNeed", checked as boolean)}
              />
              <Label htmlFor="urgentNeed">Urgent need for specific blood type</Label>
            </div>

            {formData.urgentNeed && (
              <div className="pl-6 space-y-2">
                <Label htmlFor="urgentBloodType">Urgent Blood Type</Label>
                <Select
                  value={formData.urgentBloodType}
                  onValueChange={(value) => handleSelectChange("urgentBloodType", value)}
                >
                  <SelectTrigger id="urgentBloodType">
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
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide details about the donation drive"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalInfo">Additional Information</Label>
            <Textarea
              id="additionalInfo"
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleChange}
              placeholder="Any additional information for donors"
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Donation Drive"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
