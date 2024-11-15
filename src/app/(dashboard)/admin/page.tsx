"use client";

import React, { useState } from "react";
import Announcements from "@/components/Announcement";
import AttendanceChart from "@/components/AttendanceChart";
import CountChart from "@/components/CountChart";
import EventCalendar from "@/components/EventCalendar";
import FinanceChart from "@/components/FinanceChart";
import UserCard from "@/components/UserCard";
import Joyride from "react-joyride";
import Greetings from "@/components/Greetings"; // Import Greetings component

const AdminPage = () => {
  const [runTour, setRunTour] = useState(true);

  const steps = [
    {
      target: ".user-cards",
      content: "Here you can see user statistics, including counts for students, teachers, parents, and staff.",
    },
    {
      target: ".count-chart",
      content: "This chart shows user counts across different categories.",
    },
    {
      target: ".attendance-chart",
      content: "View attendance records here over various time periods.",
    },
    {
      target: ".finance-chart",
      content: "This chart provides financial data, including budget usage and expenses.",
    },
    {
      target: ".event-calendar",
      content: "The calendar displays upcoming events relevant to the school community.",
    },
    {
      target: ".announcements",
      content: "Check important announcements and updates here.",
    }
  ];

  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row ">
      <div className="absolute bottom-0 bg-blue-500">
        <Joyride steps={steps} run={runTour} continuous showProgress showSkipButton
          styles={{
            options: {
              arrowColor: "#fff",
              backgroundColor: "#fff",
              overlayColor: "rgba(0, 0, 0, 0.4)",
              primaryColor: "#018abd",
              textColor: "#1a1a1a",
              zIndex: 1000,
            },
            tooltip: {
              borderRadius: "8px",
              boxShadow: "5px 4px 15px rgba(0, 0, 0, 0.04)",
            },
            tooltipContainer: {
              textAlign: "center",
            },
          }}
        />
      </div>

      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* USER GREETINGS */}
        <div className="greetings">
          <Greetings /> {/* Add Greetings component here */}
        </div>

        {/* USER CARDS */}
        <div className="user-cards flex gap-4 justify-between flex-wrap">
          <UserCard type="student" />
          <UserCard type="teacher" />
          <UserCard type="parent" />
          <UserCard type="staff" />
        </div>

        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* COUNT CHART */}
          <div className="count-chart w-full lg:w-1/3 h-[450px]">
            <CountChart />
          </div>
          {/* ATTENDANCE CHART */}
          <div className="attendance-chart w-full lg:w-2/3 h-[450px]">
            <AttendanceChart />
          </div>
        </div>

        {/* BOTTOM CHART */}
        <div className="finance-chart w-full h-[500px]">
          <FinanceChart />
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <div className="event-calendar">
          <EventCalendar />
        </div>
        <div className="announcements">
          <Announcements />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
