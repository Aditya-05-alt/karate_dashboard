import React from 'react';
import { Edit, Trash2, Mail, Phone, User, Image as ImageIcon } from 'lucide-react';

export const instructorColumns = [
  {
    label: 'Photo',
    key: 'image',
    render: (row) => (
      <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
        {row.image ? (
          <img 
            src={row.image} 
            alt={row.name} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <User className="text-gray-400 w-6 h-6" />
        )}
      </div>
    )
  },
  { 
    label: 'Instructor Name', 
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
    label: 'Rank', 
    key: 'belt', 
    sortable: true, 
    render: (row) => {
      const colors = {
        'Black': 'bg-black text-white border-black',
        'Brown Stripe 2': 'bg-[linear-gradient(90deg,#713f12_0%,#713f12_35%,#000000_35%,#000000_42%,#713f12_42%,#713f12_58%,#000000_58%,#000000_65%,#713f12_65%)] text-white border-yellow-900',
        'Green Stripe': 'bg-[linear-gradient(90deg,#16a34a_0%,#16a34a_45%,#000000_45%,#000000_55%,#16a34a_55%,#16a34a_100%)] text-white border-green-600',
      };
      const style = colors[row.belt] || 'bg-gray-200 text-gray-800';
      
      return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${style}`}>
          {row.belt}
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
    label: 'Contact Info', 
    key: 'email', 
    render: (row) => (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-xs text-gray-600">
           <Mail size={12} /> {row.email}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
           <Phone size={12} /> {row.phone}
        </div>
      </div>
    )
  },
  { 
    label: 'DOB', 
    key: 'dob', 
    sortable: true,
    render: (row) => <span className="text-sm text-gray-600">{row.dob}</span>
  },
  { 
    label: 'Status', 
    key: 'status', 
    sortable: true,
    render: (row) => (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        row.status === 'Active' ? 'bg-green-100 text-green-800' : 
        row.status === 'Suspended' ? 'bg-red-100 text-red-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {row.status}
      </span>
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