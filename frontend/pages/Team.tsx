export default function Team() {
  const teamMembers = [
    {
      name: 'Dr. Maria Santos',
      title: 'Clinical Director',
      credentials: 'MD, Psychiatry',
      bio: 'Board-certified psychiatrist with 15+ years of experience in psychedelic-assisted therapy.',
      languages: ['English', 'Spanish', 'Portuguese']
    },
    {
      name: 'Dr. James van der Berg',
      title: 'Lead Therapist',
      credentials: 'PhD, Clinical Psychology',
      bio: 'Specialized in trauma therapy and integration practices with extensive training in psychedelic therapy.',
      languages: ['English', 'Dutch']
    },
    {
      name: 'Sofia Rodriguez',
      title: 'Integration Specialist',
      credentials: 'MA, Counseling Psychology',
      bio: 'Focuses on post-experience integration and long-term therapeutic support.',
      languages: ['Spanish', 'English']
    }
  ]

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-4 text-primary">Our Team</h1>
        <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Meet our experienced team of professionals dedicated to your healing journey
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-64 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-6xl">👤</span>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                <p className="text-primary font-semibold mb-1">{member.title}</p>
                <p className="text-sm text-gray-600 mb-3">{member.credentials}</p>
                <p className="text-gray-700 mb-4">{member.bio}</p>
                <div>
                  <p className="text-sm font-semibold mb-1">Languages:</p>
                  <p className="text-sm text-gray-600">{member.languages.join(', ')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
