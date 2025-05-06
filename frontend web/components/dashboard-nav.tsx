import Link from "next/link"
import {
  Bell,
  Calendar,
  Droplet,
  Heart,
  History,
  Home,
  LifeBuoy,
  LogOut,
  MessageSquare,
  Settings,
  User,
} from "lucide-react"

export function DashboardNav() {
  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r min-h-screen p-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold mb-4 px-2">RedWeb</h2>
        <NavItem href="/dashboard" icon={Home} label="Dashboard" />
        <NavItem href="/profile" icon={User} label="My Profile" />
        <NavItem href="/request" icon={Droplet} label="Request Blood" />
        <NavItem href="/history" icon={History} label="Donation History" />
        <NavItem href="/notifications" icon={Bell} label="Notifications" />
        <NavItem href="/messages" icon={MessageSquare} label="Messages" />
        <NavItem href="/drives" icon={Calendar} label="Donation Drives" />
        <NavItem href="/emergency" icon={Heart} label="Emergency Mode" />
      </div>

      <div className="mt-auto space-y-1">
        <NavItem href="/help" icon={LifeBuoy} label="Help & Support" />
        <NavItem href="/settings" icon={Settings} label="Settings" />
        <NavItem href="/logout" icon={LogOut} label="Logout" />
      </div>
    </div>
  )
}

function NavItem({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center space-x-2 px-2 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors"
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  )
}
