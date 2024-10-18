"use client";

import React, { useState } from "react";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    // Simulate API request for password reset (you'll replace this with your API call)
    setTimeout(() => {
      // Assuming the email is sent successfully
      setEmailSent(true);
      setError("");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8">
      <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg">
        <h1 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Forgot Password
        </h1>

        {/* Conditional Success Message */}
        {emailSent ? (
          <div className="text-center text-green-600 mb-4">
            A password reset link has been sent to your email.
          </div>
        ) : (
          <>
            {/* Forgot Password Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Enter your email address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#018abd]"
                  placeholder="your-email@school.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Error Message */}
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

              <button
                type="submit"
                className="w-full bg-[#018abd] text-white py-3 px-4 rounded-lg hover:bg-[#016a9e] transition duration-300"
              >
                Send Reset Link
              </button>
            </form>

            <div className="mt-6 text-center">
              <a href="/signin" className="text-[#018abd] underline">
                Back to Sign In
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
