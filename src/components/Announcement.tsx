"use client"


import { useState } from "react";
import Link from "next/link";
import { FaEye, FaCalendarPlus } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosMore } from "react-icons/io";

const Announcements = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const announcements = [
    {
      title: "System Maintenance",
      date: "2025-01-01",
      description: "Our systems will undergo maintenance. Please expect downtime during this period.",
    },
    {
      title: "New Features",
      date: "2025-01-02",
      description: "We are excited to introduce new features in our latest update. Check them out now!",
    },
    {
      title: "Upcoming Holiday",
      date: "2025-01-05",
      description: "Our office will be closed during the upcoming public holidays. Support will remain available.",
    },
  ];

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const openModal = () => {
    setIsModalOpen(true);
    setIsDropdownOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-gray-800">Announcements</h1>
        <div className="relative">
          <button
          title="drop"
            onClick={toggleDropdown}
            className="flex items-center  text-xs hover:underline"
          >
            <IoIosMore size={20} className="cursor-pointer" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-10">
              <Link href="/announcements" className="flex items-center px-4 py-2 hover:bg-gray-100 text-gray-700">
              
                  <FaEye className="mr-2" /> View All
              
              </Link>
              <button
                onClick={openModal}
                className="flex items-center w-full px-4 py-2 hover:bg-gray-100 text-gray-700"
              >
                <FaCalendarPlus className="mr-2" /> Create Event
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((announcement, index) => (
          <div
            key={index}
            className="border border-[#018abd] rounded-lg p-4 transition-transform transform hover:scale-105 hover:shadow-lg cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-700">
                {announcement.title}
              </h2>
              <span className="text-xs text-gray-400 bg-blue-50 rounded-md px-2 py-1">
                {announcement.date}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {announcement.description}
            </p>
          </div>
        ))}
      </div>

      {/* Modal for Event Creation */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Create New Event</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Enter event title"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Description</label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Enter event description"
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Date and Time</label>
                {/* Replace this placeholder with a calendar component */}
                <input title="date" type="date" className="w-full border border-gray-300 rounded-md p-2 mb-2"/>
                <input title="time" type="time" className="w-full border border-gray-300 rounded-md p-2" />
                <p className="text-sm text-gray-500 mt-2">
                  <strong>Occupied Times:</strong> 10:00 - 11:00 AM, 2:00 - 3:00 PM
                </p>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="mr-2 px-4 py-2 bg-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcements;
