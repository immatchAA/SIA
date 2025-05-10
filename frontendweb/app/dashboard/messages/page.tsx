import { MessagesList } from "@/components/messages-list"

export default function MessagesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Messages</h1>
      <MessagesList />
    </div>
  )
}
