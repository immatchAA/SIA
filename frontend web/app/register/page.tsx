"use client"

import { useState, useEffect, FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { authAPI } from "@/lib/api"
import { CheckCircle, Droplet } from "lucide-react"

export default function RegisterPage() {
  // Form state
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    // Common fields
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    bloodType: "",
    latitude: 0,
    longitude: 0,
    emergencyOptIn: false,
  })
  
  const router = useRouter()
  const { toast } = useToast()
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }
  
  // Handle checkbox changes
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  }
  
  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  }
  
  // Add geolocation support
  const getLocation = () => {
    if (navigator.geolocation) {
      setLoading(true)
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }))
          
          toast({
            title: "Location saved",
            description: "Your current location has been saved.",
          })
          
          setLoading(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          
          toast({
            title: "Location error",
            description: "Could not get your location. Please enter it manually or try again.",
            variant: "destructive"
          })
          
          setLoading(false)
        }
      )
    } else {
      toast({
        title: "Geolocation not supported",
        description: "Your browser does not support geolocation. Please enter your location manually.",
        variant: "destructive"
      })
    }
  }
  
  // Form submission handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password error",
        description: "Passwords do not match. Please try again.",
        variant: "destructive"
      })
      return
    }
    
    setLoading(true)
    
    try {
      // Prepare data for API
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        bloodType: formData.bloodType,
        phone: formData.phone,
        latitude: formData.latitude,
        longitude: formData.longitude,
        emergencyOptIn: formData.emergencyOptIn,
        role: "DONOR" // Default role is DONOR for simplicity
      }
      
      console.log("Registering user with data:", userData)
      
      // Call the registerUser API function
      const response = await authAPI.registerUser(userData)
      
      if (response && response.success) {
        toast({
          title: "Registration successful",
          description: "Your account has been created. Please log in.",
        })
        
        // Redirect to login page
        setTimeout(() => {
          router.push('/login')
        }, 1500)
      } else {
        toast({
          title: "Registration failed",
          description: response.error || "There was an error creating your account. Please try again.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Registration error:", error)
      
      toast({
        title: "Registration error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-8 bg-gray-50">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center text-red-600">
                <Droplet className="mr-2 h-6 w-6" />
                <span className="text-xl font-bold">RedWeb</span>
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Create an account</CardTitle>
            <CardDescription className="text-center">
              Join RedWeb to help save lives through blood donations
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    name="firstName" 
                    value={formData.firstName} 
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    name="lastName" 
                    value={formData.lastName} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  type="tel" 
                  value={formData.phone} 
                  onChange={handleInputChange} 
                  placeholder="+63 XXX XXX XXXX"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bloodType">Blood Type</Label>
                <Select 
                  value={formData.bloodType}
                  onValueChange={(value) => handleSelectChange("bloodType", value)}
                >
                  <SelectTrigger id="bloodType">
                    <SelectValue placeholder="Select your blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A_POSITIVE">A+</SelectItem>
                    <SelectItem value="A_NEGATIVE">A-</SelectItem>
                    <SelectItem value="B_POSITIVE">B+</SelectItem>
                    <SelectItem value="B_NEGATIVE">B-</SelectItem>
                    <SelectItem value="AB_POSITIVE">AB+</SelectItem>
                    <SelectItem value="AB_NEGATIVE">AB-</SelectItem>
                    <SelectItem value="O_POSITIVE">O+</SelectItem>
                    <SelectItem value="O_NEGATIVE">O-</SelectItem>
                    <SelectItem value="UNKNOWN">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="emergencyOptIn" 
                  checked={formData.emergencyOptIn} 
                  onCheckedChange={(checked) => handleCheckboxChange("emergencyOptIn", checked === true)}
                />
                <label
                  htmlFor="emergencyOptIn"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Contact me for emergency donations
                </label>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="location">Location</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={getLocation}
                    className="text-xs"
                    disabled={loading}
                  >
                    {loading ? "Getting Location..." : "Get Current Location"}
                  </Button>
                </div>
                
                {/* Hidden inputs to store coordinates */}
                <input 
                  type="hidden" 
                  id="latitude" 
                  name="latitude" 
                  value={formData.latitude || ""} 
                />
                <input 
                  type="hidden" 
                  id="longitude" 
                  name="longitude" 
                  value={formData.longitude || ""} 
                />
                
                {formData.latitude && formData.longitude ? (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md text-green-600 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" /> 
                    <span>
                      <span className="font-medium">Location saved</span>
                      <p className="text-xs text-green-600">Your location will be used to match you with nearby donation requests</p>
                    </span>
                  </div>
                ) : (
                  <div className="mt-2 p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-500 text-sm">
                    Your location helps nearby patients find donors when they need blood urgently
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    name="password" 
                    type="password" 
                    value={formData.password} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    type="password" 
                    value={formData.confirmPassword} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="terms" required />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the{" "}
                  <Link href="/terms" className="text-red-600 hover:text-red-800">
                    terms and conditions
                  </Link>
                </label>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-red-600 hover:text-red-800 font-medium">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
