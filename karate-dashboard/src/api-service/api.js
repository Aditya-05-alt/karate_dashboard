import axios from 'axios';

// 1. Create the Axios Instance
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Your Laravel URL
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json', // Important for Laravel to return JSON errors
  },
});

// 2. Request Interceptor: Auto-attach Token
// This runs before every request. If we have a token saved, it adds it to the headers.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. API Functions

export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password });
    
    // If login is successful, save the token immediately
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user)); // Optional: Save user info
    }
    
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const logoutUser = async () => {
  try {
    await api.post('/logout');
  } catch (error) {
    console.error("Logout failed", error);
  } finally {
    // Always remove token from local storage, even if server error occurs
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// Example for future use (fetching data)
export const getStudents = async () => {
  const response = await api.get('/students'); 
  return response.data;
};

export default api;