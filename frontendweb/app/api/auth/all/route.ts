import { NextResponse } from "next/server"

export async function GET() {
  try {
    // In a real implementation, you would make a request to your Spring Boot backend
    const response = await fetch("http://localhost:8080/api/auth/all")
    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching donation drives:", error)
    return NextResponse.json({ message: "An error occurred while fetching donation drives" }, { status: 500 })
  }
}
