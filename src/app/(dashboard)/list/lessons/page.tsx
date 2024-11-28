"use client";

import { useState, useEffect } from "react";
import { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { db, auth } from "@/firebase/firebaseConfig"; // Make sure to configure your firebase
import { collection, getDocs, query, where, doc, setDoc, getDoc } from "firebase/firestore";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import InputField from "@/components/InputField";
import Select from "react-select";
import { useDarkMode } from "@/components/DarkModeContext"; // Adjust the import based on your project structure
import { FaPlus, FaChevronDown, FaChevronUp } from "react-icons/fa"; // Import the icons

const schema = z.object({
  course: z.string().min(1, { message: "Course is required!" }),
  modules: z.array(z.object({
    moduleName: z.string().min(1, { message: "Module name is required!" }),
    subModules: z.array(z.object({
      subModuleName: z.string().min(1, { message: "Submodule name is required!" }),
      description: z.string().optional(),
      materials: z.array(z.string()).optional(),
    })).optional(),
  })).min(1, { message: "At least one module is required!" }),
  school: z.string().min(1, { message: "School is required!" }),
});

type Inputs = z.infer<typeof schema>;

type CourseOption = {
  value: string;
  label: string;
};

interface ModuleProps {
  control: Control<Inputs>;
  register: UseFormRegister<Inputs>;
  errors: FieldErrors<Inputs>;
  darkMode: boolean;
  module: any;
  moduleIndex: number;
  removeModule: (index: number) => void;
}

const Module: React.FC<ModuleProps> = ({ control, register, errors, darkMode, module, moduleIndex, removeModule }) => {
  const { fields: subModuleFields, append: appendSubModule, remove: removeSubModule } = useFieldArray({
    control,
    name: `modules.${moduleIndex}.subModules`,
  });

  return (
    <div key={module.id} className="flex flex-col gap-4">
      <InputField
        label={`Module ${moduleIndex + 1} Name`}
        name={`modules.${moduleIndex}.moduleName`}
        register={register}
        error={errors.modules?.[moduleIndex]?.moduleName}
        darkMode={darkMode}
      />
      {subModuleFields.map((subModule, subModuleIndex) => (
        <div key={subModule.id} className="flex flex-col gap-2 ml-4">
          <InputField
            label={`Submodule ${subModuleIndex + 1} Name`}
            name={`modules.${moduleIndex}.subModules.${subModuleIndex}.subModuleName`}
            register={register}
            error={errors.modules?.[moduleIndex]?.subModules?.[subModuleIndex]?.subModuleName}
            darkMode={darkMode}
          />
          <InputField
            label="Description"
            name={`modules.${moduleIndex}.subModules.${subModuleIndex}.description`}
            register={register}
            error={errors.modules?.[moduleIndex]?.subModules?.[subModuleIndex]?.description}
            darkMode={darkMode}
          />
          <InputField
            label="Materials"
            name={`modules.${moduleIndex}.subModules.${subModuleIndex}.materials`}
            register={register}
          
            darkMode={darkMode}
          />
          <button type="button" onClick={() => removeSubModule(subModuleIndex)} className="text-red-500">Remove Submodule</button>
        </div>
      ))}
      <button type="button" onClick={() => appendSubModule({ subModuleName: "", description: "", materials: [] })} className="border text-gray-800 md:w-[20%] justify-center dark:text-white p-1 rounded-md flex items-center gap-1">
        <FaPlus /> Add Submodule
      </button>
      <button type="button" onClick={() => removeModule(moduleIndex)} className="text-red-500">Remove Module</button>
    </div>
  );
};

const LessonListPage = () => {
  const { register, handleSubmit, control, formState: { errors }, setValue } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });
  const { fields: moduleFields, append: appendModule, remove: removeModule } = useFieldArray({
    control,
    name: "modules",
  });
  const [courseOptions, setCourseOptions] = useState<CourseOption[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { darkMode } = useDarkMode(); // Use the dark mode context

  useEffect(() => {
    const fetchCourses = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        console.error("No user is logged in");
        return;
      }

      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data();
      const userSchool = userData?.school;
      const userRole = userData?.role;

      if (userRole === "Admin") {
        const coursesQuery = query(collection(db, "courses"), where("school", "==", userSchool));
        const coursesSnapshot = await getDocs(coursesQuery);
        const coursesList = coursesSnapshot.docs.map(doc => ({
          value: doc.id,
          label: doc.data().name,
        }));
        setCourseOptions(coursesList);
        setValue("school", userSchool); // Set the school value for the admin
      } else if (userRole === "Teacher") {
        const teacherQuery = query(collection(db, "teachers"), where("school", "==", userSchool), where("userId", "==", uid));
        const teacherSnapshot = await getDocs(teacherQuery);
        const teacherData = teacherSnapshot.docs[0]?.data();
        if (teacherData) {
          const course = {
            value: teacherData.courseId,
            label: teacherData.courseName,
          };
          setCourseOptions([course]);
          setValue("course", course.value); // Set the course value for the teacher
          setValue("school", userSchool); // Set the school value for the teacher
        }
      }

      // Fetch lessons and filter by school
      const lessonsQuery = query(collection(db, "lessons"), where("school", "==", userSchool));
      const lessonsSnapshot = await getDocs(lessonsQuery);
      const lessonsList = lessonsSnapshot.docs.map(doc => doc.data());
      setLessons(lessonsList);
    };

    fetchCourses();
  }, [setValue]);

  const onSubmit = async (formData: Inputs) => {
    console.log("Form Data:", formData); // Debug log
    setLoading(true);
    try {
      const lessonId = `Lesson${Date.now()}`;
      const lessonData = {
        course: formData.course,
        modules: formData.modules,
        school: formData.school,
      };

      await setDoc(doc(db, "lessons", lessonId), lessonData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000); // Hide success message after 3 seconds

      // Fetch updated lessons list
      const lessonsQuery = query(collection(db, "lessons"), where("course", "==", formData.course));
      const lessonsSnapshot = await getDocs(lessonsQuery);
      const lessonsList = lessonsSnapshot.docs.map(doc => doc.data());
      setLessons(lessonsList);
    } catch (error) {
      console.error("Error creating lesson:", error);
    } finally {
      setLoading(false);
    }
  };

  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);

  const toggleLessonDetails = (lessonId: string) => {
    setExpandedLesson(expandedLesson === lessonId ? null : lessonId);
  };

  return (
    <div className={`p-4 rounded-md flex-1 m-4 mt-5  ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-black'}`}>
      <h1 className="text-lg font-semibold">Create Lesson Plan</h1>
      <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="course"
          control={control}
          render={({ field }) => (
            <Select<CourseOption>
              {...field}
              options={courseOptions}
              className="basic-single"
              classNamePrefix="select"
              placeholder="Select course"
              getOptionLabel={(option) => option.label}
              getOptionValue={(option) => option.value}
              onChange={(selectedOption) => field.onChange(selectedOption?.value)}
              value={courseOptions.find(option => option.value === field.value)}
              styles={{
                control: (provided) => ({
                  ...provided,
                  minWidth: '200px',
                  backgroundColor: darkMode ? '#2d3748' : '#fff',
                  color: darkMode ? '#cbd5e0' : '#000',
                }),
                menu: (provided) => ({
                  ...provided,
                  backgroundColor: darkMode ? '#2d3748' : '#fff',
                }),
                singleValue: (provided) => ({
                  ...provided,
                  color: darkMode ? '#cbd5e0' : '#000',
                }),
              }}
            />
          )}
        />
        <input type="hidden" {...register("school")} />
        {moduleFields.map((module, moduleIndex) => (
          <Module
            key={module.id}
            control={control}
            register={register}
            errors={errors}
            darkMode={darkMode}
            module={module}
            moduleIndex={moduleIndex}
            removeModule={removeModule}
          />
        ))}
        <button type="button" onClick={() => appendModule({ moduleName: "", subModules: [] })} className="bg-[#018abd] md:w-[20%] text-center justify-center text-white p-1 rounded-md flex items-center gap-1">
          <FaPlus /> Add Module
        </button>
        <button type="submit" className="bg-[#018abd] text-white p-2 rounded-md md:w-[20%] shadow-md" disabled={loading}>
          {loading ? "Creating..." : "Create Lesson Plan"}
        </button>
      </form>
      {success && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-md shadow-lg">
          Lesson plan created successfully!
        </div>
      )}
      <div className="mt-8">
        <h2 className="text-lg font-semibold">Lesson Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lessons.map((lesson, index) => (
            <div key={lesson.id} className={`bg-white dark:bg-gray-700 p-4 border rounded-md shadow-md ${expandedLesson === lesson.id ? 'expanded' : ''}`}>
              <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleLessonDetails(lesson.id)}>
                <h3 className="text-md font-semibold">{courseOptions.find(option => option.value === lesson.course)?.label}</h3>
                {expandedLesson === lesson.id ? <FaChevronUp /> : <FaChevronDown />}
              </div>
              {expandedLesson === lesson.id && (
                <div className="mt-4">
                  {lesson.modules.map((module: any, moduleIndex: number) => (
                    <div key={module.id} className="mt-4">
                      <h4 className="text-sm font-semibold">{module.moduleName}</h4>
                      {module.subModules.map((subModule: any, subModuleIndex: number) => (
                        <div key={subModule.id} className="ml-4 mt-2">
                          <p className="text-sm"><strong>Submodule:</strong> {subModule.subModuleName}</p>
                          <p className="text-sm"><strong>Description:</strong> {subModule.description}</p>
                          <p className="text-sm"><strong>Materials:</strong> {subModule.materials?.join(", ")}</p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LessonListPage;