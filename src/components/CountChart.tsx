"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { IoIosMore } from "react-icons/io";
import { Menu } from "@headlessui/react";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
} from "recharts";
import { db, auth } from "../firebase/firebaseConfig";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { useDarkMode } from "@/components/DarkModeContext"; // Adjust the import based on your project structure

const CountChart = () => {
  const [data, setData] = useState([
    { name: "Total", count: 0, fill: "#f9feff" },
    { name: "Girls", count: 0, fill: "#ff6347" },
    { name: "Boys", count: 0, fill: "#018abd" },
  ]);
  const { darkMode } = useDarkMode(); // Use the dark mode context

  useEffect(() => {
    const fetchUserData = async () => {
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

        // Query Firestore to get students from the specific school
        const q = query(
          collection(db, "users"),
          where("school", "==", schoolName),
          where("role", "==", "Student")
        );
        const querySnapshot = await getDocs(q);

        // Filter and count students based on sex
        const students = querySnapshot.docs.map(doc => doc.data());
        const boysCount = students.filter(student => student.sex?.toLowerCase() === "male").length;
        const girlsCount = students.filter(student => student.sex?.toLowerCase() === "female").length;
        const totalCount = boysCount + girlsCount;

        // Update the chart data
        setData([
          { name: "Total", count: totalCount, fill: "#f9feff" },
          { name: "Girls", count: girlsCount, fill: "#ff6347" },
          { name: "Boys", count: boysCount, fill: "#018abd" },
        ]);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className={`rounded-xl w-full h-full p-4 ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-black'}`}>
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Students</h1>
        <Menu as="div" className="relative">
          <Menu.Button>
            <IoIosMore size={20} className="cursor-pointer" />
          </Menu.Button>
          <Menu.Items className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg border p-1 z-50 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            {/* Dropdown Actions */}
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-gray-100 dark:bg-gray-700" : ""
                  } flex items-center w-full px-3 py-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  View Details
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-gray-100 dark:bg-gray-700" : ""
                  } flex items-center w-full px-3 py-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  Export Data
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-gray-100 dark:bg-gray-700" : ""
                  } flex items-center w-full px-3 py-2 text-sm text-red-500`}
                >
                  Delete Chart
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>

      {/* CHART */}
      <div className="relative w-full h-[75%]">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={32}
            data={data}
          >
            <RadialBar background dataKey="count" />
          </RadialBarChart>
        </ResponsiveContainer>
        <Image
          src="/moreDark.png"
          alt=""
          width={50}
          height={50}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      {/* BOTTOM */}
      <div className="flex justify-center gap-12">
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-[#018abd] rounded-full" />
          <h1 className="font-bold">{data[2].count}</h1>
          <h2 className={`text-xs flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-300'}`}>Boys ({((data[2].count / data[0].count) * 100).toFixed(2)}%)</h2>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-[#ff6347] rounded-full" />
          <h1 className="font-bold">{data[1].count}</h1>
          <h2 className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-300'}`}>Girls ({((data[1].count / data[0].count) * 100).toFixed(2)}%)</h2>
        </div>
      </div>
    </div>
  );
};

export default CountChart;