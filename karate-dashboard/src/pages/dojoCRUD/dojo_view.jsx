import React, { useState, useEffect, useMemo } from 'react';
import { Building2, MapPin, Phone, Edit, Trash2, Users, ExternalLink, X, Calendar, CheckCircle, Activity, Ban, Map } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Table from '../../components/Table';
import SearchBar from '../../components/SearchBar';
import { getDojos, deleteDojo } from '../../api-service/api';

// --- STAT CARD COMPONENT ---
export const StatCard = ({ icon, title, value, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:-translate-y-1">
    <div className={`p-3 rounded-lg ${color} text-white`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
    </div>
  </div>
);

export function DojoView() {
  const [dojos, setDojos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDojo, setSelectedDojo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadDojos();
  }, []);

  const loadDojos = async () => {
    try {
      const data = await getDojos();
      setDojos(data);
    } catch (err) {
      console.error("Failed to load dojos", err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this Dojo?")) {
      await deleteDojo(id);
      loadDojos();
    }
  };

  // --- STATISTICS CALCULATION ---
  const stats = useMemo(() => {
    const total = dojos.length;
    const active = dojos.filter(d => d.status === 'Active').length;
    const inactive = total - active;
    
    // Count unique addresses (normalize strings to avoid duplicates like " Tokyo " vs "Tokyo")
    const uniqueLocs = new Set(
      dojos
        .map(d => d.address?.trim())
        .filter(addr => addr && addr.length > 0)
    ).size;

    return { total, active, inactive, uniqueLocs };
  }, [dojos]);

  const filteredDojos = dojos.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = useMemo(() => [
    { 
      label: 'Dojo Name', 
      key: 'name', 
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                {row.image ? <img src={row.image} className="w-full h-full object-cover"/> : <Building2 className="p-2 w-full h-full text-gray-400"/>}
            </div>
            <div>
                <span className="font-bold text-gray-800 block">{row.name}</span>
                <span className="text-xs text-gray-500">Sensei: {row.instructor}</span>
            </div>
        </div>
      )
    },
    { 
      label: 'Contact', 
      key: 'phone', 
      render: (row) => (
        <div className="text-sm text-gray-600 flex items-center gap-2">
            <Phone size={14} className="text-gray-400"/> 
            {row.phone}
        </div>
      )
    },
    { 
      label: 'Location', 
      key: 'address',
      render: (row) => (
        <div className="flex flex-col text-sm">
           <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={14} className="text-gray-400 shrink-0"/> 
              <span className="truncate max-w-[150px]">{row.address || 'No Address'}</span>
           </div>
        </div>
      )
    },
    { label: 'Students', key: 'students', sortable: true, render: (row) => <span className="flex items-center gap-1"><Users size={14} className="text-gray-400"/> {row.students}</span> },
    { 
      label: 'Status', 
      key: 'status', 
      render: (row) => (
        <span className={`px-2 py-1 rounded text-xs font-bold ${row.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {row.status}
        </span>
      )
    },
    { 
      label: 'Actions', 
      key: 'actions', 
      render: (row) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}> 
          <button onClick={() => navigate(`/dojos/edit/${row.id}`)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
            <Edit size={16} />
          </button>
          <button onClick={() => handleDelete(row.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ], []);

  return (
    <div className="p-6 space-y-8 relative">
      
      {/* 1. Header Section */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center">
            <div className="w-14 h-14 bg-black rounded-xl mr-4 flex items-center justify-center shadow-lg">
                <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Dojos</h1>
                <p className="text-gray-500">Manage locations and branches.</p>
            </div>
        </div>
        
        {/* Search & Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <SearchBar onSearch={setSearchTerm} />
            <button onClick={() => navigate('/dojos/create')} className="bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 shadow-sm font-medium flex items-center justify-center gap-2">
                <span>+ Add Dojo</span>
            </button>
        </div>
      </div>

      {/* 2. Stats Section (Placed Below Search Bar) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Dojos" 
          value={stats.total} 
          icon={<Building2 size={24} />} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Total Active" 
          value={stats.active} 
          icon={<Activity size={24} />} 
          color="bg-green-500" 
        />
        <StatCard 
          title="Total Inactive" 
          value={stats.inactive} 
          icon={<Ban size={24} />} 
          color="bg-red-500" 
        />
        <StatCard 
          title="Total Locations" 
          value={stats.uniqueLocs} 
          icon={<Map size={24} />} 
          color="bg-purple-500" 
        />
      </div>

      {/* 3. Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <Table 
          columns={columns} 
          data={filteredDojos} 
          onRowClick={(row) => setSelectedDojo(row)} 
        />
      </div>

      {/* 4. Details Popup Modal */}
      {selectedDojo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedDojo(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
            
            <button 
              onClick={() => setSelectedDojo(null)}
              className="absolute top-4 right-4 z-10 bg-white/80 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="h-40 bg-gray-200 w-full relative">
              {selectedDojo.image ? (
                <img src={selectedDojo.image} className="w-full h-full object-cover" alt="Dojo" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                   <Building2 size={48} className="text-gray-300" />
                </div>
              )}
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-6 pt-16">
                 <h2 className="text-2xl font-bold text-white">{selectedDojo.name}</h2>
                 <p className="text-gray-200 text-sm">Head Instructor: {selectedDojo.instructor}</p>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${
                  selectedDojo.status === 'Active' 
                    ? 'bg-green-50 text-green-700 border-green-200' 
                    : 'bg-red-50 text-red-700 border-red-200'
                }`}>
                   <CheckCircle size={12} /> {selectedDojo.status}
                </span>
                <span className="text-sm text-gray-500 flex items-center gap-1">
                   <Users size={16} /> {selectedDojo.students} Students
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                   <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Phone</p>
                   <div className="flex items-center gap-2 text-gray-800">
                      <Phone size={16} className="text-red-500" />
                      {selectedDojo.phone}
                   </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                   <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Registered</p>
                   <div className="flex items-center gap-2 text-gray-800">
                      <Calendar size={16} className="text-red-500" />
                      {new Date(selectedDojo.created_at).toLocaleDateString()}
                   </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <MapPin size={16} /> Location
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  {selectedDojo.address || "No address provided"}
                </p>
                
                {selectedDojo.location_url && (
                  <a 
                    href={selectedDojo.location_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full justify-center"
                  >
                    <ExternalLink size={16} /> View on Google Maps
                  </a>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                 <button 
                   onClick={() => navigate(`/dojos/edit/${selectedDojo.id}`)}
                   className="flex-1 bg-black text-white py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-colors"
                 >
                   Edit Details
                 </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}