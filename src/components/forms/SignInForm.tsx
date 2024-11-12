"use client";

import React, { useState } from "react";
import { FaChalkboardTeacher, FaUserGraduate, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import { RiParentFill } from "react-icons/ri";
import Logo from "../../../public/logp.svg";
import { TbProgressAlert } from "react-icons/tb";
import Image from "next/image";
import { auth, db } from "../../firebase/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore"; // Correct import for Firestore functions
import Link from "next/link";

const SignInForm: React.FC = () => {
  const [role, setRole] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [redirecting, setRedirecting] = useState<boolean>(false); // State for showing redirection message
  const router = useRouter();

  const handleRoleSelect = (selectedRole: string) => {
    setRole(selectedRole);
    setError("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !role) {
      setError("Please fill in all fields and select a valid role.");
      return;
    }

    setLoading(true); // Start loading
    try {
      // Sign in the user with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Get the logged-in user's UID
      const uid = userCredential.user.uid;
  
      // Fetch the user's role from Firestore
      const userDocRef = doc(db, "users", uid);  // Assuming your collection is called "users"
      const userDoc = await getDoc(userDocRef);
      
  
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRole = userData?.role; // This is the role of the user

        // Validate that the role matches
        if (userRole !== role) {
          setError("The selected role doesn't match your account role.");
          setLoading(false);
          return;
        }

        // Set redirecting state to show message
        setRedirecting(true);

        // Redirect based on role
        switch (userRole) {
          case "Admin":
            router.push("/admin");
            break;
          case "Peacher":
            router.push("/teacher");
            break;
          case "Parent":
            router.push("/parent");
            break;
          case "Student":
            router.push("/student");
            break;
          default:
            router.push("/");
        }
      } else {
        setError("User data not found.");
      }
    } catch (err) {
      console.error("Error during sign-in:", err);
      setError("Failed to sign in. Please check your credentials.");
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8">
      <div className="bg-white rounded-lg p-8 w-full max-w-xl focus:shadow-xl">
        <div className="flex items-center justify-center mb-2 w-24 mx-auto">
          <Image src={Logo} width={150} height={120} alt="Logo" />
        </div>

        <div className="mb-4">
          <p className="text-gray-600 text-center mb-4">
            Hello, what type of account do you own?
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4">
            {/* Role options */}
            {[
              { label: "Admin", icon: <MdAdminPanelSettings /> },
              { label: "Teacher", icon: <FaChalkboardTeacher /> },
              { label: "Parent", icon: <RiParentFill /> },
              { label: "Student", icon: <FaUserGraduate /> }
            ].map((item) => (
              <div
                key={item.label}
                onClick={() => handleRoleSelect(item.label)}
                className={`border-2 rounded-lg p-4 text-center cursor-pointer flex flex-col items-center justify-center ${role === item.label ? "border-[#018abd]" : "border-gray-300"} hover:border-[#018abd] transition duration-300`}
              >
                <div className="text-2xl text-gray-600 mb-2">{item.icon}</div>
                <p className="font-semibold text-gray-700">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {error && <p className="bg-red-400 text-center mb-4 text-white p-2 rounded-md flex items-center gap-2 justify-center"><TbProgressAlert size={20} />{error}</p>}

        {/* Email input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#018abd]"
            placeholder="your-email@school.com"
            required
          />
        </div>

        {/* Password input */}
        <div className="mb-6 relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#018abd] "
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 -top-2 right-0 pr-3 flex items-center text-gray-600 "
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
          <Link href='/forgot-password' className="pt-4 text-md text-[#018abd] text-right flex justify-end">Forgot Password?</Link>
        </div>

        {/* Loading spinner or Sign In button */}
        {loading ? (
          <div className="flex items-center justify-center py-3">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-8 w-8"></div>
            <p className="text-[#018abd] ml-2">Signing in...</p>
          </div>
        ) : (
          <button
            className={`w-full bg-[#018abd] text-white py-3 px-4 rounded-lg mb-4 ${role ? "hover:bg-blue-400" : "opacity-50 cursor-not-allowed"} transition duration-300`}
            onClick={handleSubmit}
            disabled={!role}
          >
            Sign In
          </button>
        )}

        {/* Redirection message */}
        {redirecting && <p className="text-center text-gray-500">You're being redirected...</p>}
      </div>
    </div>
  );
};

export default SignInForm;
