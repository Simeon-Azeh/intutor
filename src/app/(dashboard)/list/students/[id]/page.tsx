"use client";

import { useParams } from "next/navigation"; // Use next/navigation instead of next/router
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import Announcements from "@/components/Announcement";
import BigCalendar from "@/components/BigCalender";
import Performance from "@/components/Performance";
import Image from "next/image";
import Link from "next/link";
import { useDarkMode } from "@/components/DarkModeContext"; // Adjust the import based on your project structure

const SingleStudentPage = () => {
  const { id } = useParams(); // Use useParams to get the id parameter
  const [student, setStudent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useDarkMode(); // Use the dark mode context

  useEffect(() => {
    const fetchStudent = async () => {
      if (id) {
        const docRef = doc(db, "students", id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setStudent(docSnap.data());
        } else {
          console.error("No such document!");
        }
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!student) {
    return <p>No student found.</p>;
  }

  return (
    <div className={`flex-1 p-4 flex flex-col gap-4 xl:flex-row ${darkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-black'}`}>
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* USER INFO CARD */}
          <div className={`py-6 px-4 rounded-md flex-1 flex gap-4 ${darkMode ? 'bg-gray-800' : 'bg-lamaSky'}`}>
            <div className="w-1/3">
              <Image
                src={student.img || "https://via.placeholder.com/150"}
                alt="Student Image"
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <h1 className="text-xl font-semibold">{student.firstName} {student.lastName}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {student.description || "No description available."}
              </p>
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/blood.png" alt="Blood Type" width={14} height={14} />
                  <span>{student.bloodType}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/date.png" alt="Join Date" width={14} height={14} />
                  <span>{student.joinDate}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/mail.png" alt="Email" width={14} height={14} />
                  <span>{student.email}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/phone.png" alt="Phone" width={14} height={14} />
                  <span>{student.phone}</span>
                </div>
              </div>
            </div>
          </div>
          {/* SMALL CARDS */}
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            {/* CARD */}
            <div className={`p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%] ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <Image
                src="/singleAttendance.png"
                alt="Attendance"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">{student.attendance || "N/A"}</h1>
                <span className="text-sm text-gray-400">Attendance</span>
              </div>
            </div>
            {/* CARD */}
            <div className={`p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%] ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <Image
                src="/singleBranch.png"
                alt="Grade"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">{student.grade || "N/A"}</h1>
                <span className="text-sm text-gray-400">Grade</span>
              </div>
            </div>
            {/* CARD */}
            <div className={`p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%] ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <Image
                src="/singleLesson.png"
                alt="Lessons"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">{student.lessons || "N/A"}</h1>
                <span className="text-sm text-gray-400">Lessons</span>
              </div>
            </div>
            {/* CARD */}
            <div className={`p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%] ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <Image
                src="/singleClass.png"
                alt="Class"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">{student.class || "N/A"}</h1>
                <span className="text-sm text-gray-400">Class</span>
              </div>
            </div>
          </div>
        </div>
        {/* BOTTOM */}
        <div className={`mt-4 rounded-md p-4 h-[800px] ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h1>Student&apos;s Schedule</h1>
          <BigCalendar />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className={`p-4 rounded-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500 dark:text-gray-400">
            <Link className={`p-3 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-lamaSkyLight'}`} href="/">
              Student&apos;s Lessons
            </Link>
            <Link className={`p-3 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-lamaPurpleLight'}`} href="/">
              Student&apos;s Teachers
            </Link>
            <Link className={`p-3 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-pink-50'}`} href="/">
              Student&apos;s Exams
            </Link>
            <Link className={`p-3 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-lamaSkyLight'}`} href="/">
              Student&apos;s Assignments
            </Link>
            <Link className={`p-3 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-lamaYellowLight'}`} href="/">
              Student&apos;s Results
            </Link>
          </div>
        </div>
        <Performance />
        <Announcements />
      </div>
    </div>
  );
};

export default SingleStudentPage;