export default function Services() {
  const services = [
    {
      title: 'Psilocybin-Assisted Therapy',
      description: 'Therapeutic use of psilocybin mushrooms to facilitate deep psychological healing and personal transformation.',
      benefits: [
        'Treatment of depression and anxiety',
        'PTSD symptom reduction',
        'Enhanced self-awareness',
        'Improved emotional processing'
      ],
      process: 'Includes preparation sessions, supervised psychedelic experience, and integration therapy'
    },
    {
      title: 'MDMA-Assisted Therapy',
      description: 'MDMA-assisted psychotherapy for treating trauma and PTSD under clinical supervision.',
      benefits: [
        'PTSD treatment',
        'Anxiety reduction',
        'Enhanced emotional connection',
        'Trauma processing'
      ],
      process: 'Structured protocol with preparation, dosing sessions, and follow-up integration'
    },
    {
      title: 'Integration Sessions',
      description: 'Post-experience therapy to process insights and integrate learnings into daily life.',
      benefits: [
        'Maximize therapeutic benefits',
        'Process difficult experiences',
        'Develop integration practices',
        'Long-term growth support'
      ],
      process: 'Regular therapy sessions focused on integration and ongoing support'
    },
    {
      title: 'Group Therapy',
      description: 'Supportive group settings for shared healing and community connection.',
      benefits: [
        'Peer support',
        'Shared experiences',
        'Community building',
        'Cost-effective treatment'
      ],
      process: 'Regular group sessions facilitated by experienced therapists'
    }
  ]

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-4 text-primary">Our Services</h1>
        <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          We offer personalized services in English, Spanish, Dutch, and Portuguese
        </p>

        <div className="space-y-12">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold mb-4 text-primary">{service.title}</h2>
              <p className="text-gray-700 mb-6">{service.description}</p>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Benefits</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    {service.benefits.map((benefit, idx) => (
                      <li key={idx}>{benefit}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Treatment Process</h3>
                  <p className="text-gray-700">{service.process}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-purple-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4 text-center">Treatment Process Timeline</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Preparation</h3>
              <p className="text-gray-600 text-sm">Initial consultation and readiness assessment</p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Experience</h3>
              <p className="text-gray-600 text-sm">Supervised psychedelic-assisted session</p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Integration</h3>
              <p className="text-gray-600 text-sm">Follow-up therapy to integrate insights</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
