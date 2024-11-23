"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { auth, db } from "@/firebase/firebaseConfig"; // Firebase auth and Firestore
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, where, getDocs, getDoc, doc } from "firebase/firestore"; // Firestore functions
import { MdOutlineNotificationsActive } from "react-icons/md";
import { TbHelpCircle } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";
import { RiSettings4Line } from "react-icons/ri";
import { IoMdLogOut } from "react-icons/io";
import Link from "next/link";

const Navbar = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userSchool, setUserSchool] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Set user info
        fetchUserDetails(currentUser.uid); // Fetch user details (name, school, role)
        fetchNotificationCount(currentUser.uid); // Fetch notification count
      } else {
        setUser(null);
      }
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  const fetchUserDetails = async (uid: string) => {
    const userDocRef = doc(db, "users", uid); // Fetch user data from Firestore (users collection)
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      setUserName(data?.name || "No name");
      setUserSchool(data?.school || "No school");
      setUserRole(data?.role || "Guest");
    } else {
      setUserName("No name");
      setUserSchool("No school");
      setUserRole("Guest");
    }
  };

  const fetchNotificationCount = async (uid: string) => {
    const q = query(collection(db, "notifications"), where("userId", "==", uid));
    const querySnapshot = await getDocs(q);
    setNotificationCount(querySnapshot.size);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white">
      {/* SEARCH BAR */}
      <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
        <Image src="/search.png" alt="" width={14} height={14} />
        <input
          type="text"
          placeholder="Search..."
          className="w-[200px] p-2 bg-transparent outline-none"
        />
      </div>

      {/* ICONS AND USER */}
      <div className="flex items-center gap-4 justify-end w-full relative">
        <Link href="/notifications">
          <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
            <MdOutlineNotificationsActive size={26} className="text-gray-600" />
            {notificationCount > 0 && (
              <div className="absolute -top-2 -right-2.5 w-5 h-5 flex items-center justify-center bg-[#018abd] text-white rounded-full text-xs">
                {notificationCount}
              </div>
            )}
          </div>
        </Link>
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
          <TbHelpCircle size={26} className="text-gray-600" />
        </div>
        {/* Profile Section */}
        <div
          className="flex items-center gap-2 cursor-pointer relative"
          onClick={() => setShowProfileDropdown(!showProfileDropdown)}
        >
          <div className="flex flex-col">
            <span className="text-xs leading-3 font-medium">
              {userName || "Loading..."}
            </span>
            <span className="text-[10px] text-gray-500 text-right">
              {userRole || "Loading..."} | {userSchool || "Loading..."}
            </span>
          </div>
          <Image
            src="/avatar.png"
            alt=""
            width={36}
            height={36}
            className="rounded-full"
          />
          {/* Dropdown Menu */}
          {showProfileDropdown && (
            <div className="absolute border top-10 right-0 w-48 bg-white shadow-lg rounded-lg py-2 z-50 font-medium ">
              
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-1"
                onClick={() => console.log("View Profile")}
              >
                 <CgProfile />
                View Profile
               
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-1"
                onClick={() => console.log("Account Settings")}
              >
                <RiSettings4Line />
                Account Settings
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500 flex items-center gap-1"
                onClick={handleLogout}
              >
                <IoMdLogOut />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;