"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"

export function Navbar() {
  const { user } = useAuth()

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-red-600 text-2xl font-bold">RedWeb</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-gray-700 hover:text-red-600">
            Home
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-red-600">
            About
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-red-600">
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          {user ? (
            <Button asChild className="bg-red-600 hover:bg-red-700">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="outline">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild className="bg-red-600 hover:bg-red-700">
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
