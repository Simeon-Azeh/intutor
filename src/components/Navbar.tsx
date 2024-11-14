"use client"

import { useEffect, useState } from "react";
import Image from "next/image";
import { auth } from "@/firebase/firebaseConfig"; // Firebase auth
import { onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore"; // Firestore functions

const Navbar = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userSchool, setUserSchool] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Set user info
        fetchUserDetails(currentUser.uid); // Fetch user details (name, school, role)
      } else {
        setUser(null);
      }
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  const fetchUserDetails = async (uid: string) => {
    const db = getFirestore();
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

  return (
    <div className="flex items-center justify-between p-4 bg-white">
      {/* SEARCH BAR */}
      <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
        <Image src="/search.png" alt="" width={14} height={14} />
        <input type="text" placeholder="Search..." className="w-[200px] p-2 bg-transparent outline-none" />
      </div>

      {/* ICONS AND USER */}
      <div className="flex items-center gap-6 justify-end w-full">
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
          <Image src="/message.png" alt="" width={20} height={20} />
        </div>
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
          <Image src="/announcement.png" alt="" width={20} height={20} />
          <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-[#018abd] text-white rounded-full text-xs">2</div>
        </div>
        <div className="flex flex-col">
          <span className="text-xs leading-3 font-medium">{userName || "Loading..."}</span>
          <span className="text-[10px] text-gray-500 text-right"> {userRole || "Loading..."} | {userSchool || "Loading..."}  </span>
        </div>
        <Image src="/avatar.png" alt="" width={36} height={36} className="rounded-full" />
      </div>
    </div>
  );
};

export default Navbar;
