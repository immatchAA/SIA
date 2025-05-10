import { HeartPulse, Calendar, MessageSquare, Bell, Users, Shield } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: <HeartPulse className="h-10 w-10 text-red-600" />,
      title: "Blood Requests",
      description: "Create and manage blood donation requests for yourself or others in need.",
    },
    {
      icon: <Calendar className="h-10 w-10 text-red-600" />,
      title: "Donation Drives",
      description: "Find and participate in blood donation drives organized in your area.",
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-red-600" />,
      title: "Messaging",
      description: "Communicate directly with donors or recipients through our secure messaging system.",
    },
    {
      icon: <Bell className="h-10 w-10 text-red-600" />,
      title: "Notifications",
      description: "Stay updated with real-time notifications about requests and donations.",
    },
    {
      icon: <Users className="h-10 w-10 text-red-600" />,
      title: "Community",
      description: "Join a community of donors committed to helping save lives.",
    },
    {
      icon: <Shield className="h-10 w-10 text-red-600" />,
      title: "Emergency Mode",
      description: "Activate emergency mode for urgent blood requirements.",
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Features</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our platform offers a comprehensive set of features designed to connect blood donors with those in need
            efficiently and effectively.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
