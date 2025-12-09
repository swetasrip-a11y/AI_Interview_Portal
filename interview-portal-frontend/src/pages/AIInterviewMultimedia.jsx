import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AIInterviewMultimedia() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [candidateProfile, setCandidateProfile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [interviewType, setInterviewType] = useState('text');
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewEnded, setInterviewEnded] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [parsing, setParsing] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [videoActive, setVideoActive] = useState(false);
  const [finalScore, setFinalScore] = useState(null);
  const [finalFeedback, setFinalFeedback] = useState(null);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    fetchInterviewSetup();
  }, [jobId]);

  useEffect(() => {
    if (interviewStarted && !interviewEnded && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && interviewStarted && !interviewEnded && questions.length > 0) {
      handleSubmitInterview();
    }
  }, [timeLeft, interviewStarted, interviewEnded]);

  const fetchInterviewSetup = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const jobRes = await axios.get(`http://localhost:5000/api/jobs/${jobId}`, { headers });
      setJob(jobRes.data);

      const profileRes = await axios.get(`http://localhost:5000/api/candidate/profile`, { headers });
      setCandidateProfile(profileRes.data);

      setLoading(false);
    } catch (err) {
      console.error('Error fetching interview setup:', err);
      setLoading(false);
    }
  };

  const initializeInterview = async (type) => {
    try {
      setParsing(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      let resumeData = candidateProfile || {};

      if (candidateProfile?.resume_text) {
        const parseRes = await axios.post(
          'http://localhost:5000/api/ai-interview/parse-resume',
          { resume_text: candidateProfile.resume_text },
          { headers }
        );
        resumeData = parseRes.data.data;
      }

      const genRes = await axios.post(
        'http://localhost:5000/api/ai-interview/generate-questions',
        {
          resume_data: resumeData,
          job_role: job?.title || 'Software Developer',
          count: 20,
        },
        { headers }
      );

      const dynamicQuestions = genRes.data.data.questions;
      setQuestions(dynamicQuestions);
      setUserAnswers(new Array(dynamicQuestions.length).fill(''));

      const startRes = await axios.post(
        'http://localhost:5000/api/ai-interview/start',
        {
          job_id: jobId,
          interview_type: type,
          questions: dynamicQuestions,
        },
        { headers }
      );

      setSessionId(startRes.data.data.session_id);
      setInterviewType(type);
      setInterviewStarted(true);
      setTimeLeft(dynamicQuestions.length * 120);
      startTimeRef.current = Date.now();

      if (type === 'voice') {
        setTimeout(() => speakQuestion(0), 500);
      }

      if (type === 'video') {
        startVideo();
      }

      setParsing(false);
    } catch (err) {
      console.error('Error initializing interview:', err);
      alert('Failed to initialize interview');
      setParsing(false);
    }
  };

  const speakQuestion = (index) => {
    if ('speechSynthesis' in window && questions[index]) {
      window.speechSynthesis.cancel();
      const text = `Question ${index + 1}: ${questions[index].question}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const submitAnswer = async () => {
    if (!currentAnswer.trim()) {
      alert('Please provide an answer before moving forward');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      await axios.post(
        'http://localhost:5000/api/ai-interview/submit-answer',
        {
          session_id: sessionId,
          question_index: currentQuestion,
          candidate_answer: currentAnswer,
          expected_keywords: questions[currentQuestion]?.expected_answer_keywords || [],
          question_type: questions[currentQuestion]?.type || 'technical',
        },
        { headers }
      );

      const newAnswers = [...userAnswers];
      newAnswers[currentQuestion] = currentAnswer;
      setUserAnswers(newAnswers);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setCurrentAnswer('');
        if (interviewType === 'voice') {
          setTimeout(() => speakQuestion(currentQuestion + 1), 500);
        }
      } else {
        handleSubmitInterview();
      }
    } catch (err) {
      console.error('Error submitting answer:', err);
      alert('Failed to submit answer');
    }
  };

  const handleSubmitInterview = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const interviewDuration = Math.floor((Date.now() - startTimeRef.current) / 1000);

      const completeRes = await axios.post(
        'http://localhost:5000/api/ai-interview/complete',
        {
          session_id: sessionId,
          interview_duration: interviewDuration,
        },
        { headers }
      );

      setFinalScore(completeRes.data.data.final_score);
      setFinalFeedback(completeRes.data.data.feedback);
      setInterviewEnded(true);

      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    } catch (err) {
      console.error('Error completing interview:', err);
      alert('Failed to complete interview');
    }
  };

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setVideoActive(true);
    } catch (err) {
      console.error('Camera error:', err);
      alert('Unable to access camera and microphone');
    }
  };

  const startMicRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      setMicActive(true);

      const chunks = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setCurrentAnswer((prev) => prev + ' [Voice recording captured]');
      };

      mediaRecorder.start();
    } catch (err) {
      console.error('Microphone error:', err);
      alert('Unable to access microphone');
    }
  };

  const stopMicRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setMicActive(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="dashboard" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2>Loading interview setup...</h2>
      </div>
    );
  }

  if (parsing) {
    return (
      <div className="dashboard" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2>🤖 AI Processing...</h2>
        <p style={{ color: '#7a6a8f', marginTop: '20px' }}>
          Parsing your resume and generating personalized questions...
        </p>
      </div>
    );
  }

  if (!interviewStarted) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #050810|#0a0e27|#1a1f35 0%, #050810|#0a0e27|#1a1f35 50%, #050810|#0a0e27|#1a1f35 100%)',
          padding: '40px 20px',
        }}
      >
        <div className="dashboard">
          <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>🤖 AI Interview Mode</h1>

          <div className="user-info" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h3>Select Interview Type</h3>
            <p style={{ color: '#7a6a8f', marginBottom: '30px' }}>
              Choose how you want to attend the AI interview for <strong>{job?.title}</strong>
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '15px',
                marginBottom: '30px',
              }}
            >
              <button
                onClick={() => initializeInterview('text')}
                style={{
                  padding: '20px',
                  border: '2px solid #d4b5e8',
                  background: 'white',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>⌨️</div>
                <h4 style={{ color: '#5a4a6f', margin: '10px 0' }}>Text Interview</h4>
                <p style={{ fontSize: '12px', color: '#7a6a8f' }}>Type your answers</p>
              </button>

              <button
                onClick={() => initializeInterview('voice')}
                style={{
                  padding: '20px',
                  border: '2px solid #d4b5e8',
                  background: 'white',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>🎤</div>
                <h4 style={{ color: '#5a4a6f', margin: '10px 0' }}>Voice Interview</h4>
                <p style={{ fontSize: '12px', color: '#7a6a8f' }}>Speak your answers</p>
              </button>

              <button
                onClick={() => initializeInterview('video')}
                style={{
                  padding: '20px',
                  border: '2px solid #d4b5e8',
                  background: 'white',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  gridColumn: '1 / -1',
                }}
              >
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>📹</div>
                <h4 style={{ color: '#5a4a6f', margin: '10px 0' }}>Video Interview</h4>
                <p style={{ fontSize: '12px', color: '#7a6a8f' }}>Video + Voice + Text (Premium)</p>
              </button>
            </div>

            <button
              onClick={() => navigate('/browse-jobs')}
              className="btn btn-secondary"
              style={{ width: '100%' }}
            >
              ← Back to Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (interviewEnded) {
    const passed = finalScore >= 70;
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #050810|#0a0e27|#1a1f35 0%, #050810|#0a0e27|#1a1f35 50%, #050810|#0a0e27|#1a1f35 100%)',
          padding: '40px 20px',
        }}
      >
        <div className="dashboard">
          <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>✅ Interview Complete</h1>

          <div className="user-info" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <h2
              style={{
                fontSize: '48px',
                color: passed ? '#27ae60' : '#f39c12',
                margin: '20px 0',
              }}
            >
              {Math.round(finalScore)}%
            </h2>

            <p style={{ fontSize: '18px', color: '#7a6a8f', marginBottom: '20px' }}>
              {passed ? '🎉 Congratulations! You Passed!' : '💪 Keep Practicing!'}
            </p>

            <div
              style={{
                background: '#f9f9f9',
                padding: '20px',
                borderRadius: '10px',
                marginBottom: '30px',
                textAlign: 'left',
              }}
            >
              <h4>📋 Interview Feedback</h4>
              <p style={{ color: '#555', lineHeight: '1.6' }}>{finalFeedback}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button onClick={() => navigate('/candidate-interview-scores')} className="btn">
                📊 View All Scores
              </button>
              <button onClick={() => navigate('/browse-jobs')} className="btn btn-secondary">
                🔍 Browse More Jobs
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #050810|#0a0e27|#1a1f35 0%, #050810|#0a0e27|#1a1f35 50%, #050810|#0a0e27|#1a1f35 100%)',
        padding: '20px',
      }}
    >
      <div className="dashboard">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px',
          }}
        >
          <h1>
            🤖 {interviewType.charAt(0).toUpperCase() + interviewType.slice(1)} Interview
          </h1>
          <div
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: timeLeft < 60 ? '#e74c3c' : '#5a4a6f',
              padding: '10px 20px',
              background: timeLeft < 60 ? 'rgba(239, 68, 68, 0.2)' : '#050810|#0a0e27|#1a1f35',
              borderRadius: '8px',
            }}
          >
            ⏱️ {formatTime(timeLeft)}
          </div>
        </div>

        <div
          style={{
            background: 'white',
            padding: '20px',
            borderRadius: '10px',
            marginBottom: '20px',
          }}
        >
          <p style={{ color: '#7a6a8f', marginBottom: '15px' }}>
            Question {currentQuestion + 1} of {questions.length} - <strong>{question?.type?.toUpperCase()}</strong>
          </p>
          <div
            style={{
              width: '100%',
              height: '8px',
              background: '#e6e6e6',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                height: '100%',
                background: '#b89dd9',
                transition: 'width 0.3s',
              }}
            />
          </div>
        </div>

        {interviewType === 'video' && (
          <div
            style={{
              marginBottom: '30px',
              borderRadius: '10px',
              overflow: 'hidden',
              background: '#000',
            }}
          >
            <video
              ref={videoRef}
              autoPlay
              muted
              style={{ width: '100%', height: '300px', objectFit: 'cover' }}
            />
          </div>
        )}

        <div className="user-info" style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#5a4a6f', marginBottom: '15px' }}>{question?.question}</h2>

          {interviewType === 'voice' && (
            <button
              onClick={() => speakQuestion(currentQuestion)}
              style={{
                padding: '10px 20px',
                background: '#b89dd9',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                marginBottom: '20px',
                fontSize: '14px',
              }}
            >
              🔊 Repeat Question
            </button>
          )}
        </div>

        <div className="user-info" style={{ marginBottom: '30px' }}>
          <h3>Your Answer</h3>

          {interviewType === 'text' && (
            <textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Type your answer here..."
              style={{
                width: '100%',
                height: '150px',
                padding: '15px',
                border: '2px solid #d4b5e8',
                borderRadius: '8px',
                fontFamily: 'Arial, sans-serif',
                fontSize: '14px',
                resize: 'vertical',
              }}
            />
          )}

          {interviewType === 'voice' && (
            <div
              style={{
                padding: '20px',
                background: '#050810|#0a0e27|#1a1f35',
                borderRadius: '8px',
                textAlign: 'center',
              }}
            >
              <button
                onClick={!micActive ? startMicRecording : stopMicRecording}
                style={{
                  padding: '15px 30px',
                  background: micActive ? '#e74c3c' : '#27ae60',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  marginBottom: '15px',
                }}
              >
                {micActive ? '⏹️ Stop Recording' : '🎤 Start Recording'}
              </button>
              {currentAnswer && (
                <p style={{ color: '#555', marginTop: '15px' }}>
                  📝 {currentAnswer}
                </p>
              )}
            </div>
          )}

          {interviewType === 'video' && (
            <div
              style={{
                padding: '20px',
                background: '#050810|#0a0e27|#1a1f35',
                borderRadius: '8px',
              }}
            >
              <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type or speak your answer..."
                style={{
                  width: '100%',
                  height: '100px',
                  padding: '15px',
                  border: '2px solid #d4b5e8',
                  borderRadius: '8px',
                  fontFamily: 'Arial, sans-serif',
                  fontSize: '14px',
                  marginBottom: '15px',
                }}
              />
              <button
                onClick={!micActive ? startMicRecording : stopMicRecording}
                style={{
                  padding: '10px 20px',
                  background: micActive ? '#e74c3c' : '#27ae60',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                {micActive ? '⏹️ Stop' : '🎤 Record'}
              </button>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <button
            onClick={() => {
              if (currentQuestion > 0) {
                setCurrentQuestion(currentQuestion - 1);
                setCurrentAnswer(userAnswers[currentQuestion - 1] || '');
              }
            }}
            disabled={currentQuestion === 0}
            className="btn btn-secondary"
            style={{ opacity: currentQuestion === 0 ? 0.5 : 1 }}
          >
            ← Previous
          </button>
          <button
            onClick={submitAnswer}
            className="btn"
            style={{
              background: '#27ae60',
            }}
          >
            {currentQuestion === questions.length - 1 ? '✅ Submit Interview' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
}


