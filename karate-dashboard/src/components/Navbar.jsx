import React from 'react';
import { Bell, UserCircle } from 'lucide-react';
import { useState, useEffect } from 'react';


const Navbar = () => {
const [userName, setUserName] = useState('Sensei');

  // 2. Fetch user data from Local Storage when component mounts
  useEffect(() => {
    try {
      // Retrieve the JSON string we saved during login
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        // Check if 'name' exists on the saved object, otherwise keep default
        if (parsedUser.name) {
          setUserName(parsedUser.name);
        }
      }
    } catch (error) {
      console.error("Failed to load user info:", error);
    }
  }, []);


  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button className="text-gray-500 hover:text-gray-700">
          <Bell size={20} />
        </button>
        <div className="flex items-center gap-2 border-l pl-4 border-gray-200">
          <span className="text-sm font-medium text-gray-700">{userName}</span>
          <UserCircle size={32} className="text-gray-400" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;