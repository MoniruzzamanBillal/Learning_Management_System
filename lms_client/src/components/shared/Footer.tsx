import { Facebook, Linkedin, Twitter, Youtube } from "lucide-react";

import { Link } from "react-router-dom";
import Wrapper from "./Wrapper";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8 ">
      <Wrapper className="container mx-auto  grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Column 1: Logo & Description */}
        <div className="col-span-1">
          <Link
            to="/"
            className="text-2xl font-bold text-white font-headingFont mb-4 block"
          >
            MATS <span className="text-teal-500">Academy</span>
          </Link>
          <p className="text-sm leading-relaxed mb-4">
            Empowering the next generation of tech professionals through
            interactive and skill-focused online learning.
          </p>
          <div className="flex space-x-4">
            <a
              href="https://www.facebook.com/MoniruzzamanBillal3018"
              target="_blank"
              aria-label="Facebook"
              className="text-gray-400 hover:text-teal-500 transition-colors"
            >
              <Facebook className="h-6 w-6" />
            </a>
            <a
              href="https://x.com/MdMoniruzz48991"
              target="_blank"
              aria-label="Twitter"
              className="text-gray-400 hover:text-teal-500 transition-colors"
            >
              <Twitter className="h-6 w-6" />
            </a>
            <a
              href="https://www.linkedin.com/in/MoniruzzamanBillal3018/"
              target="_blank"
              aria-label="LinkedIn"
              className="text-gray-400 hover:text-teal-500 transition-colors"
            >
              <Linkedin className="h-6 w-6" />
            </a>

            <a
              href="#"
              aria-label="YouTube"
              className="text-gray-400 hover:text-teal-500 transition-colors"
            >
              <Youtube className="h-6 w-6" />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="col-span-1">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link
                to="/courses"
                className="hover:text-teal-500 transition-colors text-sm"
              >
                Courses
              </Link>
            </li>
            <li>
              <Link
                to="/instructors"
                className="hover:text-teal-500 transition-colors text-sm"
              >
                Instructors
              </Link>
            </li>
            <li>
              <Link
                to="/features"
                className="hover:text-teal-500 transition-colors text-sm"
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                to="/faq"
                className="hover:text-teal-500 transition-colors text-sm"
              >
                FAQ
              </Link>
            </li>
            <li>
              <Link
                to="/about-us"
                className="hover:text-teal-500 transition-colors text-sm"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-teal-500 transition-colors text-sm"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact Info */}
        <div className="col-span-1">
          <h3 className="text-lg font-semibold text-white mb-4">
            Contact Info
          </h3>
          <p className="text-sm mb-2">123 Learning Lane, Tech City, TC 12345</p>
          <p className="text-sm mb-2">Email: support@devmats.com</p>
          <p className="text-sm mb-2">Phone: +1 (234) 567-890</p>
          <p className="text-sm">Hours: Mon-Fri, 9 AM - 5 PM (EST)</p>
        </div>
      </Wrapper>

      {/* Copyright */}
      <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} MATS Academy. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
