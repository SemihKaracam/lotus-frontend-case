// import React, { useState, useMemo } from "react";
// import type { Employee } from "../types/employee";
// import { ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react';
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";

// interface Props {
//   employees: Employee[];
//   onEdit: (employee: Employee) => void;
//   onDelete: (employeeId: string) => void;
// }

// const EmployeeTable: React.FC<Props> = ({ employees, onEdit, onDelete }) => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [sortKey, setSortKey] = useState<keyof Employee | null>(null);
//   const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterDepartment, setFilterDepartment] = useState("all");

//   // Departmanları benzersiz olarak listeleme
//   const uniqueDepartments = useMemo(() => {
//     const departments = employees.map(e => e.department);
//     return [...new Set(departments)];
//   }, [employees]);

//   // Arama ve filtreleme işlemleri
//   const filteredAndSortedEmployees = useMemo(() => {
//     let filtered = employees;
//     if (filterDepartment !== "all") {
//       filtered = filtered.filter(emp => emp.department === filterDepartment);
//     }
//     if (searchTerm) {
//       filtered = filtered.filter(emp =>
//         emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         emp.email.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     if (sortKey) {
//       filtered.sort((a, b) => {
//         const aValue = a[sortKey];
//         const bValue = b[sortKey];
//         if (typeof aValue === 'string' && typeof bValue === 'string') {
//           return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
//         }
//         if (typeof aValue === 'number' && typeof bValue === 'number') {
//           return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
//         }
//         return 0;
//       });
//     }

//     return filtered;
//   }, [employees, filterDepartment, searchTerm, sortKey, sortOrder]);

//   // Sayfalama işlemleri
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredAndSortedEmployees.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredAndSortedEmployees.length / itemsPerPage);

//   const handleSort = (key: keyof Employee) => {
//     if (sortKey === key) {
//       setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortKey(key);
//       setSortOrder('asc');
//     }
//   };

//   const renderSortIcon = (key: keyof Employee) => {
//     if (sortKey !== key) return null;
//     return sortOrder === 'asc' ? '▲' : '▼';
//   };

//   // Excel export fonksiyonu
//   const exportToExcel = () => {
//     const dataToExport = filteredAndSortedEmployees.map(emp => ({
//       "Ad Soyad": `${emp.firstName} ${emp.lastName}`,
//       "Departman": emp.department,
//       "Maaş": emp.salary,
//       "Email": emp.email,
//       "Telefon": emp.phone,
//       "Başlangıç Tarihi": emp.startDate,
//       "Durum": emp.status,
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(dataToExport);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");

//     const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
//     const data = new Blob([excelBuffer], { type: "application/octet-stream" });
//     saveAs(data, "employees.xlsx");
//   };

//   return (
//     <div className="p-4 bg-white rounded-lg shadow-md">
//       <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0">
//         {/* Export Butonu */}
//         <button
//           onClick={exportToExcel}
//           className="cursor-pointer bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
//         >
//           Excel’e Aktar
//         </button>

//         {/* Arama Kutusu */}
//         <input
//           type="text"
//           placeholder="Çalışan ara..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full focus:outline-0 md:w-1/3 px-4 py-2 border rounded-md border-indigo-400"
//         />

