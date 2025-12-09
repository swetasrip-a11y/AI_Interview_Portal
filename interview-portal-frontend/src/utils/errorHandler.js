/**
 * Frontend Error Handler - Global error handling for React frontend
 * Provides consistent error responses, retry logic, and recovery
 */

class FrontendError extends Error {
  constructor(message, code = 'UNKNOWN_ERROR', statusCode = 500, retryable = false) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.retryable = retryable;
    this.timestamp = new Date().toISOString();
  }
}

// Global error handler for unhandled promise rejections
const setupGlobalErrorHandlers = () => {
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault();
  });

  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
  });
};

// Safe async function wrapper
const safeAsync = (fn) => async (...args) => {
  try {
    return await fn(...args);
  } catch (error) {
    handleFrontendError(error);
    throw error;
  }
};

// Handle frontend errors
const handleFrontendError = (error, context = {}) => {
  const errorLog = {
    timestamp: new Date().toISOString(),
    message: error.message || 'Unknown error',
    code: error.code || 'UNKNOWN_ERROR',
    statusCode: error.statusCode || 500,
    url: window.location.href,
    userAgent: navigator.userAgent,
    context
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('[ERROR]', errorLog);
  }

  // Send error to backend for logging (optional)
  if (navigator.onLine) {
    fetch('/api/logs/frontend-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorLog)
    }).catch(err => console.error('Failed to send error log:', err));
  }

  // Store in localStorage for debugging
  try {
    const errors = JSON.parse(localStorage.getItem('frontendErrors') || '[]');
    errors.push(errorLog);
    // Keep only last 50 errors
    if (errors.length > 50) errors.shift();
    localStorage.setItem('frontendErrors', JSON.stringify(errors));
  } catch (e) {
    console.error('Failed to store error log:', e);
  }
};

// Safe API call with retry logic
const safeApiCall = async (fn, retries = 3, backoff = 1000) => {
  let lastError;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const isRetryable = error.retryable || 
        (error.response?.status >= 500 && error.response?.status < 600) ||
        error.code === 'ECONNABORTED' ||
        error.code === 'ENOTFOUND';

      if (!isRetryable || attempt === retries - 1) {
        throw error;
      }

      // Wait before retrying with exponential backoff
      await new Promise(r => setTimeout(r, backoff * Math.pow(2, attempt)));
    }
  }
  throw lastError;
};

// Format error message for user display
const formatErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  if (error.response?.data?.message) return error.response.data.message;
  if (error.message) return error.message;
  return 'An unexpected error occurred. Please try again.';
};

// Check network connectivity
const isOnline = () => navigator.onLine;

// Get stored frontend errors
const getFrontendErrors = () => {
  try {
    return JSON.parse(localStorage.getItem('frontendErrors') || '[]');
  } catch (e) {
    return [];
  }
};

// Clear frontend errors
const clearFrontendErrors = () => {
  try {
    localStorage.removeItem('frontendErrors');
  } catch (e) {
    console.error('Failed to clear errors:', e);
  }
};

// React Hook for global error handling
const useErrorHandler = () => {
  return {
    handleError: (error, context = {}) => {
      handleFrontendError(error, context);
    },
    getErrors: getFrontendErrors,
    clearErrors: clearFrontendErrors,
    isOnline,
    formatMessage: formatErrorMessage
  };
};

export {
  FrontendError,
  setupGlobalErrorHandlers,
  safeAsync,
  safeApiCall,
  handleFrontendError,
  formatErrorMessage,
  isOnline,
  getFrontendErrors,
  clearFrontendErrors,
  useErrorHandler
};
