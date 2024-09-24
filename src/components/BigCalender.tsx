"use client";

import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";
import { calendarEvents } from "@/lib/data";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";

const localizer = momentLocalizer(moment);

// Define the CalendarEvent interface
interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  tutor: string; // Add this line for the tutor's name
  allDay?: boolean;
}

const BigCalendar = () => {
  const [view, setView] = useState<View>(Views.WORK_WEEK);

  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
  };

  // Custom event component
  const Event: React.FC<{ event: CalendarEvent }> = ({ event }) => {
    return (
      <div>
        <strong>{event.title}</strong>
        <div className="italic mt-2 font-mormal text-xs ">
           {event.tutor}
        </div>
      </div>
    );
  };

  return (
    <Calendar
      localizer={localizer}
      events={calendarEvents}
      startAccessor="start"
      endAccessor="end"
      views={["work_week", "day"]}
      view={view}
      style={{ height: "98%" }}
      onView={handleOnChangeView}
      min={new Date(2025, 1, 0, 8, 0, 0)}
      max={new Date(2025, 1, 0, 17, 0, 0)}
      components={{
        event: Event, // Use the custom event component
      }}
    />
  );
};

export default BigCalendar;
