"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { authAPI } from "@/lib/api"
import { testLogin } from "@/lib/testAuth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Droplet } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [userType, setUserType] = useState("donor")
  const router = useRouter()
  const { toast } = useToast()

  // Check if user is already logged in
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    if (authToken && user) {
      console.log('User already logged in, redirecting to dashboard');
      // Redirect to dashboard with full page refresh
      window.location.href = '/dashboard';
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    console.log('Attempting login with:', email)
    
    // Try test account login first using our dedicated utility
    const testResult = testLogin(email, password);
    
    // If test login succeeded, handle success and return early
    if (testResult.success) {
      console.log('TEST ACCOUNT LOGIN SUCCESSFUL!');
      
      // Notify success
      toast({
        title: "Test Account Login",
        description: "You are now logged in as a test user."
      });
      
      // Redirect to dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
      
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.login(email, password)
      
      // Store the token and user info in localStorage directly
      localStorage.setItem('authToken', response.accessToken);
      const userData = {
        id: response.userId,
        email: response.email,
        role: response.role,
        name: `${response.firstName} ${response.lastName}`
      };
      localStorage.setItem('user', JSON.stringify(userData))
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${response.firstName || ''} ${response.lastName || ''}!`,
      })
      
      // Use direct navigation with page refresh to ensure clean state
      window.location.href = '/dashboard'
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An error occurred during login",
        variant: "destructive"
      })
      console.error("Login error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <Link href="/" className="flex flex-col items-center hover:opacity-80 transition-opacity">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-2">
              <Droplet className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">Welcome to RedWeb</CardTitle>
          </Link>
          <CardDescription className="text-center">
            Login to your account to continue your life-saving journey
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-red-600 hover:text-red-800">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="text-xs text-gray-500">
              <p>Test account available: test@redweb.com / testpassword</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-red-600 hover:text-red-800 font-medium">
                Register now
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

