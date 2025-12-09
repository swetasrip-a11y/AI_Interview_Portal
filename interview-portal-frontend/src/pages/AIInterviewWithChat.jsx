import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AIInterviewWithChat() {
  const navigate = useNavigate();
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [recordingAnswer, setRecordingAnswer] = useState('');
  const [showVideoPanel, setShowVideoPanel] = useState(false);
  const [score, setScore] = useState(null);
  const messagesEndRef = useRef(null);

  const candidates = [
    {
      id: 1,
      name: 'John Doe',
      position: 'Senior Frontend Developer',
      resume: { skills: ['React', 'JavaScript', 'CSS', 'Node.js'] }
    },
    {
      id: 2,
      name: 'Sarah Smith',
      position: 'Full Stack Developer',
      resume: { skills: ['Python', 'Django', 'PostgreSQL', 'Docker'] }
    },
    {
      id: 3,
      name: 'Michael Johnson',
      position: 'DevOps Engineer',
      resume: { skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'] }
    }
  ];

  const interviewQuestions = [
    'Tell us about your professional background and experience',
    'What are your key technical skills and proficiencies?',
    'Describe a challenging project you worked on and how you solved it',
    'How do you approach problem-solving in your work?',
    'What are your career goals for the next 5 years?',
    'Describe your experience with team collaboration and leadership',
    'How do you stay updated with the latest technologies?',
    'Can you explain a complex technical concept you recently learned?',
    'What motivates you in your work and career?',
    'Describe a time when you faced a conflict in the team and how you resolved it',
    'How do you handle tight deadlines and pressure?',
    'What is your approach to code quality and testing?',
    'Describe your experience with agile and scrum methodologies',
    'How do you approach debugging and fixing bugs?',
    'What are your strengths and weaknesses as a professional?',
    'Describe your experience with version control systems',
    'How do you document your code and communicate with team members?',
    'What is your experience with database design and optimization?',
    'Can you describe your approach to system design and architecture?',
    'How do you handle constructive feedback and criticism?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startInterview = (candidate) => {
    setSelectedCandidate(candidate);
    setMessages([
      {
        id: 1,
        type: 'ai',
        text: `Hello ${candidate.name}! Welcome to your AI interview for the ${candidate.position} position. I'll be asking you 5 questions today. Let's start!`,
        timestamp: new Date()
      },
      {
        id: 2,
        type: 'ai',
        text: interviewQuestions[0],
        timestamp: new Date(),
        isQuestion: true
      }
    ]);
  };

  const handleSendAnswer = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add candidate's answer
    const answerMsg = {
      id: messages.length + 1,
      type: 'candidate',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, answerMsg]);
    setRecordingAnswer('');

    // Simulate AI response after 1 second
    setTimeout(() => {
      const nextQuestionIndex = Math.floor(messages.length / 2) % interviewQuestions.length;
      const nextQuestion = interviewQuestions[nextQuestionIndex];

      const aiMsg = {
        id: messages.length + 2,
        type: 'ai',
        text: nextQuestion,
        timestamp: new Date(),
        isQuestion: true
      };

      setMessages(prev => [...prev, aiMsg]);
    }, 1000);

    setInputValue('');
  };

  const handleVoiceInput = () => {
    // Simulate voice input
    setRecordingAnswer('This is a simulated voice input from the candidate...');
    alert('Voice recording feature will be integrated with Web Speech API');
  };

  const completeInterview = () => {
    const finalScore = Math.round(Math.random() * 40 + 60);
    setScore(finalScore);
    alert(`Interview completed! Score: ${finalScore}/100`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>🎤 AI Interview with Chat</h1>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>

      <div style={styles.mainLayout}>
        {/* Candidates Panel */}
        {!selectedCandidate ? (
          <div style={styles.candidatesPanel}>
            <h2>Select a Candidate</h2>
            <div style={styles.candidatesList}>
              {candidates.map(candidate => (
                <div
                  key={candidate.id}
                  style={styles.candidateCard}
                  onClick={() => startInterview(candidate)}
                >
                  <div style={styles.candidateAvatar}>👤</div>
                  <div style={styles.candidateInfo}>
                    <h3>{candidate.name}</h3>
                    <p>{candidate.position}</p>
                    <p style={styles.skillsText}>
                      Skills: {candidate.resume.skills.join(', ')}
                    </p>
                  </div>
                  <div style={styles.startBtn}>➤</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={styles.interviewPanel}>
            {/* Chat Area */}
            <div style={styles.chatArea}>
              <div style={styles.chatHeader}>
                <div>
                  <h3>{selectedCandidate.name}</h3>
                  <p>{selectedCandidate.position}</p>
                </div>
              </div>

              <div style={styles.messagesContainer}>
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    style={{
                      ...styles.message,
                      ...(msg.type === 'candidate' ? styles.candidateMessage : styles.aiMessage),
                      ...( msg.isQuestion ? {borderLeft: '3px solid #f97316'} : {})
                    }}
                  >
                    <div style={styles.messageAvatar}>
                      {msg.type === 'candidate' ? '👤' : '🤖'}
                    </div>
                    <div style={styles.messageContent}>
                      {msg.isQuestion && <span style={styles.questionLabel}>Question:</span>}
                      <p>{msg.text}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div style={styles.inputArea}>
                <form onSubmit={handleSendAnswer} style={styles.inputForm}>
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your answer here..."
                    style={styles.textarea}
                    rows="4"
                  />
                  <div style={styles.inputButtons}>
                    <button type="submit" style={styles.submitBtn}>
                      ✓ Send Answer
                    </button>
                    <button
                      type="button"
                      onClick={handleVoiceInput}
                      style={styles.voiceBtn}
                    >
                      🎙️ Voice Input
                    </button>
                  </div>
                </form>

                {recordingAnswer && (
                  <div style={styles.recordingPreview}>
                    <p style={styles.recordingLabel}>Recorded:</p>
                    <p>{recordingAnswer}</p>
                    <button
                      onClick={() => setInputValue(recordingAnswer)}
                      style={styles.useRecordingBtn}
                    >
                      Use Recording
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Info Panel */}
            <div style={styles.infoPanel}>
              <div style={styles.infoPanelSection}>
                <h4>📋 Candidate Info</h4>
                <div style={styles.infoItem}>
                  <span>Name:</span>
                  <p>{selectedCandidate.name}</p>
                </div>
                <div style={styles.infoItem}>
                  <span>Position:</span>
                  <p>{selectedCandidate.position}</p>
                </div>
                <div style={styles.infoItem}>
                  <span>Skills:</span>
                  <div style={styles.skillsContainer}>
                    {selectedCandidate.resume.skills.map((skill, idx) => (
                      <span key={idx} style={styles.skillTag}>{skill}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div style={styles.infoPanelSection}>
                <h4>⏱️ Interview Progress</h4>
                <p style={styles.progressText}>
                  Question: {Math.floor(messages.length / 2) + 1} / 5
                </p>
                <div style={styles.progressBar}>
                  <div
                    style={{
                      ...styles.progressFill,
                      width: `${((Math.floor(messages.length / 2) + 1) / 5) * 100}%`
                    }}
                  ></div>
                </div>
              </div>

              <div style={styles.infoPanelSection}>
                <h4>🎯 Tools</h4>
                <button
                  onClick={() => setShowVideoPanel(!showVideoPanel)}
                  style={styles.toolBtn}
                >
                  📹 {showVideoPanel ? 'Hide Video' : 'Show Video'}
                </button>
                {Math.floor(messages.length / 2) >= 5 && (
                  <button
                    onClick={completeInterview}
                    style={styles.completeBtn}
                  >
                    ✓ Complete Interview
                  </button>
                )}
              </div>

              {score !== null && (
                <div style={styles.scoreCard}>
                  <h4>✓ Interview Completed!</h4>
                  <div style={styles.scoreDisplay}>
                    <span style={styles.scoreNumber}>{score}</span>
                    <span style={styles.scoreLabel}>/100</span>
                  </div>
                  <p style={styles.scoreText}>
                    {score >= 80 ? '✓ Excellent' : score >= 70 ? '~ Good' : '! Fair'}
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCandidate(null);
                      setMessages([]);
                      setScore(null);
                    }}
                    style={styles.newInterviewBtn}
                  >
                    Start New Interview
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Video Panel */}
        {showVideoPanel && selectedCandidate && (
          <div style={styles.videoPanel}>
            <h4>📹 Video Feed</h4>
            <div style={styles.videoPlaceholder}>
              <p>Video conferencing will be integrated with:</p>
              <ul style={styles.videoList}>
                <li>Jitsi Meet (Open source)</li>
                <li>Google Meet API</li>
                <li>Zoom SDK</li>
              </ul>
              <p style={styles.placeholder}>Video feed would appear here</p>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => navigate('/ai-interviewer-dashboard')}
        style={styles.backBtn}
      >
        ← Back to Dashboard
      </button>
    </div>
  );
}

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
  logoutBtn: {
    padding: '0.6rem 1.2rem',
    background: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  },
  mainLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr 300px',
    gap: '1.5rem',
    marginBottom: '2rem',
    maxWidth: '1400px',
    margin: '0 auto 2rem'
  },
  candidatesPanel: {
    gridColumn: '1 / -1',
    background: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(100, 116, 139, 0.3)',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
  },
  candidatesList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '1.5rem',
    marginTop: '1rem'
  },
  candidateCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.5rem',
    background: 'rgba(99, 102, 241, 0.1)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  candidateAvatar: {
    fontSize: '2.5rem',
    width: '60px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(99, 102, 241, 0.2)',
    borderRadius: '12px',
    flexShrink: 0
  },
  candidateInfo: {
    flex: 1
  },
  skillsText: {
    marginTop: '0.5rem',
    fontSize: '0.85rem',
    color: '#cbd5e1'
  },
  startBtn: {
    fontSize: '1.5rem',
    color: '#6366f1'
  },
  interviewPanel: {
    display: 'grid',
    gridTemplateColumns: '1fr 280px',
    gap: '1.5rem'
  },
  chatArea: {
    background: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(100, 116, 139, 0.3)',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    height: '600px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    overflow: 'hidden'
  },
  chatHeader: {
    padding: '1rem',
    borderBottom: '1px solid rgba(100, 116, 139, 0.3)',
    background: 'rgba(20, 29, 48, 0.5)'
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  message: {
    display: 'flex',
    gap: '0.75rem',
    animation: 'slideIn 0.3s ease'
  },
  candidateMessage: {
    justifyContent: 'flex-end'
  },
  aiMessage: {
    justifyContent: 'flex-start'
  },
  messageAvatar: {
    fontSize: '1.5rem',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    background: 'rgba(99, 102, 241, 0.2)',
    flexShrink: 0
  },
  messageContent: {
    padding: '0.75rem 1rem',
    background: 'rgba(99, 102, 241, 0.15)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    borderRadius: '12px',
    lineHeight: '1.5',
    maxWidth: '70%'
  },
  questionLabel: {
    display: 'block',
    fontSize: '0.75rem',
    color: '#f97316',
    fontWeight: '700',
    marginBottom: '0.25rem'
  },
  inputArea: {
    padding: '1rem',
    borderTop: '1px solid rgba(100, 116, 139, 0.3)',
    background: 'rgba(20, 29, 48, 0.5)'
  },
  inputForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  textarea: {
    padding: '0.75rem 1rem',
    background: 'rgba(30, 41, 59, 0.5)',
    border: '1px solid rgba(100, 116, 139, 0.3)',
    borderRadius: '8px',
    color: '#f8fafc',
    fontFamily: 'inherit',
    fontSize: '0.95rem',
    resize: 'vertical',
    minHeight: '80px'
  },
  inputButtons: {
    display: 'flex',
    gap: '0.75rem'
  },
  submitBtn: {
    flex: 1,
    padding: '0.6rem 1rem',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  voiceBtn: {
    padding: '0.6rem 1rem',
    background: 'rgba(139, 92, 246, 0.2)',
    color: '#8b5cf6',
    border: '1px solid rgba(139, 92, 246, 0.5)',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  recordingPreview: {
    padding: '0.75rem',
    background: 'rgba(34, 197, 94, 0.1)',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    borderRadius: '8px'
  },
  recordingLabel: {
    margin: '0 0 0.5rem 0',
    fontSize: '0.85rem',
    color: '#10b981',
    fontWeight: '600'
  },
  useRecordingBtn: {
    marginTop: '0.5rem',
    padding: '0.4rem 0.8rem',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600'
  },
  infoPanel: {
    background: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(100, 116, 139, 0.3)',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    height: 'fit-content',
    maxHeight: '600px',
    overflowY: 'auto'
  },
  infoPanelSection: {
    paddingBottom: '1rem',
    borderBottom: '1px solid rgba(100, 116, 139, 0.3)'
  },
  infoItem: {
    marginBottom: '0.75rem'
  },
  skillsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginTop: '0.5rem'
  },
  skillTag: {
    display: 'inline-block',
    padding: '0.4rem 0.8rem',
    background: 'rgba(99, 102, 241, 0.2)',
    color: '#6366f1',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: '600'
  },
  progressText: {
    margin: '0 0 0.5rem 0',
    color: '#cbd5e1'
  },
  progressBar: {
    width: '100%',
    height: '8px',
    background: 'rgba(100, 116, 139, 0.3)',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
    transition: 'width 0.3s ease'
  },
  toolBtn: {
    width: '100%',
    padding: '0.6rem 1rem',
    background: 'rgba(99, 102, 241, 0.2)',
    color: '#6366f1',
    border: '1px solid rgba(99, 102, 241, 0.5)',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    marginBottom: '0.5rem',
    transition: 'all 0.3s ease'
  },
  completeBtn: {
    width: '100%',
    padding: '0.6rem 1rem',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  },
  scoreCard: {
    padding: '1rem',
    background: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    borderRadius: '12px',
    textAlign: 'center'
  },
  scoreDisplay: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    gap: '0.25rem',
    margin: '1rem 0'
  },
  scoreNumber: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#10b981'
  },
  scoreLabel: {
    fontSize: '1rem',
    color: '#94a3b8'
  },
  scoreText: {
    margin: '0.5rem 0',
    color: '#cbd5e1',
    fontWeight: '600'
  },
  newInterviewBtn: {
    width: '100%',
    padding: '0.6rem 1rem',
    background: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    marginTop: '0.75rem',
    transition: 'all 0.3s ease'
  },
  videoPanel: {
    background: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(100, 116, 139, 0.3)',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    gridColumn: '1 / 3'
  },
  videoPlaceholder: {
    marginTop: '1rem',
    padding: '2rem',
    background: 'rgba(30, 41, 59, 0.5)',
    border: '1px dashed rgba(100, 116, 139, 0.5)',
    borderRadius: '8px',
    textAlign: 'center'
  },
  videoList: {
    listStyle: 'none',
    padding: '0.5rem 0',
    margin: '0.5rem 0'
  },
  placeholder: {
    color: '#94a3b8',
    margin: '1rem 0 0 0'
  },
  backBtn: {
    padding: '0.75rem 1.5rem',
    background: 'rgba(100, 116, 139, 0.2)',
    color: '#cbd5e1',
    border: '1px solid rgba(100, 116, 139, 0.5)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
    display: 'block',
    margin: '0 auto',
    transition: 'all 0.3s ease'
  }
};
