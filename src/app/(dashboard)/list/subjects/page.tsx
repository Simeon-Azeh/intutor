"use client";

import { useState, useEffect } from "react";
import { db, auth } from "@/firebase/firebaseConfig"; // Make sure to configure your firebase
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import CourseCreationForm from "@/components/forms/CourseCreation";
import CourseCard from "@/components/CourseCard";
import ScheduleGrid from "@/components/ScheduleGrid";
import { useDarkMode } from "@/components/DarkModeContext"; // Adjust the import based on your project structure

type Subject = {
  id: string;
  name: string;
  teachers: string[];
  duration: string;
  classAssigned: string;
  school: string;
  level?: string;
  startDate?: string;
  endDate?: string;
};

const SubjectListPage = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [userSchool, setUserSchool] = useState<string | null>(null);
  const { darkMode } = useDarkMode(); // Use the dark mode context

  useEffect(() => {
    const fetchUserSchool = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        console.error("No user is logged in");
        return;
      }

      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data();
      setUserSchool(userData?.school || null);
    };

    fetchUserSchool();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!userSchool) return;

      const q = query(collection(db, "courses"), where("school", "==", userSchool));
      const querySnapshot = await getDocs(q);
      const coursesList: Subject[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Subject[];
      setSubjects(coursesList);
    };

    fetchCourses();
  }, [userSchool]);

  const handleCreateCourse = (newSubject: Subject) => {
    setSubjects([...subjects, newSubject]);
  };

  return (
    <div className={`p-4 rounded-md flex-1 m-4 mt-2 ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-black'}`}>
      <CourseCreationForm onCreate={handleCreateCourse} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map(subject => (
          <CourseCard key={subject.id} subject={subject} />
        ))}
      </div>
      <ScheduleGrid school={userSchool} />
    </div>
  );
};

export default SubjectListPage;