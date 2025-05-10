"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type User = {
  name: string
  healthConditions: string
  bloodType: string
  phone: string
  address: string
  email: string
}

type AuthContextType = {
  user: User | null
  login: (email: string) => void
  updateUser?: (updatedUser: Partial<User>) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Error parsing stored user:", error)
        localStorage.removeItem("user")
      }
    }
  }, [])

  const login = (email: string) => {
    const newUser: User = {
      name: "Default Name",
      healthConditions: "None",
      bloodType: "Unknown",
      phone: "000-000-0000",
      address: "Default Address",
      email
    }
    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
