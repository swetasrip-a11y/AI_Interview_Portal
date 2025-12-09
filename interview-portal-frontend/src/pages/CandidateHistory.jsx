import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCandidateHistory } from '../api/interviews';

export default function CandidateHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await getCandidateHistory();
      setHistory(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container"><h2>Loading...</h2></div>;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #050810 0%, #0a0e27 50%, #1a1f35 100%)' }}>
      <div className="dashboard">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1>Interview History</h1>
          <Link to="/candidate-dashboard" className="btn btn-secondary" style={{ width: '150px' }}>
            Back
          </Link>
        </div>

        {error && <div className="error">{error}</div>}

        {history.length === 0 ? (
          <div className="user-info">
            <p>No interview history yet.</p>
          </div>
        ) : (
          <div>
            {history.map((item) => (
              <div key={item.id} className="interview-card">
                <h3>{item.title}</h3>
                <p><strong>Job Title:</strong> {item.job_title || 'Not specified'}</p>
                <p><strong>Status:</strong> <span className={`badge ${item.status}`}>{item.status}</span></p>
                {item.score !== null && <p><strong>Score:</strong> {item.score}%</p>}
                {item.decision && <p><strong>Decision:</strong> {item.decision}</p>}
                {item.marks_obtained !== null && <p><strong>Marks:</strong> {item.marks_obtained}/100</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


