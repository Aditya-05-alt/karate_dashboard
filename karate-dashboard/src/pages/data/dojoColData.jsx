import React from 'react';
import { Edit, Trash2, MapPin, Image as ImageIcon } from 'lucide-react';

export const dojoColumns = [
  {
    label: 'Image',
    key: 'image',
    render: (row) => (
      <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
        {row.image ? (
          <img src={row.image} alt={row.name} className="w-full h-full object-cover" />
        ) : (
          <ImageIcon className="text-gray-400 w-6 h-6" />
        )}
      </div>
    )
  },
  { 
    label: 'Dojo Name', 
    key: 'name', 
    sortable: true,
    render: (row) => (
      <div>
        <span className="font-bold text-gray-800 block">{row.name}</span>
        <span className="text-xs text-gray-500 flex items-center gap-1">
           <MapPin size={10} /> Los Angeles, CA
        </span>
      </div>
    )
  },
  { 
    label: 'Instructor', 
    key: 'instructor', 
    sortable: true,
    render: (row) => <span className="font-medium text-gray-700">{row.instructor}</span>
  },
  { 
    label: 'Phone No', 
    key: 'phone', 
    render: (row) => <span className="text-gray-600 font-mono text-sm">{row.phone}</span>
  },
  { 
    label: 'Students', 
    key: 'students', 
    sortable: true,
    render: (row) => (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        {row.students} Active
      </span>
    )
  },
  { 
    label: 'Actions', 
    key: 'actions', 
    render: (row) => (
      <div className="flex gap-2">
        <button 
          onClick={(e) => { e.stopPropagation(); console.log('Edit', row.id); }} 
          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <Edit size={16} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); console.log('Delete', row.id); }} 
          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    )
  }
];