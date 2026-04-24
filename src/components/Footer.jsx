import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 pt-16 pb-8 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <Link to="/" className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 flex items-center justify-center">
              <img 
                src="https://ik.imagekit.io/4lndq5ke52/primelogo1.png?" 
                alt="PrimeHeart Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg leading-none text-gray-900">
                PrimeHeart
              </span>
              <span className="text-[8px] font-bold text-red-600 uppercase tracking-widest mt-1">
                Multispecialist
              </span>
            </div>
          </Link>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Advanced multispecialist care in the heart of Magboro. Providing premium, trustworthy healthcare services for you and your family.
          </p>
          <div className="flex gap-4">
            <SocialLink href="#" icon={<Facebook className="w-5 h-5" />} />
            <SocialLink href="#" icon={<Instagram className="w-5 h-5" />} />
            <SocialLink href="#" icon={<Twitter className="w-5 h-5" />} />
          </div>
        </div>

        <div>
          <h4 className="font-bold text-gray-900 mb-6">Quick Links</h4>
          <ul className="space-y-3 text-sm text-gray-600">
            <li><Link to="/doctors" className="hover:text-red-600 active:text-red-700 transition-colors duration-200">Find a Doctor</Link></li>
            <li><Link to="/services" className="hover:text-red-600 active:text-red-700 transition-colors duration-200">Medical Services</Link></li>
            <li><Link to="/book" className="hover:text-red-600 active:text-red-700 transition-colors duration-200">Book Appointment</Link></li>
            <li><Link to="/login" className="hover:text-red-600 active:text-red-700 transition-colors duration-200">Admin Login</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-gray-900 mb-6">Contact Info</h4>
          <ul className="space-y-4 text-sm text-gray-600">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-red-600 shrink-0" />
              <span>60 Miracle Ave, Magboro 121101, Ogun State</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-red-600 shrink-0" />
              <a href="tel:09015676191" onClick={() => window.gtag && window.gtag('event', 'phone_call_click')} className="hover:text-red-600 transition-colors">09015676191</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-red-600 shrink-0" />
              <span className="truncate">primeheartmultispecialisthosp@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-16 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} PrimeHeart Multispecialist Clinic. All rights reserved.
        </p>
        <div className="flex gap-6 text-xs text-gray-400">
          <a href="#" className="hover:text-gray-600">Privacy Policy</a>
          <a href="#" className="hover:text-gray-600">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon }) {
  return (
    <a
      href={href}
      className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-red-600 hover:text-red-600 transition-all"
    >
      {icon}
    </a>
  );
}
