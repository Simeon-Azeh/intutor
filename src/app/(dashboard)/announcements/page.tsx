"use client";

import { useState } from "react";
import { FaUserTie, FaUserGraduate, FaUserAlt } from "react-icons/fa";
import { MdAddCircleOutline } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { BiCategory } from "react-icons/bi";

const Announcement = () => {
  const [announcements, setAnnouncements] = useState([
    {
      title: "System Maintenance Scheduled",
      date: "2025-01-01",
      time: "10:00 AM",
      description:
        "Our systems will undergo maintenance. Please expect downtime during this period.",
      location: "Main Server Room",
      category: "System Update",
    },
    {
      title: "New Features Released",
      date: "2025-01-02",
      time: "3:00 PM",
      description:
        "We are excited to introduce new features in our latest update. Check them out now!",
      location: "Product Team Briefing",
      category: "Feature Launch",
    },
    {
      title: "Holiday Closure Notice",
      date: "2025-01-05",
      time: "N/A",
      description:
        "Our office will be closed during the upcoming public holidays. Support will remain available.",
      location: "Head Office",
      category: "Holiday Notice",
    },
    {
      title: "New Update Available",
      date: "2025-01-10",
      time: "11:00 AM",
      description:
        "A new update has been rolled out, improving system stability.",
      location: "IT Support Center",
      category: "System Update",
    },
    {
      title: "Employee of the Month",
      date: "2025-01-12",
      time: "2:00 PM",
      description: "Congratulations to our Employee of the Month: John Doe!",
      location: "HR Department",
      category: "Employee Recognition",
    },
  ]);

  const [showMore, setShowMore] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "",
  });

  // Correct typing for the form change handler
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleViewMore = () => {
    setShowMore(true);
  };

  const handleSubmit = () => {
    setAnnouncements([
      ...announcements,
      { ...formData, date: new Date(formData.date).toLocaleDateString() },
    ]);
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      category: "",
    });
  };

  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* Create Announcement Section */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4">
        <h1 className="text-lg font-semibold">Create Announcement</h1>
        <div className="border border-gray-300 p-4 rounded-md bg-white">
          <h2 className="text-md font-medium mb-2">New Announcement</h2>
          {/* Add fields for creating an announcement */}
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleFormChange}
            className="w-full p-2 border border-gray-300 rounded-md mb-4 outline-none focus:ring-1 ring-[#018abd] transition-all duration-100"
            placeholder="Announcement Title"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleFormChange}
            className="w-full p-2 border border-gray-300 rounded-md mb-4 outline-none focus:ring-1 ring-[#018abd] transition-all duration-100"
        
            placeholder="Announcement Details"
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleFormChange}
            className="w-full p-2 border border-gray-300 rounded-md mb-4 outline-none focus:ring-1 ring-[#018abd] transition-all duration-100"
            placeholder="Event Date"
          />
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleFormChange}
            className="w-full p-2 border border-gray-300 rounded-md mb-4 outline-none focus:ring-1 ring-[#018abd] transition-all duration-100"
            placeholder="Event Time"
          />
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleFormChange}
            className="w-full p-2 border border-gray-300 rounded-md mb-4 outline-none focus:ring-1 ring-[#018abd] transition-all duration-100"
            placeholder="Location"
          />
          <select
          title="select"
            name="category"
            value={formData.category}
            
            className="w-full p-2 border border-gray-300 rounded-md mb-4 outline-none"
          >
            <option value="">Select Category</option>
            <option value="System Update">System Update</option>
            <option value="Feature Launch">Feature Launch</option>
            <option value="Holiday Notice">Holiday Notice</option>
            <option value="Employee Recognition">Employee Recognition</option>
          </select>
          <button
            className="bg-[#018abd] text-white px-4 py-2 rounded-md mt-4 "
            type="button"
            onClick={handleSubmit}
          >
            Add Announcement
          </button>
        </div>
      </div>

      {/* Announcements Section */}
      <div className="w-full lg:w-2/3 flex flex-col gap-4">
        <div className="flex justify-between items-center flex-col md:flex-row">
          <h2 className="text-lg font-semibold text-left mb-4 lg:mb-0">Announcements</h2>
        </div>

        {/* Display Announcements */}
        <div className="space-y-4">
          {announcements.slice(0, showMore ? announcements.length : 3).map((announcement, index) => (
            <div
              key={index}
              className="border border-[#018abd] bg-white rounded-lg p-4 transition-transform transform hover:scale-103  hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">{announcement.title}</h3>
                <span className="text-xs text-gray-400 bg-blue-50 rounded-md px-2 py-1">
                  {announcement.date} at {announcement.time}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">{announcement.description}</p>
              <p className="text-xs  mt-1 flex items-center gap-1 font-medium text-[#018abd]"><IoLocationOutline /> {announcement.location}</p>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1 font-medium"><BiCategory /> {announcement.category}</p>
            </div>
          ))}

          {/* View More Button */}
          {!showMore && (
            <button
              className="text-[#018abd] font-medium text-sm mt-4 hover:underline"
              onClick={handleViewMore}
            >
              View More
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Announcement;
