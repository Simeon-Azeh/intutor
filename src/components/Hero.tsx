"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AOS from 'aos';
import 'aos/dist/aos.css';
import HeroImage from '../../public/intutor-hero.png'; // Adjust the path to your image
import { IoIosArrowRoundForward } from "react-icons/io";


const Hero: React.FC = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 }); // Initialize AOS with desired options
  }, []);

  return (
    <section className="bg-white py-12 overflow-hidden">
      <div className="container mx-auto flex flex-col md:flex-row items-center w-full md:w-4/5 px-6 md:px-0 inter">
        {/* Left Section: Text and Buttons */}
        <div
          className="md:w-1/2 text-left space-y-6 overflow-x-hidden"
          data-aos="fade-right" // AOS animation for the text section
        >
          <h1 className="text-3xl font-semibold text-[#004581] inter">
            Transforming the way schools{' '}
            <span className="text-[#018abd]">Manage Data</span>
          </h1>
          <p className="text-lg text-gray-600">
            Empowering Schools, Teachers, Parents, and Students with a
            comprehensive data management solution. With Intutor, paying fees,
            following schedules, etc., has never been easier.
          </p>
          <div className="flex space-x-4">
            <Link
              href="/get-started"
              className="bg-[#018abd] text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-500 transition flex items-center gap-2"
            >
              Get Started
              <IoIosArrowRoundForward size={24}/>
            </Link>
            <Link
              href="/learn-more"
              className="text-black px-4 py-3 font-medium hover:text-[#018abd] border rounded-lg"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Right Section: Image */}
        <div
          className="md:w-1/2 mt-8 md:mt-0 overflow-hidden"
          data-aos="fade-left" // AOS animation for the image section
        >
          <Image src={HeroImage} alt="Intutor hero" className="w-full h-auto" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
