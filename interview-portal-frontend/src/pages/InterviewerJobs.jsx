import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createJob } from '../api/interviews';

export default function InterviewerJobs() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    company: '',
    location: '',
    salary: '',
    requirements: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.company) {
      alert('Title and company are required');
      return;
    }

    try {
      setLoading(true);
      await createJob(form);
      alert('Job posted successfully!');
      navigate('/interviewer-dashboard');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #050810|#0a0e27|#1a1f35 0%, #050810|#0a0e27|#1a1f35 50%, #050810|#0a0e27|#1a1f35 100%)' }}>
      <div className="dashboard">
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h1>Post a New Job</h1>

          <form onSubmit={handleSubmit} style={{ background: 'white', padding: '30px', borderRadius: '15px' }}>
            <div className="form-group">
              <label>Job Title *</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g., Senior React Developer"
                required
              />
            </div>

            <div className="form-group">
              <label>Company *</label>
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Company name"
                required
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g., New York, Remote"
              />
            </div>

            <div className="form-group">
              <label>Salary</label>
              <input
                type="text"
                name="salary"
                value={form.salary}
                onChange={handleChange}
                placeholder="e.g., $100K - $150K"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Job description..."
                style={{ minHeight: '100px' }}
              />
            </div>

            <div className="form-group">
              <label>Requirements</label>
              <textarea
                name="requirements"
                value={form.requirements}
                onChange={handleChange}
                placeholder="Required skills and experience..."
                style={{ minHeight: '100px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button type="submit" className="btn" disabled={loading}>
                {loading ? 'Posting...' : 'Post Job'}
              </button>
              <Link to="/interviewer-dashboard" className="btn btn-secondary">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


