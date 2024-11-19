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
import EditTeacherForm, { Inputs } from "@/components/forms/EditTeacherForm";
import { X, UserPen } from 'lucide-react';
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

type Teacher = {
    id: string;
    teacherId: string;
    name: string;
    email?: string;
    photo: string;
    phone: string;
    subjectsTaught: string[]; // Update field name
    classesAssigned: string[]; // Update field name
    address: string;
};

const columns = [
    {
        header: "Info",
        accessor: "info",
    },
    {
        header: "Teacher ID",
        accessor: "teacherId",
        className: "hidden md:table-cell",
    },
    {
        header: "Subjects",
        accessor: "subjectsTaught", // Update field name
        className: "hidden md:table-cell",
    },
    {
        header: "Classes",
        accessor: "classesAssigned", // Update field name
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

const TeacherListPage = () => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const uid = auth.currentUser?.uid;
                if (!uid) {
                    router.push("/signin");
                    return;
                }

                const userDocRef = doc(db, "users", uid);
                const userDoc = await getDoc(userDocRef);
                const userData = userDoc.data();
                const userSchool = userData?.school;
                setUserRole(userData?.role || null);

                const q = query(collection(db, "teachers"), where("school", "==", userSchool));
                const querySnapshot = await getDocs(q);
                const teachersList: Teacher[] = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    subjectsTaught: doc.data().subjectsTaught || [], // Provide default value
                    classesAssigned: doc.data().classesAssigned || [], // Provide default value
                    photo: "https://via.placeholder.com/150" // Placeholder image
                } as Teacher));

                setTeachers(teachersList);
            } catch (error) {
                console.error("Error fetching teachers:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeachers();
    }, [router]);

    const handleEditClick = (teacher: Teacher) => {
        setSelectedTeacher(teacher);
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = (data: Inputs) => {
        // Handle form submission
        console.log("Updated data:", data);
        setIsEditModalOpen(false);
    };

    const renderRow = (item: Teacher) => (
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
                    <p className="text-xs text-gray-500">{item?.email}</p>
                </div>
            </td>
            <td className="hidden md:table-cell">{item.teacherId}</td>
            <td className="hidden md:table-cell">{item.subjectsTaught.join(",")}</td> {/* Update field name */}
            <td className="hidden md:table-cell">{item.classesAssigned.join(",")}</td> {/* Update field name */}
            <td className="hidden md:table-cell">{item.phone}</td>
            <td className="hidden md:table-cell">{item.address}</td>
            <td>
                <div className="flex items-center gap-2">
                    <Link href={`/list/teachers/${item.id}`}>
                        <button 
                        type="button"
                        title={`View ${item.name}`} // Add title for accessibility
                        className="w-7 h-7 flex items-center justify-center rounded-full text-gray-600">
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
                            <FormModal table="teacher" type="delete" id={item.id} />
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
                <h1 className="hidden md:block text-lg font-semibold">All Teachers</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch />
                    <div className="flex items-center gap-4 self-end">
                        <button 
                        type="button"
                        title="Filter"
                        className="w-8 h-8 flex items-center justify-center rounded-full">
                        <IoFilterCircleOutline size={24} />
                        </button>
                        <button
                        type="button"
                        title="Sort"
                         className="w-8 h-8 flex items-center justify-center rounded-full">
                            <Image src="/sort.png" alt="" width={14} height={14} />
                        </button>
                        {userRole === "Admin" && (
                            <FormModal table="teacher" type="create" />
                        )}
                    </div>
                </div>
            </div>
            {/* LIST */}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <Table columns={columns} renderRow={renderRow} data={teachers} />
            )}
            {/* PAGINATION */}
            <Pagination />

            {/* EDIT MODAL */}
            {isEditModalOpen && selectedTeacher && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-md w-full max-w-lg relative">
                        <EditTeacherForm data={selectedTeacher} onSubmit={handleEditSubmit} />
                        <button
                        title="close"
                            type="button"
                            className=" absolute top-2 right-4 text-gray-600"
                            onClick={() => setIsEditModalOpen(false)}
                        >
                           <X />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherListPage;