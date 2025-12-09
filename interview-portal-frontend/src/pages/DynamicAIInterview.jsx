import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const DynamicAIInterview = () => {
  // Session Management
  const [sessionId, setSessionId] = useState(null);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewComplete, setInterviewComplete] = useState(false);

  // Candidate Selection
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [candidates] = useState([
    {
      id: 1,
      name: 'Rajesh Kumar',
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
      experience: [{ company: 'Tech Solutions', years: 4 }],
    },
    {
      id: 2,
      name: 'Priya Singh',
      skills: ['Python', 'Django', 'PostgreSQL', 'Docker'],
      experience: [{ company: 'Data Systems', years: 3 }],
    },
    {
      id: 3,
      name: 'Amit Patel',
      skills: ['Java', 'Spring Boot', 'Microservices', 'AWS'],
      experience: [{ company: 'Enterprise Solutions', years: 5 }],
    },
  ]);

  // Interview State
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [messages, setMessages] = useState([]);
  const [answerText, setAnswerText] = useState('');
  const [loading, setLoading] = useState(false);

  // Voice Features
  const [voiceOptions, setVoiceOptions] = useState(null);
  const [selectedVoice, setSelectedVoice] = useState('en-US-thomas');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [autoPlayVoice, setAutoPlayVoice] = useState(true);
  const [showVoicePanel, setShowVoicePanel] = useState(true);

  // Results
  const [finalScore, setFinalScore] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [reportData, setReportData] = useState(null);

  // References
  const messagesEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioPlayerRef = useRef(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch voice options on mount
  useEffect(() => {
    fetchVoiceOptions();
  }, []);

  const fetchVoiceOptions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/dynamic-interview/voices');
      if (response.data.success) {
        setVoiceOptions(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching voices:', error);
    }
  };

  // Start Interview
  const startInterview = async () => {
    if (!selectedCandidate) {
      alert('Please select a candidate');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/dynamic-interview/start', {
        candidateProfile: {
          name: selectedCandidate.name,
          skills: selectedCandidate.skills,
          experience: selectedCandidate.experience,
        },
        jobRole: 'Full Stack Developer',
      });

      if (response.data.success) {
        const { sessionId: newSessionId, firstQuestion, totalQuestions: total } = response.data.data;

        setSessionId(newSessionId);
        setCurrentQuestion(firstQuestion);
        setTotalQuestions(total);
        setQuestionNumber(1);
        setInterviewStarted(true);
        setMessages([
          {
            type: 'ai',
            text: `Hello ${selectedCandidate.name}! I'm your AI interviewer. Let's start with our first question.`,
            timestamp: new Date(),
          },
          {
            type: 'ai',
            text: firstQuestion.question,
            timestamp: new Date(),
            isQuestion: true,
          },
        ]);
      }
    } catch (error) {
      console.error('Error starting interview:', error);
      alert('Failed to start interview');
    } finally {
      setLoading(false);
    }
  };

  // Submit Answer
  const submitAnswer = async () => {
    if (!answerText.trim() && !recordedAudio) {
      alert('Please provide an answer');
      return;
    }

    setLoading(true);
    try {
      const answerToSubmit = answerText.trim() || 'Voice answer recorded';

      const response = await axios.post('http://localhost:5000/api/dynamic-interview/submit-answer', {
        sessionId,
        answer: answerToSubmit,
        voiceId: selectedVoice,
      });

      if (response.data.success) {
        // Add user answer to messages
        setMessages((prev) => [
          ...prev,
          {
            type: 'user',
            text: answerToSubmit,
            timestamp: new Date(),
            score: response.data.answerScore,
          },
        ]);

        // Add AI feedback
        if (response.data.feedback) {
          setMessages((prev) => [
            ...prev,
            {
              type: 'ai',
              text: response.data.feedback,
              timestamp: new Date(),
            },
          ]);
        }

        // Play AI voice if available
        if (response.data.audioUrl && autoPlayVoice) {
          playAIVoice(response.data.audioUrl);
        }

        // Check if interview is complete
        if (response.data.interviewComplete) {
          setInterviewComplete(true);
          setFinalScore(response.data.finalScore);
          setRecommendation(response.data.recommendation);

          // Add completion message
          setMessages((prev) => [
            ...prev,
            {
              type: 'ai',
              text: `Thank you for the interview! Your final score is ${response.data.finalScore}. ${response.data.recommendation}`,
              timestamp: new Date(),
            },
          ]);
        } else {
          // Add next question
          if (response.data.nextQuestion) {
            setCurrentQuestion(response.data.nextQuestion);
            setQuestionNumber(response.data.nextQuestionNumber);

            setMessages((prev) => [
              ...prev,
              {
                type: 'ai',
                text: response.data.nextQuestion.question,
                timestamp: new Date(),
                isQuestion: true,
              },
            ]);
          }
        }

        // Clear input
        setAnswerText('');
        setRecordedAudio(null);
        audioChunksRef.current = [];
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      alert('Failed to submit answer');
    } finally {
      setLoading(false);
    }
  };

  // Voice Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio(audioUrl);

        // Convert to text using Web Speech API (as fallback/supplement)
        convertSpeechToText(stream);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  // Speech to Text Conversion
  const convertSpeechToText = (stream) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Speech Recognition not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.language = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      if (event.results[event.results.length - 1].isFinal) {
        setAnswerText(transcript);
      }
    };

    recognition.start();
  };

  // Play AI Voice Response
  const playAIVoice = (audioUrl) => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.src = audioUrl;
      audioPlayerRef.current.play().catch((error) => {
        console.error('Error playing audio:', error);
      });
    }
  };

  // End Interview
  const endInterview = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/dynamic-interview/end-session', {
        sessionId,
      });

      if (response.data.success) {
        setReportData(response.data.data);
      }
    } catch (error) {
      console.error('Error ending interview:', error);
    }
  };

  // Candidate Selection Screen
  if (!interviewStarted) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>🎤 Dynamic AI Interview with Voice</h1>
          <p style={styles.subtitle}>
            Real-time questions generated based on your answers with AI voice responses
          </p>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Select Candidate</h2>
            <div style={styles.candidateGrid}>
              {candidates.map((candidate) => (
                <div
                  key={candidate.id}
                  onClick={() => setSelectedCandidate(candidate)}
                  style={{
                    ...styles.candidateCard,
                    borderColor: selectedCandidate?.id === candidate.id ? '#6366f1' : '#cbd5e1',
                    backgroundColor:
                      selectedCandidate?.id === candidate.id ? '#1e1f3a' : 'transparent',
                  }}
                >
                  <h3 style={styles.candidateName}>{candidate.name}</h3>
                  <div style={styles.skillsContainer}>
                    {candidate.skills.map((skill, idx) => (
                      <span key={idx} style={styles.skillBadge}>
                        {skill}
                      </span>
                    ))}
                  </div>
                  <p style={styles.experience}>
                    {candidate.experience[0].years}+ years @ {candidate.experience[0].company}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={startInterview}
            disabled={!selectedCandidate || loading}
            style={{
              ...styles.button,
              opacity: !selectedCandidate || loading ? 0.5 : 1,
              cursor: !selectedCandidate || loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Starting Interview...' : '▶️ Start Interview'}
          </button>
        </div>
      </div>
    );
  }

  // Interview Screen
  if (!interviewComplete) {
    return (
      <div style={styles.container}>
        <div style={styles.interviewLayout}>
          {/* Left: Chat Area */}
          <div style={styles.chatArea}>
            <div style={styles.header}>
              <h2 style={styles.headerTitle}>
                Interview with {selectedCandidate.name} ({questionNumber}/{totalQuestions})
              </h2>
              <div style={styles.progressBar}>
                <div
                  style={{
                    ...styles.progressFill,
                    width: `${(questionNumber / totalQuestions) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div style={styles.messagesContainer}>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    ...styles.message,
                    ...(msg.type === 'user' ? styles.userMessage : styles.aiMessage),
                  }}
                >
                  <div style={styles.messageContent}>
                    <p style={styles.messageText}>{msg.text}</p>
                    {msg.score && (
                      <span style={styles.scoreBadge}>Score: {msg.score}/100</span>
                    )}
                  </div>
                  {msg.type === 'ai' && msg.isQuestion && (
                    <span style={styles.questionLabel}>❓ Question</span>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div style={styles.inputArea}>
              <textarea
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="Type your answer here or use voice recording..."
                style={styles.textarea}
              />

              <div style={styles.controlButtons}>
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  style={{
                    ...styles.voiceButton,
                    backgroundColor: isRecording ? '#ef4444' : '#6366f1',
                  }}
                >
                  {isRecording ? '⏹️ Stop Recording' : '🎙️ Record Answer'}
                </button>

                {recordedAudio && (
                  <div style={styles.audioPreview}>
                    <audio controls style={styles.audioPlayer}>
                      <source src={recordedAudio} type="audio/webm" />
                    </audio>
                  </div>
                )}

                <button
                  onClick={submitAnswer}
                  disabled={loading}
                  style={{
                    ...styles.submitButton,
                    opacity: loading ? 0.5 : 1,
                  }}
                >
                  {loading ? '⏳ Processing...' : '✓ Submit Answer'}
                </button>
              </div>
            </div>
          </div>

          {/* Right: Voice Panel */}
          {showVoicePanel && (
            <div style={styles.voicePanel}>
              <h3 style={styles.panelTitle}>🔊 Voice Settings</h3>

              <div style={styles.settingGroup}>
                <label style={styles.label}>AI Voice:</label>
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  style={styles.select}
                >
                  <optgroup label="Male Voices">
                    <option value="en-US-thomas">Thomas (Professional)</option>
                    <option value="en-US-matthew">Matthew (Friendly)</option>
                    <option value="en-US-mike">Mike (Casual)</option>
                  </optgroup>
                  <optgroup label="Female Voices">
                    <option value="en-US-sarah">Sarah (Professional)</option>
                    <option value="en-US-emma">Emma (Friendly)</option>
                    <option value="en-US-olivia">Olivia (Energetic)</option>
                  </optgroup>
                </select>
              </div>

              <div style={styles.settingGroup}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={autoPlayVoice}
                    onChange={(e) => setAutoPlayVoice(e.target.checked)}
                    style={styles.checkbox}
                  />
                  Auto-play AI Voice
                </label>
              </div>

              <audio ref={audioPlayerRef} style={{ display: 'none' }} />

              <div style={styles.infoBox}>
                <h4 style={styles.infoTitle}>💡 Tips:</h4>
                <ul style={styles.tipsList}>
                  <li>Speak clearly when recording</li>
                  <li>Questions are generated dynamically</li>
                  <li>Listen to AI feedback carefully</li>
                  <li>Take time to provide detailed answers</li>
                  <li>Stay professional and positive</li>
                </ul>
              </div>

              <button
                onClick={endInterview}
                style={styles.endButton}
              >
                ⏹️ End Interview
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Interview Complete Screen
  return (
    <div style={styles.container}>
      <div style={styles.resultCard}>
        <h1 style={styles.resultTitle}>✅ Interview Complete!</h1>

        <div style={styles.scoreSection}>
          <div style={styles.scoreCircle}>
            <div style={styles.scoreValue}>{finalScore}</div>
            <div style={styles.scoreLabel}>Final Score</div>
          </div>

          <div style={styles.recommendationBox}>
            <h3 style={styles.recommendationTitle}>Decision:</h3>
            <p style={styles.recommendationText}>{recommendation}</p>
          </div>
        </div>

        {reportData && (
          <div style={styles.reportSection}>
            <h3 style={styles.reportTitle}>📊 Interview Report</h3>

            <div style={styles.reportGrid}>
              <div style={styles.reportItem}>
                <span style={styles.reportLabel}>Questions Asked:</span>
                <span style={styles.reportValue}>{reportData.totalQuestionsAsked}</span>
              </div>
              <div style={styles.reportItem}>
                <span style={styles.reportLabel}>Duration:</span>
                <span style={styles.reportValue}>
                  {Math.floor(reportData.totalDuration / 60)}m {reportData.totalDuration % 60}s
                </span>
              </div>
            </div>

            {reportData.strengths && reportData.strengths.length > 0 && (
              <div style={styles.listSection}>
                <h4 style={styles.listTitle}>💪 Strengths:</h4>
                <ul style={styles.list}>
                  {reportData.strengths.map((strength, idx) => (
                    <li key={idx} style={styles.listItem}>
                      {strength.area} (Score: {strength.score})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {reportData.weaknesses && reportData.weaknesses.length > 0 && (
              <div style={styles.listSection}>
                <h4 style={styles.listTitle}>📈 Areas for Improvement:</h4>
                <ul style={styles.list}>
                  {reportData.weaknesses.map((weakness, idx) => (
                    <li key={idx} style={styles.listItem}>
                      {weakness.area} (Score: {weakness.score})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => window.location.reload()}
          style={styles.restartButton}
        >
          🔄 Start New Interview
        </button>
      </div>
    </div>
  );
};

// ============ STYLES ============

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #050810 0%, #0a0e27 50%, #1a1f35 100%)',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
  },

  // Candidate Selection
  card: {
    maxWidth: '1000px',
    margin: '0 auto',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '40px',
    color: '#f8fafc',
  },

  title: {
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '10px',
    textAlign: 'center',
    color: '#f8fafc',
  },

  subtitle: {
    fontSize: '16px',
    color: '#cbd5e1',
    textAlign: 'center',
    marginBottom: '30px',
  },

  section: {
    marginBottom: '40px',
  },

  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '20px',
    color: '#f8fafc',
  },

  candidateGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },

  candidateCard: {
    padding: '20px',
    border: '2px solid #cbd5e1',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: 'rgba(255, 255, 255, 0.02)',
  },

  candidateName: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: '10px',
  },

  skillsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '10px',
  },

  skillBadge: {
    display: 'inline-block',
    padding: '4px 10px',
    background: '#6366f1',
    borderRadius: '20px',
    fontSize: '12px',
    color: '#fff',
  },

  experience: {
    fontSize: '14px',
    color: '#cbd5e1',
  },

  button: {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    fontWeight: '600',
    background: '#6366f1',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },

  // Interview Layout
  interviewLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr 300px',
    gap: '20px',
    maxWidth: '1400px',
    margin: '0 auto',
    height: '90vh',
  },

  chatArea: {
    display: 'flex',
    flexDirection: 'column',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    overflow: 'hidden',
  },

  header: {
    padding: '20px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'rgba(99, 102, 241, 0.1)',
  },

  headerTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: '10px',
  },

  progressBar: {
    width: '100%',
    height: '6px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '3px',
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
    transition: 'width 0.3s ease',
  },

  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },

  message: {
    padding: '12px 16px',
    borderRadius: '8px',
    maxWidth: '70%',
    animation: 'slideIn 0.3s ease',
  },

  userMessage: {
    alignSelf: 'flex-end',
    background: '#6366f1',
    color: '#fff',
  },

  aiMessage: {
    alignSelf: 'flex-start',
    background: 'rgba(255, 255, 255, 0.1)',
    color: '#f8fafc',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },

  messageContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  messageText: {
    margin: 0,
    fontSize: '14px',
    lineHeight: '1.5',
  },

  scoreBadge: {
    fontSize: '12px',
    color: '#10b981',
    fontWeight: '600',
  },

  questionLabel: {
    fontSize: '11px',
    color: '#f59e0b',
    marginTop: '4px',
  },

  inputArea: {
    padding: '20px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'rgba(0, 0, 0, 0.2)',
  },

  textarea: {
    width: '100%',
    padding: '12px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    color: '#f8fafc',
    fontSize: '14px',
    minHeight: '80px',
    fontFamily: 'inherit',
    resize: 'none',
    marginBottom: '12px',
  },

  controlButtons: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    alignItems: 'center',
  },

  voiceButton: {
    padding: '10px 16px',
    background: '#6366f1',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
  },

  audioPreview: {
    flex: 1,
    minWidth: '200px',
  },

  audioPlayer: {
    width: '100%',
    height: '32px',
  },

  submitButton: {
    padding: '10px 20px',
    background: '#10b981',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
  },

  // Voice Panel
  voicePanel: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '20px',
    color: '#f8fafc',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },

  panelTitle: {
    fontSize: '16px',
    fontWeight: '600',
    margin: 0,
    color: '#f8fafc',
  },

  settingGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  label: {
    fontSize: '13px',
    color: '#cbd5e1',
    fontWeight: '500',
  },

  select: {
    padding: '8px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '6px',
    color: '#f8fafc',
    fontSize: '13px',
    cursor: 'pointer',
  },

  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    color: '#cbd5e1',
  },

  checkbox: {
    cursor: 'pointer',
    width: '16px',
    height: '16px',
  },

  infoBox: {
    background: 'rgba(99, 102, 241, 0.1)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    borderRadius: '8px',
    padding: '12px',
  },

  infoTitle: {
    fontSize: '13px',
    fontWeight: '600',
    margin: '0 0 8px 0',
    color: '#6366f1',
  },

  tipsList: {
    margin: 0,
    paddingLeft: '20px',
    fontSize: '12px',
    color: '#cbd5e1',
    lineHeight: '1.6',
  },

  endButton: {
    padding: '10px',
    background: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '13px',
    transition: 'all 0.3s ease',
  },

  // Results
  resultCard: {
    maxWidth: '800px',
    margin: '0 auto',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '40px',
    color: '#f8fafc',
  },

  resultTitle: {
    fontSize: '32px',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: '30px',
    color: '#10b981',
  },

  scoreSection: {
    display: 'grid',
    gridTemplateColumns: '200px 1fr',
    gap: '30px',
    marginBottom: '40px',
    alignItems: 'center',
  },

  scoreCircle: {
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0 auto',
  },

  scoreValue: {
    fontSize: '60px',
    fontWeight: '700',
    color: '#fff',
  },

  scoreLabel: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: '8px',
  },

  recommendationBox: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    borderRadius: '12px',
    padding: '20px',
  },

  recommendationTitle: {
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 10px 0',
    color: '#6366f1',
  },

  recommendationText: {
    fontSize: '18px',
    fontWeight: '600',
    margin: 0,
    color: '#f8fafc',
  },

  reportSection: {
    marginBottom: '30px',
  },

  reportTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '15px',
    color: '#f8fafc',
  },

  reportGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '15px',
    marginBottom: '20px',
  },

  reportItem: {
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '15px',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  reportLabel: {
    color: '#cbd5e1',
    fontSize: '14px',
  },

  reportValue: {
    color: '#f8fafc',
    fontSize: '18px',
    fontWeight: '600',
  },

  listSection: {
    marginBottom: '20px',
  },

  listTitle: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '10px',
    color: '#f8fafc',
  },

  list: {
    margin: 0,
    paddingLeft: '20px',
  },

  listItem: {
    color: '#cbd5e1',
    marginBottom: '8px',
    lineHeight: '1.6',
  },

  restartButton: {
    width: '100%',
    padding: '14px',
    background: '#6366f1',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
};

export default DynamicAIInterview;
