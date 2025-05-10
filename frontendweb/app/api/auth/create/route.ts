import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // The backend expects this exact structure for creating a donation drive
    const response = await fetch("http://localhost:8080/api/auth/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (response.ok) {
      const data = await response.json()
      return NextResponse.json(data)
    } else {
      const errorText = await response.text()
      return NextResponse.json({ message: errorText || "Failed to create donation drive" }, { status: 400 })
    }
  } catch (error) {
    console.error("Donation drive creation error:", error)
    return NextResponse.json({ message: "An error occurred while creating the donation drive" }, { status: 500 })
  }
}
