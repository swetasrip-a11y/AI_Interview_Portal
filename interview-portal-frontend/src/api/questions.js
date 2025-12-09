import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

// Questions endpoints
export const getQuestions = () => {
  return axios.get(`${API_BASE}/questions`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
};

export const getQuestion = (id) => {
  return axios.get(`${API_BASE}/questions/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
};

export const createQuestion = (question) => {
  return axios.post(`${API_BASE}/questions`, question, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
};

export const updateQuestion = (id, question) => {
  return axios.put(`${API_BASE}/questions/${id}`, question, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
};

export const deleteQuestion = (id) => {
  return axios.delete(`${API_BASE}/questions/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
};

// Submissions endpoints
export const submitAnswer = (question_id, selected_option) => {
  return axios.post(`${API_BASE}/submissions`, { question_id, selected_option }, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
};

export const getUserResults = () => {
  return axios.get(`${API_BASE}/submissions/user/results`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
};
