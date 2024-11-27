"use client";
import Image from "next/image";
import { IoIosMore } from "react-icons/io";
import { Menu } from "@headlessui/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FaEdit, FaDownload, FaTrash, FaUserPlus, FaUserMinus, FaSync, FaInfoCircle } from "react-icons/fa";
import { MdOutlineClass, MdOutlineTimeline } from "react-icons/md";
import { useRouter } from "next/navigation";
import { useDarkMode } from "@/components/DarkModeContext"; // Adjust the import based on your project structure

const data = [
  {
    name: "Mon",
    Present: 0,
    Absent: 0,
  },
  {
    name: "Tue",
    Present: 0,
    Absent: 0,
  },
  {
    name: "Wed",
    Present: 0,
    Absent: 0,
  },
  {
    name: "Thu",
    Present: 0,
    Absent: 0,
  },
  {
    name: "Fri",
    Present: 0,
    Absent: 0,
  },
];

const AttendanceChart = () => {
  const router = useRouter();
  const { darkMode } = useDarkMode(); // Use the dark mode context

  const hasData = data.some(item => item.Present !== 0 || item.Absent !== 0);

  return (
    <div className={`rounded-lg p-4 h-full ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-black'}`}>
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Attendance</h1>

        {/* Dropdown Menu with Admin Actions */}
        <Menu as="div" className="relative">
          <Menu.Button>
            <IoIosMore size={20} className="cursor-pointer" />
          </Menu.Button>
          <Menu.Items className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg border p-1 z-50 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            {/* Action: View Attendance by Class */}
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-gray-100 dark:bg-gray-700" : ""
                  } flex items-center w-full px-3 py-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  <MdOutlineClass className="mr-2" />
                  View by Class
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => router.push("/attendance")}
                  className={`${
                    active ? "bg-gray-100 dark:bg-gray-700" : ""
                  } flex items-center w-full px-3 py-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  <MdOutlineTimeline className="mr-2" />
                  View by Time Period
                </button>
              )}
            </Menu.Item>

            {/* Action: Export Attendance Data */}
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-gray-100 dark:bg-gray-700" : ""
                  } flex items-center w-full px-3 py-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  <FaDownload className="mr-2" />
                  Export Data
                </button>
              )}
            </Menu.Item>

            {/* Action: Add User */}
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-gray-100 dark:bg-gray-700" : ""
                  } flex items-center w-full px-3 py-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  <FaUserPlus className="mr-2" />
                  Add User
                </button>
              )}
            </Menu.Item>

            {/* Action: Remove User */}
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-gray-100 dark:bg-gray-700" : ""
                  } flex items-center w-full px-3 py-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  <FaUserMinus className="mr-2" />
                  Remove User
                </button>
              )}
            </Menu.Item>

            {/* Action: Reset Chart */}
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-gray-100 dark:bg-gray-700" : ""
                  } flex items-center w-full px-3 py-2 text-sm text-red-500`}
                >
                  <FaSync className="mr-2" />
                  Reset Chart
                </button>
              )}
            </Menu.Item>

            {/* Action: Delete Chart */}
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-gray-100 dark:bg-gray-700" : ""
                  } flex items-center w-full px-3 py-2 text-sm text-red-500`}
                >
                  <FaTrash className="mr-2" />
                  Delete Chart
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>

      {hasData ? (
        <ResponsiveContainer width="100%" height="90%">
          <BarChart width={500} height={300} data={data} barSize={20}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? "#444" : "#ddd"} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tick={{ fill: darkMode ? "#ddd" : "#1A1A1A" }}
              tickLine={false}
            />
            <YAxis axisLine={false} tick={{ fill: darkMode ? "#ddd" : "#1A1A1A" }} tickLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: "10px", borderColor: darkMode ? "#444" : "#fff" }}
            />
            <Legend
              align="left"
              verticalAlign="top"
              wrapperStyle={{ paddingTop: "20px", paddingBottom: "40px" }}
            />
            <Bar
              dataKey="Present"
              fill="#018abd"
              legendType="circle"
              radius={[2, 2, 0, 0]}
            />
            <Bar
              dataKey="Absent"
              fill="#ff6347"
              legendType="circle"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
          <FaInfoCircle size={50} className="mb-4" />
          <p className="text-lg text-center">Attendance data will update over time.</p>
        </div>
      )}
    </div>
  );
};

export default AttendanceChart;