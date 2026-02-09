import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Building2, User, Phone, MapPin, Link as LinkIcon, Image as ImageIcon, ArrowLeft, Users, Activity } from 'lucide-react';
import Forms from '../../components/Form';
import { createDojo, getDojo, updateDojo } from '../../api-service/api';

export function AddDojo() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      const fetchData = async () => {
        try {
          const data = await getDojo(id);
          setInitialData(data);
        } catch (error) {
          alert("Failed to load Dojo data");
          navigate('/dojos');
        }
      };
      fetchData();
    }
  }, [id]);

  const handleSubmit = async (formData) => {
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
    }
  };

  // --- UPDATED FIELDS LIST (All 8 Fields) ---
  const fields = [
    // 1. Name
    { 
      name: 'name', 
      label: 'Dojo Name', 
      type: 'text', 
      placeholder: 'e.g. Miyagi-Do', 
      icon: <Building2 size={20}/>, 
      defaultValue: initialData?.name 
    },
    // 2. Instructor
    { 
      name: 'instructor', 
      label: 'Head Instructor', 
      type: 'text', 
      placeholder: 'e.g. Daniel LaRusso', 
      icon: <User size={20}/>, 
      defaultValue: initialData?.instructor 
    },
    // 3. Phone
    { 
      name: 'phone', 
      label: 'Phone Number', 
      type: 'text', 
      placeholder: '555-0199', 
      icon: <Phone size={20}/>, 
      defaultValue: initialData?.phone 
    },
    // 4. Students (New)
    { 
      name: 'students', 
      label: 'Number of Students', 
      type: 'number', 
      placeholder: '0', 
      icon: <Users size={20}/>, 
      defaultValue: initialData?.students || 0
    },
    // 5. Status (New)
    { 
      name: 'status', 
      label: 'Status', 
      type: 'text', 
      placeholder: 'Active or Inactive', 
      icon: <Activity size={20}/>, 
      defaultValue: initialData?.status || 'Active' 
    },
    // 6. Address
    { 
      name: 'address', 
      label: 'Address (Optional)', 
      type: 'text', 
      placeholder: '123 Valley Rd', 
      icon: <MapPin size={20}/>, 
      required: false, 
      defaultValue: initialData?.address 
    },
    // 7. Map Link
    { 
      name: 'location_url', 
      label: 'Map Link (Optional)', 
      type: 'url', 
      placeholder: 'https://maps.google.com/...', 
      icon: <LinkIcon size={20}/>, 
      required: false, 
      defaultValue: initialData?.location_url 
    },
    // 8. Image
    { 
      name: 'image', 
      label: 'Image URL (Optional)', 
      type: 'url', 
      placeholder: 'https://...', 
      icon: <ImageIcon size={20}/>, 
      required: false, 
      defaultValue: initialData?.image 
    },
  ];

  if (isEditMode && !initialData) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <div className="p-6 w-full">
      <button onClick={() => navigate('/dojos')} className="flex items-center text-gray-500 hover:text-gray-800 mb-6 gap-2">
        <ArrowLeft size={20} /> Back to List
      </button>

      <Forms 
        key={isEditMode ? initialData?.id : 'new'} 
        title={isEditMode ? "Edit Dojo Details" : "Add New Dojo"}
        subtitle={isEditMode ? "Update location information" : "Register a new branch"}
        fields={fields}
        onSubmit={handleSubmit}
        submitLabel={isEditMode ? "Save Changes" : "Create Dojo"}
        
        // Use grid layout for better spacing of 8 fields
        fullWidth={true} 
        gridCols={2} 
      />
    </div>
  );
}