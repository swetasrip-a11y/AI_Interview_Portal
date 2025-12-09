import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AIInterview() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [interview, setInterview] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewEnded, setInterviewEnded] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [micActive, setMicActive] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    fetchInterviewData();
  }, [id]);

  useEffect(() => {
    if (interviewStarted && !interviewEnded && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && interviewStarted && !interviewEnded) {
      handleSubmitInterview();
    }
  }, [timeLeft, interviewStarted, interviewEnded]);

  const fetchInterviewData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const interviewRes = await axios.get(`http://localhost:5000/api/interviews/${id}`, { headers });
      const questionsRes = await axios.get(`http://localhost:5000/api/questions`, { headers });
      
      setInterview(interviewRes.data);
      setQuestions(questionsRes.data.slice(0, 5)); // Get first 5 questions
      setUserAnswers(new Array(5).fill(''));
      setTotalTime(questionsRes.data.length * 60); // 1 min per question
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const startInterview = () => {
    setInterviewStarted(true);
    setTimeLeft(totalTime);
    speakQuestion();
  };

  const speakQuestion = () => {
    if ('speechSynthesis' in window) {
      const text = `Question ${currentQuestion + 1}: ${questions[currentQuestion]?.question}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAnswerChange = (e) => {
    setCurrentAnswer(e.target.value);
  };

  const submitAnswer = async () => {
    // Save the answer
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = currentAnswer;
    setUserAnswers(newAnswers);

    // Generate AI feedback
    const aiReview = await generateAIFeedback(questions[currentQuestion]?.question, currentAnswer);
    const newFeedback = [...feedback];
    newFeedback[currentQuestion] = aiReview;
    setFeedback(newFeedback);
    setAiResponse(aiReview.feedback);

    // Move to next question
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setCurrentAnswer('');
      setTimeout(speakQuestion, 1000);
    } else {
      handleSubmitInterview();
    }
  };

  const generateAIFeedback = async (question, answer) => {
    try {
      // Simulating AI evaluation (in production, call real AI API like OpenAI)
      const evaluationScore = Math.floor(Math.random() * 30 + 60); // 60-90
      const feedbackText = generateFeedbackText(question, answer, evaluationScore);
      
      return {
        question,
        answer,
        score: evaluationScore,
        feedback: feedbackText
      };
    } catch (err) {
      console.error('Error:', err);
      return {
        question,
        answer,
        score: 70,
        feedback: 'Good attempt. Keep improving.'
      };
    }
  };

  const generateFeedbackText = (question, answer, score) => {
    if (score >= 85) {
      return `Excellent answer! Your response was comprehensive and well-structured. You demonstrated strong understanding. ${answer.length > 50 ? 'Good detail level.' : 'Could add more examples.'}`;
    } else if (score >= 70) {
      return `Good attempt! Your answer covers the main points. Consider adding more specific examples or details for a stronger response.`;
    } else {
      return `Your answer has potential. Try to provide more detailed explanations and include real-world examples to strengthen your response.`;
    }
  };

  const handleSubmitInterview = async () => {
    setInterviewEnded(true);
    
    // Calculate final score
    const avgScore = feedback.length > 0 
      ? Math.round(feedback.reduce((sum, f) => sum + (f.score || 70), 0) / feedback.length)
      : 0;
    setScore(avgScore);

    // Save submission to backend
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      await axios.post(`http://localhost:5000/api/submissions`, {
        interview_id: id,
        answers: userAnswers,
        score: avgScore,
        feedback: feedback
      }, { headers });
    } catch (err) {
      console.error('Error saving submission:', err);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="container"><h2>Loading...</h2></div>;

  if (!interview) return <div className="container"><h2>Interview not found</h2></div>;

  if (!interviewStarted) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #050810|#0a0e27|#1a1f35 0%, #050810|#0a0e27|#1a1f35 50%, #050810|#0a0e27|#1a1f35 100%)' }}>
        <div className="dashboard">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1>🤖 AI Interview</h1>
            <h2 style={{ color: '#5a4a6f', margin: '20px 0' }}>{interview.title}</h2>
          </div>

          <div className="user-info" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h3>Welcome to Your AI Interview</h3>
            <p><strong>Position:</strong> {interview.job_title}</p>
            <p><strong>Duration:</strong> {Math.ceil(totalTime / 60)} minutes</p>
            <p><strong>Total Questions:</strong> {questions.length}</p>
            <p style={{ color: '#7a6a8f', marginTop: '20px' }}>
              This is an AI-powered interview system. The AI will ask you questions and evaluate your responses in real-time. You can speak or type your answers.
            </p>

            <div style={{ display: 'flex', gap: '10px', marginTop: '30px', justifyContent: 'center' }}>
              <button 
                className="btn" 
                onClick={startInterview}
                style={{ width: '200px', fontSize: '16px', padding: '12px' }}
              >
                🎤 Start Interview
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => navigate('/candidate/interviews')}
                style={{ width: '200px', fontSize: '16px', padding: '12px' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (interviewEnded) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #050810|#0a0e27|#1a1f35 0%, #050810|#0a0e27|#1a1f35 50%, #050810|#0a0e27|#1a1f35 100%)' }}>
        <div className="dashboard">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1>✅ Interview Complete</h1>
          </div>

          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="user-info" style={{ textAlign: 'center', marginBottom: '30px' }}>
              <h2 style={{ color: '#5a4a6f', margin: '0 0 20px 0' }}>Your Score</h2>
              <div style={{
                fontSize: '80px',
                fontWeight: 'bold',
                color: score >= 70 ? '#27ae60' : score >= 60 ? '#f39c12' : '#e74c3c',
                marginBottom: '20px'
              }}>
                {score}%
              </div>
              <p style={{ fontSize: '16px', color: '#7a6a8f' }}>
                {score >= 80 ? '🎉 Excellent! You performed very well!' : 
                 score >= 70 ? '👍 Good job! Keep practicing.' : 
                 '💪 Good effort! Review the feedback below.'}
              </p>
            </div>

            <h3 style={{ color: '#5a4a6f', marginTop: '40px', marginBottom: '20px' }}>Detailed Feedback</h3>

            {feedback.map((item, idx) => (
              <div key={idx} style={{
                background: 'white',
                padding: '20px',
                marginBottom: '15px',
                borderRadius: '10px',
                borderLeft: `5px solid ${item.score >= 80 ? '#27ae60' : item.score >= 70 ? '#f39c12' : '#e74c3c'}`,
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                  <h4 style={{ color: '#5a4a6f', margin: '0', flex: 1 }}>Q{idx + 1}: {item.question}</h4>
                  <span style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: item.score >= 80 ? '#d4edda' : item.score >= 70 ? '#fff3cd' : '#f8d7da',
                    color: item.score >= 80 ? '#155724' : item.score >= 70 ? '#856404' : '#721c24',
                    whiteSpace: 'nowrap'
                  }}>
                    Score: {item.score}%
                  </span>
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <p style={{ margin: '8px 0', color: '#5a4a6f' }}>
                    <strong>Your Answer:</strong> {item.answer}
                  </p>
                </div>

                <div style={{ marginBottom: '0' }}>
                  <p style={{ margin: '8px 0', color: '#7a6a8f', fontSize: '14px' }}>
                    <strong>AI Feedback:</strong> {item.feedback}
                  </p>
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', gap: '10px', marginTop: '30px', justifyContent: 'center' }}>
              <button 
                className="btn" 
                onClick={() => navigate('/candidate-dashboard')}
                style={{ width: '200px', fontSize: '16px', padding: '12px' }}
              >
                Back to Dashboard
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => navigate('/candidate/performance')}
                style={{ width: '200px', fontSize: '16px', padding: '12px' }}
              >
                View Performance
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #050810|#0a0e27|#1a1f35 0%, #050810|#0a0e27|#1a1f35 50%, #050810|#0a0e27|#1a1f35 100%)' }}>
      <div className="dashboard">
        {/* Header with Timer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1>🤖 AI Interview</h1>
          <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: timeLeft < 60 ? '#e74c3c' : '#5a4a6f',
            padding: '10px 20px',
            background: timeLeft < 60 ? 'rgba(239, 68, 68, 0.2)' : '#050810|#0a0e27|#1a1f35',
            borderRadius: '8px'
          }}>
            ⏱️ {formatTime(timeLeft)}
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: '#5a4a6f', fontWeight: 'bold' }}>
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span style={{ color: '#7a6a8f' }}>
              {Math.round((currentQuestion / questions.length) * 100)}% Complete
            </span>
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            background: '#e0d5f0',
            borderRadius: '10px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${(currentQuestion / questions.length) * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #b89dd9 0%, rgba(99, 102, 241, 0.1) 100%)',
              transition: 'width 0.3s'
            }}></div>
          </div>
        </div>

        {/* Question Section */}
        <div className="user-info" style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#5a4a6f', marginTop: 0 }}>Question {currentQuestion + 1}</h2>
          <p style={{ fontSize: '18px', color: '#5a4a6f', lineHeight: '1.6' }}>
            {questions[currentQuestion]?.question}
          </p>

          <div style={{ marginTop: '20px', marginBottom: '20px' }}>
            <button 
              onClick={speakQuestion}
              style={{
                padding: '10px 20px',
                background: '#b89dd9',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              🔊 Repeat Question
            </button>
          </div>
        </div>

        {/* AI Response */}
        {aiResponse && (
          <div className="user-info" style={{ 
            background: '#050810|#0a0e27|#1a1f35',
            marginBottom: '30px',
            borderLeft: '4px solid #3498db'
          }}>
            <h3 style={{ color: '#0056b3', marginTop: 0 }}>💭 AI Feedback</h3>
            <p style={{ color: '#5a4a6f', marginBottom: 0 }}>{aiResponse}</p>
          </div>
        )}

        {/* Answer Input */}
        <div className="user-info" style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#5a4a6f' }}>Your Answer</h3>
          <textarea
            value={currentAnswer}
            onChange={handleAnswerChange}
            placeholder="Type your answer here... or speak using microphone"
            style={{
              width: '100%',
              minHeight: '120px',
              padding: '15px',
              border: '2px solid #d4b5e8',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'Arial',
              resize: 'vertical'
            }}
          />

          <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
            <button 
              onClick={() => setMicActive(!micActive)}
              style={{
                padding: '10px 20px',
                background: micActive ? '#e74c3c' : '#b89dd9',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {micActive ? '🎤 Stop Recording' : '🎤 Record Answer'}
            </button>
            <button 
              onClick={submitAnswer}
              style={{
                padding: '10px 20px',
                background: '#27ae60',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                flex: 1
              }}
            >
              {currentQuestion === questions.length - 1 ? '✅ Complete Interview' : '➜ Next Question'}
            </button>
          </div>
        </div>

        {/* Keyboard Shortcuts */}
        <div style={{
          padding: '15px',
          background: '#1a1f35',
          borderRadius: '8px',
          fontSize: '12px',
          color: '#7a6a8f'
        }}>
          💡 <strong>Tip:</strong> Click "Repeat Question" if you need to hear the question again. Take your time to provide detailed answers.
        </div>
      </div>
    </div>
  );
}


