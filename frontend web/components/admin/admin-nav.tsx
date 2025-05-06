import Link from "next/link"
import {
  BarChart3,
  Bell,
  Calendar,
  Droplet,
  FileText,
  HospitalIcon as HospitalSquare,
  LogOut,
  MessageSquare,
  Settings,
  Shield,
  Users,
  Megaphone,
} from "lucide-react"

export function AdminNav() {
  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r min-h-screen p-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold mb-4 px-2">RedWeb Admin</h2>
        <NavItem href="/admin/dashboard" icon={BarChart3} label="Dashboard" />
        <NavItem href="/admin/users" icon={Users} label="User Management" />
        <NavItem href="/admin/requests" icon={Droplet} label="Blood Requests" />
        <NavItem href="/admin/drives" icon={Calendar} label="Donation Drives" />
        <NavItem href="/admin/announcements" icon={Megaphone} label="Announcements" />
        <NavItem href="/admin/hospitals" icon={HospitalSquare} label="Hospitals" />
        <NavItem href="/admin/notifications" icon={Bell} label="Notifications" />
        <NavItem href="/admin/messages" icon={MessageSquare} label="Messages" />
        <NavItem href="/admin/reports" icon={FileText} label="Reports" />
      </div>

      <div className="mt-auto space-y-1">
        <NavItem href="/admin/security" icon={Shield} label="Security" />
        <NavItem href="/admin/settings" icon={Settings} label="Settings" />
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
