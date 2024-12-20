"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaEye, FaCalendarPlus, FaEdit, FaTrash } from "react-icons/fa";
import { IoIosMore } from "react-icons/io";
import { db, auth } from "../firebase/firebaseConfig";
import { collection, query, where, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import EventsLoader from "@/components/Loaders/EventsLoader"; // Import EventsLoader
import { useDarkMode } from "@/components/DarkModeContext"; // Adjust the import based on your project structure

const Announcements = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    date: "",
    description: "",
  });
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true); // Loading state for announcements
  const { darkMode } = useDarkMode(); // Use the dark mode context

  const fetchUserRole = async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        console.error("No user is logged in");
        return;
      }

      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        console.error("User document not found");
        return;
      }

      const userData = userDoc.data();
      setUserRole(userData?.role || null);
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        console.error("No user is logged in");
        return;
      }

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

      const q = query(collection(db, "announcements"), where("school", "==", schoolName));
      const querySnapshot = await getDocs(q);

      const announcementsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAnnouncements(announcementsList);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    } finally {
      setLoadingAnnouncements(false); // Stop loading after fetching announcements
    }
  };

  useEffect(() => {
    fetchUserRole();
    fetchAnnouncements();
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const openModal = (announcement = null) => {
    setSelectedAnnouncement(announcement);
    setNewAnnouncement(announcement || { title: "", date: "", description: "" });
    setIsModalOpen(true);
    setIsDropdownOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewAnnouncement({ title: "", date: "", description: "" });
    setSelectedAnnouncement(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewAnnouncement((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        console.error("No user is logged in");
        return;
      }

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

      if (selectedAnnouncement) {
        await updateDoc(doc(db, "announcements", selectedAnnouncement.id), {
          ...newAnnouncement,
          school: schoolName,
        });
      } else {
        await addDoc(collection(db, "announcements"), {
          ...newAnnouncement,
          school: schoolName,
        });
      }

      closeModal();
      fetchAnnouncements();
    } catch (error) {
      console.error("Error saving announcement:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "announcements", id));
      fetchAnnouncements();
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  };

  return (
    <div className={`p-6 rounded-lg relative ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-black'}`}>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Announcements</h1>
        {userRole === "Admin" && (
          <div className="relative">
            <button
              title="drop"
              onClick={toggleDropdown}
              className="flex items-center text-xs hover:underline"
            >
              <IoIosMore size={20} className="cursor-pointer" />
            </button>
            {isDropdownOpen && (
              <div className={`absolute right-0 mt-2 w-40 rounded-md shadow-lg border z-10 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <Link href="/announcements" className={`flex items-center px-4 py-2 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                  <FaEye className="mr-2" /> View All
                </Link>
                <button
                  onClick={() => openModal()}
                  className={`flex items-center w-full px-4 py-2 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <FaCalendarPlus className="mr-2" /> Create
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-4">
        {loadingAnnouncements ? (
          <EventsLoader /> // Use EventsLoader component here
        ) : announcements.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <FaCalendarPlus size={48} className="text-gray-400" />
            <p className="mt-4">No announcements available</p>
            {userRole === "Admin" && (
              <button
                className="mt-4 bg-[#018abd] text-white px-4 py-2 rounded-md hover:bg-[#026a8d] transition duration-200"
                onClick={() => openModal()}
              >
                Create First Announcement
              </button>
            )}
          </div>
        ) : (
          announcements.map((announcement, index) => (
            <div
              key={index}
              className={`border shadow-md rounded-lg p-4 transition-transform transform hover:scale-105 hover:shadow-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-[#018abd]'} ${userRole !== "Admin" ? "pointer-events-none" : ""}`}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium">{announcement.title}</h2>
                <span className="text-xs bg-blue-50 rounded-md px-2 py-1">
                  {announcement.date}
                </span>
              </div>
              <p className="text-sm mt-2">
                {announcement.description}
              </p>
              {userRole === "Admin" && (
                <div className="flex justify-end mt-2">
                  <button
                    title="edit"
                    onClick={() => openModal(announcement)}
                    className="mr-2 px-2 py-2 bg-[#018abd] text-white rounded-md"
                  >
                    <FaEdit />
                  </button>
                  <button
                    title="delete"
                    onClick={() => handleDelete(announcement.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded-md"
                  >
                    <FaTrash />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className={`p-8 rounded-lg shadow-lg w-full max-w-lg ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-black'}`}>
            <h2 className="text-xl font-semibold mb-4">{selectedAnnouncement ? "Edit Announcement" : "Create New Announcement"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Announcement Title</label>
                <input
                  type="text"
                  name="title"
                  value={newAnnouncement.title}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#018abd]"
                  placeholder="Enter announcement title"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Announcement Description</label>
                <textarea
                  name="description"
                  value={newAnnouncement.description}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#018abd]"
                  placeholder="Enter announcement description"
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Select Date</label>
                <input
                  title="date"
                  type="date"
                  name="date"
                  value={newAnnouncement.date}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#018abd]"
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

export default Announcements;