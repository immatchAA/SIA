import { NextResponse } from "next/server"

export async function GET() {
  try {
    // In a real implementation, you would make a request to your Spring Boot backend
    const response = await fetch("http://localhost:8080/api/blood-request/get")
    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching blood requests:", error)
    return NextResponse.json({ message: "An error occurred while fetching blood requests" }, { status: 500 })
  }
}
