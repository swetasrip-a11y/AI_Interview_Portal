import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getInterviews, getInterviewCandidates } from '../api/interviews';

export default function InterviewerAnalytics() {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviews();
  }, []);

  useEffect(() => {
    if (selectedInterview) {
      fetchCandidates(selectedInterview);
    }
  }, [selectedInterview]);

  const fetchInterviews = async () => {
    try {
      const response = await getInterviews();
      setInterviews(response.data);
      if (response.data.length > 0) {
        setSelectedInterview(response.data[0].id);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCandidates = async (interviewId) => {
    try {
      const response = await getInterviewCandidates(interviewId);
      setCandidates(response.data.sort((a, b) => (b.marks_obtained || 0) - (a.marks_obtained || 0)));
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) return (
    <div style={styles.loadingContainer}>
      <div style={styles.spinner}></div>
      <p>Loading Analytics...</p>
    </div>
  );

  const selectedInterviewData = interviews.find(i => i.id === selectedInterview);
  const totalCandidates = candidates.length;
  const selectedCount = candidates.filter(c => c.decision === 'Selected').length;
  const rejectedCount = candidates.filter(c => c.decision === 'Rejected').length;
  const pendingCount = totalCandidates - selectedCount - rejectedCount;
  const averageScore = candidates.length > 0
    ? Math.round(candidates.reduce((sum, c) => sum + (c.marks_obtained || 0), 0) / candidates.length)
    : 0;
  const highPerformers = candidates.filter(c => c.marks_obtained >= 80).length;
  const passRate = totalCandidates > 0 ? Math.round((selectedCount / totalCandidates) * 100) : 0;

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes rotateSquare {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.05); }
          100% { transform: rotate(360deg) scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(25px, -25px); }
          50% { transform: translate(25px, 25px); }
          75% { transform: translate(-25px, 25px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>

      <div style={styles.backgroundAnimation}></div>

      <div style={styles.header}>
        <h1 style={styles.title}>📊 Analytics & Performance Dashboard</h1>
        <button style={styles.logoutBtn} onClick={handleLogout}>🚪 Logout</button>
      </div>

      {interviews.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📭</div>
          <p>No interviews yet. Create one to view analytics.</p>
          <Link to="/interviewer-dashboard" style={styles.linkBtn}>← Back to Dashboard</Link>
        </div>
      ) : (
        <div style={styles.contentWrapper}>
          <div style={styles.filterSection}>
            <label style={styles.filterLabel}>Select Interview:</label>
            <select
              value={selectedInterview}
              onChange={(e) => setSelectedInterview(parseInt(e.target.value))}
              style={styles.selectInput}
            >
              {interviews.map(interview => (
                <option key={interview.id} value={interview.id}>
                  {interview.title} ({interview.job_title})
                </option>
              ))}
            </select>
          </div>

          {selectedInterviewData && (
            <>
              <h2 style={styles.sectionTitle}>{selectedInterviewData.title}</h2>

              <div style={styles.statsGrid}>
                <div style={{...styles.statCard, animationDelay: '0s'}}>
                  <div style={styles.statIcon}>👥</div>
                  <h3>Total Candidates</h3>
                  <div style={styles.statNumber}>{totalCandidates}</div>
                  <p style={styles.statDesc}>Interviewed</p>
                </div>

                <div style={{...styles.statCard, animationDelay: '0.1s'}}>
                  <div style={styles.statIcon}>✅</div>
                  <h3>Selected</h3>
                  <div style={{...styles.statNumber, color: '#10b981'}}>{selectedCount}</div>
                  <p style={styles.statDesc}>{passRate}% pass rate</p>
                </div>

                <div style={{...styles.statCard, animationDelay: '0.2s'}}>
                  <div style={styles.statIcon}>❌</div>
                  <h3>Rejected</h3>
                  <div style={{...styles.statNumber, color: '#ef4444'}}>{rejectedCount}</div>
                  <p style={styles.statDesc}>Not qualified</p>
                </div>

                <div style={{...styles.statCard, animationDelay: '0.3s'}}>
                  <div style={styles.statIcon}>⏳</div>
                  <h3>Pending</h3>
                  <div style={{...styles.statNumber, color: '#f59e0b'}}>{pendingCount}</div>
                  <p style={styles.statDesc}>Under review</p>
                </div>

                <div style={{...styles.statCard, animationDelay: '0.4s'}}>
                  <div style={styles.statIcon}>⭐</div>
                  <h3>Avg Score</h3>
                  <div style={{...styles.statNumber, color: '#8b5cf6'}}>{averageScore}%</div>
                  <p style={styles.statDesc}>Overall average</p>
                </div>

                <div style={{...styles.statCard, animationDelay: '0.5s'}}>
                  <div style={styles.statIcon}>🏆</div>
                  <h3>High Performers</h3>
                  <div style={{...styles.statNumber, color: '#06b6d4'}}>{highPerformers}</div>
                  <p style={styles.statDesc}>Score ≥ 80</p>
                </div>
              </div>

              <h3 style={styles.leaderboardTitle}>📋 Candidate Leaderboard</h3>

              {candidates.length === 0 ? (
                <div style={styles.emptyLeaderboard}>
                  <p>No candidates have joined this interview yet.</p>
                </div>
              ) : (
                <div style={styles.leaderboardContainer}>
                  {candidates.map((candidate, idx) => (
                    <div key={candidate.id} style={{
                      ...styles.candidateRow,
                      borderLeftColor: candidate.marks_obtained >= 80 ? '#10b981' : candidate.marks_obtained >= 60 ? '#f59e0b' : '#ef4444',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '-10px',
                        right: '-10px',
                        width: '40px',
                        height: '40px',
                        border: '2px solid rgba(139, 92, 246, 0.2)',
                        borderRadius: '6px',
                        animation: 'rotateSquare 8s linear infinite',
                        pointerEvents: 'none'
                      }}></div>
                      
                      <div style={styles.candidateInfo}>
                        <span style={styles.rankBadge}>{idx + 1}</span>
                        <div>
                          <h4 style={styles.candidateName}>{candidate.full_name}</h4>
                          <p style={styles.candidateEmail}>{candidate.email}</p>
                        </div>
                      </div>

                      <div style={styles.candidateScore}>
                        {candidate.marks_obtained !== null && (
                          <span style={styles.scoreValue}>{candidate.marks_obtained}/100</span>
                        )}
                        {candidate.decision && (
                          <span style={{
                            ...styles.decisionBadge,
                            backgroundColor: candidate.decision === 'Selected' ? 'rgba(16, 185, 129, 0.2)' : candidate.decision === 'Rejected' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                            color: candidate.decision === 'Selected' ? '#10b981' : candidate.decision === 'Rejected' ? '#ef4444' : '#f59e0b'
                          }}>
                            {candidate.decision}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}


