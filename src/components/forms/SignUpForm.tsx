"use client";

import React, { useState } from "react";
import { FaChalkboardTeacher, FaUserGraduate, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import { RiParentFill } from "react-icons/ri";
import { TbProgressAlert } from "react-icons/tb";
import Image from "next/image";
import { auth, db } from "../../firebase/firebaseConfig";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
import Link from "next/link";
import Logo from "../../../public/logp.svg";
import { FirebaseError } from "firebase/app";

const schools = ["RHIMBS", "HIBMAT", "HIMS", "RUBICOL", "University of Buea"]; // Example school list

const RegistrationForm: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [school, setSchool] = useState<string>("");
  const [customSchool, setCustomSchool] = useState<string>("");
  const [schoolSuggestions, setSchoolSuggestions] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const router = useRouter();

  const handleRoleSelect = (selectedRole: string) => {
    setRole(selectedRole);
    setError("");
  };

  const handleSchoolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSchool(value);
    if (value) {
      const suggestions = schools.filter((school) =>
        school.toLowerCase().includes(value.toLowerCase())
      );
      setSchoolSuggestions(suggestions);
    } else {
      setSchoolSuggestions([]);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !role || (!school && !customSchool)) {
      setError("Please fill in all fields and select a valid role.");
      return;
    }
  
    if (role !== "Admin") {
      setError("Only admins can create accounts. Please contact your admin.");
      return;
    }
  
    if (!termsAccepted) {
      setError("You must accept the terms and conditions and fair use policy.");
      return;
    }
  
    setLoading(true);
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
  
      // Send email verification
      await sendEmailVerification(userCredential.user);
  
      // Save user data to Firestore
      const userDocRef = doc(db, "users", uid);
      await setDoc(userDocRef, {
        name,
        email,
        role,
        school: customSchool || school,
        onboardingComplete: false, // Add this field
      });
  
      setSuccessMessage("Account created successfully! Please check your email to verify your account before continuing to onboard.");
      setError("");
    } catch (error) {
      console.error("Error during registration:", error);
      const err = error as FirebaseError;
      if (err.code === 'auth/email-already-in-use') {
        setError("This email is already in use. Please use a different email.");
      } else if (err.code === 'auth/invalid-email') {
        setError("The email address is not valid. Please enter a valid email.");
      } else if (err.code === 'auth/weak-password') {
        setError("The password is too weak. Please enter a stronger password.");
      } else {
        setError("Failed to create account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center py-8">
      <div className="bg-white rounded-lg p-8 w-full max-w-xl focus:shadow-xl">
        <div className="flex items-center justify-center mb-2 w-24 mx-auto">
          <Image src={Logo} width={150} height={120} alt="Logo" />
        </div>

        <div className="mb-4">
          <p className="text-gray-600 text-center mb-4">
            Register for an account
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4">
            {/* Role options */}
            {[
              { label: "Admin", icon: <MdAdminPanelSettings /> },
              { label: "Teacher", icon: <FaChalkboardTeacher /> },
              { label: "Parent", icon: <RiParentFill /> },
              { label: "Student", icon: <FaUserGraduate /> }
            ].map((item) => (
              <div
                key={item.label}
                onClick={() => handleRoleSelect(item.label)}
                className={`border-2 rounded-lg p-4 text-center cursor-pointer flex flex-col items-center justify-center ${role === item.label ? "border-[#018abd]" : "border-gray-300"} hover:border-[#018abd] transition duration-300`}
              >
                <div className="text-2xl text-gray-600 mb-2">{item.icon}</div>
                <p className="font-semibold text-gray-700">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {error && <p className="bg-red-400 text-center mb-4 text-white p-2 rounded-md flex items-center gap-2 justify-center"><TbProgressAlert size={20} />{error}</p>}
        {successMessage && <p className="bg-green-400 text-center mb-4 text-white p-2 rounded-md flex items-center gap-2 justify-center">{successMessage}</p>}

        {/* Full Name input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
          title="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#018abd]"
            required
          />
        </div>

        {/* Email input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
          title="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#018abd]"
            required
          />
        </div>

        {/* Password input */}
        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
          title="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#018abd]"
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 top-5 flex items-center text-gray-600"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* School input */}
        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">School</label>
          <input
          title="school"
            type="text"
            value={school}
            onChange={handleSchoolChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#018abd]"
            required
          />
          {schoolSuggestions.length > 0 && (
            <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md font-medium text-[#018abd]  mt-1">
              {schoolSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setSchool(suggestion);
                    setSchoolSuggestions([]);
                  }}
                >
                  {suggestion}
                </div>
              ))}
              <div
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  setSchool("Other");
                  setSchoolSuggestions([]);
                }}
              >
                Other
              </div>
            </div>
          )}
          {school === "Other" && (
            <input
              type="text"
              value={customSchool}
              onChange={(e) => setCustomSchool(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#018abd] mt-2"
              placeholder="Enter your school"
              required
            />
          )}
        </div>

        {/* Terms and Conditions checkbox */}
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="form-checkbox h-5 w-5 text-[#018abd] border-gray-300 rounded focus:ring-[#018abd]"
              required
            />
            <span className="ml-2 text-gray-700">
              I have read and understood the{" "}
              <Link href="/terms" className="text-[#018abd]">terms and conditions</Link> and{" "}
              <Link href="/fair-use" className="text-[#018abd]">fair use policy</Link>.
            </span>
          </label>
        </div>

        {/* Loading spinner or Register button */}
        {loading ? (
          <div className="flex items-center justify-center py-3">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-6 w-6 -mt-4"></div>
            <p className="text-[#018abd] ml-2">Registering...</p>
          </div>
        ) : (
          <button
            className={`w-full bg-[#018abd] text-white py-3 px-4 rounded-lg mb-4 ${role ? "hover:bg-blue-400" : "opacity-50 cursor-not-allowed"} transition duration-300`}
            onClick={handleSubmit}
            disabled={!role}
          >
            Register
          </button>
        )}

        <p className="text-center text-gray-500">Already have an account? <Link href="/signin" className="text-[#018abd]">Sign In</Link></p>
      </div>
    </div>
  );
};

export default RegistrationForm;