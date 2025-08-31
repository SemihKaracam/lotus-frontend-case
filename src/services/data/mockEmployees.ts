// src/services/data/mockEmployees.ts

import { type Employee } from "../../types/employee";
import { v4 as uuidv4 } from "uuid";

// Sabit listeler
const firstNames = ["Ali", "Ayşe", "Mehmet", "Fatma", "Ahmet", "Zeynep", "Mustafa", "Elif"];
const lastNames = ["Yılmaz", "Kaya", "Demir", "Çelik", "Şahin", "Öztürk", "Yıldırım", "Aydın"];
const departments = ["İnsan Kaynakları", "Finans", "Pazarlama", "Satış", "Ar-Ge", "IT"];
const positions = ["Yönetici", "Uzman", "Mühendis", "Analist", "Stajyer"];

// Rastgele bir tarih oluşturma fonksiyonu
const getRandomDate = (start: Date, end: Date) => {
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().split('T')[0];
};
const generatePhoneNumber = (): string => {
  const first = Math.floor(Math.random() * 100); // 0-99
  const firstPart = `5${first.toString().padStart(2, '0')}`; // 5xx

  const second = Math.floor(Math.random() * 900) + 100; // 100-999
  const third = Math.floor(Math.random() * 90) + 10;    // 10-99
  const fourth = Math.floor(Math.random() * 90) + 10;   // 10-99

  return `${firstPart} ${second} ${third} ${fourth}`;
};

export const generateMockEmployees = (count: number): Employee[] => {
    const employees: Employee[] = [];
    const minSalary = 15000;
    const maxSalary = 100000;

    for (let i = 0; i < count; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const department = departments[Math.floor(Math.random() * departments.length)];
        const position = positions[Math.floor(Math.random() * positions.length)];
        const salary = Math.floor(Math.random() * (maxSalary - minSalary + 1)) + minSalary;
        const startDate = getRandomDate(new Date(2023, 0, 1), new Date());

        employees.push({
            id: uuidv4(),
            firstName,
            lastName,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@ornek.com`,
            phone: generatePhoneNumber(),
            department,
            position,
            salary,
            startDate,
            status: "active",
            teamId: ""
        });
    }

    return employees;
};

// 100 adet çalışan verisi oluşturma
export const initialEmployees = generateMockEmployees(100);