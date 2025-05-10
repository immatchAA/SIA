import { DonationDrivesList } from "@/components/donation-drives-list"

export default function DonationDrivesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Donation Drives</h1>
      </div>
      <DonationDrivesList />
    </div>
  )
}
