import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, X, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useEffect } from 'react';

type SidebarProps = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  handleClickOutside: (event: MouseEvent) => void;
};

const sidebarVariants = {
  hidden: { x: '-100%' },
  visible: { x: '0%' },
};

const navLinks = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Çalışanlar', href: '/employees', icon: Users },
];

const Sidebar = ({ isSidebarOpen, toggleSidebar, handleClickOutside }: SidebarProps) => {
  const sidebarRef = useRef(null);

  const handleLinkClick = () => toggleSidebar();

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isSidebarOpen) toggleSidebar();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen, toggleSidebar]);

  return (
    <>
      {/* Mobil Hamburger Menü */}
      <div className="lg:hidden fixed top-0 left-0 z-50 p-4">
        <button onClick={toggleSidebar} className="text-gray-900 focus:outline-none">
          {!isSidebarOpen && <Menu className="text-indigo-600 cursor-pointer h-8 w-8 transition-transform duration-300" />}
        </button>
      </div>

      {/* Sidebar - Masaüstü */}
      <aside className="hidden lg:flex flex-shrink-0 w-1/4 h-screen fixed top-0 left-0 bg-white shadow-xl flex-col p-6 rounded-r-3xl">
        <div className="flex-1">
          <h1 className="text-4xl font-extrabold text-center text-indigo-600 mb-10">Yönetim Paneli</h1>
          <nav className="space-y-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.name}
                  to={link.href}
                  className={({ isActive }) =>
                    `flex items-center p-4 rounded-xl transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-600 ${
                      isActive ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-gray-600'
                    }`
                  }
                >
                  <Icon className="h-6 w-6 mr-4" />
                  <span className="text-lg">{link.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Sidebar - Mobil */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            ref={sidebarRef}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={sidebarVariants}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-y-0 left-0 z-40 w-3/5 bg-white shadow-xl flex flex-col p-6 rounded-r-3xl"
          >
            <div className="flex justify-end p-2">
              <button onClick={toggleSidebar} className="text-gray-900 focus:outline-none">
                <X className="h-8 w-8 cursor-pointer" />
              </button>
            </div>
            <div className="flex-1 mt-8">
              <h1 className="text-xl font-bold text-center text-indigo-600 mb-8">Yönetim Paneli</h1>
              <nav className="space-y-4">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <NavLink
                      key={link.name}
                      to={link.href}
                      onClick={handleLinkClick}
                      className={({ isActive }) =>
                        `flex items-center p-4 rounded-xl transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-600 ${
                          isActive ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-gray-600'
                        }`
                      }
                    >
                      <Icon className="h-6 w-6 mr-4" />
                      <span className="text-lg">{link.name}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
