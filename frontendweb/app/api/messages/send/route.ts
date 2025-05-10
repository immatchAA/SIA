import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const senderEmail = formData.get("senderEmail") as string
    const receiverEmail = formData.get("receiverEmail") as string
    const content = formData.get("content") as string

    // The backend expects these exact query parameters
    const response = await fetch(
      `http://localhost:8080/api/messages/send?senderEmail=${encodeURIComponent(senderEmail)}&receiverEmail=${encodeURIComponent(receiverEmail)}&content=${encodeURIComponent(content)}`,
      {
        method: "POST",
      },
    )

    if (response.ok) {
      return NextResponse.json({ message: "Message sent successfully" })
    } else {
      const errorText = await response.text()
      return NextResponse.json({ message: errorText || "Failed to send message" }, { status: 400 })
    }
  } catch (error) {
    console.error("Message sending error:", error)
    return NextResponse.json({ message: "An error occurred while sending the message" }, { status: 500 })
  }
}
