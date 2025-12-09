/**
 * API Utility - Safe API call wrapper with built-in error handling
 * Provides retry logic, timeout handling, and consistent error responses
 */

import axios from 'axios';
import { safeApiCall, handleFrontendError, FrontendError } from './errorHandler';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';
const DEFAULT_TIMEOUT = 10000;
const DEFAULT_RETRIES = 3;

// Create axios instance with interceptors
const axiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    handleFrontendError(error, { phase: 'request' });
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error statuses
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    handleFrontendError(error, { 
      phase: 'response',
      endpoint: error.config?.url,
      method: error.config?.method
    });

    // Make error retryable
    if (!error.retryable) {
      error.retryable = error.response?.status >= 500 || 
                       !error.response;
    }

    return Promise.reject(error);
  }
);

// Safe API methods with retry logic
const apiClient = {
  /**
   * GET request with retry
   */
  get: async (endpoint, config = {}, retries = DEFAULT_RETRIES) => {
    return safeApiCall(() => axiosInstance.get(endpoint, config), retries);
  },

  /**
   * POST request with retry
   */
  post: async (endpoint, data = {}, config = {}, retries = DEFAULT_RETRIES) => {
    return safeApiCall(() => axiosInstance.post(endpoint, data, config), retries);
  },

  /**
   * PUT request with retry
   */
  put: async (endpoint, data = {}, config = {}, retries = DEFAULT_RETRIES) => {
    return safeApiCall(() => axiosInstance.put(endpoint, data, config), retries);
  },

  /**
   * PATCH request with retry
   */
  patch: async (endpoint, data = {}, config = {}, retries = DEFAULT_RETRIES) => {
    return safeApiCall(() => axiosInstance.patch(endpoint, data, config), retries);
  },

  /**
   * DELETE request with retry
   */
  delete: async (endpoint, config = {}, retries = DEFAULT_RETRIES) => {
    return safeApiCall(() => axiosInstance.delete(endpoint, config), retries);
  },

  /**
   * Upload file with progress tracking
   */
  uploadFile: async (endpoint, file, onProgress = null) => {
    const formData = new FormData();
    formData.append('file', file);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    if (onProgress) {
      config.onUploadProgress = (progressEvent) => {
        const percentComplete = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentComplete);
      };
    }

    return safeApiCall(() => axiosInstance.post(endpoint, formData, config), 2);
  },

  /**
   * Download file
   */
  downloadFile: async (endpoint, filename) => {
    try {
      const response = await axiosInstance.get(endpoint, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (error) {
      handleFrontendError(error, { endpoint, action: 'download' });
      throw new FrontendError(
        'Failed to download file',
        'DOWNLOAD_FAILED',
        error.response?.status || 500,
        true
      );
    }
  },

  /**
   * Batch requests
   */
  batch: async (requests) => {
    try {
      return await Promise.all(requests.map(req => 
        this[req.method.toLowerCase()](req.endpoint, req.data)
      ));
    } catch (error) {
      handleFrontendError(error, { action: 'batch' });
      throw error;
    }
  },

  /**
   * Get instance for custom configuration
   */
  getInstance: () => axiosInstance,

  /**
   * Set custom interceptor
   */
  setInterceptor: (type, onSuccess, onError) => {
    if (type === 'request') {
      axiosInstance.interceptors.request.use(onSuccess, onError);
    } else {
      axiosInstance.interceptors.response.use(onSuccess, onError);
    }
  }
};

export default apiClient;
