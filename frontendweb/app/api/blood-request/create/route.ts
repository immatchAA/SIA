import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // The backend expects this exact structure
    const response = await fetch("http://localhost:8080/api/blood-request/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (response.ok) {
      return NextResponse.json({ message: "Blood request created successfully" })
    } else {
      const errorText = await response.text()
      return NextResponse.json({ message: errorText || "Failed to create blood request" }, { status: 400 })
    }
  } catch (error) {
    console.error("Blood request creation error:", error)
    return NextResponse.json({ message: "An error occurred while creating the blood request" }, { status: 500 })
  }
}
