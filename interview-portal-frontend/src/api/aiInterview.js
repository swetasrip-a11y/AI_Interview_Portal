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

// AI Interview APIs
export const parseResume = async (resumeText) => {
  try {
    const response = await axiosInstance.post('/ai-interview/parse-resume', { resume_text: resumeText });
    return response.data;
  } catch (error) {
    console.error('Parse resume error:', error.response?.data || error.message);
    throw error;
  }
};

export const generateQuestions = async (resumeData, jobRole, count = 20) => {
  try {
    const response = await axiosInstance.post('/ai-interview/generate-questions', {
      resume_data: resumeData,
      job_role: jobRole,
      count
    });
    return response.data;
  } catch (error) {
    console.error('Generate questions error:', error.response?.data || error.message);
    throw error;
  }
};

export const startInterview = async (jobId, interviewType = 'text', questions = []) => {
  try {
    const response = await axiosInstance.post('/ai-interview/start', {
      job_id: jobId,
      interview_type: interviewType,
      questions
    });
    return response.data;
  } catch (error) {
    console.error('Start interview error:', error.response?.data || error.message);
    throw error;
  }
};

export const submitAnswer = async (sessionId, questionIndex, candidateAnswer, expectedKeywords = [], questionType = '') => {
  try {
    const response = await axiosInstance.post('/ai-interview/submit-answer', {
      session_id: sessionId,
      question_index: questionIndex,
      candidate_answer: candidateAnswer,
      expected_keywords: expectedKeywords,
      question_type: questionType
    });
    return response.data;
  } catch (error) {
    console.error('Submit answer error:', error.response?.data || error.message);
    throw error;
  }
};

export const completeInterview = async (sessionId, interviewDuration = 0) => {
  try {
    const response = await axiosInstance.post('/ai-interview/complete', {
      session_id: sessionId,
      interview_duration: interviewDuration
    });
    return response.data;
  } catch (error) {
    console.error('Complete interview error:', error.response?.data || error.message);
    throw error;
  }
};

export const getSessionDetails = async (sessionId) => {
  try {
    const response = await axiosInstance.get(`/ai-interview/session/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('Get session details error:', error.response?.data || error.message);
    throw error;
  }
};

export default {
  parseResume,
  generateQuestions,
  startInterview,
  submitAnswer,
  completeInterview,
  getSessionDetails
};
