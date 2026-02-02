import React from 'react';
import { Link } from 'react-router-dom';
import { Users, GraduationCap, Building2, ArrowRight, ShieldCheck } from 'lucide-react';

const Dashboard = () => {
  return (
    // 'min-h-full' ensures it fills the available content area from App.jsx
    <div className="min-h-full flex flex-col justify-center items-center text-center p-8 bg-gray-50/50">
      
      {/* 1. Hero Section */}
      <div className="max-w-3xl mx-auto mb-16 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
         <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-semibold mb-4">
            <ShieldCheck size={16} /> Secure Admin Panel
         </div>
         <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-white-500">IGKA </span>
         </h1>
         <p className="text-2xl font-light text-gray-600">
            Karate Management System
         </p>
         <p className="text-gray-500 max-w-xl mx-auto text-lg">
            Your one-step data provider dashboard. Manage your dojos, students, and instructors with precision, honor, and efficiency.
         </p>
      </div>

      {/* 2. Interactive Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl px-4">
         
         {/* Card 1: Students */}
         <Link to="/students" className="group bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-2xl hover:border-blue-100 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
            
            <div className="relative z-10">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300 shadow-sm">
                   <Users className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Students</h3>
                <p className="text-gray-500 mb-8 leading-relaxed">
                   Access the full student roster, manage belt ranks, and track active status.
                </p>
                <div className="flex items-center justify-center text-blue-600 font-bold group-hover:gap-3 gap-2 transition-all">
                   Manage Students <ArrowRight size={18} />
                </div>
            </div>
         </Link>

         {/* Card 2: Instructors */}
         <Link to="/instructors" className="group bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-2xl hover:border-purple-100 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
            
             <div className="relative z-10">
                <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors duration-300 shadow-sm">
                   <GraduationCap className="w-8 h-8 text-purple-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Instructors</h3>
                <p className="text-gray-500 mb-8 leading-relaxed">
                   View instructor profiles, certifications, and teaching assignments.
                </p>
                <div className="flex items-center justify-center text-purple-600 font-bold group-hover:gap-3 gap-2 transition-all">
                   View Senseis <ArrowRight size={18} />
                </div>
             </div>
         </Link>

          {/* Card 3: Dojos */}
         <Link to="/dojos" className="group bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-2xl hover:border-red-100 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
            
             <div className="relative z-10">
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-red-600 transition-colors duration-300 shadow-sm">
                   <Building2 className="w-8 h-8 text-red-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Dojo Locations</h3>
                <p className="text-gray-500 mb-8 leading-relaxed">
                   Manage your physical locations, class schedules, and facility details.
                </p>
                <div className="flex items-center justify-center text-red-600 font-bold group-hover:gap-3 gap-2 transition-all">
                   Check Dojos <ArrowRight size={18} />
                </div>
             </div>
         </Link>

      </div>

      {/* Footer Text */}
      <div className="mt-16 text-gray-400 text-sm">
        © 2026 International Gosoku-Ryu Karate Association.
      </div>
    </div>
  );
};

export default Dashboard;