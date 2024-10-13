"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { FaArrowRight, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Drawer } from 'antd';
import 'antd/dist/reset.css';
import Image from 'next/image';
import { RiMenu3Fill } from "react-icons/ri";
import { MdOutlineFeaturedPlayList } from "react-icons/md";
import { VscServerProcess } from "react-icons/vsc";
import { FaRegCircleUser } from "react-icons/fa6";

const Header: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const showDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <header className="bg-[#fff] py-2">
      <nav className="container mx-auto flex justify-between items-center w-full md:w-4/5 px-4 md:px-0">
        {/* Logo Section */}
        <div className="w-24">
          <Link href="/" passHref>
            <Image src="/logp.svg" alt="logo" width={120} height={30} /> {/* Logo */}
          </Link>
        </div>

        {/* Hamburger icon for small screens */}
        <div className="md:hidden flex items-center">
          <button type="button" title="menu" onClick={showDrawer} className="text-black">
            <RiMenu3Fill size={24} />
          </button>
        </div>

        {/* Navigation Links (visible on medium and larger screens) */}
        <ul className="hidden md:flex space-x-6 text-[#1a1a1a] font-medium items-center mt-4">
        <li className="hover:border-b-2 border-[#018abd] border-spacing-2">
            <Link href="/pricing">Home</Link>
          </li>
          {/* Dropdown for Features and How It Works */}
          <li className="relative">
            <button
              type="button"
              className="flex items-center hover:text-[#018abd] border-spacing-2 focus:outline-none"
              onClick={toggleDropdown}
            >
              Product
              {dropdownOpen ? <FaChevronUp className="ml-2" /> : <FaChevronDown className="ml-2" />}
            </button>
            {/* Dropdown Menu */}
            {dropdownOpen && (
              <ul className="absolute bg-white shadow-lg border rounded-lg mt-2 w-48  text-left">
                <li className="hover:bg-gray-100 p-2 flex items-center gap-2">
                    <MdOutlineFeaturedPlayList /> 
                  <Link href="/features" onClick={() => setDropdownOpen(false)}>Features</Link>
                </li>
                <li className="hover:bg-gray-100 p-2 flex items-center gap-2">
                <VscServerProcess />
                  <Link href="/how-it-works" onClick={() => setDropdownOpen(false)}>How It Works</Link>
                </li>
              </ul>
            )}
          </li>

          <li className="hover:border-b-2 border-[#018abd] border-spacing-2">
            <Link href="/pricing">Pricing</Link>
          </li>
          <li className="hover:border-b-2 border-[#018abd] border-spacing-2">
            <Link href="/contact">Contact</Link>
          </li>
        </ul>

        {/* Call-to-action (CTA) Buttons */}
        <div className="hidden md:flex space-x-4 items-center gap-2">
        <Link href="/signup" passHref className="bg-[#018abd] text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-500 transition flex items-center gap-2">
        <FaRegCircleUser />
            Login
           
          </Link>
          <Link href="/signin" passHref className="text-black px-4 py-3 font-medium hover:text-[#018abd] border rounded-lg">
            Register
          </Link>
         
        </div>
      </nav>

      {/* Drawer for mobile navigation */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={closeDrawer}
        open={drawerVisible}
        className="text-white bg-[#9835ff]" // Drawer styling
      >
        <ul className="space-y-6 font-medium text-[#1a1a1a] inter">
          {/* Dropdown in Drawer */}
          <li><Link href="/pricing" onClick={closeDrawer}>Home</Link></li>
          <li>
            <button
              type="button"
              className="flex justify-between items-center w-full text-left"
              onClick={toggleDropdown}
            >
              Product
              {dropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {dropdownOpen && (
              <ul className="mt-2 space-y-2 ml-4">
                <li><Link href="/features" onClick={closeDrawer}>Features</Link></li>
                <li><Link href="/how-it-works" onClick={closeDrawer}>How It Works</Link></li>
              </ul>
            )}
          </li>
          <li><Link href="/pricing" onClick={closeDrawer}>Pricing</Link></li>
          <li><Link href="/contact" onClick={closeDrawer}>Contact</Link></li>
        </ul>
        <div className=" flex  space-x-4 items-center gap-2 inter">
        <Link href="/signup" passHref className="bg-[#018abd] text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-500 transition flex items-center gap-2">
        <FaRegCircleUser />
            Login
        
          </Link>
          <Link href="/signin" passHref className="text-black px-4 py-3 font-medium hover:text-[#018abd] border rounded-lg ">
            Register your school
          </Link>
         
        </div>
      </Drawer>
    </header>
  );
};

export default Header;
