import React from "react";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { RxLapTimer } from "react-icons/rx";
import { HiOutlineUsers } from "react-icons/hi";

type Subject = {
  id: string;
  name: string;
  teachers: string[];
  duration: string;
  classAssigned: string;
  school: string;
  level?: string;
  startDate?: string;
  endDate?: string;
};

type CourseCardProps = {
  subject: Subject;
};

const CourseCard: React.FC<CourseCardProps> = ({ subject }) => {
  return (
    <div className="border rounded-md p-4 cursor-pointer hover:shadow-lg duration-150 scale-100">
      <img
        src="https://via.placeholder.com/150"
        alt="Course"
        className="w-full h-32 object-cover rounded-md mb-4"
      />
      <h2 className="text-xl font-medium text-[#018abd] mb-2">{subject.name}</h2>
      <p className="text-gray-700 mb-2 flex items-center gap-2 font-medium"> <span className="font-medium"><LiaChalkboardTeacherSolid size={22} /></span> {subject.teachers.join(", ")}</p>
      <p className="text-gray-700 mb-2 flex items-center gap-2 font-medium"><HiOutlineUsers /> </p>
      <p className="text-gray-700 mb-2 flex items-center gap-2 font-medium"><RxLapTimer /> {subject.duration}</p>
      <p className="text-gray-700 mb-2">Class Assigned: {subject.classAssigned}</p>
      {subject.level && <p className="text-gray-700 mb-2">Level: {subject.level}</p>}
      {subject.startDate && <p className="text-gray-700 mb-2">Start Date: {subject.startDate}</p>}
      {subject.endDate && <p className="text-gray-700 mb-2">End Date: {subject.endDate}</p>}
    </div>
  );
};

export default CourseCard;