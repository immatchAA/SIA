import { BloodRequestsList } from "@/components/blood-requests-list"

export default function BloodRequestsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Blood Requests</h1>
      </div>
      <BloodRequestsList />
    </div>
  )
}
