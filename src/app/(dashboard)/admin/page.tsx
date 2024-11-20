"use client";

import React, { useState, useEffect } from "react";
import Announcements from "@/components/Announcement";
import AttendanceChart from "@/components/AttendanceChart";
import CountChart from "@/components/CountChart";
import EventCalendar from "@/components/EventCalendar";
import FinanceChart from "@/components/FinanceChart";
import UserCard from "@/components/UserCard";
import Joyride from "react-joyride";
import Greetings from "@/components/Greetings"; // Import Greetings component
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebaseConfig"; // Adjust the import path as needed
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  role: string;
  email: string;
  school: string;
  // Add other fields as needed
}

const AdminPage = () => {
  const [runTour, setRunTour] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [parentCount, setParentCount] = useState(0);
  const [staffCount, setStaffCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const uid = auth.currentUser?.uid;
        if (!uid) {
          router.push("/signin");
          return;
        }

        const userDocRef = doc(db, "users", uid);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.data();

        if (userData?.role !== "Admin") {
          router.push("/signin");
          return;
        }

        const userSchool = userData?.school;

        const q = query(collection(db, "users"), where("school", "==", userSchool));
        const querySnapshot = await getDocs(q);
        const usersList: User[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));

        setUsers(usersList);

        // Calculate counts for each role
        const studentCount = usersList.filter(user => user.role === "Student").length;
        const teacherCount = usersList.filter(user => user.role === "Teacher").length;
        const parentCount = usersList.filter(user => user.role === "Parent").length;
        const staffCount = usersList.filter(user => user.role === "Admin").length;

        setStudentCount(studentCount);
        setTeacherCount(teacherCount);
        setParentCount(parentCount);
        setStaffCount(staffCount);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [router]);

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
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <UserCard type="student" count={studentCount} />
              <UserCard type="teacher" count={teacherCount} />
              <UserCard type="parent" count={parentCount} />
              <UserCard type="staff" count={staffCount} />
            </>
          )}
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