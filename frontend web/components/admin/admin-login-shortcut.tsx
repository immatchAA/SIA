"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/context/auth-context"
import { useRouter } from "next/navigation"

export function AdminLoginShortcut() {
  const { login } = useAuth()
  const router = useRouter()

  const handleAdminLogin = async () => {
    try {
      await login("admin@redweb.org", "admin123")
      router.push("/admin/dashboard")
    } catch (error) {
      console.error("Admin login failed:", error)
    }
  }

  return (
    <div className="mt-4 text-center">
      <Button
        variant="outline"
        size="sm"
        onClick={handleAdminLogin}
        className="text-xs text-muted-foreground hover:text-foreground"
      >
        Access Admin Dashboard
      </Button>
    </div>
  )
}
