import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/auth';
import '../styles/pages.css';

export default function Register() {
  const [formData, setFormData] = useState({ email: '', password: '', full_name: '', role: 'candidate' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData.email, formData.password, formData.full_name, formData.role);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      console.error('Register error:', err);
      const errorMsg = err.response?.data?.error || err.message || 'Registration failed';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #050810 0%, #0a0e27 50%, #1a1f35 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
    },
    backgroundAnimation: {
      position: 'absolute',
      top: '-50%',
      left: '-50%',
      width: '200%',
      height: '200%',
      background: 'radial-gradient(circle, rgba(167,139,250,0.08) 1px, transparent 1px)',
      backgroundSize: '50px 50px',
      animation: 'float 30s infinite linear',
      pointerEvents: 'none',
      zIndex: 0
    },
    contentWrapper: {
      position: 'relative',
      zIndex: 1
    },
    card: {
      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(167, 139, 250, 0.1) 100%)',
      backdropFilter: 'blur(10px)',
      border: '2px solid rgba(167, 139, 250, 0.3)',
      borderRadius: '20px',
      padding: '3rem',
      maxWidth: '500px',
      boxShadow: '0 8px 32px rgba(167, 139, 250, 0.2), inset 0 0 20px rgba(167, 139, 250, 0.1)',
      animation: 'slideDown 0.8s ease-out'
    },
    header: {
      textAlign: 'center',
      marginBottom: '2rem',
      animation: 'fadeInUp 0.8s ease-out 0.2s backwards'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      margin: '0 0 0.5rem 0',
      letterSpacing: '-1px'
    },
    subtitle: {
      color: '#cbd5e1',
      fontSize: '1rem',
      margin: 0,
      fontWeight: '500'
    },
    rolesContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '1rem',
      marginBottom: '2rem',
      animation: 'fadeInUp 0.8s ease-out 0.25s backwards'
    },
    roleCard: {
      background: 'rgba(15, 23, 42, 0.6)',
      border: '2px solid rgba(139, 92, 246, 0.3)',
      borderRadius: '12px',
      padding: '1.5rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textAlign: 'center',
      color: '#cbd5e1',
      fontFamily: 'inherit'
    },
    roleCardActive: {
      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(99, 102, 241, 0.2) 100%)',
      borderColor: '#a78bfa',
      boxShadow: '0 0 20px rgba(167, 139, 250, 0.4)'
    },
    roleIcon: {
      fontSize: '2rem',
      display: 'block',
      marginBottom: '0.5rem'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      animation: 'fadeInUp 0.8s ease-out 0.3s backwards'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    },
    label: {
      color: '#e2e8f0',
      fontSize: '0.95rem',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    input: {
      background: 'rgba(15, 23, 42, 0.6)',
      border: '2px solid rgba(139, 92, 246, 0.3)',
      borderRadius: '10px',
      padding: '1rem',
      color: '#f8fafc',
      fontSize: '0.95rem',
      transition: 'all 0.3s ease',
      fontFamily: 'inherit',
      outline: 'none'
    },
    button: {
      background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      padding: '1.2rem',
      fontSize: '1rem',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(167, 139, 250, 0.4)',
      marginTop: '0.5rem',
      animation: 'slideDown 0.8s ease-out 0.4s backwards'
    },
    error: {
      background: 'rgba(239, 68, 68, 0.2)',
      border: '2px solid #ef4444',
      borderRadius: '10px',
      padding: '1rem',
      color: '#fecaca',
      textAlign: 'center',
      animation: 'slideDown 0.5s ease-out'
    },
    footer: {
      textAlign: 'center',
      marginTop: '1.5rem',
      color: '#cbd5e1',
      fontSize: '0.95rem',
      animation: 'fadeInUp 0.8s ease-out 0.5s backwards'
    },
    footerLink: {
      color: '#a78bfa',
      textDecoration: 'none',
      fontWeight: '600',
      marginLeft: '0.5rem',
      transition: 'all 0.3s ease'
    }
  };

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
            transform: translateY(20px);
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
        input:focus {
          border-color: #a78bfa !important;
          background: rgba(139, 92, 246, 0.1) !important;
          box-shadow: 0 0 20px rgba(167, 139, 250, 0.3) !important;
        }
        button:hover:not(:disabled) {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 8px 25px rgba(167, 139, 250, 0.5) !important;
        }
        button:active:not(:disabled) {
          transform: translateY(-1px);
        }
      `}</style>

      <div style={styles.backgroundAnimation}></div>

      <div style={styles.contentWrapper}>
        <div style={{...styles.card, position: 'relative', overflow: 'hidden'}}>
          <div style={{
            position: 'absolute',
            top: '-80px',
            right: '-80px',
            width: '200px',
            height: '200px',
            border: '3px solid rgba(167, 139, 250, 0.4)',
            borderRadius: '15px',
            animation: 'rotateSquare 15s linear infinite',
            pointerEvents: 'none',
            opacity: 0.3,
            zIndex: 1
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '-100px',
            left: '-100px',
            width: '220px',
            height: '220px',
            border: '3px solid rgba(167, 139, 250, 0.3)',
            borderRadius: '20px',
            animation: 'rotateSquare 18s linear infinite reverse',
            pointerEvents: 'none',
            opacity: 0.25,
            zIndex: 0
          }}></div>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '-120px',
            width: '180px',
            height: '180px',
            border: '2px solid rgba(167, 139, 250, 0.25)',
            borderRadius: '12px',
            animation: 'rotateSquare 20s linear infinite',
            pointerEvents: 'none',
            opacity: 0.2
          }}></div>

          <div style={{...styles.header, position: 'relative', zIndex: 2}}>
            <h1 style={styles.title}>✨ Sign Up</h1>
            <p style={styles.subtitle}>Join InterviewAI Today</p>
          </div>

          <form onSubmit={handleSubmit} style={{...styles.form, position: 'relative', zIndex: 2}}>
            {error && <div style={styles.error}>{error}</div>}

            <div style={styles.formGroup}>
              <label style={styles.label}>🎯 Select Your Role</label>
              <div style={styles.rolesContainer}>
                {['candidate', 'interviewer', 'company'].map((role) => (
                  <div
                    key={role}
                    style={{
                      ...styles.roleCard,
                      ...(formData.role === role ? styles.roleCardActive : {})
                    }}
                    onClick={() => handleRoleSelect(role)}
                  >
                    <span style={styles.roleIcon}>
                      {role === 'candidate' ? '👤' : role === 'interviewer' ? '👨‍💼' : '🏢'}
                    </span>
                    <p style={{margin: '0.5rem 0 0 0', fontSize: '0.9rem', fontWeight: '600', textTransform: 'capitalize'}}>
                      {role}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>👤 Full Name</label>
              <input
                style={styles.input}
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                disabled={loading}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>📧 Email Address</label>
              <input
                style={styles.input}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                disabled={loading}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>🔑 Password</label>
              <input
                style={styles.input}
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <button 
              style={{...styles.button}}
              type="submit" 
              disabled={loading}
            >
              {loading ? '⏳ Creating Account...' : '✨ Sign Up'}
            </button>
          </form>

          <div style={styles.footer}>
            Already have an account? 
            <Link to="/login" style={styles.footerLink}>Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}



