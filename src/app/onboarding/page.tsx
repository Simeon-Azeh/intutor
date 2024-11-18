
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { auth, db } from "../../firebase/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ProgressBar, Step } from "react-step-progress-bar";
import "react-step-progress-bar/styles.css";
import { FaCheck, FaChevronDown } from "react-icons/fa";
import { CircleHelp, Projector, TableOfContents, ImageUp } from 'lucide-react';

const countries = ["Cameroon", "Nigeria", "South Africa", "Kenya", "Ghana"];
const states: { [key: string]: string[] } = {
  Cameroon: ["Centre", "Littoral", "North West", "South West"],
  Nigeria: ["Lagos", "Abuja", "Kano", "Rivers"],
  SouthAfrica: ["Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape"],
  Kenya: ["Nairobi", "Mombasa", "Kisumu", "Nakuru"],
  Ghana: ["Greater Accra", "Ashanti", "Western", "Eastern"]
};
const cities: { [key: string]: string[] } = {
  Centre: ["Yaoundé", "Mbalmayo", "Obala"],
  Littoral: ["Douala", "Nkongsamba", "Edéa"],
  "North West": ["Bamenda", "Kumbo", "Ndop"],
  "South West": ["Buea", "Limbe", "Kumba"],
  Lagos: ["Ikeja", "Epe", "Badagry"],
  Abuja: ["Garki", "Wuse", "Maitama"],
  Kano: ["Kano", "Wudil", "Gaya"],
  Rivers: ["Port Harcourt", "Bonny", "Opobo"],
  Gauteng: ["Johannesburg", "Pretoria", "Soweto"],
  "Western Cape": ["Cape Town", "Stellenbosch", "Paarl"],
  "KwaZulu-Natal": ["Durban", "Pietermaritzburg", "Richards Bay"],
  "Eastern Cape": ["Port Elizabeth", "East London", "Mthatha"],
  Nairobi: ["Nairobi", "Westlands", "Kibera"],
  Mombasa: ["Mombasa", "Nyali", "Likoni"],
  Kisumu: ["Kisumu", "Ahero", "Maseno"],
  Nakuru: ["Nakuru", "Naivasha", "Gilgil"],
  "Greater Accra": ["Accra", "Tema", "Madina"],
  Ashanti: ["Kumasi", "Obuasi", "Ejisu"],
  Western: ["Sekondi-Takoradi", "Tarkwa", "Axim"],
  Eastern: ["Koforidua", "Nkawkaw", "Akim Oda"]
};

