import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createInterview } from '../api/interviews';

export default function CreateInterview() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    job_title: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) {
      setError('Interview title is required');
      return;
    }

    try {
      setLoading(true);
      await createInterview(form);
      alert('Interview created successfully!');
      navigate('/interviewer-dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create interview');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #050810|#0a0e27|#1a1f35 0%, #050810|#0a0e27|#1a1f35 50%, #050810|#0a0e27|#1a1f35 100%)' }}>
      <div className="dashboard">
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h1>Create New Interview</h1>

          <form onSubmit={handleSubmit} style={{ background: 'white', padding: '30px', borderRadius: '15px' }}>
            <div className="form-group">
              <label>Interview Title *</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g., React Developer Interview Round 1"
                required
              />
            </div>

            <div className="form-group">
              <label>Job Title</label>
              <input
                type="text"
                name="job_title"
                value={form.job_title}
                onChange={handleChange}
                placeholder="e.g., Senior React Developer"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Add details about this interview..."
                style={{ minHeight: '100px' }}
              />
            </div>

            {error && <div className="error">{error}</div>}

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button type="submit" className="btn" disabled={loading}>
                {loading ? 'Creating...' : 'Create Interview'}
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


