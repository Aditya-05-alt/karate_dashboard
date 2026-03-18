import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  User, Calendar, Phone, Shield, Building2, GraduationCap, 
  Upload, FileSpreadsheet, ArrowLeft, Loader2, CheckCircle, Activity 
} from 'lucide-react';
import * as XLSX from 'xlsx';

// IMPORT: getStudent and updateStudent for edit mode
import { getDojos, getInstructors, createStudent, getStudent, updateStudent } from '../../api-service/api';

const RANKS = [
  'White', 'Yellow', 'Yellow Stripe', 'Orange', 'Green', 
  'Green Stripe', 'Blue', 'Purple', 'Brown', 
  'Brown Stripe 1', 'Brown Stripe 2', 'Black'
];

const STATUS_OPTIONS = ['Active', 'Inactive', 'Suspended'];

export function AddStudent() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id; // True if an ID is in the URL

  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('single'); // 'single' or 'bulk'
  
  const [dojoOptions, setDojoOptions] = useState([]);
  const [instructorOptions, setInstructorOptions] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    age: '',
    phone: '',
    rank: 'White',
    status: 'Active',
    dojo_id: '',       
    instructor_id: ''  
  });

  const [bulkData, setBulkData] = useState([]);
  const [bulkStatus, setBulkStatus] = useState(null); 

  // 1. Fetch Dropdowns & Student Data (if editing)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Dropdowns
        const [dojos, instructors] = await Promise.all([
          getDojos(),
          getInstructors()
        ]);
        setDojoOptions(dojos || []);
        setInstructorOptions(instructors || []);

        // If in Edit Mode, fetch the specific student
        if (isEditMode) {
          const studentData = await getStudent(id);
          setFormData({
            name: studentData.name || '',
            dob: studentData.dob || '',
            age: studentData.age || '',
            phone: studentData.phone || '',
            rank: studentData.rank || 'White',
            status: studentData.status || 'Active',
            dojo_id: studentData.dojo_id || '',
            instructor_id: studentData.instructor_id || ''
          });
        }
      } catch (error) {
        console.error("Failed to load data", error);
        if (isEditMode) {
            alert("Failed to load student data");
            navigate('/students');
        }
      }
    };
    fetchData();
  }, [id, isEditMode, navigate]);

  // 2. Handle Input Changes
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

  // 3. Handle Form Submit (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditMode) {
        await updateStudent(id, formData);
        alert("Student updated successfully!");
      } else {
        await createStudent(formData);
        alert("Student added successfully!");
      }
      navigate('/students');
    } catch (error) {
      console.error(error);
      alert("Operation failed. Check all fields.");
    } finally {
      setLoading(false);
    }
  };

  // 4. Handle File Upload (Bulk)
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      setBulkData(data);
    };
    reader.readAsBinaryString(file);
    e.target.value = null; 
  };

  // 5. Process Bulk Data
