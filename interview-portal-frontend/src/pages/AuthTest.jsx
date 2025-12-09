import React, { useState } from 'react';
import { register, login } from '../api/auth';

export default function AuthTest() {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addResult = (type, message, data = null) => {
    console.log(`[${type}]`, message, data);
    setTestResults(prev => [...prev, { type, message, data, time: new Date().toLocaleTimeString() }]);
  };

  const runTests = async () => {
    setLoading(true);
    setTestResults([]);
    addResult('INFO', 'Starting authentication tests...');

    try {
      // Test 1: Register
      const email = `testuser${Date.now()}@example.com`;
      const password = 'TestPass123!';
      const fullName = 'Test User';
      const role = 'candidate';

      addResult('INFO', 'Test 1: Attempting registration', { email, fullName, role });
      const registerRes = await register(email, password, fullName, role);
      addResult('SUCCESS', 'Registration successful', registerRes.data);

      // Test 2: Login
      addResult('INFO', 'Test 2: Attempting login', { email });
      const loginRes = await login(email, password);
      addResult('SUCCESS', 'Login successful', { 
        token: loginRes.data.token.substring(0, 20) + '...',
        user: loginRes.data.user 
      });

      addResult('SUCCESS', '✅ All tests passed!');
    } catch (err) {
      addResult('ERROR', 'Test failed', {
        status: err.response?.status,
        message: err.message,
        data: err.response?.data,
        config: {
          url: err.config?.url,
          method: err.config?.method,
          data: err.config?.data
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050810',
      color: '#f8fafc',
      padding: '2rem',
      fontFamily: 'monospace'
    }}>
      <h1>🧪 Authentication Test Suite</h1>
      
      <button
        onClick={runTests}
        disabled={loading}
        style={{
          padding: '0.75rem 1.5rem',
          background: loading ? '#666' : '#6366f1',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '1rem',
          fontWeight: 'bold',
          marginBottom: '2rem'
        }}
      >
        {loading ? '⏳ Running Tests...' : '▶️ Run Authentication Tests'}
      </button>

      <div style={{
        background: 'rgba(30, 41, 59, 0.8)',
        border: '1px solid rgba(100, 116, 139, 0.3)',
        borderRadius: '8px',
        padding: '1rem',
        maxHeight: '600px',
        overflowY: 'auto'
      }}>
        {testResults.length === 0 ? (
          <p style={{ color: '#cbd5e1' }}>No tests run yet. Click the button to start.</p>
        ) : (
          testResults.map((result, idx) => (
            <div
              key={idx}
              style={{
                padding: '0.75rem',
                marginBottom: '0.5rem',
                background: result.type === 'SUCCESS' ? 'rgba(16, 185, 129, 0.1)' :
                           result.type === 'ERROR' ? 'rgba(239, 68, 68, 0.1)' :
                           'rgba(99, 102, 241, 0.1)',
                border: `1px solid ${result.type === 'SUCCESS' ? '#10b981' :
                                    result.type === 'ERROR' ? '#ef4444' :
                                    '#6366f1'}`,
                borderRadius: '4px',
                color: result.type === 'SUCCESS' ? '#10b981' :
                       result.type === 'ERROR' ? '#ef4444' :
                       '#6366f1'
              }}
            >
              <strong>[{result.time}]</strong> {result.message}
              {result.data && (
                <pre style={{
                  marginTop: '0.5rem',
                  fontSize: '0.85rem',
                  background: 'rgba(0, 0, 0, 0.2)',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  overflow: 'auto'
                }}>
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
