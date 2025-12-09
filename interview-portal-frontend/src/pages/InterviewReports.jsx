import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function InterviewReports() {
  const [selectedReport, setSelectedReport] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate();

  // Mock interview reports
  const mockReports = [
    {
      id: 1,
      candidateName: 'Rajesh Kumar',
      position: 'Senior React Developer',
      interviewDate: '2024-12-05',
      totalScore: 85,
      duration: '45 mins',
      sections: [
        { name: 'Technical Knowledge', score: 88, maxScore: 100 },
        { name: 'Problem Solving', score: 82, maxScore: 100 },
        { name: 'Communication', score: 85, maxScore: 100 },
        { name: 'Experience', score: 84, maxScore: 100 }
      ],
      questionsAsked: [
        { q: 'Tell about your professional background', answer: 'Excellent answer with clear examples', score: 90 },
        { q: 'Explain your React expertise', answer: 'Detailed explanation with use cases', score: 87 },
        { q: 'How do you handle performance optimization?', answer: 'Good approach with practical examples', score: 82 },
        { q: 'Describe your team collaboration style', answer: 'Clear communication skills demonstrated', score: 84 },
        { q: 'What are your career goals?', answer: 'Aligned with company values', score: 81 }
      ],
      summary: 'Strong candidate with excellent technical knowledge and problem-solving skills.',
      recommendation: 'HIRE',
      strengths: ['React expertise', 'Problem-solving', 'Communication skills', 'Experience'],
      weaknesses: ['Performance optimization needs improvement']
    },
    {
      id: 2,
      candidateName: 'Priya Singh',
      position: 'Full Stack Developer',
      interviewDate: '2024-12-06',
      totalScore: 78,
      duration: '42 mins',
      sections: [
        { name: 'Technical Knowledge', score: 76, maxScore: 100 },
        { name: 'Problem Solving', score: 78, maxScore: 100 },
        { name: 'Communication', score: 80, maxScore: 100 },
        { name: 'Experience', score: 78, maxScore: 100 }
      ],
      questionsAsked: [
        { q: 'Tell about your professional background', answer: 'Good answer with relevant experience', score: 78 },
        { q: 'Backend technology expertise?', answer: 'Solid Django knowledge', score: 76 },
        { q: 'Database optimization experience?', answer: 'Limited examples', score: 72 },
        { q: 'How do you approach debugging?', answer: 'Systematic approach', score: 80 },
        { q: 'What challenges have you overcome?', answer: 'Relevant project examples', score: 80 }
      ],
      summary: 'Competent full-stack developer with good communication. Some technical gaps to address.',
      recommendation: 'UNDER_REVIEW',
      strengths: ['Full-stack capability', 'Communication', 'Learning ability'],
      weaknesses: ['Database optimization', 'System design patterns']
    },
    {
      id: 3,
      candidateName: 'Amit Patel',
      position: 'DevOps Engineer',
      interviewDate: '2024-12-04',
      totalScore: 92,
      duration: '50 mins',
      sections: [
        { name: 'Technical Knowledge', score: 94, maxScore: 100 },
        { name: 'Problem Solving', score: 91, maxScore: 100 },
        { name: 'Communication', score: 90, maxScore: 100 },
        { name: 'Experience', score: 93, maxScore: 100 }
      ],
      questionsAsked: [
        { q: 'Describe your DevOps experience', answer: 'Comprehensive overview of tools and practices', score: 95 },
        { q: 'Kubernetes deployment strategies?', answer: 'Expert-level knowledge', score: 94 },
        { q: 'CI/CD pipeline design', answer: 'Detailed pipeline architecture', score: 90 },
        { q: 'Infrastructure as Code experience?', answer: 'Extensive Terraform experience', score: 92 },
        { q: 'Crisis management and monitoring?', answer: 'Real-world examples and best practices', score: 91 }
      ],
      summary: 'Exceptional DevOps engineer with deep infrastructure knowledge and practical expertise.',
      recommendation: 'HIRE',
      strengths: ['Kubernetes expertise', 'Infrastructure design', 'DevOps tools mastery', 'Crisis management'],
      weaknesses: ['None significant']
    },
    {
      id: 4,
      candidateName: 'Neha Verma',
      position: 'Frontend Developer',
      interviewDate: null,
      totalScore: null,
      duration: null,
      sections: [],
      questionsAsked: [],
      summary: 'Pending AI interview',
      recommendation: 'PENDING',
      strengths: [],
      weaknesses: []
    },
    {
      id: 5,
      candidateName: 'Vikram Singh',
      position: 'Backend Developer',
      interviewDate: '2024-12-02',
      totalScore: 65,
      duration: '38 mins',
      sections: [
        { name: 'Technical Knowledge', score: 62, maxScore: 100 },
        { name: 'Problem Solving', score: 65, maxScore: 100 },
        { name: 'Communication', score: 68, maxScore: 100 },
        { name: 'Experience', score: 64, maxScore: 100 }
      ],
      questionsAsked: [
        { q: 'Describe your backend experience', answer: 'Basic knowledge with gaps', score: 62 },
        { q: 'SQL vs NoSQL?', answer: 'Limited understanding', score: 60 },
        { q: 'API design principles?', answer: 'Partial knowledge', score: 65 },
        { q: 'How do you ensure code quality?', answer: 'Basic testing knowledge', score: 68 },
        { q: 'Performance optimization?', answer: 'Minimal experience', score: 64 }
      ],
      summary: 'Junior-level backend developer with fundamental knowledge but lacking in critical areas.',
      recommendation: 'REJECT',
      strengths: ['Willing to learn', 'Basic coding skills'],
      weaknesses: ['Limited experience', 'System design gaps', 'Database knowledge']
    }
  ];

  const getScoreColor = (score) => {
    if (!score) return '#94a3b8';
    if (score >= 80) return '#10b981';
    if (score >= 70) return '#f59e0b';
    return '#ef4444';
  };

  const getRecommendationColor = (rec) => {
    if (rec === 'HIRE') return 'rgba(16, 185, 129, 0.2)';
    if (rec === 'UNDER_REVIEW') return 'rgba(245, 158, 11, 0.2)';
    if (rec === 'PENDING') return 'rgba(59, 130, 246, 0.2)';
    return 'rgba(239, 68, 68, 0.2)';
  };

  const getRecommendationText = (rec) => {
    if (rec === 'HIRE') return '✓ HIRE';
    if (rec === 'UNDER_REVIEW') return '~ UNDER REVIEW';
    if (rec === 'PENDING') return '⏳ PENDING';
    return '✕ REJECT';
  };

  const filteredReports = filterStatus === 'all' 
    ? mockReports
    : mockReports.filter(r => r.recommendation === filterStatus);

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
    backBtn: {
      padding: '0.6rem 1.2rem',
      background: 'rgba(100, 116, 139, 0.2)',
      color: '#cbd5e1',
      border: '1px solid rgba(100, 116, 139, 0.5)',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      textDecoration: 'none'
    },
    filterSection: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '2rem',
      flexWrap: 'wrap',
      alignItems: 'center'
    },
    filterButton: (isActive) => ({
      padding: '0.6rem 1.2rem',
      background: isActive ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : 'rgba(99, 102, 241, 0.2)',
      color: isActive ? 'white' : '#6366f1',
      border: '1px solid rgba(99, 102, 241, 0.5)',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      whiteSpace: 'nowrap'
    }),
    reportsList: {
      display: 'grid',
      gap: '1.5rem'
    },
    reportCard: {
      background: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(100, 116, 139, 0.3)',
      borderRadius: '12px',
      padding: '1.5rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)',
      overflowY: 'auto'
    },
    modal: {
      background: 'linear-gradient(135deg, #050810 0%, #0a0e27 100%)',
      borderRadius: '16px',
      padding: '2rem',
      maxWidth: '700px',
      width: '90%',
      maxHeight: '90vh',
      overflowY: 'auto',
      border: '1px solid rgba(100, 116, 139, 0.3)',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
      margin: 'auto'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={{ margin: '0 0 0.5rem 0' }}>📊 Interview Reports & Analytics</h1>
          <p style={{ margin: 0, color: '#cbd5e1' }}>AI Interview Performance Analysis</p>
        </div>
        <Link to="/company-dashboard" style={{ textDecoration: 'none' }}>
          <button style={styles.backBtn}>← Back to Dashboard</button>
        </Link>
      </div>

      {/* Filters */}
      <div style={styles.filterSection}>
        <span style={{ color: '#cbd5e1', fontWeight: '600' }}>Filter by Status:</span>
        <button
          style={styles.filterButton(filterStatus === 'all')}
          onClick={() => setFilterStatus('all')}
        >
          📋 All Reports
        </button>
        <button
          style={styles.filterButton(filterStatus === 'HIRE')}
          onClick={() => setFilterStatus('HIRE')}
        >
          ✓ Hire
        </button>
        <button
          style={styles.filterButton(filterStatus === 'UNDER_REVIEW')}
          onClick={() => setFilterStatus('UNDER_REVIEW')}
        >
          ~ Under Review
        </button>
        <button
          style={styles.filterButton(filterStatus === 'PENDING')}
          onClick={() => setFilterStatus('PENDING')}
        >
          ⏳ Pending
        </button>
        <button
          style={styles.filterButton(filterStatus === 'REJECT')}
          onClick={() => setFilterStatus('REJECT')}
        >
          ✕ Reject
        </button>
      </div>

      {/* Reports List */}
      <div style={styles.reportsList}>
        {filteredReports.map(report => (
          <div
            key={report.id}
            style={{
              ...styles.reportCard,
              borderLeft: `4px solid ${getScoreColor(report.totalScore)}`,
              cursor: report.totalScore ? 'pointer' : 'default'
            }}
            onClick={() => report.totalScore && setSelectedReport(report)}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '1rem'
            }}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0' }}>{report.candidateName}</h3>
                <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.9rem' }}>{report.position}</p>
              </div>
              <div style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'center'
              }}>
                {report.totalScore && (
                  <div style={{
                    textAlign: 'center',
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    background: 'rgba(99, 102, 241, 0.1)',
                    border: `3px solid ${getScoreColor(report.totalScore)}`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <div style={{
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      color: getScoreColor(report.totalScore)
                    }}>
                      {report.totalScore}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>score</div>
                  </div>
                )}
                <div style={{
                  background: getRecommendationColor(report.recommendation),
                  color: getScoreColor(report.totalScore),
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  fontWeight: '700',
                  textAlign: 'center'
                }}>
                  {getRecommendationText(report.recommendation)}
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '1rem',
              color: '#94a3b8',
              fontSize: '0.9rem'
            }}>
              {report.interviewDate && (
                <>
                  <p style={{ margin: 0 }}>🗓️ {new Date(report.interviewDate).toLocaleDateString()}</p>
                  <p style={{ margin: 0 }}>⏱️ {report.duration}</p>
                </>
              )}
            </div>

            {report.totalScore && (
              <button style={{
                marginTop: '1rem',
                padding: '0.6rem 1.2rem',
                background: 'rgba(99, 102, 241, 0.2)',
                color: '#6366f1',
                border: '1px solid rgba(99, 102, 241, 0.5)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}>
                View Full Report →
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Report Modal */}
      {selectedReport && (
        <div style={styles.modalOverlay} onClick={() => setSelectedReport(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ margin: 0 }}>{selectedReport.candidateName}</h2>
              <button
                onClick={() => setSelectedReport(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#cbd5e1',
                  fontSize: '2rem',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>

            {/* Summary Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '1rem',
              marginBottom: '2rem',
              paddingBottom: '1.5rem',
              borderBottom: '1px solid rgba(100, 116, 139, 0.3)'
            }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#94a3b8', margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>Overall Score</p>
                <p style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: getScoreColor(selectedReport.totalScore),
                  margin: 0
                }}>
                  {selectedReport.totalScore}%
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#94a3b8', margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>Duration</p>
                <p style={{ fontSize: '1.2rem', fontWeight: '700', margin: 0 }}>{selectedReport.duration}</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#94a3b8', margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>Recommendation</p>
                <p style={{
                  fontSize: '1rem',
                  fontWeight: '700',
                  color: getScoreColor(selectedReport.totalScore),
                  margin: 0
                }}>
                  {getRecommendationText(selectedReport.recommendation)}
                </p>
              </div>
            </div>

            {/* Section Scores */}
            <h3 style={{ marginBottom: '1rem' }}>Section Breakdown</h3>
            <div style={{ marginBottom: '2rem' }}>
              {selectedReport.sections.map((section, idx) => (
                <div key={idx} style={{ marginBottom: '1rem' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{ fontWeight: '600' }}>{section.name}</span>
                    <span style={{ color: getScoreColor(section.score), fontWeight: '700' }}>
                      {section.score}/{section.maxScore}
                    </span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    background: 'rgba(100, 116, 139, 0.3)',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${(section.score / section.maxScore) * 100}%`,
                      height: '100%',
                      background: `linear-gradient(90deg, ${getScoreColor(section.score)}, ${getScoreColor(section.score + 20)})`,
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Questions & Answers */}
            <h3 style={{ marginBottom: '1rem' }}>Q&A Analysis</h3>
            <div style={{ marginBottom: '2rem' }}>
              {selectedReport.questionsAsked.map((item, idx) => (
                <div key={idx} style={{
                  background: 'rgba(30, 41, 59, 0.5)',
                  border: '1px solid rgba(100, 116, 139, 0.3)',
                  borderRadius: '8px',
                  padding: '1rem',
                  marginBottom: '0.75rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <p style={{ margin: 0, fontWeight: '600', color: '#e2e8f0' }}>Q{idx + 1}: {item.q}</p>
                    <span style={{
                      color: getScoreColor(item.score),
                      fontWeight: '700'
                    }}>
                      {item.score}%
                    </span>
                  </div>
                  <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.9rem' }}>A: {item.answer}</p>
                </div>
              ))}
            </div>

            {/* Summary & Recommendation */}
            <h3 style={{ marginBottom: '1rem' }}>Summary</h3>
            <p style={{ color: '#cbd5e1', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              {selectedReport.summary}
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <div>
                <h4 style={{ color: '#10b981', marginBottom: '0.75rem' }}>✓ Strengths</h4>
                <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                  {selectedReport.strengths.map((s, idx) => (
                    <li key={idx} style={{ color: '#cbd5e1', marginBottom: '0.5rem' }}>{s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 style={{ color: '#ef4444', marginBottom: '0.75rem' }}>⚠️ Weaknesses</h4>
                <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                  {selectedReport.weaknesses.map((w, idx) => (
                    <li key={idx} style={{ color: '#cbd5e1', marginBottom: '0.5rem' }}>{w}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '1rem',
              marginTop: '2rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid rgba(100, 116, 139, 0.3)'
            }}>
              <button style={{
                flex: 1,
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}>
                ✓ Download Report
              </button>
              <button style={{
                flex: 1,
                padding: '0.75rem 1.5rem',
                background: 'rgba(99, 102, 241, 0.2)',
                color: '#6366f1',
                border: '1px solid rgba(99, 102, 241, 0.5)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}>
                📧 Share Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
