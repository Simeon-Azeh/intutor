"use client";

import React from "react";
import { Carousel } from "antd";
import { FaQuoteLeft } from "react-icons/fa"; // Import a quote icon from react-icons
import 'antd/dist/reset.css'; // Import Ant Design styles

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: "John Doe",
      role: "Principal at Bright Future School",
      testimonial:
        "Intutor has significantly improved how we manage our school. The real-time notifications and fee payment systems have streamlined our operations.",
    },
    {
      name: "Jane Smith",
      role: "Teacher at Green Valley High",
      testimonial:
        "I love using Intutor to manage my classes and exams. The platform is intuitive, and I can easily generate student reports and schedules. It has made my work so much easier.",
    },
    {
      name: "Alice Johnson",
      role: "Parent at Oakwood Academy",
      testimonial:
        "As a parent, Intutor gives me peace of mind. I can track my child's progress, pay fees securely online, and stay updated with all school announcements. It's a fantastic tool!",
    },
    {
      name: "Michael Brown",
      role: "Head Teacher at Horizon High",
      testimonial:
        "The automated reports feature has saved us so much time. Intutor is a game-changer for managing school records and communicating with students and parents.",
    },
    {
      name: "Emily Clark",
      role: "Parent at Riverbank School",
      testimonial:
        "Thanks to Intutor, I no longer have to worry about missing important school updates. Everything is just a click away, and the platform is so easy to use.",
    },
    {
      name: "Sophia Martinez",
      role: "Teacher at Blue Ridge School",
      testimonial:
        "The attendance tracking and class management features are top-notch. Intutor helps me stay organized and ensures my students never miss an update.",
    },
    {
      name: "David Wilson",
      role: "Principal at Sunshine Academy",
      testimonial:
        "Intutor has transformed the way we run our school. The platform is efficient, user-friendly, and has improved communication between teachers, students, and parents.",
    },
  ];

  // Helper function to split testimonials into groups of 3 for larger screens
  const getLargeScreenSlides = (items: typeof testimonials) => {
    const slides = [];
    for (let i = 0; i < items.length; i += 3) {
      slides.push(items.slice(i, i + 3));
    }
    return slides;
  };

  const largeScreenTestimonials = getLargeScreenSlides(testimonials);

  return (
    <section className="bg-[#018abd] py-16 overflow-hidden">
      <div className="container mx-auto w-full md:w-4/5 px-6 md:px-0">
        {/* Section Header */}
        <h2 className="text-2xl font-semibold text-white mb-5">
          Testimonials
        </h2>

        {/* Carousel for larger screens (3 cards per slide) */}
        <div className="hidden md:block">
          <Carousel autoplay dots={{ className: "custom-dots" }}>
            {largeScreenTestimonials.map((group, groupIndex) => (
              <div key={groupIndex}>
                <div className="flex justify-between">
                  {group.map((testimonial, index) => (
                    <div key={index} className="p-4 w-1/3">
                      <div className="bg-white shadow-md rounded-lg p-6 relative h-64 flex flex-col justify-between">
                        {/* Quote Icon */}
                        <FaQuoteLeft className="absolute -top-3 left-4 text-4xl text-gray-200" />
                        <p className="text-lg italic text-gray-700 mb-4 overflow-hidden h-42">
                          "{testimonial.testimonial}"
                        </p>
                        <div className="mt-auto">
                          <h4 className="text-lg font-semibold text-[#002266]">
                            {testimonial.name}
                          </h4>
                          <p className="text-gray-500">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Carousel>
        </div>

        {/* Carousel for mobile screens (1 card per slide) */}
        <div className="block md:hidden">
          <Carousel autoplay dots={{ className: "custom-dots" }}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className="p-4">
                <div className="bg-white shadow-md rounded-lg p-6 relative h-64 flex flex-col justify-between">
                  {/* Quote Icon */}
                  <FaQuoteLeft className="absolute -top-4 left-4 text-4xl text-gray-200" />
                  <p className="text-xl italic text-gray-700 mb-4 overflow-hidden h-24">
                    "{testimonial.testimonial}"
                  </p>
                  <div className="mt-auto">
                    <h4 className="text-lg font-semibold text-[#002266]">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
