import Link from 'next/link'
import { Facebook, X, Instagram, Heart, ExternalLink } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuran } from '@fortawesome/free-solid-svg-icons'
import { FaGithub } from 'react-icons/fa';


export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-800 text-amber-900 dark:text-amber-100 py-6 sm:py-8 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* About Section */}
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold mb-3 sm:mb-4 flex items-center justify-center sm:justify-start">
              <FontAwesomeIcon icon={faQuran} className="mr-2 h-5 w-5" /> About Quran App
            </h3>
            <p className="text-sm">
              Quran App is dedicated to providing easy access to the Holy Quran, 
              with features like multiple translations, audio recitations, and 
              verse bookmarking.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold mb-3 sm:mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm hover:underline">About Us</Link></li>
              <li><Link href="/privacy" className="text-sm hover:underline">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm hover:underline">Terms of Service</Link></li>
              <li><Link href="/contact" className="text-sm hover:underline">Contact Us</Link></li>
            </ul>
          </div>

          {/* Features */}
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold mb-3 sm:mb-4">Features</h3>
            <ul className="space-y-2">
              <li className="text-sm">Multiple Translations</li>
              <li className="text-sm">Audio Recitations</li>
              <li className="text-sm">Verse Bookmarking</li>
              <li className="text-sm">Dark Mode</li>
              <li className="text-sm">Responsive Design</li>
            </ul>
          </div>

          {/* Social Media and Developer Section */}
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold mb-3 sm:mb-4">Connect With Us</h3>
            <div className="flex justify-center sm:justify-start space-x-4 mb-4">
              <a href="https://facebook.com/khan.shariq.144734" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook className="h-6 w-6 text-amber-700 dark:text-amber-300 hover:text-amber-500 dark:hover:text-amber-100 transition-colors duration-300" />
              </a>
              <a href="https://x.com/Sharique_Ch" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <X className="h-6 w-6 text-amber-700 dark:text-amber-300 hover:text-amber-500 dark:hover:text-amber-100 transition-colors duration-300" />
              </a>
              <a href="https://instagram.com/sharique1303" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram className="h-6 w-6 text-amber-700 dark:text-amber-300 hover:text-amber-500 dark:hover:text-amber-100 transition-colors duration-300" />
              </a>
            </div>
            <h3 className="text-lg font-semibold mb-2">Our Developers</h3>
            <a 
              href="https://github.com/0xshariq/quran-next-app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center sm:justify-start text-sm hover:underline"
            >
              <FaGithub className="h-4 w-4 mr-2" />
              Quran App on GitHub
              <ExternalLink className="h-4 w-4 ml-1" />
            </a>
          </div>
        </div>
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-sm text-center sm:text-left">
            © {new Date().getFullYear()} Quran App. All rights reserved.
          </p>
          <div className="flex items-center">
            <Heart className="h-4 w-4 mr-2 text-red-500" />
            <p className="text-sm">Made with love for the Ummah</p>
          </div>
        </div>
      </div>
    </footer>
  )
}