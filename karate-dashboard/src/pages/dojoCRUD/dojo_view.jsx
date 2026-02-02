import React from 'react';
import { Building2, Users, Map, Plus } from 'lucide-react';
import Table from '../../components/Table';
import { StatCard } from '../../components/StatCard';
import { dojoColumns } from '../data/dojoColData';
import { dojoData } from '../data/dojoData';

export function DojoView() {
  
  // Example stats for Dojos
  const stats = [
    { icon: <Building2 size={24} />, title: "Total Dojos", value: "6", color: "bg-indigo-500" },
    { icon: <Users size={24} />, title: "Total Instructors", value: "8", color: "bg-orange-500" },
    { icon: <Map size={24} />, title: "Locations", value: "3 Cities", color: "bg-teal-500" }
  ];

  return (
    <div className="p-6 space-y-8 min-w-0">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-wrap">
        <div className="flex items-center">
          {/* Icon Box */}
          <div className="w-14 h-14 bg-black rounded-xl mr-4 flex-shrink-0 flex items-center justify-center">
            <Building2 className="w-8 h-8 text-white" />
          </div>

          {/* Text Group */}
          <div className="text-left">
            <h1 className="text-3xl font-bold text-gray-800">Dojo Management</h1>
            <p className="text-gray-500 mt-1">Manage locations, instructors, and class schedules.</p>
          </div>
        </div>

        <button className="bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 transition-colors shadow-sm font-medium flex items-center gap-2 whitespace-nowrap">
           <Plus size={20} />
           <span>Add New Dojo</span>
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
           <h2 className="text-lg font-semibold text-gray-800">Registered Dojos</h2>
           <p className="text-sm text-gray-500 mt-1">List of all active training centers.</p>
        </div>
        
        {/* Reusing your Table component */}
        <Table 
          columns={dojoColumns} 
          data={dojoData} 
          itemsPerPage={10} 
        />
      </div>

    </div>
  );
}