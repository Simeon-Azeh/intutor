"use client";

import React, { useState } from "react";
import { FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa"; // Import icons
import { MdAdminPanelSettings } from "react-icons/md";
import { RiParentFill } from "react-icons/ri";
import { FaEye, FaEyeSlash, FaUserTie } from "react-icons/fa";
import Logo from '../../../public/logp.svg';
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";

const SignInForm: React.FC = () => {
  const [role, setRole] = useState<string>(""); // Role state
  const [email, setEmail] = useState<string>(""); // Email state
  const [password, setPassword] = useState<string>(""); // Password state
  const [showPassword, setShowPassword] = useState<boolean>(false); // Show/Hide password state
  const [error, setError] = useState<string>(""); // Error message state

  // Handle role selection
  const handleRoleSelect = (selectedRole: string) => {
    setRole(selectedRole);
    setError(""); // Clear error when role is selected
  };

  // Toggle show/hide password
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle form submission with validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password || !role) {
      setError("Please fill in all fields.");
      return;
    }

    // Add additional validation if needed (e.g., valid email format)

    // Process the form data (e.g., send to backend)
    console.log("Form Submitted:", { email, password, role });

    // Clear form after submission
    setEmail("");
    setPassword("");
    setRole("");
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center  py-8">
      <div className="bg-white rounded-lg p-8 w-full max-w-xl focus:shadow-xl">
        {/* Logo */}
        <div className="flex items-center justify-center mb-2 w-24 mx-auto">
          <Image src={Logo} width={150} height={120} alt="Logo" />
        </div>

        {/* Role Selection */}
        <div className="mb-4">
          <p className="text-gray-600 text-center mb-4">
            Hello, what type of account do you own?
          </p>

          {/* Grid Layout for Role Selection */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4">
            {/* Admin Role */}
            <div
              onClick={() => handleRoleSelect("Admin")}
              className={`border-2 rounded-lg p-4 text-center cursor-pointer flex flex-col items-center justify-center ${
                role === "Admin" ? "border-[#018abd]" : "border-gray-300"
              } hover:border-[#018abd] transition duration-300`}
            >
              <MdAdminPanelSettings className="text-2xl text-gray-600 mb-2" />
              <p className="font-semibold text-gray-700">Admin</p>
            </div>

            {/* Teacher Role */}
            <div
              onClick={() => handleRoleSelect("Teacher")}
              className={`border-2 rounded-lg p-4 text-center cursor-pointer flex flex-col items-center justify-center ${
                role === "Teacher" ? "border-[#018abd]" : "border-gray-300"
              } hover:border-[#018abd] transition duration-300`}
            >
              <FaChalkboardTeacher className="text-2xl text-gray-600 mb-2" />
              <p className="font-semibold text-gray-700">Teacher</p>
            </div>

            {/* Parent Role */}
            <div
              onClick={() => handleRoleSelect("Parent")}
              className={`border-2 rounded-lg p-4 text-center cursor-pointer flex flex-col items-center justify-center ${
                role === "Parent" ? "border-[#018abd]" : "border-gray-300"
              } hover:border-[#018abd] transition duration-300`}
            >
              <RiParentFill className="text-2xl text-gray-600 mb-2" />
              <p className="font-semibold text-gray-700">Parent</p>
            </div>

            {/* Student Role */}
            <div
              onClick={() => handleRoleSelect("Student")}
              className={`border-2 rounded-lg p-4 text-center cursor-pointer flex flex-col items-center justify-center ${
                role === "Student" ? "border-[#018abd]" : "border-gray-300"
              } hover:border-[#018abd] transition duration-300`}
            >
              <FaUserGraduate className="text-2xl text-gray-600 mb-2" />
              <p className="font-semibold text-gray-700">Student</p>
            </div>
          </div>
        </div>

        {/* Greeting Message */}
        {role && (
          <p className="text-md font-medium text-center text-gray-700 mb-4">
            Hello <span>{role}</span>! Please enter credentials to access your account.
          </p>
        )}

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Email Input */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#018abd]"
            placeholder="your-email@school.com"
            required
          />
        </div>

        {/* Password Input with Eye Toggle */}
        <div className="mb-6 relative">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#018abd]"
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 top-5 right-0 pr-3 flex items-center text-gray-600"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Forgot Password Link */}
        <div className="text-right mb-6">
          <a href="/forgot-password" className="text-md text-[#018abd] hover:underline">
            Forgot Password?
          </a>
        </div>

       

        {/* Sign In Button */}
        <button
          className={`w-full bg-[#018abd] text-white py-3 px-4 rounded-lg mb-4 ${
            role ? "hover:bg-blue-400" : "opacity-50 cursor-not-allowed"
          } transition duration-300`}
          onClick={handleSubmit}
          disabled={!role} // Disable button if no role selected
        >
          Sign In
        </button>
        <p className="text-sm text-center font-medium text-gray-400">Or</p>
         {/* Work Email Sign In Button */}
         <button className="w-full text-gray-800 border flex items-center justify-center gap-2 font-medium py-3 px-4 rounded-lg mb-6  transition duration-300">
         <FcGoogle size={24}/>
          Continue with work email
        </button>

        {/* Note about registration */}
        <p className="text-sm text-gray-500 text-center mt-6">
          Need to register your school? Visit our registration platform on{" "}
          <a
            href="https://register.intutor.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#018abd] underline"
          >
            register.intutor.com
          </a>.
        </p>
      </div>
    </div>
  );
};

export default SignInForm;
