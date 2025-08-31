import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';


import { useState, useRef, useEffect } from 'react';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target as Node)
    ) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans dark:bg-gray-900 dark:text-gray-100">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        handleClickOutside={handleClickOutside}
      />
      {/* Ana İçerik */}
      <main className="flex-1 w-3/4 p-6 overflow-auto lg:ml-[25%]">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;