import React, { useState, useEffect } from 'react';
import { Filter, X, ChevronDown, Loader2 } from 'lucide-react';

/**
 * Reusable Filter Component
 * Supports both API fetching and Static Data.
 *
 * @param {string} label - The label text (e.g. "Dojo")
 * @param {function} api - (Optional) The async API function to fetch options
 * @param {array} data - (Optional) Static array of options (strings or objects)
 * @param {string} displayKey - The key to display if data is objects (default: 'name')
 * @param {string} valueKey - The key to return as value if data is objects (default: 'name')
 * @param {function} onFilterChange - Callback when selection changes
 */
const FilterComponent = ({ 
  label = "Filter", 
  api, 
  data = [], 
  displayKey = 'name', 
  valueKey = 'name',
  onFilterChange 
}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 1. If Static Data is provided, use it directly
    if (data && data.length > 0) {
      setOptions(data);
      return;
    }

    // 2. If API function is provided, fetch data
    if (api) {
      const fetchOptions = async () => {
        try {
          setLoading(true);
          const result = await api();
          setOptions(Array.isArray(result) ? result : []);
        } catch (error) {
          console.error(`Failed to load filter options for ${label}`, error);
          setOptions([]);
        } finally {
          setLoading(false);
        }
      };
      fetchOptions();
    }
  }, [api, data, label]);

  const handleSelect = (option) => {
    // Handle both object options and simple string options
    const isObject = typeof option === 'object' && option !== null;
    const value = isObject ? option[valueKey] : option;
    const display = isObject ? option[displayKey] : option;
    
    setSelected(display);
    
    // Pass the value (or empty string if clearing) to parent
    onFilterChange(value === undefined ? '' : value);
    setIsOpen(false);
  };

  const clearFilter = (e) => {
    e.stopPropagation();
    setSelected('');
    onFilterChange(''); 
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left min-w-[180px]">
      <label className="block text-xs font-bold text-gray-500 mb-1 ml-1 uppercase tracking-wide">
        {label}
      </label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3 py-2 bg-white border rounded-lg text-sm font-medium transition-all shadow-sm hover:border-gray-400 focus:ring-2 focus:ring-red-100 ${
          selected ? 'border-red-500 text-red-700 bg-red-50' : 'border-gray-200 text-gray-600'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          <Filter size={16} className={selected ? "text-red-500" : "text-gray-400"} />
          <span className="truncate">
            {selected || `All ${label}s`}
          </span>
        </div>

        <div className="flex items-center ml-2">
          {selected ? (
            <div 
              role="button"
              onClick={clearFilter} 
              className="p-1 hover:bg-red-200 rounded-full text-red-600 transition-colors"
            >
              <X size={14} />
            </div>
          ) : (
            <ChevronDown size={16} className="text-gray-400" />
          )}
        </div>
      </button>

      {isOpen && (
        <>
          {/* Close when clicking outside */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          
          <div className="absolute z-20 mt-1 w-full bg-white rounded-lg shadow-xl border border-gray-200 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
            {loading ? (
              <div className="p-4 flex justify-center items-center text-gray-400 text-sm">
                <Loader2 size={16} className="animate-spin mr-2" /> Loading...
              </div>
            ) : options.length > 0 ? (
              <div className="py-1">
                {/* Default "All" Option */}
                <button
                  onClick={() => handleSelect('')}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                    selected === '' ? 'bg-gray-100 font-semibold text-gray-900' : 'text-gray-700'
                  }`}
                >
                  All {label}s
                </button>

                {options.map((opt, idx) => {
                  const isObject = typeof opt === 'object' && opt !== null;
                  const display = isObject ? opt[displayKey] : opt;
                  const isSelected = selected === display;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(opt)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                        isSelected ? 'bg-red-50 text-red-700 font-semibold' : 'text-gray-700'
                      }`}
                    >
                      {display}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-gray-400">
                No options found
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FilterComponent;