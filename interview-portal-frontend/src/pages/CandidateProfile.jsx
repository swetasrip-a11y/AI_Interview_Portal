import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function CandidateProfile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    phone: '',
    location: '',
    skills: '',
    experience: '',
    education: ''
  });
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      const userData = JSON.parse(storedUser);
      if (userData.role !== 'candidate') {
        navigate('/candidate-dashboard');
      }
      setUser(userData);
      fetchProfile();
    }
  }, [navigate]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get('http://localhost:5000/api/candidate/profile', { headers });
      if (response.data) {
        setProfile({
          phone: response.data.phone || '',
          location: response.data.location || '',
          skills: response.data.skills || '',
          experience: response.data.experience || '',
          education: response.data.education || ''
        });
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!resume) {
      alert('Please select a resume file');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('resume', resume);
      formData.append('phone', profile.phone);
      formData.append('location', profile.location);
      formData.append('skills', profile.skills);
      formData.append('experience', profile.experience);
      formData.append('education', profile.education);

      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      await axios.post('http://localhost:5000/api/candidate/profile', formData, {
        headers: { ...headers, 'Content-Type': 'multipart/form-data' }
      });

      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
      setResume(null);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to upload resume');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #050810|#0a0e27|#1a1f35 0%, #050810|#0a0e27|#1a1f35 50%, #050810|#0a0e27|#1a1f35 100%)' }}>
      <div className="dashboard">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <h1>📋 My Profile & Resume</h1>
          <Link to="/candidate-dashboard" className="btn btn-secondary" style={{ width: '150px' }}>
            Back
          </Link>
        </div>

        <div className="user-info">
          <h2>Personal Information</h2>
          <form onSubmit={handleUpload}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#5a4a6f' }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleProfileChange}
                  placeholder="Your phone number"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #d4b5e8',
                    borderRadius: '6px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#5a4a6f' }}>
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={profile.location}
                  onChange={handleProfileChange}
                  placeholder="City, Country"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #d4b5e8',
                    borderRadius: '6px'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#5a4a6f' }}>
                Skills (comma-separated)
              </label>
              <textarea
                name="skills"
                value={profile.skills}
                onChange={handleProfileChange}
                placeholder="e.g. JavaScript, React, Node.js"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #d4b5e8',
                  borderRadius: '6px',
                  minHeight: '80px'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#5a4a6f' }}>
                Professional Experience
              </label>
              <textarea
                name="experience"
                value={profile.experience}
                onChange={handleProfileChange}
                placeholder="Describe your work experience"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #d4b5e8',
                  borderRadius: '6px',
                  minHeight: '80px'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#5a4a6f' }}>
                Education
              </label>
              <textarea
                name="education"
                value={profile.education}
                onChange={handleProfileChange}
                placeholder="Your education details"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #d4b5e8',
                  borderRadius: '6px',
                  minHeight: '80px'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px', padding: '20px', background: '#050810|#0a0e27|#1a1f35', borderRadius: '8px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#0056b3' }}>
                📄 Upload Resume (PDF/DOC)
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                style={{
                  display: 'block',
                  marginBottom: '10px',
                  padding: '10px',
                  border: '2px dashed #3498db',
                  borderRadius: '6px',
                  width: '100%'
                }}
              />
              {resume && (
                <p style={{ color: '#27ae60', margin: '10px 0' }}>
                  ✅ Selected: {resume.name}
                </p>
              )}
            </div>

            {success && (
              <div style={{
                padding: '12px',
                background: '#d4edda',
                border: '1px solid #27ae60',
                borderRadius: '6px',
                color: '#155724',
                marginBottom: '20px'
              }}>
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn"
              style={{ width: '200px', fontSize: '16px', padding: '12px' }}
            >
              {loading ? 'Uploading...' : '💾 Save Profile & Resume'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


