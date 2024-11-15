import { MdMoreHoriz, MdEdit, MdDelete, MdSettings } from "react-icons/md";
import { useState } from "react";

const UserCard = ({ type }: { type: string }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="rounded-2xl bg-white p-4 flex-1 min-w-[130px] relative">
            <div className="flex justify-between items-center">
                <span className="text-[10px] bg-[#018abd] px-2 py-1 rounded-full text-white">
                    2024/25
                </span>
                <MdMoreHoriz className="cursor-pointer" onClick={toggleDropdown} />
            </div>
            <h1 className="text-2xl font-semibold my-4">4</h1>
            <h2 className="capitalize text-sm font-medium text-gray-500">{type}s</h2>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
                <div className="absolute right-0 top-8 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <ul className="p-2">
                        <li className="flex items-center text-sm py-2 px-4 cursor-pointer hover:bg-gray-100">
                            <MdEdit className="mr-2 text-gray-600" />
                            Edit
                        </li>
                        <li className="flex items-center text-sm py-2 px-4 cursor-pointer hover:bg-gray-100">
                            <MdDelete className="mr-2 text-red-500" />
                            Delete
                        </li>
                        <li className="flex items-center text-sm py-2 px-4 cursor-pointer hover:bg-gray-100">
                            <MdSettings className="mr-2 text-gray-600" />
                            Settings
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default UserCard;
