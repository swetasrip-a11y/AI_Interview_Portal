import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const headers = () => ({
  Authorization: `Bearer ${getToken()}`
});

// Interviews
export const createInterview = (data) => {
  return axios.post(`${API_BASE}/interviews`, data, { headers: headers() });
};

export const getInterviews = () => {
  return axios.get(`${API_BASE}/interviews`, { headers: headers() });
};

export const getInterview = (id) => {
  return axios.get(`${API_BASE}/interviews/${id}`, { headers: headers() });
};

export const joinInterview = (id) => {
  return axios.post(`${API_BASE}/interviews/${id}/join`, {}, { headers: headers() });
};

export const getInterviewCandidates = (id) => {
  return axios.get(`${API_BASE}/interviews/${id}/candidates`, { headers: headers() });
};

export const updateCandidateEvaluation = (interviewId, candidateId, data) => {
  return axios.put(`${API_BASE}/interviews/${interviewId}/candidate/${candidateId}`, data, { headers: headers() });
};

export const getCandidateHistory = () => {
  return axios.get(`${API_BASE}/interviews/history/candidate`, { headers: headers() });
};

// Materials
export const getMaterials = () => {
  return axios.get(`${API_BASE}/materials`, { headers: headers() });
};

export const createMaterial = (data) => {
  return axios.post(`${API_BASE}/materials`, data, { headers: headers() });
};

// Jobs
export const getJobs = () => {
  return axios.get(`${API_BASE}/jobs`, { headers: headers() });
};

export const createJob = (data) => {
  return axios.post(`${API_BASE}/jobs`, data, { headers: headers() });
};
