"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useState, useEffect } from 'react';
import InputField from "../InputField";
import { UserRoundPen, UserRound } from 'lucide-react';
import { auth, db } from "../../firebase/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import Link from "next/link";

const schema = z.object({
    username: z
        .string()
        .min(3, { message: "Username must be at least 3 characters long!" })
        .max(20, { message: "Username must be at most 20 characters long!" }),
    email: z.string().email({ message: "Invalid email address!" }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long!" }),
    firstName: z.string().min(1, { message: "First name is required!" }),
    lastName: z.string().min(1, { message: "Last name is required!" }),
    phone: z.string().min(1, { message: "Phone is required!" }),
    address: z.string().min(1, { message: "Address is required!" }),
    emergencyContact: z.string().min(1, { message: "Emergency contact is required!" }),
    birthday: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Birthday is required!" }),
    sex: z.enum(["male", "female"], { message: "Sex is required!" }),
    classAssigned: z.string().min(1, { message: "Class is required!" }),
});

type Inputs = z.infer<typeof schema>;

const classes = [
    "Class 1",
    "Class 2",
    "Class 3",
    "Class 4",
    "Class 5",
    "Class 6",
    "Class 7",
    "Class 8"
];

interface StudentFormProps {
    data?: Partial<Inputs>;
    type: "create" | "update";
    onClose: () => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ data = {}, type, onClose }) => {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm<Inputs>({
        resolver: zodResolver(schema),
        defaultValues: {
            username: data?.username || '',
            email: data?.email || '',
            password: data?.password || '',
            firstName: data?.firstName || '',
            lastName: data?.lastName || '',
            phone: data?.phone || '',
            address: data?.address || '',
            emergencyContact: data?.emergencyContact || '',
            birthday: data?.birthday ? new Date(data.birthday).toISOString().split('T')[0] : '',
            sex: data?.sex || 'male',
            classAssigned: data?.classAssigned || '',
        }
    });

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [school, setSchool] = useState<string | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        const fetchSchool = async () => {
            const uid = auth.currentUser?.uid;
            if (!uid) {
                console.error("No user is logged in");
                return;
            }

            const userDocRef = doc(db, "users", uid);
            const userDoc = await getDoc(userDocRef);
            if (!userDoc.exists()) {
                console.error("User document not found");
                return;
            }

            const userData = userDoc.data();
            setSchool(userData?.school || null);
        };

        fetchSchool();
    }, []);

    const onSubmit = async (formData: Inputs) => {
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;

            const studentId = `Stu${Date.now()}`;

            const studentData = {
                name: formData.username,
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                address: formData.address,
                emergencyContact: formData.emergencyContact,
                birthday: formData.birthday,
                sex: formData.sex,
                school: school,
                studentId: studentId,
                grade: "", // Grade will be updated by something else
                classAssigned: formData.classAssigned,
            };

            await setDoc(doc(db, "students", user.uid), studentData);
            await setDoc(doc(db, "users", user.uid), { ...studentData, role: "Student" });

            setShowSuccessModal(true);
        } catch (error) {
            console.error('Error creating student:', error);
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    return (
        <>
            <form className="flex flex-col gap-8 overflow-y-auto overflow-x-hidden" onSubmit={handleSubmit(onSubmit)}>
                {step === 1 && (
                    <>
                        <h1 className="text-xl font-semibold">Create a new student</h1>
                        <span className="text-base text-gray-600 font-medium flex items-center gap-2">
                            <UserRoundPen size={20} />
                            Authentication Information
                        </span>
                        <div className="flex justify-between flex-wrap gap-4">
                            <InputField
                                label="Username"
                                name="username"
                                defaultValue={data?.username}
                                register={register}
                                error={errors?.username}
                            />
                            <InputField
                                label="Email"
                                name="email"
                                defaultValue={data?.email}
                                register={register}
                                error={errors?.email}
                            />
                            <InputField
                                label="Password"
                                name="password"
                                type="password"
                                defaultValue={data?.password}
                                register={register}
                                error={errors?.password}
                            />
                        </div>
                        <button type="button" onClick={nextStep} className="bg-[#018abd] text-white p-2 rounded-md">
                            Next
                        </button>
                    </>
                )}
                {step === 2 && (
                    <>
                        <span className="text-base text-gray-600 font-medium flex items-center gap-2">
                            <UserRound size={20} />  Personal Information
                        </span>
                        <div className="flex justify-between flex-wrap gap-4">
                            <InputField
                                label="First Name"
                                name="firstName"
                                defaultValue={data?.firstName}
                                register={register}
                                error={errors.firstName}
                            />
                            <InputField
                                label="Last Name"
                                name="lastName"
                                defaultValue={data?.lastName}
                                register={register}
                                error={errors.lastName}
                            />
                            <InputField
                                label="Phone"
                                name="phone"
                                defaultValue={data?.phone}
                                register={register}
                                error={errors.phone}
                            />
                            <InputField
                                label="Address"
                                name="address"
                                defaultValue={data?.address}
                                register={register}
                                error={errors.address}
                            />
                            <InputField
                                label="Emergency Contact"
                                name="emergencyContact"
                                defaultValue={data?.emergencyContact}
                                register={register}
                                error={errors.emergencyContact}
                            />
                            <InputField
                                label="Birthday"
                                name="birthday"
                                defaultValue={data?.birthday ? new Date(data.birthday).toISOString().split('T')[0] : ''}
                                register={register}
                                error={errors.birthday}
                                type="date"
                            />
                            <div className="flex flex-col gap-2 w-full md:w-1/4">
                                <label className="text-xs text-gray-500">Sex</label>
                                <select
                                    className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full outline-none"
                                    {...register("sex")}
                                    defaultValue={data?.sex || 'male'}
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                                {errors.sex?.message && (
                                    <p className="text-xs text-red-400">
                                        {errors.sex.message.toString()}
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col gap-2 w-full md:w-1/4">
                                <label className="text-xs text-gray-500">Class Assigned</label>
                                <select
                                    className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full outline-none"
                                    {...register("classAssigned")}
                                    defaultValue={data?.classAssigned || ''}
                                >
                                    <option value="">Select Class</option>
                                    {classes.map((className) => (
                                        <option key={className} value={className}>{className}</option>
                                    ))}
                                </select>
                                {errors.classAssigned?.message && (
                                    <p className="text-xs text-red-400">
                                        {errors.classAssigned.message.toString()}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <button type="button" onClick={prevStep} className="border  text-gray-600 p-2 px-4 rounded-md">
                                Previous
                            </button>
                            <button type="submit" className="bg-[#018abd] text-white p-2 rounded-md" disabled={loading}>
                                {loading ? "Creating..." : (type === "create" ? "Create" : "Update")}
                            </button>
                        </div>
                    </>
                )}
            </form>

            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                        <h2 className="text-xl font-semibold mb-4">Student Created Successfully</h2>
                        <Link href="/admin">
                            <button className="bg-[#018abd] text-white px-4 py-2 rounded-md">
                                Done
                            </button>
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
};

export default StudentForm;