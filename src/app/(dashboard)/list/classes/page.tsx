"use client";

import { useState, useEffect } from "react";
import { db, auth } from "@/firebase/firebaseConfig"; // Make sure to configure your firebase
import { collection, getDocs, query, where, doc, setDoc, getDoc } from "firebase/firestore";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import InputField from "@/components/InputField";
import Select from "react-select";
import { useDarkMode } from "@/components/DarkModeContext"; // Adjust the import based on your project structure

const schema = z.object({
  departmentName: z.string().min(1, { message: "Department name is required!" }),
  staff: z.array(z.object({
    value: z.string(),
    label: z.string(),
    departmentalPosition: z.string().min(1, { message: "Departmental position is required!" }),
  })).min(1, { message: "At least one staff member is required!" }),
  courses: z.array(z.object({
    value: z.string(),
    label: z.string(),
  })).min(1, { message: "At least one course is required!" }),
  school: z.string(), // Add hidden input for school
});

type Inputs = z.infer<typeof schema>;

type StaffOption = {
  value: string;
  label: string;
  departmentalPosition: string;
};

type CourseOption = {
  value: string;
  label: string;
};

const positionSuggestions = ["HOD", "Vice President", "Secretary", "Treasurer"];

const DepartmentsPage = () => {
  const { register, handleSubmit, control, formState: { errors }, setValue } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });
  const { fields: staffFields, append: appendStaff, remove: removeStaff } = useFieldArray({
    control,
    name: "staff",
  });
  const [staffOptions, setStaffOptions] = useState<StaffOption[]>([]);
  const [courseOptions, setCourseOptions] = useState<CourseOption[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { darkMode } = useDarkMode(); // Use the dark mode context

  useEffect(() => {
    const fetchStaffAndCourses = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        console.error("No user is logged in");
        return;
      }

      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data();
      const userSchool = userData?.school;

      setValue("school", userSchool); // Set the school value

      const staffQuery = query(collection(db, "users"), where("school", "==", userSchool), where("role", "in", ["Admin", "Teacher"]));
      const staffSnapshot = await getDocs(staffQuery);
      const staffList = staffSnapshot.docs.map(doc => ({
        value: doc.id,
        label: doc.data().name,
        departmentalPosition: "", // Initialize with an empty string
      }));
      setStaffOptions(staffList);

      const coursesQuery = query(collection(db, "courses"), where("school", "==", userSchool));
      const coursesSnapshot = await getDocs(coursesQuery);
      const coursesList = coursesSnapshot.docs.map(doc => ({
        value: doc.id,
        label: doc.data().name,
      }));
      setCourseOptions(coursesList);

      const departmentsQuery = query(collection(db, "departments"), where("school", "==", userSchool));
      const departmentsSnapshot = await getDocs(departmentsQuery);
      const departmentsList = departmentsSnapshot.docs.map(doc => doc.data());
      setDepartments(departmentsList);
    };

    fetchStaffAndCourses();
  }, [setValue]);

  const onSubmit = async (formData: Inputs) => {
    setLoading(true);
    try {
      const departmentId = `Dept${Date.now()}`;
      const departmentData = {
        name: formData.departmentName,
        staff: formData.staff.map(s => ({ id: s.value, departmentalPosition: s.departmentalPosition })),
        courses: formData.courses.map(c => c.value),
        school: formData.school,
      };

      await setDoc(doc(db, "departments", departmentId), departmentData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000); // Hide success message after 3 seconds

      // Fetch updated departments list
      const departmentsQuery = query(collection(db, "departments"), where("school", "==", formData.school));
      const departmentsSnapshot = await getDocs(departmentsQuery);
      const departmentsList = departmentsSnapshot.docs.map(doc => doc.data());
      setDepartments(departmentsList);
    } catch (error) {
      console.error("Error creating department:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-4 rounded-md flex-1 m-4 mt-10 ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-black'}`}>
      <h1 className="text-lg font-semibold">Departments & Faculties</h1>
      <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
        <InputField
          label="Department/Faculty Name"
          name="departmentName"
          register={register}
          error={errors.departmentName}
          darkMode={darkMode} // Pass darkMode prop
        />
        <input type="hidden" {...register("school")} />
        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">Assign Staff</label>
          {staffFields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2 w-full">
              <Controller
                name={`staff.${index}`}
                control={control}
                render={({ field }) => (
                  <Select<StaffOption>
                    {...field}
                    options={staffOptions}
                    className="basic-single w-full"
                    classNamePrefix="select"
                    placeholder="Select staff"
                    getOptionLabel={(option) => option.label}
                    getOptionValue={(option) => option.value}
                    onChange={(selectedOption) => field.onChange(selectedOption)}
                    value={field.value}
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
              <input
                type="text"
                placeholder="Position"
                className={`p-2 border rounded ${darkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-white text-black border-gray-300'}`}
                {...register(`staff.${index}.departmentalPosition`)}
                list="positionSuggestions"
              />
              <datalist id="positionSuggestions">
                {positionSuggestions.map((suggestion, idx) => (
                  <option key={idx} value={suggestion} />
                ))}
              </datalist>
              <button type="button" onClick={() => removeStaff(index)} className="text-red-500">Remove</button>
            </div>
          ))}
          <button type="button" onClick={() => appendStaff({ value: "", label: "", departmentalPosition: "" })} className="bg-[#018abd] text-white p-2 rounded-md">
            Add Staff
          </button>
          {errors.staff?.message && (
            <p className="text-xs text-red-400">
              {errors.staff.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">Assign Courses</label>
          <Controller
            name="courses"
            control={control}
            render={({ field }) => (
              <Select<CourseOption, true>
                {...field}
                options={courseOptions}
                isMulti
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Select courses"
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => option.value}
                styles={{
                  control: (provided) => ({
                    ...provided,
                    backgroundColor: darkMode ? '#2d3748' : '#fff',
                    color: darkMode ? '#cbd5e0' : '#000',
                  }),
                  menu: (provided) => ({
                    ...provided,
                    backgroundColor: darkMode ? '#2d3748' : '#fff',
                  }),
                  multiValue: (provided) => ({
                    ...provided,
                    backgroundColor: darkMode ? '#4a5568' : '#e2e8f0',
                  }),
                  multiValueLabel: (provided) => ({
                    ...provided,
                    color: darkMode ? '#cbd5e0' : '#000',
                  }),
                }}
              />
            )}
          />
          {errors.courses?.message && (
            <p className="text-xs text-red-400">
              {errors.courses.message.toString()}
            </p>
          )}
        </div>
        <button type="submit" className="bg-[#018abd] text-white p-2 rounded-md" disabled={loading}>
          {loading ? "Creating..." : "Create Department"}
        </button>
      </form>
      {success && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-md shadow-lg">
          Department created successfully!
        </div>
      )}
      <div className="mt-8">
        <h2 className="text-lg font-semibold">Departments List</h2>
        <table className="w-full mt-4 border-collapse">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-800 font-medium">
              <th className="border p-2">Department Name</th>
              <th className="border p-2">Staffs</th>
              <th className="border p-2">Courses</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((department, index) => (
              <tr key={index} className="even:bg-gray-100">
                <td className="border p-2">{department.name}</td>
                <td className="border p-2">
                  {department.staff.map((s: any) => {
                    const staff = staffOptions.find(option => option.value === s.id);
                    return staff ? `${staff.label} (${s.departmentalPosition})` : s.id;
                  }).join(", ")}
                </td>
                <td className="border p-2">
                  {department.courses.map((c: any) => {
                    const course = courseOptions.find(option => option.value === c);
                    return course ? course.label : c;
                  }).join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
      </div>
    </div>
  );
};

export default DepartmentsPage;