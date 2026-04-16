import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Building2, User, Phone, MapPin, Link as LinkIcon, Image as ImageIcon, 
  ArrowLeft, Activity, Upload, FileSpreadsheet, CheckCircle, Loader2 
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { createDojo, getDojo, updateDojo, getInstructors } from '../../api-service/api';

export function AddDojo() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('single'); 
  
  const [instructorOptions, setInstructorOptions] = useState([]);

  // FIXED: Changed 'instructor' to 'instructor_id'
  const [formData, setFormData] = useState({
    name: '',
    instructor_id: '', 
    phone: '',
    status: 'Active',
    address: '',
    location_url: '',
    image: ''
  });

  const [bulkData, setBulkData] = useState([]);
  const [bulkStatus, setBulkStatus] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const instructorsData = await getInstructors();
        setInstructorOptions(instructorsData);

        if (isEditMode) {
          const data = await getDojo(id);
          setFormData({
            name: data.name || '',
            instructor_id: data.instructor_id || '', // FIXED: Use ID
            phone: data.phone || '',
            status: data.status || 'Active',
            address: data.address || '',
            location_url: data.location_url || '',
            image: data.image || ''
          });
        }
      } catch (error) {
        console.error("Failed to load data", error);
        if (isEditMode) {
             alert("Failed to load Dojo data");
             navigate('/dojos');
        }
      }
    };
    fetchData();
  }, [id, isEditMode, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditMode) {
        await updateDojo(id, formData);
        alert("Dojo updated successfully!");
      } else {
        await createDojo(formData);
        alert("Dojo created successfully!");
      }
      navigate('/dojos');
    } catch (error) {
      console.error(error);
      alert("Operation failed. Check if all required fields are filled.");
    } finally {
      setLoading(false);
    }
  };

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

  const processBulkUpload = async () => {
    if (!window.confirm(`Are you sure you want to upload ${bulkData.length} dojos?`)) return;
    
    setBulkStatus('uploading');
    let successCount = 0;
    let errors = 0;

    for (const row of bulkData) {
      try {
        // FIXED: Match Excel Instructor Name to the actual Database ID
        const excelInstName = row['Instructor'] || row['instructor'];
        const matchedInst = instructorOptions.find(
            i => i.name?.toLowerCase() === excelInstName?.toLowerCase()
        );
        // Fallback to the first available instructor if no match is found
        const finalInstructorId = matchedInst ? matchedInst.id : (instructorOptions.length > 0 ? instructorOptions[0].id : null);

        const payload = {
            name: row['Name'] || row['name'],
            instructor_id: finalInstructorId, // Sending ID now!
            phone: row['Phone'] || row['phone'],
            status: row['Status'] || row['status'] || 'Active',
            address: row['Address'] || row['address'] || '',
            location_url: row['Map Link'] || row['location_url'] || '',
            image: row['Image'] || row['image'] || ''
        };
        await createDojo(payload);
        successCount++;
      } catch (err) {
        console.error("Failed row:", row, err);
        errors++;
      }
    }

    setBulkStatus('success');
    alert(`Upload Complete. Success: ${successCount}, Failed: ${errors}`);
    if (successCount > 0) navigate('/dojos');
  };

  if (isEditMode && !formData.name) {
    return <div className="p-10 text-center flex flex-col items-center justify-center text-gray-500"><Loader2 className="animate-spin mb-2" /> Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      
      <div className="max-w-full mx-auto mb-6">
        <button onClick={() => navigate('/dojos')} className="flex items-center text-gray-600 hover:text-black transition-colors font-medium">
          <ArrowLeft size={20} className="mr-2" /> Back to Dojo List
        </button>
      </div>

      <div className="max-w-full mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        
        <div className="pt-8 pb-4 px-8 bg-white">
            <div className="text-center mb-6">
                <h1 className="text-3xl font-extrabold text-gray-900">
                  {isEditMode ? "Edit Dojo Details" : "Add New Dojo"}
                </h1>
                <p className="mt-2 text-gray-500">
                  {isEditMode ? "Update location information" : "Register a new branch"}
                </p>
            </div>

            {!isEditMode && (
              <div className="flex p-1 bg-gray-100 rounded-xl mx-auto max-w-sm mb-4">
                  <button
                      onClick={() => setMode('single')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${
                          mode === 'single' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                      }`}
                  >
                      <Building2 size={18} /> Manual Entry
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

        <div className="p-8 md:p-10 border-t border-gray-100">
            
            {(mode === 'single' || isEditMode) && (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        <div className="col-span-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Dojo Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Building2 className="h-5 w-5 text-gray-400" />
                                </div>
                                <input 
                                    required
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 outline-none text-gray-900"
                                    placeholder="e.g. Miyagi-Do"
                                />
                            </div>
                        </div>

                        {/* FIXED: Dropdown binds to instructor_id and sets value to inst.id */}
                        <div className="col-span-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Head Instructor</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <select 
                                    // required
                                    name="instructor_id" 
                                    value={formData.instructor_id}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 outline-none bg-white text-gray-900 appearance-none"
                                >
                                    <option value="">Select Instructor</option>
                                    {instructorOptions.map((inst) => (
                                        <option key={inst.id} value={inst.id}>
                                            {inst.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="col-span-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                </div>
                                <input 
                                    required
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 outline-none text-gray-900"
                                    placeholder="555-0199"
                                />
                            </div>
                        </div>

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
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 outline-none bg-white text-gray-900 appearance-none"
                                >
                                  <option value="Active">Active</option>
                                  <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>

                        <div className="col-span-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MapPin className="h-5 w-5 text-gray-400" />
                                </div>
                                <input 
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 outline-none text-gray-900"
                                    placeholder="123 Valley Rd"
                                />
                            </div>
                        </div>

                        <div className="col-span-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Map Link (Optional)</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <LinkIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input 
                                    type="url"
                                    name="location_url"
                                    value={formData.location_url}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 outline-none text-gray-900"
                                    placeholder="https://maps.google.com..."
                                />
                            </div>
                        </div>

                         <div className="col-span-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL (Optional)</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <ImageIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input 
                                    type="url"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 outline-none text-gray-900"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>

                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-red-600 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mt-8"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : (isEditMode ? 'Save Changes' : 'Create Dojo')}
                    </button>
                </form>
            )}

            {mode === 'bulk' && !isEditMode && (
                <div className="space-y-8 animate-in fade-in duration-300">
                    <div className="text-center space-y-4">
                        <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm inline-block">
                            <span className="font-bold block mb-1">Instructions:</span>
                            Upload an Excel (.xlsx) file with columns: <br/>
                            <code className="bg-blue-100 px-1 rounded font-mono">Name, Instructor, Phone, Address, Status</code>
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
                                    {bulkData.length} Dojos Ready
                                </h3>
                                <button onClick={() => setBulkData([])} className="text-sm text-red-600 hover:text-red-800 font-medium hover:underline">Clear Data</button>
                            </div>

                            <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg bg-white mb-6">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-500 font-medium sticky top-0">
                                        <tr>
                                            <th className="p-3 border-b">Name</th>
                                            <th className="p-3 border-b">Instructor</th>
                                            <th className="p-3 border-b">Phone</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {bulkData.map((row, i) => (
                                            <tr key={i} className="hover:bg-gray-50">
                                                <td className="p-3 font-medium text-gray-900">{row.Name || row.name}</td>
                                                <td className="p-3 text-gray-600">{row.Instructor || row.instructor}</td>
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