# 📚 Dynamic AI Interview - Visual Reference Guide

## System Components

### 1. Frontend Layer
```
┌─────────────────────────────────────────────────────────┐
│              DynamicAIInterview.jsx Component            │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────┐          ┌────────────────────┐  │
│  │ Candidate Select │          │  Interview Screen  │  │
│  │ ├─ Select        │          │  ├─ Chat area      │  │
│  │ ├─ Skills show   │          │  ├─ Input textarea │  │
│  │ ├─ Experience    │          │  ├─ Voice record   │  │
│  │ └─ Start button  │          │  ├─ Progress bar   │  │
│  └──────────────────┘          └────────────────────┘  │
│                                                          │
│  ┌──────────────────┐          ┌────────────────────┐  │
│  │  Voice Panel     │          │ Results Screen     │  │
│  │ ├─ Voice select  │          │ ├─ Final score     │  │
│  │ ├─ Auto-play     │          │ ├─ Recommendation  │  │
│  │ ├─ Tips          │          │ ├─ Analytics       │  │
│  │ └─ End button    │          │ └─ Restart button  │  │
│  └──────────────────┘          └────────────────────┘  │
│                                                          │
└─────────────────────────────────────────────────────────┘
         │ React Hooks                  API Calls
         │ useState, useEffect          Axios
         │ useRef for audio
         ▼
    Web Speech API
    ├─ Recording
    ├─ Recognition (Speech-to-Text)
    └─ Playback
```

### 2. Backend Layer
```
┌──────────────────────────────────────────────────────┐
│        API Routes: /api/dynamic-interview            │
├──────────────────────────────────────────────────────┤
│                                                       │
│  /start                                              │
│  ├─ Input: candidateProfile, jobRole                │
│  ├─ Process:                                        │
│  │  1. generateDynamicQuestions() (25 questions)   │
│  │  2. Create session in memory                    │
│  │  3. Get first question                          │
│  └─ Output: sessionId, firstQuestion               │
│                                                       │
│  /submit-answer                                      │
│  ├─ Input: sessionId, answer, voiceId              │
│  ├─ Process:                                        │
│  │  1. evaluateAnswer() → score (0-100)            │
│  │  2. generateFeedback()                          │
│  │  3. generateFollowUpQuestion()                  │
│  │  4. generateSpeech() via Murf AI                │
│  │  5. Move to next question                       │
│  └─ Output: feedback, nextQuestion, audioUrl       │
│                                                       │
│  /session/:sessionId                                 │
│  ├─ Input: sessionId                               │
│  └─ Output: Session status, progress               │
│                                                       │
│  /end-session                                        │
│  ├─ Input: sessionId                               │
│  ├─ Process: generateReport()                      │
│  └─ Output: Final report with analytics            │
│                                                       │
│  /voices                                             │
│  └─ Output: List of available voices               │
│                                                       │
└──────────────────────────────────────────────────────┘
         │
         ├─> aiQuestionGenerator.js
         │   ├─ generateDynamicQuestions()
         │   ├─ evaluateAnswer()
         │   └─ generateFollowUpQuestion()
         │
         └─> murf.js
             ├─ generateSpeech()
             └─ getAvailableVoices()
```

### 3. Murf AI Integration
```
┌─────────────────────────────────────────────────┐
│          Murf AI Voice Service                   │
├─────────────────────────────────────────────────┤
│                                                  │
│  generateSpeech(text, options)                  │
│  ├─ Input:                                     │
│  │  ├─ text: "Response text to convert"        │
│  │  ├─ voiceId: "en-US-thomas"                 │
│  │  ├─ rate: 0.95 (speech speed)              │
│  │  ├─ pitch: 1.0 (voice pitch)               │
│  │  └─ emotion: "professional"                │
│  │                                             │
│  ├─ Process:                                   │
│  │  1. HTTP POST to Murf API                   │
│  │  2. Include API key in headers              │
│  │  3. Receive audio URL in response           │
│  │                                             │
│  └─ Output: Audio URL (MP3)                    │
│                                                  │
│  generateInterviewerResponse()                  │
│  ├─ Combines feedback + follow-up              │
│  ├─ Calls generateSpeech()                     │
│  └─ Returns full response package              │
│                                                  │
│  Available Voices:                              │
│  ├─ Male:                                      │
│  │  ├─ Thomas (Professional)                   │
│  │  ├─ Matthew (Friendly)                      │
│  │  └─ Mike (Casual)                           │
│  │                                             │
│  └─ Female:                                    │
│     ├─ Sarah (Professional)                    │
│     ├─ Emma (Friendly)                         │
│     └─ Olivia (Energetic)                      │
│                                                  │
└─────────────────────────────────────────────────┘
         │
         ├─ HTTPS POST Request
         │  https://api.murf.ai/v1/speech/generate
         │
         └─ API Key: MURF_API_KEY (from .env)
```

