import { Heart, Users, Sparkles } from 'lucide-react'

export default function Features() {
  const features = [
    {
      icon: Heart,
      title: 'Holistic Approach',
      description: 'We consider the interconnectedness of mind, body, and spirit, offering integrative practices to nurture your mental health and overall vitality.'
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Experience the guidance of our Expertise Team. Our skilled professionals bring compassion and multidisciplinary expertise to provide unparalleled support for your mental and emotional well-being.'
    },
    {
      icon: Sparkles,
      title: 'Personalized Treatments',
      description: "We're dedicated to making mental well-being accessible to all. Our personalized solutions ensure transformative care is within your reach."
    }
  ]

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="text-center bg-white p-8 rounded-lg shadow-md">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-purple-100 rounded-full">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
