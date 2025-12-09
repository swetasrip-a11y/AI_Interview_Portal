import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function InterviewerDashboard() {
  const [user, setUser] = useState(null);
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
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return <div>Loading...</div>;

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #050810 0%, #0a0e27 50%, #1a1f35 100%)',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    },
    backgroundAnimation: {
      position: 'absolute',
      top: '-50%',
      left: '-50%',
      width: '200%',
      height: '200%',
      background: 'radial-gradient(circle, rgba(99,102,241,0.05) 1px, transparent 1px)',
      backgroundSize: '50px 50px',
      animation: 'float 20s infinite linear',
      pointerEvents: 'none'
    },
    dashboard: {
      maxWidth: '1200px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 1
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2.5rem',
      paddingBottom: '1.5rem',
      borderBottom: '1px solid rgba(99, 102, 241, 0.2)',
      animation: 'slideDown 0.6s ease-out'
    },
    headerTitle: {
      color: '#f8fafc',
      fontSize: '2.5rem',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      margin: 0
    },
    logoutBtn: {
      padding: '0.6rem 1.2rem',
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      fontSize: '0.9rem'
    },
    userInfo: {
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%)',
      borderRadius: '15px',
      padding: '1.5rem',
      marginBottom: '2rem',
      border: '2px solid #6366f1',
      animation: 'fadeInUp 0.8s ease-out',
      backdropFilter: 'blur(10px)'
    },
    userInfoTitle: {
      color: '#f8fafc',
      marginBottom: '1rem',
      fontSize: '1.3rem',
      fontWeight: '600'
    },
    userInfoText: {
      margin: '0.5rem 0',
      color: '#e2e8f0',
      fontSize: '0.95rem'
    },
    sectionTitle: {
      color: '#f8fafc',
      marginBottom: '2rem',
      fontSize: '1.8rem',
      fontWeight: '600',
      animation: 'slideUp 0.6s ease-out 0.2s backwards'
    },
    gridContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '2rem',
      animation: 'fadeInUp 0.8s ease-out 0.3s backwards'
    },
    cardWrapper: {
      textDecoration: 'none',
      cursor: 'pointer'
    },
    card: {
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)',
      borderRadius: '15px',
      padding: '2rem',
      textAlign: 'center',
      border: '2px solid rgba(99, 102, 241, 0.3)',
      transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      backdropFilter: 'blur(10px)',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
      height: '100%',
      animation: 'glow 3s ease-in-out infinite'
    },
    cardBefore: {
      content: '""',
      position: 'absolute',
      top: '0',
      left: '-100%',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
      transition: 'left 0.6s ease',
      pointerEvents: 'none'
    },
    cardHover: {
      transform: 'translateY(-15px) scale(1.05)',
      borderColor: '#8b5cf6',
      boxShadow: '0 20px 50px rgba(99, 102, 241, 0.4)',
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(139, 92, 246, 0.2) 100%)'
    },
    cardIcon: {
      fontSize: '3rem',
      marginBottom: '1rem',
      display: 'block',
      transition: 'all 0.3s ease',
      animation: 'bounce 2s infinite, pulse 3s ease-in-out infinite',
      textShadow: '0 0 20px rgba(99, 102, 241, 0.4), 0 0 40px rgba(139, 92, 246, 0.2)',
      filter: 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.3))'
    },
    cardTitle: {
      color: '#f8fafc',
      marginBottom: '0.5rem',
      fontSize: '1.3rem',
      fontWeight: '600'
    },
    cardDescription: {
      color: '#cbd5e1',
      fontSize: '0.9rem',
      margin: 0
    }
  };

  const [hoveredCard, setHoveredCard] = React.useState(null);

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

        @keyframes spinGradient {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes float3D {
          0%, 100% { transform: translateY(0px) rotateX(0deg); }
          25% { transform: translateY(-15px) rotateX(10deg); }
          50% { transform: translateY(-20px) rotateX(0deg); }
          75% { transform: translateY(-15px) rotateX(-10deg); }
        }

        @keyframes shimmer {
          0%, 100% { background-position: 200% center; }
          50% { background-position: -200% center; }
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.5), 0 0 20px rgba(99, 102, 241, 0.3); }
          50% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.8), 0 0 40px rgba(139, 92, 246, 0.6); }
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        @keyframes spinSmall {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes vibrate {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }

        @keyframes waveAnimation {
          0%, 100% { transform: translateY(0px); }
          25% { transform: translateY(-8px); }
          50% { transform: translateY(0px); }
          75% { transform: translateY(-4px); }
        }

        @keyframes shimmerWave {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `}</style>
      
      <div style={styles.backgroundAnimation}></div>
      
      <div style={styles.dashboard}>
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>👨‍💼 Welcome, {user.full_name}!</h1>
          <button 
            style={styles.logoutBtn}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 10px 25px rgba(239, 68, 68, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
            onClick={handleLogout}
          >
            🚪 Logout
          </button>
        </div>

        <div style={styles.userInfo}>
          <h2 style={styles.userInfoTitle}>📋 Your Profile</h2>
          <p style={styles.userInfoText}><strong>Email:</strong> {user.email}</p>
          <p style={styles.userInfoText}><strong>Role:</strong> <span style={{ backgroundColor: '#0ea5e9', padding: '4px 8px', borderRadius: '4px', color: '#ffffff', fontWeight: '600' }}>👔 Interviewer</span></p>
        </div>

        <h2 style={styles.sectionTitle}>🎯 Manage & Conduct</h2>
        
        <div style={styles.gridContainer}>
          <div
            style={{
              ...styles.cardWrapper,
              ...(hoveredCard === 0 && styles.cardHover)
            }}
            onMouseEnter={() => setHoveredCard(0)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => navigate('/interviewer/create-interview')}
          >
            <div style={{...styles.card, ...(hoveredCard === 0 && styles.cardHover)}}>
              {/* Rotating square decoration */}
              <div style={{
                position: 'absolute',
                top: '-30px',
                right: '-30px',
                width: '80px',
                height: '80px',
                border: '2px solid rgba(99, 102, 241, 0.4)',
                borderRadius: '8px',
                animation: 'rotateSquare 8s linear infinite',
                boxShadow: '0 0 15px rgba(99, 102, 241, 0.3)',
                pointerEvents: 'none'
              }}></div>
              <div style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '120px',
                height: '120px',
                border: '2px solid rgba(139, 92, 246, 0.2)',
                borderRadius: '8px',
                animation: 'rotateSquare 12s linear infinite reverse',
                boxShadow: '0 0 20px rgba(139, 92, 246, 0.2)',
                pointerEvents: 'none'
              }}></div>
              <div style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                width: '40px',
                height: '40px',
                border: '2px solid rgba(99, 102, 241, 0.6)',
                borderRadius: '4px',
                animation: 'rotateSquare 6s linear infinite',
                pointerEvents: 'none'
              }}></div>
              <div style={styles.cardIcon}>➕</div>
              <h3 style={styles.cardTitle}>Create Interview</h3>
              <p style={styles.cardDescription}>Set up new interview sessions</p>
            </div>
          </div>

          <div
            style={{
              ...styles.cardWrapper,
              ...(hoveredCard === 1 && styles.cardHover)
            }}
            onMouseEnter={() => setHoveredCard(1)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => navigate('/interviewer/interviews')}
          >
            <div style={{...styles.card, ...(hoveredCard === 1 && styles.cardHover)}}>
              {/* Rotating square decoration */}
              <div style={{
                position: 'absolute',
                bottom: '-30px',
                left: '-30px',
                width: '90px',
                height: '90px',
                border: '2px solid rgba(99, 102, 241, 0.4)',
                borderRadius: '8px',
                animation: 'rotateSquare 10s linear infinite reverse',
                pointerEvents: 'none'
              }}></div>
              <div style={styles.cardIcon}>📋</div>
              <h3 style={styles.cardTitle}>My Interviews</h3>
              <p style={styles.cardDescription}>View and manage your interviews</p>
            </div>
          </div>

          <div
            style={{
              ...styles.cardWrapper,
              ...(hoveredCard === 2 && styles.cardHover)
            }}
            onMouseEnter={() => setHoveredCard(2)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => navigate('/interviewer/candidates')}
          >
            <div style={{...styles.card, ...(hoveredCard === 2 && styles.cardHover)}}>
              {/* Rotating square decoration */}
              <div style={{
                position: 'absolute',
                top: '-40px',
                left: '-40px',
                width: '100px',
                height: '100px',
                border: '2px solid rgba(139, 92, 246, 0.4)',
                borderRadius: '8px',
                animation: 'rotateSquare 9s linear infinite',
                pointerEvents: 'none'
              }}></div>
              <div style={styles.cardIcon}>👥</div>
              <h3 style={styles.cardTitle}>All Candidates</h3>
              <p style={styles.cardDescription}>Review all candidates across interviews</p>
            </div>
          </div>

          <div
            style={{
              ...styles.cardWrapper,
              ...(hoveredCard === 3 && styles.cardHover)
            }}
            onMouseEnter={() => setHoveredCard(3)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => navigate('/interviewer/analytics')}
          >
            <div style={{...styles.card, ...(hoveredCard === 3 && styles.cardHover)}}>
              {/* Rotating square decoration */}
              <div style={{
                position: 'absolute',
                bottom: '-35px',
                right: '-35px',
                width: '110px',
                height: '110px',
                border: '2px solid rgba(99, 102, 241, 0.3)',
                borderRadius: '8px',
                animation: 'rotateSquare 11s linear infinite',
                pointerEvents: 'none'
              }}></div>
              <div style={styles.cardIcon}>📊</div>
              <h3 style={styles.cardTitle}>Analytics</h3>
              <p style={styles.cardDescription}>Performance metrics and insights</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


