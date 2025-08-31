import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { fetchEmployees, removeEmployee } from '../store/employeesSlice';
import EmployeeTable from '../components/EmployeeTable';
import EmployeeModal from '../components/EmployeeModal';
import type { Employee } from '../types/employee';
import { toast } from "react-toastify";


const Employees: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: employees, status } = useSelector((state: RootState) => state.employees);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchEmployees());
      console.log(employees)
    }
  }, [dispatch, status]);

  const handleAddClick = () => {
    setCurrentEmployee(null); 
    setIsModalOpen(true);
  };

  const handleEditClick = (employee: Employee) => {
    setCurrentEmployee(employee);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (employeeId: string) => {
    dispatch(removeEmployee(employeeId));
    toast.success('Çalışan başarıyla silindi!')
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen p-6 font-sans flex items-center justify-center">
        <div className="flex flex-col items-center">
          {/* Spinner */}
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <h2 className="text-xl font-semibold">Veriler yükleniyor...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-indigo-600 text-2xl font-bold text-center w-[100%]">Çalışanlar Listesi</h1>
        <button
          onClick={handleAddClick}
          className="flex-shrink-0 cursor-pointer bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition-colors"
        >
          Çalışan Ekle
        </button>
      </div>
      <EmployeeTable
        /* @ts-ignore */
        employees={employees}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />
      {isModalOpen && (
        <EmployeeModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          employee={currentEmployee}
        />
      )}
    </div>
  );
};

export default Employees;