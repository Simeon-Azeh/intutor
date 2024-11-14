// src/components/NewsletterSection.tsx
"use client"

import React, { useState } from 'react';

const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(''); // State for the role selection
  const [error, setError] = useState(''); // State for error handling

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !role) {
      setError('Please fill in all fields.'); // Basic validation
      return;
    }

    // Process the form data (e.g., send to backend)
    console.log('Newsletter subscription:', { email, role });

    // Clear fields after submission
    setEmail('');
    setRole('');
    setError('');
  };

  return (
    <section className="py-16 px-6 md:px-0">
      <h2 className="text-3xl font-semibold text-center text-gray-800">Subscribe to Our Newsletter</h2>
      <p className="text-center text-gray-600 mt-2">Get personalized updates based on your role.</p>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto mt-8 space-y-4">
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full p-4 border border-gray-300 rounded-md outline-none"
            placeholder="example@gmail.com"
            required
          />
        </div>
        
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">Choose Your Role</label>
          <select
            id="role"
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            className="mt-1 block w-full p-4 border border-gray-300 rounded-md outline-none"
            required
          >
            <option value="">Select a role...</option>
            <option value="patient">School admin</option>
            <option value="provider">Student</option>
            <option value="caregiver">Teacher</option>
            <option value="caregiver">Parent</option>
          </select>
        </div>
        
        <button type="submit" className="w-full bg-[#018abd] text-white py-4 rounded-lg hover:bg-blue-500 transition">
          Subscribe
        </button>
      </form>
    </section>
  );
};

export default NewsletterSection;
