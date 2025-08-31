import type { Employee } from '../types/employee';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^5[0-9]{2} ?[0-9]{3} ?[0-9]{2} ?[0-9]{2}$/;

interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  salary?: string;
  startDate?: string;
  [key: string]: string | undefined;
}

export const validateEmployeeForm = (employee: Employee | null): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!employee) return errors;

  // Ad ve Soyad: Zorunlu ve min 2 karakter
  if (!employee.firstName || employee.firstName.length < 2) {
    errors.firstName = 'Ad zorunludur ve en az 2 karakter olmalıdır.';
  }
  if (!employee.lastName || employee.lastName.length < 2) {
    errors.lastName = 'Soyad zorunludur ve en az 2 karakter olmalıdır.';
  }

  // Email: Geçerli format (client-side kontrolü)
  if (!employee.email || !emailRegex.test(employee.email)) {
    errors.email = 'Geçerli bir email adresi girin.';
  }

  // Telefon: TR format (5xx xxx xx xx)
  if (!employee.phone || !phoneRegex.test(employee.phone)) {
    errors.phone = 'Telefon numarası 5xx xxx xx xx formatında olmalıdır.';
  }

  // Maaş: Min 15.000 TL
  if (employee.salary < 15000) {
    errors.salary = 'Maaş en az 15.000 TL olmalıdır.';
  }

  // Tarih: Geçmişte olmalı
  const startDate = new Date(employee.startDate);
  if (startDate > new Date()) {
    errors.startDate = 'Başlangıç tarihi geçmişte olmalıdır.';
  }

  return errors;
};