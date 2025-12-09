import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function BrowseJobs() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      fetchJobs();
    }
  }, [navigate]);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const jobsRes = await axios.get('http://localhost:5000/api/jobs', { headers });
      const appsRes = await axios.get('http://localhost:5000/api/candidate/applications', { headers });
      
      setJobs(jobsRes.data || []);
      setApplications(appsRes.data || []);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyForJob = async (jobId) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      await axios.post(`http://localhost:5000/api/jobs/${jobId}/apply`, {}, { headers });
      alert('Applied successfully! Your profile will be evaluated by AI.');
      fetchJobs();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to apply');
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isApplied = (jobId) => applications.some(app => app.job_id === jobId);

  if (loading) return <div className="container"><h2>Loading jobs...</h2></div>;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #050810|#0a0e27|#1a1f35 0%, #050810|#0a0e27|#1a1f35 50%, #050810|#0a0e27|#1a1f35 100%)' }}>
      <div className="dashboard">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1>💼 Browse Jobs</h1>
          <Link to="/candidate-dashboard" className="btn btn-secondary" style={{ width: '150px' }}>
            Back
          </Link>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #d4b5e8',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
        </div>

        {filteredJobs.length === 0 ? (
          <div className="user-info">
            <p>No jobs available at the moment.</p>
          </div>
        ) : (
          <div>
            {filteredJobs.map((job) => {
              const applied = isApplied(job.id);
              return (
                <div key={job.id} style={{
                  background: 'white',
                  padding: '20px',
                  marginBottom: '15px',
                  borderRadius: '10px',
                  borderLeft: '5px solid #b89dd9',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: '0 0 10px 0', color: '#5a4a6f' }}>{job.title}</h3>
                      <p style={{ margin: '5px 0', color: '#7a6a8f' }}>
                        <strong>Company:</strong> {job.company || 'Not specified'}
                      </p>
                      <p style={{ margin: '5px 0', color: '#7a6a8f' }}>
                        <strong>📍 Location:</strong> {job.location || 'Remote'}
                      </p>
                      <p style={{ margin: '5px 0', color: '#7a6a8f' }}>
                        <strong>💰 Salary:</strong> {job.salary || 'Negotiable'}
                      </p>
                      <p style={{ margin: '10px 0', color: '#5a4a6f', fontSize: '14px' }}>
                        {job.description}
                      </p>
                      {job.requirements && (
                        <p style={{ margin: '5px 0', color: '#7a6a8f', fontSize: '13px' }}>
                          <strong>Requirements:</strong> {job.requirements}
                        </p>
                      )}
                    </div>

                    <div style={{ textAlign: 'right', minWidth: '150px' }}>
                      {job.experience_level && (
                        <span style={{
                          display: 'inline-block',
                          padding: '6px 12px',
                          background: 'rgba(99, 102, 241, 0.1)',
                          color: '#5a4a6f',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          marginBottom: '10px'
                        }}>
                          {job.experience_level}
                        </span>
                      )}
                      <br />
                      {applied ? (
                        <span style={{
                          display: 'inline-block',
                          marginTop: '10px',
                          padding: '8px 16px',
                          background: '#d4edda',
                          color: '#155724',
                          borderRadius: '6px',
                          fontWeight: 'bold',
                          fontSize: '14px'
                        }}>
                          ✅ Applied
                        </span>
                      ) : (
                        <button
                          onClick={() => applyForJob(job.id)}
                          className="btn"
                          style={{
                            marginTop: '10px',
                            width: '140px',
                            padding: '10px'
                          }}
                        >
                          Apply Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}


