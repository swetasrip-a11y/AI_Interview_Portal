import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function CompanyCandidateReview() {
  const [user, setUser] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jobFilter, setJobFilter] = useState('all');
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      const userData = JSON.parse(storedUser);
      if (userData.role !== 'company') {
        navigate('/company-dashboard');
      }
      setUser(userData);
      fetchData();
    }
  }, [navigate]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const candidatesRes = await axios.get('http://localhost:5000/api/company/candidates', { headers });
      const jobsRes = await axios.get('http://localhost:5000/api/company/jobs', { headers });

      setCandidates(candidatesRes.data || []);
      setJobs(jobsRes.data || []);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (candidateId, jobId, decision) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      await axios.post(`http://localhost:5000/api/hiring-decision`, {
        candidate_id: candidateId,
        job_id: jobId,
        decision: decision
      }, { headers });

      alert(`Candidate marked as ${decision}!`);
      fetchData();
    } catch (err) {
      alert('Failed to update decision');
    }
  };

  const filteredCandidates = jobFilter === 'all'
    ? candidates
    : candidates.filter(c => c.job_id === parseInt(jobFilter));

  if (loading) return <div className="container"><h2>Loading...</h2></div>;
  if (!user) return <div>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #050810|#0a0e27|#1a1f35 0%, #050810|#0a0e27|#1a1f35 50%, #050810|#0a0e27|#1a1f35 100%)' }}>
      <div className="dashboard">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1>👥 AI Shortlisted Candidates</h1>
          <Link to="/company-dashboard" className="btn btn-secondary" style={{ width: '150px' }}>
            Back
          </Link>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#5a4a6f' }}>
            Filter by Job:
          </label>
          <select
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '300px',
              padding: '10px',
              border: '2px solid #d4b5e8',
              borderRadius: '6px'
            }}
          >
            <option value="all">All Jobs</option>
            {jobs.map(job => (
              <option key={job.id} value={job.id}>{job.title}</option>
            ))}
          </select>
        </div>

        {filteredCandidates.length === 0 ? (
          <div className="user-info">
            <p>No candidates with AI interviews yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
            {/* Candidates List */}
            <div>
              <h3 style={{ color: '#5a4a6f', marginBottom: '15px' }}>Candidates</h3>
              {filteredCandidates.map((candidate) => (
                <div
                  key={candidate.id}
                  onClick={() => setSelectedCandidate(candidate)}
                  style={{
                    padding: '15px',
                    background: selectedCandidate?.id === candidate.id ? 'rgba(99, 102, 241, 0.1)' : 'white',
                    marginBottom: '10px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    borderLeft: `4px solid ${candidate.ai_score >= 70 ? '#27ae60' : '#f39c12'}`,
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                  }}
                >
                  <h4 style={{ margin: '0 0 5px 0', color: '#5a4a6f' }}>{candidate.full_name}</h4>
                  <p style={{ margin: '4px 0', color: '#7a6a8f', fontSize: '12px' }}>{candidate.email}</p>
                  <p style={{
                    margin: '4px 0',
                    color: candidate.ai_score >= 70 ? '#27ae60' : '#f39c12',
                    fontWeight: 'bold',
                    fontSize: '12px'
                  }}>
                    Score: {candidate.ai_score || 0}%
                  </p>
                </div>
              ))}
            </div>

            {/* Candidate Details */}
            {selectedCandidate && (
              <div className="user-info">
                <h3>Candidate Details</h3>

                <div style={{ marginBottom: '20px' }}>
                  <p><strong>Name:</strong> {selectedCandidate.full_name}</p>
                  <p><strong>Email:</strong> {selectedCandidate.email}</p>
                  <p><strong>Phone:</strong> {selectedCandidate.phone || 'N/A'}</p>
                  <p><strong>Location:</strong> {selectedCandidate.location || 'N/A'}</p>
                </div>

                <div style={{ marginBottom: '20px', padding: '15px', background: '#050810|#0a0e27|#1a1f35', borderRadius: '8px' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#0056b3' }}>Interview Details</h4>
                  <p><strong>Interview Type:</strong> {selectedCandidate.interview_type}</p>
                  <p>
                    <strong>AI Score:</strong>
                    <span style={{
                      display: 'inline-block',
                      marginLeft: '10px',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: selectedCandidate.ai_score >= 70 ? '#27ae60' : '#f39c12'
                    }}>
                      {selectedCandidate.ai_score}%
                    </span>
                  </p>
                  <p><strong>Status:</strong>
                    <span style={{
                      display: 'inline-block',
                      marginLeft: '10px',
                      padding: '4px 10px',
                      background: selectedCandidate.ai_score >= 70 ? '#d4edda' : '#fff3cd',
                      color: selectedCandidate.ai_score >= 70 ? '#155724' : '#856404',
                      borderRadius: '15px',
                      fontSize: '12px'
                    }}>
                      {selectedCandidate.ai_score >= 70 ? '✅ SHORTLISTED' : '⚠️ REVIEW'}
                    </span>
                  </p>
                </div>

                {selectedCandidate.ai_feedback && (
                  <div style={{ marginBottom: '20px', padding: '15px', background: '#1a1f35', borderRadius: '8px' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>AI Feedback</h4>
                    <p style={{ margin: 0, color: '#5a4a6f' }}>{selectedCandidate.ai_feedback}</p>
                  </div>
                )}

                <h4 style={{ color: '#5a4a6f', marginBottom: '15px' }}>Take Action</h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    onClick={() => handleDecision(selectedCandidate.id, selectedCandidate.job_id, 'hired')}
                    style={{
                      padding: '12px',
                      background: '#27ae60',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    ✅ Hire
                  </button>

                  <button
                    onClick={() => handleDecision(selectedCandidate.id, selectedCandidate.job_id, 'rejected')}
                    style={{
                      padding: '12px',
                      background: '#e74c3c',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    ❌ Reject
                  </button>

                  <button
                    onClick={() => handleDecision(selectedCandidate.id, selectedCandidate.job_id, 're-interview')}
                    style={{
                      padding: '12px',
                      background: '#f39c12',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      gridColumn: '1 / -1'
                    }}
                  >
                    🔄 Re-Interview
                  </button>
                </div>

                {selectedCandidate.resume_path && (
                  <button
                    style={{
                      marginTop: '15px',
                      width: '100%',
                      padding: '12px',
                      background: '#3498db',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    📄 View Resume
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


