import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createMaterial } from '../api/interviews';

export default function InterviewerMaterials() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    content: '',
    category: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createMaterial(form);
      alert('Material uploaded successfully!');
      navigate('/interviewer-dashboard');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to upload');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #050810|#0a0e27|#1a1f35 0%, #050810|#0a0e27|#1a1f35 50%, #050810|#0a0e27|#1a1f35 100%)' }}>
      <div className="dashboard">
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h1>Upload Study Materials</h1>

          <form onSubmit={handleSubmit} style={{ background: 'white', padding: '30px', borderRadius: '15px' }}>
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g., JavaScript ES6 Basics"
                required
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="e.g., JavaScript, React, etc."
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Brief description"
              />
            </div>

            <div className="form-group">
              <label>Content *</label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                placeholder="Add your study material content..."
                style={{ minHeight: '150px' }}
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button type="submit" className="btn" disabled={loading}>
                {loading ? 'Uploading...' : 'Upload Material'}
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


