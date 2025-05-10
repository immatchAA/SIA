import { NotificationsList } from "@/components/notifications-list"

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Notifications</h1>
      <NotificationsList />
    </div>
  )
}
