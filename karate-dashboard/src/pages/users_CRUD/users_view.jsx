import React, { useState, useEffect, useMemo } from 'react';
import { GraduationCap, User, Mail, Lock, X, Edit, Trash2 } from 'lucide-react';
import Table from '../../components/Table';
import { getUsers, createUser, updateUser, deleteUser } from '../../api-service/api'; 
import Forms from '../../components/Form';
import SearchBar from '../../components/SearchBar';

export function UserView() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Edit State
  const [editingUser, setEditingUser] = useState(null); 
  const [searchTerm, setSearchTerm] = useState('');

  // Filter logic
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  // --- ACTIONS ---
  const handleOpenCreate = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        await loadUsers();
      } catch (error) {
        alert("Failed to delete user");
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingUser) {
        await updateUser(editingUser.id, formData);
        alert("User updated successfully!");
      } else {
        await createUser(formData);
        alert("User created successfully!");
      }
      setIsModalOpen(false);
      await loadUsers();
    } catch (error) {
      console.error(error);
      const msg = error.message || (error.errors ? Object.values(error.errors)[0][0] : "Operation failed");
      alert(msg);
    }
  };

  // --- COLUMNS ---
  const columns = useMemo(() => [
    { label: 'SL no', key: 'id', sortable: true },
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
          <button 
            onClick={(e) => { e.stopPropagation(); handleOpenEdit(row); }}
            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Edit size={16} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); handleDelete(row.id); }}
            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ], []);

  // --- FORM FIELDS ---
  const userFormFields = [
    {
      name: 'name',
      label: 'Full Name',
      type: 'text',
      placeholder: 'John Doe',
      icon: <User size={20} />,
      defaultValue: editingUser?.name || ''
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'john@dojo.com',
      icon: <Mail size={20} />,
      defaultValue: editingUser?.email || ''
    },
    {
      name: 'password',
      label: editingUser ? 'New Password (Optional)' : 'Password',
      type: 'password',
      placeholder: editingUser ? 'Leave empty to keep current' : 'Secure Password',
      icon: <Lock size={20} />,
      required: !editingUser
    }
  ];

  return (
    <div className="p-6 space-y-8 relative min-w-0">
      
      {/* Page Header (Title + Add Button) */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center">
          <div className="w-14 h-14 bg-black rounded-xl mr-4 flex items-center justify-center">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Users</h1>
            <p className="text-gray-500">List of all registered accounts.</p>
          </div>
        </div>

        <button 
          onClick={handleOpenCreate}
          className="bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 transition-colors shadow-sm font-medium flex items-center gap-2"
        >
           <span>+ Add New User</span>
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Table Header: Title + Search Bar */}
        <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
           <h2 className="text-lg font-semibold text-gray-800">All Users</h2>
           
           {/* --- SEARCH BAR MOVED HERE --- */}
           <div className="w-full sm:w-auto">
             <SearchBar 
               onSearch={setSearchTerm} 
               placeholder="Search users..." 
             />
           </div>
        </div>
        
        {/* Pass filteredUsers to show search results */}
        <Table columns={columns} data={filteredUsers} itemsPerPage={10} />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-transparent bg-opacity-45 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md">
            
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 bg-white rounded-full p-1"
            >
              <X size={24} />
            </button>

            <Forms 
              key={editingUser ? editingUser.id : 'create'} 
              title={editingUser ? "Edit User" : "Create New User"}
              subtitle={editingUser ? "Update user details" : "Add a new admin or instructor"}
              fields={userFormFields}
              onSubmit={handleFormSubmit}
              submitLabel={editingUser ? "Update Account" : "Create Account"}
            />
            
          </div>
        </div>
      )}

    </div>
  );
}