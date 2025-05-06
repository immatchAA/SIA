"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Megaphone, ImageIcon, Calendar } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

type DriveAnnouncementFormProps = {
  onSuccess?: () => void
  onCancel?: () => void
  driveId?: string
}

export function DriveAnnouncementForm({ onSuccess, onCancel, driveId }: DriveAnnouncementFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    urgencyLevel: "normal",
    includeImage: false,
    scheduledFor: "",
    targetAudience: "all",
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real app, this would send data to an API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Announcement created",
        description: "Your announcement has been successfully created.",
      })

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create announcement. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Megaphone className="h-5 w-5 text-red-600" />
          <CardTitle>Create Drive Announcement</CardTitle>
        </div>
        <CardDescription>
          Create an announcement for {driveId ? "this specific" : "a"} blood donation drive
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Announcement Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter announcement title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Enter announcement message"
              value={formData.message}
              onChange={handleInputChange}
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="urgencyLevel">Urgency Level</Label>
              <Select
                name="urgencyLevel"
                value={formData.urgencyLevel}
                onValueChange={(value) => handleSelectChange("urgencyLevel", value)}
              >
                <SelectTrigger id="urgencyLevel">
                  <SelectValue placeholder="Select urgency level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - Informational</SelectItem>
                  <SelectItem value="normal">Normal - Standard</SelectItem>
                  <SelectItem value="high">High - Important</SelectItem>
                  <SelectItem value="urgent">Urgent - Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Select
                name="targetAudience"
                value={formData.targetAudience}
                onValueChange={(value) => handleSelectChange("targetAudience", value)}
              >
                <SelectTrigger id="targetAudience">
                  <SelectValue placeholder="Select target audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="donors">Donors Only</SelectItem>
                  <SelectItem value="patients">Patients Only</SelectItem>
                  <SelectItem value="registered">Registered Participants</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="scheduledFor">Schedule For (Optional)</Label>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Input
                id="scheduledFor"
                name="scheduledFor"
                type="datetime-local"
                value={formData.scheduledFor}
                onChange={handleInputChange}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Leave blank to publish immediately, or set a future date and time
            </p>
          </div>

          <div className="border rounded-md p-4">
            <div className="flex items-center space-x-2">
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="includeImage" className="text-sm font-medium cursor-pointer">
                Include featured image
              </Label>
              <Input
                id="includeImage"
                name="includeImage"
                type="checkbox"
                className="h-4 w-4"
                checked={formData.includeImage}
                onChange={handleInputChange}
              />
            </div>
            {formData.includeImage && (
              <div className="mt-4 border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-1">Upload an image for your announcement</p>
                <p className="text-xs text-gray-400 mb-4">PNG, JPG or GIF (max. 2MB)</p>
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  Select Image
                </Button>
                <Input type="file" accept="image/*" className="hidden" />
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Announcement"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
