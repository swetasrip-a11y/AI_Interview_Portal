import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CandidateInterviewScores() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      fetchInterviews();
    }
  }, [navigate]);

  const fetchInterviews = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get('http://localhost:5000/api/candidate/interview-sessions', { headers });
      setInterviews(response.data || []);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async (sessionId) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`http://localhost:5000/api/interview-session/${sessionId}/report`, {
        headers,
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `interview-report-${sessionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentChild.removeChild(link);
    } catch (err) {
      alert('Failed to download report');
    }
  };

  if (loading) return <div className="container"><h2>Loading...</h2></div>;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #050810|#0a0e27|#1a1f35 0%, #050810|#0a0e27|#1a1f35 50%, #050810|#0a0e27|#1a1f35 100%)' }}>
      <div className="dashboard">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1>📊 My Interview Scores</h1>
          <Link to="/candidate-dashboard" className="btn btn-secondary" style={{ width: '150px' }}>
            Back
          </Link>
        </div>

        {interviews.length === 0 ? (
          <div className="user-info">
            <p>No interviews taken yet. Start an AI interview to see your scores here.</p>
          </div>
        ) : (
          <div>
            {interviews.map((interview) => (
              <div key={interview.id} style={{
                background: 'white',
                padding: '20px',
                marginBottom: '15px',
                borderRadius: '10px',
                borderLeft: `5px solid ${interview.final_score >= 70 ? '#27ae60' : interview.final_score >= 60 ? '#f39c12' : '#e74c3c'}`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#5a4a6f' }}>
                      Interview - {interview.job_title || 'Position'}
                    </h3>
                    <p style={{ margin: '5px 0', color: '#7a6a8f', fontSize: '14px' }}>
                      Date: {new Date(interview.completed_at).toLocaleDateString()} {new Date(interview.completed_at).toLocaleTimeString()}
                    </p>
                    <p style={{ margin: '5px 0', color: '#7a6a8f', fontSize: '14px' }}>
                      Type: <span style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{interview.interview_type}</span>
                    </p>
                    <p style={{ margin: '5px 0', color: '#7a6a8f', fontSize: '14px' }}>
                      Duration: {Math.floor(interview.interview_duration / 60)} mins
                    </p>
                  </div>

                  <div style={{ textAlign: 'right', minWidth: '200px' }}>
                    <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#b89dd9', marginBottom: '15px' }}>
                      {interview.final_score}%
                    </div>
                    <p style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      backgroundColor: interview.final_score >= 70 ? '#d4edda' : interview.final_score >= 60 ? '#fff3cd' : '#f8d7da',
                      color: interview.final_score >= 70 ? '#155724' : interview.final_score >= 60 ? '#856404' : '#721c24',
                      display: 'inline-block',
                      marginBottom: '15px'
                    }}>
                      {interview.final_score >= 70 ? '✅ PASSED' : '⚠️ REVIEW'}
                    </p>

                    <br />

                    <button
                      onClick={() => downloadReport(interview.id)}
                      style={{
                        padding: '8px 16px',
                        background: '#3498db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        marginTop: '10px'
                      }}
                    >
                      📄 Download Report
                    </button>
                  </div>
                </div>

                {interview.ai_feedback && (
                  <div style={{
                    marginTop: '15px',
                    paddingTop: '15px',
                    borderTop: '1px solid #e0d5f0'
                  }}>
                    <p style={{ color: '#7a6a8f', fontSize: '13px', margin: 0 }}>
                      <strong>AI Feedback:</strong> {interview.ai_feedback}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


