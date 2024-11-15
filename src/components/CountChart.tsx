"use client";
import Image from "next/image";
import { IoIosMore } from "react-icons/io";
import { Menu } from "@headlessui/react";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Total",
    count: 106,
    fill: "#f9feff",
  },
  {
    name: "Girls",
    count: 53,
    fill: "#ff6347",
  },
  {
    name: "Boys",
    count: 53,
    fill: "#018abd",
  },
];

const CountChart = () => {
  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Students</h1>
        <Menu as="div" className="relative">
          <Menu.Button>
            <IoIosMore size={20} className="cursor-pointer" />
          </Menu.Button>
          <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border p-1 z-50">
            {/* Dropdown Actions */}
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-gray-100" : ""
                  } flex items-center w-full px-3 py-2 text-sm text-gray-700`}
                >
                  View Details
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-gray-100" : ""
                  } flex items-center w-full px-3 py-2 text-sm text-gray-700`}
                >
                  Export Data
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-gray-100" : ""
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
          <h1 className="font-bold">3</h1>
          <h2 className="text-xs text-gray-300 flex items-center">Boys (55%)</h2>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-[#ff6347] rounded-full" />
          <h1 className="font-bold">1</h1>
          <h2 className="text-xs text-gray-300">Girls (45%)</h2>
        </div>
      </div>
    </div>
  );
};

export default CountChart;
