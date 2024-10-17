"use client";

import React from "react";
import Image from 'next/image';
import AppleLogo from '../../public/apple.svg'; // Adjust the path to your image
import GoogleLogo from '../../public/google.png'

import 'antd/dist/reset.css'; // Import Ant Design styles

const StudentAppSection: React.FC = () => {
  return (
    <section className="bg-[#018abd] py-16 flex flex-col md:flex-row items-center">
      <div className="container mx-auto w-full md:w-4/5 px-6 md:px-0 flex flex-col md:flex-row items-center">
        {/* Text Section */}
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h2 className="text-2xl font-medium text-white mb-4">
            Manage Your Learning on the Go!
          </h2>
          <p className="text-white mb-6">
            Download our student app to access your classes, track your progress,
            and stay connected with your teachers anytime, anywhere. Experience 
            the ease of managing your education right from your mobile device.
          </p>
        </div>

        {/* Buttons Section */}
        <div className="md:w-1/2 flex justify-start md:justify-end space-x-10">
         <button className=" shadow-lg rounded-md hover:translate-y-[-5px] duration-150" title="apple">
           <Image src={AppleLogo} alt='apple' width={180} height={120}/>
         </button>
         <button className=" shadow-lg rounded-md hover:translate-y-[-5px] duration-150" title="apple">
           <Image src={GoogleLogo} alt='apple' width={180} height={120}/>
         </button>
         
        </div>
      </div>
    </section>
  );
};

export default StudentAppSection;