---

## Data Flow Diagram

### Interview Session Lifecycle
```
┌─────────────┐
│   START     │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────────┐
│ 1. Candidate Selection                      │
│    - User selects candidate                 │
│    - Sends: candidateProfile + jobRole      │
└─────────────┬───────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│ 2. Initialize Interview                     │
│    POST /api/dynamic-interview/start        │
│    Returns: sessionId, firstQuestion        │
│    Questions generated: 25 total            │
└─────────────┬───────────────────────────────┘
              │
              ▼
     ┌────────────────────┐
     │ Display Question 1 │
     └────────────────────┘
              │
              ▼
     ┌────────────────────────────┐
     │ 3. Candidate Answers       │
     │ □ Text input OR            │
     │ 🎙️ Voice recording        │
     └────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│ 4. Submit Answer                            │
│    POST /api/dynamic-interview/submit-answer│
│    Sends: sessionId, answer, voiceId        │
└─────────────┬───────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│ 5. Backend Processing                       │
│    a) Evaluate answer → score (0-100)       │
│    b) Generate feedback                     │
│    c) Generate next question (dynamic)      │
│    d) Call Murf AI with response text       │
│    e) Get audio URL from Murf               │
│    f) Prepare response package              │
└─────────────┬───────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│ 6. Frontend Receives Response                │
│    - Answer score: 85                        │
│    - Feedback text                           │
│    - Next question                           │
│    - Audio URL (AI voice)                    │
└─────────────┬───────────────────────────────┘
              │
              ▼
     ┌──────────────────────────┐
     │ 7. Display Results        │
     │ - Score badge: 85/100    │
     │ - Feedback message        │
     │ - Play audio response     │
     │ - Show next question      │
     │ - Update progress bar     │
     └──────────────────────────┘
              │
              ▼
     ┌──────────────────────────────────┐
     │ Questions Answered: 1/25 ✓       │
     │ Average Score: 85.00             │
     └──────────────────────────────────┘
              │
              ├─ If question < 25:
              │  └─> Go to Step 3 (Next Question)
              │
              └─ If question = 25:
                 └─> Go to Step 8

     ┌────────────────────────────────┐
     │ 8. Interview Complete          │
     │    POST /api/dynamic-interview/ │
     │        end-session             │
     └──────────────────┬─────────────┘
                        │
                        ▼
     ┌───────────────────────────────────┐
     │ 9. Generate Report                │
     │    - Final score: 82/100          │
     │    - Recommendation: HIRE         │
     │    - Strengths: [...]             │
     │    - Weaknesses: [...]            │
     │    - Category scores              │
     └───────────────────┬───────────────┘
                         │
                         ▼
     ┌──────────────────────────────┐
     │ 10. Display Results Screen    │
     │     - Score circle: 82        │
     │     - Recommendation badge    │
     │     - Analytics breakdown     │
     │     - Download/Share buttons  │
     │     - Restart option          │
     └──────────────────┬───────────┘
                        │
                        ▼
                  ┌──────────┐
                  │   END    │
                  └──────────┘
```

---

## Scoring System Breakdown

### Answer Evaluation Formula
```
┌────────────────────────────────────────┐
│ Final Score = Weighted Average         │
├────────────────────────────────────────┤
│                                        │
│ Score = (R × 0.40) + (C × 0.30) +     │
│         (K × 0.20) + (Co × 0.10)      │
│                                        │
│ Where:                                 │
│ R  = Relevance (40%)                  │
│ C  = Completeness (30%)               │
│ K  = Keywords (20%)                   │
│ Co = Communication (10%)              │
│                                        │
└────────────────────────────────────────┘

Example Calculation:
─────────────────

Answer: "I have 3 years of experience with JavaScript..."

R (Relevance)      = 90/100  (Directly answers question)
C (Completeness)   = 85/100  (Fairly detailed)
K (Keywords)       = 80/100  (Covered most key concepts)
Co (Communication) = 75/100  (Could be clearer)

Final = (90×0.40) + (85×0.30) + (80×0.20) + (75×0.10)
      = 36 + 25.5 + 16 + 7.5
      = 85/100 ✓
```

