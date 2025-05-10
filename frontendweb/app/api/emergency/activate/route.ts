import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const bloodRequestId = await request.text()

    // The backend expects the ID as plain text in the request body
    const response = await fetch("http://localhost:8080/api/emergency/activate", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: bloodRequestId,
    })

    if (response.ok) {
      return NextResponse.json({ message: "Emergency mode activated successfully" })
    } else {
      const errorText = await response.text()
      return NextResponse.json({ message: errorText || "Failed to activate emergency mode" }, { status: 400 })
    }
  } catch (error) {
    console.error("Emergency activation error:", error)
    return NextResponse.json({ message: "An error occurred while activating emergency mode" }, { status: 500 })
  }
}
