"use client";

import React from "react";
import { FaCheckCircle } from "react-icons/fa"; // Import icons for the features
import 'antd/dist/reset.css'; // Import Ant Design styles (if needed elsewhere in the app)

const Pricing: React.FC = () => {
  const pricingPlans = [
    {
      name: "Starter",
      price: "$49",
      duration: "per month",
      features: [
        "Manage up to 50 students",
        "Basic attendance tracking",
        "Basic student reports",
        "Email support",
      ],
      buttonText: "Choose Starter",
      mostPopular: false,
    },
    {
      name: "Growth",
      price: "$99",
      duration: "per month",
      features: [
        "Manage up to 200 students",
        "Advanced attendance tracking",
        "Custom student reports",
        "Priority email support",
        "Automated fee management",
      ],
      buttonText: "Choose Growth",
      mostPopular: true,
    },
    {
      name: "Enterprise",
      price: "$199",
      duration: "per month",
      features: [
        "Manage unlimited students",
        "Full attendance automation",
        "Real-time reporting and analytics",
        "Dedicated account manager",
        "Priority phone support",
        "Customizable administrative tools",
        "Integration with other school systems",
      ],
      buttonText: "Choose Enterprise",
      mostPopular: false,
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto w-full md:w-4/5 px-6 md:px-0">
        {/* Section Header */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-8">
          Select the Best Plan for Your School
        </h2>

        {/* Pricing Cards */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 inter">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white  rounded-lg p-8 w-full md:w-1/3 h-[520px] flex flex-col justify-between relative hover:translate-y-[-5px] duration-150 cursor-pointer ${
                plan.mostPopular ? "border-2 border-[#018abd]" : ""
              }`}
            >
              {/* Badge for the Best Plan */}
              {plan.mostPopular && (
                <div className="absolute top-0 right-0 bg-[#018abd] text-white px-3 py-1 rounded-bl-md text-sm">
                  Best
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">
                {plan.name}
              </h3>

              {/* Plan Price */}
              <p className="text-center text-4xl font-bold text-gray-800 mb-2">
                {plan.price}
              </p>
              <p className="text-center text-gray-500 mb-4">{plan.duration}</p>

              {/* Features List */}
              <ul className="mb-6 text-gray-700">
                {plan.features.map((feature, i) => (
                  <li key={i} className="mb-2 font-medium flex items-start">
                    <FaCheckCircle className="mr-2 text-[#018abd]" /> {/* Icon for each feature */}
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Custom Button at the Bottom */}
              <div className="mt-auto">
                <button
                  className={`w-full py-3 rounded-md ${
                    plan.mostPopular
                      ? "bg-[#018abd] text-white hover:bg-blue-500"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Row */}
        <div className="mt-12 text-center">
          <p className="text-xl text-gray-700 font-medium mb-4">
            Start your 30 days free trial today or{" "}
            <span className="text-[#018abd]  cursor-pointer">
              contact support
            </span>{" "}
            to discuss a tailored pricing plan for your school.
          </p>

          {/* Custom Call to Action Buttons */}
          <div className="flex justify-center gap-4 font-medium">
            <button className="bg-[#018abd] text-white py-3 px-8 rounded-md hover:bg-blue-500">
              Start 30 Days  Trial
            </button>
            <button className="bg-gray-200 text-gray-700 py-3 px-8 rounded-md hover:bg-gray-300">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