### Score Interpretation
```
┌─────────────────────────────────────────┐
│ Score Range      │ Interpretation       │
├──────────────────┼──────────────────────┤
│ 90-100          │ Excellent            │
│                 │ - Deep knowledge     │
│                 │ - Clear articulation │
│                 │ - Well-structured    │
│                 │ ACTION: Hire         │
├──────────────────┼──────────────────────┤
│ 80-89           │ Very Good            │
│                 │ - Solid knowledge    │
│                 │ - Good communication │
│                 │ - Minor gaps         │
│                 │ ACTION: Hire         │
├──────────────────┼──────────────────────┤
│ 70-79           │ Good                 │
│                 │ - Adequate knowledge │
│                 │ - Acceptable clarity │
│                 │ - Notable gaps       │
│                 │ ACTION: Consider     │
├──────────────────┼──────────────────────┤
│ 60-69           │ Satisfactory         │
│                 │ - Basic knowledge    │
│                 │ - Limited detail     │
│                 │ - Unclear areas      │
│                 │ ACTION: Review       │
├──────────────────┼──────────────────────┤
│ <60             │ Below Expected       │
│                 │ - Insufficient       │
│                 │ - Poor clarity       │
│                 │ - Major gaps         │
│                 │ ACTION: Reject       │
└─────────────────────────────────────────┘
```

### Final Interview Score
```
┌─────────────────────────────────────┐
│ Final Score = Average of 25 Scores  │
│                                     │
│ FS = (S₁ + S₂ + ... + S₂₅) / 25   │
├─────────────────────────────────────┤
│                                     │
│ Example:                            │
│ Q1: 85, Q2: 90, Q3: 78, ... Q25:82│
│                                     │
│ FS = (85+90+78+...+82) / 25        │
│ FS = 82 (Average)                  │
│                                     │
└─────────────────────────────────────┘

Hiring Recommendation:
─────────────────────

FS ≥ 85  → 🟢 STRONG HIRE
         "Exceptional performance"

75 ≤ FS < 85 → 🟢 HIRE
             "Good performance, ready"

65 ≤ FS < 75 → 🟡 MAYBE
             "Needs discussion"

50 ≤ FS < 65 → 🟡 REVIEW
             "Borderline case"

FS < 50  → 🔴 NO HIRE
         "Below expectations"
```

---

## Voice Processing Pipeline

### Voice Recording Flow
```
┌──────────────────────────────────────────┐
│        Candidate Voice Input             │
├──────────────────────────────────────────┤
│                                          │
│  Step 1: Start Recording                 │
│  ────────────────────────────────────    │
│  🎙️ User clicks "Record Answer"         │
│  │                                       │
│  └─> MediaRecorder starts                │
│      Audio chunks collected              │
│                                          │
│  Step 2: User Speaks                     │
│  ──────────────────────────────────────  │
│  Audio bytes → Blob storage              │
│                                          │
│  Step 3: Stop Recording                  │
│  ──────────────────────────────────────  │
│  ⏹️ User clicks "Stop Recording"        │
│  │                                       │
│  ├─> Combine audio chunks                │
│  ├─> Create Blob (audio/webm)           │
│  ├─> Generate playable URL               │
│  └─> Show audio player                   │
│                                          │
│  Step 4: Convert Speech to Text          │
│  ──────────────────────────────────────  │
│  Web Speech API starts recognition       │
│  │                                       │
│  ├─ Listen to audio stream               │
│  ├─ Convert speech → text in real-time  │
│  └─ Display transcribed text             │
│                                          │
│  Step 5: Submit Answer                   │
│  ──────────────────────────────────────  │
│  ✓ Submit button                         │
│  │                                       │
│  ├─> Send transcribed text to backend    │
│  ├─> Backend evaluates answer            │
│  └─> Display score and feedback          │
│                                          │
└──────────────────────────────────────────┘
```

