import { z } from 'zod';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^5\d{2} \d{3} \d{2} \d{2}$/;

export const EmployeeSchema = z.object({
  id: z.string().optional(),
  firstName: z.string().min(2, 'Ad en az 2 karakter olmalıdır.'),
  lastName: z.string().min(2, 'Soyad en az 2 karakter olmalıdır.'),
  email: z.string().regex(emailRegex, 'Geçerli bir email adresi girin.').nonempty('Email boş bırakılamaz.'),
  phone: z.string().regex(phoneRegex, 'Telefon numarası 5xx xxx xx xx formatında olmalıdır.'),
  department: z.string().nonempty('Departman seçimi zorunludur.'),
  position: z.string().nonempty('Pozisyon boş bırakılamaz.'),
  salary: z.number().min(15000, 'Maaş en az 15.000 TL olmalıdır.'),
  startDate: z.string().refine(
    (date) => new Date(date) < new Date(),
    'Başlangıç tarihi geçmişte olmalıdır.'
  ),
  status: z.enum(['active', 'inactive']).optional(),
  avatar: z.string().optional(),
  teamId: z.string().optional(),
});

export type Employee = z.infer<typeof EmployeeSchema>;