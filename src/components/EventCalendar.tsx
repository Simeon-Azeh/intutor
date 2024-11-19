"use client";

import { useState, useEffect } from "react";
import { CalendarOff } from 'lucide-react';
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import {
  FiChevronLeft,
  FiChevronRight,
  FiMoreVertical,
  FiEdit,
  FiTrash2,
  FiPlus,
} from "react-icons/fi";
import { db, auth } from "../firebase/firebaseConfig";
import { collection, query, where, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

const EventCalendar = () => {
  const [value, setValue] = useState<Date | [Date, Date] | null>(new Date());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null); // Event selected for edit or delete
  const [events, setEvents] = useState<any[]>([]); // Events fetched from Firestore
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    time: "",
    description: "",
  });

  const fetchEvents = async () => {
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

      // Query Firestore to get events from the specific school
      const q = query(collection(db, "events"), where("school", "==", schoolName));
      const querySnapshot = await getDocs(q);

      // Map events from Firestore
      const eventsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(eventsList);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleAction = (action: string) => {
    setModalAction(action);
    setIsDropdownOpen(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalAction("");
    setSelectedEvent(null);
    setNewEvent({
      title: "",
      date: "",
      time: "",
      description: "",
    });
  };

  const handleEventSelection = (event: any) => {
    setSelectedEvent(event);
    setNewEvent({
      title: event.title,
      date: event.date,
      time: event.time,
      description: event.description,
    });
    setModalAction("Edit Event");
    setIsModalOpen(true);
  };

  const handleDateChange = (selectedDate: Date | [Date, Date] | null) => {
    setValue(selectedDate);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
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

      if (modalAction === "Add Event") {
        // Add the new event to Firestore
        await addDoc(collection(db, "events"), {
          ...newEvent,
          school: schoolName,
        });
      } else if (modalAction === "Edit Event" && selectedEvent) {
        // Update the existing event in Firestore
        const eventDocRef = doc(db, "events", selectedEvent.id);
        await updateDoc(eventDocRef, {
          ...newEvent,
          school: schoolName,
        });
      }

      // Close the modal and refresh events
      closeModal();
      fetchEvents();
    } catch (error) {
      console.error("Error adding/updating event:", error);
    }
  };

  const handleDelete = async () => {
    try {
      if (selectedEvent) {
        // Delete the event from Firestore
        const eventDocRef = doc(db, "events", selectedEvent.id);
        await deleteDoc(eventDocRef);

        // Close the modal and refresh events
        closeModal();
        fetchEvents();
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md relative">
      {/* Styled Calendar */}
      <Calendar
        value={value}
        className="custom-calendar"
        tileClassName={({ date, view }) =>
          view === "month" &&
          value instanceof Date &&
          date.getDate() === value.getDate()
            ? "active-day"
            : null
        }
        prevLabel={<FiChevronLeft className="text-gray-500" size={20} />}
        nextLabel={<FiChevronRight className="text-gray-500" size={20} />}
      />

      {/* Events Header */}
      <div className="flex items-center justify-between mt-6">
        <h1 className="text-xl font-semibold text-gray-700">Events</h1>
        <div className="relative">
          {/* Dropdown Trigger */}
          <FiMoreVertical
            className="text-gray-500 cursor-pointer"
            size={24}
            onClick={toggleDropdown}
          />
          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <button
                className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                onClick={() => handleAction("Add Event")}
              >
                <FiPlus className="mr-2" /> Add Event
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Events List */}
      <div className="mt-4 space-y-4">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <CalendarOff size={48} className="text-gray-400" />
            <p className="text-gray-500 mt-4">No events available</p>
            <button
              className="mt-4 bg-[#018abd] text-white px-4 py-2 rounded-md hover:bg-[#026a8d] transition duration-200"
              onClick={() => handleAction("Add Event")}
            >
              Create First Event
            </button>
          </div>
        ) : (
          events.map((event) => (
            <div
              className="p-4 rounded-lg shadow-md border border-[#018abd] cursor-pointer bg-white relative transition-transform transform hover:scale-105 hover:shadow-lg"
              key={event.id}
              onClick={() => handleEventSelection(event)}
            >
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-600">{event.title}</h2>
                <span className="text-xs text-gray-400">{event.time}</span>
              </div>
              <p className="text-gray-500 text-sm">{event.description}</p>
              <p className="mt-2 text-xs text-gray-400">Date: {event.date}</p>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold text-gray-700">
              {modalAction} Event
            </h2>
            {modalAction === "Add Event" && (
              <>
                <p className="mt-4 text-sm text-gray-600">
                  Fill out the form to add a new event.
                </p>
                <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
                  {/* Add Event Form */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Event Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={newEvent.title}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#018abd]"
                      placeholder="Enter event title"
                      aria-label="Event Title"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={newEvent.date}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#018abd]"
                      title="Event Date"
                      aria-label="Event Date"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Time
                    </label>
                    <input
                      type="text"
                      name="time"
                      value={newEvent.time}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#018abd]"
                      placeholder="Enter event time (e.g., 3:00 PM - 4:00 PM)"
                      aria-label="Event Time"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={newEvent.description}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#018abd]"
                      placeholder="Enter event description"
                      aria-label="Event Description"
                      required
                    ></textarea>
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-200"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-[#018abd] text-white px-4 py-2 rounded-md hover:bg-[#026a8d] transition duration-200"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </>
            )}
            {modalAction === "Edit Event" && selectedEvent && (
              <>
                <p className="mt-4 text-sm text-gray-600">
                  Edit the form to update the event.
                </p>
                <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
                  {/* Edit Event Form */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Event Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={newEvent.title}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#018abd]"
                      placeholder="Enter event title"
                      aria-label="Event Title"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={newEvent.date}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#018abd]"
                      title="Event Date"
                      aria-label="Event Date"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Time
                    </label>
                    <input
                      type="text"
                      name="time"
                      value={newEvent.time}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#018abd]"
                      placeholder="Enter event time (e.g., 3:00 PM - 4:00 PM)"
                      aria-label="Event Time"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={newEvent.description}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#018abd]"
                      placeholder="Enter event description"
                      aria-label="Event Description"
                      required
                    ></textarea>
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-200"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-[#018abd] text-white px-4 py-2 rounded-md hover:bg-[#026a8d] transition duration-200"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
                <div className="flex justify-end space-x-4 mt-4">
                  <button
                    type="button"
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
                    onClick={handleDelete}
                  >
                    Delete Event
                  </button>
                </div>
              </>
            )}
            <button
              className="absolute top-2 right-2 text-gray-500"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCalendar;