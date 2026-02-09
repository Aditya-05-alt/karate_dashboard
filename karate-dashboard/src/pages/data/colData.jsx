import React from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';
import BeltBadge from '../../components/Beltbadge'; // Make sure the path is correct

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
    label: 'Instructors', 
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
    // Uses the BeltBadge component for consistent styling
    render: (row) => <BeltBadge rank={row.rank} />
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
    render: (row, onEdit, onDelete, onView) => (
      <div className="flex gap-2">
         {/* View Button */}
         <button 
          onClick={(e) => { e.stopPropagation(); console.log('View', row.id); }} 
          className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors border border-green-200"
          title="View Details"
        >
          <Eye size={16} />
        </button>

        {/* Edit Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); console.log('Edit', row.id); }} 
          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
          title="Edit"
        >
          <Edit size={16} />
        </button>

        {/* Delete Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); console.log('Delete', row.id); }} 
          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    )
  }
];