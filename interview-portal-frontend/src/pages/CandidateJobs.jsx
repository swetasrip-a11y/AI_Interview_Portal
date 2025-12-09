import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getJobs } from '../api/interviews';

export default function CandidateJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await getJobs();
      setJobs(response.data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container"><h2>Loading jobs...</h2></div>;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #050810|#0a0e27|#1a1f35 0%, #050810|#0a0e27|#1a1f35 50%, #050810|#0a0e27|#1a1f35 100%)' }}>
      <div className="dashboard">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1>💼 Job Postings</h1>
          <Link to="/candidate-dashboard" className="btn btn-secondary" style={{ width: '150px' }}>
            Back
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="user-info">
            <p>No jobs available at the moment.</p>
          </div>
        ) : (
          <div>
            {jobs.map((job) => (
              <div key={job.id} className="interview-card">
                <h3>{job.title}</h3>
                <p><strong>Company:</strong> {job.company}</p>
                <p><strong>Location:</strong> {job.location}</p>
                <p><strong>Salary:</strong> {job.salary}</p>
                <p><strong>Description:</strong> {job.description}</p>
                <p><strong>Requirements:</strong> {job.requirements}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


