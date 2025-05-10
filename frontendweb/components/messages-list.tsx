"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import { formatDistanceToNow } from "date-fns"

type Message = {
  id: number
  senderEmail: string
  receiverEmail: string
  content: string
  sentAt: string
}

export function MessagesList() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newMessage, setNewMessage] = useState("")
  const [receiverEmail, setReceiverEmail] = useState("")

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user?.email) return

      setIsLoading(true)
      try {
        const response = await fetch(`/api/messages/user/${user.email}`)
        const data = await response.json()
        setMessages(data)
      } catch (error) {
        console.error("Error fetching messages:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load messages. Please try again.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchMessages()
  }, [user, toast])

  // Update to ensure the message sending matches the backend expectations
  const sendMessage = async () => {
    if (!user?.email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to send messages.",
      })
      return
    }

    if (!receiverEmail) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a recipient email.",
      })
      return
    }

    if (!newMessage.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a message.",
      })
      return
    }

    try {
      // Create form data to match the backend's expected format
      const formData = new FormData()
      formData.append("senderEmail", user.email)
      formData.append("receiverEmail", receiverEmail)
      formData.append("content", newMessage)

      const response = await fetch("/api/messages/send", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Message sent successfully.",
        })
        setNewMessage("")

        // Refresh messages
        const messagesResponse = await fetch(`/api/messages/user/${user.email}`)
        const messagesData = await messagesResponse.json()
        setMessages(messagesData)
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to send message.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred. Please try again.",
      })
    }
  }

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch (error) {
      return "Unknown time"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>New Message</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="receiverEmail" className="text-sm font-medium">
                To:
              </label>
              <Input
                id="receiverEmail"
                value={receiverEmail}
                onChange={(e) => setReceiverEmail(e.target.value)}
                placeholder="Recipient's email"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="messageContent" className="text-sm font-medium">
                Message:
              </label>
              <div className="flex gap-2">
                <Input
                  id="messageContent"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message here..."
                />
                <Button onClick={sendMessage} className="bg-red-600 hover:bg-red-700">
                  Send
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Messages</h2>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <p>Loading messages...</p>
          </div>
        ) : messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((message) => {
              const isFromMe = message.senderEmail === user?.email

              return (
                <div key={message.id} className={`flex ${isFromMe ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      isFromMe ? "bg-red-600 text-white" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <div className="text-sm font-medium mb-1">{isFromMe ? "You" : message.senderEmail}</div>
                    <p>{message.content}</p>
                    <div className={`text-xs mt-1 ${isFromMe ? "text-red-100" : "text-gray-500"}`}>
                      {formatTime(message.sentAt)}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <h3 className="text-lg font-medium mb-2">No Messages</h3>
            <p className="text-gray-500">You don't have any messages yet. Start a conversation by sending a message.</p>
          </div>
        )}
      </div>
    </div>
  )
}
