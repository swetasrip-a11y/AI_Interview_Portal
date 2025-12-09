import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

// Create axios instance with token support
const axiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 30000
});

// Add token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Resume/Audio Upload & Management
export const uploadResume = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    console.log(`Uploading file: ${file.name} (${file.size} bytes)`);
    const response = await axiosInstance.post('/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    console.log('Upload successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Upload error:', error.response?.data || error.message);
    throw error;
  }
};

export const getResumes = async () => {
  try {
    console.log('Fetching resumes...');
    const response = await axiosInstance.get('/resume/list');
    console.log('Resumes fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('Fetch resumes error:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteResume = async (resumeId) => {
  try {
    console.log(`Deleting resume: ${resumeId}`);
    const response = await axiosInstance.delete(`/resume/delete/${resumeId}`);
    console.log('Resume deleted:', response.data);
    return response.data;
  } catch (error) {
    console.error('Delete resume error:', error.response?.data || error.message);
    throw error;
  }
};

export const downloadResume = async (resumeId) => {
  try {
    console.log(`Downloading resume: ${resumeId}`);
    const response = await axiosInstance.get(`/resume/download/${resumeId}`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('Download resume error:', error.response?.data || error.message);
    throw error;
  }
};

export default {
  uploadResume,
  getResumes,
  deleteResume,
  downloadResume
};
