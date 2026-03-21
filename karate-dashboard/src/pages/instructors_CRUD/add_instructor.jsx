import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  User, Phone, MapPin, Image as ImageIcon, 
  ArrowLeft, Mail, Activity, Calendar, Star, Loader2 
} from 'lucide-react';
import { createInstructor, getInstructor, updateInstructor } from '../../api-service/api';

const RANKS = [
  'Black (Shodan)', 'Black (Nidan)', 'Black (Sandan)', 'Black (Yondan)'
];

const STATUS_OPTIONS = ['Active', 'Inactive'];

export function AddInstructor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    rank: 'Black (Shodan)',
    age: '',
    email: '',
    phone: '',
    status: 'Active',
    dob: '',
    image: ''
  });

  // 1. Fetch Instructor Data for Edit Mode
  useEffect(() => {
    if (isEditMode) {
      const fetchData = async () => {
        try {
          const data = await getInstructor(id);
          setFormData({
            name: data.name || '',
            rank: data.rank || 'Black (Shodan)',
            age: data.age || '',
            email: data.email || '',
            phone: data.phone || '',
            status: data.status || 'Active',
            dob: data.dob || '',
            image: data.image || ''
          });
        } catch (error) {
          console.error(error);
          alert("Failed to load Instructor data");
          navigate('/instructors');
        }
      };
      fetchData();
    }
  }, [id, navigate]);

  // 2. Handle Input Changes & Auto-Calculate Age
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-calculate Age if DOB changes
    if (name === 'dob') {
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setFormData(prev => ({ ...prev, dob: value, age: age }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // 3. Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditMode) {
        await updateInstructor(id, formData);
        alert("Instructor updated successfully!");
      } else {
        await createInstructor(formData);
        alert("Instructor created successfully!");
      }
      navigate('/instructors');
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Operation failed. Please check inputs.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  if (isEditMode && !formData.name) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Loading Instructor Details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      
      {/* Back Button */}
      <div className="max-w-full mx-auto mb-6">
        <button 
          onClick={() => navigate('/instructors')}
          className="flex items-center text-gray-600 hover:text-black transition-colors font-medium"
        >
          <ArrowLeft size={20} className="mr-2" /> Back to Instructors List
        </button>
      </div>

      <div className="max-w-full mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        
        {/* Card Header */}
        <div className="pt-8 pb-4 px-8 bg-white">
            <div className="text-center mb-6">
                <h1 className="text-3xl font-extrabold text-gray-900">
                  {isEditMode ? "Edit Instructor Details" : "Add New Instructor"}
                </h1>
                <p className="mt-2 text-gray-500">
                  {isEditMode ? "Update instructor profile information" : "Register a new instructor into the system"}
                </p>
            </div>
        </div>

        {/* Form Content Area */}
        <div className="p-8 md:p-10 border-t border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Full Name */}
                    <div className="col-span-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input 
                                required
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 outline-none text-gray-900 placeholder-gray-400"
                                placeholder="e.g. John Doe"
                            />
                        </div>
                    </div>

                    {/* Rank / Belt (Dropdown) */}
                    <div className="col-span-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Rank / Belt</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Star className="h-5 w-5 text-gray-400" />
                            </div>
                            <select 
                                required
                                name="rank"
                                value={formData.rank}
                                onChange={handleChange}
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 outline-none bg-white text-gray-900 appearance-none"
                            >
                                {RANKS.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Date of Birth */}
                    <div className="col-span-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Calendar className="h-5 w-5 text-gray-400" />
                            </div>
                            <input 
                                type="date"
                                required
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 outline-none text-gray-900"
                            />
                        </div>
                    </div>

                    {/* Age (Read Only - Auto Calculated) */}
                    <div className="col-span-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Age</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Activity className="h-5 w-5 text-gray-400" />
                            </div>
                            <input 
                                type="number"
                                required
                                readOnly
                                name="age"
                                value={formData.age}
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed outline-none"
                                placeholder="Auto-calculated"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="col-span-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input 
                                type="email"
                                required
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 outline-none text-gray-900 placeholder-gray-400"
                                placeholder="sensei@dojo.com"
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="col-span-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Phone className="h-5 w-5 text-gray-400" />
                            </div>
                            <input 
                                type="text"
                                required
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 outline-none text-gray-900 placeholder-gray-400"
                                placeholder="555-0199"
                            />
                        </div>
                    </div>

                    {/* Status (Dropdown) */}
                    <div className="col-span-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Activity className="h-5 w-5 text-gray-400" />
                            </div>
                            <select 
                                required
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 outline-none bg-white text-gray-900 appearance-none"
                            >
                                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Image URL */}
                    <div className="col-span-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Image URL</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <ImageIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input 
                                type="url"
                                required
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 outline-none text-gray-900 placeholder-gray-400"
                                placeholder="https://example.com/photo.jpg"
                            />
                        </div>
                    </div>

                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-red-600 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mt-8"
                >
                    {loading ? <Loader2 className="animate-spin" /> : (isEditMode ? 'Save Changes' : 'Create Instructor')}
                </button>
            </form>
        </div>
      </div>
    </div>
  );
}