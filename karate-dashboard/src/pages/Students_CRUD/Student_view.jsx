import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Award, Globe2, Loader2, UserCheck, X, 
  CheckCircle, Building2, Phone, Calendar, GraduationCap, User, Edit, Trash2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Table from '../../components/Table';
import { StatCard } from '../../components/StatCard';
import FilterComponent from '../../components/FilterComponent';
import SearchBar from '../../components/SearchBar';
// Import all three fetch functions and the delete function
import { getStudents, getDojos, getInstructors, deleteStudent } from '../../api-service/api'; 

// Static Rank Data for the Filter
const RANKS = [
  'White', 'Yellow', 'Yellow Stripe', 'Orange', 'Green', 
  'Green Stripe', 'Blue', 'Purple', 'Brown 3rd Kyu', 
  'Brown 2nd Kyu', 'Brown 1st Kyu', 'Black (Shodan)', 'Black (Nidan)', 'Black (Sandan)', 'Black (Yondan)'
];

// Helper to style Rank Pills exactly matching the new array
const getRankStyle = (rank) => {
  const r = rank?.toLowerCase() || '';
  
  // Black Belts (Shodan, Nidan, Sandan, Yondan)
  if (r.includes('black')) return 'bg-black text-white shadow-sm';
  
  // Brown Belts (1st, 2nd, 3rd Kyu)
  if (r.includes('brown')) return 'bg-[#795548] text-white shadow-sm'; 
  
  // Purple
  if (r.includes('purple')) return 'bg-purple-600 text-white shadow-sm';
  
  // Blue
  if (r.includes('blue')) return 'bg-blue-600 text-white shadow-sm';
  
  // Green & Green Stripe
  if (r.includes('green stripe')) return 'bg-green-600 text-white border-b-4 border-white shadow-sm';
  if (r.includes('green')) return 'bg-green-600 text-white shadow-sm';
  
  // Orange
  if (r.includes('orange')) return 'bg-orange-500 text-white shadow-sm';
  
  // Yellow & Yellow Stripe
  if (r.includes('yellow stripe')) return 'bg-yellow-400 text-yellow-900 border-b-4 border-white shadow-sm';
  if (r.includes('yellow')) return 'bg-yellow-400 text-yellow-900 shadow-sm';
  
  // White & Default
  if (r.includes('white')) return 'bg-white text-gray-800 border-2 border-gray-200 shadow-sm';
  
  return 'bg-gray-100 text-gray-800 border border-gray-200'; 
};

