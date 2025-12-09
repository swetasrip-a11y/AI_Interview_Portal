import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getInterview } from '../api/interviews';
import { getQuestions, submitAnswer } from '../api/questions';

export default function TakeInterviewTest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [testStarted, setTestStarted] = useState(false);
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!testStarted || testSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testStarted, testSubmitted]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [interviewRes, questionsRes] = await Promise.all([
        getInterview(id),
        getQuestions()
      ]);
      setInterview(interviewRes.data);
      setQuestions(questionsRes.data.slice(0, 10)); // Limit to 10 questions
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to load interview');
      navigate('/candidate/interviews');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId, option) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: option });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitTest = async () => {
    if (!window.confirm('Are you sure you want to submit? You cannot change answers after submission.')) {
      return;
    }

    try {
      setLoading(true);
      let correct = 0;
      let total = 0;

      for (const q of questions) {
        if (selectedAnswers[q.id]) {
          total++;
          if (selectedAnswers[q.id] === q.correct_option) {
            correct++;
            await submitAnswer(q.id, selectedAnswers[q.id]);
          } else {
            await submitAnswer(q.id, selectedAnswers[q.id]);
          }
        }
      }

      const score = total > 0 ? Math.round((correct / total) * 100) : 0;
      setResults({
        correct,
        total,
        score,
        answers: selectedAnswers
      });
      setTestSubmitted(true);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit test');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container"><h2>Loading interview...</h2></div>;

  if (!testStarted) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #050810|#0a0e27|#1a1f35 0%, #050810|#0a0e27|#1a1f35 50%, #050810|#0a0e27|#1a1f35 100%)' }}>
        <div className="dashboard">
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="user-info">
              <h1>{interview?.title}</h1>
              <p><strong>Job:</strong> {interview?.job_title}</p>
              <p><strong>Description:</strong> {interview?.description}</p>

              <div style={{
                background: 'linear-gradient(135deg, #ffe6e6 0%, #ffd9d9 100%)',
                padding: '20px',
                borderRadius: '10px',
                margin: '20px 0'
              }}>
                <h3 style={{ color: '#5a2d2d', marginBottom: '10px' }}>⏱️ Test Details</h3>
                <p><strong>Total Questions:</strong> {questions.length}</p>
                <p><strong>Duration:</strong> 30 minutes</p>
                <p><strong>Type:</strong> Multiple Choice</p>
                <p style={{ marginTop: '10px', fontSize: '13px', color: '#7a4a4a' }}>
                  All questions are compulsory. You must answer all questions before submitting.
                </p>
              </div>

              <button
                onClick={() => setTestStarted(true)}
                className="btn"
                style={{ marginBottom: '10px' }}
              >
                Start Test
              </button>
              <Link to="/candidate/interviews" className="btn btn-secondary">
                Back
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (testSubmitted && results) {
    const statusColor = results.score >= 60 ? '#d4edda' : '#f8d7da';
    const statusText = results.score >= 60 ? 'PASSED' : 'FAILED';
    const statusTextColor = results.score >= 60 ? '#155724' : '#721c24';

    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #050810|#0a0e27|#1a1f35 0%, #050810|#0a0e27|#1a1f35 50%, #050810|#0a0e27|#1a1f35 100%)' }}>
        <div className="dashboard">
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="user-info" style={{ textAlign: 'center' }}>
              <h1>Test Submitted!</h1>

              <div style={{
                background: statusColor,
                padding: '30px',
                borderRadius: '10px',
                margin: '20px 0'
              }}>
                <h2 style={{ color: statusTextColor, marginBottom: '20px' }}>{statusText}</h2>
                <div className="stats-grid">
                  <div className="stat-card">
                    <h3>Correct</h3>
                    <div className="number" style={{ color: '#27ae60' }}>{results.correct}</div>
                  </div>
                  <div className="stat-card">
                    <h3>Total</h3>
                    <div className="number" style={{ color: '#5a4a6f' }}>{results.total}</div>
                  </div>
                  <div className="stat-card">
                    <h3>Score</h3>
                    <div className="number" style={{ color: '#f39c12' }}>{results.score}%</div>
                  </div>
                </div>
              </div>

              <p style={{ marginTop: '20px' }}>
                Your interview has been completed and submitted to the interviewer for review.
              </p>

              <Link to="/candidate-dashboard" className="btn" style={{ marginTop: '20px' }}>
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isAnswered = selectedAnswers[currentQuestion.id];
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #050810|#0a0e27|#1a1f35 0%, #050810|#0a0e27|#1a1f35 50%, #050810|#0a0e27|#1a1f35 100%)' }}>
      <div style={{
        padding: '20px',
        background: 'linear-gradient(135deg, #d4b5e8 0%, #b89dd9 100%)',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{ margin: 0 }}>⏱️ Time Left: {formatTime(timeLeft)}</h2>
        <div>Q {currentQuestionIndex + 1} / {questions.length} | Answered: {answeredCount}/{questions.length}</div>
      </div>

      <div className="dashboard">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="user-info">
            <h3 style={{ marginBottom: '20px', color: '#5a4a6f' }}>
              Question {currentQuestionIndex + 1}
            </h3>
            <p style={{ fontSize: '16px', marginBottom: '20px', lineHeight: '1.6' }}>
              <strong>{currentQuestion.question_text}</strong>
            </p>

            <div style={{ marginBottom: '20px' }}>
              {['option_a', 'option_b', 'option_c', 'option_d'].map((opt, idx) => (
                <label key={opt} style={{
                  display: 'block',
                  marginBottom: '12px',
                  padding: '12px',
                  border: selectedAnswers[currentQuestion.id] === opt[opt.length - 1].toUpperCase()
                    ? '2px solid #b89dd9'
                    : '2px solid #d4b5e8',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: selectedAnswers[currentQuestion.id] === opt[opt.length - 1].toUpperCase()
                    ? '#f0e6ff'
                    : 'white',
                  transition: 'all 0.3s'
                }}>
                  <input
                    type="radio"
                    name="option"
                    value={opt[opt.length - 1].toUpperCase()}
                    checked={selectedAnswers[currentQuestion.id] === opt[opt.length - 1].toUpperCase()}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    style={{ marginRight: '10px' }}
                  />
                  <span>
                    <strong>{opt[opt.length - 1].toUpperCase()}.</strong> {currentQuestion[opt]}
                  </span>
                </label>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="btn btn-secondary"
                style={{ opacity: currentQuestionIndex === 0 ? 0.5 : 1 }}
              >
                ← Previous
              </button>

              <button
                onClick={handleNext}
                disabled={currentQuestionIndex === questions.length - 1}
                className="btn btn-secondary"
                style={{ opacity: currentQuestionIndex === questions.length - 1 ? 0.5 : 1 }}
              >
                Next →
              </button>

              <button
                onClick={handleSubmitTest}
                className="btn"
                style={{ backgroundColor: '#e74c3c' }}
              >
                Submit Test
              </button>
            </div>
          </div>

          {/* Question Navigation */}
          <div style={{ marginTop: '30px', background: 'white', padding: '20px', borderRadius: '10px' }}>
            <h4 style={{ color: '#5a4a6f', marginBottom: '15px' }}>Question Navigator</h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(40px, 1fr))',
              gap: '8px'
            }}>
              {questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  style={{
                    padding: '10px',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    backgroundColor: selectedAnswers[q.id]
                      ? '#d4edda'
                      : idx === currentQuestionIndex ? '#b89dd9' : '#e6e6e6',
                    color: selectedAnswers[q.id] ? '#155724' : idx === currentQuestionIndex ? 'white' : '#333',
                    fontWeight: selectedAnswers[q.id] || idx === currentQuestionIndex ? 'bold' : 'normal',
                    transition: 'all 0.2s'
                  }}
                  title={selectedAnswers[q.id] ? 'Answered' : 'Not answered'}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


