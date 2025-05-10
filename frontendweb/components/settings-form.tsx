"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"

export function SettingsForm() {
  const { user, updateUser } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    bloodType: "",
    healthConditions: "",
  })

  useEffect(() => {
    if (user) {
      useEffect(() => {
        if (user) {
          setFormData({
            fullName: user.name || "", 
            email: user.email || "",
            phone: user.phone || "",
            address: user.address || "",
            bloodType: user.bloodType || "",
            healthConditions: user.healthConditions || "",
          })
        }
      }, [user])
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      
      if (updateUser) {
        updateUser({
          ...user,
          ...formData,
        })
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Update function is unavailable.",
        })
      }

      toast({
        title: "Success",
        description: "Your profile has been updated.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} disabled />
              <p className="text-xs text-gray-500">Email cannot be changed</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bloodType">Blood Type</Label>
              <Input id="bloodType" name="bloodType" value={formData.bloodType} onChange={handleChange} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" name="address" value={formData.address} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="healthConditions">Health Conditions</Label>
            <Textarea
              id="healthConditions"
              name="healthConditions"
              value={formData.healthConditions}
              onChange={handleChange}
              placeholder="List any health conditions that might affect your ability to donate blood"
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