export function StudentView() {
  const navigate = useNavigate();
  
  // Data States
  const [students, setStudents] = useState([]);
  const [dojos, setDojos] = useState([]);             // Store dojos here to pass to filter
  const [instructors, setInstructors] = useState([]); // Store instructors here to pass to filter
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDojo, setSelectedDojo] = useState('');
  const [selectedRank, setSelectedRank] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState(''); // Replaced Status with Instructor
  const [selectedStudent, setSelectedStudent] = useState(null);

  // 1. Fetch All Data Once on Mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      // Fetch everything simultaneously. This stops the FilterComponent from spinning infinitely.
      const [studentsData, dojosData, instructorsData] = await Promise.all([
        getStudents(),
        getDojos(),
        getInstructors()
      ]);
      setStudents(studentsData || []);
      setDojos(dojosData || []);
      setInstructors(instructorsData || []);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Delete action
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await deleteStudent(id);
        loadAllData(); // Refresh table after deletion
      } catch (err) {
        console.error("Failed to delete student", err);
        alert("Failed to delete student.");
      }
    }
  };

  // 3. Dynamic Stats Calculation
  const stats = useMemo(() => {
    const total = students.length;
    const blackBelts = students.filter(s => s.rank?.includes('Black')).length;
    const active = students.filter(s => s.status === 'Active').length;

    return [
      { icon: <Users size={24} />, title: "Total Students", value: total.toString(), color: "bg-blue-500" },
      { icon: <Award size={24} />, title: "Black Belts", value: blackBelts.toString(), color: "bg-purple-500" }, // Changed to purple based on screenshot
      { icon: <UserCheck size={24} />, title: "Active Students", value: active.toString(), color: "bg-emerald-500" } // Adjusted to Active Students based on logic
    ];
  }, [students]);

  // 4. Filter Logic
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.phone && student.phone.includes(searchTerm));
      const matchesDojo = selectedDojo ? student.dojo === selectedDojo : true;
      const matchesRank = selectedRank ? student.rank === selectedRank : true;
      const matchesInstructor = selectedInstructor ? student.instructors === selectedInstructor : true; // Instructor filter

      return matchesSearch && matchesDojo && matchesRank && matchesInstructor;
    });
  }, [students, searchTerm, selectedDojo, selectedRank, selectedInstructor]);

  // 5. Exact Columns matching your screenshot (Name, Dojo, DOB, Instructors, Phone, Rank, Age, Status) + Actions
  const columns = useMemo(() => [
    { 
      label: 'NAME', 
      key: 'name', 
      sortable: true,
      render: (row) => <span className="font-bold text-gray-900">{row.name}</span>
    },
    { 
      label: 'DOJO', 
      key: 'dojo', 
      sortable: true,
      render: (row) => <span className="text-gray-600">{row.dojo || '-'}</span>
    },
    { 
      label: 'DATE OF BIRTH', 
      key: 'dob', 
      render: (row) => <span className="text-gray-600">{row.dob || '-'}</span>
    },
    { 
      label: 'INSTRUCTORS', 
      key: 'instructors', 
      render: (row) => <span className="text-gray-600">{row.instructors || '-'}</span>
    },
    { 
      label: 'PHONE NUMBER', 
      key: 'phone', 
      render: (row) => <span className="text-gray-600">{row.phone || '-'}</span>
    },
    { 
      label: 'RANK', 
      key: 'rank', 
      sortable: true,
      render: (row) => (
          <span className={`px-3 py-1 rounded-md text-xs font-bold tracking-wide uppercase ${getRankStyle(row.rank)}`}>
              {row.rank}
          </span>
      )
    },
    { 
      label: 'AGE', 
      key: 'age', 
      render: (row) => <span className="text-gray-600">{row.age || '-'}</span>
    },
    { 
      label: 'STATUS', 
      key: 'status', 
      sortable: true,
      render: (row) => {
        const isActive = row.status === 'Active';
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
            isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
          }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
              {row.status}
          </span>
        )
      }
    },
    { 
      label: 'ACTIONS', 
      key: 'actions', 
      render: (row) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}> 
          <button onClick={() => navigate(`/students/edit/${row.id}`)} className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors">
            <Edit size={16} />
          </button>
          <button onClick={() => handleDelete(row.id)} className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ], [navigate]);

  return (
    <div className="p-6 space-y-8 relative min-w-0">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-wrap">
        <div className="flex items-center">
          <div className="w-14 h-14 bg-black rounded-xl mr-4 flex-shrink-0 flex items-center justify-center shadow-lg">
            <Globe2 className="w-8 h-8 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-3xl font-bold text-gray-800">Student Roster</h1>
            <p className="text-gray-500 mt-1">Manage your dojo members, ranks, and attendance.</p>
          </div>
        </div>

        <button 
          onClick={() => navigate('/students/create')} 
          className="bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 shadow-sm font-medium flex items-center justify-center gap-2 whitespace-nowrap"
        > 
          <span>+ Add New Student</span>
        </button>
      </div>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      {/* --- FILTERS & SEARCH ROW --- */}
      <div className="flex flex-col sm:flex-row gap-4 items-end bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex-1 w-full sm:w-auto">
           <SearchBar onSearch={setSearchTerm} placeholder="Search students by name or phone..." />
        </div>
        
        {/* Using flex-wrap so dropdowns don't clip off screen */}
        <div className="flex flex-wrap gap-4 w-full sm:w-auto">
            {/* Using static 'data' prop prevents the FilterComponent from looping/vibrating */}
            <FilterComponent 
                label="Dojo" 
                data={dojos} 
                displayKey="name"
                valueKey="name" 
                onFilterChange={setSelectedDojo} 
            />
            <FilterComponent 
                label="Instructor" 
                data={instructors} 
                displayKey="name"
                valueKey="name" 
                onFilterChange={setSelectedInstructor} 
            />
            <FilterComponent 
                label="Rank" 
                data={RANKS} 
                onFilterChange={setSelectedRank} 
            />
        </div>
      </div>

      {/* --- TABLE SECTION --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
           <div>
               <h2 className="text-lg font-semibold text-gray-800">All Students</h2>
               <p className="text-sm text-gray-500 mt-1">Click on any row to view full details.</p>
           </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-red-600 w-10 h-10" />
            <span className="ml-2 text-gray-500 font-medium">Loading Data...</span>
          </div>
        ) : (
          <Table 
            columns={columns} 
            data={filteredStudents} 
            itemsPerPage={10}
            onRowClick={(student) => setSelectedStudent(student)}
          />
        )}
      </div>

      {/* --- DETAILS POPUP MODAL --- */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedStudent(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
            
            <button 
              onClick={() => setSelectedStudent(null)}
              className="absolute top-4 right-4 z-10 bg-white/80 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Header Area */}
            <div className="h-40 bg-gray-900 w-full relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-6 pt-16">
                 <h2 className="text-3xl font-bold text-white mb-1">{selectedStudent.name}</h2>
                 <span className={`inline-block px-3 py-1 rounded-md text-xs font-bold tracking-wide uppercase ${getRankStyle(selectedStudent.rank)}`}>
                    {selectedStudent.rank}
                 </span>
              </div>
            </div>

            {/* Body Content */}
            <div className="p-6 space-y-6">
              
              {/* Top Row: Status & Dojo */}
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border ${
                  selectedStudent.status === 'Active' 
                    ? 'bg-green-50 text-green-700 border-green-200' 
                    : 'bg-red-50 text-red-700 border-red-200'
                }`}>
                   <div className={`w-2 h-2 rounded-full ${selectedStudent.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></div> 
                   {selectedStudent.status}
                </span>
                <span className="text-sm text-gray-600 flex items-center gap-2 font-semibold bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                   <Building2 size={16} className="text-gray-400" /> {selectedStudent.dojo || 'No Dojo Assigned'}
                </span>
              </div>

              {/* Middle Row: Phone & Age/DOB */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                   <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-2">Phone</p>
                   <div className="flex items-center gap-2 text-gray-900 font-semibold">
                      <Phone size={18} className="text-red-500" />
                      {selectedStudent.phone || 'N/A'}
                   </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                   <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-2">Age / DOB</p>
                   <div className="flex items-center gap-2 text-gray-900 font-semibold truncate">
                      <Calendar size={18} className="text-red-500 shrink-0" />
                      {selectedStudent.age ? `${selectedStudent.age} yrs` : 'N/A'}
                      <span className="text-xs text-gray-500 font-normal ml-1 truncate">
                        ({selectedStudent.dob})
                      </span>
                   </div>
                </div>
              </div>

              {/* Bottom Info: Instructor */}
              <div className="border-t border-gray-100 pt-5">
                <h3 className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-2 flex items-center gap-2">
                  <GraduationCap size={16} className="text-gray-400" /> Head Instructor
                </h3>
                <p className="text-gray-900 font-medium text-base">
                  {selectedStudent.instructors || "No instructor assigned"}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                 <button 
                   onClick={() => navigate(`/students/edit/${selectedStudent.id}`)}
                   className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                 >
                   <Edit size={18} /> Edit Student Details
                 </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}