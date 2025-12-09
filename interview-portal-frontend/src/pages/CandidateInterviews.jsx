import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getInterviews, joinInterview } from '../api/interviews';

export default function CandidateInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const response = await getInterviews();
      setInterviews(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load interviews');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container"><h2>Loading AI interviews...</h2></div>;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #050810|#0a0e27|#1a1f35 0%, #050810|#0a0e27|#1a1f35 50%, #050810|#0a0e27|#1a1f35 100%)' }}>
      <div className="dashboard">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1>🤖 Available AI Interviews</h1>
          <Link to="/candidate-dashboard" className="btn btn-secondary" style={{ width: '150px' }}>
            Back to Dashboard
          </Link>
        </div>

        {error && <div className="error">{error}</div>}

        {interviews.length === 0 ? (
          <div className="user-info">
            <p>No AI interviews available at the moment.</p>
          </div>
        ) : (
          <div>
            {interviews.map((interview) => (
              <div key={interview.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px',
                background: 'white',
                marginBottom: '15px',
                borderRadius: '10px',
                borderLeft: '5px solid #b89dd9',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 10px 0', color: '#5a4a6f' }}>{interview.title}</h3>
                  <p style={{ margin: '5px 0', color: '#7a6a8f' }}>
                    <strong>📍 Position:</strong> {interview.job_title || 'Not specified'}
                  </p>
                  <p style={{ margin: '5px 0', color: '#7a6a8f', fontSize: '14px' }}>
                    {interview.description}
                  </p>
                  <p style={{ margin: '8px 0', color: '#7a6a8f', fontSize: '12px' }}>
                    Created: {new Date(interview.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', minWidth: '200px' }}>
                  <span style={{
                    padding: '8px 15px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    color: '#5a4a6f'
                  }}>
                    🎯 AI Powered
                  </span>
                  <Link
                    to={`/interview/${interview.id}/ai`}
                    className="btn"
                    style={{ 
                      width: '150px', 
                      textAlign: 'center',
                      padding: '10px',
                      textDecoration: 'none'
                    }}
                  >
                    Start Interview
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="user-info" style={{ marginTop: '40px', background: '#050810|#0a0e27|#1a1f35', borderLeft: '4px solid #3498db' }}>
          <h3 style={{ color: '#0056b3', marginTop: 0 }}>💡 About AI Interviews</h3>
          <p>Our AI-powered interview system uses advanced algorithms to evaluate your responses in real-time. You can type or speak your answers, and the AI will provide immediate feedback.</p>
        </div>
      </div>
    </div>
  );
}


