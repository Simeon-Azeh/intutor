"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import Skeleton from "react-loading-skeleton"; // Import the skeleton loader
import { auth } from "@/firebase/firebaseConfig"; // Import Firebase auth
import { onAuthStateChanged } from "firebase/auth";
import { DarkModeProvider, useDarkMode } from "@/components/DarkModeContext"; // Adjust the import based on your project structure

const DashboardLayoutContent = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false); // Track if we are on the client side
  const router = useRouter();
  const { darkMode } = useDarkMode(); // Use the dark mode context

  useEffect(() => {
    // Set isClient to true after component mounts (client-side)
    setIsClient(true);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // If the user is authenticated, set the user
      } else {
        setUser(null); // If the user is not authenticated, clear user data
      }
      setLoading(false); // Stop loading once auth state is determined
    });

    // Clean up on unmount
    return () => unsubscribe();
  }, []); // Empty dependency array ensures this runs once on mount

  // Only proceed with routing logic on the client
  if (!isClient) {
    return null; // Return nothing while waiting for the component to mount
  }

  // Show loading skeletons while authentication is being checked
  if (loading) {
    return (
      <div className="h-screen flex">
        {/* Sidebar Menu */}
        <div className="w-[14%] md:w-[8%] lg:w-[18%] xl:w-[18%] p-2 bg-white dark:bg-[#141414] overflow-y-hidden h-full">
          <Skeleton width={100} height={100} className="mx-auto mb-4" /> {/* Skeleton for logo */}
          <Skeleton count={5} height={30} className="mb-3" /> {/* Skeleton for Menu */}
        </div>

        {/* Main Content Area */}
        <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] dark:bg-gray-900 flex flex-col">
          {/* Fixed Navbar */}
          <div className="sticky top-0 z-10">
            <Skeleton height={50} className="mb-2" /> {/* Skeleton for Navbar */}
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto h-full">
            <Skeleton count={10} height={20} /> {/* Skeleton for main content */}
          </div>
        </div>
      </div>
    );
  }

  // If no user is logged in, redirect to signin page
  if (!user) {
    router.push("/signin"); // Redirect to signin page if not authenticated
    return null; // Return nothing while redirecting
  }

  return (
    <div className={`h-screen flex ${darkMode ? 'dark' : ''}`}>
      {/* Sidebar Menu */}
      <div className="w-[14%] md:w-[8%] lg:w-[18%] xl:w-[18%] p-2 bg-white dark:bg-gray-800 overflow-y-hidden h-full">
        <Link href="/dashboard" className="flex items-center justify-center lg:justify-start ">
          <Image src="/logp.svg" alt="logo" width={100} height={100} />
        </Link>
        <Menu />
      </div>

      {/* Main Content Area */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] dark:bg-gray-900 flex flex-col">
        {/* Fixed Navbar */}
        <div className="sticky top-0 z-10">
          <Navbar />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto h-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <DarkModeProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </DarkModeProvider>
  );
}