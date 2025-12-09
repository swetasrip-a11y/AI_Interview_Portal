import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function InterviewerSessions() {
  const navigate = useNavigate();
  const [selectedSession, setSelectedSession] = useState(null);

  const [sessions] = useState([
    {
      id: 1,
      candidateName: 'John Doe',
      position: 'Senior Frontend Developer',
      date: '2024-01-15',
      duration: '45 minutes',
      score: 85,
      status: 'Completed',
      feedback: 'Strong technical knowledge and communication skills',
      skills: ['React', 'JavaScript', 'CSS'],
      questions: [
        { question: 'Explain React hooks', answer: 'Well explained with examples', score: 90 },
        { question: 'How do you handle state management?', answer: 'Mentioned Redux and Context API', score: 85 },
        { question: 'Tell us about a challenging project', answer: 'Good real-world example with problem-solving', score: 80 }
      ]
    },
    {
      id: 2,
      candidateName: 'Sarah Smith',
      position: 'Full Stack Developer',
      date: '2024-01-14',
      duration: '50 minutes',
      score: 78,
      status: 'Completed',
      feedback: 'Good problem-solving skills, needs improvement in communication',
      skills: ['Python', 'Django', 'PostgreSQL'],
      questions: [
        { question: 'Explain database normalization', answer: 'Mostly correct explanation', score: 75 },
        { question: 'How would you design a scalable API?', answer: 'Good approach but could be more detailed', score: 78 },
        { question: 'What is your experience with cloud services?', answer: 'Limited cloud experience', score: 72 }
      ]
    },
    {
      id: 3,
      candidateName: 'Michael Johnson',
      position: 'DevOps Engineer',
      date: '2024-01-13',
      duration: '55 minutes',
      score: 82,
      status: 'Completed',
      feedback: 'Excellent understanding of containerization and CI/CD',
      skills: ['Docker', 'Kubernetes', 'AWS'],
      questions: [
        { question: 'Explain microservices architecture', answer: 'Comprehensive explanation', score: 88 },
        { question: 'How do you handle deployment?', answer: 'Clear understanding of CI/CD pipelines', score: 82 },
        { question: 'Troubleshoot a failing pod in Kubernetes', answer: 'Good debugging approach', score: 78 }
      ]
    },
    {
      id: 4,
      candidateName: 'Emily Brown',
      position: 'Data Scientist',
      date: '2024-01-12',
      duration: '60 minutes',
      score: 88,
      status: 'Completed',
      feedback: 'Excellent analytical and problem-solving skills',
      skills: ['Python', 'Machine Learning', 'TensorFlow'],
      questions: [
        { question: 'Explain model overfitting', answer: 'Clear explanation with solutions', score: 90 },
        { question: 'Walk us through your ML project', answer: 'Well-structured project with good results', score: 88 },
        { question: 'How do you evaluate model performance?', answer: 'Knowledge of metrics and validation', score: 86 }
      ]
    },
    {
      id: 5,
      candidateName: 'David Lee',
      position: 'Security Engineer',
      date: '2024-01-11',
      duration: '50 minutes',
      score: 81,
      status: 'Completed',
      feedback: 'Strong security fundamentals, good practical knowledge',
      skills: ['Network Security', 'Penetration Testing', 'CISSP'],
      questions: [
        { question: 'Explain OWASP Top 10', answer: 'Good understanding of web vulnerabilities', score: 82 },
        { question: 'How would you secure an API?', answer: 'Covered authentication and encryption', score: 81 },
        { question: 'Describe a security incident response', answer: 'Practical approach to handling breaches', score: 80 }
      ]
    }
  ]);

  const [filter, setFilter] = useState('all');

  const filteredSessions = filter === 'all' 
    ? sessions 
    : sessions.filter(s => s.score >= parseInt(filter));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="sessions-container">
      <div className="sessions-header">
        <h1>📊 Interview Sessions</h1>
        <button className="btn-logout" onClick={handleLogout}>Logout</button>
      </div>

      <div className="sessions-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Sessions ({sessions.length})
        </button>
        <button 
          className={`filter-btn ${filter === '80' ? 'active' : ''}`}
          onClick={() => setFilter('80')}
        >
          Top Performers (80+)
        </button>
        <button 
          className={`filter-btn ${filter === '75' ? 'active' : ''}`}
          onClick={() => setFilter('75')}
        >
          Good (75+)
        </button>
      </div>

      <div className="sessions-layout">
        <div className="sessions-list">
          {filteredSessions.map(session => (
            <div
              key={session.id}
              className={`session-card ${selectedSession?.id === session.id ? 'active' : ''}`}
              onClick={() => setSelectedSession(session)}
            >
              <div className="session-header-card">
                <div className="candidate-name">{session.candidateName}</div>
                <div className="score-badge">{session.score}%</div>
              </div>
              <div className="session-info">
                <p className="position">📋 {session.position}</p>
                <p className="date">📅 {new Date(session.date).toLocaleDateString()}</p>
                <p className="duration">⏱️ {session.duration}</p>
              </div>
            </div>
          ))}
        </div>

        {selectedSession && (
          <div className="session-details">
            <div className="details-header">
              <h2>{selectedSession.candidateName}</h2>
              <button className="close-btn" onClick={() => setSelectedSession(null)}>✕</button>
            </div>

            <div className="details-content">
              <div className="score-section">
                <div className="score-display">
                  <span className="score-number">{selectedSession.score}</span>
                  <span className="score-label">/100</span>
                </div>
                <p className={`score-status ${selectedSession.score >= 80 ? 'excellent' : selectedSession.score >= 75 ? 'good' : 'fair'}`}>
                  {selectedSession.score >= 80 ? '✓ Excellent' : selectedSession.score >= 75 ? '~ Good' : '! Fair'}
                </p>
              </div>

              <div className="info-grid">
                <div className="info-item">
                  <label>Position</label>
                  <p>{selectedSession.position}</p>
                </div>
                <div className="info-item">
                  <label>Date</label>
                  <p>{new Date(selectedSession.date).toLocaleDateString()}</p>
                </div>
                <div className="info-item">
                  <label>Duration</label>
                  <p>{selectedSession.duration}</p>
                </div>
                <div className="info-item">
                  <label>Status</label>
                  <p className="status-badge completed">{selectedSession.status}</p>
                </div>
              </div>

              <div className="feedback-section">
                <h3>📝 Feedback</h3>
                <p>{selectedSession.feedback}</p>
              </div>

              <div className="skills-section">
                <h3>🔧 Skills Assessed</h3>
                <div className="skills-chips">
                  {selectedSession.skills.map((skill, idx) => (
                    <span key={idx} className="skill-chip">{skill}</span>
                  ))}
                </div>
              </div>

              <div className="questions-section">
                <h3>❓ Interview Questions & Answers</h3>
                <div className="questions-list">
                  {selectedSession.questions.map((qa, idx) => (
                    <div key={idx} className="qa-item">
                      <div className="qa-header">
                        <p className="question">Q: {qa.question}</p>
                        <span className="qa-score">{qa.score}/100</span>
                      </div>
                      <p className="answer">A: {qa.answer}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="action-buttons">
                <button className="btn-action btn-report">📄 Generate Report</button>
                <button className="btn-action btn-message">💬 Send Feedback</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .sessions-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #050810 0%, #0a0e27 50%, #1a1f35 100%);
          padding: 2rem;
          color: #f8fafc;
        }

        .sessions-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid rgba(100, 116, 139, 0.3);
        }

        .sessions-header h1 {
          margin: 0;
          font-size: 2rem;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .btn-logout {
          padding: 0.6rem 1.2rem;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-logout:hover {
          background: #dc2626;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
        }

        .sessions-filters {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 0.6rem 1.2rem;
          background: rgba(100, 116, 139, 0.2);
          border: 1px solid rgba(100, 116, 139, 0.5);
          color: #cbd5e1;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
        }

        .filter-btn:hover,
        .filter-btn.active {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border-color: #6366f1;
          color: white;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
        }

        .sessions-layout {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .sessions-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          height: fit-content;
          max-height: 70vh;
          overflow-y: auto;
          padding-right: 1rem;
        }

        .session-card {
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid rgba(100, 116, 139, 0.3);
          border-radius: 12px;
          padding: 1.25rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .session-card:hover {
          background: rgba(99, 102, 241, 0.1);
          border-color: rgba(99, 102, 241, 0.5);
          transform: translateX(4px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
        }

        .session-card.active {
          background: rgba(99, 102, 241, 0.2);
          border-color: #6366f1;
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
        }

        .session-header-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .candidate-name {
          font-size: 1.1rem;
          font-weight: 700;
          color: #f8fafc;
        }

        .score-badge {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
          font-weight: 700;
          font-size: 0.85rem;
        }

        .session-info {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .session-info p {
          margin: 0;
          font-size: 0.85rem;
          color: #cbd5e1;
        }

        .session-details {
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(100, 116, 139, 0.3);
          border-radius: 16px;
          padding: 2rem;
          max-height: 70vh;
          overflow-y: auto;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .details-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .details-header h2 {
          margin: 0;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .close-btn {
          background: none;
          border: none;
          color: #cbd5e1;
          font-size: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .close-btn:hover {
          color: #f8fafc;
          background: rgba(99, 102, 241, 0.2);
          border-radius: 8px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .score-section {
          text-align: center;
          padding: 1.5rem;
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.3);
          border-radius: 12px;
          margin-bottom: 1.5rem;
        }

        .score-display {
          display: flex;
          justify-content: center;
          align-items: baseline;
          margin-bottom: 0.75rem;
        }

        .score-number {
          font-size: 2.5rem;
          font-weight: 700;
          color: #6366f1;
        }

        .score-label {
          font-size: 1rem;
          color: #94a3b8;
          margin-left: 0.25rem;
        }

        .score-status {
          margin: 0;
          font-weight: 600;
          font-size: 1rem;
        }

        .score-status.excellent {
          color: #86efac;
        }

        .score-status.good {
          color: #fcd34d;
        }

        .score-status.fair {
          color: #f87171;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .info-item {
          padding: 1rem;
          background: rgba(30, 41, 59, 0.5);
          border-radius: 8px;
          border: 1px solid rgba(100, 116, 139, 0.3);
        }

        .info-item label {
          display: block;
          font-size: 0.75rem;
          color: #94a3b8;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .info-item p {
          margin: 0;
          color: #cbd5e1;
          font-weight: 500;
        }

        .status-badge {
          display: inline-block;
          padding: 0.4rem 0.8rem;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .status-badge.completed {
          background: rgba(34, 197, 94, 0.2);
          color: #86efac;
        }

        .feedback-section,
        .skills-section,
        .questions-section {
          margin-bottom: 1.5rem;
        }

        .feedback-section h3,
        .skills-section h3,
        .questions-section h3 {
          margin: 0 0 1rem 0;
          color: #cbd5e1;
          font-size: 1.1rem;
        }

        .feedback-section p {
          margin: 0;
          color: #cbd5e1;
          line-height: 1.6;
          padding: 1rem;
          background: rgba(30, 41, 59, 0.5);
          border-radius: 8px;
          border-left: 3px solid #6366f1;
        }

        .skills-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .skill-chip {
          display: inline-block;
          padding: 0.5rem 1rem;
          background: rgba(99, 102, 241, 0.2);
          color: #6366f1;
          border: 1px solid rgba(99, 102, 241, 0.5);
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .questions-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .qa-item {
          padding: 1rem;
          background: rgba(30, 41, 59, 0.5);
          border-radius: 8px;
          border: 1px solid rgba(100, 116, 139, 0.3);
        }

        .qa-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 0.75rem;
        }

        .question {
          margin: 0;
          color: #cbd5e1;
          font-weight: 600;
          flex: 1;
        }

        .qa-score {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          padding: 0.3rem 0.7rem;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 700;
          white-space: nowrap;
          margin-left: 0.5rem;
        }

        .answer {
          margin: 0;
          color: #a1a5b8;
          font-size: 0.95rem;
          line-height: 1.5;
          padding-top: 0.5rem;
          border-top: 1px solid rgba(100, 116, 139, 0.2);
          padding-top: 0.75rem;
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(100, 116, 139, 0.3);
        }

        .btn-action {
          flex: 1;
          padding: 0.75rem 1rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-report {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
        }

        .btn-report:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
        }

        .btn-message {
          background: rgba(99, 102, 241, 0.2);
          color: #6366f1;
          border: 1px solid rgba(99, 102, 241, 0.5);
        }

        .btn-message:hover {
          background: rgba(99, 102, 241, 0.3);
          border-color: #6366f1;
        }

        @media (max-width: 1024px) {
          .sessions-layout {
            grid-template-columns: 1fr;
          }

          .sessions-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            max-height: none;
          }
        }
      `}</style>
    </div>
  );
}
