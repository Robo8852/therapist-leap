import ContactForm from '../components/ContactForm'

export default function Contact() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-4 text-primary">Contact Us</h1>
        <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Let's connect and start your healing journey
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
            <ContactForm />
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Phone</h3>
                <a
                  href="tel:+51954140424"
                  className="text-primary hover:underline text-lg"
                >
                  +51 954 140 424
                </a>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Email</h3>
                <a
                  href="mailto:connect@soulsynaptica.com"
                  className="text-primary hover:underline text-lg"
                >
                  connect@soulsynaptica.com
                </a>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Location</h3>
                <p className="text-gray-700 text-lg">
                  Lima, Perú
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Office Hours</h3>
                <p className="text-gray-700">Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p className="text-gray-700">Saturday: 10:00 AM - 2:00 PM</p>
                <p className="text-gray-700">Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
