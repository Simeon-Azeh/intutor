// ForgotPassword.tsx
"use client";

import React, { useState } from "react";
import { auth } from "../../firebase/firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FaEnvelope } from "react-icons/fa";
import { TbProgressAlert } from "react-icons/tb";
import { BsSendCheck } from "react-icons/bs";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Check your inbox.");
      setError("");
    } catch (err) {
      console.error("Error during password reset:", err);
      setError("Failed to send password reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8">
      <div className="bg-white rounded-lg p-8 w-full max-w-xl focus:shadow-xl">
        <div className="flex items-center justify-center mb-4 w-24 mx-auto">
          <FaEnvelope size={40} className="text-[#018abd]" />
        </div>

        <h2 className="text-center text-2xl font-semibold text-gray-700 mb-4">
          Forgot Password
        </h2>

        {error && (
          <p className="bg-red-400 text-center mb-4 text-white p-2 rounded-md flex items-center gap-2 justify-center">
            <TbProgressAlert size={20} />
            {error}
          </p>
        )}

        {message && (
          <p className="bg-green-400 text-center mb-4 text-white p-2 rounded-md flex items-center gap-2 justify-center">
            <BsSendCheck size={20} />
            {message}
          </p>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#018abd]"
            placeholder="your-email@school.com"
            required
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-3">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-8 w-8"></div>
            <p className="text-[#018abd] ml-2">Sending...</p>
          </div>
        ) : (
          <button
            className="w-full bg-[#018abd] text-white py-3 px-4 rounded-lg mb-4 hover:bg-blue-400 transition duration-300"
            onClick={handleSubmit}
          >
            Send Password Reset Email
          </button>
        )}

        <p className="text-center text-sm text-gray-500">
          Remembered your password?{" "}
          <button
            className="text-[#018abd] font-semibold"
            onClick={() => router.push("/signin")}
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
