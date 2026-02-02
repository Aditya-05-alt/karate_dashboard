import React from 'react';
import { Bell, UserCircle } from 'lucide-react';

const Navbar = ({ userName }) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button className="text-gray-500 hover:text-gray-700">
          <Bell size={20} />
        </button>
        <div className="flex items-center gap-2 border-l pl-4 border-gray-200">
          <span className="text-sm font-medium text-gray-700">Sensei {userName}</span>
          <UserCircle size={32} className="text-gray-400" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;