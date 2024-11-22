import { useState, useEffect } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { FaCalendarAlt, FaCheckCircle } from "react-icons/fa";

const days = ["Mo", "Tu", "We", "Th", "Fr"];
const times = ["8:00", "9:00", "10:00", "11:00", "12:00", "1:00", "2:00", "3:00", "4:00", "5:00"];

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

type ScheduleEntry = {
  day: string;
  time: string;
  course: Subject;
};

type GroupedSchedules = {
  [key: string]: {
    id: string;
    name: string;
    teachers: string[];
    duration: string;
    classAssigned: string;
    school: string;
    level?: string;
    startDate?: string;
    endDate?: string;
    schedule: { day: string; time: string }[];
  };
};

const CustomDropdown: React.FC<{
  title: string;
  options: Subject[];
  value: string;
  onChange: (value: string) => void;
}> = ({ title, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  const selectedOption = options.find(option => option.id === value);

  return (
    <div className="relative">
      <div
        className="p-2 border rounded-md cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption ? selectedOption.name : title}
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full bg-white border rounded-md mt-1">
          {options.map(option => (
            <div
              key={option.id}
              className="p-2 cursor-pointer hover:bg-gray-200"
              onClick={() => handleSelect(option.id)}
            >
              {option.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ScheduleGrid = () => {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [courses, setCourses] = useState<Subject[]>([]);
  const [newSchedule, setNewSchedule] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchSchedules = async () => {
      const querySnapshot = await getDocs(collection(db, "schedules"));
      const schedulesList = querySnapshot.docs.map(doc => doc.data());
      setSchedules(schedulesList);
    };

    const fetchCourses = async () => {
      const querySnapshot = await getDocs(collection(db, "courses"));
      const coursesList: Subject[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Subject[];
      setCourses(coursesList);
    };

    fetchSchedules();
    fetchCourses();
  }, []);

  const handleCourseChange = (day: string, time: string, courseId: string) => {
    setNewSchedule(prevState => ({
      ...prevState,
      [`${day}-${time}`]: courseId,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const scheduleEntries: ScheduleEntry[] = Object.entries(newSchedule).map(([key, courseId]) => {
        const [day, time] = key.split("-");
        const course = courses.find(course => course.id === courseId) as Subject;
        return { day, time, course };
      });

      const groupedSchedules: GroupedSchedules = scheduleEntries.reduce((acc, entry) => {
        const { course } = entry;
        if (!acc[course.id]) {
          acc[course.id] = { ...course, schedule: [] };
        }
        acc[course.id].schedule.push({ day: entry.day, time: entry.time });
        return acc;
      }, {} as GroupedSchedules);

      await Promise.all(Object.values(groupedSchedules).map(schedule => addDoc(collection(db, "schedules"), schedule)));
      setSchedules([...schedules, ...Object.values(groupedSchedules)]);
      setNewSchedule({});
      setSuccess(true);
      setTimeout(() => setSuccess(false), 10000); // Hide success message after 10 seconds
    } catch (error) {
      console.error("Error creating schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  const groupedSchedulesByCurriculum = schedules.reduce((acc: { [key: string]: any[] }, schedule) => {
    const curriculum = schedule.level || "Others";
    if (!acc[curriculum]) {
      acc[curriculum] = [];
    }
    acc[curriculum].push(schedule);
    return acc;
  }, {});

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Course Schedule</h2>
      <form className="mb-4" onSubmit={handleSubmit}>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2">Time</th>
                {days.map(day => (
                  <th key={day} className="border p-2">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {times.map(time => (
                <tr key={time}>
                  <td className="border p-2">{time}</td>
                  {days.map(day => (
                    <td key={day} className="border p-2">
                      <CustomDropdown
                        title="Select Course"
                        options={courses}
                        value={newSchedule[`${day}-${time}`] || ""}
                        onChange={(value) => handleCourseChange(day, time, value)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button type="submit" className="mt-4 bg-[#018abd] text-white p-2 rounded-md" disabled={loading}>
          {loading ? "Saving..." : "Save Schedule"}
        </button>
      </form>

      {success && (
        <div className="mb-4 p-4 text-green-700 bg-green-100 border border-green-700 rounded-md flex items-center gap-2 justify-center">
          <FaCheckCircle size={24} />
          Schedule saved successfully!
        </div>
      )}

      {Object.keys(groupedSchedulesByCurriculum).length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
          <FaCalendarAlt size={56} />
          <p className="text-gray-400 mt-4">No schedules yet.</p>
        </div>
      ) : (
        Object.keys(groupedSchedulesByCurriculum).map(curriculum => (
          <div key={curriculum}>
            <h3 className="text-lg font-semibold mb-2 mt-4">{curriculum}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedSchedulesByCurriculum[curriculum].map((schedule, index) => (
                <div key={index} className="p-4 border rounded-md ">
                  <p><strong>Course:</strong> {schedule.name}</p>
                  <p><strong>Teachers:</strong> {schedule.teachers.join(", ")}</p>
                  <p><strong>Duration:</strong> {schedule.duration}</p>
                  <p><strong>Class Assigned:</strong> {schedule.classAssigned}</p>
                  <p><strong>School:</strong> {schedule.school}</p>
                  {schedule.level && <p><strong>Level:</strong> {schedule.level}</p>}
                  {schedule.startDate && <p><strong>Start Date:</strong> {schedule.startDate}</p>}
                  {schedule.endDate && <p><strong>End Date:</strong> {schedule.endDate}</p>}
                  <div>
                    <strong>Schedule:</strong>
                    <ul>
                      {schedule.schedule.map((entry: { day: string; time: string }, idx: number) => (
                        <li key={idx}>{entry.day} at {entry.time}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ScheduleGrid;