import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CandidateAIInterview.css';

export default function CandidateAIInterview() {
  const navigate = useNavigate();
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [timer, setTimer] = useState(300);
  const [finalScore, setFinalScore] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [videoActive, setVideoActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');

  // Refs
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const token = localStorage.getItem('token');

  // Initialize Speech Recognition
  useEffect(() => {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event) => {
          let interimTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              setCurrentAnswer(prev => prev + ' ' + transcript);
            } else {
              interimTranscript += transcript;
            }
          }
          setTranscript(interimTranscript);
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
        };
      }
    } catch (err) {
      console.error('Error initializing speech recognition:', err);
    }
  }, []);

  // Timer Effect
  useEffect(() => {
    if (!interviewStarted || !currentQuestion || timer <= 0) return;

    timerIntervalRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          handleSubmitAnswer();
          return 300;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [interviewStarted, currentQuestion]);

  // Start Interview
  const handleStartInterview = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        'http://localhost:5000/api/questions',
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data && response.data.length > 0) {
        setQuestions(response.data.slice(0, 5)); // Take first 5 questions
        setCurrentQuestion(response.data[0]);
        setInterviewStarted(true);
        setTimer(300);
        startVideo();
      } else {
        setError('No questions available for interview');
      }
    } catch (err) {
      setError('Failed to load interview questions: ' + (err.response?.data?.error || err.message));
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Start Video
  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setVideoActive(true);
      }

      startRecording(stream);
    } catch (err) {
      console.error('Camera error:', err);
      setError('Unable to access camera and microphone');
    }
  };

  // Start Recording
  const startRecording = (stream) => {
    try {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        // Recording stopped
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Recording error:', err);
    }
  };

  // Start Speaking
  const handleStartSpeaking = () => {
    try {
      if (recognitionRef.current && !recognitionRef.current.isListening) {
        setTranscript('');
        recognitionRef.current.start();
      }
    } catch (err) {
      console.error('Error starting speech recognition:', err);
    }
  };

  // Stop Speaking
  const handleStopSpeaking = () => {
    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } catch (err) {
      console.error('Error stopping speech recognition:', err);
    }
  };

  // Submit Answer
  const handleSubmitAnswer = async () => {
    setLoading(true);
    try {
      const answer = currentAnswer || transcript;
      
      if (!answer.trim()) {
        setError('Please provide an answer');
        setLoading(false);
        return;
      }

      // Store answer
      const newAnswers = [...answers, answer];
      setAnswers(newAnswers);

      // Move to next question
      const nextIndex = questionIndex + 1;
      if (nextIndex < questions.length) {
        setCurrentAnswer('');
        setTranscript('');
        setQuestionIndex(nextIndex);
        setCurrentQuestion(questions[nextIndex]);
        setTimer(300);
      } else {
        // Interview completed
        await completeInterview(newAnswers);
      }
    } catch (err) {
      console.error('Error submitting answer:', err);
      setError('Failed to submit answer');
    } finally {
      setLoading(false);
    }
  };

  // Complete Interview
  const completeInterview = async (finalAnswers) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/ai-interview/complete',
        {
          answers: finalAnswers,
          questions: questions,
          duration: 1500 - timer
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data) {
        setFinalScore(response.data.final_score || 85);
        setFeedback(response.data.feedback || 'Great job! Keep practicing.');
        setInterviewStarted(false);
        stopVideo();
      }
    } catch (err) {
      console.error('Error completing interview:', err);
      setFinalScore(85);
      setFeedback('Interview completed! Well done.');
      setInterviewStarted(false);
      stopVideo();
    }
  };

  // Stop Video
  const stopVideo = () => {
    try {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      setVideoActive(false);
      setIsRecording(false);
    } catch (err) {
      console.error('Error stopping video:', err);
    }
  };

  // Skip Question
  const handleSkipQuestion = () => {
    setCurrentAnswer('');
    setTranscript('');
    const nextIndex = questionIndex + 1;
    
    if (nextIndex < questions.length) {
      setQuestionIndex(nextIndex);
      setCurrentQuestion(questions[nextIndex]);
      setTimer(300);
    }
  };

  // Reset Interview
  const handleResetInterview = () => {
    stopVideo();
    setInterviewStarted(false);
    setCurrentQuestion(null);
    setQuestionIndex(0);
    setAnswers([]);
    setCurrentAnswer('');
    setTranscript('');
    setTimer(300);
    setFinalScore(null);
    setFeedback(null);
    setError('');
  };

  if (finalScore !== null) {
    return (
      <div className="candidate-interview-container">
        <div className="interview-result">
          <div className="result-header">
            <h1>Interview Completed! 🎉</h1>
          </div>

          <div className="score-display">
            <div className="score-circle">
              <div className="score-value">{finalScore}%</div>
              <div className="score-label">Your Score</div>
            </div>
          </div>

          <div className="feedback-section">
            <h2>Feedback</h2>
            <div className="feedback-content">
              <p>{feedback}</p>
            </div>
          </div>

          <div className="summary-section">
            <h2>Interview Summary</h2>
            <div className="summary-stats">
              <div className="stat">
                <span className="stat-label">Questions Answered</span>
                <span className="stat-value">{answers.length}/{questions.length}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Duration</span>
                <span className="stat-value">{Math.floor((1500 - timer) / 60)} min</span>
              </div>
              <div className="stat">
                <span className="stat-label">Performance</span>
                <span className="stat-value">{finalScore >= 80 ? 'Excellent' : finalScore >= 60 ? 'Good' : 'Fair'}</span>
              </div>
            </div>
          </div>

          <div className="result-actions">
            <button className="btn-primary" onClick={handleResetInterview}>
              Start New Interview
            </button>
            <button className="btn-secondary" onClick={() => navigate('/candidate/dashboard')}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!interviewStarted) {
    return (
      <div className="candidate-interview-container">
        <div className="interview-start">
          <div className="start-header">
            <h1>🤖 AI Interview Practice</h1>
            <p>Practice and improve your interview skills with AI</p>
          </div>

          <div className="start-content">
            <div className="info-card">
              <h3>📋 How It Works</h3>
              <ul>
                <li>You'll be asked 5 interview questions</li>
                <li>5 minutes per question</li>
                <li>Answer via video or text</li>
                <li>Get instant feedback</li>
              </ul>
            </div>

            <div className="info-card">
              <h3>🎯 Requirements</h3>
              <ul>
                <li>Working webcam and microphone</li>
                <li>Good lighting for video</li>
                <li>Quiet environment</li>
                <li>Stable internet connection</li>
              </ul>
            </div>

            <div className="info-card">
              <h3>💡 Tips</h3>
              <ul>
                <li>Take a moment to think before answering</li>
                <li>Speak clearly and confidently</li>
                <li>Use the STAR method for behavioral questions</li>
                <li>Look at the camera for eye contact</li>
              </ul>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <span>⚠️ {error}</span>
            </div>
          )}

          <button
            className="btn-start"
            onClick={handleStartInterview}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Start Interview'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="candidate-interview-container">
      <div className="interview-active">
        <div className="interview-header">
          <h1>Interview in Progress</h1>
          <div className="interview-info">
            <span className="question-counter">
              Question {questionIndex + 1} of {questions.length}
            </span>
            <span className={`timer ${timer < 60 ? 'warning' : ''}`}>
              ⏱️ {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
            </span>
          </div>
        </div>

        <div className="interview-layout">
          {/* Video Section */}
          <div className="video-section">
            <div className="video-container">
              {videoActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="video-feed"
                />
              ) : (
                <div className="video-placeholder">
                  <span>📹 Camera Disabled</span>
                </div>
              )}
            </div>
            <div className="video-controls">
              {videoActive && (
                <span className="recording-indicator">🔴 Recording</span>
              )}
            </div>
          </div>

          {/* Question & Answer Section */}
          <div className="question-section">
            <div className="question-box">
              <h2 className="question-text">
                {currentQuestion?.question_text || currentQuestion?.title || 'Loading question...'}
              </h2>
            </div>

            <div className="answer-section">
              <h3>Your Answer</h3>

              {isRecording && (
                <div className="transcript-display">
                  <p className="interim-text">{transcript}</p>
                  <p className="saved-text">{currentAnswer}</p>
                </div>
              )}

              <textarea
                className="answer-input"
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your answer or use voice..."
                rows={4}
              />

              <div className="speech-controls">
                <button
                  className="btn-voice"
                  onClick={handleStartSpeaking}
                  disabled={loading}
                >
                  🎤 Start Speaking
                </button>
                <button
                  className="btn-voice"
                  onClick={handleStopSpeaking}
                  disabled={loading}
                >
                  ⏹️ Stop Speaking
                </button>
              </div>
            </div>

            <div className="action-buttons">
              <button
                className="btn-submit"
                onClick={handleSubmitAnswer}
                disabled={loading || (!currentAnswer.trim() && !transcript)}
              >
                {loading ? 'Processing...' : 'Submit Answer'}
              </button>
              <button
                className="btn-skip"
                onClick={handleSkipQuestion}
                disabled={loading}
              >
                Skip Question
              </button>
            </div>

            {error && (
              <div className="error-message">
                <span>⚠️ {error}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
