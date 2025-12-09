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

// Admin Dashboard APIs
export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get('/users');
    return response.data;
  } catch (error) {
    console.error('Get all users error:', error.response?.data || error.message);
    throw error;
  }
};

export const getUserDetails = async (userId) => {
  try {
    const response = await axiosInstance.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Get user details error:', error.response?.data || error.message);
    throw error;
  }
};

export const getAllInterviewSessions = async () => {
  try {
    const response = await axiosInstance.get('/ai-interview/sessions');
    return response.data;
  } catch (error) {
    console.error('Get all sessions error:', error.response?.data || error.message);
    throw error;
  }
};

export const getUserInterviewSessions = async (userId) => {
  try {
    const response = await axiosInstance.get(`/ai-interview/user/${userId}/sessions`);
    return response.data;
  } catch (error) {
    console.error('Get user sessions error:', error.response?.data || error.message);
    throw error;
  }
};

export const getInterviewSessionDetails = async (sessionId) => {
  try {
    const response = await axiosInstance.get(`/ai-interview/session/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('Get session details error:', error.response?.data || error.message);
    throw error;
  }
};

export const getHiringDecisions = async () => {
  try {
    const response = await axiosInstance.get('/hiring-decisions');
    return response.data;
  } catch (error) {
    console.error('Get hiring decisions error:', error.response?.data || error.message);
    throw error;
  }
};

export const updateHiringDecision = async (decisionId, decision, feedback) => {
  try {
    const response = await axiosInstance.put(`/hiring-decisions/${decisionId}`, { decision, feedback });
    return response.data;
  } catch (error) {
    console.error('Update hiring decision error:', error.response?.data || error.message);
    throw error;
  }
};

export const getJobOffers = async () => {
  try {
    const response = await axiosInstance.get('/job-offers');
    return response.data;
  } catch (error) {
    console.error('Get job offers error:', error.response?.data || error.message);
    throw error;
  }
};

export const createJobOffer = async (candidateId, jobId, salary, startDate) => {
  try {
    const response = await axiosInstance.post('/job-offers', {
      candidate_id: candidateId,
      job_id: jobId,
      salary,
      start_date: startDate
    });
    return response.data;
  } catch (error) {
    console.error('Create job offer error:', error.response?.data || error.message);
    throw error;
  }
};

export const getPerformanceMetrics = async (userId) => {
  try {
    const response = await axiosInstance.get(`/performance-metrics/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Get performance metrics error:', error.response?.data || error.message);
    throw error;
  }
};

export const getAllPerformanceMetrics = async () => {
  try {
    const response = await axiosInstance.get('/performance-metrics');
    return response.data;
  } catch (error) {
    console.error('Get all performance metrics error:', error.response?.data || error.message);
    throw error;
  }
};

export const getCandidateProfile = async (userId) => {
  try {
    const response = await axiosInstance.get(`/candidate-profiles/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Get candidate profile error:', error.response?.data || error.message);
    throw error;
  }
};

export default {
  getAllUsers,
  getUserDetails,
  getAllInterviewSessions,
  getUserInterviewSessions,
  getInterviewSessionDetails,
  getHiringDecisions,
  updateHiringDecision,
  getJobOffers,
  createJobOffer,
  getPerformanceMetrics,
  getAllPerformanceMetrics,
  getCandidateProfile
};
