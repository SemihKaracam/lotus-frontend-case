import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import type { RootState, AppDispatch } from '../store';
import { fetchEmployees } from '../store/employeesSlice';


const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#fd8042", "#00C49F", "#AD46FF"];

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: employees, status } = useSelector((state: RootState) => state.employees);

  // Veriyi bileşen yüklendiğinde bir kez çekmek için useEffect kullanıyoruz.
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchEmployees());
    }
  }, [status, dispatch]);
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
  if (status === 'failed') {
    return (
      <div className={`min-h-screen p-6 font-sans flex items-center justify-center`}>
        <h2 className="text-xl font-semibold text-red-500">Veri yüklenirken bir hata oluştu.</h2>
      </div>
    );
  }


  // Departmanlara göre çalışan sayılarını hesaplar (Pie Chart için)
  const departmentData = Object.entries(
    employees.reduce((acc: Record<string, number>, emp) => {
      acc[emp.department] = (acc[emp.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  // Maaş aralıklarına göre çalışan sayılarını hesaplar (Bar Chart için)
  const salaryData = employees.reduce((acc, emp) => {
    if (emp.salary >= 15000 && emp.salary < 30000) acc.range15_30++;
    else if (emp.salary >= 30000 && emp.salary < 50000) acc.range30_50++;
    else if (emp.salary >= 50000 && emp.salary < 80000) acc.range50_80++;
    else if (emp.salary >= 80000) acc.range80Plus++;
    return acc;
  }, { range15_30: 0, range30_50: 0, range50_80: 0, range80Plus: 0 });

  const formattedSalaryData = [
    { name: '15-30K', Çalışan: salaryData.range15_30 },
    { name: '30-50K', Çalışan: salaryData.range30_50 },
    { name: '50-80K', Çalışan: salaryData.range50_80 },
    { name: '80K+', Çalışan: salaryData.range80Plus },
  ];

  // Aylık işe alım trendini hesaplar (Line Chart için)
  const hireTrendData = Object.entries(
    employees.reduce((acc: Record<string, number>, emp) => {
      const date = new Date(emp.startDate);
      const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      acc[monthYear] = (acc[monthYear] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  )
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, hires]) => ({ name: month, İşeAlım: hires }));

  const totalEmployees = employees.length;
  const averageSalary =
    employees.length > 0
      ? (employees.reduce((sum, emp) => sum + emp.salary, 0) / employees.length).toFixed(2)
      : 'N/A';
  const totalDepartments = new Set(employees.map(emp => emp.department)).size;

  return (
    <div className={`min-h-screen p-6 font-sans`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl w-full text-indigo-500 text-center font-bold">Dashboard</h1>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className={`p-6 rounded-xl shadow-lg transform transition-all hover:scale-105 duration-300`}>
          <h3 className="text-xl font-semibold mb-2">Toplam Çalışan Sayısı</h3>
          <p className="text-4xl font-extrabold text-blue-500">{totalEmployees}</p>
        </div>
        <div className={`p-6 rounded-xl shadow-lg transform transition-all hover:scale-105 duration-300`}>
          <h3 className="text-xl font-semibold mb-2">Ortalama Maaş</h3>
          <p className="text-4xl font-extrabold text-green-500">₺{averageSalary}</p>
        </div>
        <div className={`p-6 rounded-xl shadow-lg transform transition-all hover:scale-105 duration-300 `}>
          <h3 className="text-xl font-semibold mb-2">Toplam Departman Sayısı</h3>
          <p className="text-4xl font-extrabold text-purple-500">{totalDepartments}</p>
        </div>
      </div>

      {/* Grafik Alanları */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Departman Dağılımı (Pie Chart) */}
        <div className={`p-6 rounded-xl shadow-lg `}>
          <h3 className="text-xl font-semibold text-center mb-4">Departmanlara Göre Çalışan Dağılımı</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={departmentData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
              >
                {departmentData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                // @ts-ignore
                formatter={(value, entry, index) => (
                  <span style={{ color: "black", fontWeight: 600 }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Aylık İşe Alım Trendi (Line Chart) */}
        <div className={`p-6 rounded-xl shadow-lg`}>
          <h3 className="text-xl font-semibold text-center mb-4">Aylık İşe Alım Trendi</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={hireTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="İşeAlım" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Maaş Dağılımı (Bar Chart) */}
        <div className={`lg:col-span-2 p-6 rounded-xl shadow-lg`}>
          <h3 className="text-xl font-semibold text-center mb-4">Maaş Dağılımı</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={formattedSalaryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Çalışan" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
export default Dashboard
