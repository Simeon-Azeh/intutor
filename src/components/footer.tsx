"use client";

import React from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaEnvelope } from "react-icons/fa"; // Import social icons
import Image from 'next/image';
import Link from "next/link";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineEmail } from "react-icons/md";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#018abd] text-white py-12">
      <div className="container mx-auto w-full md:w-4/5 px-6 md:px-0">
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
          {/* Column 1 - Logo and Description */}
          <div className="w-full md:w-1/3">
          <div className="w-24">
          <Link href="/" passHref>
            <Image src="/logoW.svg" alt="logo" width={120} height={30} /> {/* Logo */}
          </Link>
        </div>

            <p className="text-white text-xs">
            Changing the game of Tech in Education.
            </p>
          </div>

          <div className="w-full md:w-1/3">
            <h4 className="text-lg font-medium  mb-4">Company</h4>
            <ul className="text-sm">
              <li className="mb-2 hover:text-blue-400">
                <a href="#">About Us</a>
              </li>
              <li className="mb-2 hover:text-blue-400">
                <a href="#">Pricing</a>
              </li>
              <li className="mb-2 hover:text-blue-400">
                <a href="#">Features</a>
              </li>
              <li className="mb-2 hover:text-blue-400">
                <a href="#">Blog & updates</a>
              </li>
            </ul>
          </div>

          {/* Column 2 - Quick Links */}
          <div className="w-full md:w-1/3">
            <h4 className="text-lg font-medium  mb-4">Links</h4>
            <ul className="text-sm">
              <li className="mb-2 hover:text-blue-400">
                <a href="#">FAQs</a>
              </li>
              <li className="mb-2 hover:text-blue-400">
                <a href="#">Login</a>
              </li>
              <li className="mb-2 hover:text-blue-400">
                <a href="#">Register school</a>
              </li>
              <li className="mb-2 hover:text-blue-400">
                <a href="#">Contact</a>
              </li>
            </ul>
          </div>

          {/* Column 3 - Contact Info */}
          <div className="w-full md:w-1/3">
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <p className="text-white mb-2 flex items-center gap-2"><IoLocationOutline size={23}/>239 St, Buea, Cameroon</p>
            <p className="text-white mb-4 flex items-center gap-2"><MdOutlineEmail size={20} /> support@intutor.com</p>

            {/* Social Media Icons */}
            <div className="flex gap-4">
              <a href="#" className="hover:text-blue-400">
                <FaFacebookF />
              </a>
              <a href="#" className="hover:text-blue-400">
                <FaTwitter />
              </a>
              <a href="#" className="hover:text-blue-400">
                <FaLinkedinIn />
              </a>
              <a href="mailto:support@intutor.com" className="hover:text-blue-400">
                <FaEnvelope />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom Row */}
        <div className="border-t border-gray-50 pt-6 text-center text-gray-50">
          <p>&copy; {new Date().getFullYear()} Intutor. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