### AI Voice Response Flow
```
┌──────────────────────────────────────────┐
│        AI Voice Generation               │
├──────────────────────────────────────────┤
│                                          │
│  Step 1: Generate Response Text          │
│  ──────────────────────────────────────  │
│  Backend creates response string:        │
│  "Good answer. Follow-up: Can you..."   │
│                                          │
│  Step 2: Call Murf AI                    │
│  ──────────────────────────────────────  │
│  POST https://api.murf.ai/v1/.../gen   │
│  {                                       │
│    text: "...",                          │
│    voiceId: "en-US-thomas",             │
│    rate: 0.95,                           │
│    pitch: 1.0,                           │
│    emotion: "professional"               │
│  }                                       │
│                                          │
│  Step 3: Murf Processing                 │
│  ──────────────────────────────────────  │
│  Murf API:                               │
│  ├─ Parse text                           │
│  ├─ Apply voice characteristics          │
│  ├─ Generate speech synthesis            │
│  ├─ Encode to MP3                        │
│  └─ Return audio URL                     │
│                                          │
│  Step 4: Return Audio URL                │
│  ──────────────────────────────────────  │
│  Response:                               │
│  {                                       │
│    audioUrl: "https://...",              │
│    feedback: "Good answer...",           │
│    nextQuestion: {...}                   │
│  }                                       │
│                                          │
│  Step 5: Play Audio                      │
│  ──────────────────────────────────────  │
│  Frontend:                               │
│  ├─ Create <audio> element               │
│  ├─ Set src = audioUrl                   │
│  ├─ Auto-play (if enabled)              │
│  └─ Show player controls                 │
│                                          │
│  Step 6: Display Next Question           │
│  ──────────────────────────────────────  │
│  ├─ Update chat with AI message          │
│ ├─ Show next question                   │
│  └─ Wait for user to answer              │
│                                          │
└──────────────────────────────────────────┘
```

---

## State Management

### Session State
```
Session = {
  sessionId: "session_1733564800001_abc123",
  candidateProfile: {
    name: "John Doe",
    skills: ["JavaScript", "React"],
    experience: [{ company: "Tech Corp", years: 3 }]
  },
  jobRole: "Full Stack Developer",
  questions: [25 question objects],
  currentQuestionIndex: 0-24,
  answers: [
    {
      questionIndex: 0,
      question: "Tell me about...",
      answer: "I have...",
      score: 85,
      timestamp: Date
    },
    ...
  ],
  scores: [85, 90, 78, ...],
  startTime: Date
}
```

### Frontend Component State
```
DynamicAIInterview = {
  // Session
  sessionId: null,
  interviewStarted: false,
  interviewComplete: false,
  
  // Candidate
  selectedCandidate: null,
  candidates: [...],
  
  // Question & Chat
  currentQuestion: {...},
  questionNumber: 0,
  totalQuestions: 0,
  messages: [{type, text, score?, timestamp}, ...],
  
  // Input
  answerText: "",
  recordedAudio: null,
  loading: false,
  
  // Voice
  voiceOptions: {...},
  selectedVoice: "en-US-thomas",
  isRecording: false,
  autoPlayVoice: true,
  showVoicePanel: true,
  
  // Results
  finalScore: null,
  recommendation: null,
  reportData: null
}
```

---

## API Request/Response Examples

### 1. Start Interview
```
REQUEST:
POST /api/dynamic-interview/start
{
  "candidateProfile": {
    "name": "John Doe",
    "skills": ["JavaScript", "React", "Node.js"],
    "experience": [
      { "company": "Tech Corp", "years": 3 }
    ]
  },
  "jobRole": "Full Stack Developer"
}

RESPONSE:
{
  "success": true,
  "message": "Interview session started",
  "data": {
    "sessionId": "session_1733564800_xyz",
    "firstQuestion": {
      "type": "technical",
      "difficulty": "medium",
      "question": "Tell me about your experience with JavaScript",
      "expected_answer_keywords": ["loops", "async", "events"]
    },
    "voiceOptions": {
      "male": [
        { "id": "en-US-thomas", "name": "Thomas", ... },
        ...
      ],
      "female": [...]
    },
    "totalQuestions": 25,
    "currentQuestionNumber": 1
  }
}
```

