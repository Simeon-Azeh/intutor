"use client";

import React from "react";
import { auth, db } from "../../firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

const Onboarding: React.FC = () => {
  const router = useRouter();

  const completeOnboarding = async () => {
    const uid = auth.currentUser?.uid;
    if (uid) {
      const userDocRef = doc(db, "users", uid);
      await setDoc(userDocRef, { onboardingComplete: true }, { merge: true });
      router.push("/admin"); // Redirect to the appropriate dashboard
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8">
      <div className="bg-white rounded-lg p-8 w-full max-w-xl focus:shadow-xl">
        <h1 className="text-2xl font-semibold mb-4">Onboarding</h1>
        {/* Add your onboarding steps here */}
        <p>Complete the onboarding process to access your dashboard.</p>
        <button
          className="w-full bg-[#018abd] text-white py-3 px-4 rounded-lg mt-4"
          onClick={completeOnboarding}
        >
          Complete Onboarding
        </button>
      </div>
    </div>
  );
};

export default Onboarding;