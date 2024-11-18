"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { auth, db } from "../../firebase/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ProgressBar, Step } from "react-step-progress-bar";
import "react-step-progress-bar/styles.css";
import { FaCheck } from "react-icons/fa";

const MultiStepOnboarding: React.FC = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [schoolInfo, setSchoolInfo] = useState({
    name: "",
    address: "",
    documents: null as FileList | null,
  });
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthAndOnboarding = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        router.push("/signin");
        return;
      }

      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserName(userData?.name || "No name");

        if (userData?.onboardingComplete) {
          router.push("/admin");
        }
      } else {
        setUserName("No name");
      }
    };

    checkAuthAndOnboarding();
  }, [router]);

  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSchoolInfo({ ...schoolInfo, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    setSchoolInfo({ ...schoolInfo, documents: files });
  };

  const completeOnboarding = async () => {
    const uid = auth.currentUser?.uid;
    if (uid) {
      const userDocRef = doc(db, "users", uid);
      await setDoc(userDocRef, { ...schoolInfo, onboardingComplete: true }, { merge: true });
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 bg-gray-100">
      <div className="bg-white rounded-lg p-8 w-full max-w-2xl shadow-xl">
        <ProgressBar
          percent={(step - 1) * 50}
          filledBackground="linear-gradient(to right, #018abd, #00b09b)"
        
        >
          <Step transition="scale">
            {({ accomplished }) => (
              <div className={`transition-all ${accomplished ? "bg-[#018abd]" : "bg-gray-300"} w-8 h-8 rounded-full flex items-center justify-center`}>
                {accomplished ? <FaCheck className="text-white" /> : "1"}
              </div>
            )}
          </Step>
          <Step transition="scale">
            {({ accomplished }) => (
              <div className={`transition-all ${accomplished ? "bg-[#00b09b]" : "bg-gray-300"} w-8 h-8 rounded-full flex items-center justify-center`}>
                {accomplished ? <FaCheck className="text-white" /> : "2"}
              </div>
            )}
          </Step>
          <Step transition="scale">
            {({ accomplished }) => (
              <div className={`transition-all ${accomplished ? "bg-[#00b09b]" : "bg-gray-300"} w-8 h-8 rounded-full flex items-center justify-center`}>
                {accomplished ? <FaCheck className="text-white" /> : "3"}
              </div>
            )}
          </Step>
        </ProgressBar>
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8"
        >
          {step === 1 && (
            <div className="text-center">
              <h1 className="text-lg font-medium mb-4">Hello <span className="text-[#018abd]">{userName}</span>, Welcome to the modern school!</h1>
              <p className="mb-4">We're excited to help you manage your school records efficiently. Let's get started with the onboarding process.</p>
              <div className="flex justify-center mb-4">
                <Image src="/Hello-rafiki.png" alt="Welcome" width={300} height={150} />
              </div>
              <button className="w-full bg-[#018abd] text-white py-3 px-4 rounded-lg mt-4" onClick={handleNext}>
                Start Onboarding
              </button>
            </div>
          )}
          {step === 2 && (
            <div>
              <h1 className="text-2xl font-semibold mb-4">Tell Us About Your School</h1>
              <input
                type="text"
                name="name"
                placeholder="School Name"
                value={schoolInfo.name}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg mb-4"
              />
              <input
                type="text"
                name="address"
                placeholder="School Address"
                value={schoolInfo.address}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg mb-4"
              />
              <button className="w-full bg-gray-300 text-black py-3 px-4 rounded-lg mt-4" onClick={handlePrev}>
                Previous
              </button>
              <button className="w-full bg-[#018abd] text-white py-3 px-4 rounded-lg mt-4" onClick={handleNext}>
                Next
              </button>
            </div>
          )}
          {step === 3 && (
            <div>
              <h1 className="text-2xl font-semibold mb-4">Upload Your Documents</h1>
              <input
                title="file"
                type="file"
                name="documents"
                onChange={handleFileChange}
                className="w-full border border-gray-300 p-2 rounded-lg mb-4"
                multiple
              />
              <button className="w-full bg-gray-300 text-black py-3 px-4 rounded-lg mt-4" onClick={handlePrev}>
                Previous
              </button>
              <button className="w-full bg-[#018abd] text-white py-3 px-4 rounded-lg mt-4" onClick={completeOnboarding}>
                Complete Onboarding
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MultiStepOnboarding;