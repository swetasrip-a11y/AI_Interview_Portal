import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function CompanyPostJobEnhanced() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    salary_min: '',
    salary_max: '',
    requirements: '',
    experience_level: 'Mid-Level',
    employment_type: 'Full-time',
    skills: ''
  });
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    const userData = JSON.parse(storedUser);
    if (userData.role !== 'company') {
      navigate('/candidate-dashboard');
      return;
    }
    setUser(userData);
    fetchJobs();
  }, [navigate]);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get('http://localhost:5000/api/company/jobs', { headers }).catch(() => ({ data: [] }));
      setJobs(response.data || []);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!formData.title || !formData.description || !formData.location) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      await axios.post('http://localhost:5000/api/jobs', formData, { headers });

      setSuccess('✓ Job posted successfully!');
      setFormData({
        title: '',
        description: '',
        location: '',
        salary_min: '',
        salary_max: '',
        requirements: '',
        experience_level: 'Mid-Level',
        employment_type: 'Full-time',
        skills: ''
      });
      
      setTimeout(() => {
        setSuccess('');
        fetchJobs();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div style={{ color: '#f8fafc', textAlign: 'center', padding: '2rem' }}>Loading...</div>;

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #050810 0%, #0a0e27 50%, #1a1f35 100%)',
      padding: '2rem',
      color: '#f8fafc',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
      paddingBottom: '1.5rem',
      borderBottom: '1px solid rgba(100, 116, 139, 0.3)'
    },
    backBtn: {
      padding: '0.6rem 1.2rem',
      background: 'rgba(100, 116, 139, 0.2)',
      color: '#cbd5e1',
      border: '1px solid rgba(100, 116, 139, 0.5)',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      textDecoration: 'none'
    },
    mainGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '2rem',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    formSection: {
      background: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(100, 116, 139, 0.3)',
      borderRadius: '16px',
      padding: '2rem',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
    },
    formGroup: {
      marginBottom: '1.5rem'
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: '600',
      color: '#e2e8f0',
      fontSize: '0.95rem'
    },
    input: {
      width: '100%',
      padding: '0.75rem 1rem',
      background: 'rgba(30, 41, 59, 0.5)',
      border: '1px solid rgba(100, 116, 139, 0.3)',
      borderRadius: '8px',
      color: '#f8fafc',
      fontFamily: 'inherit',
      fontSize: '0.95rem',
      transition: 'all 0.3s ease'
    },
    textarea: {
      width: '100%',
      padding: '0.75rem 1rem',
      background: 'rgba(30, 41, 59, 0.5)',
      border: '1px solid rgba(100, 116, 139, 0.3)',
      borderRadius: '8px',
      color: '#f8fafc',
      fontFamily: 'inherit',
      fontSize: '0.95rem',
      minHeight: '100px',
      resize: 'vertical',
      transition: 'all 0.3s ease'
    },
    select: {
      width: '100%',
      padding: '0.75rem 1rem',
      background: 'rgba(30, 41, 59, 0.5)',
      border: '1px solid rgba(100, 116, 139, 0.3)',
      borderRadius: '8px',
      color: '#f8fafc',
      fontFamily: 'inherit',
      fontSize: '0.95rem'
    },
    submitBtn: {
      width: '100%',
      padding: '1rem 2rem',
      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '700',
      fontSize: '1rem',
      transition: 'all 0.3s ease'
    },
    jobsList: {
      display: 'grid',
      gap: '1rem'
    },
    jobCard: {
      background: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(100, 116, 139, 0.3)',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      transition: 'all 0.3s ease'
    },
    alertSuccess: {
      padding: '1rem',
      background: 'rgba(16, 185, 129, 0.2)',
      border: '1px solid rgba(16, 185, 129, 0.5)',
      color: '#10b981',
      borderRadius: '8px',
      marginBottom: '1rem',
      fontWeight: '600'
    },
    alertError: {
      padding: '1rem',
      background: 'rgba(239, 68, 68, 0.2)',
      border: '1px solid rgba(239, 68, 68, 0.5)',
      color: '#ef4444',
      borderRadius: '8px',
      marginBottom: '1rem',
      fontWeight: '600'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={{ margin: '0 0 0.5rem 0' }}>💼 Post New Job</h1>
          <p style={{ margin: 0, color: '#cbd5e1' }}>Create a new job opening and find the right candidates</p>
        </div>
        <Link to="/company-dashboard" style={{ textDecoration: 'none' }}>
          <button style={styles.backBtn}>← Back to Dashboard</button>
        </Link>
      </div>

      {/* Main Content */}
      <div style={styles.mainGrid}>
        {/* Form Section */}
        <div style={styles.formSection}>
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#e2e8f0' }}>Job Details</h2>

          {success && <div style={styles.alertSuccess}>{success}</div>}
          {error && <div style={styles.alertError}>{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Job Title */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Job Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Senior React Developer"
                style={styles.input}
              />
            </div>

            {/* Job Description */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Job Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the role, responsibilities, and expectations..."
                style={styles.textarea}
              />
            </div>

            {/* Location */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Remote, New York, Bangalore"
                style={styles.input}
              />
            </div>

            {/* Salary Range */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={styles.label}>Minimum Salary</label>
                <input
                  type="text"
                  name="salary_min"
                  value={formData.salary_min}
                  onChange={handleChange}
                  placeholder="e.g., 50000"
                  style={styles.input}
                />
              </div>
              <div>
                <label style={styles.label}>Maximum Salary</label>
                <input
                  type="text"
                  name="salary_max"
                  value={formData.salary_max}
                  onChange={handleChange}
                  placeholder="e.g., 100000"
                  style={styles.input}
                />
              </div>
            </div>

            {/* Experience Level */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Experience Level</label>
              <select
                name="experience_level"
                value={formData.experience_level}
                onChange={handleChange}
                style={styles.select}
              >
                <option>Entry Level</option>
                <option>Mid-Level</option>
                <option>Senior Level</option>
                <option>Lead/Manager</option>
              </select>
            </div>

            {/* Employment Type */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Employment Type</label>
              <select
                name="employment_type"
                value={formData.employment_type}
                onChange={handleChange}
                style={styles.select}
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
            </div>

            {/* Required Skills */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Required Skills (comma-separated)</label>
              <textarea
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g., React, JavaScript, Node.js, MongoDB"
                style={{...styles.textarea, minHeight: '80px'}}
              />
            </div>

            {/* Requirements */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Key Requirements</label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                placeholder="List key requirements and qualifications..."
                style={{...styles.textarea, minHeight: '80px'}}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                ...styles.submitBtn,
                opacity: loading ? 0.6 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
              disabled={loading}
            >
              {loading ? '⏳ Posting...' : '✓ Post Job'}
            </button>
          </form>
        </div>

        {/* Active Jobs Section */}
        <div>
          <div style={{...styles.formSection, marginBottom: '2rem'}}>
            <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#e2e8f0' }}>
              Active Job Postings ({jobs.length})
            </h2>

            {jobs.length === 0 ? (
              <p style={{ color: '#cbd5e1', textAlign: 'center', margin: '2rem 0' }}>
                No active jobs yet. Post your first job above!
              </p>
            ) : (
              <div style={styles.jobsList}>
                {jobs.map(job => (
                  <div key={job.id} style={styles.jobCard}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#e2e8f0' }}>{job.title}</h4>
                    <p style={{ margin: '0.25rem 0', color: '#cbd5e1', fontSize: '0.9rem' }}>
                      📍 {job.location}
                    </p>
                    {job.salary_min && job.salary_max && (
                      <p style={{ margin: '0.25rem 0', color: '#cbd5e1', fontSize: '0.9rem' }}>
                        💰 ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}
                      </p>
                    )}
                    <p style={{ margin: '0.5rem 0 0 0', color: '#94a3b8', fontSize: '0.85rem' }}>
                      Posted: {new Date(job.created_at).toLocaleDateString()}
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                      <button style={{
                        flex: 1,
                        padding: '0.5rem',
                        background: 'rgba(99, 102, 241, 0.2)',
                        color: '#6366f1',
                        border: '1px solid rgba(99, 102, 241, 0.5)',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '0.85rem'
                      }}>
                        View
                      </button>
                      <button style={{
                        flex: 1,
                        padding: '0.5rem',
                        background: 'rgba(239, 68, 68, 0.2)',
                        color: '#ef4444',
                        border: '1px solid rgba(239, 68, 68, 0.5)',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '0.85rem'
                      }}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tips Section */}
          <div style={{...styles.formSection, background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.3)'}}>
            <h3 style={{ marginTop: 0, color: '#10b981' }}>✓ Tips for Better Job Posting</h3>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#cbd5e1', lineHeight: '1.8' }}>
              <li>Be specific about role expectations</li>
              <li>List required and nice-to-have skills separately</li>
              <li>Include salary range to attract quality candidates</li>
              <li>Use clear, concise language</li>
              <li>Highlight company culture and benefits</li>
              <li>Use relevant keywords for better discoverability</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
