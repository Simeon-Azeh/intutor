"use client";

import { useRouter, useParams } from "next/navigation"; // Use next/navigation instead of next/router
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import Announcements from "@/components/Announcement";
import BigCalendar from "@/components/BigCalender";
import FormModal from "@/components/FormModal";
import Performance from "@/components/Performance";
import Image from "next/image";
import Link from "next/link";
import { School, BookCopy, Banknote, Calendar, BookOpen } from 'lucide-react';

const SingleTeacherPage = () => {
  const router = useRouter();
  const { id } = useParams(); // Use useParams to get the id parameter
  const [teacher, setTeacher] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacher = async () => {
      if (id) {
        const docRef = doc(db, "teachers", id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTeacher(docSnap.data());
        } else {
          console.error("No such document!");
        }
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!teacher) {
    return <p>No teacher found.</p>;
  }

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* USER INFO CARD */}
          <div className="bg-white py-4 px-6 ">
            <div className="flex justify-center">
              <Image
                src={teacher.img || "/avatar.png"}
                alt="Teacher Image"
                width={100}
                height={100}
                className="rounded-[200px] object-cover mb-2"
              />
            </div>
            <div className="flex flex-col justify-between gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold text-[#1a1a1a]">{teacher.firstName} {teacher.lastName}</h1>
                {teacher.role === "admin" && <FormModal
                  table="teacher"
                  type="update"
                  data={teacher}
                />}
              </div>
              <p className="text-sm text-gray-500">
                {teacher.description || "No description available."}
              </p>
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                <div className="w-full flex items-center gap-2">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <School size={16} />
                      <span>{teacher.classesAssigned.join(", ")}</span>
                      |
                    </div>
                    <div className="flex items-center gap-2">
                      <BookCopy size={16} />
                      <span>{teacher.subjectsTaught.join(", ")}</span>
                    </div>
                  </div>
                </div>
                <div className="w-full flex items-center gap-2">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Image src="/date.png" alt="Join Date" width={14} height={14} />
                      <span>{teacher.joinDate}</span>
                      |
                    </div>
                    <div className="flex items-center gap-2">
                      <Banknote size={16} />
                      <span>{teacher.salary} xaf</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Image src="/mail.png" alt="Email" width={14} height={14} />
                    <span>{teacher.email}</span>
                    |
                  </div>
                  <div className="flex items-center gap-2">
                    <Image src="/phone.png" alt="Phone" width={14} height={14} />
                    <span>{teacher.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* SMALL CARDS */}
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-full 2xl:w-[48%]">
              <Calendar size={24} className="text-[#018abd]" />
              <div>
                <h1 className="text-xl font-semibold text-[#018abd]">90%</h1>
                <span className="text-sm text-gray-400">Attendance</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-full 2xl:w-[48%]">
              <BookOpen size={24} className="text-[#018abd]" />
              <div>
                <h1 className="text-xl font-semibold text-[#018abd]">6</h1>
                <span className="text-sm text-gray-400">Lessons</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-full 2xl:w-[48%]">
              <School size={24} className="text-[#018abd]" />
              <div className="">
                <h1 className="text-xl font-semibold text-[#018abd] ">6</h1>
                <span className="text-sm text-gray-400">Classes</span>
              </div>
            </div>
          </div>
        </div>
        {/* BOTTOM */}
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1 className="font-medium text-lg">Teacher&apos;s Schedule</h1>
          <BigCalendar />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link className="p-3 rounded-md bg-lamaSkyLight" href="/">
              Teacher&apos;s Classes
            </Link>
            <Link className="p-3 rounded-md bg-lamaPurpleLight" href="/">
              Teacher&apos;s Students
            </Link>
            <Link className="p-3 rounded-md bg-lamaYellowLight" href="/">
              Teacher&apos;s Lessons
            </Link>
            <Link className="p-3 rounded-md bg-pink-50" href="/">
              Teacher&apos;s Exams
            </Link>
            <Link className="p-3 rounded-md bg-lamaSkyLight" href="/">
              Teacher&apos;s Assignments
            </Link>
          </div>
        </div>
        <Performance />
        <Announcements />
      </div>
    </div>
  );
};

export default SingleTeacherPage;