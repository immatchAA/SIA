"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar, Clock, Droplet, MapPin } from "lucide-react"
import { DashboardNav } from "@/components/dashboard-nav"
import { DashboardHeader } from "@/components/dashboard-header"

export default function RequestPage() {
  const [urgency, setUrgency] = useState("moderate")

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="flex">
        <DashboardNav />
        <main className="flex-1 p-6">
          <div className="flex flex-col space-y-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Create Blood Request</h1>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Blood Request Details</CardTitle>
                <CardDescription>Provide information about your blood needs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="blood-type">Blood Type Needed</Label>
                    <Select>
                      <SelectTrigger id="blood-type">
                        <SelectValue placeholder="Select blood type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="a-positive">A+</SelectItem>
                        <SelectItem value="a-negative">A-</SelectItem>
                        <SelectItem value="b-positive">B+</SelectItem>
                        <SelectItem value="b-negative">B-</SelectItem>
                        <SelectItem value="ab-positive">AB+</SelectItem>
                        <SelectItem value="ab-negative">AB-</SelectItem>
                        <SelectItem value="o-positive">O+</SelectItem>
                        <SelectItem value="o-negative">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="units">Units Needed</Label>
                    <Select defaultValue="1">
                      <SelectTrigger id="units">
                        <SelectValue placeholder="Select units" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Unit</SelectItem>
                        <SelectItem value="2">2 Units</SelectItem>
                        <SelectItem value="3">3 Units</SelectItem>
                        <SelectItem value="4">4+ Units</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Urgency Level</Label>
                  <RadioGroup defaultValue="moderate" onValueChange={setUrgency} className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2 rounded-md border p-3 bg-red-50">
                      <RadioGroupItem value="critical" id="critical" />
                      <Label htmlFor="critical" className="flex flex-col cursor-pointer">
                        <span className="font-medium">Critical (Emergency)</span>
                        <span className="text-sm text-muted-foreground">Need blood immediately, within hours</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border p-3 bg-amber-50">
                      <RadioGroupItem value="moderate" id="moderate" />
                      <Label htmlFor="moderate" className="flex flex-col cursor-pointer">
                        <span className="font-medium">Moderate</span>
                        <span className="text-sm text-muted-foreground">Need blood within a few days</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border p-3 bg-blue-50">
                      <RadioGroupItem value="non-urgent" id="non-urgent" />
                      <Label htmlFor="non-urgent" className="flex flex-col cursor-pointer">
                        <span className="font-medium">Non-urgent</span>
                        <span className="text-sm text-muted-foreground">Scheduled transfusion or procedure</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {urgency === "critical" && (
                  <div className="rounded-md border border-red-200 bg-red-50 p-4">
                    <div className="flex items-start">
                      <div className="mr-3 mt-0.5">
                        <Droplet className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-red-800">Emergency Mode</h4>
                        <p className="text-sm text-red-700 mt-1">
                          Emergency mode will send high-priority notifications to all compatible donors in your area.
                          Please only use this for genuine emergencies.
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Switch id="emergency-mode" />
                          <Label htmlFor="emergency-mode" className="font-medium text-sm text-red-800">
                            Activate Emergency Mode
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="location">Hospital/Treatment Location</Label>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="location" className="pl-9" placeholder="Enter hospital or treatment location" />
                    </div>
                    <Button variant="outline" type="button">
                      Use Current
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="needed-by-date">Needed By (Date)</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="needed-by-date" type="date" className="pl-9" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="needed-by-time">Needed By (Time)</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="needed-by-time" type="time" className="pl-9" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Request</Label>
                  <Select>
                    <SelectTrigger id="reason">
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="surgery">Surgery</SelectItem>
                      <SelectItem value="accident">Accident/Trauma</SelectItem>
                      <SelectItem value="cancer">Cancer Treatment</SelectItem>
                      <SelectItem value="anemia">Anemia</SelectItem>
                      <SelectItem value="childbirth">Childbirth</SelectItem>
                      <SelectItem value="other">Other Medical Condition</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additional-notes">Additional Notes</Label>
                  <Textarea
                    id="additional-notes"
                    placeholder="Provide any additional information that might be helpful for donors"
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Contact Preferences</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="contact-email" defaultChecked />
                      <Label htmlFor="contact-email">Email</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="contact-phone" defaultChecked />
                      <Label htmlFor="contact-phone">Phone</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="contact-app" defaultChecked />
                      <Label htmlFor="contact-app">In-App Messaging</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="share-contact" />
                      <Label htmlFor="share-contact">Share Contact with Donors</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button className="w-full bg-red-600 hover:bg-red-700">Submit Blood Request</Button>
                <p className="text-xs text-center text-muted-foreground">
                  By submitting this request, you confirm that all information provided is accurate and that you have a
                  genuine need for blood donation.
                </p>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

