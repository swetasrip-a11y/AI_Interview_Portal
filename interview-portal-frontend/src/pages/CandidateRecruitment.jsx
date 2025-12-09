import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function CandidateRecruitment() {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [filterScore, setFilterScore] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  // Mock candidates with AI interview scores
  const mockCandidates = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      email: 'rajesh@gmail.com',
      position: 'Senior React Developer',
      aiScore: 85,
      status: 'Ready to Hire',
      skills: ['React', 'JavaScript', 'Node.js', 'MongoDB'],
      experience: '5+ years',
      phone: '+91-9876543210',
      applyDate: '2024-12-01',
      interviewDate: '2024-12-05'
    },
    {
      id: 2,
      name: 'Priya Singh',
      email: 'priya@gmail.com',
      position: 'Full Stack Developer',
      aiScore: 78,
      status: 'Under Review',
      skills: ['Python', 'Django', 'PostgreSQL', 'React'],
      experience: '4+ years',
      phone: '+91-9876543211',
      applyDate: '2024-12-02',
      interviewDate: '2024-12-06'
    },
    {
      id: 3,
      name: 'Amit Patel',
      email: 'amit@gmail.com',
      position: 'DevOps Engineer',
      aiScore: 92,
      status: 'Ready to Hire',
      skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
      experience: '6+ years',
      phone: '+91-9876543212',
      applyDate: '2024-12-01',
      interviewDate: '2024-12-04'
    },
    {
      id: 4,
      name: 'Neha Verma',
      email: 'neha@gmail.com',
      position: 'Frontend Developer',
      aiScore: 72,
      status: 'Pending Interview',
      skills: ['React', 'Vue.js', 'CSS', 'JavaScript'],
      experience: '3+ years',
      phone: '+91-9876543213',
      applyDate: '2024-12-03',
      interviewDate: null
    },
    {
      id: 5,
      name: 'Vikram Singh',
      email: 'vikram@gmail.com',
      position: 'Backend Developer',
      aiScore: 65,
      status: 'Rejected',
      skills: ['Java', 'Spring', 'MySQL'],
      experience: '2+ years',
      phone: '+91-9876543214',
      applyDate: '2024-11-28',
      interviewDate: '2024-12-02'
    },
    {
      id: 6,
      name: 'Ananya Sharma',
      email: 'ananya@gmail.com',
      position: 'QA Engineer',
      aiScore: 88,
      status: 'Ready to Hire',
      skills: ['Selenium', 'Python', 'TestNG', 'API Testing'],
      experience: '4+ years',
      phone: '+91-9876543215',
      applyDate: '2024-12-01',
      interviewDate: '2024-12-05'
    }
  ];

  useEffect(() => {
    setCandidates(mockCandidates);
    filterCandidates(mockCandidates, filterScore, searchQuery);
  }, []);

  const filterCandidates = (list, scoreFilter, query) => {
    let filtered = list;

    // Score filter
    if (scoreFilter === 'high') {
      filtered = filtered.filter(c => c.aiScore >= 80);
    } else if (scoreFilter === 'medium') {
      filtered = filtered.filter(c => c.aiScore >= 70 && c.aiScore < 80);
    } else if (scoreFilter === 'low') {
      filtered = filtered.filter(c => c.aiScore < 70);
    }

    // Search filter
    if (query) {
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.email.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredCandidates(filtered);
  };

  const handleScoreFilter = (score) => {
    setFilterScore(score);
    filterCandidates(candidates, score, searchQuery);
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterCandidates(candidates, filterScore, query);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 70) return '#f59e0b';
    return '#ef4444';
  };

  const getStatusColor = (status) => {
    if (status === 'Ready to Hire') return 'rgba(16, 185, 129, 0.2)';
    if (status === 'Under Review') return 'rgba(245, 158, 11, 0.2)';
    if (status === 'Pending Interview') return 'rgba(59, 130, 246, 0.2)';
    return 'rgba(239, 68, 68, 0.2)';
  };

  const getStatusTextColor = (status) => {
    if (status === 'Ready to Hire') return '#10b981';
    if (status === 'Under Review') return '#f59e0b';
    if (status === 'Pending Interview') return '#3b82f6';
    return '#ef4444';
  };

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
      fontSize: '2.2rem',
      fontWeight: 'bold'
    },
    backBtn: {
      padding: '0.6rem 1rem',
      background: 'rgba(100, 116, 139, 0.2)',
      color: '#cbd5e1',
      border: '1px solid rgba(100, 116, 139, 0.5)',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      fontSize: '0.9rem'
    },
    filterSection: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '2rem',
      flexWrap: 'wrap',
      alignItems: 'center',
      animation: 'slideUp 0.6s ease-out 0.1s backwards'
    },
    filterButton: (isActive) => ({
      padding: '0.6rem 1.2rem',
      background: isActive ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : 'rgba(99, 102, 241, 0.2)',
      color: isActive ? 'white' : '#6366f1',
      border: isActive ? '2px solid #6366f1' : '1px solid rgba(99, 102, 241, 0.5)',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      whiteSpace: 'nowrap',
      boxShadow: isActive ? '0 4px 15px rgba(99, 102, 241, 0.3)' : 'none'
    }),
    searchBox: {
      padding: '0.75rem 1rem',
      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.5) 100%)',
      border: '1px solid rgba(100, 116, 139, 0.3)',
      borderRadius: '8px',
      color: '#f8fafc',
      fontFamily: 'inherit',
      flex: 1,
      minWidth: '200px',
      transition: 'all 0.3s ease'
    },
    candidateGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1.5rem',
      animation: 'fadeInUp 0.8s ease-out 0.2s backwards'
    },
    candidateCard: {
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
      backdropFilter: 'blur(10px)',
      border: '2px solid rgba(100, 116, 139, 0.3)',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      cursor: 'pointer',
      transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      position: 'relative',
      overflow: 'hidden'
    },
    candidateCardHover: {
      transform: 'translateY(-15px) scale(1.05)',
      borderColor: '#8b5cf6',
      boxShadow: '0 20px 50px rgba(99, 102, 241, 0.4)',
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.15) 100%)'
    },
    scoreDisplay: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      background: 'rgba(99, 102, 241, 0.1)',
      margin: '0 auto 1rem',
      borderWidth: '3px',
      borderStyle: 'solid',
      transition: 'all 0.3s ease'
    },
    scoreNumber: {
      fontSize: '1.8rem',
      fontWeight: '700'
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(6px)',
      animation: 'fadeIn 0.3s ease-out'
    },
    modal: {
      background: 'linear-gradient(135deg, #050810 0%, #0a0e27 100%)',
      borderRadius: '16px',
      padding: '2rem',
      maxWidth: '600px',
      width: '90%',
      maxHeight: '90vh',
      overflowY: 'auto',
      border: '2px solid rgba(99, 102, 241, 0.3)',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
      animation: 'slideInUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
    },
    button: {
      padding: '0.6rem 1.2rem',
      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
    },
    actionButtons: {
      display: 'flex',
      gap: '1rem',
      marginTop: '1.5rem'
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
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes rotateSquare {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.05); }
          100% { transform: rotate(360deg) scale(1); }
        }

        @keyframes floatUp {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.4), inset 0 0 10px rgba(99, 102, 241, 0.1); }
          50% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.6), inset 0 0 20px rgba(99, 102, 241, 0.2); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        @keyframes colorShift {
          0%, 100% { border-color: rgba(99, 102, 241, 0.4); }
          50% { border-color: rgba(139, 92, 246, 0.6); }
        }

        @keyframes softPulse {
          0%, 100% { box-shadow: 0 0 10px rgba(99, 102, 241, 0.3); }
          50% { box-shadow: 0 0 25px rgba(99, 102, 241, 0.5); }
        }
      `}</style>

      <div style={styles.backgroundAnimation}></div>

      <div style={styles.contentWrapper}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.headerTitle}>👥 Candidate Recruitment</h1>
            <p style={{ margin: 0, color: '#cbd5e1' }}>AI Interview Performance Based Selection</p>
          </div>
          <Link to="/company-dashboard" style={{ textDecoration: 'none' }}>
            <button 
              style={styles.backBtn}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(100, 116, 139, 0.4)';
                e.target.style.borderColor = 'rgba(100, 116, 139, 0.8)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(100, 116, 139, 0.2)';
                e.target.style.borderColor = 'rgba(100, 116, 139, 0.5)';
              }}
            >
              ← Back to Dashboard
            </button>
          </Link>
        </div>

        {/* Filters */}
        <div style={styles.filterSection}>
          <span style={{ color: '#cbd5e1', fontWeight: '600' }}>🔍 Filter by AI Score:</span>
          <button
            style={styles.filterButton(filterScore === 'all')}
            onClick={() => handleScoreFilter('all')}
            onMouseEnter={(e) => {
              if (filterScore !== 'all') {
                e.target.style.background = 'rgba(99, 102, 241, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (filterScore !== 'all') {
                e.target.style.background = 'rgba(99, 102, 241, 0.2)';
              }
            }}
          >
            📊 All
          </button>
          <button
            style={styles.filterButton(filterScore === 'high')}
            onClick={() => handleScoreFilter('high')}
            onMouseEnter={(e) => {
              if (filterScore !== 'high') {
                e.target.style.background = 'rgba(99, 102, 241, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (filterScore !== 'high') {
                e.target.style.background = 'rgba(99, 102, 241, 0.2)';
              }
            }}
          >
            ✨ High (80+)
          </button>
          <button
            style={styles.filterButton(filterScore === 'medium')}
            onClick={() => handleScoreFilter('medium')}
            onMouseEnter={(e) => {
              if (filterScore !== 'medium') {
                e.target.style.background = 'rgba(99, 102, 241, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (filterScore !== 'medium') {
                e.target.style.background = 'rgba(99, 102, 241, 0.2)';
              }
            }}
          >
            ~ Medium (70-79)
          </button>
          <button
            style={styles.filterButton(filterScore === 'low')}
            onClick={() => handleScoreFilter('low')}
            onMouseEnter={(e) => {
              if (filterScore !== 'low') {
                e.target.style.background = 'rgba(99, 102, 241, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (filterScore !== 'low') {
                e.target.style.background = 'rgba(99, 102, 241, 0.2)';
              }
            }}
          >
            ⚠️ Low (&lt;70)
          </button>

          <input
            type="text"
            placeholder="🔎 Search by name or email..."
            style={styles.searchBox}
            value={searchQuery}
            onChange={handleSearch}
            onFocus={(e) => {
              e.target.style.borderColor = '#6366f1';
              e.target.style.boxShadow = '0 0 15px rgba(99, 102, 241, 0.3)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(100, 116, 139, 0.3)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Candidates Grid */}
        <div style={styles.candidateGrid}>
          {filteredCandidates.map((candidate, idx) => (
            <div
              key={candidate.id}
              style={{
                ...styles.candidateCard,
                borderLeft: `4px solid ${getScoreColor(candidate.aiScore)}`,
                ...(hoveredCard === idx ? styles.candidateCardHover : {}),
                position: 'relative'
              }}
              onClick={() => setSelectedCandidate(candidate)}
              onMouseEnter={() => setHoveredCard(idx)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Rotating square decoration */}
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '60px',
                height: '60px',
                border: `2px solid ${getScoreColor(candidate.aiScore)}`,
                borderRadius: '4px',
                opacity: 0.3,
                animation: 'rotateSquare ' + (6 + idx) + 's linear infinite',
                pointerEvents: 'none'
              }}></div>
              <div
                style={{
                  ...styles.scoreDisplay,
                  borderColor: getScoreColor(candidate.aiScore),
                  ...(hoveredCard === idx ? { transform: 'scale(1.1)' } : {})
                }}
              >
                <div style={{
                  ...styles.scoreNumber,
                  color: getScoreColor(candidate.aiScore)
                }}>
                  {candidate.aiScore}
                </div>
              </div>

              <h3 style={{ margin: '1rem 0 0.5rem 0', textAlign: 'center' }}>{candidate.name}</h3>
              <p style={{ margin: '0 0 0.5rem 0', textAlign: 'center', color: '#cbd5e1', fontSize: '0.9rem' }}>
                {candidate.position}
              </p>

              <div style={{
                background: getStatusColor(candidate.status),
                color: getStatusTextColor(candidate.status),
                padding: '0.4rem 0.8rem',
                borderRadius: '6px',
                textAlign: 'center',
                fontWeight: '600',
                fontSize: '0.85rem',
                marginBottom: '1rem',
                border: `1px solid ${getStatusTextColor(candidate.status)}`
              }}>
                {candidate.status}
              </div>

              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.4rem',
                marginBottom: '1rem'
              }}>
                {candidate.skills.slice(0, 3).map((skill, idx) => (
                  <span
                    key={idx}
                    style={{
                      display: 'inline-block',
                      padding: '0.3rem 0.6rem',
                      background: 'rgba(99, 102, 241, 0.2)',
                      color: '#6366f1',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      border: '1px solid rgba(99, 102, 241, 0.4)',
                      transition: 'all 0.2s ease',
                      ...(hoveredCard === idx ? { background: 'rgba(99, 102, 241, 0.3)', borderColor: '#6366f1' } : {})
                    }}
                  >
                    {skill}
                  </span>
                ))}
                {candidate.skills.length > 3 && (
                  <span style={{
                    display: 'inline-block',
                    padding: '0.3rem 0.6rem',
                    color: '#94a3b8',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    +{candidate.skills.length - 3}
                  </span>
                )}
              </div>

              <div style={{ 
                fontSize: '0.85rem', 
                color: '#64748b',
                textAlign: 'center',
                paddingTop: '0.5rem',
                borderTop: '1px solid rgba(100, 116, 139, 0.2)'
              }}>
                📧 {candidate.experience}
              </div>
            </div>
          ))}
        </div>

        {filteredCandidates.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '3rem 2rem',
            color: '#cbd5e1',
            fontSize: '1.1rem'
          }}>
            <p>🔍 No candidates found matching your filters.</p>
          </div>
        )}

        {/* Detail Modal */}
        {selectedCandidate && (
          <div style={styles.modalOverlay} onClick={() => setSelectedCandidate(null)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{selectedCandidate.name}</h2>
                <button
                  onClick={() => setSelectedCandidate(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#cbd5e1',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#6366f1'}
                  onMouseLeave={(e) => e.target.style.color = '#cbd5e1'}
                >
                  ✕
                </button>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginBottom: '1.5rem',
                paddingBottom: '1.5rem',
                borderBottom: '1px solid rgba(100, 116, 139, 0.3)'
              }}>
                <div>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 0.5rem 0' }}>Position</p>
                  <p style={{ margin: 0, fontWeight: '600' }}>{selectedCandidate.position}</p>
                </div>
                <div>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 0.5rem 0' }}>AI Score</p>
                  <p style={{ margin: 0, fontWeight: '600', color: getScoreColor(selectedCandidate.aiScore), fontSize: '1.3rem' }}>{selectedCandidate.aiScore}%</p>
                </div>
                <div>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 0.5rem 0' }}>Experience</p>
                  <p style={{ margin: 0, fontWeight: '600' }}>{selectedCandidate.experience}</p>
                </div>
                <div>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 0.5rem 0' }}>Status</p>
                  <p style={{ margin: 0, fontWeight: '600', color: getStatusTextColor(selectedCandidate.status) }}>{selectedCandidate.status}</p>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 0.5rem 0' }}>Skills</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {selectedCandidate.skills.map((skill, idx) => (
                    <span key={idx} style={{
                      display: 'inline-block',
                      padding: '0.4rem 0.8rem',
                      background: 'rgba(99, 102, 241, 0.2)',
                      color: '#6366f1',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      border: '1px solid rgba(99, 102, 241, 0.4)'
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(100, 116, 139, 0.3)' }}>
                <div>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 0.5rem 0' }}>Email</p>
                  <p style={{ margin: 0 }}>{selectedCandidate.email}</p>
                </div>
                <div>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 0.5rem 0' }}>Phone</p>
                  <p style={{ margin: 0 }}>{selectedCandidate.phone}</p>
                </div>
              </div>

              <div style={styles.actionButtons}>
                <button style={{...styles.button, flex: 1}} onClick={() => setSelectedCandidate(null)}>
                  👤 Schedule Interview
                </button>
                <button style={{...styles.button, flex: 1, background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', border: '2px solid #10b981'}} onClick={() => setSelectedCandidate(null)}>
                  ✓ Send Offer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
