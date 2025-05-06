"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { authAPI } from "@/lib/api"

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    // Clear authentication data
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    
    // Use Next.js router for redirection
    router.push('/login')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Logging out...</h1>
        <p className="text-gray-600">You will be redirected to the login page shortly.</p>
      </div>
    </div>
  )
}
