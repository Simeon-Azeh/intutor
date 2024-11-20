"use client";

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/firebase/firebaseConfig";
import { collection, getDocs, query, where, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, updateEmail, updatePassword } from "firebase/auth";
import InputField from "../InputField";

type ParentFormProps = {
  type: "create" | "update";
  data?: any;
  onClose?: () => void;
};

type Student = {
  id: string;
  name: string;
};

const ParentsForm: React.FC<ParentFormProps> = ({ type, data, onClose }) => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      name: data?.name || '',
      email: data?.email || '',
      phone: data?.phone || '',
      address: data?.address || '',
      students: data?.students || [],
      password: '', // Add default value for password
    }
  });

  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>(data?.students || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchStudents = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        console.error("No user is logged in");
        return;
      }

      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data();
      const userSchool = userData?.school;

      const q = query(collection(db, "students"), where("school", "==", userSchool));
      const querySnapshot = await getDocs(q);
      const studentsList: Student[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
      }));

      setStudents(studentsList);
    };

    fetchStudents();
  }, []);

  const onSubmit = async (formData: any) => {
    setLoading(true);
    console.log("Form data:", formData);

    try {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        console.error("No user is logged in");
        return;
      }

      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data();
      const userSchool = userData?.school;

      if (type === "create") {
        // Create new parent in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        // Add parent to users collection
        await setDoc(doc(db, "users", user.uid), {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          students: selectedStudents,
          role: "Parent",
          school: userSchool, // Use school from user data
        });
      } else if (type === "update" && data) {
        // Update parent in Firebase Authentication
        const user = auth.currentUser;
        if (user) {
          if (formData.email !== user.email) {
            await updateEmail(user, formData.email);
          }
          if (formData.password) {
            await updatePassword(user, formData.password);
          }
        }

        // Update parent in users collection
        await updateDoc(doc(db, "users", data.id), {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          students: selectedStudents,
          school: userSchool, // Use school from user data
        });
      }

      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSelect = (studentName: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentName) ? prev.filter(name => name !== studentName) : [...prev, studentName]
    );
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-lg font-semibold">Parent successfully {type === "create" ? "created" : "updated"}!</p>
        <button
          className="bg-[#018abd] text-white p-2 rounded-md"
          onClick={() => router.push("/admin")}
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex justify-around flex-wrap gap-1">
        <InputField
          label="Name"
          name="name"
          register={register}
        />
        <InputField
          label="Email"
          name="email"
          register={register}
        />
        <InputField
          label="Phone"
          name="phone"
          register={register}
        />
        <InputField
          label="Address"
          name="address"
          register={register}
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          register={register}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">Students</label>
        <input
          type="text"
          placeholder="Search students..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded-md"
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {filteredStudents.map(student => (
            <div
              key={student.id}
              className={`p-2 border rounded-md cursor-pointer ${selectedStudents.includes(student.name) ? 'bg-blue-100' : ''}`}
              onClick={() => handleStudentSelect(student.name)}
            >
              <p className="text-sm">{student.name}</p>
            </div>
          ))}
        </div>
      </div>
      <button type="submit" className="bg-[#018abd] text-white p-2 rounded-md">
        {loading ? "Submitting..." : type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default ParentsForm;