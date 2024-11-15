"use client";

import { useState } from "react";
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

// TEMPORARY
const events = [
  {
    id: 1,
    title: "Meeting with Team",
    time: "12:00 PM - 2:00 PM",
    date: "2024-11-16",
    description: "Discuss project updates and next steps.",
  },
  {
    id: 2,
    title: "Client Presentation",
    time: "3:00 PM - 4:00 PM",
    date: "2024-11-17",
    description: "Present progress to the client.",
  },
  {
    id: 3,
    title: "Workshop",
    time: "5:00 PM - 6:00 PM",
    date: "2024-11-18",
    description: "Participate in skill development workshop.",
  },
];

const EventCalendar = () => {
  const [value, onChange] = useState<Date | null>(new Date()); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null); // Event selected for edit or delete
 

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
  };

  const handleEventSelection = (event: any) => {
    setSelectedEvent(event);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md relative">
      {/* Styled Calendar */}
      <Calendar
        onChange={onChange}
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
              <button
                className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                onClick={() => handleAction("Edit Event")}
              >
                <FiEdit className="mr-2" /> Edit Event
              </button>
              <button
                className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                onClick={() => handleAction("Delete Event")}
              >
                <FiTrash2 className="mr-2" /> Delete Event
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Events List */}
      <div className="mt-4 space-y-4">
        {events.map((event) => (
          <div
            className="p-4 rounded-lg shadow-md border border-[#018abd] cursor-pointer bg-white relative transition-transform transform hover:scale-105 hover:shadow-lg"
            key={event.id}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-600">{event.title}</h2>
              <span className="text-xs text-gray-400">{event.time}</span>
            </div>
            <p className="text-gray-500 text-sm">{event.description}</p>
            <p className="mt-2 text-xs text-gray-400">Date: {event.date}</p>
          </div>
        ))}
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
                <form className="mt-4 space-y-4">
                  {/* Add Event Form */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Event Title
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#018abd]"
                      placeholder="Enter event title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date
                    </label>
                    <input
                    title="date"
                      type="date"
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#018abd]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Time
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#018abd]"
                      placeholder="Enter event time (e.g., 3:00 PM - 4:00 PM)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#018abd]"
                      placeholder="Enter event description"
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
            {modalAction === "Edit Event" && !selectedEvent && (
              <>
                <p className="mt-4 text-sm text-gray-600">
                  Select an event to edit:
                </p>
                <ul className="mt-4 space-y-2">
                  {events.map((event) => (
                    <li
                      key={event.id}
                      className="p-2 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200"
                      onClick={() => handleEventSelection(event)}
                    >
                      {event.title} ({event.date})
                    </li>
                  ))}
                </ul>
              </>
            )}
         {modalAction === "Edit Event" && selectedEvent && (
  <>
    <p className="mt-4 text-sm text-gray-600">
      Editing: <strong>{selectedEvent.title}</strong>
    </p>
    <form className="mt-4 space-y-4">
      {/* Event Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Event Title
        </label>
        <input
          type="text"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#018abd]"
          defaultValue={selectedEvent.title}
          placeholder="Enter event title"
        />
      </div>

      {/* Event Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Date
        </label>
        <input
          type="date"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#018abd]"
          defaultValue={selectedEvent.date}
        />
      </div>

      {/* Event Time */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Time
        </label>
        <input
          type="text"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#018abd]"
          defaultValue={selectedEvent.time}
          placeholder="Enter event time (e.g., 3:00 PM - 4:00 PM)"
        />
      </div>

      {/* Event Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#018abd]"
          defaultValue={selectedEvent.description}
          placeholder="Enter event description"
        ></textarea>
      </div>

      {/* Notify School or Teachers */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Notify
        </label>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="notifySchool"
            className="mr-2"
            defaultChecked={false}
          />
          <label htmlFor="notifySchool" className="text-gray-600">
            Notify School
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="notifyTeachers"
            className="mr-2"
            defaultChecked={false}
          />
          <label htmlFor="notifyTeachers" className="text-gray-600">
            Notify Teachers
          </label>
        </div>
      </div>

      {/* Submit Button */}
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

            {modalAction === "Delete Event" && !selectedEvent && (
              <>
                <p className="mt-4 text-sm text-gray-600">
                  Select an event to delete:
                </p>
                <ul className="mt-4 space-y-2">
                  {events.map((event) => (
                    <li
                      key={event.id}
                      className="p-2 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200"
                      onClick={() => handleEventSelection(event)}
                    >
                      {event.title} ({event.date})
                    </li>
                  ))}
                </ul>
              </>
            )}
            {modalAction === "Delete Event" && selectedEvent && (
              <>
                <p className="mt-4 text-sm text-gray-600">
                  Are you sure you want to delete{" "}
                  <strong>{selectedEvent.title}</strong>?
                </p>
                <div className="mt-4 flex space-x-4">
                  <button className="bg-red-500 text-white px-4 py-2 rounded-md">
                    Delete
                  </button>
                  <button
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
                    onClick={closeModal}
                  >
                    Cancel
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
