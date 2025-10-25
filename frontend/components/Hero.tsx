import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <div className="relative bg-gradient-to-br from-purple-600 to-purple-900 text-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Embracing Wholeness:<br />
          A Journey of Neuroplasticity and<br />
          Transformation
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          Where Psychology and Consciousness are woven together through the thread of Science
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/contact"
            className="bg-white text-primary px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
          >
            Start Your Journey Today
          </Link>
          <Link
            to="/services"
            className="bg-transparent border-2 border-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-primary transition-colors"
          >
            Explore Our Services
          </Link>
        </div>
      </div>
    </div>
  )
}