// 5. Process Bulk Data
  const processBulkUpload = async () => {
    if (!window.confirm(`Are you sure you want to upload ${bulkData.length} students?`)) return;
    
    setBulkStatus('uploading');
    let successCount = 0;
    let errors = 0;

    // --- NEW: Helper function to fix Excel dates ---
    const formatExcelDate = (excelDate) => {
        if (!excelDate) return '';
        
        // 1. If Excel turned it into a serial number (e.g., 39540)
        if (typeof excelDate === 'number') {
            const date = new Date(Math.round((excelDate - 25569) * 86400 * 1000));
            return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
        }
        
        // 2. If it's a string or JS Date object, ensure YYYY-MM-DD format
        const d = new Date(excelDate);
        if (!isNaN(d.getTime())) {
            return d.toISOString().split('T')[0]; 
        }
        
        return excelDate; // Fallback
    };

    for (const row of bulkData) {
      try {
        const payload = {
            name: row['Name'] || row['name'],
            rank: row['Rank'] || row['rank'] || 'White',
            
            // --- NEW: Wrap the DOB in our helper function ---
            dob: formatExcelDate(row['DOB'] || row['dob']),
            
            phone: row['Phone'] || row['phone'] || '',
            age: row['Age'] || row['age'] || null,
            status: row['Status'] || row['status'] || 'Active',
            dojo_id: row['Dojo ID'] || (dojoOptions.length > 0 ? dojoOptions[0].id : null), 
            instructor_id: row['Instructor ID'] || (instructorOptions.length > 0 ? instructorOptions[0].id : null)
        };
        
        await createStudent(payload);
        successCount++;
      } catch (err) {
        console.error("Failed to upload row:", row, err.response?.data || err);
        errors++;
      }
    }

    setBulkStatus('success');
    alert(`Upload Complete. Success: ${successCount}, Failed: ${errors}`);
    if (successCount > 0) navigate('/students');
  };

  // Wait for data to load before rendering edit form
  if (isEditMode && !formData.name) {
    return <div className="p-10 text-center text-gray-500">Loading student details...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      
      {/* Back Button */}
      <div className="max-w-full mx-auto mb-6">
        <button 
          onClick={() => navigate('/students')}
          className="flex items-center text-gray-600 hover:text-black transition-colors font-medium"
        >
          <ArrowLeft size={20} className="mr-2" /> Back to Student List
        </button>
      </div>

      <div className="max-w-full mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        
        {/* Card Header & Toggles */}
        <div className="pt-8 pb-4 px-8 bg-white">
            <div className="text-center mb-6">
                <h1 className="text-3xl font-extrabold text-gray-900">
                  {isEditMode ? "Edit Student Details" : "Add New Student"}
                </h1>
                <p className="mt-2 text-gray-500">
                  {isEditMode ? "Update student information and rank" : "Register a new dojo member"}
                </p>
            </div>

            {/* Mode Toggle (Hide during Edit Mode) */}
            {!isEditMode && (
                <div className="flex p-1 bg-gray-100 rounded-xl mx-auto max-w-sm mb-4">
                    <button
                        onClick={() => setMode('single')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${
                            mode === 'single' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <User size={18} /> Manual Entry
                    </button>
                    <button
                        onClick={() => setMode('bulk')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${
                            mode === 'bulk' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <FileSpreadsheet size={18} /> Bulk Import
                    </button>
                </div>
            )}
        </div>

        {/* Content Area */}
        <div className="p-2 md:p-10 border-t border-gray-100">
            
            {/* --- MODE 1: SINGLE ENTRY FORM --- */}
            {(mode === 'single' || isEditMode) && (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Student Name */}
                        <div className="col-span-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Student Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input 
                                    required
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none text-gray-900 placeholder-gray-400"
                                    placeholder="e.g. Miguel Diaz"
                                />
                            </div>
                        </div>

                        {/* Dojo */}
                        <div className="col-span-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Dojo</label>
                            <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Building2 className="h-5 w-5 text-gray-400" />
                                </div>
                                <select 
                                    required
                                    name="dojo_id"
                                    value={formData.dojo_id}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none bg-white appearance-none text-gray-900"
                                >
                                    <option value="">Select Dojo</option>
                                    {dojoOptions.map(d => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
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
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none text-gray-900"
                                />
                            </div>
                        </div>

                        {/* Instructor */}
                        <div className="col-span-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Instructor</label>
                            <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <GraduationCap className="h-5 w-5 text-gray-400" />
                                </div>
                                <select 
                                    required
                                    name="instructor_id"
                                    value={formData.instructor_id}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none bg-white appearance-none text-gray-900"
                                >
                                    <option value="">Select Instructor</option>
                                    {instructorOptions.map(i => (
                                        <option key={i.id} value={i.id}>{i.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Phone Number */}
                        <div className="col-span-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                </div>
                                <input 
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none text-gray-900 placeholder-gray-400"
                                    placeholder="(555) 000-0000"
                                />
                            </div>
                        </div>

                        {/* Rank */}
                        <div className="col-span-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Rank</label>
                            <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Shield className="h-5 w-5 text-gray-400" />
                                </div>
                                <select 
                                    name="rank"
                                    value={formData.rank}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none bg-white appearance-none text-gray-900"
                                >
                                    {RANKS.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="col-span-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                            <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Activity className="h-5 w-5 text-gray-400" />
                                </div>
                                <select 
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none bg-white appearance-none text-gray-900"
                                >
                                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Age (Read Only) */}
                        <div className="col-span-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Age</label>
                            <input 
                                type="number"
                                readOnly
                                name="age"
                                value={formData.age}
                                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed outline-none"
                                placeholder="Auto-calculated"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-red-600 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mt-8"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : (isEditMode ? 'Save Changes' : 'Create Student')}
                    </button>
                </form>
            )}

            {/* --- MODE 2: BULK UPLOAD FORM --- */}
            {mode === 'bulk' && !isEditMode && (
                <div className="space-y-8 animate-in fade-in duration-300">
                    <div className="text-center space-y-4">
                        <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm inline-block">
                            <span className="font-bold block mb-1">Instructions:</span>
                            Upload an Excel (.xlsx) file with columns: <br/>
                            <code className="bg-blue-100 px-1 rounded font-mono">Name, Rank, DOB, Phone, Dojo ID, Instructor ID</code>
                        </div>

                        <label className="block w-full border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center cursor-pointer hover:border-red-500 hover:bg-red-50 transition-all group">
                            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-white group-hover:shadow-md transition-all">
                                <Upload className="text-gray-400 group-hover:text-red-600" size={32} />
                            </div>
                            <span className="text-lg font-semibold text-gray-700 group-hover:text-gray-900">Click to upload Excel file</span>
                            <p className="text-sm text-gray-400 mt-1">or drag and drop here</p>
                            <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="hidden" />
                        </label>
                    </div>

                    {bulkData.length > 0 && (
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                    <CheckCircle size={20} className="text-green-600" />
                                    {bulkData.length} Students Ready
                                </h3>
                                <button onClick={() => setBulkData([])} className="text-sm text-red-600 hover:text-red-800 font-medium hover:underline">Clear Data</button>
                            </div>

                            <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg bg-white mb-6">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-500 font-medium sticky top-0">
                                        <tr>
                                            <th className="p-3 border-b">Name</th>
                                            <th className="p-3 border-b">Rank</th>
                                            <th className="p-3 border-b">Phone</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {bulkData.map((row, i) => (
                                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                                                <td className="p-3 font-medium text-gray-900">{row.Name || row.name}</td>
                                                <td className="p-3 text-gray-600">
                                                  <span className="bg-gray-100 px-2 py-1 rounded-md">{row.Rank || row.rank}</span>
                                                </td>
                                                <td className="p-3 text-gray-600">{row.Phone || row.phone}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <button 
                                onClick={processBulkUpload}
                                disabled={bulkStatus === 'uploading'}
                                className="w-full bg-green-600 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                            >
                                {bulkStatus === 'uploading' ? <Loader2 className="animate-spin" /> : 'Confirm Bulk Import'}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}