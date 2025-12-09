import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './AIInterviewRealtime.css';

const AIInterviewRealtime = ({ jobId }) => {
  // Session and Interview State
  const [sessionId, setSessionId] = useState(null);
  const [interviewMode, setInterviewMode] = useState(null);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [timer, setTimer] = useState(300);
  const [finalScore, setFinalScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Speech State
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [speechMetrics, setSpeechMetrics] = useState({ fluency: 0, confidence: 0, clarity: 0 });
  const [fullTranscript, setFullTranscript] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);

  // Facial Recognition State
  const [facialMetrics, setFacialMetrics] = useState({
    faceDetected: false,
    eyeContact: 0,
    emotions: {},
    engagement: 0
  });
  const [emotionData, setEmotionData] = useState({});
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const facialIntervalRef = useRef(null);

  // Chat State
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const chatEndRef = useRef(null);

  // Real-time Metrics
  const [overallScore, setOverallScore] = useState(0);
  const [sessionMetrics, setSessionMetrics] = useState({
    averageConfidence: 0,
    emotionTrend: {},
    engagementScore: 0,
    speechQuality: 0,
  });

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setFullTranscript(prev => prev + ' ' + transcript);
          } else {
            interim += transcript;
          }
        }
        setTranscript(interim);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };
    }
  }, []);

  // Initialize Interview
  useEffect(() => {
    const initializeInterview = async () => {
      if (sessionId) return;

      setLoading(true);
      try {
        const response = await axios.post(
          'http://localhost:5000/api/multimodal-interview/start-session',
          {
            sessionId: `session_${Date.now()}`,
            jobId: jobId || 'default',
            interviewType: interviewMode,
            candidateId: JSON.parse(localStorage.getItem('user') || '{}').id,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        if (response.data.success) {
          setSessionId(response.data.sessionId);
          setIsInterviewActive(true);
          loadQuestions();
          startVideo();
          setTimer(300);
        }
      } catch (err) {
        setError('Failed to initialize interview: ' + (err.response?.data?.error || err.message));
      } finally {
        setLoading(false);
      }
    };

    if (isInterviewActive && !sessionId && interviewMode) {
      initializeInterview();
    }
  }, [isInterviewActive, sessionId, interviewMode, jobId]);

  // Load Questions
  const loadQuestions = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/ai-interview/session/questions',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.data.success && response.data.questions) {
        setQuestions(response.data.questions);
        if (response.data.questions.length > 0) {
          setCurrentQuestion(response.data.questions[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load questions:', err);
    }
  };

  // Timer Effect
  useEffect(() => {
    if (!isInterviewActive || timer <= 0) return;

    const interval = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          handleNextQuestion();
          return 300;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isInterviewActive]);

  // Start Video
  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      startFacialAnalysis();
    } catch (err) {
      console.error('Failed to start video:', err);
      setError('Camera access denied. Please enable camera permissions.');
    }
  };

  // Facial Analysis
  const startFacialAnalysis = () => {
    facialIntervalRef.current = setInterval(async () => {
      if (canvasRef.current && videoRef.current) {
        const context = canvasRef.current.getContext('2d');
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

        try {
          const response = await axios.post(
            'http://localhost:5000/api/multimodal-interview/process-facial',
            {
              sessionId,
              frameData: canvasRef.current.toDataURL('image/jpeg'),
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
          );

          if (response.data.success) {
            setFacialMetrics(response.data.metrics);
            setEmotionData(response.data.emotions);
          }
        } catch (err) {
          console.error('Facial analysis error:', err);
        }
      }
    }, 1000);
  };

  // Start Speech Recognition
  const handleStartListening = () => {
    if (recognitionRef.current) {
      setTranscript('');
      recognitionRef.current.start();
    }
  };

  // Stop Speech Recognition
  const handleStopListening = async () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    if (fullTranscript) {
      await processSpeech();
    }
  };

  // Process Speech
  const processSpeech = async () => {
    if (!fullTranscript) return;

    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:5000/api/multimodal-interview/process-speech',
        {
          sessionId,
          transcription: fullTranscript,
          questionId: currentQuestion?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.data.success) {
        setSpeechMetrics(response.data.metrics);
      }
    } catch (err) {
      setError('Failed to process speech: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Send Chat Message
  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const userMsg = { role: 'user', content: userInput, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setUserInput('');
    setIsSendingMessage(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/multimodal-interview/send-message',
        {
          sessionId,
          message: userInput,
          questionId: currentQuestion?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.data.success) {
        const aiMsg = {
          role: 'ai',
          content: response.data.response,
          timestamp: new Date(),
          metrics: response.data.metrics,
        };
        setMessages(prev => [...prev, aiMsg]);
      }
    } catch (err) {
      setError('Failed to send message: ' + err.message);
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Next Question
  const handleNextQuestion = async () => {
    if (questionIndex + 1 < questions.length) {
      setQuestionIndex(questionIndex + 1);
      setCurrentQuestion(questions[questionIndex + 1]);
      setTranscript('');
      setFullTranscript('');
      setMessages([]);
      setTimer(300);
    } else {
      endInterview();
    }
  };

  // End Interview
  const endInterview = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:5000/api/multimodal-interview/end-session',
        { sessionId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.data.success) {
        setFinalScore(response.data.score);
        setSessionMetrics(response.data.metrics);
        setIsInterviewActive(false);

        if (facialIntervalRef.current) {
          clearInterval(facialIntervalRef.current);
        }

        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      }
    } catch (err) {
      setError('Failed to end interview: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isInterviewActive && finalScore === null && !loading) {
    return (
      <div className="interview-start-screen">
        <div className="start-content">
          <h2>Welcome to AI Interview</h2>
          <p>This is a real-time multimodal interview combining voice, video, and chat.</p>

          <div className="interview-options">
            <div className="option-card" onClick={() => setInterviewMode('voice')}>
              <span>🎤</span>
              <h3>Voice Interview</h3>
              <p>Answer questions via voice</p>
            </div>
            <div className="option-card" onClick={() => setInterviewMode('video')}>
              <span>📹</span>
              <h3>Video Interview</h3>
              <p>Face & emotion tracking</p>
            </div>
            <div className="option-card" onClick={() => setInterviewMode('chat')}>
              <span>💬</span>
              <h3>Chat Interview</h3>
              <p>Text-based conversation</p>
            </div>
            <div className="option-card" onClick={() => setInterviewMode('multimodal')}>
              <span>🎯</span>
              <h3>Multimodal (Best)</h3>
              <p>All features combined</p>
            </div>
          </div>

          <button
            className="btn btn-primary btn-lg"
            onClick={() => setIsInterviewActive(true)}
          >
            Start Interview
          </button>
        </div>
      </div>
    );
  }

  if (finalScore !== null) {
    return (
      <div className="interview-results">
        <div className="results-content">
          <h2>Interview Complete</h2>

          <div className="score-display">
            <div className="score-circle">
              <div className="score-value">{Math.round(finalScore)}</div>
              <div className="score-label">Overall Score</div>
            </div>
          </div>

          <div className="metrics-grid">
            <div className="metric-item">
              <span className="metric-label">Confidence</span>
              <div className="metric-bar">
                <div
                  className="metric-fill"
                  style={{
                    width: `${sessionMetrics.averageConfidence || 0}%`,
                  }}
                ></div>
              </div>
              <span className="metric-value">{Math.round(sessionMetrics.averageConfidence || 0)}%</span>
            </div>

            <div className="metric-item">
              <span className="metric-label">Engagement</span>
              <div className="metric-bar">
                <div
                  className="metric-fill"
                  style={{
                    width: `${sessionMetrics.engagementScore || 0}%`,
                  }}
                ></div>
              </div>
              <span className="metric-value">{Math.round(sessionMetrics.engagementScore || 0)}%</span>
            </div>

            <div className="metric-item">
              <span className="metric-label">Speech Quality</span>
              <div className="metric-bar">
                <div
                  className="metric-fill"
                  style={{
                    width: `${sessionMetrics.speechQuality || 0}%`,
                  }}
                ></div>
              </div>
              <span className="metric-value">{Math.round(sessionMetrics.speechQuality || 0)}%</span>
            </div>
          </div>

          <button className="btn btn-primary" onClick={() => window.location.href = '/candidate-dashboard'}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="interview-container">
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="interview-header">
        <div className="interview-title">
          <h3>Question {questionIndex + 1} of {questions.length}</h3>
          <span className="timer" style={{ color: timer < 60 ? '#ef4444' : 'inherit' }}>
            {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
          </span>
        </div>
        <div className="mode-indicator">{interviewMode.toUpperCase()} Mode</div>
      </div>

      <div className="interview-content">
        {/* Video Section */}
        {(interviewMode === 'video' || interviewMode === 'multimodal') && (
          <div className="video-section">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="video-feed"
              onLoadedMetadata={() => {
                if (canvasRef.current) {
                  canvasRef.current.width = videoRef.current.videoWidth;
                  canvasRef.current.height = videoRef.current.videoHeight;
                }
              }}
            />
            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {facialMetrics.faceDetected && (
              <div className="facial-overlay">
                <div className="facial-metrics">
                  <span>😊 Eye Contact: {Math.round(facialMetrics.eyeContact)}%</span>
                  <span>😊 Engagement: {Math.round(facialMetrics.engagement)}%</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Question Section */}
        <div className="question-section">
          <div className="question-box">
            <h4>Current Question:</h4>
            <p className="question-text">{currentQuestion?.text || 'Loading question...'}</p>
            {currentQuestion?.hints && (
              <div className="question-hints">
                <strong>Hint:</strong> {currentQuestion.hints}
              </div>
            )}
          </div>

          {/* Voice Section */}
          {(interviewMode === 'voice' || interviewMode === 'multimodal') && (
            <div className="voice-section">
              <div className="transcription-display">
                <p className="interim">{transcript}</p>
                <p className="final">{fullTranscript}</p>
              </div>

              <div className="voice-controls">
                <button
                  className={`btn ${isListening ? 'btn-danger' : 'btn-success'}`}
                  onClick={isListening ? handleStopListening : handleStartListening}
                >
                  {isListening ? '⏹ Stop Listening' : '🎤 Start Speaking'}
                </button>
              </div>

              {Object.keys(speechMetrics).length > 0 && (
                <div className="metrics-display">
                  <div className="metric">
                    <span>Fluency:</span>
                    <div className="metric-bar">
                      <div className="metric-fill" style={{ width: `${speechMetrics.fluency}%` }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Chat Section */}
          {(interviewMode === 'chat' || interviewMode === 'multimodal') && (
            <div className="chat-section">
              <div className="chat-messages">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`message ${msg.role}`}>
                    <p>{msg.content}</p>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <div className="chat-input-area">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your answer..."
                  disabled={isSendingMessage}
                />
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleSendMessage}
                  disabled={isSendingMessage || !userInput.trim()}
                >
                  {isSendingMessage ? 'Sending...' : 'Send'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="interview-footer">
        <button className="btn btn-secondary" onClick={endInterview} disabled={loading}>
          End Interview
        </button>
        <button
          className="btn btn-primary"
          onClick={handleNextQuestion}
          disabled={loading || questionIndex >= questions.length - 1}
        >
          Next Question
        </button>
      </div>
    </div>
  );
};

export default AIInterviewRealtime;


