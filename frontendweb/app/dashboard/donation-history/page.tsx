import { DonationHistoryDashboard } from "../../../components/donation-history-dashboard"

export default function DonationHistoryPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Donation History</h1>
      <DonationHistoryDashboard />
    </div>
  )
}
