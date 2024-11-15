"use client";

import Footer from "@/components/footer";
import dynamic from "next/dynamic";
import Header from "@/components/Header";



// Dynamic import for SignInForm to avoid router issues
const SignInForm = dynamic(() => import("@/components/forms/SignInForm"), { ssr: false });

const SignInPage = () => {
  return (
    <main>
      <div className="top-0 sticky">
        <Header />
      </div>
      <SignInForm />
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
