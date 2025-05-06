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
import { Bell, Menu, Droplet } from "lucide-react"
import { useState } from "react"

export function DashboardHeader() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

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
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="bg-red-600 text-white p-1 rounded">
              <Droplet className="h-6 w-6" />
            </div>
            <span className="font-bold text-xl hidden sm:inline-block">RedWeb</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-600">
              3
            </Badge>
            <span className="sr-only">Notifications</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Profile" />
                  <AvatarFallback className="bg-red-100 text-red-600">JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">John Doe</p>
                  <p className="text-xs leading-none text-muted-foreground">john.doe@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/profile" className="w-full">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/history" className="w-full">
                  Donation History
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/settings" className="w-full">
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/logout" className="w-full">
                  Log out
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {mobileNavOpen && (
        <div className="md:hidden border-t">
          <div className="py-2 px-4">
            <MobileNavItem href="/dashboard" label="Dashboard" />
            <MobileNavItem href="/profile" label="My Profile" />
            <MobileNavItem href="/request" label="Request Blood" />
            <MobileNavItem href="/history" label="Donation History" />
            <MobileNavItem href="/notifications" label="Notifications" />
            <MobileNavItem href="/messages" label="Messages" />
            <MobileNavItem href="/drives" label="Donation Drives" />
            <MobileNavItem href="/emergency" label="Emergency Mode" />
            <MobileNavItem href="/help" label="Help & Support" />
            <MobileNavItem href="/settings" label="Settings" />
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
