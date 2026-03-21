import React, { useState, useEffect, useMemo } from 'react';
import { 
  UserCheck, Shield, GraduationCap, Medal, Loader2, 
  Users, Building2, Phone, Mail, Calendar, Edit, Trash2, User 
} from 'lucide-react';
import Table from '../../components/Table';
import { StatCard } from '../../components/StatCard';
import { useNavigate } from 'react-router-dom';
import { getInstructors, deleteInstructor } from '../../api-service/api';
import BeltBadge from '../../components/Beltbadge';

export function InstructorView() {
  const navigate = useNavigate();
  
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Fetch Data
  useEffect(() => {
    loadInstructors();
  }, []);

  const loadInstructors = async () => {
    try {
      setLoading(true);
      const data = await getInstructors();
      setInstructors(data);
    } catch (error) {
      console.error("Failed to fetch instructors:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Delete Action
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this Instructor?")) {
      try {
        await deleteInstructor(id);
        loadInstructors(); // Refresh table after deletion
      } catch (err) {
        console.error("Failed to delete instructor", err);
        alert("Failed to delete instructor.");
      }
    }
  };

  // 3. Dynamic Stats Calculation
  const stats = useMemo(() => {
    const total = instructors.length;
    const active = instructors.filter(i => i.status === 'Active').length; 
    const highRank = instructors.filter(i => i.rank?.includes('Black')).length;

    return [
      { icon: <UserCheck size={24} />, title: "Total Instructors", value: total.toString(), color: "bg-blue-600" },
      { icon: <Shield size={24} />, title: "Active Senseis", value: active.toString(), color: "bg-green-600" },
      { icon: <Medal size={24} />, title: "High Rank (Black)", value: highRank.toString(), color: "bg-black" }
    ];
  }, [instructors]);

  // 4. Inline Table Columns definition (Showing Counts & Actions)
  const columns = useMemo(() => [
    { 
      label: 'INSTRUCTOR', 
      key: 'name', 
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-200">
                {row.image ? <img src={row.image} className="w-full h-full object-cover"/> : <User size={20} className="text-gray-400"/>}
            </div>
            <div>
                <span className="font-bold text-gray-900 block">{row.name}</span>
                <span className="text-xs text-gray-500">{row.email}</span>
            </div>
        </div>
      )
    },
    { 
      label: 'RANK', 
      key: 'rank', 
      sortable: true,
      render: (row) => (
          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wide">
              {row.rank}
          </span>
      )
    },
    { 
      label: 'CONTACT', 
      key: 'phone', 
      render: (row) => (
        <div className="text-sm text-gray-600 flex items-center gap-2 font-medium">
            <Phone size={14} className="text-gray-400"/> 
            {row.phone}
        </div>
      )
    },
    // --- NEW: Live Dojo Count Column ---
    { 
        label: 'DOJOS', 
        key: 'dojos', 
        sortable: true, 
        render: (row) => (
            <span className="flex items-center gap-1.5 font-bold text-purple-700 bg-purple-50 border border-purple-100 px-2.5 py-1 rounded-md w-fit text-xs">
                <Building2 size={14} /> {row.dojos}
            </span>
        ) 
    },
    // --- NEW: Live Student Count Column ---
    { 
        label: 'STUDENTS', 
        key: 'students', 
        sortable: true, 
        render: (row) => (
            <span className="flex items-center gap-1.5 font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-md w-fit text-xs">
                <Users size={14} /> {row.students}
            </span>
        ) 
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
          <button onClick={() => navigate(`/instructors/edit/${row.id}`)} className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors">
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
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-wrap">
        <div className="flex items-center">
          <div className="w-14 h-14 bg-black rounded-xl mr-4 flex-shrink-0 flex items-center justify-center shadow-lg">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-3xl font-bold text-gray-800">Instructors</h1>
            <p className="text-gray-500 mt-1">Manage senseis, masters, and teaching staff.</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/instructors/create')} 
          className="bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 shadow-sm font-medium flex items-center justify-center gap-2"
        > 
          <span>+ Add New Instructor</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
           <h2 className="text-lg font-semibold text-gray-800">All Instructors</h2>
           <p className="text-sm text-gray-500 mt-1">Click on any row to view full profile.</p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-red-600 w-10 h-10" />
            <span className="ml-2 text-gray-500 font-medium">Loading Instructors...</span>
          </div>
        ) : (
          <Table 
            columns={columns} 
            data={instructors} 
            itemsPerPage={10}
            onRowClick={(instructor) => setSelectedInstructor(instructor)}
          />
        )}
      </div>

      {/* Detail Modal */}
      {selectedInstructor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedInstructor(null)}>
            <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full relative" onClick={(e) => e.stopPropagation()}>
                <button 
                    onClick={() => setSelectedInstructor(null)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 bg-gray-100 p-2 rounded-full transition-colors"
                >
                    ✕
                </button>
                
                {selectedInstructor.image ? (
                  <img 
                    src={selectedInstructor.image} 
                    alt={selectedInstructor.name} 
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-red-100 shadow-sm"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gray-100 flex items-center justify-center border-4 border-red-50">
                    <UserCheck size={40} className="text-gray-400" />
                  </div>
                )}
                
                <h2 className="text-2xl font-bold text-center mb-1 text-gray-900">{selectedInstructor.name}</h2>
                
                <div className="flex justify-center mb-6 mt-2">
                    <BeltBadge rank={selectedInstructor.rank} />
                </div>

                {/* --- LIVE COUNTS SECTION IN MODAL --- */}
                <div className="flex justify-around items-center bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
                    <div className="text-center">
                        <span className="text-xs text-gray-500 uppercase font-bold tracking-wider block mb-1">Students</span>
                        <span className="text-xl font-bold text-blue-600 flex items-center justify-center gap-1.5">
                            <Users size={18} /> {selectedInstructor.students}
                        </span>
                    </div>
                    <div className="w-px h-10 bg-gray-200"></div>
                    <div className="text-center">
                        <span className="text-xs text-gray-500 uppercase font-bold tracking-wider block mb-1">Dojos</span>
                        <span className="text-xl font-bold text-purple-600 flex items-center justify-center gap-1.5">
                            <Building2 size={18} /> {selectedInstructor.dojos}
                        </span>
                    </div>
                </div>

                {/* Personal Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg">
                    <Calendar size={18} className="text-red-500 shrink-0"/>
                    <span className="text-sm font-medium flex-1">Age / DOB:</span>
                    <span className="text-sm font-bold">{selectedInstructor.age} <span className="text-gray-400 font-normal">({selectedInstructor.dob})</span></span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg">
                    <Phone size={18} className="text-red-500 shrink-0"/>
                    <span className="text-sm font-medium flex-1">Phone:</span>
                    <span className="text-sm font-bold">{selectedInstructor.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg overflow-hidden">
                    <Mail size={18} className="text-red-500 shrink-0"/>
                    <span className="text-sm font-medium flex-1">Email:</span>
                    <span className="text-sm font-bold truncate">{selectedInstructor.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg">
                    <Shield size={18} className="text-red-500 shrink-0"/>
                    <span className="text-sm font-medium flex-1">Status:</span>
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${selectedInstructor.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
                      {selectedInstructor.status}
                    </span>
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <button 
                    onClick={() => navigate(`/instructors/edit/${selectedInstructor.id}`)}
                    className="flex-1 bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-md"
                  >
                    Edit Profile
                  </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}