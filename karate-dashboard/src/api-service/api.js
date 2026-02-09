import axios from 'axios';

// 1. Create the Axios Instance
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Your Laravel URL
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// 2. Request Interceptor: Auto-attach Token
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

// --- AUTH ---
export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password });
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// --- USERS ---
export const getUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
export const createUser = async (userData) => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// --- DOJOS ---
export const getDojos = async () => {
  const response = await api.get('/dojos');
  return response.data;
};

export const getDojo = async (id) => {
  const response = await api.get(`/dojos/${id}`);
  return response.data;
};

export const createDojo = async (dojoData) => {
  try {
    const response = await api.post('/dojos', dojoData);
    return response.data;
  } catch (error) {
    console.error("Server Error Details:", error.response?.data);
    throw error;
  }
};

export const updateDojo = async (id, data) => {
  const response = await api.put(`/dojos/${id}`, data);
  return response.data;
};

export const deleteDojo = async (id) => {
  return await api.delete(`/dojos/${id}`);
};

// --- INSTRUCTORS (Updated to use 'api' instance) ---
export const getInstructors = async () => {
  // Uses base URL http://127.0.0.1:8000/api/instructors
  const response = await api.get('/instructors'); 
  return response.data;
};

export const getInstructor = async (id) => {
  const response = await api.get(`/instructors/${id}`);
  return response.data;
};

export const createInstructor = async (data) => {
  const response = await api.post('/instructors', data);
  return response.data;
};

export const updateInstructor = async (id, data) => {
  const response = await api.put(`/instructors/${id}`, data);
  return response.data;
};

export const deleteInstructor = async (id) => {
  const response = await api.delete(`/instructors/${id}`);
  return response.data;
};

export default api;