import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getQuestions, deleteQuestion } from '../api/questions';

export default function AdminQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hoveredId, setHoveredId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
    checkAdmin();
  }, []);

  const checkAdmin = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'admin') {
      navigate('/dashboard');
    }
  };

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await getQuestions();
      setQuestions(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await deleteQuestion(id);
        setQuestions(questions.filter(q => q.id !== id));
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete question');
      }
    }
  };

  if (loading) return <div className="container"><h2>Loading...</h2></div>;

  const styles = {
    container: {
      background: 'linear-gradient(135deg, #050810 0%, #0a0e27 50%, #1a1f35 100%)',
      minHeight: '100vh',
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
      background: 'radial-gradient(circle, rgba(99,102,241,0.08) 1px, transparent 1px)',
      backgroundSize: '50px 50px',
      animation: 'float 30s infinite linear',
      pointerEvents: 'none',
      zIndex: 0
    },
    contentWrapper: {
      position: 'relative',
      zIndex: 1,
      maxWidth: '1200px',
      margin: '0 auto'
    },
    header: {
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)',
      borderRadius: '15px',
      padding: '2rem',
      marginBottom: '2rem',
      border: '2px solid rgba(99, 102, 241, 0.3)',
      backdropFilter: 'blur(10px)',
      animation: 'slideDown 0.6s ease-out'
    },
    title: {
      color: '#f8fafc',
      fontSize: '2.5rem',
      fontWeight: 'bold',
      margin: 0,
      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    createBtn: {
      display: 'inline-block',
      padding: '12px 24px',
      backgroundColor: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: 'white',
      borderRadius: '8px',
      textDecoration: 'none',
      marginBottom: '2rem',
      fontWeight: 'bold',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
      fontSize: '1rem'
    },
    questionCard: {
      border: '2px solid rgba(99, 102, 241, 0.2)',
      borderRadius: '12px',
      padding: '1.5rem',
      marginBottom: '1.5rem',
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      cursor: 'pointer',
      color: '#f8fafc',
      position: 'relative',
      overflow: 'hidden'
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
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 10px rgba(99, 102, 241, 0.4), inset 0 0 10px rgba(99, 102, 241, 0.1); }
          50% { box-shadow: 0 0 25px rgba(99, 102, 241, 0.6), inset 0 0 20px rgba(99, 102, 241, 0.2); }
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
      `}</style>

      <div style={styles.backgroundAnimation}></div>

      <div style={styles.contentWrapper}>
        <div style={styles.header}>
          <h1 style={styles.title}>🔧 Admin Panel - Manage Questions</h1>
        </div>

        <Link to="/admin/questions/create" style={{
          ...styles.createBtn,
          marginTop: '1rem'
        }} onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.4)';
        }} onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
        }}>
          ➕ Create New Question
        </Link>

        {error && <div style={{
          background: 'rgba(239, 68, 68, 0.2)',
          border: '2px solid #ef4444',
          borderRadius: '8px',
          padding: '1rem',
          color: '#fecaca',
          marginBottom: '1.5rem'
        }}>{error}</div>}

        {questions.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: '#cbd5e1',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
            borderRadius: '12px',
            border: '2px dashed rgba(99, 102, 241, 0.3)',
            animation: 'fadeInUp 0.8s ease-out'
          }}>
            <p style={{ fontSize: '1.1rem', margin: '0 0 1rem 0' }}>No questions yet.</p>
            <Link to="/admin/questions/create" style={{...styles.createBtn}}>Create one now</Link>
          </div>
        ) : (
          <div style={{ animation: 'fadeInUp 0.8s ease-out 0.2s backwards' }}>
            {questions.map((q, idx) => (
              <div
                key={q.id}
                style={{
                  ...styles.questionCard,
                  animation: `fadeInUp 0.8s ease-out ${0.3 + idx * 0.1}s backwards`,
                  ...(hoveredId === q.id && {
                    transform: 'translateY(-10px) scale(1.02)',
                    borderColor: '#8b5cf6',
                    boxShadow: '0 20px 50px rgba(99, 102, 241, 0.4)'
                  })
                }}
                onMouseEnter={() => setHoveredId(q.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Rotating square decoration */}
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  right: '-20px',
                  width: '60px',
                  height: '60px',
                  border: '2px solid rgba(99, 102, 241, 0.3)',
                  borderRadius: '4px',
                  animation: 'rotateSquare 8s linear infinite',
                  pointerEvents: 'none'
                }}></div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', position: 'relative', zIndex: 1 }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 1rem 0', color: '#6366f1' }}>📌 {q.title}</h3>
                    <p style={{ margin: '0.75rem 0', color: '#cbd5e1' }}><strong>Question:</strong> {q.question_text}</p>
                    <p style={{ margin: '0.75rem 0', color: '#cbd5e1' }}>
                      <strong>Difficulty:</strong> 
                      <span style={{
                        display: 'inline-block',
                        marginLeft: '0.5rem',
                        padding: '4px 12px',
                        background: q.difficulty === 'Easy' ? 'rgba(16, 185, 129, 0.2)' : q.difficulty === 'Medium' ? 'rgba(251, 146, 60, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: q.difficulty === 'Easy' ? '#10b981' : q.difficulty === 'Medium' ? '#fb923c' : '#ef4444',
                        borderRadius: '4px',
                        fontWeight: '600',
                        fontSize: '0.85rem'
                      }}>
                        {q.difficulty}
                      </span>
                    </p>
                  </div>
                  <div style={{ marginLeft: '2rem', whiteSpace: 'nowrap', display: 'flex', gap: '1rem' }}>
                    <Link to={`/admin/questions/${q.id}/edit`} style={{
                      display: 'inline-block',
                      padding: '8px 14px',
                      background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
                      color: 'white',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 12px rgba(52, 152, 219, 0.3)'
                    }} onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 20px rgba(52, 152, 219, 0.4)';
                    }} onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 12px rgba(52, 152, 219, 0.3)';
                    }}>
                      ✎ Edit
                    </Link>
                    <button onClick={() => handleDelete(q.id)} style={{
                      padding: '8px 14px',
                      background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 12px rgba(231, 76, 60, 0.3)'
                    }} onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 20px rgba(231, 76, 60, 0.4)';
                    }} onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 12px rgba(231, 76, 60, 0.3)';
                    }}>
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <Link to="/dashboard" style={{
            display: 'inline-block',
            padding: '10px 24px',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.2) 100%)',
            color: '#6366f1',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '600',
            border: '2px solid rgba(99, 102, 241, 0.4)',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }} onMouseEnter={(e) => {
            e.target.style.background = 'linear-gradient(135deg, rgba(99, 102, 241, 0.5) 0%, rgba(139, 92, 246, 0.3) 100%)';
            e.target.style.boxShadow = '0 8px 20px rgba(99, 102, 241, 0.4)';
          }} onMouseLeave={(e) => {
            e.target.style.background = 'linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.2) 100%)';
            e.target.style.boxShadow = 'none';
          }}>
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}