//         {/* Filtreleme */}
//         <select
//           value={filterDepartment}
//           onChange={(e) => setFilterDepartment(e.target.value)}
//           className="cursor-pointer text-gray-500 w-full md:w-1/4 px-4 py-2 border rounded-md border-indigo-500 focus:outline-0"
//         >
//           <option value="all">Tüm Departmanlar</option>
//           {uniqueDepartments.map(dept => (
//             <option key={dept} value={dept}>{dept}</option>
//           ))}
//         </select>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white rounded-md">
//           <thead>
//             <tr className="bg-indigo-400 text-white uppercase text-sm leading-normal">
//               <th
//                 className="w-[35%] rounded-l-xl py-3 px-6 border-r border-gray-300 text-left cursor-pointer"
//                 onClick={() => handleSort('firstName')}
//               >
//                 Ad Soyad {renderSortIcon('firstName')}
//               </th>
//               <th
//                 className="w-[25%] py-3 px-6 border-r border-gray-300 text-left cursor-pointer"
//                 onClick={() => handleSort('department')}
//               >
//                 Departman {renderSortIcon('department')}
//               </th>
//               <th
//                 className="w-[20%] py-3 px-6 border-r border-gray-300 text-left cursor-pointer"
//                 onClick={() => handleSort('salary')}
//               >
//                 Maaş {renderSortIcon('salary')}
//               </th>
//               <th className="w-[20%] py-3 px-6 rounded-r-xl text-left">İşlemler</th>
//             </tr>
//           </thead>
//           <tbody className="text-gray-600 text-sm font-light">
//             {currentItems.length > 0 ? (
//               currentItems.map((employee) => (
//                 <tr key={employee.id} className="border-b border-gray-200 hover:bg-indigo-200">
//                   <td className="py-3 px-6 text-left whitespace-nowrap">{`${employee.firstName} ${employee.lastName}`}</td>
//                   <td className="py-3 px-6 text-left">{employee.department}</td>
//                   <td className="py-3 px-6 text-left">{employee.salary} TL</td>
//                   <td className="py-3 px-6 text-left">
//                     <button
//                       onClick={() => onEdit(employee)}
//                       className="mr-3 cursor-pointer text-blue-500 hover:text-blue-700"
//                     >
//                       <Pencil className="w-5 h-5" />
//                     </button>
//                     <button
//                       onClick={() => {
//                         onDelete(employee.id)
//                       }}
//                       className="text-red-500 cursor-pointer hover:text-red-700"
//                     >
//                       <Trash2 className="w-5 h-5" />
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={4} className="text-center py-4">Çalışan bulunamadı.</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Sayfalama ve satır sayısı kontrolleri */}
//       <div className="flex flex-col md:flex-row justify-between items-center mt-4 space-y-2 md:space-y-0">
//         <div className="text-sm text-gray-600">
//           Toplam {filteredAndSortedEmployees.length} çalışandan
//           sayfa başına {itemsPerPage} kayıt gösteriliyor.
//         </div>
//         <div className="flex items-center space-x-2">
//           <label className="text-sm text-gray-600">Satır Sayısı:</label>
//           <select
//             value={itemsPerPage}
//             onChange={(e) => {
//               setItemsPerPage(Number(e.target.value));
//               setCurrentPage(1);
//             }}
//             className="focus:outline-0 border rounded-md p-2 text-sm"
//           >
//             <option value={10}>10</option>
//             <option value={20}>20</option>
//             <option value={50}>50</option>
//           </select>
//         </div>
//         <div className="flex items-center space-x-2">
//           {/* Önceki Sayfa Butonu (Sol ok) */}
//           <button
//             onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//             disabled={currentPage === 1}
//             className={`p-2 cursor-pointer border rounded-full text-sm transition-colors duration-200
//           ${currentPage === 1
//                 ? 'bg-indigo-400 text-gray-400 cursor-not-allowed'
//                 : 'bg-indigo-400 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
//               }`}
//           >
//             <ChevronLeft className="w-5 h-5 text-white" />
//           </button>

//           {/* Sayfa Bilgisi */}
//           <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//             {currentPage} / {totalPages}
//           </span>

//           {/* Sonraki Sayfa Butonu (Sağ ok) */}
//           <button
//             onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//             disabled={currentPage === totalPages}
//             className={`p-2 cursor-pointer border rounded-full text-sm transition-colors duration-200
//           ${currentPage === totalPages
//                 ? 'bg-indigo-400 text-gray-400 cursor-not-allowed'
//                 : 'bg-indigo-400 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
//               }`}
//           >
//             <ChevronRight className="w-5 h-5 text-white" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmployeeTable;





















import React, { useState, useMemo } from "react";
import type { Employee } from "../types/employee";
import { ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface Props {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employeeId: string) => void;
}

