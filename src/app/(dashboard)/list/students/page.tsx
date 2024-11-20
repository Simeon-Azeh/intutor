"use client";

import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { auth, db } from "@/firebase/firebaseConfig";
import Image from "next/image";
import Link from "next/link";
import { IoFilterCircleOutline } from "react-icons/io5";
import { LuEye } from "react-icons/lu";
import { useState, useEffect } from "react";
import EditStudentForm, { Inputs } from "@/components/forms/EditStudentForm";
import StudentForm from "@/components/forms/StudentForm";
import { X, UserPen, UserX, Plus } from 'lucide-react';
import { collection, query, where, getDocs, doc, getDoc, deleteDoc, limit, startAfter, QueryDocumentSnapshot } from "firebase/firestore";

type Student = {
  id: string;
  studentId: string;
  name: string;
  email?: string;
  photo: string;
  phone?: string;
  level: number;
  classAssigned: string;
  address: string;
};

const columns = [
  {
    header: "Info",
    accessor: "info",
  },
  {
    header: "Student ID",
    accessor: "studentId",
    className: "hidden md:table-cell",
  },
  {
    header: "Level",
    accessor: "level",
    className: "hidden md:table-cell",
  },
  {
    header: "Phone",
    accessor: "phone",
    className: "hidden lg:table-cell",
  },
  {
    header: "Address",
    accessor: "address",
    className: "hidden lg:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const StudentListPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchStudents = async (page: number) => {
    setLoading(true);
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
      setUserRole(userData?.role || null);

      let q = query(collection(db, "students"), where("school", "==", userSchool), limit(5));
      if (page > 1 && lastDoc) {
        q = query(collection(db, "students"), where("school", "==", userSchool), startAfter(lastDoc), limit(5));
      }

      const querySnapshot = await getDocs(q);
      const studentsList: Student[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        photo: doc.data().photo || "https://via.placeholder.com/150",
      } as Student));

      setStudents(studentsList);
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1] || null);

      // Calculate total pages
      const totalStudentsQuery = query(collection(db, "students"), where("school", "==", userSchool));
      const totalStudentsSnapshot = await getDocs(totalStudentsQuery);
      const totalStudents = totalStudentsSnapshot.size;
      setTotalPages(Math.ceil(totalStudents / 5));
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(currentPage);
  }, [currentPage]);

  const handleEditClick = (student: Student) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (data: Inputs) => {
    // Handle form submission
    console.log("Updated data:", data);
    setIsEditModalOpen(false);
  };

  const handleDeleteClick = (student: Student) => {
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (studentToDelete) {
      try {
        await deleteDoc(doc(db, "students", studentToDelete.id));
        console.log(`Deleted student with id: ${studentToDelete.id}`);

        setStudents(students.filter(student => student.id !== studentToDelete.id));
        setIsDeleteModalOpen(false);
        setStudentToDelete(null);
      } catch (error) {
        console.error("Error deleting student:", error);
      }
    }
  };

  const renderRow = (item: Student) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-orange-50"
    >
      <td className="flex items-center gap-4 p-4">
        <Image
          src={item.photo}
          alt=""
          width={40}
          height={40}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">{item.classAssigned}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.studentId}</td>
      <td className="hidden md:table-cell">{item.level}</td>
      <td className="hidden md:table-cell">{item.phone}</td>
      <td className="hidden md:table-cell">{item.address}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/students/${item.id}`}>
            <button 
            type="button"
            title={`View ${item.name}`} // Add title for accessibility
            className="w-7 h-7 flex items-center justify-center rounded-full bg-yellow-50 text='#333">
              <LuEye size={18} />
            </button>
          </Link>
          {userRole === "Admin" && (
            <>
              <button 
                type="button"
                title={`Edit ${item.name}`} // Add title for accessibility
                className="w-7 h-7 flex items-center justify-center rounded-full text-gray-700"
                onClick={() => handleEditClick(item)}
              >
                <UserPen size={18} />
              </button>
              <button 
                type="button"
                title={`Delete ${item.name}`} // Add title for accessibility
                className="w-7 h-7 flex items-center justify-center rounded-full text-red-600"
                onClick={() => handleDeleteClick(item)}
              >
                <UserX size={18} />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-2">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Students</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button 
              type="button"
              title="Filter"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-50"
            >
              <IoFilterCircleOutline size={24} />
            </button>
            <button
              type="button"
              title="Sort"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-50"
            >
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {userRole === "Admin" && (
              <button
                type="button"
                title="Add Student"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-50"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Plus size={24} />
              </button>
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      {loading ? (
        <p>Loading...</p>
      ) : students.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-gray-400 mt-4">No students found.</p>
        </div>
      ) : (
        <Table columns={columns} renderRow={renderRow} data={students} />
      )}
      {/* PAGINATION */}
      <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />

      {/* CREATE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-md w-full max-w-lg relative">
            <StudentForm type="create" onClose={() => setIsCreateModalOpen(false)} />
            <button
              title="Close"
              type="button"
              className="absolute top-2 right-4 text-gray-600"
              onClick={() => setIsCreateModalOpen(false)}
            >
              <X />
            </button>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-md w-full max-w-lg relative">
            <EditStudentForm data={selectedStudent} onSubmit={handleEditSubmit} />
            <button
              title="Close"
              type="button"
              className="absolute top-2 right-4 text-gray-600"
              onClick={() => setIsEditModalOpen(false)}
            >
              <X />
            </button>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && studentToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-md w-full max-w-lg relative">
            <p className="text-center font-medium">Are you sure you want to delete {studentToDelete.name}?</p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                type="button"
                className="bg-red-600 text-white py-2 px-4 rounded-md"
                onClick={handleDeleteConfirm}
              >
                Delete
              </button>
              <button
                type="button"
                className="bg-gray-600 text-white py-2 px-4 rounded-md"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
            </div>
            <button
              title="Close"
              type="button"
              className="absolute top-2 right-4 text-gray-600"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              <X />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentListPage;