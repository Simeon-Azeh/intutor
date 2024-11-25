"use client";

import Image from "next/image";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { IoIosMore } from "react-icons/io";
import { Menu } from "@headlessui/react";
import { MdVisibility, MdFileDownload, MdDelete } from "react-icons/md";
import { useDarkMode } from "@/components/DarkModeContext"; // Adjust the import based on your project structure

const data = [
  {
    name: "Jan",
    income: 4000,
    expense: 2400,
  },
  {
    name: "Feb",
    income: 3000,
    expense: 1398,
  },
  {
    name: "Mar",
    income: 2000,
    expense: 9800,
  },
  {
    name: "Apr",
    income: 2780,
    expense: 3908,
  },
  {
    name: "May",
    income: 1890,
    expense: 4800,
  },
  {
    name: "Jun",
    income: 2390,
    expense: 3800,
  },
  {
    name: "Jul",
    income: 3490,
    expense: 4300,
  },
  {
    name: "Aug",
    income: 3490,
    expense: 4300,
  },
  {
    name: "Sep",
    income: 3490,
    expense: 4300,
  },
  {
    name: "Oct",
    income: 3490,
    expense: 4300,
  },
  {
    name: "Nov",
    income: 3490,
    expense: 4300,
  },
  {
    name: "Dec",
    income: 3490,
    expense: 4300,
  },
];

const FinanceChart = () => {
  const { darkMode } = useDarkMode(); // Use the dark mode context

  return (
    <div className={`rounded-xl w-full h-full p-4 ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-black'}`}>
      {/* Header with dropdown */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Finance</h1>
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
                  <MdVisibility className="mr-2 text-blue-500" size={20} />
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
                  <MdFileDownload className="mr-2 text-gray-800" size={20} />
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
                  <MdDelete className="mr-2 text-red-500" size={20} />
                  Delete Chart
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#444" : "#ddd"} />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: darkMode ? "#ddd" : "#018abd" }}
            tickLine={false}
            tickMargin={10}
          />
          <YAxis axisLine={false} tick={{ fill: darkMode ? "#ddd" : "#018abd" }} tickLine={false} tickMargin={20} />
          <Tooltip contentStyle={{ borderRadius: "10px", borderColor: darkMode ? "#444" : "#fff" }} />
          <Legend
            align="center"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "10px", paddingBottom: "30px" }}
          />
          <Line type="monotone" dataKey="income" stroke="#018abd" strokeWidth={5} />
          <Line type="monotone" dataKey="expense" stroke="#ff6347" strokeWidth={5} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinanceChart;