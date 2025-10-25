export default function Testimonials() {
  const testimonials = [
    {
      name: 'Anneliese, 26',
      text: 'I am so grateful and relieved that a place like this even exists in Peru! With an already diagnosis of PTSD/insomnia and not finding a professional team who spoke english and were Internationally accredited was rough at the beginning of my transition from Germany to Peru. I would recommend Soul synaptica for anyone who is looking for a more integrative way of assessing their condition. I am forever grateful with the whole team!'
    },
    {
      name: 'Kyle, 38',
      text: 'I was referred to Soul Synaptica as I was dealing with high-functioning anxiety and treatment-resistant depression. Since the beginning of the treatment the doctor and psychologist explained to me all the information about the process and made sure every question was answered carefully. I would highly recommend Soul Synaptica to anyone who is looking to work with a professional team that hold ethics and work with transparency.'
    }
  ]

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-12">Testimonials</h2>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-6xl text-primary mb-4">"</div>
              <p className="text-gray-700 mb-6 italic">{testimonial.text}</p>
              <p className="font-semibold text-primary">- {testimonial.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
