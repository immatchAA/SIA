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
  const [userData, setUserData] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    bloodType: '',
    role: '',
    emergencyOptIn: false,
    points: '0',
    createdAt: '',
    latitude: 0,
    longitude: 0,
    profilePicture: ''
  })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bloodType: '',
    emergencyOptIn: false,
  })
  
  const router = useRouter()
  const { toast } = useToast()
  const localUser = getCurrentUser()
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }
  
  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }
  
  // State for profile picture
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
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
      // Get user profile data with fallbacks for each field
      const profileData = await userAPI.getCurrentUserProfile()
      
      // Log the profile data for debugging
      console.log('Profile data received:', profileData)
      
      // Set complete user data with fallbacks
      const completeUserData = {
        ...profileData,
        name: profileData.name || `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim() || 'New User',
        email: profileData.email || '',
        phone: profileData.phone || '',
        bloodType: profileData.bloodType || '',
        emergencyOptIn: profileData.emergencyOptIn || false,
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        address: profileData.address || '',
        city: profileData.city || '',
        state: profileData.state || '',
        zipCode: profileData.zipCode || '',
        gender: profileData.gender || '',
        age: profileData.age || '',
        weight: profileData.weight || '',
        height: profileData.height || '',
      }
      
      // Set in component state
      setUserData(completeUserData)
      
      // Set form data for editing
      setFormData({
        name: completeUserData.name,
        email: completeUserData.email,
        phone: completeUserData.phone,
        bloodType: completeUserData.bloodType,
        emergencyOptIn: completeUserData.emergencyOptIn,
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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  // Handle checkbox changes
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }))
  }
  
  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  // Handle save profile
  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      // Here you would normally upload the profile image to a server
      // and get back a URL to store in the user profile
      // For now, we'll just simulate this by storing the base64 image
      // in local storage and updating the user object
      
      // In a real implementation, you would:
      // 1. Upload the image to a server (e.g., AWS S3)
      // 2. Get back the URL of the uploaded image
      // 3. Include that URL in the userData update
      
      // For demonstration, we're using a base64 string, but in production
      // you'd want to store a URL to the image on your server
      const profilePictureData = profileImage || userData.profilePicture;
      
      const updatedUser = await userAPI.updateUserProfile(userData.id, {
        ...userData,
        name: formData.name,
        phone: formData.phone,
        bloodType: formData.bloodType,
        emergencyOptIn: formData.emergencyOptIn,
        profilePicture: profilePictureData,
      })
      
      // Update the profile picture in the global state manager
      if (profileImage) {
        // Set in global state manager - this will notify all subscribers
        setGlobalProfilePicture(profileImage);
        
        // Also save to localStorage as backup
        localStorage.setItem(`profilePicture_${userData.id}`, profileImage);
        localStorage.setItem('globalProfilePicture', profileImage);
        
        console.log('Profile saved with picture to global state');
        
        // Force refresh the page to ensure all components update
        toast({
          title: 'Profile updated',
          description: 'Your profile has been updated successfully. Refreshing page...',
        })
        
        // Refresh after short delay
        setTimeout(() => {
          window.location.reload();
        }, 1500);
        
        return; // Stop execution after scheduling the refresh
      }
      
      setUserData(updatedUser)
      setIsEditing(false)
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      })
    } catch (error) {
      toast({
        title: 'Error updating profile',
        description: error instanceof Error ? error.message : 'Failed to update your profile',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
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
                variant={isEditing ? "default" : "outline"}
                className={isEditing ? "bg-red-600 hover:bg-red-700" : ""}
                onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                disabled={isLoading || isSaving}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : isEditing ? (
                  isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </>
                )}
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {/* Profile Summary Card */}
              <Card className="md:col-span-1">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarImage 
                          src={profileImage || "/placeholder.svg?height=96&width=96"} 
                          alt="Profile" 
                          className="object-cover" 
                          style={{ objectFit: 'cover' }}
                        />
                        <AvatarFallback className="bg-red-100 text-red-600 text-2xl">{getInitials(userData.name)}</AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <>
                          <input 
                            type="file" 
                            ref={fileInputRef}
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                // Check if it's an image file
                                if (!file.type.startsWith('image/')) {
                                  toast({
                                    title: 'Invalid file type',
                                    description: 'Please upload an image file',
                                    variant: 'destructive'
                                  });
                                  return;
                                }
                                
                                // Size limit (5MB)
                                if (file.size > 5 * 1024 * 1024) {
                                  toast({
                                    title: 'File too large',
                                    description: 'Please upload an image smaller than 5MB',
                                    variant: 'destructive'
                                  });
                                  return;
                                }
                                
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  const imageData = reader.result as string;
                                  
                                  // Update global state manager first
                                  setGlobalProfilePicture(imageData);
                                  
                                  // Update local state
                                  setProfileImage(imageData);
                                  
                                  // Save to localStorage with multiple keys to ensure visibility
                                  if (userData.id) {
                                    // Save to all possible storage locations for maximum compatibility
                                    localStorage.setItem(`profilePicture_${userData.id}`, imageData);
                                    localStorage.setItem('currentUserProfilePicture', imageData);
                                    localStorage.setItem('globalProfilePicture', imageData);
                                    localStorage.setItem('lastUploadedProfilePicture', imageData);
                                    localStorage.setItem(`user_${userData.id}_profilePicture`, imageData);
                                    
                                    if (userData.email) {
                                      localStorage.setItem(`user_${userData.email}_profilePicture`, imageData);
                                    }
                                    
                                    console.log('Profile picture saved to all storage locations');
                                    
                                    // Force a full DOM refresh to update all components
                                    // This is a brute force approach but should work in all cases
                                    toast({
                                      title: 'Profile picture updated',
                                      description: 'Your profile picture has been updated successfully.',
                                    });
                                    
                                    // After a short delay to allow storage to complete, refresh the page
                                    setTimeout(() => {
                                      window.location.reload();
                                    }, 1500);
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                          <div 
                            className="absolute bottom-0 right-0 bg-white rounded-full p-1 border border-gray-200 cursor-pointer hover:bg-gray-100"
                            onClick={() => fileInputRef.current?.click()}
                            title="Upload profile picture"
                          >
                            <Upload className="h-4 w-4 text-gray-500" />
                          </div>
                        </>
                      )}
                    </div>
                    <div className="text-center">
                      <h2 className="text-xl font-bold">{userData.name || 'Loading...'}</h2>
                      <p className="text-sm text-muted-foreground">
                        {userData.role === 'DONOR' ? 'Donor' : 'Patient'} since {formatDate(userData.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-red-600 hover:bg-red-700">{userData.bloodType || 'Unknown'}</Badge>
                      {userData.role === 'DONOR' && (
                        <Badge variant="outline" className="bg-red-50 text-red-600 hover:bg-red-50">
                          <Medal className="h-3 w-3 mr-1" />
                          {parseInt(userData.points || '0') > 30 ? 'Gold Donor' : 
                            parseInt(userData.points || '0') > 15 ? 'Silver Donor' : 'Bronze Donor'}
                        </Badge>
                      )}
                    </div>
                    <div className="w-full space-y-2 pt-4 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <Droplet className="h-4 w-4 mr-2 text-red-600" />
                          <span>Total Donations</span>
                        </div>
                        <span className="font-medium">{Math.floor(parseInt(userData.points || '0') / 5)}</span>
                      </div>
                      {parseInt(userData.points || '0') > 0 ? (
                        <>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-red-600" />
                              <span>Last Donation</span>
                            </div>
                            <span className="font-medium">March 15, 2024</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-red-600" />
                              <span>Next Eligible</span>
                            </div>
                            <span className="font-medium">June 15, 2024</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-red-600" />
                              <span>Preferred Location</span>
                            </div>
                            <span className="font-medium">City Hospital</span>
                          </div>
                        </>
                      ) : userData.role === 'DONOR' ? (
                        // Show suggestions for new donors with 0 donations
                        <div className="mt-4 p-3 bg-red-50 rounded-md border border-red-100">
                          <h4 className="font-medium text-red-700 mb-1">Ready to make your first donation?</h4>
                          <p className="text-xs text-red-600 mb-2">Here are some upcoming donation drives:</p>
                          <ul className="text-xs space-y-2">
                            <li className="flex items-start">
                              <Calendar className="h-3 w-3 mr-1 text-red-600 mt-0.5" />
                              <div>
                                <span className="font-medium">City Hospital Blood Drive</span>
                                <p className="text-gray-600">April 25, 2025 • 5 miles away</p>
                              </div>
                            </li>
                            <li className="flex items-start">
                              <Calendar className="h-3 w-3 mr-1 text-red-600 mt-0.5" />
                              <div>
                                <span className="font-medium">Community Center Drive</span>
                                <p className="text-gray-600">May 2, 2025 • 3 miles away</p>
                              </div>
                            </li>
                          </ul>
                          <Button className="w-full mt-2 h-7 text-xs bg-red-600 hover:bg-red-700">
                            View All Donation Drives
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Details Card */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Manage your personal details and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full-name">Full Name</Label>
                      <Input 
                        id="full-name" 
                        name="name"
                        value={formData.name} 
                        onChange={handleInputChange}
                        disabled={!isEditing || isLoading} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={userData.email} 
                        disabled 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        name="phone"
                        type="tel" 
                        value={formData.phone} 
                        onChange={handleInputChange}
                        disabled={!isEditing || isLoading} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="blood-type">Blood Type</Label>
                      <Select 
                        value={formData.bloodType} 
                        onValueChange={(value) => handleSelectChange('bloodType', value)}
                        disabled={!isEditing || isLoading}>
                      
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
                  </div>

                  <div className="space-y-2">
                    <Label>Availability for Donation</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch id="weekdays" defaultChecked disabled={!isEditing} />
                        <Label htmlFor="weekdays">Weekdays</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="emergency-opt-in" 
                          checked={formData.emergencyOptIn} 
                          onCheckedChange={(checked) => handleCheckboxChange('emergencyOptIn', checked as boolean)}
                          disabled={!isEditing || isLoading || userData.role !== 'DONOR'} 
                        />
                        <Label htmlFor="emergency-opt-in">Available for emergency donations</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="mornings" defaultChecked disabled={!isEditing} />
                        <Label htmlFor="mornings">Mornings</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="evenings" disabled={!isEditing} />
                        <Label htmlFor="evenings">Evenings</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Health Information Card */}
              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle>Health Information</CardTitle>
                  <CardDescription>Your health status and donation eligibility</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Medical Conditions</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="allergies">Allergies</Label>
                          <Switch id="allergies" disabled={!isEditing} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="diabetes">Diabetes</Label>
                          <Switch id="diabetes" disabled={!isEditing} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="heart-disease">Heart Disease</Label>
                          <Switch id="heart-disease" disabled={!isEditing} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="hypertension">Hypertension</Label>
                          <Switch id="hypertension" disabled={!isEditing} />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-medium">Current Medications</h3>
                      <Textarea
                        placeholder="List any medications you are currently taking"
                        className="h-[120px]"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Recent Health Changes</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="recent-illness">Recent Illness (last 14 days)</Label>
                        <Switch id="recent-illness" disabled={!isEditing} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="recent-surgery">Recent Surgery (last 6 months)</Label>
                        <Switch id="recent-surgery" disabled={!isEditing} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="recent-tattoo">Recent Tattoo (last 3 months)</Label>
                        <Switch id="recent-tattoo" disabled={!isEditing} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="recent-travel">Recent Travel to Risk Areas</Label>
                        <Switch id="recent-travel" disabled={!isEditing} />
                      </div>
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

              {/* Notification Preferences Card */}
              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage how you receive alerts and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Blood Request Notifications</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email-notifications">Email</Label>
                          <Switch id="email-notifications" defaultChecked disabled={!isEditing} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="sms-notifications">SMS</Label>
                          <Switch id="sms-notifications" defaultChecked disabled={!isEditing} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="app-notifications">App Notifications</Label>
                          <Switch id="app-notifications" defaultChecked disabled={!isEditing} />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-medium">Donation Drive Alerts</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="drive-email">Email</Label>
                          <Switch id="drive-email" defaultChecked disabled={!isEditing} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="drive-sms">SMS</Label>
                          <Switch id="drive-sms" disabled={!isEditing} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="drive-app">App Notifications</Label>
                          <Switch id="drive-app" defaultChecked disabled={!isEditing} />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-medium">Emergency Alerts</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="emergency-email">Email</Label>
                          <Switch id="emergency-email" defaultChecked disabled={!isEditing} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="emergency-sms">SMS</Label>
                          <Switch id="emergency-sms" defaultChecked disabled={!isEditing} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="emergency-app">App Notifications</Label>
                          <Switch id="emergency-app" defaultChecked disabled={!isEditing} />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

