import React from 'react';
import { Edit, Trash2, Mail } from 'lucide-react';

export const Usercolumns = [
  { 
    label: 'SL no', 
    key: 'id', 
    sortable: true,
  },
  { 
    label: 'Name', 
    key: 'name', 
    sortable: true,
    render: (row) => (
      <div>
        <span className="font-bold text-gray-800 block">{row.name}</span>
        <span className="text-xs text-gray-500">ID: #{row.id}</span>
      </div>
    )
  },
  { 
    label: 'Email', 
    key: 'email', 
    render: (row) => (
      <div className="flex items-center gap-2 text-sm text-gray-600">
         <Mail size={14} /> {row.email}
      </div>
    )
  },
  { 
    label: 'Actions', 
    key: 'actions', 
    render: (row) => (
      <div className="flex gap-2">
        <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
          <Edit size={16} />
        </button>
        <button className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
          <Trash2 size={16} />
        </button>
      </div>
    )
  }
];