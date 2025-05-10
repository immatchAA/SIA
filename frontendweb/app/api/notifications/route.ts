import { NextResponse } from "next/server"

export async function GET() {
  try {
    // In a real implementation, you would make a request to your Spring Boot backend
    const response = await fetch("http://localhost:8080/api/notifications")
    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json({ message: "An error occurred while fetching notifications" }, { status: 500 })
  }
}
