import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

console.log('Auth API Base:', API_BASE);

// Create axios instance with timeout
const axiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 10000
});

export const register = async (email, password, full_name, role) => {
  try {
    console.log('Registering user:', { email, full_name, role });
    const response = await axiosInstance.post('/auth/register', { 
      email, 
      password, 
      full_name, 
      role 
    });
    console.log('Registration successful:', response.data);
    return response;
  } catch (error) {
    console.error('Registration API error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      config: error.config
    });
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    console.log('Logging in user:', { email });
    const response = await axiosInstance.post('/auth/login', { 
      email, 
      password 
    });
    console.log('Login successful:', response.data);
    return response;
  } catch (error) {
    console.error('Login API error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      config: error.config
    });
    throw error;
  }
};
