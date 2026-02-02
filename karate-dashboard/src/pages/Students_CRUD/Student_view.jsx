import React, { useState } from 'react';
import { Users, Award, TrendingUp, Globe2 } from 'lucide-react';
import Table from '../../components/Table';
import { StatCard } from '../../components/StatCard';
import { columns } from '../data/colData';
import { studentData } from '../data/rowData';
// import { StudentDetails } from '../../components/StudentDetails';

export function StudentView() {
  const [selectedStudent, setSelectedStudent] = useState(null);

  const stats = [
    { icon: <Users size={24} />, title: "Total Students", value: "124", color: "bg-blue-500" },
    { icon: <Award size={24} />, title: "Black Belts", value: "12", color: "bg-purple-500" },
    { icon: <TrendingUp size={24} />, title: "Monthly Growth", value: "+14%", color: "bg-emerald-500" }
  ];

  return (
    // Changed p-8 to p-6 for better space management on zoom
    <div className="p-6 space-y-8 relative min-w-0">
      
      {/* Header Section: Added 'flex-wrap' so button doesn't get cut off */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-wrap">
        <div className="flex items-center">
          <div className="w-14 h-14 bg-black rounded-xl mr-4 flex-shrink-0 flex items-center justify-center">
            <Globe2 className="w-8 h-8 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-3xl font-bold text-gray-800">Student Roster</h1>
            <p className="text-gray-500 mt-1">Manage your dojo members, ranks, and attendance.</p>
          </div>
        </div>

        {/* This button will now wrap under the title if screen is too tight */}
        <button className="bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 transition-colors shadow-sm font-medium flex items-center gap-2 whitespace-nowrap">
           <span>+ Add New Student</span>
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
           <h2 className="text-lg font-semibold text-gray-800">All Students</h2>
           <p className="text-sm text-gray-500 mt-1">Click on any row to view full details.</p>
        </div>
        
        {/* Table will now scroll horizontally because the parent is constrained */}
        <Table 
          columns={columns} 
          data={studentData} 
          itemsPerPage={10}
          onRowClick={(student) => setSelectedStudent(student)}
        />
      </div>

      {selectedStudent && (
        <StudentDetails 
          student={selectedStudent} 
          onClose={() => setSelectedStudent(null)} 
        />
      )}

    </div>
  );
}