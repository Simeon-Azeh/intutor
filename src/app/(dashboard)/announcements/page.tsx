"use client";

import { useState, useEffect } from "react";
import { IoLocationOutline } from "react-icons/io5";
import { BiCategory } from "react-icons/bi";
import { FaCalendarPlus } from "react-icons/fa";
import { db, auth } from "../../../firebase/firebaseConfig";
import { collection, query, where, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc }  from "firebase/firestore";

const Announcement = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]); // Announcements fetched from Firestore
  const [showMore, setShowMore] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "",
  });

  const fetchAnnouncements = async () => {
    try {
      // Get the currently logged-in user's UID
      const uid = auth.currentUser?.uid;
      if (!uid) {
        console.error("No user is logged in");
        return;
      }

      // Fetch the admin's school information from Firestore
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        console.error("User document not found");
        return;
      }

      const userData = userDoc.data();
      const schoolName = userData?.school;
      if (!schoolName) {
        console.error("School name not found in user document");
        return;
      }

      // Query Firestore to get announcements from the specific school
      const q = query(collection(db, "announcements"), where("school", "==", schoolName));
      const querySnapshot = await getDocs(q);

      // Map announcements from Firestore
      const announcementsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAnnouncements(announcementsList);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleViewMore = () => {
    setShowMore(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Get the currently logged-in user's UID
      const uid = auth.currentUser?.uid;
      if (!uid) {
        console.error("No user is logged in");
        return;
      }

      // Fetch the admin's school information from Firestore
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        console.error("User document not found");
        return;
      }

      const userData = userDoc.data();
      const schoolName = userData?.school;
      if (!schoolName) {
        console.error("School name not found in user document");
        return;
      }

      // Add the new announcement to Firestore
      await addDoc(collection(db, "announcements"), {
        ...formData,
        school: schoolName,
      });

      // Close the modal and refresh announcements
      closeModal();
      fetchAnnouncements();
    } catch (error) {
      console.error("Error adding announcement:", error);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleFormChange}
              className="w-full p-2 border border-gray-300 rounded-md mb-4 outline-none focus:ring-1 ring-[#018abd] transition-all duration-100"
              placeholder="Announcement Title"
              required
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              className="w-full p-2 border border-gray-300 rounded-md mb-4 outline-none focus:ring-1 ring-[#018abd] transition-all duration-100"
              placeholder="Announcement Details"
              required
            />
            <input
            title="date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleFormChange}
              className="w-full p-2 border border-gray-300 rounded-md mb-4 outline-none focus:ring-1 ring-[#018abd] transition-all duration-100"
              required
            />
            <input
            title="time"
              type="time"
              name="time"
              value={formData.time}
              onChange={handleFormChange}
              className="w-full p-2 border border-gray-300 rounded-md mb-4 outline-none focus:ring-1 ring-[#018abd] transition-all duration-100"
              required
            />
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleFormChange}
              className="w-full p-2 border border-gray-300 rounded-md mb-4 outline-none focus:ring-1 ring-[#018abd] transition-all duration-100"
              placeholder="Location"
              required
            />
         
            <button
              className="bg-[#018abd] text-white px-4 py-2 rounded-md mt-4"
              type="submit"
            >
              Add Announcement
            </button>
          </form>
        </div>
      </div>

      {/* Announcements Section */}
      <div className="w-full lg:w-2/3 flex flex-col gap-4">
        <div className="flex justify-between items-center flex-col md:flex-row">
          <h2 className="text-lg font-semibold text-left mb-4 lg:mb-0">Announcements</h2>
        </div>

        {/* Display Announcements */}
        <div className="space-y-4">
          {announcements.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <FaCalendarPlus size={48} className="text-gray-400" />
              <p className="text-gray-500 mt-4">No announcements available</p>
              <button
                className="mt-4 bg-[#018abd] text-white px-4 py-2 rounded-md hover:bg-[#026a8d] transition duration-200"
                onClick={openModal}
              >
                Create First Announcement
              </button>
            </div>
          ) : (
            announcements.slice(0, showMore ? announcements.length : 3).map((announcement, index) => (
              <div
                key={index}
                className="border border-[#018abd] bg-white rounded-lg p-4 transition-transform transform hover:scale-103 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">{announcement.title}</h3>
                  <span className="text-xs text-gray-400 bg-blue-50 rounded-md px-2 py-1">
                    {announcement.date} at {announcement.time}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{announcement.description}</p>
                <p className="text-xs mt-1 flex items-center gap-1 font-medium text-[#018abd]"><IoLocationOutline /> {announcement.location}</p>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1 font-medium"><BiCategory /> {announcement.category}</p>
              </div>
            ))
          )}

          {/* View More Button */}
          {!showMore && announcements.length > 3 && (
            <button
              className="text-[#018abd] font-medium text-sm mt-4 hover:underline"
              onClick={handleViewMore}
            >
              View More
            </button>
          )}
        </div>
      </div>

      {/* Modal for Announcement Creation */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Create New Announcement</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Announcement Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Enter announcement title"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Announcement Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Enter announcement description"
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                <input
                title="time"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Time</label>
                <input
                title="time"
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Enter location"
                  required
                />
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
                  Save Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcement;