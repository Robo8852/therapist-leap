import { Link } from 'react-router-dom'
import { Brain, Heart, Users, Sparkles } from 'lucide-react'

export default function ServicesOverview() {
  const services = [
    {
      icon: Brain,
      title: 'Navigating Pivotal Life Transitions',
      description: 'Support during major life changes and transitions'
    },
    {
      icon: Heart,
      title: 'Personalized treatments for affective and clinical disorders',
      description: 'Evidence-based treatments tailored to your needs'
    },
    {
      icon: Sparkles,
      title: 'Treatment resistant depression & more',
      description: 'Innovative approaches for difficult-to-treat conditions'
    },
    {
      icon: Users,
      title: 'Integrative nutritionist and Transformational coaching',
      description: 'Holistic wellness and personal development'
    }
  ]

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-4">Our Services</h2>
        <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          We offer our personalized services in English, Spanish, Dutch, and Portuguese
        </p>
        <p className="text-center text-gray-700 mb-12 max-w-3xl mx-auto">
          We specialize in creating personalized treatments and processes for young adults, students,
          professionals, and entrepreneurs that are looking for more than traditional therapy.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2">{service.title}</h4>
                    <p className="text-gray-600 text-sm">{service.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-center">
          <Link
            to="/services"
            className="inline-block bg-primary text-white px-8 py-3 rounded-md font-semibold hover:bg-primary/90 transition-colors"
          >
            Learn More About Our Services
          </Link>
        </div>
      </div>
    </div>
  )
}
