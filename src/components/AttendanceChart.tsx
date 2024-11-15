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
import { FaEdit, FaDownload, FaTrash, FaUserPlus, FaUserMinus, FaSync } from "react-icons/fa";
import { MdOutlineClass, MdOutlineTimeline } from "react-icons/md";
import { useRouter } from "next/navigation";

const data = [
  {
    name: "Mon",
    Present: 60,
    Absent: 40,
  },
  {
    name: "Tue",
    Present: 70,
    Absent: 60,
  },
  {
    name: "Wed",
    Present: 90,
    Absent: 75,
  },
  {
    name: "Thu",
    Present: 90,
    Absent: 75,
  },
  {
    name: "Fri",
    Present: 65,
    Absent: 55,
  },
];

const AttendanceChart = () => {

  const router = useRouter();

  return (
    <div className="bg-white rounded-lg p-4 h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Attendance</h1>
        

        {/* Dropdown Menu with Admin Actions */}
        <Menu as="div" className="relative">
          <Menu.Button>
            <IoIosMore size={20} className="cursor-pointer" />
          </Menu.Button>
          <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border p-1 z-50">
            {/* Action: View Attendance by Class */}
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-gray-100" : ""
                  } flex items-center w-full px-3 py-2 text-sm text-gray-700`}
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
                    active ? "bg-gray-100" : ""
                  } flex items-center w-full px-3 py-2 text-sm text-gray-700`}
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
                    active ? "bg-gray-100" : ""
                  } flex items-center w-full px-3 py-2 text-sm text-gray-700`}
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
                    active ? "bg-gray-100" : ""
                  } flex items-center w-full px-3 py-2 text-sm text-gray-700`}
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
                    active ? "bg-gray-100" : ""
                  } flex items-center w-full px-3 py-2 text-sm text-gray-700`}
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
                    active ? "bg-gray-100" : ""
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
                    active ? "bg-gray-100" : ""
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

      <ResponsiveContainer width="100%" height="90%">
        <BarChart width={500} height={300} data={data} barSize={20}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "#1A1A1A" }}
            tickLine={false}
          />
          <YAxis axisLine={false} tick={{ fill: "#1A1A1A" }} tickLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: "10px", borderColor: "#fff" }}
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
    </div>
  );
};

export default AttendanceChart;