### 2. Submit Answer
```
REQUEST:
POST /api/dynamic-interview/submit-answer
{
  "sessionId": "session_1733564800_xyz",
  "answer": "I have 3 years of experience with JavaScript...",
  "voiceId": "en-US-thomas"
}

RESPONSE:
{
  "success": true,
  "feedback": "Good detailed response. Let me dig deeper. ",
  "answerScore": 85,
  "evaluation": {
    "relevance": 90,
    "completeness": 85,
    "keywords_matched": 3,
    "communication": 75
  },
  "audioUrl": "https://murf-api.../audio/...mp3",
  "nextQuestion": {
    "type": "technical",
    "difficulty": "hard",
    "question": "Can you provide a specific example?"
  },
  "sessionProgress": {
    "currentQuestion": 2,
    "totalQuestions": 25,
    "questionsAnswered": 1,
    "averageScore": 85.00
  }
}
```

### 3. End Session
```
REQUEST:
POST /api/dynamic-interview/end-session
{
  "sessionId": "session_1733564800_xyz"
}

RESPONSE:
{
  "success": true,
  "message": "Interview ended successfully",
  "data": {
    "sessionId": "session_1733564800_xyz",
    "candidateName": "John Doe",
    "jobRole": "Full Stack Developer",
    "interviewDate": "2024-12-07T10:30:00Z",
    "totalDuration": 1247,
    "finalScore": 82,
    "recommendation": "HIRE - Good performance, ready for role",
    "totalQuestionsAsked": 25,
    "categoryScores": {
      "technical": 84,
      "hr": 78,
      "aptitude": 83,
      "scenario": 81
    },
    "strengths": [
      { "area": "Deep technical knowledge", "score": 92 },
      { "area": "Problem solving", "score": 88 }
    ],
    "weaknesses": [
      { "area": "Communication clarity", "score": 65 }
    ]
  }
}
```

---

## Browser Compatibility

```
┌────────────────┬──────────────────────────┐
│ Feature        │ Browser Support          │
├────────────────┼──────────────────────────┤
│ Web Audio API  │ Chrome, Firefox, Edge    │
│ Web Speech API │ Chrome, Safari, Edge     │
│ MediaRecorder  │ Chrome, Firefox, Edge    │
│ Fetch/Axios    │ All modern browsers      │
│ CSS Grid       │ All modern browsers      │
│ Flexbox        │ All modern browsers      │
│ Async/Await    │ Chrome 55+, Firefox 52+  │
│ ES6            │ All modern browsers      │
└────────────────┴──────────────────────────┘

Recommended:
├─ Chrome/Chromium (Best support)
├─ Firefox (Good support)
├─ Edge (Good support)
└─ Safari 14+ (Fair support)

NOT Supported:
├─ Internet Explorer
└─ Old Safari versions
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────┐
│                   PRODUCTION SETUP                  │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌────────────────────────────────────────────┐    │
│  │  Client (Browser)                          │    │
│  │  ├─ React App (port 3001)                 │    │
│  │  ├─ DynamicAIInterview component          │    │
│  │  └─ Web Speech API for recording          │    │
│  └────────────────┬─────────────────────────┘    │
│                   │ HTTPS                        │
│  ┌────────────────▼─────────────────────────┐    │
│  │  Backend API (port 5000)                  │    │
│  │  ├─ Express.js                            │    │
│  │  ├─ dynamicInterview routes              │    │
│  │  ├─ Session manager (Memory/DB)          │    │
│  │  └─ Question generator                   │    │
│  └────────────────┬─────────────────────────┘    │
│                   │ HTTPS                        │
│  ┌────────────────▼─────────────────────────┐    │
│  │  Murf AI API                              │    │
│  │  └─ /v1/speech/generate                  │    │
│  └─────────────────────────────────────────┘    │
│                                                      │
│  ┌─────────────────────────────────────────────┐  │
│  │  Optional: Database (PostgreSQL/MongoDB)    │  │
│  │  ├─ Interview sessions                      │  │
│  │  ├─ Candidate profiles                      │  │
│  │  └─ Interview reports                       │  │
│  └─────────────────────────────────────────────┘  │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

**This visual reference guide provides a complete overview of the system architecture, data flows, scoring logic, and implementation details.**

Version 1.0 - December 7, 2024

