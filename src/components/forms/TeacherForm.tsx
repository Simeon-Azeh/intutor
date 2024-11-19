"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useState } from 'react';
import InputField from "../InputField";
import { UserRoundPen, UserRound } from 'lucide-react';

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
    subjectsTaught: z.array(z.string()).min(1, { message: "At least one subject must be selected!" }),
    classesAssigned: z.array(z.string()).min(1, { message: "At least one class must be selected!" }),
});

type Inputs = z.infer<typeof schema>;

const subjects = [
    "Mathematics",
    "Science",
    "History",
    "Geography",
    "English",
    "Physical Education",
    "Art",
    "Music"
];

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

interface TeacherFormProps {
    data: Partial<Inputs>;
    type: "create" | "update";
}

const TeacherForm: React.FC<TeacherFormProps> = ({ data, type }) => {
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
            subjectsTaught: data?.subjectsTaught || [],
            classesAssigned: data?.classesAssigned || []
        }
    });

    const [selectedSubjects, setSelectedSubjects] = useState<string[]>(data?.subjectsTaught || []);
    const [selectedClasses, setSelectedClasses] = useState<string[]>(data?.classesAssigned || []);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const handleSubjectClick = (subject: string) => {
        let updatedSubjects;
        if (selectedSubjects.includes(subject)) {
            updatedSubjects = selectedSubjects.filter(s => s !== subject);
        } else {
            updatedSubjects = [...selectedSubjects, subject];
        }
        setSelectedSubjects(updatedSubjects);
        setValue("subjectsTaught", updatedSubjects);
    };

    const handleClassClick = (className: string) => {
        let updatedClasses;
        if (selectedClasses.includes(className)) {
            updatedClasses = selectedClasses.filter(c => c !== className);
        } else {
            updatedClasses = [...selectedClasses, className];
        }
        setSelectedClasses(updatedClasses);
        setValue("classesAssigned", updatedClasses);
    };

    const onSubmit = async (formData: Inputs) => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/create-teacher', { // Replace with your server URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            if (!response.ok) {
                throw new Error('Failed to create teacher');
            }
    
            // Handle success (e.g., show a success message, redirect, etc.)
            console.log('Teacher created successfully');
        } catch (error) {
            console.error('Error creating teacher:', error);
            // Handle error (e.g., show an error message)
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    return (
        <form className="flex flex-col gap-8 overflow-y-auto overflow-x-hidden" onSubmit={handleSubmit(onSubmit)}>
            {step === 1 && (
                <>
                    <h1 className="text-xl font-semibold">Create a new teacher</h1>
                    <span className="text-base text-gray-600 font-medium flex items-center gap-2">
                    <UserRoundPen size={20}/>
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
                    <UserRound size={20}/>  Personal Information
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
                    </div>
                    <div className="flex justify-between">
                        <button type="button" onClick={prevStep} className="border  text-gray-600 p-2 px-4 rounded-md">
                            Previous
                        </button>
                        <button type="button" onClick={nextStep} className="bg-[#018abd] text-white p-2 px-4 rounded-md">
                            Next
                        </button>
                    </div>
                </>
            )}
            {step === 3 && (
                <>
                    <div className="flex flex-col gap-2 w-full">
                        <label className="text-base text-gray-600 font-medium">Subjects Taught</label>
                        <div className="flex flex-wrap gap-2">
                            {subjects.map((subject) => (
                                <div
                                    key={subject}
                                    className={`p-2 border rounded-md cursor-pointer ${selectedSubjects.includes(subject) ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                    onClick={() => handleSubjectClick(subject)}
                                >
                                    {subject}
                                </div>
                            ))}
                        </div>
                        {errors.subjectsTaught && (
                            <p className="text-xs text-red-400">
                                {errors.subjectsTaught.message}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                        <label className="text-base text-gray-600 font-medium">Assign to Class</label>
                        <div className="flex flex-wrap gap-2">
                            {classes.map((className) => (
                                <div
                                    key={className}
                                    className={`p-2 border rounded-md cursor-pointer ${selectedClasses.includes(className) ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                    onClick={() => handleClassClick(className)}
                                >
                                    {className}
                                </div>
                            ))}
                        </div>
                        {errors.classesAssigned && (
                            <p className="text-xs text-red-400">
                                {errors.classesAssigned.message}
                            </p>
                        )}
                    </div>
                    <div className="flex justify-between">
                        <button type="button" onClick={prevStep} className="bg-gray-500 text-white p-2 rounded-md">
                            Previous
                        </button>
                        <button type="submit" className="bg-[#018abd] text-white p-2 rounded-md" disabled={loading}>
                            {loading ? "Creating..." : (type === "create" ? "Create" : "Update")}
                        </button>
                    </div>
                </>
            )}
        </form>
    );
};

export default TeacherForm;