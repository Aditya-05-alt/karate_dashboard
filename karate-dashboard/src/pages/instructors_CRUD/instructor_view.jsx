import React, { useState } from 'react';
import { UserCheck, Shield, GraduationCap, Medal } from 'lucide-react';
import Table from '../../components/Table';
import { StatCard } from '../../components/StatCard';
import { instructorColumns } from '../data/instructorColData'; // Imported new columns
import { instructorData } from '../data/instructorData';       // Imported new data

// Optional: You can reuse StudentDetails or create InstructorDetails later
// import { InstructorDetails } from '../../components/InstructorDetails';

export function InstructorView() {
  const [selectedInstructor, setSelectedInstructor] = useState(null);

  // Stats specific to Instructors
  const stats = [
    { icon: <UserCheck size={24} />, title: "Total Instructors", value: "10", color: "bg-blue-600" },
    { icon: <Shield size={24} />, title: "Active Senseis", value: "7", color: "bg-green-600" },
    { icon: <Medal size={24} />, title: "High Rank (Black)", value: "8", color: "bg-black" }
  ];

  return (
    <div className="p-6 space-y-8 relative min-w-0">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-wrap">
        <div className="flex items-center">
          <div className="w-14 h-14 bg-black rounded-xl mr-4 flex-shrink-0 flex items-center justify-center">
            {/* Changed Icon to GraduationCap for Instructors */}
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-3xl font-bold text-gray-800">Instructors</h1>
            <p className="text-gray-500 mt-1">Manage senseis, masters, and teaching staff.</p>
          </div>
        </div>

        <button className="bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 transition-colors shadow-sm font-medium flex items-center gap-2 whitespace-nowrap">
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
        
        {/* Using Instructor Data and Columns */}
        <Table 
          columns={instructorColumns} 
          data={instructorData} 
          itemsPerPage={25}
          onRowClick={(instructor) => setSelectedInstructor(instructor)}
        />
      </div>

      {/* Placeholder for Detail Modal */}
      {selectedInstructor && (
        // For now, simple alert or you can use your StudentDetails component if fields match
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">{selectedInstructor.name}</h2>
                <p className="mb-4">Details view under construction...</p>
                <button 
                    onClick={() => setSelectedInstructor(null)}
                    className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                >
                    Close
                </button>
            </div>
        </div>
      )}

    </div>
  );
}