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
import { bloodRequestAPI } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

export default function RequestPage() {
  // Form state
  const [bloodType, setBloodType] = useState("")
  const [units, setUnits] = useState("1")
  const [urgency, setUrgency] = useState("moderate")
  const [hospital, setHospital] = useState("")
  const [location, setLocation] = useState("")
  const [neededByDate, setNeededByDate] = useState("")
  const [neededByTime, setNeededByTime] = useState("")
  const [reason, setReason] = useState("")
  const [notes, setNotes] = useState("")
  const [contactEmail, setContactEmail] = useState(true)
  const [contactPhone, setContactPhone] = useState(true)
  const [contactApp, setContactApp] = useState(true)
  const [shareContact, setShareContact] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emergencyMode, setEmergencyMode] = useState(false)
  
  const { toast } = useToast()
  
  // Handle form submission
  const handleSubmitRequest = async () => {
    console.log('Submit button clicked!');
    
    // Debug information
    console.log('Form data:', {
      bloodType,
      units,
      urgency,
      hospital,
      location,
      neededByDate,
      neededByTime,
      reason,
      notes,
      contactEmail,
      contactPhone,
      contactApp,
      shareContact,
      emergencyMode: urgency === "critical" && emergencyMode
    });
    // Validate form
    if (!bloodType) {
      toast({
        title: "Error",
        description: "Please select a blood type",
        variant: "destructive"
      })
      return
    }
    
    if (!hospital) {
      toast({
        title: "Error",
        description: "Please enter a hospital or medical facility",
        variant: "destructive"
      })
      return
    }
    
    if (!reason) {
      toast({
        title: "Error",
        description: "Please select a reason for the request",
        variant: "destructive"
      })
      return
    }
    
    // Set submitting state
    setIsSubmitting(true)
    
    try {
      // Prepare request data
      const bloodRequestData = {
        bloodType,
        units: parseInt(units),
        urgency,
        hospital,
        location,
        neededByDate,
        neededByTime,
        reason,
        notes,
        contactPreferences: {
          email: contactEmail,
          phone: contactPhone,
          app: contactApp,
          shareContact
        },
        emergencyMode: urgency === "critical" && emergencyMode
      }
      
      // Submit request to API
      console.log('Calling API with data:', bloodRequestData);
      try {
        const response = await bloodRequestAPI.submitBloodRequest(bloodRequestData);
        console.log('API response:', response);
        
        if (response.success) {
          toast({
            title: "Success",
            description: "Your blood request has been submitted successfully",
          });
          
          // Reset form
          setBloodType("");
          setUnits("1");
          setUrgency("moderate");
          setHospital("");
          setLocation("");
          setNeededByDate("");
          setNeededByTime("");
          setReason("");
          setNotes("");
          setEmergencyMode(false);
        } else {
          toast({
            title: "Error",
            description: response.error || "Failed to submit blood request",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error in API call:', error);
        toast({
          title: "Error",
          description: "Failed to connect to the server",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error submitting blood request:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

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
                    <Select value={bloodType} onValueChange={setBloodType}>
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
                    <Select value={units} onValueChange={setUnits}>
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
                          <Switch 
                            id="emergency-mode" 
                            checked={emergencyMode}
                            onCheckedChange={setEmergencyMode}
                          />
                          <Label htmlFor="emergency-mode" className="font-medium text-sm text-red-800">
                            Activate Emergency Mode
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="hospital">Hospital/Medical Facility</Label>
                  <Input 
                    id="hospital" 
                    placeholder="Enter hospital or medical facility name" 
                    value={hospital}
                    onChange={(e) => setHospital(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location/Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="location" 
                      placeholder="Enter location" 
                      className="pl-9" 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="needed-by-date">Needed By (Date)</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="needed-by-date" 
                        type="date" 
                        className="pl-9" 
                        value={neededByDate}
                        onChange={(e) => setNeededByDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="needed-by-time">Needed By (Time)</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="needed-by-time" 
                        type="time" 
                        className="pl-9" 
                        value={neededByTime}
                        onChange={(e) => setNeededByTime(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Request</Label>
                  <Select value={reason} onValueChange={setReason}>
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
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Contact Preferences</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="contact-email" 
                        checked={contactEmail} 
                        onCheckedChange={setContactEmail} 
                      />
                      <Label htmlFor="contact-email">Email</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="contact-phone" 
                        checked={contactPhone} 
                        onCheckedChange={setContactPhone} 
                      />
                      <Label htmlFor="contact-phone">Phone</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="contact-app" 
                        checked={contactApp} 
                        onCheckedChange={setContactApp} 
                      />
                      <Label htmlFor="contact-app">In-App Messaging</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="share-contact" 
                        checked={shareContact} 
                        onCheckedChange={setShareContact} 
                      />
                      <Label htmlFor="share-contact">Share Contact with Donors</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  className="w-full bg-red-600 hover:bg-red-700" 
                  onClick={handleSubmitRequest}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Blood Request"}
                </Button>
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

