"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Bell, Menu, Droplet, Shield } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/lib/context/auth-context"

export function AdminHeader() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const { user, logout } = useAuth()

  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden mr-2"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <Link href="/admin/dashboard" className="flex items-center space-x-2">
            <div className="bg-red-600 text-white p-1 rounded">
              <Droplet className="h-6 w-6" />
            </div>
            <div className="flex items-center">
              <span className="font-bold text-xl hidden sm:inline-block">RedWeb</span>
              <Badge className="ml-2 bg-purple-600">Admin</Badge>
            </div>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-600">
              5
            </Badge>
            <span className="sr-only">Notifications</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Profile" />
                  <AvatarFallback className="bg-purple-100 text-purple-600">
                    {user?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "AD"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name || "Admin User"}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email || "admin@redweb.org"}</p>
                  <div className="flex items-center mt-1">
                    <Shield className="h-3 w-3 text-purple-600 mr-1" />
                    <span className="text-xs text-purple-600">{user?.adminLevel === 3 ? "Super Admin" : "Admin"}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/admin/profile" className="w-full">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/admin/settings" className="w-full">
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {mobileNavOpen && (
        <div className="md:hidden border-t">
          <div className="py-2 px-4">
            <MobileNavItem href="/admin/dashboard" label="Dashboard" />
            <MobileNavItem href="/admin/users" label="User Management" />
            <MobileNavItem href="/admin/requests" label="Blood Requests" />
            <MobileNavItem href="/admin/drives" label="Donation Drives" />
            <MobileNavItem href="/admin/hospitals" label="Hospitals" />
            <MobileNavItem href="/admin/notifications" label="Notifications" />
            <MobileNavItem href="/admin/messages" label="Messages" />
            <MobileNavItem href="/admin/reports" label="Reports" />
            <MobileNavItem href="/admin/security" label="Security" />
            <MobileNavItem href="/admin/settings" label="Settings" />
            <MobileNavItem href="/logout" label="Logout" />
          </div>
        </div>
      )}
    </header>
  )
}

function MobileNavItem({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block py-2 text-gray-700 hover:text-red-700"
      onClick={() => {
        // Close mobile nav when clicked
        const event = new CustomEvent("closeMobileNav")
        window.dispatchEvent(event)
      }}
    >
      {label}
    </Link>
  )
}
