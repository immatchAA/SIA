import { EmergencyDashboard } from "@/components/emergency-dashboard"

export default function EmergencyPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Emergency Requests</h1>
      <EmergencyDashboard />
    </div>
  )
}