import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserResults } from '../api/questions';

export default function CandidatePerformance() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      const userData = JSON.parse(storedUser);
      if (userData.role !== 'candidate') {
        navigate('/interviewer-dashboard');
      }
      setUser(userData);
      fetchResults();
    }
  }, [navigate]);

  const fetchResults = async () => {
    try {
      const response = await getUserResults();
      setResults(response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container"><h2>Loading...</h2></div>;

  const totalAttempts = results.length;
  const averageScore = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)
    : 0;
  const passedAttempts = results.filter(r => r.score >= 60).length;
  const failedAttempts = results.filter(r => r.score < 60).length;
  const maxScore = results.length > 0 ? Math.max(...results.map(r => r.score)) : 0;
  const minScore = results.length > 0 ? Math.min(...results.map(r => r.score)) : 0;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #050810|#0a0e27|#1a1f35 0%, #0a0e27 50%, #1a1f35 100%)' }}>
      <div className="dashboard">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1>📈 Your Performance</h1>
          <Link to="/candidate-dashboard" className="btn btn-secondary" style={{ width: '150px' }}>
            Back
          </Link>
        </div>

        {results.length === 0 ? (
          <div className="user-info">
            <p>No test attempts yet. Take your first interview test!</p>
            <Link to="/candidate/interviews" className="btn" style={{ marginTop: '20px', width: '200px' }}>
              Browse Interviews
            </Link>
          </div>
        ) : (
          <div>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Attempts</h3>
                <div className="number">{totalAttempts}</div>
              </div>
              <div className="stat-card">
                <h3>Average Score</h3>
                <div className="number" style={{ color: '#f39c12' }}>{averageScore}%</div>
              </div>
              <div className="stat-card">
                <h3>Passed</h3>
                <div className="number" style={{ color: '#27ae60' }}>{passedAttempts}</div>
              </div>
              <div className="stat-card">
                <h3>Failed</h3>
                <div className="number" style={{ color: '#e74c3c' }}>{failedAttempts}</div>
              </div>
              <div className="stat-card">
                <h3>Best Score</h3>
                <div className="number" style={{ color: '#27ae60' }}>{maxScore}%</div>
              </div>
              <div className="stat-card">
                <h3>Lowest Score</h3>
                <div className="number" style={{ color: '#e74c3c' }}>{minScore}%</div>
              </div>
            </div>

            <h3 style={{ color: '#5a4a6f', marginTop: '40px', marginBottom: '20px' }}>
              📋 Attempt History
            </h3>

            <div>
              {results.map((result, idx) => (
                <div key={result.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '15px',
                  background: 'white',
                  marginBottom: '10px',
                  borderRadius: '10px',
                  borderLeft: `5px solid ${result.score >= 80 ? '#27ae60' : result.score >= 60 ? '#f39c12' : '#e74c3c'}`,
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                      <h4 style={{ margin: '0 15px 0 0', color: '#5a4a6f' }}>
                        Attempt #{totalAttempts - idx}
                      </h4>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        backgroundColor: result.score >= 60 ? '#d4edda' : '#f8d7da',
                        color: result.score >= 60 ? '#155724' : '#721c24'
                      }}>
                        {result.score >= 60 ? 'PASSED' : 'FAILED'}
                      </span>
                    </div>
                    <p style={{ margin: '5px 0', color: '#7a6a8f', fontSize: '13px' }}>
                      {new Date(result.created_at).toLocaleDateString()} at {new Date(result.created_at).toLocaleTimeString()}
                    </p>
                  </div>

                  <div style={{ textAlign: 'right', minWidth: '150px' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#b89dd9' }}>
                        {result.score}%
                      </span>
                    </div>
                    <p style={{ margin: 0, color: '#7a6a8f', fontSize: '12px' }}>
                      {result.correct}/{result.total} correct
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          padding: 20px;
          borderRadius: 10px;
          textAlign: center;
          boxShadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .stat-card h3 {
          margin: 0 0 10px 0;
          color: #5a4a6f;
          fontSize: 14px;
          fontWeight: 600;
        }

        .number {
          fontSize: 32px;
          fontWeight: bold;
          color: #b89dd9;
        }
      `}</style>
    </div>
  );
}


