"use client";

import React, { useEffect, useState } from "react";
import { auth } from "@/firebase/firebaseConfig"; // Firebase auth
import { getFirestore, doc, getDoc } from "firebase/firestore"; // Firestore functions
import { FaSun, FaMoon, FaCoffee } from "react-icons/fa"; // Importing icons

const Greetings = () => {
  const [userName, setUserName] = useState<string>("User");
  const [greeting, setGreeting] = useState<string>("");
  const [motivation, setMotivation] = useState<string>("");
  const [icon, setIcon] = useState<JSX.Element>(<FaCoffee />); // Default icon

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const db = getFirestore();
        const userDocRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserName(data?.name || "User"); // Assuming 'name' field in Firestore document
        }
      }
    };

    // Set the time-based greeting and motivation
    const currentTime = new Date().getHours();
    if (currentTime < 12) {
      setGreeting("Good morning");
      setMotivation("Start your day with purpose!");
      setIcon(<FaSun className="text-yellow-500" />); // Sun icon for morning
    } else if (currentTime < 18) {
      setGreeting("Good afternoon");
      setMotivation("Keep up the great work, grab yourself a cup of coffee!");
      setIcon(<FaCoffee className="text-brown-500" />); // Coffee icon for afternoon boost
    } else {
      setGreeting("Good night");
      setMotivation("Rest well, tomorrow is another opportunity.");
      setIcon(<FaMoon className="text-blue-500" />); // Moon icon for night
    }

    fetchUserData();
  }, []);

  return (
    <div className="  gap-4 text-xl font-semibold text-gray-600 bg-white px-4 rounded py-6 ">
      <div className="text-gray-600">
       {greeting}, 
        <span className="text-[#018abd]"> {userName}</span>!
      </div>
      <div className="text-xs md:text-sm text-gray-400 font-medium flex items-center flex-row-reverse md:flex-row gap-2 mt-4">
      {icon}
        {motivation}
      </div>
    </div>
  );
};

export default Greetings;
