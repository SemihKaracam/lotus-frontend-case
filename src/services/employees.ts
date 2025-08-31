import { type Employee } from "../types/schema";
import { initialEmployees } from "./data/mockEmployees";
import { v4 as uuidv4 } from 'uuid'; // uuid kütüphanesini import edin

const STORAGE_KEY = "employees";

// Gecikme sağlayan yardımcı fonksiyon
const delay = <T>(data: T | null = null): Promise<T | null> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(data);
        }, 500); // 500ms gecikme
    });
};


const getData = (): Employee[] => {
    const storedData = localStorage.getItem(STORAGE_KEY);

    // Hem null hem de [] (boş array) durumunu kontrol et
    if (!storedData || storedData === "[]") {
        console.log("No data found in localStorage. Loading mock data.");
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialEmployees));
        return initialEmployees;
    }

    return JSON.parse(storedData) as Employee[];
};


// localStorage'a veriyi kaydeden fonksiyon
const setData = (data: Employee[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// Tüm çalışanları getirir
export const getEmployees = async (): Promise<Employee[]> => {
    const employees = getData();
    return delay(employees) as Promise<Employee[]>;
};

// Yeni çalışan ekler
export const createEmployee = async (newEmp: Omit<Employee, "id">): Promise<Employee> => {
    await delay();
    const data = getData();
    const id = uuidv4(); // uuid kütüphanesi ile benzersiz ID oluşturma
    const emp = { id, ...newEmp } as Employee;
    data.push(emp);
    setData(data);
    return emp;
};

// Çalışanı günceller
export const updateEmployee = async (emp: Employee): Promise<Employee> => {
    await delay();
    const data = getData();
    const idx = data.findIndex((e) => e.id === emp.id);
    if (idx === -1) throw new Error("Çalışan bulunamadı");
    data[idx] = emp;
    setData(data);
    return emp;
};

// Çalışanı siler
export const deleteEmployee = async (id: string): Promise<string> => {
    await delay();
    let data = getData();
    data = data.filter((e) => e.id !== id);
    setData(data);
    return id;
};