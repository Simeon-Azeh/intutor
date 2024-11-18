"use client";

import Footer from "@/components/footer";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import RegistrationForm from "@/components/forms/SignUpForm";



// Dynamic import for SignInForm to avoid router issues
const SignInForm = dynamic(() => import("@/components/forms/SignInForm"), { ssr: false });

const SignInPage = () => {
  return (
    <main>
      <div className="top-0 sticky">
        <Header />
      </div>
      <RegistrationForm />
      <div className="pb-4">
        <p className="text-center text-md font-medium text-gray-500">
          &copy; {new Date().getFullYear()} Intutor. All Rights Reserved •{" "}
          <a href="">Terms and Condition</a>
        </p>
      </div>
    </main>
  );
};

export default SignInPage;
