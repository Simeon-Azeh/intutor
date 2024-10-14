"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles

import EfficientDataImage from "../../public/management.svg";
import ReportsImage from "../../public/datareport.svg";
import RealTimeImage from "../../public/updates.svg";
import SecurePaymentsImage from "../../public/payment.svg";
import AttendanceImage from "../../public/progress.svg";
import ParentPortalImage from "../../public/parents.svg";

const Features: React.FC = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 }); // Initialize AOS with a 1-second animation duration
  }, []);

  const features = [
    {
      title: "Efficient Data Management",
      description:
        "Streamline the way your school handles records with our centralized platform.",
      image: EfficientDataImage,
      animation: "fade-up", // AOS animation type
    },
    {
      title: "Automated Reports",
      description:
        "Generate detailed student reports automatically with just a few clicks.",
      image: ReportsImage,
      animation: "fade-up",
    },
    {
      title: "Real-Time Updates",
      description:
        "Stay updated with real-time notifications on schedules, exams, and announcements.",
      image: RealTimeImage,
      animation: "fade-up",
    },
    {
      title: "Secure Fee Payments",
      description:
        "Ensure hassle-free fee transactions with our secure online payment system.",
      image: SecurePaymentsImage,
      animation: "fade-up",
    },
    {
      title: "Attendance Tracking",
      description:
        "Monitor student attendance and receive daily updates, all within the platform.",
      image: AttendanceImage,
      animation: "fade-up",
    },
    {
      title: "Parent Portal",
      description:
        "Give parents easy access to track their child's progress, grades, and fee payments.",
      image: ParentPortalImage,
      animation: "fade-up",
    },
  ];

  return (
    <section className="bg-[#f9f9f9] py-16">
      <div className="container mx-auto w-full md:w-4/5 px-6 md:px-0">
        {/* Section Header */}
        <h2 className="text-2xl font-semibold text-[#004581]  mb-10">
          Features
        </h2>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg p-6 text-center flex flex-col items-center space-y-4"
              data-aos={feature.animation} // Add AOS animation here
            >
              <Image
                src={feature.image}
                alt={feature.title}
                width={120}
                height={120}
                className="w-28 h-28 object-contain"
              />
              <h3 className="text-xl font-semibold text-[#002266]">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
