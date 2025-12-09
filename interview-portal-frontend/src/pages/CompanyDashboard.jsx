import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function CompanyDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
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
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    },
    backgroundAnimation: {
      position: 'absolute',
      top: '-50%',
      left: '-50%',
      width: '200%',
      height: '200%',
      background: 'radial-gradient(circle, rgba(99,102,241,0.08) 1px, transparent 1px)',
      backgroundSize: '50px 50px',
      animation: 'float 30s infinite linear',
      pointerEvents: 'none',
      zIndex: 0
    },
    contentWrapper: {
      position: 'relative',
      zIndex: 1
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
      paddingBottom: '1.5rem',
      borderBottom: '1px solid rgba(100, 116, 139, 0.3)',
      animation: 'slideDown 0.6s ease-out'
    },
    headerTitle: {
      margin: '0 0 0.5rem 0',
      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      fontSize: '2.5rem',
      fontWeight: 'bold'
    },
    logoutBtn: {
      padding: '0.6rem 1.2rem',
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
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
      paddingBottom: '1rem',
      animation: 'slideUp 0.6s ease-out 0.1s backwards'
    },
    tab: (isActive) => ({
      padding: '0.75rem 1.25rem',
      cursor: 'pointer',
      background: isActive ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.2) 100%)' : 'transparent',
      border: isActive ? '2px solid #6366f1' : '1px solid rgba(100, 116, 139, 0.3)',
      color: isActive ? '#6366f1' : '#cbd5e1',
      borderRadius: '8px',
      fontWeight: isActive ? '600' : '500',
      transition: 'all 0.3s ease',
      whiteSpace: 'nowrap',
      boxShadow: isActive ? '0 4px 15px rgba(99, 102, 241, 0.2)' : 'none'
    }),
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem',
      animation: 'fadeInUp 0.8s ease-out 0.2s backwards'
    },
    statCard: {
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
      backdropFilter: 'blur(10px)',
      border: '2px solid rgba(99, 102, 241, 0.2)',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
      animation: 'glow 4s ease-in-out infinite'
    },
    statCardHover: {
      transform: 'translateY(-10px) scale(1.05)',
      borderColor: '#8b5cf6',
      boxShadow: '0 15px 40px rgba(99, 102, 241, 0.4)',
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.15) 100%)'
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
      marginBottom: '2rem',
      animation: 'fadeInUp 0.8s ease-out 0.4s backwards'
    },
    actionCardContainer: {
      textDecoration: 'none',
      cursor: 'pointer'
    },
    actionCard: {
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
      backdropFilter: 'blur(10px)',
      border: '2px solid rgba(100, 116, 139, 0.3)',
      borderRadius: '12px',
      padding: '1.5rem',
      cursor: 'pointer',
      transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      color: '#f8fafc',
      position: 'relative',
      overflow: 'hidden',
      height: '100%',
      animation: 'softGlow 3.5s ease-in-out infinite'
    },
    actionCardHover: {
      transform: 'translateY(-15px) scale(1.05)',
      borderColor: '#8b5cf6',
      boxShadow: '0 20px 50px rgba(99, 102, 241, 0.4)',
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.15) 100%)'
    },
    actionCardIcon: {
      fontSize: '2.5rem',
      marginBottom: '1rem',
      display: 'block',
      animation: 'bounce 2s infinite, pulse 3s ease-in-out infinite',
      textShadow: '0 0 15px rgba(99, 102, 241, 0.3)',
      filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.3))'
    },
    listContainer: {
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.5) 100%)',
      backdropFilter: 'blur(10px)',
      border: '2px solid rgba(100, 116, 139, 0.3)',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      animation: 'fadeInUp 0.8s ease-out 0.6s backwards'
    },
    listItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      background: 'rgba(30, 41, 59, 0.5)',
      borderLeft: '4px solid #6366f1',
      borderRadius: '8px',
      marginBottom: '1rem',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    },
    listItemHover: {
      transform: 'translateX(10px)',
      borderLeftColor: '#8b5cf6',
      boxShadow: '0 4px 15px rgba(99, 102, 241, 0.2)',
      background: 'rgba(30, 41, 59, 0.8)'
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
      fontSize: '0.85rem',
      border: `1px solid ${
        color === 'success' ? 'rgba(16, 185, 129, 0.4)' : 
        color === 'warning' ? 'rgba(251, 146, 60, 0.4)' :
        color === 'error' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(99, 102, 241, 0.4)'
      }`
    }),
    button: {
      padding: '0.6rem 1rem',
      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
    },
    secondaryButton: {
      padding: '0.6rem 1rem',
      background: 'rgba(99, 102, 241, 0.2)',
      color: '#6366f1',
      border: '2px solid rgba(99, 102, 241, 0.5)',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.3s ease'
    }
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes float {
          0% { transform: translate(0, 0); }
          50% { transform: translate(25px, 25px); }
          100% { transform: translate(0, 0); }
        }
        
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes rotateSquare {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.05); }
          100% { transform: rotate(360deg) scale(1); }
        }

        @keyframes shimmer {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }

        @keyframes pulseBorder {
          0%, 100% { border-color: rgba(99, 102, 241, 0.3); }
          50% { border-color: rgba(99, 102, 241, 0.8); }
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.5), 0 0 20px rgba(99, 102, 241, 0.3); }
          50% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.8), 0 0 40px rgba(139, 92, 246, 0.6); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        @keyframes softGlow {
          0%, 100% { box-shadow: 0 0 10px rgba(99, 102, 241, 0.2); }
          50% { box-shadow: 0 0 30px rgba(99, 102, 241, 0.5); }
        }

        @keyframes gradientAnimation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <div style={styles.backgroundAnimation}></div>

      <div style={styles.contentWrapper}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.headerTitle}>🏢 Company Dashboard</h1>
            <p style={{ margin: 0, color: '#cbd5e1' }}>Welcome, {user.full_name}!</p>
          </div>
          <button 
            style={styles.logoutBtn} 
            onClick={handleLogout}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 10px 25px rgba(239, 68, 68, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            🚪 Logout
          </button>
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
              onMouseEnter={(e) => {
                if (activeTab !== t.id) {
                  e.target.style.background = 'rgba(99, 102, 241, 0.1)';
                  e.target.style.borderColor = 'rgba(99, 102, 241, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== t.id) {
                  e.target.style.background = 'transparent';
                  e.target.style.borderColor = 'rgba(100, 116, 139, 0.3)';
                }
              }}
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
              {[
                { label: 'Total Jobs Posted', value: stats.totalJobs, detail: 'Active postings', emoji: '💼' },
                { label: 'Total Candidates', value: stats.totalApplications, detail: 'In the pool', emoji: '👥' },
                { label: 'Interviews Done', value: stats.interviewsCompleted, detail: 'Completed', emoji: '🎙️' },
                { label: 'Hired', value: stats.hired, detail: 'New hires', emoji: '✅' }
              ].map((stat, idx) => (
                <div
                  key={idx}
                  style={{...styles.statCard, ...(hoveredCard === `stat-${idx}` ? styles.statCardHover : {}), position: 'relative'}}
                  onMouseEnter={() => setHoveredCard(`stat-${idx}`)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Rotating square decoration */}
                  <div style={{
                    position: 'absolute',
                    top: '-25px',
                    right: '-25px',
                    width: '70px',
                    height: '70px',
                    border: '2px solid rgba(99, 102, 241, 0.3)',
                    borderRadius: '6px',
                    animation: 'rotateSquare ' + (7 + idx) + 's linear infinite',
                    pointerEvents: 'none'
                  }}></div>
                  <p style={{ color: '#cbd5e1', margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{stat.emoji} {stat.label}</p>
                  <div style={styles.statNumber}>{stat.value}</div>
                  <p style={{ color: '#64748b', margin: '0', fontSize: '0.9rem' }}>{stat.detail}</p>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <h3 style={{ marginBottom: '1.5rem', color: '#e2e8f0', animation: 'slideUp 0.6s ease-out 0.2s backwards' }}>Quick Actions</h3>
            <div style={styles.actionGrid}>
              {[
                { to: '/company/post-job', icon: '📝', title: 'Post New Job', desc: 'Create a new job opening', color: '#f97316' },
                { to: '/company/recruitment', icon: '👥', title: 'Recruit Candidates', desc: 'Review & hire candidates', color: '#10b981' },
                { to: '/company/interview-reports', icon: '📊', title: 'Interview Reports', desc: 'View AI interview results', color: '#6366f1' },
                { to: '/company/users', icon: '⚙️', title: 'Manage Users', desc: 'Add team members', color: '#8b5cf6' }
              ].map((action, idx) => (
                <Link key={idx} to={action.to} style={styles.actionCardContainer}>
                  <div
                    style={{
                      ...styles.actionCard,
                      borderLeft: `4px solid ${action.color}`,
                      ...(hoveredCard === `action-${idx}` ? styles.actionCardHover : {}),
                      position: 'relative'
                    }}
                    onMouseEnter={() => setHoveredCard(`action-${idx}`)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    {/* Rotating square decoration */}
                    <div style={{
                      position: 'absolute',
                      bottom: '-30px',
                      right: '-30px',
                      width: '80px',
                      height: '80px',
                      border: `2px solid ${action.color}`,
                      borderRadius: '6px',
                      opacity: 0.3,
                      animation: 'rotateSquare ' + (8 + idx) + 's linear infinite reverse',
                      pointerEvents: 'none'
                    }}></div>
                    <div style={styles.actionCardIcon}>{action.icon}</div>
                    <h4 style={{ margin: '0 0 0.5rem 0' }}>{action.title}</h4>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#cbd5e1' }}>{action.desc}</p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Recent Activities */}
            <h3 style={{ marginBottom: '1.5rem', color: '#e2e8f0', animation: 'slideUp 0.6s ease-out 0.4s backwards' }}>Recent Activities</h3>
            <div style={styles.listContainer}>
              {[
                { emoji: '✅', title: 'New Job Posted', desc: 'Senior React Developer - Today', badge: 'success', badgeText: 'New' },
                { emoji: '🎙️', title: '3 Interviews Completed', desc: 'Average Score: 78% - Today', badge: 'success', badgeText: 'Done' },
                { emoji: '👤', title: '5 New Applications', desc: 'Pending review', badge: 'warning', badgeText: 'Pending' }
              ].map((activity, idx) => (
                <div 
                  key={idx}
                  style={{...styles.listItem, ...(hoveredCard === `activity-${idx}` ? styles.listItemHover : {})}}
                  onMouseEnter={() => setHoveredCard(`activity-${idx}`)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div>
                    <p style={{ margin: 0, fontWeight: '600' }}>{activity.emoji} {activity.title}</p>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>{activity.desc}</p>
                  </div>
                  <span style={styles.badge(activity.badge)}>{activity.badgeText}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* JOBS TAB */}
        {activeTab === 'jobs' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', animation: 'slideUp 0.6s ease-out backwards' }}>
              <h2 style={{ margin: 0, color: '#e2e8f0' }}>💼 Job Postings</h2>
              <Link to="/company/post-job" style={{ textDecoration: 'none' }}>
                <button 
                  style={styles.button}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(99, 102, 241, 0.3)';
                  }}
                >
                  ➕ Post New Job
                </button>
              </Link>
            </div>

            {jobs.length === 0 ? (
              <div style={styles.listContainer}>
                <p style={{ textAlign: 'center', color: '#cbd5e1' }}>No jobs posted yet. Click "Post New Job" to get started.</p>
              </div>
            ) : (
              <div style={styles.listContainer}>
                {jobs.map((job, idx) => (
                  <div key={job.id} style={{...styles.listItem, ...(hoveredCard === `job-${idx}` ? styles.listItemHover : {})}}
                    onMouseEnter={() => setHoveredCard(`job-${idx}`)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
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
            <h2 style={{ marginBottom: '1.5rem', color: '#e2e8f0', animation: 'slideUp 0.6s ease-out backwards' }}>👥 Candidate Pool</h2>
            
            {candidates.length === 0 ? (
              <div style={styles.listContainer}>
                <p style={{ textAlign: 'center', color: '#cbd5e1' }}>No candidates yet.</p>
              </div>
            ) : (
              <div style={styles.listContainer}>
                {candidates.slice(0, 10).map((candidate, idx) => (
                  <div key={candidate.id} style={{...styles.listItem, ...(hoveredCard === `candidate-${idx}` ? styles.listItemHover : {})}}
                    onMouseEnter={() => setHoveredCard(`candidate-${idx}`)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
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
            <h2 style={{ marginBottom: '1.5rem', color: '#e2e8f0', animation: 'slideUp 0.6s ease-out backwards' }}>🎙️ Interview Results</h2>
            
            {interviews.length === 0 ? (
              <div style={styles.listContainer}>
                <p style={{ textAlign: 'center', color: '#cbd5e1' }}>No interviews conducted yet.</p>
              </div>
            ) : (
              <div style={styles.listContainer}>
                {interviews.map((interview, idx) => (
                  <div key={interview.id} style={{...styles.listItem, ...(hoveredCard === `interview-${idx}` ? styles.listItemHover : {})}}
                    onMouseEnter={() => setHoveredCard(`interview-${idx}`)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
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
            <h2 style={{ marginBottom: '1.5rem', color: '#e2e8f0', animation: 'slideUp 0.6s ease-out backwards' }}>📈 Analytics & Reports</h2>
            
            <div style={styles.statsGrid}>
              <div
                style={{...styles.statCard, ...(hoveredCard === 'report-stat-0' ? styles.statCardHover : {})}}
                onMouseEnter={() => setHoveredCard('report-stat-0')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <p style={{ color: '#cbd5e1', margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>📊 Avg Interview Score</p>
                <div style={styles.statNumber}>
                  {interviews.length > 0 
                    ? Math.round(interviews.reduce((sum, i) => sum + (i.avg_score || 0), 0) / interviews.length)
                    : 0}%
                </div>
                <p style={{ color: '#64748b', margin: '0', fontSize: '0.9rem' }}>Based on all interviews</p>
              </div>
              <div
                style={{...styles.statCard, ...(hoveredCard === 'report-stat-1' ? styles.statCardHover : {})}}
                onMouseEnter={() => setHoveredCard('report-stat-1')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <p style={{ color: '#cbd5e1', margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>📈 Conversion Rate</p>
                <div style={styles.statNumber}>
                  {candidates.length > 0 
                    ? Math.round((stats.hired / candidates.length) * 100)
                    : 0}%
                </div>
                <p style={{ color: '#64748b', margin: '0', fontSize: '0.9rem' }}>Candidates to hired</p>
              </div>
            </div>

            <Link to="/company/interview-reports" style={{ textDecoration: 'none' }}>
              <button 
                style={styles.button}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(99, 102, 241, 0.3)';
                }}
              >
                View Detailed Reports
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
