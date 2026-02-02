import React from 'react';
import { LayoutDashboard, Users, HouseIcon, LogInIcon, LogOut } from 'lucide-react';
// 1. Import useNavigate alongside Link and useLocation
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Hook for navigation

  const menuItems = [
    // 2. UPDATED: Dashboard path is now '/dashboard' (not '/')
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Users size={20} />, label: 'Students', path: '/students' },
    { icon: <HouseIcon size={20} />, label: 'Dojos', path: '/dojos' },
    { icon: <LogInIcon size={20} />, label: 'Instructors', path: '/instructors' },
  ];

  // 3. Handle Logout Function
  const handleLogout = () => {
    // Optional: Clear any auth tokens here (e.g., localStorage.removeItem('token'))
    // Redirect to Login Page
    navigate('/'); 
  };

  return (
    <div className="h-screen w-64 bg-slate-900 text-white flex flex-col fixed left-0 top-0">
      <div className="p-6 text-2xl font-bold border-b border-slate-800 flex items-center gap-2">
        <span className="text-red-500">🥋</span> DojoManager
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={index} 
              to={item.path} 
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                isActive ? 'bg-red-600 text-white' : 'hover:bg-slate-800 text-gray-300'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        {/* 4. Attach onClick handler to the button */}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors w-full p-3"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;