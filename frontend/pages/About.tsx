export default function About() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-primary">About Soul Synaptica</h1>

        <div className="prose prose-lg max-w-4xl mx-auto">
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              Soul Synaptica is dedicated to providing cutting-edge psychedelic-assisted psychotherapy
              with a holistic approach. We believe in the interconnectedness of mind, body, and spirit,
              and we're committed to helping our clients achieve transformative healing through evidence-based practices.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Our Approach</h2>
            <p className="text-gray-700 leading-relaxed">
              We combine traditional psychotherapy with carefully supervised psychedelic experiences
              to facilitate deep psychological healing and personal growth. Our team of experienced
              professionals provides personalized treatment plans tailored to each client's unique needs.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Safety & Professionalism</h2>
            <p className="text-gray-700 leading-relaxed">
              Safety is our top priority. All treatments are conducted in a controlled, therapeutic
              environment under the supervision of licensed medical professionals. We follow strict
              protocols and ethical guidelines to ensure the wellbeing of every client.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Compassion:</strong> We approach every client with empathy and understanding</li>
              <li><strong>Precision:</strong> Evidence-based treatments tailored to individual needs</li>
              <li><strong>Innovation:</strong> Embracing cutting-edge therapeutic modalities</li>
              <li><strong>Integrity:</strong> Maintaining the highest ethical and professional standards</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
