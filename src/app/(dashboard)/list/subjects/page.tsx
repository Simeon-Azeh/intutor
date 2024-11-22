"use client";

import { useState, useEffect } from "react";
import { db } from "@/firebase/firebaseConfig"; // Make sure to configure your firebase
import { collection, getDocs } from "firebase/firestore";
import CourseCreationForm from "@/components/forms/CourseCreation";
import CourseCard from "@/components/CourseCard";
import ScheduleGrid from "@/components/ScheduleGrid";

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

  useEffect(() => {
    const fetchCourses = async () => {
      const querySnapshot = await getDocs(collection(db, "courses"));
      const coursesList: Subject[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Subject[];
      setSubjects(coursesList);
    };

    fetchCourses();
  }, []);

  const handleCreateCourse = (newSubject: Subject) => {
    setSubjects([...subjects, newSubject]);
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-2">
       
      <CourseCreationForm onCreate={handleCreateCourse} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map(subject => (
          <CourseCard key={subject.id} subject={subject} />
        ))}
      </div>
      <ScheduleGrid />
    
    </div>
  );
};

export default SubjectListPage;