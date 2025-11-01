

import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-800 via-gray-800 to-gray-800 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Company Info */}
          <div className="lg:col-span-2">
           
            <p className="text-gray-400 text-lg leading-relaxed mb-6 max-w-md">
              Creating beautiful digital experiences that transform businesses and engage customers worldwide.
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin size={18} className="text-blue-400" />
                <span>123 Innovation Street, Tech City</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Phone size={18} className="text-green-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Mail size={18} className="text-purple-400" />
                <span>veloce@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 relative inline-block">
              Services
            </h3>
            <div className="space-y-3">
              {['Branding & Identity', 'Web Design', 'Digital Marketing', 'UI/UX Design', 'Content Strategy', 'E-commerce'].map((service) => (
                <a 
                  key={service}
                  className="block text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-2 hover:underline cursor-pointer"
                >
                  {service}
                </a>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 relative inline-block">
              Connect
            </h3>
            
            {/* Newsletter */}
            <div className="mb-8">
              <p className="text-gray-400 mb-4">Subscribe to our newsletter</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-white placeholder-gray-400"
                />
                <button className="px-4 py-2 bg-gradient-to-r bg-gray-700 hover:bg-gray-800 rounded-lg transition-all duration-300 transform hover:scale-105 font-medium">
                  Join
                </button>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <p className="text-gray-400 mb-4">Follow us</p>
              <div className="flex gap-3">
                {[
                  { icon: Facebook, color: 'hover:bg-gray-700', label: 'Facebook' },
                  { icon: Twitter, color: 'hover:bg-gray-700', label: 'Twitter' },
                  { icon: Instagram, color: 'hover:bg-gray-700', label: 'Instagram' },
                  { icon: Linkedin, color: 'hover:bg-gray-700', label: 'LinkedIn' }
                ].map((social) => (
                  <button
                    key={social.label}
                    className={`p-3 bg-gray-800 rounded-xl transition-all duration-300 hover:scale-110 ${social.color} group`}
                    aria-label={social.label}
                  >
                    <social.icon size={18} className="text-gray-400 group-hover:text-white" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none">
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-12 -right-24 w-36 h-36 bg-gradient-to-r from-purple-500/20 to-pink-600/20 rounded-full blur-3xl"></div>
      </div>
    </footer>
  );
}

export default Footer;