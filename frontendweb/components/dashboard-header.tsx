"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Bell, MessageSquare, Menu } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"

export function DashboardHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Link href="/" className="flex items-center gap-2">
            <span className="text-red-600 text-xl font-bold">RedWeb</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/dashboard/notifications">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-600 rounded-full"></span>
            </Button>
          </Link>
          <Link href="/dashboard/messages">
            <Button variant="ghost" size="icon" className="relative">
              <MessageSquare className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-600 rounded-full"></span>
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium">{user?.email}</p>
              <p className="text-xs text-gray-500">Donor</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
