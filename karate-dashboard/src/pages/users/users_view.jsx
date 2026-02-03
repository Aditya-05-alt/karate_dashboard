import React, { useState, useEffect } from 'react';
import { GraduationCap } from 'lucide-react';
import Table from '../../components/Table';
import { Usercolumns } from '../data/userCol';
import { getUsers } from '../../api-service/api';
  // Ensure this function exists in your api.js

export function UserView() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Users on Component Mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers(); // Calls Laravel API: /api/users
      setUsers(data);
    } catch (err) {
      console.error("Failed to load users", err);
      setError("Failed to load user data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-8 relative min-w-0">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-wrap">
        <div className="flex items-center">
          <div className="w-14 h-14 bg-black rounded-xl mr-4 flex-shrink-0 flex items-center justify-center">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-3xl font-bold text-gray-800">System Users</h1>
            <p className="text-gray-500 mt-1">Manage admins and instructors.</p>
          </div>
        </div>

        <button className="bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 transition-colors shadow-sm font-medium flex items-center gap-2 whitespace-nowrap">
           <span>+ Add Admin</span>
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
           <div>
             <h2 className="text-lg font-semibold text-gray-800">Admin</h2>
            
           </div>
           {loading && <span className="text-sm text-blue-600 animate-pulse">Syncing...</span>}
        </div>
        
        {error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : (
          <Table 
            columns={Usercolumns} 
            data={users} 
            itemsPerPage={25}
            onRowClick={(user) => setSelectedUser(user)}
          />
        )}
      </div>

      {/* Simplified Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full animate-in fade-in zoom-in duration-200">
                <h2 className="text-2xl font-bold mb-1 text-gray-800">{selectedUser.name}</h2>
                <p className="text-gray-500 text-sm mb-6">User ID: #{selectedUser.id}</p>
                
                <div className="space-y-4 mb-8">
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Email Address:</span>
                        <span className="font-medium">{selectedUser.email}</span>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button 
                        onClick={() => setSelectedUser(null)}
                        className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}