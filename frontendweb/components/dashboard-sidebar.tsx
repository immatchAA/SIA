"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Droplet, Calendar, MessageSquare, Bell, Settings, Users, AlertTriangle, History } from "lucide-react"
import { cn } from "@/lib/utils"

const sidebarItems = [
  { name: "Overview", href: "/dashboard", icon: Home },
  { name: "Blood Requests", href: "/dashboard/blood-requests", icon: Droplet },
  { name: "Donation Drives", href: "/dashboard/donation-drives", icon: Calendar },
  { name: "Donation History", href: "/dashboard/donation-history", icon: History },
  { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { name: "Emergency", href: "/dashboard/emergency", icon: AlertTriangle },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r bg-white hidden md:block">
      <div className="h-full py-6 px-3 flex flex-col">
        <nav className="space-y-1 flex-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive ? "bg-red-50 text-red-600" : "text-gray-700 hover:bg-gray-100",
                )}
              >
                <Icon className={cn("h-5 w-5", isActive ? "text-red-600" : "text-gray-500")} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="pt-4 border-t">
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="font-medium text-red-600 mb-2">Need Help?</h4>
            <p className="text-sm text-gray-600 mb-3">Contact our support team for assistance with the platform.</p>
            <Link href="/support" className="text-sm text-red-600 hover:underline">
              Get Support
            </Link>
          </div>
        </div>
      </div>
    </aside>
  )
}
