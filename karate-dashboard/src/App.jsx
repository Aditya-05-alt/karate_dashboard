import React, { useState } from 'react'; // Import useState
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import { StudentView } from './pages/Students_CRUD/Student_view';
import { DojoView } from './pages/dojoCRUD/dojo_view';
import { InstructorView } from './pages/instructors_CRUD/instructor_view';
import Login from './pages/Login';
import { UserView } from './pages/users_CRUD/users_view';
import { AddDojo } from './pages/dojoCRUD/dojo_add';
import { AddInstructor } from './pages/instructors_CRUD/add_instructor';

// Layout Component
const DashboardLayout = () => {
  // 1. Manage Sidebar state here
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* 2. Pass state and toggle function to Sidebar */}
      <Sidebar 
        isCollapsed={isCollapsed} 
        toggleSidebar={() => setIsCollapsed(!isCollapsed)} 
      />

      {/* 3. Dynamically adjust margin-left (ml-64 = 256px, ml-20 = 80px) */}
      <div 
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <div className="flex-none shadow-sm z-10 bg-white">
          <Navbar/>
        </div>
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-2">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        
        {/* 1. ROOT PATH is now LOGIN */}
        <Route path="/" element={<Login />} />

        {/* 2. PROTECTED ROUTES (Sidebar applies here) */}
        <Route element={<DashboardLayout />}>
          {/* Dashboard is now at /dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          <Route path="/students" element={<StudentView />} />
          
          {/* Dojo Routes */}
          <Route path="/dojos" element={<DojoView />} />
          <Route path="/dojos/create" element={<AddDojo />} />
          <Route path="/dojos/edit/:id" element={<AddDojo />} />
          
          {/* Instructor Routes */}
          <Route path="/instructors" element={<InstructorView />} />
          <Route path="/instructors/create" element={<AddInstructor />} />
          <Route path="/instructors/edit/:id" element={<AddInstructor />} />

          <Route path="/users" element={<UserView />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;