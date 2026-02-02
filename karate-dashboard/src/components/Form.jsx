import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Forms = ({ title, subtitle, fields, onSubmit, submitLabel = "Submit", extraLinks }) => {
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Initialize state with empty strings for controlled inputs
  // (Optional: you can do this inside useEffect if needed)
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900">{title}</h2>
        {subtitle && <p className="text-gray-500 mt-2 text-sm">{subtitle}</p>}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {fields.map((field, index) => (
          <div key={index} className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
              {field.label}
            </label>
            <div className="relative group">
              {/* Render Icon if provided */}
              {field.icon && (
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  {field.icon}
                </div>
              )}
              
              <input
                type={field.type === 'password' && showPassword ? 'text' : field.type}
                name={field.name}
                placeholder={field.placeholder}
                required={field.required !== false} // Default to true unless specified
                onChange={handleChange}
                className={`w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-3 transition-all outline-none ${
                  field.icon ? 'pl-10' : ''
                }`}
              />

              {/* Toggle Password Visibility Button */}
              {field.type === 'password' && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Extra Links (Forgot Password, etc.) */}
        {extraLinks && (
          <div className="flex justify-end">
            {extraLinks}
          </div>
        )}

        <button
          type="submit"
          className="w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-bold rounded-lg text-sm px-5 py-3.5 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          {submitLabel}
        </button>
      </form>
    </div>
  );
};

export default Forms;