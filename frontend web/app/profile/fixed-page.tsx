"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Droplet, Edit, MapPin, Medal, Upload, Loader2 } from "lucide-react"
import { DashboardNav } from "@/components/dashboard-nav"
import { DashboardHeader } from "@/components/dashboard-header"
import { userAPI, getCurrentUser } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { setGlobalProfilePicture, getGlobalProfilePicture } from "@/lib/profileState"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  // Set up initial user data structure based on unified registration
  const [userData, setUserData] = useState({
    id: '',
    name: '', // Combined name (firstName + lastName)
    email: '',
    phone: '',
    bloodType: '',
    role: 'DONOR', // Default role
    emergencyOptIn: false,
    points: '0',
    createdAt: '',
    latitude: 0,
    longitude: 0,
    profilePicture: '',
    // New fields from unified registration
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    age: '',
    weight: '',
    height: '',
    gender: '',
    isNewUser: true
  })
  
  // Form data tracks editable fields
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bloodType: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    age: '',
    weight: '',
    height: '',
    gender: '',
    emergencyOptIn: false,
  })
  
  const router = useRouter()
  const { toast } = useToast()
  const localUser = getCurrentUser()
  
  // Get initials for avatar fallback
  const getInitials = (name) => {
    if (!name) return 'U'
    
    // Try to split by space for first and last name
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    
    // If we have firstName and lastName separately
    if (userData.firstName && userData.lastName) {
      return (userData.firstName[0] + userData.lastName[0]).toUpperCase()
    }
    
    // Fallback to first two letters
    return name.substring(0, 2).toUpperCase()
  }
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }
  
  // State for profile picture
  const [profileImage, setProfileImage] = useState(null)
  const fileInputRef = useRef(null)
  
  // Check if user is authenticated
  useEffect(() => {
    if (!localUser) {
      router.push('/login')
      return
    }
    
    fetchUserData()
  }, [])
  
  // Fetch user data from backend
  const fetchUserData = async () => {
    setIsLoading(true)
    try {
      // Get profile data from our API
      const profileData = await userAPI.getCurrentUserProfile()
      
      // If we have firstName/lastName fields (from unified registration)
      const displayName = (profileData.firstName && profileData.lastName) 
        ? `${profileData.firstName} ${profileData.lastName}`
        : profileData.name || 'User'
      
      // Update our state with complete data
      setUserData({
        ...profileData,
        name: displayName // Make sure name is always populated
      })
      
      // Set form data from profile
      setFormData({
        firstName: profileData.firstName || (profileData.name ? profileData.name.split(' ')[0] : ''),
        lastName: profileData.lastName || (profileData.name ? profileData.name.split(' ')[1] || '' : ''),
        email: profileData.email || '',
        phone: profileData.phone || '',
        bloodType: profileData.bloodType || '',
        address: profileData.address || '',
        city: profileData.city || '',
        state: profileData.state || '',
        zipCode: profileData.zipCode || '',
        age: profileData.age || '',
        weight: profileData.weight || '',
        height: profileData.height || '',
        gender: profileData.gender || '',
        emergencyOptIn: profileData.emergencyOptIn || false,
      })
      
      // Try to get profile picture from global state first
      let profilePic = getGlobalProfilePicture();
      
      // If not in global state, try localStorage
      if (!profilePic) {
        profilePic = localStorage.getItem(`profilePicture_${profileData.id}`) ||
                    localStorage.getItem('globalProfilePicture');
      }
      
      // If found in either place, set it locally and globally
      if (profilePic) {
        setProfileImage(profilePic);
        setGlobalProfilePicture(profilePic);
      } else if (profileData.profilePicture) {
        // If it's in the user data from backend
        setProfileImage(profileData.profilePicture);
        setGlobalProfilePicture(profileData.profilePicture);
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
      toast({
        title: 'Error loading profile',
        description: error instanceof Error ? error.message : 'Failed to load your profile data',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  // Handle checkbox changes
  const handleCheckboxChange = (name, checked) => {
    setFormData(prev => ({ ...prev, [name]: checked }))
  }
  
  // Handle select changes
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  // Handle save profile
  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      // Combine first and last name for the name field
      const fullName = `${formData.firstName} ${formData.lastName}`.trim()
      
      // Create updated profile with all fields
      const updatedProfile = {
        ...userData,
        ...formData,
        name: fullName,
      }
      
      // Store in localStorage for immediate access
      localStorage.setItem(`profile_${userData.id}`, JSON.stringify(updatedProfile))
      
      // Also update the user object
      const user = getCurrentUser()
      if (user) {
        const updatedUser = {
          ...user,
          name: fullName,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          bloodType: formData.bloodType
        }
        localStorage.setItem('user', JSON.stringify(updatedUser))
      }
      
      // If we have a profile picture, save it
      if (profileImage) {
        localStorage.setItem(`profilePicture_${userData.id}`, profileImage)
        localStorage.setItem('globalProfilePicture', profileImage)
        setGlobalProfilePicture(profileImage)
      }
      
      // Attempt to save to backend if available
      try {
        await userAPI.updateUserProfile(updatedProfile)
      } catch (error) {
        console.error('Failed to save profile to backend, but saved locally:', error)
      }
      
      // Update local state
      setUserData(updatedProfile)
      setIsEditing(false)
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      })
    } catch (error) {
      console.error('Failed to save profile:', error)
      toast({
        title: 'Error saving profile',
        description: error instanceof Error ? error.message : 'Failed to save your profile data',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }
  
  // Handle profile picture selection
  const handleProfilePictureClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }
  
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result)
        // Don't set global profile picture yet, wait until save
      }
      reader.readAsDataURL(file)
    }
  }
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-red-600 mb-4" />
        <h2 className="text-xl font-medium">Loading your profile...</h2>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="flex">
        <DashboardNav />
        <main className="flex-1 p-6">
          <div className="flex flex-col space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">My Profile</h1>
              <Button 
                onClick={() => { 
                  if (isEditing) {
                    handleSaveProfile()
                  } else {
                    setIsEditing(true)
                  }
                }}
                className={isEditing ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : isEditing ? (
                  <>Save Changes</>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Summary Card */}
              <Card className="md:col-span-1">
                <CardHeader className="pb-0">
                  <div onClick={handleProfilePictureClick} className="relative mx-auto cursor-pointer">
                    <Avatar className="h-24 w-24 mx-auto">
                      <AvatarImage 
                        src={profileImage || "/placeholder.svg"} 
                        alt="Profile" 
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-red-100 text-red-600 text-2xl">
                        {getInitials(userData.name)}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                        <Upload className="h-6 w-6 text-white" />
                      </div>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleProfilePictureChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                  <CardTitle className="text-center mt-4">{userData.name}</CardTitle>
                  <CardDescription className="text-center">
                    {userData.email}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      <Badge variant="outline" className="bg-red-50 text-red-600 hover:bg-red-50">
                        {userData.role || 'DONOR'}
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <Droplet className="h-4 w-4 mr-2 text-red-600" />
                        <span className="text-muted-foreground">Blood Type:</span>
                        <span className="ml-auto font-medium">{userData.bloodType || 'Not specified'}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-red-600" />
                        <span className="text-muted-foreground">Location:</span>
                        <span className="ml-auto font-medium truncate max-w-[150px]">
                          {userData.city ? `${userData.city}, ${userData.state}` : 'Not specified'}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Medal className="h-4 w-4 mr-2 text-red-600" />
                        <span className="text-muted-foreground">Donor Status:</span>
                        <span className="ml-auto font-medium">New</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2 text-red-600" />
                        <span className="text-muted-foreground">Member Since:</span>
                        <span className="ml-auto font-medium">{formatDate(userData.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Personal Information Card */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details and contact information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">Zip Code</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Health Information Card */}
              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle>Health Information</CardTitle>
                  <CardDescription>Provide your health details for donation eligibility</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="bloodType">Blood Type</Label>
                      <Select
                        disabled={!isEditing}
                        value={formData.bloodType}
                        onValueChange={(value) => handleSelectChange('bloodType', value)}
                      >
                        <SelectTrigger id="bloodType">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input
                        id="height"
                        name="height"
                        value={formData.height}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        disabled={!isEditing}
                        value={formData.gender}
                        onValueChange={(value) => handleSelectChange('gender', value)}
                      >
                        <SelectTrigger id="gender">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="emergencyOptIn">Available for Emergency Donations</Label>
                        <Switch
                          id="emergencyOptIn"
                          checked={formData.emergencyOptIn}
                          onCheckedChange={(checked) => handleCheckboxChange('emergencyOptIn', checked)}
                          disabled={!isEditing}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Opt-in to receive emergency blood donation requests in your area
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-muted-foreground">
                    Your health information is used to determine your eligibility for blood donation. Please keep this
                    information up to date.
                  </p>
                </CardFooter>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
