import { MdMoreHoriz } from "react-icons/md";

const UserCard = ({ type }: { type: string }) => {
    return (
        <div className="rounded-2xl bg-white p-4 flex-1 min-w-[130px]">
            <div className="flex justify-between items-center">
                <span className="text-[10px] bg-[#018abd] px-2 py-1 rounded-full text-white ">
                    2024/25
                </span>
                <MdMoreHoriz className="cursor-pointer" />
            </div>
            <h1 className="text-2xl font-semibold my-4">4</h1>
            <h2 className="capitalize text-sm font-medium text-gray-500">{type}s</h2>
        </div>
    );
};

export default UserCard;
