import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getInterviews } from '../api/interviews';

export default function InterviewerInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const response = await getInterviews();
      setInterviews(response.data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container"><h2>Loading...</h2></div>;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #050810|#0a0e27|#1a1f35 0%, #050810|#0a0e27|#1a1f35 50%, #050810|#0a0e27|#1a1f35 100%)' }}>
      <div className="dashboard">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1>My Interviews</h1>
          <Link to="/interviewer-dashboard" className="btn btn-secondary" style={{ width: '150px' }}>
            Back
          </Link>
        </div>

        {interviews.length === 0 ? (
          <div className="user-info">
            <p>No interviews created yet. <Link to="/interviewer/create-interview">Create one now</Link></p>
          </div>
        ) : (
          <div>
            {interviews.map((interview) => (
              <div key={interview.id} className="interview-card">
                <h3>{interview.title}</h3>
                <p><strong>Job Title:</strong> {interview.job_title}</p>
                <p><strong>Description:</strong> {interview.description}</p>
                <p><strong>Status:</strong> <span className={`badge ${interview.status}`}>{interview.status}</span></p>
                <Link 
                  to={`/interviewer/candidates/${interview.id}`}
                  className="btn"
                  style={{ display: 'inline-block', width: '150px', marginTop: '10px' }}
                >
                  View Candidates
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