const MultiStepOnboarding: React.FC = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [schoolInfo, setSchoolInfo] = useState({
    schoolName: "",
    address: "",
    documents: null as FileList | null,
    schoolType: "",
    country: "",
    state: "",
    city: "",
    postalCode: "",
    establishedYear: "",
    phone: "",
    website: "",
    socialLinks: "", 
    schoolEmail: "",
    curriculumType: "",
    totalClasses: "",
    academicYearStart:"",
    academicYearEnd: "",
    timetable: "",
  });
  const [userName, setUserName] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
        } else {
          setSchoolInfo((prev) => ({
            ...prev,
            schoolName: userData?.school || "",
           
          }));
        }
      } else {
        setUserName("No name");
      }
    };

    checkAuthAndOnboarding();
  }, [router]);

  const handlePrev = () => setStep(step - 1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSchoolInfo({ ...schoolInfo, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    setSchoolInfo({ ...schoolInfo, documents: files });
  };

  const validateForm = (currentStep: number) => {
    const newErrors: { [key: string]: string } = {};
  
    if (currentStep === 2) {
      if (!schoolInfo.schoolName) newErrors.schoolName = "School name is required";
      if (!schoolInfo.schoolType) newErrors.schoolType = "School type is required";
      if (!schoolInfo.country) newErrors.country = "Country is required";
      if (!schoolInfo.state) newErrors.state = "State is required";
      if (!schoolInfo.city) newErrors.city = "City is required";
      if (!schoolInfo.postalCode) newErrors.postalCode = "Postal code is required";
      if (!schoolInfo.phone) newErrors.phone = "Phone number is required";
      if (!schoolInfo.schoolEmail) newErrors.schoolEmail = "School email is required";
    } else if (currentStep === 3) {
      if (!schoolInfo.totalClasses) newErrors.totalClasses = "Total classes is required";
      if (!schoolInfo.academicYearStart) newErrors.academicYearStart = "Academic year start date is required";
      if (!schoolInfo.academicYearEnd) newErrors.academicYearEnd = "Academic year end date is required";
      if (!schoolInfo.curriculumType) newErrors.curriculumType = "Curriculum type is required";
      if (!schoolInfo.timetable) newErrors.timetable = "Timetable is required";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNext = () => {
    if (step === 1) {
      // No validation needed for step 1
      setStep(step + 1);
    } else {
      // Validate form for other steps
      if (validateForm(step)) {
        setStep(step + 1);
      } else {
        console.log("Validation failed", errors);
      }
    }
  };
  const completeOnboarding = async () => {
    const uid = auth.currentUser?.uid;
    if (uid) {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data();
      await setDoc(userDocRef, { ...userData, ...schoolInfo, onboardingComplete: true }, { merge: true });
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 ">
      <div className="bg-white rounded-lg p-8 w-full max-w-2xl">
        <ProgressBar
          percent={(step - 1) * 35}
          filledBackground="linear-gradient(to right, #018abd, #00b09b)"
        >
          <Step transition="scale">
            {({ accomplished }) => (
              <div className={`transition-all ${accomplished ? "bg-[#018abd]" : "bg-gray-200"} w-8 h-8 rounded-full flex items-center justify-center`}>
                {accomplished ? <FaCheck className="text-white" /> : "1"}
              </div>
            )}
          </Step>
          <Step transition="scale">
            {({ accomplished }) => (
              <div className={`transition-all ${accomplished ? "bg-[#018abd]" : "bg-gray-200"} w-8 h-8 rounded-full flex items-center justify-center`}>
                {accomplished ? <FaCheck className="text-white" /> : "2"}
              </div>
            )}
          </Step>
          <Step transition="scale">
            {({ accomplished }) => (
              <div className={`transition-all ${accomplished ? "bg-[#018abd]" : "bg-gray-200"} w-8 h-8 rounded-full flex items-center justify-center`}>
                {accomplished ? <FaCheck className="text-white" /> : "3"}
              </div>
            )}
          </Step>
          <Step transition="scale">
            {({ accomplished }) => (
              <div className={`transition-all ${accomplished ? "bg-[#018abd]" : "bg-gray-200"} w-8 h-8 rounded-full flex items-center justify-center`}>
                {accomplished ? <FaCheck className="text-white" /> : "4"}
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
            <div className="">
              <h1 className="text-lg font-medium mb-4">Hello <span className="text-[#018abd]">{userName}</span>, Welcome to the modern school!</h1>
              <p className="mb-4">We're excited to help you manage your school records efficiently. Let's get your school set up.</p>

              <div className="flex justify-center mb-4">
                <Image src="/Hello.gif" alt="Welcome" width={350} height={150} />
              </div>
              <div className="flex gap-2">
                <button className="bg-[#018abd] text-white py-3 font-medium px-4 rounded-lg" onClick={handleNext}>
                  Start Onboarding
                </button>
                <div className="relative inline-block text-left">
                  <button
                    className=" text-[#1a1a1a] border font-medium py-3 px-4 rounded-lg flex items-center"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    Learn More <FaChevronDown className="ml-2" />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute -top-28 right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        <a href="#" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 font-medium" role="menuitem">  <CircleHelp size={18} /> Help Tooltips</a>
                        <a href="#" className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-100  flex items-center gap-2 font-medium" role="menuitem"> <Projector size={18} /> Tutorials</a>
                        <a href="#" className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-100  flex items-center gap-2 font-medium" role="menuitem"> <TableOfContents size={18} />FAQs</a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        {step === 2 && (
  <div>
    <Image src="/school.png" width={150} height={50} alt='' />
    <h1 className="text-2xl font-semibold mb-4">School Profile Section</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
      <div>
      <input
        type="text"
        name="schoolName"
        placeholder="School Name"
        value={schoolInfo.schoolName}
        readOnly
        className="w-full border border-gray-300 p-2 rounded-lg mb-4 outline-none text-gray-400"
      />
      </div>
    
      <div>
      <select
        title="schoolType"
        name="schoolType"
        value={schoolInfo.schoolType}
        onChange={handleChange}
        className="w-full border border-gray-300 p-2 rounded-lg mb-1 outline-none"
      >
        <option value="">School Type</option>
        <option value="Primary">Primary</option>
        <option value="Secondary">Secondary</option>
        <option value="High School">High School</option>
        <option value="Vocational">Vocational</option>
        <option value="College">College</option>
        <option value="University">University</option>
      </select>
      {errors.schoolType && <p className="text-red-500 text-sm">{errors.schoolType}</p>}
      </div>
     <div>
     <input
        type="text"
        name="establishedYear"
        placeholder="Established Year"
        value={schoolInfo.establishedYear}
        onChange={handleChange}
        className="w-full border border-gray-300 p-2 rounded-lg mb-4 outline-none"
      />
     </div>
     
    </div>
    <label htmlFor="Logo" className="block text-sm font-medium mb-2 text-gray-700">
      Upload School Logo (optional)
    </label>
    <div className="relative w-full border border-gray-300 p-4 rounded-lg mb-4">
      <input
        title="logoupload"
        type="file"
        name="file"
        id="file"
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className="flex items-center justify-center h-full text-gray-500 gap-1">
        <ImageUp size={18} />
        <span className="text-gray-500">Choose a file...</span>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
      <div>
      <input
        type="text"
        name="address"
        placeholder="School Address"
        value={schoolInfo.address}
        onChange={handleChange}
        className="w-full border border-gray-300 p-2 rounded-lg mb-4 outline-none"
      />
      </div>
      <div>
      <select
        title="country"
        name="country"
        value={schoolInfo.country}
        onChange={handleChange}
        className="w-full border border-gray-300 p-2 rounded-lg mb-1 outline-none"
      >
        <option value="">Select Country</option>
        {countries.map((country) => (
          <option key={country} value={country}>{country}</option>
        ))}
      </select>
      {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
      </div>
      <div>
      <select
        title="state"
        name="state"
        value={schoolInfo.state}
        onChange={handleChange}
        className="w-full border border-gray-300 p-2 rounded-lg mb-1 outline-none"
        disabled={!schoolInfo.country}
      >
        <option value="">Select State</option>
        {schoolInfo.country && states[schoolInfo.country]?.map((state) => (
          <option key={state} value={state}>{state}</option>
        ))}
      </select>
      {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
      </div>
     
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
      <div>
      <select
        title="city"
        name="city"
        value={schoolInfo.city}
        onChange={handleChange}
        className="w-full border border-gray-300 p-2 rounded-lg mb-1 outline-none"
        disabled={!schoolInfo.state}
      >
        <option value="">Select City</option>
        {schoolInfo.state && cities[schoolInfo.state]?.map((city) => (
          <option key={city} value={city}>{city}</option>
        ))}
      </select>
      {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
      </div>
      <div>
      <input
        type="text"
        name="postalCode"
        placeholder="Postal Code"
        value={schoolInfo.postalCode}
        onChange={handleChange}
        className="w-full border border-gray-300 p-2 rounded-lg mb-1 outline-none"
      />
      {errors.postalCode && <p className="text-red-500 text-sm">{errors.postalCode}</p>}
      </div>
      <div>
      <input
        type="tel"
        name="phone"
        placeholder="Emergency Line"
        value={schoolInfo.phone}
        onChange={handleChange}
        className="w-full border border-gray-300 p-2 rounded-lg mb-1 outline-none"
      />
      {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
      </div>
     
     
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
      <div>
      <input
        type="email"
        name="schoolEmail"
        placeholder="School email"
        value={schoolInfo.schoolEmail}
        onChange={handleChange}
        className="w-full border border-gray-300 p-2 rounded-lg mb-1 outline-none"
      />
      {errors.schoolEmail && <p className="text-red-500 text-sm">{errors.schoolEmail}</p>}
      </div>
      <div>
      <input
        type="text"
        name="website"
        placeholder="Website"
        value={schoolInfo.website}
        onChange={handleChange}
        className="w-full border border-gray-300 p-2 rounded-lg mb-4 outline-none"
      />
      </div>
    <div>
    <input
        type="text"
        name="socialLinks"
        placeholder="Linkedin Page"
        value={schoolInfo.socialLinks}
        onChange={handleChange}
        className="w-full border border-gray-300 p-2 rounded-lg mb-4 outline-none"
      />
    </div>
   
  
    </div>
    <div className="flex items-center gap-2">
      <button className="w-full border text-black font-medium py-3 px-4 rounded-lg mt-4" onClick={handlePrev}>
        Previous
      </button>
      <button className="w-full bg-[#018abd] text-white py-3 px-4 rounded-lg mt-4" onClick={handleNext}>
        Next
      </button>
    </div>
  </div>
        )}
      {step === 3 && (
  <div>
    <h1 className="text-2xl font-semibold mb-4">Academic Information</h1>
    <div className="flex flex-col gap-2">
      <label htmlFor="totalClasses" className="block text-sm font-medium text-gray-700">
        Total Classes
      </label>
      <select
        id="totalClasses"
        name="totalClasses"
        value={schoolInfo.totalClasses}
        onChange={handleChange}
        className="w-full border border-gray-300 p-2 rounded-lg mb-1 outline-none"
      >
        <option value="">Select Total Classes</option>
        {Array.from({ length: 20 }, (_, i) => (
          <option key={i + 1} value={i + 1}>{i + 1}</option>
        ))}
      </select>
      {errors.totalClasses && <p className="text-red-500 text-sm">{errors.totalClasses}</p>}
    </div>
    <div className="flex flex-col gap-2">
      <label className="block text-sm font-medium text-gray-700">
        Curriculum Type
      </label>
      <div className="w-full border border-gray-300 p-2 rounded-lg mb-4">
        {['GCE', 'Masters', 'Bachelors', 'PhD', 'Diploma'].map((type) => (
          <div key={type} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={type}
              name="curriculumType"
              value={type}
              checked={schoolInfo.curriculumType.split(',').includes(type)}
              onChange={(e) => {
                const selectedValues = schoolInfo.curriculumType.split(',');
                if (e.target.checked) {
                  selectedValues.push(e.target.value);
                } else {
                  const index = selectedValues.indexOf(e.target.value);
                  if (index > -1) {
                    selectedValues.splice(index, 1);
                  }
                }
                setSchoolInfo({ ...schoolInfo, curriculumType: selectedValues.join(',') });
              }}
              className="mr-2"
            />
            <label htmlFor={type} className="text-sm text-gray-700">{type}</label>
          </div>
        ))}
      </div>
      {errors.curriculumType && <p className="text-red-500 text-sm">{errors.curriculumType}</p>}
    </div>
    <div className="flex flex-col gap-2">
      <label htmlFor="academicYearStart" className="block text-sm font-medium text-gray-700">
        Academic Year Start Date
      </label>
      <input
        id="academicYearStart"
        type="date"
        name="academicYearStart"
        value={schoolInfo.academicYearStart}
        onChange={handleChange}
        className="w-full border border-gray-300 p-2 rounded-lg mb-4 outline-none"
      />
      {errors.academicYearStart && <p className="text-red-500 text-sm">{errors.academicYearStart}</p>}
      
      <label htmlFor="academicYearEnd" className="block text-sm font-medium text-gray-700">
        Academic Year End Date
      </label>
      <input
        id="academicYearEnd"
        type="date"
        name="academicYearEnd"
        value={schoolInfo.academicYearEnd}
        onChange={handleChange}
        className="w-full border border-gray-300 p-2 rounded-lg mb-4 outline-none"
      />
      {errors.academicYearEnd && <p className="text-red-500 text-sm">{errors.academicYearEnd}</p>}
    </div>
    <div className="flex flex-col gap-2">
      <label htmlFor="timetable" className="block text-sm font-medium text-gray-700">
        General Timetable Schedule
      </label>
      <input
        id="timetable"
        type="text"
        name="timetable"
        placeholder="e.g., 8am-4pm"
        value={schoolInfo.timetable}
        onChange={handleChange}
        className="w-full border border-gray-300 p-2 rounded-lg mb-4 outline-none"
      />
      {errors.timetable && <p className="text-red-500 text-sm">{errors.timetable}</p>}
    </div>
    <div className="flex items-center gap-2">
      <button className="w-full border text-black font-medium py-3 px-4 rounded-lg mt-4" onClick={handlePrev}>
        Previous
      </button>
      <button className="w-full bg-[#018abd] text-white py-3 px-4 rounded-lg mt-4" onClick={handleNext}>
        Next
      </button>
    </div>
  </div>
)}

        {step === 4 && (
        <div className="">
          <h1 className="text-lg font-medium mb-4">Hurray!!! <span className="text-[#018abd]">{userName}</span>, you've succesfully completed onboarding!</h1>
          <p className="mb-4">We're excited to help you manage your school records efficiently, you would now have access to most features. Within a few days, our team will notify you if your school has been approved</p>
          <p>Have an ostastic day!</p>
          <div className="flex justify-center mb-4">
            <Image src="/Hello.gif" alt="Welcome" width={350} height={150} />
          </div>
          <div className="flex gap-2">
            <button className="w-full bg-[#018abd] text-white py-3 px-4 rounded-lg mt-4" onClick={completeOnboarding}>
              Complete Onboarding
            </button>
          </div>
        </div>
        )}
</motion.div>
</div>
</div>
);
};

export default MultiStepOnboarding;