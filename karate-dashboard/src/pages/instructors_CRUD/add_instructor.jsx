import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Building2, User, Phone, MapPin, ImageIcon, 
  ArrowLeft, Mail, Activity, Calendar, Star 
} from 'lucide-react';
import Forms from '../../components/Form'; // Assuming this component handles validation
// Import the new API functions
import { createInstructor, getInstructor, updateInstructor } from '../../api-service/api';

export function AddInstructor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      const fetchData = async () => {
        try {
          // Fetch specific instructor data
          const data = await getInstructor(id);
          setInitialData(data);
        } catch (error) {
          console.error(error);
          alert("Failed to load Instructor data");
          navigate('/instructors');
        }
      };
      fetchData();
    }
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
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
    }
  };

  // --- UPDATED FIELDS LIST (All 8 Fields - ALL REQUIRED) ---
  const fields = [
    // 1. Name
    { 
      name: 'name', 
      label: 'Full Name', 
      type: 'text', 
      placeholder: 'e.g. John Doe', 
      icon: <User size={20}/>, 
      required: true,
      defaultValue: initialData?.name 
    },
    // 2. Rank
    { 
      name: 'rank', 
      label: 'Rank / Belt', 
      type: 'text', 
      placeholder: 'e.g. 3rd Dan Black Belt', 
      icon: <Star size={20}/>, 
      required: true,
      defaultValue: initialData?.rank 
    },
    // 3. Age
    { 
      name: 'age', 
      label: 'Age', 
      type: 'number', 
      placeholder: 'e.g. 35', 
      icon: <Activity size={20}/>, 
      required: true,
      defaultValue: initialData?.age 
    },
    // 4. Email
    { 
      name: 'email', 
      label: 'Email Address', 
      type: 'email', 
      placeholder: 'e.g. sensei@dojo.com', 
      icon: <Mail size={20}/>, 
      required: true,
      defaultValue: initialData?.email 
    },
    // 5. Phone
    { 
      name: 'phone', 
      label: 'Phone Number', 
      type: 'text', 
      placeholder: 'e.g. 555-0199', 
      icon: <Phone size={20}/>, 
      required: true,
      defaultValue: initialData?.phone 
    },
    // 6. Status
    { 
      name: 'status', 
      label: 'Status', 
      type: 'text', 
      placeholder: 'e.g. Active', 
      icon: <Building2 size={20}/>, 
      required: true, 
      defaultValue: initialData?.status 
    },
    // 7. DOB
    { 
      name: 'dob', 
      label: 'Date of Birth', 
      type: 'date', 
      placeholder: 'YYYY-MM-DD', 
      icon: <Calendar size={20}/>, 
      required: true, 
      defaultValue: initialData?.dob 
    },
    // 8. Image
    { 
      name: 'image', 
      label: 'Profile Image URL', 
      type: 'url', 
      placeholder: 'https://example.com/photo.jpg', 
      icon: <ImageIcon size={20}/>, 
      required: true, 
      defaultValue: initialData?.image 
    },
  ];

  if (isEditMode && !initialData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading Instructor Details...</div>
      </div>
    );
  }

  return (
    <div className="p-6 w-full ">
      <button 
        onClick={() => navigate('/instructors')} 
        className="flex items-center text-gray-600 hover:text-black mb-6 gap-2 transition-colors"
      >
        <ArrowLeft size={20} /> Back to Instructors List
      </button>

      <Forms 
        key={isEditMode ? initialData?.id : 'new'} 
        title={isEditMode ? "Edit Instructor Details" : "Add New Instructor"}
        subtitle={isEditMode ? "Update instructor profile information" : "Register a new instructor into the system"}
        fields={fields}
        onSubmit={handleSubmit}
        submitLabel={isEditMode ? "Save Changes" : "Create Instructor"}
        fullWidth={true} 
        gridCols={2} 
      />
    </div>
  );
}