import React, { useState, useEffect, useMemo } from 'react';
import { UserCheck, Shield, GraduationCap, Medal, Loader2 } from 'lucide-react';
import Table from '../../components/Table';
import { StatCard } from '../../components/StatCard';
import { instructorColumns } from '../data/instructorColData'; 
import { useNavigate } from 'react-router-dom';
// Import API function
import { getInstructors } from '../../api-service/api';
// Import BeltBadge Component
import BeltBadge from '../../components/Beltbadge';

export function InstructorView() {
  const navigate = useNavigate();
  
  // State for storing API data
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // UI States
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Fetch Data from API on Component Mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getInstructors();
        setInstructors(data);
      } catch (error) {
        console.error("Failed to fetch instructors:", error);
        // Optional: Add toast notification here
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 2. Dynamic Stats Calculation
  const stats = useMemo(() => {
    const total = instructors.length;
    // Assuming your API returns a 'status' field like "Active"
    const active = instructors.filter(i => i.status === 'Active').length; 
    // Example: Counting Black belts if 'rank' includes "Black"
    const highRank = instructors.filter(i => i.rank?.includes('Black')).length;

    return [
      { icon: <UserCheck size={24} />, title: "Total Instructors", value: total.toString(), color: "bg-blue-600" },
      { icon: <Shield size={24} />, title: "Active Senseis", value: active.toString(), color: "bg-green-600" },
      { icon: <Medal size={24} />, title: "High Rank (Black)", value: highRank.toString(), color: "bg-black" }
    ];
  }, [instructors]);

  return (
    <div className="p-6 space-y-8 relative min-w-0">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-wrap">
        <div className="flex items-center">
          <div className="w-14 h-14 bg-black rounded-xl mr-4 flex-shrink-0 flex items-center justify-center">
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
            <span className="ml-2 text-gray-500">Loading Instructors...</span>
          </div>
        ) : (
          <Table 
            columns={instructorColumns} 
            data={instructors} // Pass the API data here
            itemsPerPage={25}
            onRowClick={(instructor) => setSelectedInstructor(instructor)}
          />
        )}
      </div>

      {/* Detail Modal */}
      {selectedInstructor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full relative">
                <button 
                    onClick={() => setSelectedInstructor(null)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-black"
                >
                    ✕
                </button>
                
                {selectedInstructor.image && (
                  <img 
                    src={selectedInstructor.image} 
                    alt={selectedInstructor.name} 
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-red-100"
                  />
                )}
                
                <h2 className="text-2xl font-bold text-center mb-1">{selectedInstructor.name}</h2>
                
                {/* --- UPDATE: Replaced text with BeltBadge --- */}
                <div className="flex justify-center mb-6 mt-2">
                    <BeltBadge rank={selectedInstructor.rank} />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">Age:</span>
                    <span className="font-medium">{selectedInstructor.age}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">Phone:</span>
                    <span className="font-medium">{selectedInstructor.phone}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">Email:</span>
                    <span className="font-medium">{selectedInstructor.email}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">Status:</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${selectedInstructor.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {selectedInstructor.status}
                    </span>
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <button 
                    onClick={() => navigate(`/instructors/edit/${selectedInstructor.id}`)}
                    className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-800"
                  >
                    Edit Profile
                  </button>
                  <button 
                    onClick={() => setSelectedInstructor(null)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200"
                  >
                    Close
                  </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}