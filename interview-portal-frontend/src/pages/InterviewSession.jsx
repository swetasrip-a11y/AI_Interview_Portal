import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function InterviewSession() {
  const { interviewId } = useParams();
  const navigate = useNavigate();

  // State management
  const [interview, setInterview] = useState(null);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(2700); // 45 minutes default
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    technical_score: 0,
    soft_skills_score: 0,
    communication: 0,
    problem_solving: 0,
    teamwork: 0,
    leadership: 0
  });
  const [feedback, setFeedback] = useState('');
  const [finalReport, setFinalReport] = useState(null);

  // Refs
  const timerIntervalRef = useRef(null);
  const audioRecorderRef = useRef(null);

  // Fetch interview details
  useEffect(() => {
    fetchInterviewDetails();
  }, [interviewId]);

  const fetchInterviewDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/interview-manager/${interviewId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setInterview(response.data.data);
      setTotalQuestions(response.data.data.num_questions || 5);
      setDurationMinutes(response.data.data.duration || 45);
      setTimeRemaining((response.data.data.duration || 45) * 60);

      // Generate mock questions
      generateQuestions(response.data.data.num_questions || 5);
    } catch (error) {
      console.error('Error fetching interview:', error);
      alert('Failed to load interview details');
    }
  };

  const generateQuestions = (count) => {
    const mockQuestions = [
      {
        id: 1,
        text: 'Tell me about your most challenging project. How did you overcome the obstacles?',
        type: 'open-ended',
        category: 'behavioral'
      },
      {
        id: 2,
        text: 'Describe your problem-solving approach when faced with a complex technical issue.',
        type: 'open-ended',
        category: 'technical'
      },
      {
        id: 3,
        text: 'How do you handle disagreements within your team?',
        type: 'open-ended',
        category: 'soft-skills'
      },
      {
        id: 4,
        text: 'What are your strengths and areas for improvement?',
        type: 'open-ended',
        category: 'self-assessment'
      },
      {
        id: 5,
        text: 'Why are you interested in this role and company?',
        type: 'open-ended',
        category: 'motivation'
      }
    ];

    setQuestions(mockQuestions.slice(0, count));
  };

  // Timer effect
  useEffect(() => {
    if (sessionStarted && !sessionCompleted) {
      timerIntervalRef.current = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
        setTimeRemaining(prev => {
          if (prev <= 1) {
            completeInterview();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timerIntervalRef.current);
    }
  }, [sessionStarted, sessionCompleted]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const startInterview = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/interview-manager/${interviewId}/start`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSessionStarted(true);
      setTimeElapsed(0);
    } catch (error) {
      console.error('Error starting interview:', error);
      alert('Failed to start interview');
    }
  };

  const recordAnswer = () => {
    if (!currentAnswer.trim()) {
      alert('Please provide an answer before moving to the next question');
      return;
    }

    setAnswers({
      ...answers,
      [currentQuestion]: currentAnswer
    });

    // Calculate score based on answer length and keywords
    const answerScore = calculateAnswerScore(currentAnswer);
    setScore(prev => prev + answerScore);

    // Update performance metrics
    updateMetrics(currentQuestion, answerScore);

    // Move to next question
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
      setCurrentAnswer('');
    } else {
      completeInterview();
    }
  };

  const calculateAnswerScore = (answer) => {
    // Simple scoring based on answer length and keywords
    let score = 0;

    if (answer.length > 100) score += 15;
    else if (answer.length > 50) score += 10;
    else if (answer.length > 20) score += 5;

    // Bonus points for specific keywords
    const keywords = ['achieved', 'solved', 'improved', 'led', 'implemented', 'developed', 'managed', 'designed'];
    keywords.forEach(keyword => {
      if (answer.toLowerCase().includes(keyword)) score += 3;
    });

    return Math.min(score, 20); // Max 20 points per answer
  };

  const updateMetrics = (questionNum, answerScore) => {
    setPerformanceMetrics(prev => ({
      ...prev,
      technical_score: questionNum % 2 === 0 ? prev.technical_score + answerScore * 0.8 : prev.technical_score,
      soft_skills_score: questionNum % 3 === 0 ? prev.soft_skills_score + answerScore * 0.9 : prev.soft_skills_score,
      communication: prev.communication + (answerScore / totalQuestions),
      problem_solving: questionNum === 2 ? prev.problem_solving + answerScore : prev.problem_solving,
      teamwork: questionNum === 3 ? prev.teamwork + answerScore : prev.teamwork,
      leadership: questionNum === 4 ? prev.leadership + answerScore : prev.leadership
    }));
  };

  const completeInterview = async () => {
    setSessionCompleted(true);
    clearInterval(timerIntervalRef.current);

    const finalScore = Math.min(Math.round((score / (totalQuestions * 20)) * 100), 100);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/api/interview-manager/${interviewId}/generate-report`,
        {
          candidateId: localStorage.getItem('user_id'),
          final_score: finalScore,
          performance_metrics: performanceMetrics,
          feedback: feedback,
          time_taken: timeElapsed
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFinalReport(response.data.data);
    } catch (error) {
      console.error('Error completing interview:', error);
    }
  };

  if (!interview && !sessionCompleted) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p>Loading interview...</p>
        </div>
      </div>
    );
  }

  if (!sessionStarted && !sessionCompleted) {
    return (
      <div style={styles.container}>
        <div style={styles.previewCard}>
          <h1>📋 Interview Preview</h1>
          <div style={styles.previewContent}>
            <div style={styles.previewItem}>
              <span style={styles.label}>Interview:</span>
              <span>{interview?.title}</span>
            </div>
            <div style={styles.previewItem}>
              <span style={styles.label}>Position:</span>
              <span>{interview?.job_title}</span>
            </div>
            <div style={styles.previewItem}>
              <span style={styles.label}>Duration:</span>
              <span>{durationMinutes} minutes</span>
            </div>
            <div style={styles.previewItem}>
              <span style={styles.label}>Questions:</span>
              <span>{totalQuestions}</span>
            </div>
            <div style={styles.previewItem}>
              <span style={styles.label}>Type:</span>
              <span>{interview?.interview_type || 'AI-Assisted'}</span>
            </div>
          </div>

          <div style={styles.instructions}>
            <h3>📝 Instructions:</h3>
            <ul>
              <li>You have {durationMinutes} minutes to complete the interview</li>
              <li>Answer all {totalQuestions} questions thoughtfully</li>
              <li>Your answers will be recorded and evaluated</li>
              <li>You can review your answers before submitting</li>
              <li>Once submitted, you cannot go back</li>
            </ul>
          </div>

          <button style={styles.startBtn} onClick={startInterview}>
            ▶️ Start Interview
          </button>
        </div>
      </div>
    );
  }

  if (sessionCompleted && finalReport) {
    return (
      <div style={styles.container}>
        <div style={styles.reportCard}>
          <h1>✅ Interview Completed</h1>
          
          <div style={styles.scoreCircle}>
            <div style={styles.scoreValue}>{finalReport.final_score}</div>
            <div style={styles.scoreLabel}>Score</div>
          </div>

          <div style={styles.metricsGrid}>
            <div style={styles.metricItem}>
              <span style={styles.metricLabel}>Technical</span>
              <span style={styles.metricValue}>{Math.round(performanceMetrics.technical_score || 0)}</span>
            </div>
            <div style={styles.metricItem}>
              <span style={styles.metricLabel}>Soft Skills</span>
              <span style={styles.metricValue}>{Math.round(performanceMetrics.soft_skills_score || 0)}</span>
            </div>
            <div style={styles.metricItem}>
              <span style={styles.metricLabel}>Communication</span>
              <span style={styles.metricValue}>{Math.round(performanceMetrics.communication || 0)}</span>
            </div>
            <div style={styles.metricItem}>
              <span style={styles.metricLabel}>Problem Solving</span>
              <span style={styles.metricValue}>{Math.round(performanceMetrics.problem_solving || 0)}</span>
            </div>
          </div>

          <div style={styles.recommendationsBox}>
            <h3>📊 Recommendations:</h3>
            <ul>
              {finalReport.recommendations && finalReport.recommendations.map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))}
            </ul>
          </div>

          <div style={styles.statsBox}>
            <p><strong>Time Taken:</strong> {formatTime(timeElapsed)}</p>
            <p><strong>Questions Answered:</strong> {totalQuestions}/{totalQuestions}</p>
            <p><strong>Interview Date:</strong> {new Date().toLocaleDateString()}</p>
          </div>

          <button
            style={styles.dashboardBtn}
            onClick={() => navigate('/candidate-dashboard')}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h2>{interview?.title}</h2>
          <span style={styles.position}>{interview?.job_title}</span>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.timerBox}>
            <span style={styles.timerLabel}>Time Remaining</span>
            <span style={{
              ...styles.timerValue,
              color: timeRemaining < 300 ? '#ef4444' : '#f8fafc'
            }}>
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
      </div>

      <div style={styles.progressBar}>
        <div
          style={{
            ...styles.progressFill,
            width: `${((currentQuestion - 1) / totalQuestions) * 100}%`
          }}
        ></div>
      </div>

      <div style={styles.questionCard}>
        <div style={styles.questionHeader}>
          <span style={styles.questionNumber}>Question {currentQuestion} of {totalQuestions}</span>
          <span style={styles.difficulty}>{interview?.difficulty || 'Medium'}</span>
        </div>

        <h3 style={styles.questionText}>{questions[currentQuestion - 1]?.text}</h3>

        <textarea
          style={styles.answerInput}
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
          placeholder="Type your answer here... (Be specific and detailed)"
          rows="8"
        />

        <div style={styles.answerStats}>
          <span>{currentAnswer.length} characters</span>
          {currentAnswer.length < 50 && <span style={{ color: '#f59e0b' }}>⚠️ More details recommended</span>}
          {currentAnswer.length >= 50 && currentAnswer.length < 200 && <span style={{ color: '#10b981' }}>✓ Good</span>}
          {currentAnswer.length >= 200 && <span style={{ color: '#10b981' }}>✓✓ Excellent</span>}
        </div>

        <button
          style={styles.submitAnswerBtn}
          onClick={recordAnswer}
          disabled={!currentAnswer.trim()}
        >
          {currentQuestion === totalQuestions ? '✓ Submit Interview' : 'Next Question →'}
        </button>
      </div>
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
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh'
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid rgba(139, 92, 246, 0.3)',
    borderTop: '4px solid #8b5cf6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  previewCard: {
    maxWidth: '600px',
    margin: '0 auto',
    background: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(100, 116, 139, 0.3)',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
  },
  previewContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginY: '1.5rem'
  },
  previewItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1rem',
    background: 'rgba(99, 102, 241, 0.1)',
    borderRadius: '8px',
    border: '1px solid rgba(99, 102, 241, 0.2)'
  },
  label: {
    fontWeight: '600',
    color: '#a78bfa'
  },
  instructions: {
    background: 'rgba(34, 197, 94, 0.1)',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    borderRadius: '8px',
    padding: '1rem',
    marginY: '1.5rem'
  },
  instructionsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  startBtn: {
    width: '100%',
    padding: '0.75rem',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '1rem'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid rgba(100, 116, 139, 0.3)'
  },
  headerLeft: {
    flex: 1
  },
  headerRight: {
    textAlign: 'right'
  },
  position: {
    display: 'block',
    color: '#cbd5e1',
    fontSize: '0.9rem'
  },
  timerBox: {
    display: 'flex',
    flexDirection: 'column',
    background: 'rgba(99, 102, 241, 0.15)',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    border: '1px solid rgba(99, 102, 241, 0.3)'
  },
  timerLabel: {
    fontSize: '0.8rem',
    color: '#cbd5e1'
  },
  timerValue: {
    fontSize: '1.5rem',
    fontWeight: '700',
    fontFamily: 'monospace'
  },
  progressBar: {
    width: '100%',
    height: '4px',
    background: 'rgba(100, 116, 139, 0.2)',
    borderRadius: '2px',
    marginBottom: '2rem',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
    transition: 'width 0.3s ease'
  },
  questionCard: {
    maxWidth: '900px',
    margin: '0 auto',
    background: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(100, 116, 139, 0.3)',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
  },
  questionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  questionNumber: {
    color: '#a78bfa',
    fontWeight: '600'
  },
  difficulty: {
    padding: '0.25rem 0.75rem',
    background: 'rgba(251, 146, 60, 0.2)',
    border: '1px solid rgba(251, 146, 60, 0.5)',
    borderRadius: '20px',
    fontSize: '0.85rem'
  },
  questionText: {
    fontSize: '1.3rem',
    marginBottom: '1.5rem',
    lineHeight: '1.6'
  },
  answerInput: {
    width: '100%',
    padding: '1rem',
    background: 'rgba(30, 41, 59, 0.5)',
    border: '1px solid rgba(100, 116, 139, 0.3)',
    borderRadius: '8px',
    color: '#f8fafc',
    fontSize: '1rem',
    fontFamily: 'inherit',
    resize: 'vertical',
    marginBottom: '0.75rem'
  },
  answerStats: {
    display: 'flex',
    gap: '1rem',
    fontSize: '0.85rem',
    color: '#cbd5e1',
    marginBottom: '1rem'
  },
  submitAnswerBtn: {
    width: '100%',
    padding: '0.75rem',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  reportCard: {
    maxWidth: '700px',
    margin: '0 auto',
    background: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(100, 116, 139, 0.3)',
    borderRadius: '16px',
    padding: '2rem',
    textAlign: 'center',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
  },
  scoreCircle: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '1.5rem auto',
    fontSize: '0.9rem'
  },
  scoreValue: {
    fontSize: '3rem',
    fontWeight: '800'
  },
  scoreLabel: {
    fontSize: '0.9rem',
    opacity: 0.8
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem',
    marginY: '1.5rem'
  },
  metricItem: {
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem',
    background: 'rgba(99, 102, 241, 0.1)',
    borderRadius: '8px',
    border: '1px solid rgba(99, 102, 241, 0.2)'
  },
  metricLabel: {
    fontSize: '0.85rem',
    color: '#cbd5e1',
    marginBottom: '0.5rem'
  },
  metricValue: {
    fontSize: '1.5rem',
    fontWeight: '700'
  },
  recommendationsBox: {
    textAlign: 'left',
    background: 'rgba(34, 197, 94, 0.1)',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    borderRadius: '8px',
    padding: '1rem',
    marginY: '1.5rem'
  },
  statsBox: {
    textAlign: 'left',
    background: 'rgba(99, 102, 241, 0.1)',
    border: '1px solid rgba(99, 102, 241, 0.2)',
    borderRadius: '8px',
    padding: '1rem',
    marginY: '1.5rem'
  },
  dashboardBtn: {
    width: '100%',
    padding: '0.75rem',
    background: 'rgba(100, 116, 139, 0.2)',
    color: '#cbd5e1',
    border: '1px solid rgba(100, 116, 139, 0.5)',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  }
};
