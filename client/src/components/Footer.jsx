import { Link } from "react-router-dom";
import { Linkedin, Zap, Mail, Instagram } from "lucide-react";

export const Footer = () => (
  <footer className="bg-gray-900 text-white py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
        <div className="col-span-1 md:col-span-2">
          <Link to="/" className="flex items-center space-x-2 mb-8 group">
            <img 
              src="/logo-myHRSG.jpeg" 
              alt="myHRSG Logo" 
              className="h-10 w-auto rounded-lg group-hover:scale-105 transition-transform"
            />
            <span className="text-xl font-black tracking-tight text-white">
              my<span className="text-primary tracking-normal uppercase">HRSG</span>
            </span>
          </Link>
          <p className="text-gray-400 max-w-sm leading-relaxed mb-8">
            "Stronger Relationships. Stronger Communities."
          </p>
          <p className="text-gray-400 max-w-sm leading-relaxed">
            Empowering HR professionals to grow through meaningful relationships
            and societal impact. Join our premium network today.
          </p>
        </div>
        <div>
          <h4 className="text-lg font-bold mb-8">Quick Links</h4>
          <ul className="space-y-4 text-gray-400">
            <li>
              <Link
                to="/about"
                className="hover:text-[#0A66C2] transition-colors"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/membership"
                className="hover:text-[#0A66C2] transition-colors"
              >
                Membership
              </Link>
            </li>
            <li>
              <Link
                to="/events"
                className="hover:text-[#0A66C2] transition-colors"
              >
                Events
              </Link>
            </li>

            <li>
              <Link
                to="/hr-certifications"
                className="hover:text-[#0A66C2] transition-colors"
              >
                Knowledge Hub
              </Link>
            </li>
            <li>
              <Link
                to="/partners"
                className="hover:text-[#0A66C2] transition-colors"
              >
                Partners
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-bold mb-8">Contact Info</h4>
          <ul className="space-y-6 text-gray-400">
            <li className="flex items-start space-x-3">
              <Mail size={20} className="text-[#0A66C2] mt-1" />
              <span>hello@myhrsg.org</span>
            </li>
            <li className="flex items-start space-x-3">
              <Zap size={20} className="text-[#0A66C2] mt-1" />
              <span>+91 9764-234-011</span>
            </li>
            <li className="flex items-center space-x-6 pt-4">
              <a 
                href="https://www.linkedin.com/company/myhrsg/" 
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="hover:text-[#0A66C2] transition-all"
              >
                <Linkedin size={24} />
              </a>
              <a 
                href="https://www.instagram.com/myhrsg/" 
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-[#0A66C2] transition-all"
              >
                <Instagram size={24} />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-20 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center text-gray-400 text-sm gap-4">
        <div className="flex items-center gap-6">
          <Link
            to="/privacy-policy"
            className="hover:text-white transition-colors font-medium underline underline-offset-4"
          >
            Privacy Policy
          </Link>
        </div>
        <div className="text-gray-500">
          &copy; {new Date().getFullYear()} myHRSG. All rights reserved.
        </div>
      </div>
    </div>
  </footer>
);
