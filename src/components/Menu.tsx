"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { auth, signOut } from "@/firebase/firebaseConfig"; // Firebase auth and signOut
import { onAuthStateChanged } from "firebase/auth"; // Firebase Auth listener
import { getFirestore, doc, getDoc } from "firebase/firestore"; // Firestore functions
import CheckboxList from "@/components/Loaders/CheckboxList"; // Import CheckboxList
import { useDarkMode } from "@/components/DarkModeContext"; // Adjust the import based on your project structure
import { 
  FaHome, FaChalkboardTeacher, FaUserGraduate, FaUserTie, FaBook, FaSchool, FaBookOpen, FaClipboardList, FaTasks, FaChartBar, FaCalendarCheck, FaCalendarAlt, FaEnvelope, FaBullhorn, FaUser, FaCog, FaSignOutAlt 
} from "react-icons/fa"; // Import icons from react-icons

// Define menu items
const menuItems = [
  {
    title: "MENU",
    items: [
      { icon: <FaHome />, label: "Home", href: "/", visible: ["Admin", "Teacher", "Student", "Parent"] },
      { icon: <FaChalkboardTeacher />, label: "Teachers", href: "/list/teachers", visible: ["Admin", "Teacher"] },
      { icon: <FaUserGraduate />, label: "Students", href: "/list/students", visible: ["Admin", "Teacher"] },
      { icon: <FaUserTie />, label: "Parents", href: "/list/parents", visible: ["Admin", "Teacher"] },
      { icon: <FaBook />, label: "Courses", href: "/list/subjects", visible: ["Admin"] },
      { icon: <FaSchool />, label: "Classes", href: "/list/classes", visible: ["Admin", "Teacher"] },
      { icon: <FaBookOpen />, label: "Lessons", href: "/list/lessons", visible: ["Admin", "Teacher"] },
      { icon: <FaClipboardList />, label: "Exams", href: "/list/exams", visible: ["Admin", "Teacher", "Student", "Parent"] },
      { icon: <FaTasks />, label: "Assignments", href: "/list/assignments", visible: ["Admin", "Teacher", "Student", "Parent"] },
      { icon: <FaChartBar />, label: "Results", href: "/list/results", visible: ["Admin", "Teacher", "Student", "Parent"] },
      { icon: <FaCalendarCheck />, label: "Attendance", href: "/list/attendance", visible: ["Admin", "Teacher", "Student", "Parent"] },
      { icon: <FaCalendarAlt />, label: "Events", href: "/list/events", visible: ["Admin", "Teacher", "Student", "Parent"] },
      { icon: <FaEnvelope />, label: "Messages", href: "/list/messages", visible: ["Admin", "Teacher", "Student", "Parent"] },
      { icon: <FaBullhorn />, label: "Announcements", href: "announcements", visible: ["Admin", "Teacher", "Student", "Parent"] },
    ],
  },
  {
    title: "OTHER",
    items: [
      { icon: <FaUser />, label: "Profile", href: "/profile", visible: ["Admin", "Teacher", "Student", "Parent"] },
      { icon: <FaCog />, label: "Settings", href: "/settings", visible: ["Admin", "Teacher", "Student", "Parent"] },
      { icon: <FaSignOutAlt />, label: "Logout", href: "#", visible: ["Admin", "Teacher", "Student", "Parent"], action: "logout" },
    ],
  },
];

const Menu = () => {
  const [role, setRole] = useState<string>("guest"); // Default to "guest"
  const [loading, setLoading] = useState<boolean>(true); // Loading state for fetching user role
  const { darkMode } = useDarkMode(); // Use the dark mode context

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const db = getFirestore();
        const userDocRef = doc(db, "users", currentUser.uid); // Get user document based on UID
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setRole((data?.role || "guest").charAt(0).toUpperCase() + (data?.role || "guest").slice(1).toLowerCase()); // Normalize to Title Case
        } else {
          setRole("guest"); // Default role if no data found
        }
      } else {
        setRole("guest"); // No user logged in, set role to guest
      }

      setLoading(false); // Once the data is fetched, stop loading
    });

    return () => unsubscribe(); // Clean up the subscription on component unmount
  }, []);

  // If still loading, render the CheckboxList loader
  if (loading) {
    return <CheckboxList />;
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign the user out
      // Redirect to login or home page after logout
      window.location.href = "/signin"; // Or use `router.push("/login")` if using Next.js router
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const homeHref = role === "Admin" ? "/admin" 
  : role === "Teacher" ? "/teacher" 
  : role === "Student" ? "/student" 
  : role === "Parent" ? "/parent" 
  : "/";

  return (
    <div className={`text-sm h-full overflow-y-auto ${darkMode ? 'dark' : ''}`}>
      {menuItems.map((section) => (
        <div className="flex flex-col gap-2" key={section.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {section.title}
          </span>
          {section.items.map((item) => {
            // For the Home link, use the dynamic homeHref
            const href = item.label === "Home" ? homeHref : item.href;

            if (item.visible.includes(role)) {
              return (
                <Link
                  href={href === "#" ? "#" : href}
                  key={item.label}
                  onClick={item.action === "logout" ? handleLogout : undefined}
                  className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-[#e2f5fc]"
                >
                  {item.icon}
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            }
            return null;
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;