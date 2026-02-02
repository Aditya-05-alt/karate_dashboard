import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import { StudentView } from './pages/Students_CRUD/Student_view';
import { DojoView } from './pages/dojoCRUD/dojo_view';
import { InstructorView } from './pages/instructors_CRUD/instructor_view';
import Login from './pages/Login';

// Layout Component
const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64 min-w-0 transition-all duration-300">
        <div className="flex-none shadow-sm z-10 bg-white">
          <Navbar userName="IGKA-ADMIN" />
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
          <Route path="/dojos" element={<DojoView />} />
          <Route path="/instructors" element={<InstructorView />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;