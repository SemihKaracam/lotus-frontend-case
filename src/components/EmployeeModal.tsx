import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AppDispatch } from "../store";
import { addEmployee, updateEmployee } from "../store/employeesSlice";
import type { Employee } from "../types/employee";
import { EmployeeSchema } from "../types/schema";
import type z from "zod";
import { toast } from "react-toastify";


interface Props {
    isOpen: boolean;
    onClose: () => void;
    employee: Employee | null;
}

const defaultValues: Partial<Employee> = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    salary: 0,
    startDate: "",
    teamId: "",
};

const EmployeeModal: React.FC<Props> = ({ isOpen, onClose, employee }) => {
    const dispatch = useDispatch<AppDispatch>();
    const modalRef = useRef<HTMLDivElement>(null);

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<z.infer<typeof EmployeeSchema>>({
        resolver: zodResolver(EmployeeSchema),
        defaultValues: employee || defaultValues,
    });

    useEffect(() => {
        reset(employee || defaultValues);
    }, [employee, reset]);

    const onSubmit = (data: z.infer<typeof EmployeeSchema>) => {
        if (data.id) {
            dispatch(updateEmployee(data));
            toast.info('Çalışan başarıyla düzenlendi!')
        } else {
            dispatch(addEmployee(data));
            toast.success('Çalışan başarıyla kaydedildi!')
        }
        onClose();
    };

    useEffect(() => {
        const handleMousedown = (event: MouseEvent) => {
            // Mouse basıldığı anın hedefi modalın içinde değilse kapat
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleMousedown);
        }

        return () => {
            document.removeEventListener("mousedown", handleMousedown);
        };
    }, [isOpen, onClose]);


    if (!isOpen) return null;

    return (
        // Modal Overlay - Dışarı tıklandığında modalı kapatır.
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-md"
            onClick={onClose}
        >
            <div
                ref={modalRef}
                className="bg-white rounded-lg p-6 w-full max-w-3xl mx-4 my-8 relative transform transition-all shadow-xl dark:bg-gray-800"
                onClick={(e) => e.stopPropagation()}
            >

                {/* Kapatma Butonu */}
                <button
                    onClick={onClose}
                    className="cursor-pointer absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
                    {employee ? "Çalışan Düzenle" : "Yeni Çalışan Ekle"}
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Ad Alanı */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Ad</label>
                            <Controller
                                name="firstName"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        className="mt-2 px-4 py-2 outline-0 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="Ad"
                                    />
                                )}
                            />
                            {errors.firstName && (
                                <span className="text-sm text-red-500">{errors.firstName.message}</span>
                            )}
                        </div>

                        {/* Soyad Alanı */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Soyad</label>
                            <Controller
                                name="lastName"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        className="mt-2 px-4 py-2 outline-0  block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="Soyad"
                                    />
                                )}
                            />
                            {errors.lastName && (
                                <span className="text-sm text-red-500">{errors.lastName.message}</span>
                            )}
                        </div>

                        {/* Email Alanı */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="email"
                                        className="mt-2 px-4 py-2 outline-0  block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="Email"
                                    />
                                )}
                            />
                            {errors.email && (
                                <span className="text-sm text-red-500">{errors.email.message}</span>
                            )}
                        </div>

                        {/* Telefon Alanı */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Telefon</label>
                            <Controller
                                name="phone"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="tel"
                                        className="mt-2 px-4 py-2 outline-0  block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="Telefon"
                                    />
                                )}
                            />
                            {errors.phone && (
                                <span className="text-sm text-red-500">{errors.phone.message}</span>
                            )}
                        </div>

                        {/* Maaş Alanı */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Maaş</label>
                            <Controller
                                name="salary"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="number"
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                        className="mt-2 px-4 py-2 outline-0  block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="Maaş"
                                    />
                                )}
                            />
                            {errors.salary && (
                                <span className="text-sm text-red-500">{errors.salary.message}</span>
                            )}
                        </div>

                        {/* Başlangıç Tarihi Alanı */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Başlangıç Tarihi
                            </label>
                            <Controller
                                name="startDate"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="date"
                                        className="mt-2 px-4 py-2 outline-0  block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                )}
                            />
                            {errors.startDate && (
                                <span className="text-sm text-red-500">{errors.startDate.message}</span>
                            )}
                        </div>

                        {/* Departman Alanı */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Departman</label>
                            <Controller
                                name="department"
                                control={control}
                                render={({ field }) => (
                                    <select
                                        {...field}
                                        className="mt-2 px-4 py-2 outline-0  block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="">Seçiniz...</option>
                                        <option value="İnsan Kaynakları">İnsan Kaynakları</option>
                                        <option value="Finans">Finans</option>
                                        <option value="Pazarlama">Pazarlama</option>
                                        <option value="Satış">Satış</option>
                                        <option value="Ar-Ge">Ar-Ge</option>
                                        <option value="IT">IT</option>
                                    </select>
                                )}
                            />
                            {errors.department && (
                                <span className="text-sm text-red-500">{errors.department.message}</span>
                            )}
                        </div>

                        {/* Pozisyon Alanı */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Pozisyon</label>
                            <Controller
                                name="position"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        className="mt-2 px-4 py-2 outline-0  block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="Pozisyon"
                                    />
                                )}
                            />
                            {errors.position && (
                                <span className="text-sm text-red-500">{errors.position.message}</span>
                            )}
                        </div>

                    </div>
                    {/* Form butonları */}
                    <div className="flex justify-between w-full space-x-2 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                        >
                            Kaydet
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmployeeModal;






