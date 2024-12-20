"use client";

import Footer from "@/components/footer";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Link from "next/link";

// Dynamic import for SignInForm to avoid router issues
const SignInForm = dynamic(() => import("@/components/forms/SignInForm"), { ssr: false });

const SignInPage = () => {
  return (
    <main>
      <div className="top-0 sticky">
        <Header />
      </div>
      <SignInForm />
      <div className="text-center mt-4">
        <p className="text-md font-medium text-gray-500">
          Want to register your school?{" "}
          <Link href="/register" className="text-[#018abd]">
            Register here
          </Link>
        </p>
      </div>
      <div className="pb-4">
        <p className="text-center text-md font-medium text-gray-500">
          &copy; {new Date().getFullYear()} Intutor. All Rights Reserved •{" "}
          <a href="">Privacy Policy</a>
        </p>
      </div>
    
    </main>
  );
};

export default SignInPage;