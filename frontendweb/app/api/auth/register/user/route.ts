import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // In a real implementation, you would make a request to your Spring Boot backend
    const response = await fetch("http://localhost:8080/api/auth/register/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const data = await response.text()

    if (response.ok) {
      return NextResponse.json({ message: "User registered successfully" })
    } else {
      return NextResponse.json({ message: data || "Registration failed" }, { status: 400 })
    }
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "An error occurred during registration" }, { status: 500 })
  }
}
