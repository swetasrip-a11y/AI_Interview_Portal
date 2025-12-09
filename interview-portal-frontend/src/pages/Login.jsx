import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/auth';
import '../styles/pages.css';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(formData.email, formData.password);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      if (response.data.user.role === 'interviewer') {
        navigate('/ai-interviewer-dashboard');
      } else if (response.data.user.role === 'company') {
        navigate('/company-dashboard');
      } else {
        navigate('/candidate-dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMsg = err.response?.data?.error || err.message || 'Login failed';
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
    card: {
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)',
      backdropFilter: 'blur(10px)',
      border: '2px solid rgba(99, 102, 241, 0.3)',
      borderRadius: '20px',
      padding: '3rem',
      maxWidth: '450px',
      boxShadow: '0 8px 32px rgba(99, 102, 241, 0.2), inset 0 0 20px rgba(139, 92, 246, 0.1)',
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
      background: 'linear-gradient(135deg, #6366f1 0%, #a78bfa 100%)',
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
      border: '2px solid rgba(99, 102, 241, 0.3)',
      borderRadius: '10px',
      padding: '1rem',
      color: '#f8fafc',
      fontSize: '0.95rem',
      transition: 'all 0.3s ease',
      fontFamily: 'inherit',
      outline: 'none'
    },
    button: {
      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      padding: '1.2rem',
      fontSize: '1rem',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
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
      color: '#6366f1',
      textDecoration: 'none',
      fontWeight: '600',
      marginLeft: '0.5rem',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    },
    features: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '1rem',
      marginTop: '2rem'
    },
    featureItem: {
      textAlign: 'center',
      padding: '1rem',
      background: 'rgba(99, 102, 241, 0.1)',
      borderRadius: '12px',
      border: '1px solid rgba(99, 102, 241, 0.2)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      animation: 'fadeInUp 0.8s ease-out backwards'
    },
    featureIcon: {
      fontSize: '2.5rem',
      display: 'block',
      marginBottom: '0.5rem'
    },
    featureText: {
      color: '#cbd5e1',
      fontSize: '0.85rem',
      fontWeight: '600'
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
          border-color: #6366f1 !important;
          background: rgba(99, 102, 241, 0.1) !important;
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.3) !important;
        }
        button:hover:not(:disabled) {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.5) !important;
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
            border: '3px solid rgba(99, 102, 241, 0.4)',
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
            border: '3px solid rgba(99, 102, 241, 0.3)',
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
            border: '2px solid rgba(99, 102, 241, 0.25)',
            borderRadius: '12px',
            animation: 'rotateSquare 20s linear infinite',
            pointerEvents: 'none',
            opacity: 0.2
          }}></div>

          <div style={{...styles.header, position: 'relative', zIndex: 2}}>
            <h1 style={styles.title}>🔐 Login</h1>
            <p style={styles.subtitle}>Welcome back to InterviewAI</p>
          </div>

          <form onSubmit={handleSubmit} style={{...styles.form, position: 'relative', zIndex: 2}}>
            {error && <div style={styles.error}>{error}</div>}

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
              {loading ? '⏳ Logging in...' : '✨ Login'}
            </button>
          </form>

          <div style={styles.footer}>
            Don't have an account? 
            <Link to="/register" style={styles.footerLink}>Sign Up</Link>
          </div>

          <div style={styles.features}>
            <div style={{...styles.featureItem, animationDelay: '0.6s'}}>
              <span style={styles.featureIcon}>🎯</span>
              <p style={styles.featureText}>Smart Interviews</p>
            </div>
            <div style={{...styles.featureItem, animationDelay: '0.7s'}}>
              <span style={styles.featureIcon}>🤖</span>
              <p style={styles.featureText}>AI Powered</p>
            </div>
            <div style={{...styles.featureItem, animationDelay: '0.8s'}}>
              <span style={styles.featureIcon}>📊</span>
              <p style={styles.featureText}>Real Analytics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


