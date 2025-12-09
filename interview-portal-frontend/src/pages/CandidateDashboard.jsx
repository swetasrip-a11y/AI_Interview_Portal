import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function CandidateDashboard() {
  const [user, setUser] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      const userData = JSON.parse(storedUser);
      if (userData.role !== 'candidate') {
        navigate('/interviewer-dashboard');
      }
      setUser(userData);
    }
  }, [navigate]);

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
      background: 'radial-gradient(circle, rgba(16,185,129,0.08) 1px, transparent 1px)',
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
      borderBottom: '2px solid rgba(16, 185, 129, 0.2)',
      animation: 'slideDown 0.6s ease-out'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
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
      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)',
      border: '2px solid rgba(16, 185, 129, 0.2)',
      borderRadius: '15px',
      padding: '1.5rem',
      marginBottom: '2rem',
      animation: 'slideDown 0.8s ease-out 0.1s backwards'
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
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem'
    },
    statCard: {
      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
      border: '2px solid rgba(16, 185, 129, 0.3)',
      borderRadius: '12px',
      padding: '1.5rem',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      animation: 'fadeInUp 0.8s ease-out backwards',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden'
    },
    statNumber: {
      fontSize: '2.5rem',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginBottom: '0.5rem'
    },
    statLabel: {
      color: '#cbd5e1',
      fontSize: '0.9rem',
      fontWeight: '600'
    },
    cardsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1.5rem'
    },
    card: {
      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
      backdropFilter: 'blur(10px)',
      border: '2px solid rgba(16, 185, 129, 0.3)',
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
      display: 'block',
      animation: 'bounce 2s infinite'
    },
    cardTitle: {
      fontSize: '1.3rem',
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
        @keyframes rotateSquare {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.05); }
          100% { transform: rotate(360deg) scale(1); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes rotateSquare {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.05); }
          100% { transform: rotate(360deg) scale(1); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 15px rgba(16, 185, 129, 0.3), inset 0 0 10px rgba(16, 185, 129, 0.1); }
          50% { box-shadow: 0 0 30px rgba(16, 185, 129, 0.6), inset 0 0 20px rgba(6, 182, 212, 0.2); }
        }
      `}</style>

      <div style={styles.backgroundAnimation}></div>

      <div style={styles.contentWrapper}>
        <div style={styles.header}>
          <h1 style={styles.title}>👤 Welcome, {user.full_name}!</h1>
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
          <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem' }}>📋 Your Profile</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <strong style={{ color: '#10b981' }}>Email:</strong>
              <p style={{ margin: '0.5rem 0 0 0', color: '#cbd5e1' }}>{user.email}</p>
            </div>
            <div>
              <strong style={{ color: '#10b981' }}>Role:</strong>
              <span style={{
                display: 'inline-block',
                marginTop: '0.5rem',
                padding: '0.5rem 1rem',
                background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                borderRadius: '8px',
                fontWeight: '600'
              }}>🎯 Candidate</span>
            </div>
          </div>
        </div>

        <div style={{...styles.sectionTitle, animationDelay: '0.2s'}}>📊 Your Statistics</div>
        <div style={styles.statsGrid}>
          <div 
            style={{...styles.statCard, animationDelay: '0.3s'}}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 15px 40px rgba(16, 185, 129, 0.3)';
              e.currentTarget.style.borderColor = '#10b981';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)';
            }}
          >
            <div style={styles.statNumber}>0</div>
            <div style={styles.statLabel}>Interviews Completed</div>
          </div>
          <div 
            style={{...styles.statCard, animationDelay: '0.4s'}}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 15px 40px rgba(16, 185, 129, 0.3)';
              e.currentTarget.style.borderColor = '#10b981';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)';
            }}
          >
            <div style={styles.statNumber}>0</div>
            <div style={styles.statLabel}>Jobs Applied</div>
          </div>
          <div 
            style={{...styles.statCard, animationDelay: '0.5s'}}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 15px 40px rgba(16, 185, 129, 0.3)';
              e.currentTarget.style.borderColor = '#10b981';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)';
            }}
          >
            <div style={styles.statNumber}>0%</div>
            <div style={styles.statLabel}>Average Score</div>
          </div>
        </div>

        <div style={{...styles.sectionTitle, animationDelay: '0.3s'}}>🚀 Quick Access</div>
        <div style={styles.cardsGrid}>
          <Link 
            to="/candidate/profile" 
            style={{...styles.card, animationDelay: '0.4s', borderLeft: '4px solid #10b981', position: 'relative', overflow: 'hidden'}}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-15px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 20px 50px rgba(16, 185, 129, 0.4)';
              e.currentTarget.style.borderColor = '#10b981';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)';
            }}
          >
            <div style={{
              position: 'absolute',
              top: '-15px',
              right: '-15px',
              width: '50px',
              height: '50px',
              border: '2px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '6px',
              animation: 'rotateSquare 8s linear infinite',
              pointerEvents: 'none'
            }}></div>
            <div style={styles.cardIcon}>📋</div>
            <h3 style={styles.cardTitle}>My Profile</h3>
            <p style={styles.cardDesc}>View and update your profile information</p>
          </Link>

          <Link 
            to="/resume-upload" 
            style={{...styles.card, animationDelay: '0.5s', borderLeft: '4px solid #06b6d4', position: 'relative', overflow: 'hidden'}}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-15px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 20px 50px rgba(16, 185, 129, 0.4)';
              e.currentTarget.style.borderColor = '#10b981';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)';
            }}
          >
            <div style={{
              position: 'absolute',
              top: '-15px',
              right: '-15px',
              width: '50px',
              height: '50px',
              border: '2px solid rgba(6, 182, 212, 0.3)',
              borderRadius: '6px',
              animation: 'rotateSquare 9s linear infinite reverse',
              pointerEvents: 'none'
            }}></div>
            <div style={styles.cardIcon}>📄</div>
            <h3 style={styles.cardTitle}>Upload Resume</h3>
            <p style={styles.cardDesc}>Upload your resume for job applications</p>
          </Link>

          <Link 
            to="/browse-jobs" 
            style={{...styles.card, animationDelay: '0.6s', borderLeft: '4px solid #0891b2', position: 'relative', overflow: 'hidden'}}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-15px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 20px 50px rgba(16, 185, 129, 0.4)';
              e.currentTarget.style.borderColor = '#10b981';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)';
            }}
          >
            <div style={{
              position: 'absolute',
              top: '-15px',
              right: '-15px',
              width: '50px',
              height: '50px',
              border: '2px solid rgba(8, 145, 178, 0.3)',
              borderRadius: '6px',
              animation: 'rotateSquare 8.5s linear infinite',
              pointerEvents: 'none'
            }}></div>
            <div style={styles.cardIcon}>💼</div>
            <h3 style={styles.cardTitle}>Browse Jobs</h3>
            <p style={styles.cardDesc}>Explore available job opportunities</p>
          </Link>

          <Link 
            to="/candidate-interview-scores" 
            style={{...styles.card, animationDelay: '0.7s', borderLeft: '4px solid #10b981', position: 'relative', overflow: 'hidden'}}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-15px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 20px 50px rgba(16, 185, 129, 0.4)';
              e.currentTarget.style.borderColor = '#10b981';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)';
            }}
          >
            <div style={{
              position: 'absolute',
              top: '-15px',
              right: '-15px',
              width: '50px',
              height: '50px',
              border: '2px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '6px',
              animation: 'rotateSquare 9.5s linear infinite reverse',
              pointerEvents: 'none'
            }}></div>
            <div style={styles.cardIcon}>📊</div>
            <h3 style={styles.cardTitle}>Interview Scores</h3>
            <p style={styles.cardDesc}>View your AI interview performance</p>
          </Link>

          <Link 
            to="/candidate/performance" 
            style={{...styles.card, animationDelay: '0.8s', borderLeft: '4px solid #06b6d4', position: 'relative', overflow: 'hidden'}}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-15px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 20px 50px rgba(16, 185, 129, 0.4)';
              e.currentTarget.style.borderColor = '#10b981';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)';
            }}
          >
            <div style={{
              position: 'absolute',
              top: '-15px',
              right: '-15px',
              width: '50px',
              height: '50px',
              border: '2px solid rgba(6, 182, 212, 0.3)',
              borderRadius: '6px',
              animation: 'rotateSquare 8s linear infinite',
              pointerEvents: 'none'
            }}></div>
            <div style={styles.cardIcon}>📈</div>
            <h3 style={styles.cardTitle}>Performance Analytics</h3>
            <p style={styles.cardDesc}>Detailed insights and recommendations</p>
          </Link>

          <Link 
            to="/candidate/history" 
            style={{...styles.card, animationDelay: '0.9s', borderLeft: '4px solid #0891b2', position: 'relative', overflow: 'hidden'}}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-15px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 20px 50px rgba(16, 185, 129, 0.4)';
              e.currentTarget.style.borderColor = '#10b981';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)';
            }}
          >
            <div style={{
              position: 'absolute',
              top: '-15px',
              right: '-15px',
              width: '50px',
              height: '50px',
              border: '2px solid rgba(8, 145, 178, 0.3)',
              borderRadius: '6px',
              animation: 'rotateSquare 9s linear infinite reverse',
              pointerEvents: 'none'
            }}></div>
            <div style={styles.cardIcon}>📜</div>
            <h3 style={styles.cardTitle}>Interview History</h3>
            <p style={styles.cardDesc}>Review your past interviews</p>
          </Link>

          <Link 
            to="/materials" 
            style={{...styles.card, animationDelay: '1s', borderLeft: '4px solid #10b981', position: 'relative', overflow: 'hidden'}}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-15px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 20px 50px rgba(16, 185, 129, 0.4)';
              e.currentTarget.style.borderColor = '#10b981';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)';
            }}
          >
            <div style={{
              position: 'absolute',
              top: '-15px',
              right: '-15px',
              width: '50px',
              height: '50px',
              border: '2px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '6px',
              animation: 'rotateSquare 10s linear infinite',
              pointerEvents: 'none'
            }}></div>
            <div style={styles.cardIcon}>📚</div>
            <h3 style={styles.cardTitle}>Study Materials</h3>
            <p style={styles.cardDesc}>Access resources to prepare for interviews</p>
          </Link>

          <Link 
            to="/candidate/jobs" 
            style={{...styles.card, animationDelay: '1.1s', borderLeft: '4px solid #06b6d4', position: 'relative', overflow: 'hidden'}}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-15px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 20px 50px rgba(16, 185, 129, 0.4)';
              e.currentTarget.style.borderColor = '#10b981';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)';
            }}
          >
            <div style={{
              position: 'absolute',
              top: '-15px',
              right: '-15px',
              width: '50px',
              height: '50px',
              border: '2px solid rgba(6, 182, 212, 0.3)',
              borderRadius: '6px',
              animation: 'rotateSquare 10.5s linear infinite reverse',
              pointerEvents: 'none'
            }}></div>
            <div style={styles.cardIcon}>⭐</div>
            <h3 style={styles.cardTitle}>My Applications</h3>
            <p style={styles.cardDesc}>Track your job applications</p>
          </Link>

          <Link 
            to="/candidate/ai-chat" 
            style={{...styles.card, animationDelay: '1.2s', borderLeft: '4px solid #a855f7', position: 'relative', overflow: 'hidden'}}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-15px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 20px 50px rgba(168, 85, 247, 0.4)';
              e.currentTarget.style.borderColor = '#a855f7';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.3)';
            }}
          >
            <div style={{
              position: 'absolute',
              top: '-15px',
              right: '-15px',
              width: '50px',
              height: '50px',
              border: '2px solid rgba(168, 85, 247, 0.3)',
              borderRadius: '6px',
              animation: 'rotateSquare 11s linear infinite',
              pointerEvents: 'none'
            }}></div>
            <div style={styles.cardIcon}>🤖</div>
            <h3 style={styles.cardTitle}>AI Learning Assistant</h3>
            <p style={styles.cardDesc}>Get interview prep help & career guidance</p>
          </Link>

          <Link 
            to="/candidate/ai-interview" 
            style={{...styles.card, animationDelay: '1.3s', borderLeft: '4px solid #f59e0b', position: 'relative', overflow: 'hidden'}}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-15px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 20px 50px rgba(245, 158, 11, 0.4)';
              e.currentTarget.style.borderColor = '#f59e0b';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.3)';
            }}
          >
            <div style={{
              position: 'absolute',
              top: '-15px',
              right: '-15px',
              width: '50px',
              height: '50px',
              border: '2px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '6px',
              animation: 'rotateSquare 11.5s linear infinite reverse',
              pointerEvents: 'none'
            }}></div>
            <div style={styles.cardIcon}>🎤</div>
            <h3 style={styles.cardTitle}>AI Interview Practice</h3>
            <p style={styles.cardDesc}>Practice with AI-generated interview questions</p>
          </Link>
        </div>
      </div>
    </div>
  );
}


