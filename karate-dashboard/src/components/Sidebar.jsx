import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  HouseIcon, 
  LogInIcon, 
  LogOut, 
  User, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// Accept props for state management
const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <User size={20} />, label: 'Admins', path: '/users' },
    { icon: <Users size={20} />, label: 'Students', path: '/students' },
    { icon: <HouseIcon size={20} />, label: 'Dojos', path: '/dojos' },
    { icon: <LogInIcon size={20} />, label: 'Instructors', path: '/instructors' },
  ];

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    } catch (error) {
      console.error("Logout failed", error);
      navigate('/login');
    }
  };

  return (
    <div 
      className={`h-screen bg-slate-900 text-white flex flex-col fixed left-0 top-0 transition-all duration-300 z-50 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header */}

      <div className={`p-6 text-2xl font-bold border-b border-slate-800 flex items-center gap-2 h-20 ${isCollapsed ? 'justify-center' : ''}`}  onClick={() => toggleSidebar()}>
        <span className="text-red-500 text-3xl">🥋</span> 
        {!isCollapsed && <span>DojoManager</span>}
      </div>
    
      
      {/* Nav Items */}
      <nav className="flex-1 p-4 space-y-2 overflow-x-hidden">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={index} 
              to={item.path} 
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors relative group ${
                isActive ? 'bg-red-600 text-white' : 'hover:bg-slate-800 text-gray-300'
              } ${isCollapsed ? 'justify-center' : ''}`}
            >
              <div className="flex-shrink-0">
                {item.icon}
              </div>
              
              {!isCollapsed && (
                <span className="whitespace-nowrap transition-opacity duration-200">
                  {item.label}
                </span>
              )}

              {/* Tooltip for Collapsed State */}
              {isCollapsed && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg border border-slate-700">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className={`flex items-center gap-3 text-gray-400 hover:text-white transition-colors w-full p-3 rounded-lg hover:bg-slate-800 group relative ${isCollapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={20} />
          {!isCollapsed && <span>Logout</span>}

          {isCollapsed && (
            <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg border border-slate-700">
              Logout
            </div>
          )}
        </button>

        {/* Collapse Toggle Button - Uses the prop function now */}
        {/* <button 
          onClick={toggleSidebar}
          className="flex items-center justify-center w-full p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors mt-2"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button> */}
      </div>
    </div>
  );
};

export default Sidebar;