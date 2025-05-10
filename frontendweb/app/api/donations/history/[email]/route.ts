import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { email: string } }) {
  try {
    const email = params.email

    // In a real implementation, you would fetch donation history from your backend
    // For now, we'll return mock data

    // Calculate next eligible date (56 days after last donation for whole blood)
    const lastDonation = new Date("2025-04-15")
    const eligibleDate = new Date(lastDonation)
    eligibleDate.setDate(eligibleDate.getDate() + 56)

    const mockData = {
      donations: [
        {
          id: 1,
          donationDate: "2025-04-15",
          location: "Central Blood Bank",
          bloodType: "A+",
          units: 1,
          donationType: "Whole Blood",
          notes: "Regular donation",
        },
        {
          id: 2,
          donationDate: "2025-02-10",
          location: "Community Drive at City Hall",
          bloodType: "A+",
          units: 1,
          donationType: "Whole Blood",
        },
        {
          id: 3,
          donationDate: "2024-11-05",
          location: "University Medical Center",
          bloodType: "A+",
          units: 1,
          donationType: "Plasma",
          notes: "Special request for plasma",
        },
      ],
      nextEligibleDate: eligibleDate.toISOString().split("T")[0],
      stats: {
        totalDonations: 3,
        totalUnits: 3,
        livesImpacted: 9,
        streakCount: 2,
        lastDonation: "2025-04-15",
      },
    }

    return NextResponse.json(mockData)
  } catch (error) {
    console.error("Error fetching donation history:", error)
    return NextResponse.json({ message: "Failed to fetch donation history" }, { status: 500 })
  }
}
