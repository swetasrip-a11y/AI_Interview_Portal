import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function CompanyDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    interviewsCompleted: 0,
    hired: 0
  });
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
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [jobsRes, usersRes, interviewsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/jobs', { headers }).catch(() => ({ data: [] })),
        axios.get('http://localhost:5000/api/users?role=candidate', { headers }).catch(() => ({ data: [] })),
        axios.get('http://localhost:5000/api/interviews', { headers }).catch(() => ({ data: [] }))
      ]);

      setJobs(jobsRes.data || []);
      setCandidates(usersRes.data || []);
      setInterviews(interviewsRes.data || []);

      setStats({
        totalJobs: (jobsRes.data || []).length,
        totalApplications: (usersRes.data || []).length,
        interviewsCompleted: (interviewsRes.data || []).filter(i => i.status === 'completed').length,
        hired: (usersRes.data || []).filter(u => u.status === 'hired').length
      });
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
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
    logoutBtn: {
      padding: '0.6rem 1.2rem',
      background: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.3s ease'
    },
    tabsContainer: {
      display: 'flex',
      gap: '1rem',
      borderBottom: '1px solid rgba(100, 116, 139, 0.3)',
      marginBottom: '2rem',
      overflowX: 'auto',
      paddingBottom: '1rem'
    },
    tab: (isActive) => ({
      padding: '0.75rem 1.25rem',
      cursor: 'pointer',
      background: isActive ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
      border: isActive ? '1px solid rgba(99, 102, 241, 0.5)' : '1px solid rgba(100, 116, 139, 0.3)',
      color: isActive ? '#6366f1' : '#cbd5e1',
      borderRadius: '8px',
      fontWeight: isActive ? '600' : '500',
      transition: 'all 0.3s ease',
      whiteSpace: 'nowrap'
    }),
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem'
    },
    statCard: {
      background: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(100, 116, 139, 0.3)',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
    },
    statNumber: {
      fontSize: '2.5rem',
      fontWeight: '700',
      color: '#6366f1',
      margin: '0.75rem 0'
    },
    actionGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem'
    },
    actionCard: {
      background: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(100, 116, 139, 0.3)',
      borderRadius: '12px',
      padding: '1.5rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      color: '#f8fafc'
    },
    actionCardIcon: {
      fontSize: '2.5rem',
      marginBottom: '1rem'
    },
    listContainer: {
      background: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(100, 116, 139, 0.3)',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
    },
    listItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      background: 'rgba(30, 41, 59, 0.5)',
      borderLeft: '3px solid #6366f1',
      borderRadius: '8px',
      marginBottom: '1rem',
      transition: 'all 0.3s ease'
    },
    badge: (color) => ({
      display: 'inline-block',
      padding: '0.4rem 0.8rem',
      background: color === 'success' ? 'rgba(16, 185, 129, 0.2)' : 
                  color === 'warning' ? 'rgba(251, 146, 60, 0.2)' :
                  color === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(99, 102, 241, 0.2)',
      color: color === 'success' ? '#10b981' : 
             color === 'warning' ? '#fb923c' :
             color === 'error' ? '#ef4444' : '#6366f1',
      borderRadius: '6px',
      fontWeight: '600',
      fontSize: '0.85rem'
    }),
    button: {
      padding: '0.6rem 1rem',
      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.3s ease'
    },
    secondaryButton: {
      padding: '0.6rem 1rem',
      background: 'rgba(99, 102, 241, 0.2)',
      color: '#6366f1',
      border: '1px solid rgba(99, 102, 241, 0.5)',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.3s ease'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={{ margin: '0 0 0.5rem 0' }}>🏢 Company Dashboard</h1>
          <p style={{ margin: 0, color: '#cbd5e1' }}>Welcome, {user.full_name}!</p>
        </div>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>

      {/* Tabs */}
      <div style={styles.tabsContainer}>
        {[
          { id: 'overview', label: '📊 Overview', icon: '📊' },
          { id: 'jobs', label: '💼 Jobs', icon: '💼' },
          { id: 'candidates', label: '👥 Candidates', icon: '👥' },
          { id: 'interviews', label: '🎙️ Interviews', icon: '🎙️' },
          { id: 'reports', label: '📈 Reports', icon: '📈' }
        ].map(t => (
          <button
            key={t.id}
            style={styles.tab(activeTab === t.id)}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div>
          <h2 style={{ marginBottom: '1.5rem', color: '#e2e8f0' }}>Dashboard Overview</h2>

          {/* Stats Grid */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <p style={{ color: '#cbd5e1', margin: '0 0 0.5rem 0' }}>Total Jobs Posted</p>
              <div style={styles.statNumber}>{stats.totalJobs}</div>
              <p style={{ color: '#64748b', margin: '0', fontSize: '0.9rem' }}>Active postings</p>
            </div>
            <div style={styles.statCard}>
              <p style={{ color: '#cbd5e1', margin: '0 0 0.5rem 0' }}>Total Candidates</p>
              <div style={styles.statNumber}>{stats.totalApplications}</div>
              <p style={{ color: '#64748b', margin: '0', fontSize: '0.9rem' }}>In the pool</p>
            </div>
            <div style={styles.statCard}>
              <p style={{ color: '#cbd5e1', margin: '0 0 0.5rem 0' }}>Interviews Done</p>
              <div style={styles.statNumber}>{stats.interviewsCompleted}</div>
              <p style={{ color: '#64748b', margin: '0', fontSize: '0.9rem' }}>Completed</p>
            </div>
            <div style={styles.statCard}>
              <p style={{ color: '#cbd5e1', margin: '0 0 0.5rem 0' }}>Hired</p>
              <div style={styles.statNumber}>{stats.hired}</div>
              <p style={{ color: '#64748b', margin: '0', fontSize: '0.9rem' }}>New hires</p>
            </div>
          </div>

          {/* Quick Actions */}
          <h3 style={{ marginBottom: '1.5rem', color: '#e2e8f0' }}>Quick Actions</h3>
          <div style={styles.actionGrid}>
            <Link to="/company/post-job" style={{ textDecoration: 'none' }}>
              <div style={{...styles.actionCard, borderLeft: '4px solid #f97316'}}>
                <div style={styles.actionCardIcon}>📝</div>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>Post New Job</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#cbd5e1' }}>Create a new job opening</p>
              </div>
            </Link>

            <Link to="/company/recruitment" style={{ textDecoration: 'none' }}>
              <div style={{...styles.actionCard, borderLeft: '4px solid #10b981'}}>
                <div style={styles.actionCardIcon}>👥</div>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>Recruit Candidates</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#cbd5e1' }}>Review & hire candidates</p>
              </div>
            </Link>

            <Link to="/company/interview-reports" style={{ textDecoration: 'none' }}>
              <div style={{...styles.actionCard, borderLeft: '4px solid #6366f1'}}>
                <div style={styles.actionCardIcon}>📊</div>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>Interview Reports</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#cbd5e1' }}>View AI interview results</p>
              </div>
            </Link>

            <Link to="/company/users" style={{ textDecoration: 'none' }}>
              <div style={{...styles.actionCard, borderLeft: '4px solid #8b5cf6'}}>
                <div style={styles.actionCardIcon}>⚙️</div>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>Manage Users</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#cbd5e1' }}>Add team members</p>
              </div>
            </Link>
          </div>

          {/* Recent Activities */}
          <h3 style={{ marginBottom: '1.5rem', color: '#e2e8f0' }}>Recent Activities</h3>
          <div style={styles.listContainer}>
            <div style={styles.listItem}>
              <div>
                <p style={{ margin: 0, fontWeight: '600' }}>✅ New Job Posted</p>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>Senior React Developer - Today</p>
              </div>
              <span style={styles.badge('success')}>New</span>
            </div>
            <div style={styles.listItem}>
              <div>
                <p style={{ margin: 0, fontWeight: '600' }}>🎙️ 3 Interviews Completed</p>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>Average Score: 78% - Today</p>
              </div>
              <span style={styles.badge('success')}>Done</span>
            </div>
            <div style={styles.listItem}>
              <div>
                <p style={{ margin: 0, fontWeight: '600' }}>👤 5 New Applications</p>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>Pending review</p>
              </div>
              <span style={styles.badge('warning')}>Pending</span>
            </div>
          </div>
        </div>
      )}

      {/* JOBS TAB */}
      {activeTab === 'jobs' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ margin: 0, color: '#e2e8f0' }}>Job Postings</h2>
            <Link to="/company/post-job" style={{ textDecoration: 'none' }}>
              <button style={styles.button}>➕ Post New Job</button>
            </Link>
          </div>

          {jobs.length === 0 ? (
            <div style={styles.listContainer}>
              <p style={{ textAlign: 'center', color: '#cbd5e1' }}>No jobs posted yet. Click "Post New Job" to get started.</p>
            </div>
          ) : (
            <div style={styles.listContainer}>
              {jobs.map(job => (
                <div key={job.id} style={styles.listItem}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#f8fafc' }}>{job.title}</h4>
                    <p style={{ margin: '0.25rem 0', color: '#cbd5e1', fontSize: '0.9rem' }}>{job.location}</p>
                    <p style={{ margin: '0.25rem 0', color: '#94a3b8', fontSize: '0.85rem' }}>Posted: {new Date(job.created_at).toLocaleDateString()}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span style={styles.badge('success')}>Active</span>
                    <button style={styles.secondaryButton}>View</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CANDIDATES TAB */}
      {activeTab === 'candidates' && (
        <div>
          <h2 style={{ marginBottom: '1.5rem', color: '#e2e8f0' }}>Candidate Pool</h2>
          
          {candidates.length === 0 ? (
            <div style={styles.listContainer}>
              <p style={{ textAlign: 'center', color: '#cbd5e1' }}>No candidates yet.</p>
            </div>
          ) : (
            <div style={styles.listContainer}>
              {candidates.slice(0, 10).map(candidate => (
                <div key={candidate.id} style={styles.listItem}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#f8fafc' }}>{candidate.full_name}</h4>
                    <p style={{ margin: '0.25rem 0', color: '#cbd5e1', fontSize: '0.9rem' }}>{candidate.email}</p>
                  </div>
                  <button style={styles.secondaryButton}>View Profile</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* INTERVIEWS TAB */}
      {activeTab === 'interviews' && (
        <div>
          <h2 style={{ marginBottom: '1.5rem', color: '#e2e8f0' }}>Interview Results</h2>
          
          {interviews.length === 0 ? (
            <div style={styles.listContainer}>
              <p style={{ textAlign: 'center', color: '#cbd5e1' }}>No interviews conducted yet.</p>
            </div>
          ) : (
            <div style={styles.listContainer}>
              {interviews.map(interview => (
                <div key={interview.id} style={styles.listItem}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#f8fafc' }}>{interview.title}</h4>
                    <p style={{ margin: '0.25rem 0', color: '#cbd5e1', fontSize: '0.9rem' }}>Score: {interview.avg_score || 0}%</p>
                  </div>
                  <button style={styles.secondaryButton}>Details</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* REPORTS TAB */}
      {activeTab === 'reports' && (
        <div>
          <h2 style={{ marginBottom: '1.5rem', color: '#e2e8f0' }}>Analytics & Reports</h2>
          
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <p style={{ color: '#cbd5e1', margin: '0 0 0.5rem 0' }}>Avg Interview Score</p>
              <div style={styles.statNumber}>
                {interviews.length > 0 
                  ? Math.round(interviews.reduce((sum, i) => sum + (i.avg_score || 0), 0) / interviews.length)
                  : 0}%
              </div>
              <p style={{ color: '#64748b', margin: '0', fontSize: '0.9rem' }}>Based on all interviews</p>
            </div>
            <div style={styles.statCard}>
              <p style={{ color: '#cbd5e1', margin: '0 0 0.5rem 0' }}>Conversion Rate</p>
              <div style={styles.statNumber}>
                {candidates.length > 0 
                  ? Math.round((stats.hired / candidates.length) * 100)
                  : 0}%
              </div>
              <p style={{ color: '#64748b', margin: '0', fontSize: '0.9rem' }}>Candidates to hired</p>
            </div>
          </div>

          <Link to="/company/interview-reports" style={{ textDecoration: 'none' }}>
            <button style={styles.button}>View Detailed Reports</button>
          </Link>
        </div>
      )}
    </div>
  );
}
