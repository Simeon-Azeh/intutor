"use client";

import Image from "next/image";
import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"; // Import icons
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";


type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

// TEMPORARY
const events = [
  {
    id: 1,
    title: "Lorem ipsum dolor",
    time: "12:00 PM - 2:00 PM",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: 2,
    title: "Lorem ipsum dolor",
    time: "3:00 PM - 4:00 PM",
    description: "Aliquam tincidunt mauris eu risus.",
  },
  {
    id: 3,
    title: "Lorem ipsum dolor",
    time: "5:00 PM - 6:00 PM",
    description: "Praesent dapibus, neque id cursus faucibus.",
  },
];

const EventCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Styled Calendar */}
      <Calendar
        onChange={onChange}
        value={value}
        className="custom-calendar"
        tileClassName={({ date, view }) => 
          view === 'month' && value instanceof Date && date.getDate() === value.getDate() ? 'active-day' : null
        }
        prevLabel={<FiChevronLeft className="text-gray-500" size={20} />} // Using FiChevronLeft
        nextLabel={<FiChevronRight className="text-gray-500" size={20} />} // Using FiChevronRight
      />
      
      {/* Events Header */}
      <div className="flex items-center justify-between mt-6">
        <h1 className="text-xl font-semibold text-gray-700">Events</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
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
            <p className="mt-2 text-gray-500 text-sm">{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventCalendar;
