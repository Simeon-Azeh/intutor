"use client";

import { useState, useEffect } from "react";
import { collection, query, where, getDocs, doc, getDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebaseConfig";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import { IoFilterCircleOutline } from "react-icons/io5";
import { LuEye } from "react-icons/lu";
import { X, UserPen, UserX, Plus, UserRoundX } from 'lucide-react';
import ParentsForm from "@/components/forms/ParentsForm";

type Parent = {
  id: string;
  name: string;
  email?: string;
  students: string[];
  phone: string;
  address: string;
};

const columns = [
  {
    header: "Info",
    accessor: "info",
  },
  {
    header: "Student Names",
    accessor: "students",
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

const ParentListPage = () => {
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [parentToDelete, setParentToDelete] = useState<Parent | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    const fetchParents = async () => {
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

        const q = query(collection(db, "users"), where("role", "==", "Parent"), where("school", "==", userSchool));
        const querySnapshot = await getDocs(q);
        const parentsList: Parent[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as Parent));

        setParents(parentsList);
      } catch (error) {
        console.error("Error fetching parents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchParents();
  }, []);

  const handleEditClick = (parent: Parent) => {
    setSelectedParent(parent);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (data: any) => {
    // Handle form submission
    console.log("Updated data:", data);
    setIsEditModalOpen(false);
  };

  const handleDeleteClick = (parent: Parent) => {
    setParentToDelete(parent);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (parentToDelete) {
      try {
        await deleteDoc(doc(db, "users", parentToDelete.id));
        console.log(`Deleted parent with id: ${parentToDelete.id}`);

        setParents(parents.filter(parent => parent.id !== parentToDelete.id));
        setIsDeleteModalOpen(false);
        setParentToDelete(null);
      } catch (error) {
        console.error("Error deleting parent:", error);
      }
    }
  };

  const renderRow = (item: Parent) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">{item?.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.students.join(",")}</td>
      <td className="hidden md:table-cell">{item.phone}</td>
      <td className="hidden md:table-cell">{item.address}</td>
      <td>
        <div className="flex items-center gap-2">
          <button 
            type="button"
            title={`View ${item.name}`} // Add title for accessibility
            className="w-7 h-7 flex items-center justify-center rounded-full text-gray-700"
          >
            <LuEye size={18} />
          </button>
          {userRole === "admin" && (
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
        <h1 className="hidden md:block text-lg font-semibold">All Parents</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button 
              type="button"
              title="Filter"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#f9f3ff]"
            >
              <IoFilterCircleOutline size={24} />
            </button>
            <button
              type="button"
              title="Sort"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#f9f3ff]"
            >
              <Image src="/sort.png" alt="Sort" width={14} height={14} />
            </button>
            {userRole === "Admin" && (
              <button
                type="button"
                title="Add Teacher"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#018abd] text-white"
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
      ) : parents.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
         <UserRoundX size={56} />
          <p className="text-gray-400 mt-4">No parents registered.</p>
        </div>
      ) : (
        <Table columns={columns} renderRow={renderRow} data={parents} />
      )}
      {/* PAGINATION */}
      <Pagination currentPage={1} setCurrentPage={() => {}} totalPages={1} />

      {/* CREATE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-md w-full max-w-lg relative">
            <ParentsForm type="create" />
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
      {isEditModalOpen && selectedParent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-md w-full max-w-lg relative">
            <ParentsForm type="update" data={selectedParent} />
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
      {isDeleteModalOpen && parentToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-md w-full max-w-lg relative">
            <p className="text-center font-medium">Are you sure you want to delete {parentToDelete.name}?</p>
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

export default ParentListPage;