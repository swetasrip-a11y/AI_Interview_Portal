import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCandidateHistory } from '../api/interviews';

export default function CandidateScore() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await getCandidateHistory();
      setHistory(response.data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalInterviews = history.length;
  const completedInterviews = history.filter(h => h.decision).length;
  const averageScore = history.length > 0
    ? Math.round(history.reduce((sum, h) => sum + (h.marks_obtained || 0), 0) / history.length)
    : 0;

  if (loading) return <div className="container"><h2>Loading...</h2></div>;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #050810|#0a0e27|#1a1f35 0%, #050810|#0a0e27|#1a1f35 50%, #050810|#0a0e27|#1a1f35 100%)' }}>
      <div className="dashboard">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1>Scores & Updates</h1>
          <Link to="/candidate-dashboard" className="btn btn-secondary" style={{ width: '150px' }}>
            Back
          </Link>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Interviews</h3>
            <div className="number">{totalInterviews}</div>
          </div>
          <div className="stat-card">
            <h3>Completed</h3>
            <div className="number">{completedInterviews}</div>
          </div>
          <div className="stat-card">
            <h3>Average Score</h3>
            <div className="number">{averageScore}%</div>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="user-info">
            <p>No scores yet. Take interviews to see your performance!</p>
          </div>
        ) : (
          <div>
            <h2 style={{ color: '#5a4a6f', marginBottom: '20px', marginTop: '30px' }}>Detailed Scores</h2>
            {history.map((item) => (
              <div key={item.id} className="interview-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <h3>{item.title}</h3>
                    <p><strong>Job:</strong> {item.job_title}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {item.marks_obtained !== null && (
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#b89dd9' }}>
                        {item.marks_obtained}/100
                      </div>
                    )}
                  </div>
                </div>
                
                {item.decision && (
                  <p style={{ marginTop: '10px' }}>
                    <strong>Decision:</strong> 
                    <span style={{
                      marginLeft: '10px',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: item.decision === 'Selected' ? '#d4edda' : '#f8d7da',
                      color: item.decision === 'Selected' ? '#155724' : '#721c24'
                    }}>
                      {item.decision}
                    </span>
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


