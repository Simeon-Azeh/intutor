"use client";

import React from "react";
import Image from "next/image";

// Replace these placeholders with your actual images or flowchart images
import SignUpImage from "../../public/signup.svg";
import DataManagementImage from "../../public/management.svg";
import FeePaymentImage from "../../public/payment.svg";
import NotificationsImage from "../../public/notifications.svg";

const HowItWorks: React.FC = () => {
  const steps = [
    {
      title: "1. Sign Up",
      description: "Create an account and choose your role (Admin, Teacher, Parent, or Student).",
      image: SignUpImage,
    },
    {
      title: "2. Data Management",
      description: "Admins and teachers can easily manage student records and class schedules.",
      image: DataManagementImage,
    },
    {
      title: "3. Fee Payment",
      description: "Parents can securely pay fees online, while students and teachers are notified of updates.",
      image: FeePaymentImage,
    },
    {
      title: "4. Real-Time Notifications",
      description: "Stay updated with real-time notifications for schedules, exams, and announcements.",
      image: NotificationsImage,
    },
  ];

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto w-full md:w-4/5 px-6 md:px-0">
        {/* Section Header */}
        <h2 className="text-2xl font-semibold text-[#004581]  mb-10">
          How Intutor Works
        </h2>

        {/* Timeline */}
        <div className="relative">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center mb-12 relative">
              {/* Left Section: Step Image */}
              <div className="w-1/3 text-center">
                <Image
                  src={step.image}
                  alt={step.title}
                  width={250}
                  height={250}
                  className="w-42 h-42 object-contain"
                />
              </div>

              {/* Center: Timeline */}
              <div className="relative w-1/12 flex justify-center items-center">
                {/* Vertical Line (extend it beyond step indicators) */}
                <div className="relative w-6 h-6 bg-[#018abd] top-0 rounded-full border-4 border-white z-10"></div>
                {index !== steps.length - 1 && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 top-0 -bottom-6 w-0.5 h-24 bg-gray-300"></div>
                )}
                {/* Timeline Indicator */}
             
              </div>

              {/* Right Section: Step Details */}
              <div className="w-2/3 pl-6">
                <h3 className="text-lg md:text-xl font-semibold text-[#002266] mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
