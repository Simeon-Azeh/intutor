import { MdMoreHoriz, MdVisibility } from "react-icons/md";
import { useState } from "react";
import { useDarkMode } from "@/components/DarkModeContext"; // Adjust the import based on your project structure

interface UserCardProps {
  type: string;
  count: number;
}

const UserCard = ({ type, count }: UserCardProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { darkMode } = useDarkMode(); // Use the dark mode context

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const getAcademicYear = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    // Academic year starts in September and ends in July of the following year
    if (currentMonth >= 8) { // September is month 8 (0-indexed)
      return `${currentYear}/${currentYear + 1}`;
    } else {
      return `${currentYear - 1}/${currentYear}`;
    }
  };

  return (
    <div className={`rounded-2xl p-4 flex-1 min-w-[130px] relative ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-black'}`}>
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-[#018abd] px-2 py-1 rounded-full text-white">
          {getAcademicYear()}
        </span>
        <MdMoreHoriz className="cursor-pointer" onClick={toggleDropdown} />
      </div>
      <h1 className="text-2xl font-semibold my-4">{count}</h1>
      <h2 className="capitalize text-sm font-medium text-gray-500 dark:text-gray-400">{type}s</h2>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className={`absolute right-0 top-8 mt-2 w-40 border rounded-lg shadow-lg z-10 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <ul className="p-2">
            <li className="flex items-center text-sm py-2 px-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
              <MdVisibility className="mr-2 text-gray-600 dark:text-gray-300" />
              View
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserCard;