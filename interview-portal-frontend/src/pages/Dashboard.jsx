import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/dashboard-enhanced.css';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user)
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
      </div>
    );

  return (
    <div className="dashboard-container">
      <div className="dashboard-background">
        <div className="gradient-orb gradient-orb-1"></div>
        <div className="gradient-orb gradient-orb-2"></div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-header">
          <div className="header-greeting">
            <h1>Welcome to Interview Portal, {user.full_name}👋</h1>
            <p>Your gateway to success in technical interviews</p>
          </div>
          <button className="btn btn-danger logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>

        <div className="user-profile-card">
          <div className="profile-icon">👤</div>
          <div className="profile-info">
            <h2>Your Profile</h2>
            <div className="profile-details">
              <p>
                <strong>Name:</strong> <span>{user.full_name}</span>
              </p>
              <p>
                <strong>Email:</strong> <span>{user.email}</span>
              </p>
              <p>
                <strong>Role:</strong>{' '}
                <span className="role-badge">{user.role?.toUpperCase()}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <Link to="/questions" className="feature-card primary-card">
            <div className="card-icon">📝</div>
            <h3>Take Interview</h3>
            <p>Answer interview questions and get evaluated</p>
            <div className="card-arrow">→</div>
          </Link>

          <Link to="/results" className="feature-card success-card">
            <div className="card-icon">📊</div>
            <h3>View Results</h3>
            <p>Check your performance and scores</p>
            <div className="card-arrow">→</div>
          </Link>

          <Link to="/resume-upload" className="feature-card warning-card">
            <div className="card-icon">📄</div>
            <h3>Upload Resume</h3>
            <p>Upload and manage your resume documents</p>
            <div className="card-arrow">→</div>
          </Link>

          <Link to="/materials" className="feature-card info-card">
            <div className="card-icon">📚</div>
            <h3>Study Materials</h3>
            <p>Access comprehensive study resources</p>
            <div className="card-arrow">→</div>
          </Link>
        </div>

        {user.role === 'admin' && (
          <div className="admin-section">
            <h2>Admin Panel</h2>
            <div className="admin-grid">
              <Link to="/admin/questions" className="admin-card">
                <div className="admin-icon">⚙️</div>
                <h3>Manage Questions</h3>
                <p>Add, edit, and delete interview questions</p>
              </Link>
            </div>
          </div>
        )}

        {user.role === 'interviewer' && (
          <div className="interviewer-section">
            <h2>Interviewer Dashboard</h2>
            <div className="interviewer-grid">
              <Link to="/interviewer/interviews" className="interviewer-card">
                <div className="interviewer-icon">🎯</div>
                <h3>Scheduled Interviews</h3>
                <p>View and conduct interviews</p>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


