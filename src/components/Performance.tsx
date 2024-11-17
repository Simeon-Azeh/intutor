"use client";
import Image from "next/image";
import { PieChart, Pie, ResponsiveContainer } from "recharts";
import { MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import { useState } from 'react';

const data = [
  { name: "Group A", value: 92, fill: "#018abd" },
  { name: "Group B", value: 8, fill: "#ff6347" },
];

const Performance = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="bg-white p-4 rounded-md h-80 relative">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Performance</h1>
        <div className="relative">
          <MoreVertical size={16} className="cursor-pointer" onClick={toggleDropdown} />
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <ul className="py-1">
                <li className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                  <Eye size={16} className="mr-2" />
                  View Details
                </li>
                <li className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                  <Edit size={16} className="mr-2" />
                  Edit Performance
                </li>
                <li className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                  <Trash2 size={16} className="mr-2" />
                  Delete Performance
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            dataKey="value"
            startAngle={180}
            endAngle={0}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            fill="#8884d8"
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <h1 className="text-3xl font-semibold text-[#018abd] mt-4">9.2</h1>
        <p className="text-xs text-gray-400">of 10 max LTS</p>
      </div>
      <h2 className="font-medium absolute bottom-16 left-0 right-0 m-auto text-center">1st Semester - 2nd Semester</h2>
    </div>
  );
};

export default Performance;