import React from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';

export const columns = [
  { 
    label: 'Name', 
    key: 'name', 
    sortable: true,
    render: (row) => <span className="font-semibold text-gray-800">{row.name}</span>
  },
  { 
    label: 'Dojo', 
    key: 'dojo', 
    sortable: true,
    render: (row) => <span className="text-gray-500">{row.dojo}</span>
  },
  { 
    label: 'Date of Birth', 
    key: 'dob', 
    sortable: true 
  },
  {
    label: 'Instrutors', 
    key: 'instructors', 
    sortable: true 
  },
  { 
    label: 'Phone Number', 
    key: 'phone', 
    sortable: false
  },
  { 
    label: 'Rank', 
    key: 'rank', 
    sortable: true, 
    render: (row) => {
      // Logic for different belt colors
      // Inside src/data/colData.jsx -> columns -> render function:

const colors = {
  // --- Solid Belts ---
  Black: 'bg-black text-white border-black',
  Brown: 'bg-yellow-900 text-white border-yellow-900',
  Green: 'bg-green-600 text-white border-green-600',
  Purple: 'bg-purple-400 text-white border-purple-400',
  Blue: 'bg-blue-400 text-white border-blue-400',
  Orange: 'bg-orange-400 text-gray-800 border-orange-400',
  Yellow: 'bg-yellow-400 text-gray-800 border-yellow-400',
  White: 'bg-white text-gray-800 border-gray-300 border',
  
  // --- Striped Belts (Black Stripes) ---
  
  // Yellow with a BLACK stripe
  'Yellow Stripe': 'bg-[linear-gradient(90deg,#facc15_0%,#facc15_45%,#000000_45%,#000000_55%,#facc15_55%,#facc15_100%)] text-white border-yellow-400 shadow-sm',
  
  // Green with a BLACK stripe
  'Green Stripe': 'bg-[linear-gradient(90deg,#16a34a_0%,#16a34a_45%,#000000_45%,#000000_55%,#16a34a_55%,#16a34a_100%)] text-white border-green-600 shadow-sm',
  
  // Brown with 1 BLACK stripe
  'Brown Stripe 1': 'bg-[linear-gradient(90deg,#713f12_0%,#713f12_45%,#000000_45%,#000000_55%,#713f12_55%,#713f12_100%)] text-white border-yellow-900 shadow-sm',
  
  // Brown with 2 BLACK stripes
  'Brown Stripe 2': 'bg-[linear-gradient(90deg,#713f12_0%,#713f12_35%,#000000_35%,#000000_42%,#713f12_42%,#713f12_58%,#000000_58%,#000000_65%,#713f12_65%)] text-white border-yellow-900 shadow-sm'
};

// ... existing return statement ...
      const style = colors[row.rank] || 'bg-gray-200 text-gray-800';
      
      return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${style}`}>
          {row.rank} Belt
        </span>
      );
    }
  },
  { 
    label: 'Age', 
    key: 'age', 
    sortable: true 
  },
  { 
    label: 'Status', 
    key: 'status', 
    sortable: true,
    render: (row) => (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
        row.status === 'Active' ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20' : 'bg-red-50 text-red-700 ring-1 ring-red-600/20'
      }`}>
        <span className={`w-1.5 h-1.5 rounded-full ${
          row.status === 'Active' ? 'bg-green-600' : 'bg-red-600'
        }`}></span>
        {row.status}
      </span>
    )
  },
  { 
    label: 'Actions', 
    key: 'actions', 
    render: (row) => (
      <div className="flex gap-2">
          <button 
          onClick={() => console.log('View', row.id)} 
          className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
          title="View Student Details"
        >
          <Eye size={16} />
        </button>
        <button 
          onClick={() => console.log('Edit', row.id)} 
          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          title="Edit Student"
        >
          <Edit size={16} />
        </button>
        <button 
          onClick={() => console.log('Delete', row.id)} 
          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
          title="Delete Student"
        >
          <Trash2 size={16} />
        </button>
      </div>
    )
  }
];