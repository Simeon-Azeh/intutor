"use client";

import React from "react";
import 'antd/dist/reset.css'; // Import Ant Design styles

const partners = [
  "/logos/partner1.png", // Replace these with actual paths to your partner logos
  "/logos/partner2.png",
  "/logos/partner3.svg",
  "/logos/partner4.png",
  "/logos/partner5.png",
  "/logos/partner6.png",
  "/logos/partner7.png",
  
];

const PartnerSlider: React.FC = () => {
  return (
    <section className="bg-white py-12">
      <div className="">
        {/* Header */}
        <h2 className="text-xl font-semibold text-gray-700 mb-8 w-full md:w-4/5 mx-auto">Trusted by</h2>

        {/* Marquee Effect Container */}
        <div className="overflow-hidden">
          <div className="flex animate-marquee space-x-20">
            {partners.map((partner, index) => (
              <div key={index} className="flex-shrink-0">
                <div className=" rounded-lg p-4 h-[100px] w-[200px] flex justify-center items-center">
                  <img
                    src={partner}
                    alt={`Partner ${index + 1}`}
                    className="h-full object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerSlider;
