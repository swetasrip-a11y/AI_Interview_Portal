import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function AIInterviewerDashboard() {
  const [user, setUser] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [stats, setStats] = useState({
    totalSessions: 0,
    avgScore: 0,
    passRate: 0,
    activeInterviews: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      const userData = JSON.parse(storedUser);
      if (userData.role !== 'interviewer') {
        navigate('/candidate-dashboard');
      }
      setUser(userData);
      fetchInterviews();
    }
  }, [navigate]);

  const fetchInterviews = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get('http://localhost:5000/api/interviews', { headers });
      setInterviews(response.data || []);
      
      if (response.data && response.data.length > 0) {
        const avgScore = Math.round(response.data.reduce((sum, i) => sum + (i.avg_score || 0), 0) / response.data.length);
        const passed = response.data.filter(i => (i.avg_score || 0) >= 60).length;
        const passRate = Math.round((passed / response.data.length) * 100);
        
        setStats({
          totalSessions: response.data.length,
          avgScore: avgScore,
          passRate: passRate,
          activeInterviews: response.data.filter(i => i.status === 'active').length
        });
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #050810 0%, #0a0e27 50%, #1a1f35 100%)',
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
      background: 'radial-gradient(circle, rgba(139,92,246,0.08) 1px, transparent 1px)',
      backgroundSize: '50px 50px',
      animation: 'float 40s infinite linear',
      pointerEvents: 'none',
      zIndex: 0
    },
    contentWrapper: {
      position: 'relative',
      zIndex: 1,
      padding: '2rem',
      maxWidth: '1400px',
      margin: '0 auto'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
      paddingBottom: '1.5rem',
      borderBottom: '2px solid rgba(139, 92, 246, 0.2)',
      animation: 'slideDown 0.6s ease-out'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      margin: 0
    },
    logoutBtn: {
      padding: '0.8rem 1.5rem',
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      border: 'none',
      borderRadius: '10px',
      color: 'white',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
      fontSize: '1rem'
    },
    profileSection: {
      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)',
      border: '2px solid rgba(139, 92, 246, 0.2)',
      borderRadius: '15px',
      padding: '1.5rem',
      marginBottom: '2rem',
      animation: 'slideDown 0.8s ease-out 0.1s backwards'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem'
    },
    statCard: {
      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)',
      border: '2px solid rgba(139, 92, 246, 0.3)',
      borderRadius: '12px',
      padding: '1.5rem',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      animation: 'fadeInUp 0.8s ease-out backwards',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden'
    },
    sectionTitle: {
      fontSize: '1.3rem',
      fontWeight: '700',
      marginTop: '2rem',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      animation: 'slideDown 0.8s ease-out backwards'
    },
    cardsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '1.5rem'
    },
    card: {
      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)',
      backdropFilter: 'blur(10px)',
      border: '2px solid rgba(139, 92, 246, 0.3)',
      borderRadius: '15px',
      padding: '2rem',
      textDecoration: 'none',
      color: 'inherit',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      animation: 'fadeInUp 0.8s ease-out backwards',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    },
    cardIcon: {
      fontSize: '3rem',
      display: 'block'
    },
    cardTitle: {
      fontSize: '1.2rem',
      fontWeight: '700',
      margin: 0
    },
    cardDesc: {
      color: '#cbd5e1',
      margin: 0,
      fontSize: '0.9rem'
    }
  };

  if (!user) 
    return (
      <div style={styles.container}>
        <div style={{ ...styles.contentWrapper, textAlign: 'center', paddingTop: '5rem' }}>
          <p style={{ fontSize: '1.2rem' }}>⏳ Loading...</p>
        </div>
      </div>
    );

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(25px, -25px); }
          50% { transform: translate(25px, 25px); }
          75% { transform: translate(-25px, 25px); }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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
      `}</style>

      <div style={styles.backgroundAnimation}></div>

      <div style={styles.contentWrapper}>
        <div style={styles.header}>
          <h1 style={styles.title}>🤖 AI Interview Manager</h1>
          <button 
            style={styles.logoutBtn}
            onClick={handleLogout}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 8px 25px rgba(239, 68, 68, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.3)';
            }}
          >
            🚪 Logout
          </button>
        </div>

        <div style={styles.profileSection}>
          <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem' }}>Welcome, {user.full_name}! 👋</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <strong style={{ color: '#a78bfa' }}>📧 Email:</strong>
              <p style={{ margin: '0.5rem 0 0 0', color: '#cbd5e1' }}>{user.email}</p>
            </div>
            <div>
              <strong style={{ color: '#a78bfa' }}>💼 Role:</strong>
              <span style={{
                display: 'inline-block',
                marginTop: '0.5rem',
                padding: '0.5rem 1rem',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
                borderRadius: '8px',
                fontWeight: '600'
              }}>AI Interview Manager</span>
            </div>
          </div>
        </div>

        <div style={{...styles.sectionTitle, animationDelay: '0.2s'}}>📊 AI Interview Analytics</div>
        <div style={styles.statsGrid}>
          <div 
            style={{...styles.statCard, animationDelay: '0.3s'}}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 15px 40px rgba(139, 92, 246, 0.3)';
              e.currentTarget.style.borderColor = '#a78bfa';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
            }}
          >
            <h3 style={{ margin: 0, color: '#cbd5e1', fontSize: '0.95rem', fontWeight: '600' }}>Total Sessions</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginTop: '0.5rem' }}>{stats.totalSessions}</div>
          </div>
          <div 
            style={{...styles.statCard, animationDelay: '0.4s'}}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 15px 40px rgba(139, 92, 246, 0.3)';
              e.currentTarget.style.borderColor = '#a78bfa';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
            }}
          >
            <h3 style={{ margin: 0, color: '#cbd5e1', fontSize: '0.95rem', fontWeight: '600' }}>Average Score</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#fb923c', marginTop: '0.5rem' }}>{stats.avgScore}%</div>
          </div>
          <div 
            style={{...styles.statCard, animationDelay: '0.5s'}}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 15px 40px rgba(139, 92, 246, 0.3)';
              e.currentTarget.style.borderColor = '#a78bfa';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
            }}
          >
            <h3 style={{ margin: 0, color: '#cbd5e1', fontSize: '0.95rem', fontWeight: '600' }}>Pass Rate</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#86efac', marginTop: '0.5rem' }}>{stats.passRate}%</div>
          </div>
          <div 
            style={{...styles.statCard, animationDelay: '0.6s'}}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 15px 40px rgba(139, 92, 246, 0.3)';
              e.currentTarget.style.borderColor = '#a78bfa';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
            }}
          >
            <h3 style={{ margin: 0, color: '#cbd5e1', fontSize: '0.95rem', fontWeight: '600' }}>Active Interviews</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#38bdf8', marginTop: '0.5rem' }}>{stats.activeInterviews}</div>
          </div>
        </div>

        <div style={{...styles.sectionTitle, animationDelay: '0.3s'}}>🚀 Interview Sessions</div>
        <div style={styles.cardsGrid}>
          <Link to="/ai/interview-chat" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div 
              style={{...styles.card, animationDelay: '0.4s', borderLeft: '4px solid #8b5cf6', position: 'relative', overflow: 'hidden'}}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-15px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 20px 50px rgba(139, 92, 246, 0.4)';
                e.currentTarget.style.borderColor = '#a78bfa';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
              }}
            >
              <div style={{
                position: 'absolute',
                top: '-15px',
                right: '-15px',
                width: '50px',
                height: '50px',
                border: '2px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '6px',
                animation: 'rotateSquare 8s linear infinite',
                pointerEvents: 'none'
              }}></div>
              <div style={styles.cardIcon}>🤖</div>
              <h3 style={styles.cardTitle}>AI Interview with Chat</h3>
              <p style={styles.cardDesc}>Conduct interactive AI interviews</p>
            </div>
          </Link>

          <Link to="/ai/chat" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div 
              style={{...styles.card, animationDelay: '0.5s', borderLeft: '4px solid #a78bfa', position: 'relative', overflow: 'hidden'}}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-15px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 20px 50px rgba(139, 92, 246, 0.4)';
                e.currentTarget.style.borderColor = '#a78bfa';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
              }}
            >
              <div style={{
                position: 'absolute',
                top: '-15px',
                right: '-15px',
                width: '50px',
                height: '50px',
                border: '2px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '6px',
                animation: 'rotateSquare 8.5s linear infinite reverse',
                pointerEvents: 'none'
              }}></div>
              <div style={styles.cardIcon}>💬</div>
              <h3 style={styles.cardTitle}>AI Chat Assistant</h3>
              <p style={styles.cardDesc}>Chat with AI about candidates</p>
            </div>
          </Link>

          <Link to="/ai/sessions" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div 
              style={{...styles.card, animationDelay: '0.6s', borderLeft: '4px solid #8b5cf6', position: 'relative', overflow: 'hidden'}}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-15px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 20px 50px rgba(139, 92, 246, 0.4)';
                e.currentTarget.style.borderColor = '#a78bfa';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
              }}
            >
              <div style={{
                position: 'absolute',
                top: '-15px',
                right: '-15px',
                width: '50px',
                height: '50px',
                border: '2px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '6px',
                animation: 'rotateSquare 9s linear infinite',
                pointerEvents: 'none'
              }}></div>
              <div style={styles.cardIcon}>📊</div>
              <h3 style={styles.cardTitle}>Interview Sessions</h3>
              <p style={styles.cardDesc}>View all completed interviews</p>
            </div>
          </Link>

          <Link to="/ai/create-session" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div 
              style={{...styles.card, animationDelay: '0.7s', borderLeft: '4px solid #a78bfa', position: 'relative', overflow: 'hidden'}}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-15px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 20px 50px rgba(139, 92, 246, 0.4)';
                e.currentTarget.style.borderColor = '#a78bfa';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
              }}
            >
              <div style={{
                position: 'absolute',
                top: '-15px',
                right: '-15px',
                width: '50px',
                height: '50px',
                border: '2px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '6px',
                animation: 'rotateSquare 9.5s linear infinite reverse',
                pointerEvents: 'none'
              }}></div>
              <div style={styles.cardIcon}>➕</div>
              <h3 style={styles.cardTitle}>Create New Session</h3>
              <p style={styles.cardDesc}>Set up new AI interview</p>
            </div>
          </Link>

          <Link to="/ai/all-sessions" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div 
              style={{...styles.card, animationDelay: '0.8s', borderLeft: '4px solid #8b5cf6', position: 'relative', overflow: 'hidden'}}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-15px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 20px 50px rgba(139, 92, 246, 0.4)';
                e.currentTarget.style.borderColor = '#a78bfa';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
              }}
            >
              <div style={{
                position: 'absolute',
                top: '-15px',
                right: '-15px',
                width: '50px',
                height: '50px',
                border: '2px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '6px',
                animation: 'rotateSquare 10s linear infinite',
                pointerEvents: 'none'
              }}></div>
              <div style={styles.cardIcon}>📋</div>
              <h3 style={styles.cardTitle}>All Sessions</h3>
              <p style={styles.cardDesc}>View all interview sessions</p>
            </div>
          </Link>

          <Link to="/ai/candidates" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div 
              style={{...styles.card, animationDelay: '0.9s', borderLeft: '4px solid #a78bfa', position: 'relative', overflow: 'hidden'}}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-15px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 20px 50px rgba(139, 92, 246, 0.4)';
                e.currentTarget.style.borderColor = '#a78bfa';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
              }}
            >
              <div style={{
                position: 'absolute',
                top: '-15px',
                right: '-15px',
                width: '50px',
                height: '50px',
                border: '2px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '6px',
                animation: 'rotateSquare 10.5s linear infinite reverse',
                pointerEvents: 'none'
              }}></div>
              <div style={styles.cardIcon}>👥</div>
              <h3 style={styles.cardTitle}>Candidate Results</h3>
              <p style={styles.cardDesc}>Review candidate performance</p>
            </div>
          </Link>

          <Link to="/ai/analytics" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div 
              style={{...styles.card, animationDelay: '1s', borderLeft: '4px solid #8b5cf6', position: 'relative', overflow: 'hidden'}}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-15px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 20px 50px rgba(139, 92, 246, 0.4)';
                e.currentTarget.style.borderColor = '#a78bfa';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
              }}
            >
              <div style={{
                position: 'absolute',
                top: '-15px',
                right: '-15px',
                width: '50px',
                height: '50px',
                border: '2px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '6px',
                animation: 'rotateSquare 8s linear infinite',
                pointerEvents: 'none'
              }}></div>
              <div style={styles.cardIcon}>📊</div>
              <h3 style={styles.cardTitle}>Analytics</h3>
              <p style={styles.cardDesc}>Detailed performance insights</p>
            </div>
          </Link>
        </div>

        <div style={{...styles.sectionTitle, animationDelay: '0.4s', marginTop: '3rem'}}>📅 Recent Interview Sessions</div>
        {interviews.length === 0 ? (
          <div style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)',
            border: '2px dashed rgba(139, 92, 246, 0.3)',
            borderRadius: '12px',
            padding: '2rem',
            textAlign: 'center',
            color: '#cbd5e1',
            animation: 'fadeInUp 0.8s ease-out 0.5s backwards'
          }}>
            <p>No interview sessions yet. Create one to get started!</p>
          </div>
        ) : (
          <div style={{ animation: 'fadeInUp 0.8s ease-out 0.5s backwards' }}>
            {interviews.slice(0, 5).map((interview, idx) => (
              <div key={interview.id} style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)',
                border: '2px solid rgba(139, 92, 246, 0.2)',
                borderRadius: '12px',
                padding: '1.5rem',
                marginBottom: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.3s ease',
                borderLeft: '4px solid #a78bfa',
                animation: `fadeInUp 0.8s ease-out ${0.5 + idx * 0.1}s backwards`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(10px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(139, 92, 246, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#a78bfa', fontSize: '1.1rem' }}>{interview.title}</h4>
                  <p style={{ margin: '0.3rem 0', color: '#cbd5e1', fontSize: '0.9rem' }}>📍 Position: {interview.job_title}</p>
                  <p style={{ margin: '0.3rem 0', color: '#94a3b8', fontSize: '0.85rem' }}>📅 Created: {new Date(interview.created_at).toLocaleDateString()}</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{
                    padding: '0.6rem 1.2rem',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(168, 85, 247, 0.1) 100%)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    color: '#a78bfa'
                  }}>
                    📊 Avg: {interview.avg_score || 0}%
                  </span>
                  <Link to={`/ai/session/${interview.id}`} style={{
                    display: 'inline-block',
                    padding: '0.6rem 1.2rem',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(139, 92, 246, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


