"use client"

import { useState } from "react";
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
import { CiExport } from "react-icons/ci";
import { RiUserAddLine } from "react-icons/ri";
import { FaUserTie, FaUserGraduate, FaUserAlt } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { MdAddCircleOutline } from "react-icons/md";

type AttendanceData = {
  name: string;
  Present: number;
  Absent: number;
  class?: string;
  gender?: string;
};

type Timelines = "Week" | "Term" | "Year";

const teachers = [
    { id: 1, name: "Ayuk Silvia", role: "Math Teacher", icon: <FaUserTie /> },
    { id: 2, name: "Jane Smith", role: "Science Teacher", icon: <FaUserGraduate /> },
    { id: 3, name: "Alain Michael", role: "English Teacher", icon: <FaUserAlt /> },
  ];

const Attendance = () => {
  const [selectedTimeline, setSelectedTimeline] = useState<Timelines>("Week");
  const [classFilter, setClassFilter] = useState<string>("All");
  const [genderFilter, setGenderFilter] = useState<string>("All");

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedTeacher, setSelectedTeacher] = useState<number | null>(null);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [isLinkShared, setIsLinkShared] = useState<boolean>(false);
  const [sampleEmail, setSampleEmail] = useState<string>(""); // state to track the email input
  const [copied, setCopied] = useState<boolean>(false); // track if the link is copied

  const attendanceData: Record<Timelines, AttendanceData[]> = {
    Week: [
      { name: "Mon", Present: 60, Absent: 40, class: "A", gender: "Male" },
      { name: "Tue", Present: 70, Absent: 60, class: "B", gender: "Female" },
      { name: "Wed", Present: 90, Absent: 75, class: "A", gender: "Female" },
      { name: "Thu", Present: 90, Absent: 75, class: "B", gender: "Male" },
      { name: "Fri", Present: 65, Absent: 55, class: "A", gender: "Male" },
    ],
    Term: [
      { name: "Week 1", Present: 320, Absent: 150, class: "A", gender: "Female" },
      { name: "Week 2", Present: 350, Absent: 180, class: "B", gender: "Male" },
      { name: "Week 3", Present: 400, Absent: 200, class: "A", gender: "Female" },
      { name: "Week 4", Present: 450, Absent: 210, class: "B", gender: "Male" },
    ],
    Year: [
      { name: "Q1", Present: 1200, Absent: 600, class: "A", gender: "Male" },
      { name: "Q2", Present: 1300, Absent: 650, class: "B", gender: "Female" },
      { name: "Q3", Present: 1400, Absent: 700, class: "A", gender: "Male" },
      { name: "Q4", Present: 1500, Absent: 750, class: "B", gender: "Female" },
    ],
  };

  const filteredData = attendanceData[selectedTimeline].filter((entry) => {
    const classMatch = classFilter === "All" || entry.class === classFilter;
    const genderMatch = genderFilter === "All" || entry.gender === genderFilter;
    return classMatch && genderMatch;
  });

  const calculateAverage = (data: AttendanceData[]) => {
    const totalPresent = data.reduce((sum, entry) => sum + entry.Present, 0);
    const totalAbsent = data.reduce((sum, entry) => sum + entry.Absent, 0);
    const averagePresent = totalPresent / data.length;
    const averageAbsent = totalAbsent / data.length;

    // Calculate the average number of days present
    const averageDaysPresent = (totalPresent / (totalPresent + totalAbsent)) * data.length;

    return { averagePresent, averageAbsent, averageDaysPresent };
  };

  const { averagePresent, averageAbsent, averageDaysPresent } = calculateAverage(filteredData);

  const handleTimelineChange = (timeline: Timelines) => {
    setSelectedTimeline(timeline);
  };

  const sampleEmails = [
    "teacher1@example.com",
    "teacher2@example.com",
    "teacher3@example.com",
    "teacher4@example.com",
    "teacher5@example.com",
  ];

  const filteredEmails = sampleEmails.filter((email) =>
    email.toLowerCase().includes(sampleEmail.toLowerCase())
  );

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://your-link.com").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    });
  };


  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <h1 className="text-lg font-semibold">Attendance Filters</h1>

        <div className="flex gap-4">
          <button
            className={`px-4 py-2 rounded-lg ${selectedTimeline === "Week" ? "bg-[#018abd] text-white font-medium" : "bg-gray-200"}`}
            onClick={() => handleTimelineChange("Week")}
          >
            Week
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${selectedTimeline === "Term" ? "bg-[#018abd] text-white font-medium" : "bg-gray-200"}`}
            onClick={() => handleTimelineChange("Term")}
          >
            Term
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${selectedTimeline === "Year" ? "bg-[#018abd] text-white font-medium" : "bg-gray-200"}`}
            onClick={() => handleTimelineChange("Year")}
          >
            Academic Year
          </button>
        </div>

        <div>
          <label htmlFor="classFilter" className="block text-sm font-semibold mb-2">
            Filter by Class
          </label>
          <select
            id="classFilter"
            className="w-full p-2 border rounded-lg outline-none"
            onChange={(e) => setClassFilter(e.target.value)}
            value={classFilter}
          >
            <option value="All">All Classes</option>
            <option value="A">1A</option>
            <option value="B">1B</option>
          </select>
        </div>

        <div>
          <label htmlFor="genderFilter" className="block text-sm font-semibold mb-2">
            Filter by Gender
          </label>
          <select
            id="genderFilter"
            className="w-full p-2 border rounded-lg outline-none"
            onChange={(e) => setGenderFilter(e.target.value)}
            value={genderFilter}
          >
            <option value="All">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      </div>

      <div className="w-full lg:w-2/3 flex flex-col gap-4">
        <div className="flex justify-between items-center flex-col md:flex-row">
          <h2 className="text-lg font-semibold text-left mb-4 lg:mb-0">Attendance Chart</h2>

          <div className="flex gap-4">
            <button className="px-4 py-2 rounded-lg bg-[#018abd] text-white flex items-center gap-2 font-medium">Export Data <CiExport size={20}/></button>
            <button
              className="px-4 py-2 rounded-lg border flex font-semibold border-[#1a1a1a] items-center gap-2 text-[#1a1a1a]"
              onClick={() => setIsModalOpen(true)}
            >
              Share <RiUserAddLine />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={filteredData} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
              <XAxis dataKey="name" axisLine={false} tick={{ fill: "#1A1A1A" }} tickLine={false} />
              <YAxis axisLine={false} tick={{ fill: "#1A1A1A" }} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: "10px" }} />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
              <Bar dataKey="Present" fill="#018abd" />
              <Bar dataKey="Absent" fill="#ff6347" />
            </BarChart>
          </ResponsiveContainer>

          <div className="flex justify-between text-sm mt-4">
            <p className="text-[#1a1a1a] font-medium">Average Present: <span className="font-semibold text-[#018abd] text-lg">{averagePresent.toFixed(2)}%</span> </p>
            <p className="text-[#1a1a1a] font-medium">Average Absent: <span className="font-semibold text-[#ff6347] text-lg">{averageAbsent.toFixed(2)}%</span> </p>
            <p className="text-[#1a1a1a] font-medium">Average Days Present: <span className="font-semibold text-[#018abd] text-lg">{averageDaysPresent.toFixed(1)} Days</span>  </p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4">
          <h3 className="font-medium text-md mb-2">Teachers with view access</h3>
          <div className="flex gap-4 mt-2">
            {teachers.map((teacher) => (
              <div
                key={teacher.id}
                className="flex gap-2 items-center p-3 bg-gray-100 rounded-lg shadow-sm cursor-pointer hover:bg-[#018abd] hover:text-white"
                onClick={() => setSelectedTeacher(teacher.id)}
              >
                <FaUserCircle />
                <div>
                  <p className="font-medium">{teacher.name}</p>
                 
                </div>
               
              </div>
              
            ))}
          </div>
                <div className="mt-4 border w-[22%] text-center p-2 rounded border-[#1a1a1a] cursor-pointer flex items-center font-medium gap-2">
                    <p>Add teacher</p>
                    <MdAddCircleOutline />
                </div>
        </div>

        {isModalOpen && (
          <div className="bg-black bg-opacity-50 fixed inset-0 z-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg w-96">
              <h2 className="text-lg font-semibold mb-4">Share Report</h2>
              <input
                type="email"
                name="add"
                title="addpeople"
                placeholder="Add teachers to view this report"
                id=""
                className="w-full border px-4 py-2 rounded-md text-[#1a1a1a] border-[#1a1a1a] mb-2"
                value={sampleEmail}
                onChange={(e) => setSampleEmail(e.target.value)}
              />
              {sampleEmail && filteredEmails.length > 0 && (
                <div className="mt-2 max-h-32 overflow-y-auto bg-white border p-2 rounded-lg shadow-lg">
                  {filteredEmails.map((email, index) => (
                    <div
                      key={index}
                      className="p-2 cursor-pointer hover:bg-[#018abd] hover:text-white"
                      onClick={() => setSampleEmail(email)}
                    >
                      {email}
                    </div>
                  ))}
                </div>
              )}
              <h1 className="font-medium text-lg">Teachers with access</h1>
              <hr className="mb-2" />
              <div className="mt-2">
                {teachers.map((teacher) => (
                  <div
                    key={teacher.id}
                    className="flex gap-2 items-center mt-2 p-3 bg-gray-100 rounded-lg shadow-sm cursor-pointer hover:bg-[#018abd] hover:text-white"
                  >
                    <FaUserCircle />
                    <div>
                      <p className="font-medium">{teacher.name}</p>
                    </div>
                  </div>
                ))}
              </div>
              <hr className="my-2" />
              <div>
                <h1 className="font-medium text-md mb-2">General Access</h1>
              </div>

              {isLinkShared ? (
                <p className="text-green-500">Link shared successfully!</p>
              ) : (
                <>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                    onClick={handleCopyLink}
                  >
                    {copied ? "Copied" : "Copy link"}
                  </button>
                </>
              )}
              <button
                className="mt-4 px-4 py-2 bg-gray-200 text-black rounded-lg ml-4"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
