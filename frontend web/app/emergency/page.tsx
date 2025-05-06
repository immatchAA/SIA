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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AlertCircle, AlertTriangle, Clock, Droplet, Heart, MapPin } from "lucide-react"
import { DashboardNav } from "@/components/dashboard-nav"
import { DashboardHeader } from "@/components/dashboard-header"

export default function EmergencyPage() {
  const [emergencyMode, setEmergencyMode] = useState(false)
  const [emergencyType, setEmergencyType] = useState("personal")

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="flex">
        <DashboardNav />
        <main className="flex-1 p-6">
          <div className="flex flex-col space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Emergency Mode</h1>
              <Badge className={emergencyMode ? "bg-red-600" : "bg-gray-600"}>
                {emergencyMode ? "Active" : "Inactive"}
              </Badge>
            </div>

            <Alert
              variant={emergencyMode ? "destructive" : "default"}
              className={emergencyMode ? "border-red-600 bg-red-50" : ""}
            >
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{emergencyMode ? "Emergency Mode is Active" : "Emergency Mode is Inactive"}</AlertTitle>
              <AlertDescription>
                {emergencyMode
                  ? "Your emergency blood request is being sent to all compatible donors in your area. This mode should only be used for genuine medical emergencies."
                  : "Emergency Mode sends high-priority notifications to all compatible donors in your area. Please only activate for genuine medical emergencies."}
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle>Emergency Blood Request</CardTitle>
                <CardDescription>
                  Use this feature only in critical situations when blood is needed urgently
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Switch
                    id="emergency-mode-toggle"
                    checked={emergencyMode}
                    onCheckedChange={setEmergencyMode}
                    className={emergencyMode ? "data-[state=checked]:bg-red-600" : ""}
                  />
                  <Label htmlFor="emergency-mode-toggle" className="font-medium text-base">
                    {emergencyMode ? "Deactivate Emergency Mode" : "Activate Emergency Mode"}
                  </Label>
                </div>

                <div className="rounded-md border border-red-200 bg-red-50 p-4">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-red-800">Important Notice</h4>
                      <p className="text-sm text-red-700 mt-1">
                        Emergency Mode should only be used for genuine medical emergencies requiring immediate blood
                        donation. Misuse of this feature may result in account restrictions.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Emergency Type</Label>
                  <RadioGroup
                    defaultValue="personal"
                    onValueChange={setEmergencyType}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <RadioGroupItem value="personal" id="personal" />
                      <Label htmlFor="personal" className="flex flex-col cursor-pointer">
                        <span className="font-medium">Personal Emergency</span>
                        <span className="text-sm text-muted-foreground">
                          You or a family member needs blood urgently
                        </span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <RadioGroupItem value="hospital" id="hospital" />
                      <Label htmlFor="hospital" className="flex flex-col cursor-pointer">
                        <span className="font-medium">Hospital Request</span>
                        <span className="text-sm text-muted-foreground">
                          You're requesting on behalf of a hospital or medical facility
                        </span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <RadioGroupItem value="disaster" id="disaster" />
                      <Label htmlFor="disaster" className="flex flex-col cursor-pointer">
                        <span className="font-medium">Disaster Response</span>
                        <span className="text-sm text-muted-foreground">
                          Blood needed for multiple victims of a disaster or accident
                        </span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

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
                    <Select defaultValue="2">
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

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Emergency</Label>
                  <Select>
                    <SelectTrigger id="reason">
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="surgery">Emergency Surgery</SelectItem>
                      <SelectItem value="accident">Accident/Trauma</SelectItem>
                      <SelectItem value="hemorrhage">Hemorrhage</SelectItem>
                      <SelectItem value="childbirth">Childbirth Complications</SelectItem>
                      <SelectItem value="disaster">Natural Disaster</SelectItem>
                      <SelectItem value="other">Other Medical Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additional-notes">Additional Information</Label>
                  <Textarea
                    id="additional-notes"
                    placeholder="Provide any additional information that might help donors understand the urgency"
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-name">Emergency Contact Name</Label>
                  <Input id="contact-name" placeholder="Name of person to contact at the location" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="contact-phone">Emergency Contact Phone</Label>
                    <Input id="contact-phone" type="tel" placeholder="Phone number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-role">Contact's Role</Label>
                    <Select>
                      <SelectTrigger id="contact-role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="doctor">Doctor</SelectItem>
                        <SelectItem value="nurse">Nurse</SelectItem>
                        <SelectItem value="staff">Hospital Staff</SelectItem>
                        <SelectItem value="family">Family Member</SelectItem>
                        <SelectItem value="patient">Patient</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button
                  className={`w-full ${emergencyMode ? "bg-gray-600 hover:bg-gray-700" : "bg-red-600 hover:bg-red-700"}`}
                  onClick={() => setEmergencyMode(!emergencyMode)}
                >
                  {emergencyMode ? "Deactivate Emergency Mode" : "Activate Emergency Mode"}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  By activating Emergency Mode, you confirm that this is a genuine medical emergency requiring immediate
                  blood donation.
                </p>
              </CardFooter>
            </Card>

            {emergencyMode && (
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-red-800">Active Emergency Response</CardTitle>
                  <CardDescription className="text-red-700">Your emergency request is being processed</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="bg-red-100 p-2 rounded-full">
                        <Clock className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">Request Time</p>
                        <p className="text-sm text-red-700">Just now</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="bg-red-100 p-2 rounded-full">
                        <Droplet className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">Blood Type</p>
                        <p className="text-sm text-red-700">O-</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="bg-red-100 p-2 rounded-full">
                        <Heart className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">Response Status</p>
                        <p className="text-sm text-red-700">Searching for donors...</p>
                      </div>
                    </div>
                  </div>

                  <div className="border border-red-200 rounded-lg p-4">
                    <h3 className="font-medium text-red-800 mb-2">Nearby Potential Donors</h3>
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback className="bg-red-100 text-red-600">
                                {i === 1 ? "JS" : i === 2 ? "LM" : "RK"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {i === 1 ? "James Smith" : i === 2 ? "Lisa Miller" : "Robert Kim"}
                              </p>
                              <div className="flex items-center text-sm text-muted-foreground space-x-2">
                                <Badge variant="outline" className="text-xs bg-red-50 text-red-600 hover:bg-red-50">
                                  {i === 1 ? "O-" : i === 2 ? "O-" : "O-"}
                                </Badge>
                                <div className="flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  <span>{i === 1 ? "1.2 miles" : i === 2 ? "2.5 miles" : "3.8 miles"}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Badge className={i === 1 ? "bg-green-600" : i === 2 ? "bg-amber-500" : "bg-gray-500"}>
                            {i === 1 ? "Responding" : i === 2 ? "Notified" : "Pending"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Alert className="border-amber-200 bg-amber-50">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <AlertTitle className="text-amber-800">Important Reminder</AlertTitle>
                    <AlertDescription className="text-amber-700">
                      Emergency Mode will automatically deactivate after 4 hours or when you manually deactivate it. You
                      can extend the emergency period if needed.
                    </AlertDescription>
                  </Alert>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full border-red-200 text-red-600 hover:bg-red-100 hover:text-red-700"
                  >
                    Deactivate Emergency Mode
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

