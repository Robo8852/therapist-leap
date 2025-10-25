import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Soul Synaptica</h3>
            <p className="text-gray-400">
              Psychedelic Assisted Psychotherapy with a holistic approach
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Compassion | Precision | Innovation | Integrity
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/team" className="text-gray-400 hover:text-white transition-colors">
                  Our Team
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="tel:+51954140424" className="hover:text-white transition-colors">
                  +51 954 140 424
                </a>
              </li>
              <li>
                <a href="mailto:connect@soulsynaptica.com" className="hover:text-white transition-colors">
                  connect@soulsynaptica.com
                </a>
              </li>
              <li>Lima, Perú</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>© 2022 Soul Synaptica™. All rights reserved.</p>
          <p className="mt-2">
            <strong>Disclaimer:</strong> The contents of this website are intended for information purposes only.
            Please consult the clinicians at the clinic for diagnosis and advice on treatment options.
          </p>
        </div>
      </div>
    </footer>
  )
}