const EmployeeTable: React.FC<Props> = ({ employees, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortKey, setSortKey] = useState<keyof Employee | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");

  // Departmanları benzersiz olarak listeleme
  const uniqueDepartments = useMemo(() => {
    const departments = employees.map(e => e.department);
    return [...new Set(departments)];
  }, [employees]);

  // Arama ve filtreleme işlemleri
  const filteredAndSortedEmployees = useMemo(() => {
    // 1. Kopya al
    let filtered = [...employees];

    // 2. Departman filtrele
    if (filterDepartment !== "all") {
      filtered = filtered.filter(emp => emp.department === filterDepartment);
    }

    // 3. Arama filtrele
    if (searchTerm) {
      filtered = filtered.filter(emp =>
        emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 4. Sıralama (sort)
    if (sortKey) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortKey];
        const bValue = b[sortKey];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        }
        return 0;
      });
    }

    return filtered;
  }, [employees, filterDepartment, searchTerm, sortKey, sortOrder]);

  // Sayfalama işlemleri
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAndSortedEmployees.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAndSortedEmployees.length / itemsPerPage);

  const handleSort = (key: keyof Employee) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const renderSortIcon = (key: keyof Employee) => {
    if (sortKey !== key) return null;
    return sortOrder === 'asc' ? '▲' : '▼';
  };

  // Excel export fonksiyonu
  const exportToExcel = () => {
    const dataToExport = filteredAndSortedEmployees.map(emp => ({
      "Ad Soyad": `${emp.firstName} ${emp.lastName}`,
      "Departman": emp.department,
      "Maaş": emp.salary,
      "Email": emp.email,
      "Telefon": emp.phone,
      "Başlangıç Tarihi": emp.startDate,
      "Durum": emp.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "employees.xlsx");
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0">
        {/* Export Butonu */}
        <button
          onClick={exportToExcel}
          className="cursor-pointer bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
        >
          Excel’e Aktar
        </button>

        {/* Arama Kutusu */}
        <input
          type="text"
          placeholder="Çalışan ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full focus:outline-0 md:w-1/3 px-4 py-2 border rounded-md border-indigo-400"
        />

        {/* Filtreleme */}
        <select
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className="cursor-pointer text-gray-500 w-full md:w-1/4 px-4 py-2 border rounded-md border-indigo-500 focus:outline-0"
        >
          <option value="all">Tüm Departmanlar</option>
          {uniqueDepartments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-md">
          <thead>
            <tr className="bg-indigo-400 text-white uppercase text-sm leading-normal">
              <th
                className="w-[35%] rounded-l-xl py-3 px-6 border-r border-gray-300 text-left cursor-pointer"
                onClick={() => handleSort('firstName')}
              >
                Ad Soyad {renderSortIcon('firstName')}
              </th>
              <th
                className="w-[25%] py-3 px-6 border-r border-gray-300 text-left cursor-pointer"
                onClick={() => handleSort('department')}
              >
                Departman {renderSortIcon('department')}
              </th>
              <th
                className="w-[20%] py-3 px-6 border-r border-gray-300 text-left cursor-pointer"
                onClick={() => handleSort('salary')}
              >
                Maaş {renderSortIcon('salary')}
              </th>
              <th className="w-[20%] py-3 px-6 rounded-r-xl text-left">İşlemler</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {currentItems.length > 0 ? (
              currentItems.map((employee) => (
                <tr key={employee.id} className="border-b border-gray-200 hover:bg-indigo-200">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{`${employee.firstName} ${employee.lastName}`}</td>
                  <td className="py-3 px-6 text-left">{employee.department}</td>
                  <td className="py-3 px-6 text-left">{employee.salary} TL</td>
                  <td className="py-3 px-6 text-left">
                    <button
                      onClick={() => onEdit(employee)}
                      className="mr-3 cursor-pointer text-blue-500 hover:text-blue-700"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onDelete(employee.id)}
                      className="text-red-500 cursor-pointer hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4">Çalışan bulunamadı.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Sayfalama ve satır sayısı kontrolleri */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-4 space-y-2 md:space-y-0">
        <div className="text-sm text-gray-600">
          Toplam {filteredAndSortedEmployees.length} çalışandan
          sayfa başına {itemsPerPage} kayıt gösteriliyor.
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">Satır Sayısı:</label>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="focus:outline-0 border rounded-md p-2 text-sm"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          {/* Önceki Sayfa Butonu */}
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`p-2 cursor-pointer border rounded-full text-sm transition-colors duration-200
              ${currentPage === 1
                ? 'bg-indigo-400 text-gray-400 cursor-not-allowed'
                : 'bg-indigo-400 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
              }`}
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>

          {/* Sayfa Bilgisi */}
          <span className="text-sm font-medium text-gray-700">
            {currentPage} / {totalPages}
          </span>

          {/* Sonraki Sayfa Butonu */}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`p-2 cursor-pointer border rounded-full text-sm transition-colors duration-200
              ${currentPage === totalPages
                ? 'bg-indigo-400 text-gray-400 cursor-not-allowed'
                : 'bg-indigo-400 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
              }`}
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTable;
