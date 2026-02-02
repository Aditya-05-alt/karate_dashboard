import React, { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

const Table = ({ columns, data, itemsPerPage = 25, onRowClick }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);

  // --- Sorting Logic ---
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  // --- Pagination Logic ---
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return <ChevronsUpDown size={16} className="text-gray-400" />;
    if (sortConfig.direction === 'asc') return <ChevronUp size={16} className="text-blue-600" />;
    return <ChevronDown size={16} className="text-blue-600" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col w-full">
      
      {/* 1. CONTAINER: 'overflow-x-auto' handles the scrollbar. 'w-full' fits the parent. */}
      <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        
        {/* 2. TABLE: 
            - 'min-w-full': Ensures it fills the screen if there are few columns.
            - We REMOVED specific pixel widths (like min-w-[800px]). 
            - We rely on the content to push the width out.
        */}
        <table className="min-w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 border-b border-gray-200 uppercase font-medium text-gray-500">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  // 3. CELLS: 'whitespace-nowrap' is the secret sauce. 
                  // It forces the table to grow wide if content is long, triggering scroll.
                  className={`px-6 py-4 whitespace-nowrap ${col.sortable ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-2">
                    {col.label}
                    {col.sortable && getSortIcon(col.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <tr 
                  key={rowIndex} 
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`hover:bg-gray-50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {columns.map((col, colIndex) => (
                    // Same here: 'whitespace-nowrap' keeps rows on one line
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-400">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer (Unchanged) */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
        <div className="text-sm text-gray-500 hidden sm:block">
          Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
          <span className="font-medium">
            {Math.min(currentPage * itemsPerPage, sortedData.length)}
          </span>{' '}
          of <span className="font-medium">{sortedData.length}</span> results
        </div>
        <div className="text-sm text-gray-500 sm:hidden">
          {currentPage} / {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-medium text-gray-700 hidden sm:block">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Table;