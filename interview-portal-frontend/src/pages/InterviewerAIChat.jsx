import React, { useState, useEffect, useRef } from 'react';
import '../styles/ai-chat.css';

export default function InterviewerAIChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: 'Hello! I\'m your AI Interview Assistant. I\'ve analyzed the candidate\'s resume. Feel free to ask me anything about their qualifications, or I can help guide the interview.',
      timestamp: new Date()
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const messagesEndRef = useRef(null);
  const token = localStorage.getItem('token');

  // Mock candidate data
  const [candidates] = useState([
    {
      id: 1,
      name: 'John Doe',
      position: 'Senior Frontend Developer',
      email: 'john@example.com',
      resume: {
        skills: ['React', 'JavaScript', 'CSS', 'Node.js'],
        companies: ['Tech Corp', 'StartUp Inc'],
        projects: ['E-commerce Platform', 'SaaS Dashboard'],
        yearsOfExperience: 5
      }
    },
    {
      id: 2,
      name: 'Sarah Smith',
      position: 'Full Stack Developer',
      email: 'sarah@example.com',
      resume: {
        skills: ['Python', 'Django', 'PostgreSQL', 'Docker'],
        companies: ['Web Solutions', 'Cloud Services'],
        projects: ['Analytics Platform', 'API Gateway'],
        yearsOfExperience: 4
      }
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim() || !selectedCandidate) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputValue,
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Simulate API call to AI Chat endpoint
      // In real app: POST /api/aiChat/chat
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            response: generateAIResponse(inputValue, selectedCandidate.resume)
          });
        }, 800);
      });

      const aiMessage = {
        id: messages.length + 2,
        type: 'ai',
        text: response.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeCandidate = async () => {
    if (!selectedCandidate) return;

    setIsLoading(true);
    try {
      // Simulate API call to analysis endpoint
      // In real app: POST /api/aiChat/analyze
      const mockAnalysis = {
        score: Math.round(Math.random() * 35 + 65),
        technicalSkills: {
          items: selectedCandidate.resume.skills.map(skill => ({
            name: skill,
            score: Math.round(Math.random() * 30 + 70)
          })),
          average: Math.round(Math.random() * 30 + 70)
        },
        softSkills: {
          items: [
            { name: 'Communication', score: Math.round(Math.random() * 25 + 75) },
            { name: 'Problem-Solving', score: Math.round(Math.random() * 25 + 75) },
            { name: 'Teamwork', score: Math.round(Math.random() * 25 + 70) },
            { name: 'Leadership', score: Math.round(Math.random() * 25 + 65) }
          ],
          average: Math.round(Math.random() * 25 + 72)
        },
        strengths: [
          `Strong background in ${selectedCandidate.resume.skills[0]}`,
          'Demonstrated project portfolio',
          'Good communication skills',
          'Problem-solving mindset'
        ],
        weaknesses: [
          'Could expand knowledge in emerging tech',
          'Limited leadership experience',
          'Opportunity for more system design practice'
        ],
        recommendations: [
          'Focus on system design preparation',
          'Deepen knowledge in cloud technologies',
          'Lead more cross-functional projects'
        ]
      };

      setAnalysis(mockAnalysis);
      setShowAnalysis(true);
    } catch (error) {
      console.error('Error analyzing candidate:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!selectedCandidate || !analysis) return;

    setIsLoading(true);
    try {
      // Simulate API call to report endpoint
      // In real app: POST /api/aiChat/report
      const report = {
        candidateId: selectedCandidate.id,
        interviewDate: new Date().toISOString().split('T')[0],
        overallScore: analysis.score,
        technicalScore: analysis.technicalSkills.average,
        softSkillsScore: analysis.softSkills.average,
        recommendation: analysis.score >= 70 ? 'RECOMMENDED' : analysis.score >= 50 ? 'MAYBE' : 'NOT RECOMMENDED',
        summary: `${selectedCandidate.name} demonstrates ${analysis.score >= 70 ? 'strong' : 'adequate'} qualifications for the ${selectedCandidate.position} role.`,
        details: analysis
      };

      // Simulate report generation
      alert(`Report generated!\n\nCandidate: ${selectedCandidate.name}\nScore: ${analysis.score}/100\nRecommendation: ${report.recommendation}`);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  function generateAIResponse(question, resume) {
    const q = question.toLowerCase();
    
    if (q.includes('experience') || q.includes('background')) {
      return `Based on ${selectedCandidate.name}'s resume, they have ${resume.yearsOfExperience} years of experience. They've worked at ${resume.companies.join(' and ')}. Their expertise includes ${resume.skills.slice(0, 2).join(' and ')}. This is a solid background for the role.`;
    }
    
    if (q.includes('skills') || q.includes('technical')) {
      return `Their technical skills include: ${resume.skills.join(', ')}. They seem particularly strong with ${resume.skills[0]} and have demonstrated this through their projects like ${resume.projects[0]}.`;
    }

    if (q.includes('project') || q.includes('work')) {
      return `Notable projects include: ${resume.projects.join(' and ')}. These showcase practical experience and diverse technical capabilities. I'd recommend asking them to dive deeper into their role in these projects.`;
    }

    if (q.includes('strength') || q.includes('best at')) {
      return `Based on their resume, key strengths appear to be:\n1. Technical expertise in ${resume.skills[0]}\n2. Multi-company experience showing adaptability\n3. Diverse project portfolio\n4. ${resume.yearsOfExperience} years of proven experience`;
    }

    if (q.includes('weakness') || q.includes('improve')) {
      return `Areas that might need exploration:\n1. Leadership and mentoring experience\n2. System design and architecture knowledge\n3. Experience with emerging technologies\n4. Public speaking or presentation skills`;
    }

    if (q.includes('team') || q.includes('collaboration')) {
      return `Good question for the interview! You might ask about their experience working in cross-functional teams. Given their multi-company background, they should have collaborated with various teams. This would be a great opportunity to assess their communication skills.`;
    }

    if (q.includes('hire') || q.includes('recommend')) {
      return `I'd need to analyze their interview responses, but based on their resume alone, they appear to be a qualified candidate. They have the technical skills and experience for the role. The interview should focus on soft skills, problem-solving, and cultural fit.`;
    }

    return `That's a great question about ${selectedCandidate.name}. Based on their profile, I'd suggest exploring ${resume.skills[0]} expertise and their experience at ${resume.companies[0]}. Feel free to dive deeper into any specific area you're interested in.`;
  }

  return (
    <div className="ai-chat-container">
      <div className="ai-chat-wrapper">
        {/* Sidebar - Candidate Selection */}
        <div className="ai-chat-sidebar">
          <div className="sidebar-header">
            <h2>📋 Candidates</h2>
          </div>

          <div className="candidates-list">
            {candidates.map(candidate => (
              <div
                key={candidate.id}
                className={`candidate-card ${selectedCandidate?.id === candidate.id ? 'active' : ''}`}
                onClick={() => setSelectedCandidate(candidate)}
              >
                <div className="candidate-avatar">👤</div>
                <div className="candidate-info">
                  <h4>{candidate.name}</h4>
                  <p>{candidate.position}</p>
                </div>
              </div>
            ))}
          </div>

          {selectedCandidate && (
            <div className="candidate-details">
              <h3>Resume</h3>
              <div className="details-section">
                <label>Skills:</label>
                <p>{selectedCandidate.resume.skills.join(', ')}</p>
              </div>
              <div className="details-section">
                <label>Companies:</label>
                <p>{selectedCandidate.resume.companies.join(', ')}</p>
              </div>
              <div className="details-section">
                <label>Experience:</label>
                <p>{selectedCandidate.resume.yearsOfExperience} years</p>
              </div>
            </div>
          )}
        </div>

        {/* Main Chat Area */}
        <div className="ai-chat-main">
          {!selectedCandidate ? (
            <div className="ai-chat-empty">
              <div className="empty-icon">🤖</div>
              <h2>AI Interview Assistant</h2>
              <p>Select a candidate to start an AI-assisted interview.</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="ai-chat-header">
                <h2>💬 Chat with {selectedCandidate.name}</h2>
                <div className="header-actions">
                  <button 
                    className="btn-analyze"
                    onClick={handleAnalyzeCandidate}
                    disabled={isLoading}
                  >
                    📊 Analyze
                  </button>
                  <button 
                    className="btn-report"
                    onClick={handleGenerateReport}
                    disabled={!analysis || isLoading}
                  >
                    📄 Report
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="ai-chat-messages">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`message ${msg.type === 'user' ? 'user-message' : 'ai-message'}`}
                  >
                    <div className="message-avatar">
                      {msg.type === 'user' ? '👤' : '🤖'}
                    </div>
                    <div className="message-content">
                      <p>{msg.text}</p>
                      <span className="message-time">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="message ai-message loading">
                    <div className="message-avatar">🤖</div>
                    <div className="message-content">
                      <div className="typing-indicator">
                        <span></span><span></span><span></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form className="ai-chat-input" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about the candidate's skills, experience, or get interview suggestions..."
                  disabled={isLoading}
                />
                <button type="submit" disabled={isLoading || !inputValue.trim()}>
                  ➤
                </button>
              </form>
            </>
          )}
        </div>

        {/* Right Panel - Analysis */}
        {showAnalysis && analysis && (
          <div className="ai-analysis-panel">
            <div className="analysis-header">
              <h3>📊 Analysis</h3>
              <button 
                className="close-btn"
                onClick={() => setShowAnalysis(false)}
              >
                ✕
              </button>
            </div>

            <div className="analysis-score">
              <div className="score-circle">
                <span className="score-number">{analysis.score}</span>
                <span className="score-label">/100</span>
              </div>
              <p className={`score-text ${analysis.score >= 70 ? 'good' : analysis.score >= 50 ? 'fair' : 'poor'}`}>
                {analysis.score >= 70 ? '✓ Strong' : analysis.score >= 50 ? '~ Fair' : '✗ Needs Work'}
              </p>
            </div>

            {/* Technical Skills */}
            <div className="analysis-section">
              <h4>🔧 Technical Skills</h4>
              <div className="skills-list">
                {analysis.technicalSkills.items.map((skill, idx) => (
                  <div key={idx} className="skill-item">
                    <span className="skill-name">{skill.name}</span>
                    <div className="skill-bar">
                      <div 
                        className="skill-fill"
                        style={{ width: `${skill.score}%` }}
                      ></div>
                    </div>
                    <span className="skill-score">{skill.score}%</span>
                  </div>
                ))}
              </div>
              <p className="section-avg">Avg: {analysis.technicalSkills.average}%</p>
            </div>

            {/* Soft Skills */}
            <div className="analysis-section">
              <h4>💬 Soft Skills</h4>
              <div className="skills-list">
                {analysis.softSkills.items.map((skill, idx) => (
                  <div key={idx} className="skill-item">
                    <span className="skill-name">{skill.name}</span>
                    <div className="skill-bar">
                      <div 
                        className="skill-fill soft"
                        style={{ width: `${skill.score}%` }}
                      ></div>
                    </div>
                    <span className="skill-score">{skill.score}%</span>
                  </div>
                ))}
              </div>
              <p className="section-avg">Avg: {analysis.softSkills.average}%</p>
            </div>

            {/* Strengths */}
            <div className="analysis-section">
              <h4>✓ Strengths</h4>
              <ul className="analysis-list">
                {analysis.strengths.map((strength, idx) => (
                  <li key={idx}>
                    <span className="bullet">✓</span>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="analysis-section">
              <h4>! Weaknesses</h4>
              <ul className="analysis-list">
                {analysis.weaknesses.map((weakness, idx) => (
                  <li key={idx}>
                    <span className="bullet">!</span>
                    {weakness}
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="analysis-section">
              <h4>💡 Recommendations</h4>
              <ul className="analysis-list">
                {analysis.recommendations.map((rec, idx) => (
                  <li key={idx}>
                    <span className="bullet">→</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
