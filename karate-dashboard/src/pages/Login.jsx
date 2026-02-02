import React from 'react';
import { Mail, Lock, ShieldCheck } from 'lucide-react';
import Forms from '../components/Form';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  

  // --- Configuration for the Login Form ---
  const loginFields = [
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'sensei@dojo.com',
      icon: <Mail size={20} />
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: '••••••••',
      icon: <Lock size={20} />
    }
  ];

const handleLoginSubmit = (data) => {
    console.log("Login Data Submitted: ", data);
    
    if (data.email && data.password) {
      // UPDATED: Redirect to '/dashboard' instead of '/'
      navigate('/dashboard'); 
    }
};
  

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="z-10 w-full flex flex-col items-center">
        
        {/* Logo / Brand above form */}
        <div className="mb-8 text-center">
            <div className="bg-white/10 p-4 rounded-full inline-flex mb-4 backdrop-blur-sm border border-white/10">
                <ShieldCheck className="w-12 h-12 text-red-500" />
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight">KMS Admin</h1>
            <p className="text-gray-400 mt-2">Sign in to manage your Dojo</p>
        </div>

        {/* The Dynamic Form Component */}
        <Forms 
          title="Welcome Back"
          subtitle="Please enter your credentials"
          fields={loginFields}
          onSubmit={handleLoginSubmit}
          submitLabel="Sign In"
          extraLinks={
            <a href="#" className="text-sm font-medium text-red-500 hover:text-red-400 hover:underline">
              Forgot password?
            </a>
          }
        />

        <p className="mt-6 text-gray-500 text-sm">
          Don't have an account? <span className="text-gray-400">Contact System Admin.</span>
        </p>

      </div>
    </div>
  );
};

export default Login;