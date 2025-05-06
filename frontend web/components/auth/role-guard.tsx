"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth, type UserRole } from "@/lib/context/auth-context"
import { Spinner } from "@/components/ui/spinner"

type RoleGuardProps = {
  children: React.ReactNode
  allowedRoles: UserRole[]
  fallbackPath?: string
}

export function RoleGuard({ children, allowedRoles, fallbackPath = "/login" }: RoleGuardProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !user) {
      // User is not logged in, redirect to login with return URL
      router.push(`${fallbackPath}?returnUrl=${encodeURIComponent(pathname)}`)
      return
    }

    if (!isLoading && user && !allowedRoles.includes(user.role)) {
      // User is logged in but doesn't have the required role
      // Redirect to appropriate dashboard based on role
      switch (user.role) {
        case "admin":
          router.push("/admin/dashboard")
          break
        case "donor":
          router.push("/dashboard")
          break
        case "patient":
          router.push("/patient/dashboard")
          break
        default:
          router.push("/")
      }
    }
  }, [user, isLoading, router, allowedRoles, fallbackPath, pathname])

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return null
  }

  return <>{children}</>
}
