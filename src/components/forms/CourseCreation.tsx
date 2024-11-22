import { useState, useEffect } from "react";
import { db, auth } from "@/firebase/firebaseConfig"; // Make sure to configure your firebase
import { collection, query, where, getDocs, addDoc, doc, getDoc } from "firebase/firestore";
import dayjs, { Dayjs } from 'dayjs'; // Import Dayjs
import { DatePicker } from 'antd'; // Import DatePicker from antd
import { TbCopyCheck } from "react-icons/tb";


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

type Teacher = {
  id: string;
  name: string;
};

type CourseCreationFormProps = {
  onCreate: (newSubject: Subject) => void;
};

const CustomDropdown: React.FC<{
  title: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}> = ({ title, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div
        className="p-2 border rounded-md cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value || title}
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full bg-white border rounded-md mt-1">
          {options.map(option => (
            <div
              key={option}
              className="p-2 cursor-pointer hover:bg-gray-200"
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CourseCreationForm: React.FC<CourseCreationFormProps> = ({ onCreate }) => {
  const [newSubject, setNewSubject] = useState<Omit<Subject, 'id'>>({
    name: "",
    teachers: [],
    duration: "",
    classAssigned: "",
    school: "", // Initialize as empty
  });
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [curriculumType, setCurriculumType] = useState<string[]>([]);
  const [totalClasses, setTotalClasses] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchTeachersAndAdminData = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        console.error("No user is logged in");
        return;
      }

      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data();
      const userSchool = userData?.school;
      setNewSubject(prevState => ({ ...prevState, school: userSchool || "" }));
      setCurriculumType(userData?.curriculumType.split(',').filter(Boolean) || []);
      setTotalClasses(parseInt(userData?.totalClasses) || 0);

      const q = query(
        collection(db, "users"),
        where("school", "==", userSchool),
        where("role", "==", "Teacher")
      );
      const querySnapshot = await getDocs(q);
      const teachersList: Teacher[] = querySnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
      setTeachers(teachersList);
    };

    fetchTeachersAndAdminData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewSubject({ ...newSubject, [name]: value });
  };

  const handleTeacherChange = (teacherId: string) => {
    const teacher = teachers.find(t => t.id === teacherId);
    if (teacher) {
      setNewSubject(prevState => {
        const teachers = prevState.teachers.includes(teacher.name)
          ? prevState.teachers.filter(t => t !== teacher.name)
          : [...prevState.teachers, teacher.name];
        return { ...prevState, teachers };
      });
    }
  };

  const handleDateChange = (date: Dayjs | null, dateString: string | string[], field: 'startDate' | 'endDate') => {
    if (typeof dateString === 'string') {
      setNewSubject({ ...newSubject, [field]: dateString });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, "courses"), newSubject);
      onCreate({ ...newSubject, id: docRef.id });
      setNewSubject({
        name: "",
        teachers: [],
        duration: "",
        classAssigned: "",
        school: newSubject.school, // Keep the school value
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 10000); // Hide success message after 10 seconds
    } catch (error) {
      console.error("Error creating course:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {success && (
        <div className="mb-4 p-4 text-[#018abd] bg-[#8de1ff25] border border-[#018abd] rounded-md flex items-center gap-2 justify-center">
          <TbCopyCheck size={24} />
          Course created successfully!
        </div>
      )}
      <form className="mb-4" onSubmit={handleSubmit}>
        <div className="">
          <input
            type="text"
            name="name"
            value={newSubject.name}
            onChange={handleInputChange}
            placeholder="| Course Name"
            className="p-2 border rounded-md w-full mb-4 outline-none text-[#018abd] focus:border-[#018abd] focus:ring-2 focus:ring-[#018abd] focus:ring-opacity-50 font-medium"
            required
          />
          <div className="p-2 pb-4 border rounded-md mb-4 ">
            <label className="font-medium mb-4 text-[#333]">Teachers:</label>
            <div className="flex flex-wrap gap-2 mt-4">
              {teachers.map(teacher => (
                <div
                  key={teacher.id}
                  className={`p-2 border rounded-md font-medium cursor-pointer text-[#1a1a1a] ${newSubject.teachers.includes(teacher.name) ? 'border-[#018abd] shadow-md' : ''}`}
                  onClick={() => handleTeacherChange(teacher.id)}
                >
                  <input
                    title="Select Teacher"
                    type="checkbox"
                    name="teachers"
                    value={teacher.id}
                    checked={newSubject.teachers.includes(teacher.name)}
                    onChange={() => handleTeacherChange(teacher.id)}
                    className="hidden"
                  />
                  {teacher.name}
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CustomDropdown
              title="Select Duration"
              options={["1 hour", "2 hours", "3 hours", "4 hours"]}
              value={newSubject.duration}
              onChange={(value) => setNewSubject({ ...newSubject, duration: value })}
            />
            <CustomDropdown
              title="Select Class"
              options={Array.from({ length: totalClasses }, (_, i) => `Class ${i + 1}`)}
              value={newSubject.classAssigned}
              onChange={(value) => setNewSubject({ ...newSubject, classAssigned: value })}
            />
            <DatePicker
              placeholder="Start Date"
              onChange={(date, dateString) => handleDateChange(date, dateString, 'startDate')}
              className="p-2 border rounded-md w-full font-inter font-medium text-xl text-[#333]"
            />
            <DatePicker
              placeholder="End Date"
              onChange={(date, dateString) => handleDateChange(date, dateString, 'endDate')}
              className="p-2 border rounded-md w-full font-inter font-medium text-xl text-[#333]"
            />
            <input type="hidden" name="school" value={newSubject.school} />
            {curriculumType.length > 0 && (
              <CustomDropdown
                title="Select Level"
                options={curriculumType}
                value={newSubject.level || ""}
                onChange={(value) => setNewSubject({ ...newSubject, level: value })}
              />
            )}
          </div>
        </div>
        <button type="submit" className="mt-4 bg-[#018abd] shadow text-white p-2 rounded-md" disabled={loading}>
          {loading ? "Submitting..." : "Create Course"}
        </button>
      </form>
    </div>
  );
};

export default CourseCreationForm;