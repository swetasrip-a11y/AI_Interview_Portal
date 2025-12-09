# Real-Time Multimodal Interview System - Architecture & Data Flow

## System Architecture Diagram

```
╔════════════════════════════════════════════════════════════════════════════╗
║                        AI INTERVIEW PLATFORM                              ║
║                   Real-Time Multimodal System (Phase 9)                   ║
╚════════════════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────────────────┐
│                         BROWSER / CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │         AIInterviewRealtime.jsx Component (700+ lines)             │  │
│  │                                                                    │  │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────────┐  │  │
│  │  │  Video Module   │  │  Voice Module   │  │  Chat Module     │  │  │
│  │  │  ├─ Stream      │  │  ├─ Recognition │  │  ├─ Input Box    │  │  │
│  │  │  ├─ Canvas      │  │  ├─ Transcript  │  │  ├─ Messages     │  │  │
│  │  │  ├─ Overlay     │  │  └─ Recording   │  │  └─ Send Button  │  │  │
│  │  │  └─ Metrics     │  │                 │  │                  │  │  │
│  │  └─────────────────┘  └─────────────────┘  └──────────────────┘  │  │
│  │           │                   │                    │              │  │
│  │           └───────────────────┼────────────────────┘              │  │
│  │                               │                                   │  │
│  │           ┌───────────────────┼───────────────────┐               │  │
│  │           ▼                   ▼                   ▼               │  │
│  │  ┌──────────────────────────────────────────────────────────┐    │  │
│  │  │    ENGAGEMENT DASHBOARD                                │    │  │
│  │  │  ├─ Eye Contact Gauge      (0-100%)                   │    │  │
│  │  │  ├─ Confidence Meter       (0-100%)                   │    │  │
│  │  │  ├─ Emotion Display        (Happy/Confident/Neutral)  │    │  │
│  │  │  ├─ Timer Countdown        (120s)                     │    │  │
│  │  │  └─ Question Progress      (X of Y)                   │    │  │
│  │  └──────────────────────────────────────────────────────────┘    │  │
│  │                                                                   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                   │                                     │
│                    ┌──────────────┼──────────────┐                     │
│                    │              │              │                     │
│                    ▼              ▼              ▼                     │
│      ┌─────────────────────────────────────────────────────┐           │
│      │     Web APIs                                       │           │
│      │  ├─ getUserMedia (camera/mic)                      │           │
│      │  ├─ Web Speech API (speech recognition)            │           │
│      │  ├─ MediaRecorder API (audio recording)            │           │
│      │  └─ Canvas API (facial processing)                 │           │
│      └─────────────────────────────────────────────────────┘           │
│                                   │                                     │
└───────────────────────────────────┼─────────────────────────────────────┘
                                    │
                  ┌─────────────────┼─────────────────┐
                  │                 │                 │
                  ▼                 ▼                 ▼
            ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
            │ AXIOS HTTP   │  │ AXIOS HTTP   │  │ AXIOS HTTP   │
            │ POST/GET     │  │ POST/GET     │  │ POST/GET     │
            │ /process-    │  │ /process-    │  │ /send-       │
            │  speech      │  │  facial      │  │  message     │
            └──────┬───────┘  └──────┬───────┘  └──────┬───────┘
                   │                 │                 │
                   └─────────────────┼─────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      EXPRESS.JS BACKEND LAYER                              │
│                      (Node.js on Port 5000)                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │         Middleware                                                 │  │
│  │  ├─ CORS enabled                                                  │  │
│  │  ├─ Body Parser (JSON)                                            │  │
│  │  └─ JWT Authentication (Bearer tokens)                            │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                      │                                     │
│                                      ▼                                     │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │    multimodalInterview.js Router (430 lines)                        │  │
│  │                                                                    │  │
│  │  Endpoints:                                                        │  │
│  │  1. POST /start-session                                           │  │
│  │  2. POST /process-speech                                          │  │
│  │  3. POST /process-facial                                          │  │
│  │  4. POST /send-message                                            │  │
│  │  5. GET  /session-metrics/:id                                    │  │
│  │  6. POST /end-session                                             │  │
│  │                                                                    │  │
│  │  ┌─────────────────┬──────────────────┬──────────────────┐         │  │
│  │  │ Request Parsing │ Auth Validation  │ Response Format  │         │  │
│  │  └────────┬────────┴────────┬─────────┴────────┬─────────┘         │  │
│  │           │                 │                  │                    │  │
│  │           └─────────────────┼──────────────────┘                    │  │
│  │                             │                                       │  │
│  │                             ▼                                       │  │
│  │           ┌──────────────────────────────────┐                     │  │
│  │           │  Session Management              │                     │  │
│  │           │  activeSessions Map               │                     │  │
│  │           │  ├─ sessionId                     │                     │  │
│  │           │  ├─ candidateId                   │                     │  │
│  │           │  ├─ speechMetrics []              │                     │  │
│  │           │  ├─ facialMetrics []              │                     │  │
│  │           │  ├─ chatHistory []                │                     │  │
│  │           │  ├─ emotionHistory []             │                     │  │
│  │           │  └─ engagement {}                 │                     │  │
│  │           └────────────┬─────────────────────┘                     │  │
│  │                        │                                           │  │
│  │        ┌───────────────┼───────────────┐                          │  │
│  │        │               │               │                          │  │
│  │        ▼               ▼               ▼                          │  │
│  │  ┌────────────┐  ┌──────────────┐  ┌──────────┐                │  │
│  │  │ Speech     │  │ Facial       │  │ Chat     │                │  │
│  │  │ Service    │  │ Service      │  │ Service  │                │  │
│  │  │            │  │              │  │          │                │  │
│  │  │ Functions: │  │ Functions:   │  │Functions:│                │  │
│  │  │  - Process │  │  - Detect    │  │ - Generate AI│              │  │
│  │  │  - Validate│  │  - Analyze   │  │ - Evaluate│                │  │
│  │  │  - Analyze │  │  - Emotions  │  │ - Store  │                │  │
│  │  │  - Encode  │  │  - Aggregate │  │ - Summary│                │  │
│  │  └────┬───────┘  └──────┬───────┘  └────┬─────┘                │  │
│  │       │                 │               │                       │  │
│  │       │                 │               │                       │  │
│  └───────┼─────────────────┼───────────────┼───────────────────────┘  │
│          │                 │               │                         │
│          └─────────────────┼───────────────┘                         │
│                            │                                         │
└────────────────────────────┼─────────────────────────────────────────┘
                             │
                    ┌────────┼────────┐
                    │        │        │
                    ▼        ▼        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       DATA PERSISTENCE LAYER                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │         SQLite Database (interview_portal.db)                       │  │
│  │                                                                    │  │
│  │  Tables Used:                                                      │  │
│  │                                                                    │  │
│  │  1. users                                                          │  │
│  │     ├─ id, email, password, full_name, role, created_at          │  │
│  │     └─ Used for: Authentication, candidate identification          │  │
│  │                                                                    │  │
│  │  2. ai_interview_sessions                                         │  │
│  │     ├─ id, candidate_id, job_id, company_id                      │  │
│  │     ├─ interview_type, status, final_score                        │  │
│  │     ├─ ai_feedback (JSON), started_at, completed_at              │  │
│  │     └─ Used for: Store interview records & metrics                │  │
│  │                                                                    │  │
│  │  3. ai_interview_responses                                        │  │
│  │     ├─ id, session_id, question_id                               │  │
│  │     ├─ candidate_answer, ai_evaluation, score                    │  │
│  │     └─ Used for: Store per-question responses                    │  │
│  │                                                                    │  │
│  │  4. questions                                                      │  │
│  │     ├─ id, content, type, difficulty, keywords                    │  │
│  │     └─ Used for: Interview question library                       │  │
│  │                                                                    │  │
│  │  5. jobs                                                           │  │
│  │     ├─ id, company_id, title, description, skills_required       │  │
│  │     └─ Used for: Job information, skill matching                  │  │
│  │                                                                    │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Data Flow Sequence Diagrams

### 1. Speech-to-Text Flow

```
Candidate              Frontend              Backend              Database
    │                     │                     │                    │
    │─ Speaks to Mic ───▶ │                     │                    │
    │                     │─ Web Speech API ──▶ │                    │
    │                     │◀─ Transcript ──────  │                    │
    │                     │                     │                    │
    │                     │ POST /process-speech                     │
    │                     ├─ sessionId ────────▶ │                    │
    │                     ├─ transcript         │                    │
    │                     └─ audioData          │                    │
    │                     │                     │ Process            │
    │                     │                     ├─ Validate          │
    │                     │                     ├─ Analyze Fluency   │
    │                     │                     ├─ Calculate Score   │
    │                     │                     │                    │
    │                     │◀─ Response ────────  │ Store in Session   │
    │                     │ (quality, metrics)   │                    │
    │                     │                     │                    │
    │◀─ Display Metrics ─ │                     │                    │
```

### 2. Facial Recognition Flow

```
Candidate              Frontend              Backend              Database
    │                     │                     │                    │
    │ Faces Camera ──────▶ │                     │                    │
    │                     │ Video Stream ──────▶ │                    │
    │                     │ (1 frame/sec)        │                    │
    │                     │                     │ Process Facial    │
    │                     │ POST /process-facial │ Data              │
    │                     ├─ sessionId ────────▶ │ ├─ Detection      │
    │                     ├─ facialMetrics       │ ├─ Expressions    │
    │                     └─ landmarks           │ ├─ Emotions       │
    │                     │                     │ └─ Eye Gaze       │
    │                     │◀─ Response ────────  │                    │
    │                     │ (emotions, eng.)     │ Store in Session   │
    │                     │                     │                    │
    │◀─ Show Overlay ────  │ (emotion,           │                    │
    │   Eye Contact (%)    │  eye contact %)     │                    │
```

### 3. Chat-Based Q&A Flow

```
Candidate              Frontend              Backend              Database
    │                     │                     │                    │
    │─ Types Response ──▶ │                     │                    │
    │                     │ POST /send-message                       │
    │                     ├─ sessionId ────────▶ │                    │
    │                     ├─ message            │                    │
    │                     └─ currentQuestion    │                    │
    │                     │                     │ Generate AI        │
    │                     │                     │ Response           │
    │                     │                     ├─ Context Analysis  │
    │                     │                     ├─ Skill Evaluation  │
    │                     │                     └─ Quality Score     │
    │                     │◀─ AI Response ─────  │                    │
    │                     │ (reply, quality)    │ Store Messages     │
    │◀─ Show AI Reply ───  │                     │                    │
    │   Quality Score      │                     │                    │
```

### 4. Complete Interview Session Flow

```
START
  │
  ├─▶ POST /start-session
  │      └─▶ Create session in activeSessions Map
  │
  ├─▶ Initialize Question List
  │      └─▶ Load 20 questions
  │
  ├─▶ Start Real-Time Processing Loop
  │      │
  │      ├─ EVERY SECOND:
  │      │   └─▶ Process facial metrics
  │      │       └─▶ POST /process-facial
  │      │
  │      ├─ CONTINUOUS:
  │      │   └─▶ Speech recognition active
  │      │       └─▶ Display live transcript
  │      │
  │      ├─ ON MESSAGE:
  │      │   └─▶ POST /send-message
  │      │       └─▶ Get AI response
  │      │
  │      └─ ON SUBMIT or 2-MIN TIMER:
  │          └─▶ POST /process-speech
  │              └─▶ Evaluate answer
  │              └─▶ Move to next question
  │
  ├─▶ AFTER LAST QUESTION
  │   └─▶ POST /end-session
  │       ├─ Calculate final score
  │       ├─ Store to database
  │       └─ Display results
  │
END

```

## Component Integration Map

```
┌──────────────────────────────────────────────────────────────┐
│                  AIInterviewRealtime.jsx                     │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ State Management (28 variables)                         ││
│  │ ├─ Session: sessionId, mode, active, timer             ││
│  │ ├─ Speech: listening, transcript, metrics              ││
│  │ ├─ Facial: metrics, emotions, eyeContact               ││
│  │ ├─ Chat: messages, input, sending                      ││
│  │ └─ Engagement: eyeContact%, confidence%, scores        ││
│  └─────────────────────────────────────────────────────────┘│
│                          │                                   │
│     ┌────────────────────┼────────────────────┐             │
│     │                    │                    │             │
│     ▼                    ▼                    ▼             │
│  ┌────────────┐  ┌──────────────┐  ┌──────────┐             │
│  │ Speech     │  │ Facial       │  │ Chat     │             │
│  │ Module     │  │ Module       │  │ Module   │             │
│  │            │  │              │  │          │             │
│  │ • init()   │  │ • init()     │  │ • init() │             │
│  │ • start()  │  │ • track()    │  │ • send() │             │
│  │ • submit() │  │ • detect()   │  │ • recv() │             │
│  │ • validate │  │ • analyze()  │  │ • eval() │             │
│  └─────┬──────┘  └──────┬───────┘  └────┬─────┘             │
│        │                 │               │                   │
│        └─────────────────┼───────────────┘                   │
│                          │                                   │
│        ┌─────────────────┼─────────────────┐                │
│        │                 ▼                 │                │
│    ┌───────────────────────────────────┐   │               │
│    │ Engagement Dashboard              │   │               │
│    │ • Eye Contact Gauge               │   │               │
│    │ • Confidence Meter                │   │               │
│    │ • Emotion Display                 │   │               │
│    │ • Real-time Updates               │   │               │
│    └───────────────────────────────────┘   │               │
│                                            │                │
│                                            ▼                │
│                    ┌────────────────────────────────┐       │
│                    │ API Call Handler               │       │
│                    │ • Axios Post/Get               │       │
│                    │ • JWT Auth Headers             │       │
│                    │ • Response Processing          │       │
│                    └────────────────────────────────┘       │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Service Layer Interaction

```
┌──────────────────────────────────────────────────────────────┐
│              Backend Service Layer                           │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ speechToTextService.js                               │  │
│  │ ├─ processSpeechToText(data)                          │  │
│  │ ├─ encodeAudioToBase64(blob)                          │  │
│  │ ├─ validateTranscript(text, type)                    │  │
│  │ └─ analyzeSpeechQuality(transcript)                  │  │
│  │    └─ Returns: {fluency, confidence, hesitations}    │  │
│  └────────────────────┬────────────────────────────────┘  │
│                       │                                     │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ facialRecognitionService.js                          │  │
│  │ ├─ processFacialData(metrics)                         │  │
│  │ ├─ analyzeFacialExpression(landmarks)                │  │
│  │ ├─ detectEmotions(data, expr)                        │  │
│  │ ├─ trackEyeGaze(metrics)                             │  │
│  │ └─ calculateFacialMetricsAggregate(history)          │  │
│  │    └─ Returns: {emotions, eyeContact%, engagement}   │  │
│  └────────────────────┬────────────────────────────────┘  │
│                       │                                     │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ chatService.js                                       │  │
│  │ ├─ generateAIResponse(message, context)               │  │
│  │ ├─ evaluateMessageQuality(message)                   │  │
│  │ ├─ storeMessage(sessionId, sender, msg)              │  │
│  │ ├─ extractMentionedSkills(message)                   │  │
│  │ └─ generateConversationSummary(messages)             │  │
│  │    └─ Returns: {aiReply, quality, confidence}        │  │
│  └────────────────────┬────────────────────────────────┘  │
│                       │                                     │
│                       ▼                                     │
│        ┌──────────────────────────────────┐               │
│        │ activeSessions In-Memory Store    │               │
│        │ Map<sessionId, sessionData>       │               │
│        │ ├─ speechMetrics []               │               │
│        │ ├─ facialMetrics []               │               │
│        │ ├─ chatHistory []                 │               │
│        │ ├─ emotionHistory []              │               │
│        │ └─ engagement {}                  │               │
│        └──────────────────────────────────┘               │
│                       │                                     │
│                       ▼                                     │
│        ┌──────────────────────────────────┐               │
│        │ Database Persistence              │               │
│        │ INSERT INTO ai_interview_sessions │               │
│        │ INSERT INTO ai_interview_responses │               │
│        └──────────────────────────────────┘               │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Scoring Algorithm Flow

```
┌──────────────────────────────────────────────────────────────┐
│                 SCORING SYSTEM                               │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  SPEECH COMPONENT (0-100)                                  │
│  ├─ wordCount        (30%) ──▶ 0-100 score                │
│  ├─ fluency          (30%) ──▶ 0-100 score                │
│  ├─ confidence       (25%) ──▶ 0-100 score                │
│  └─ technicalDepth   (15%) ──▶ 0-100 score                │
│     └─▶ SPEECH_SCORE = weighted average                    │
│                                                              │
│  FACIAL COMPONENT (0-100)                                  │
│  ├─ eyeContact       (40%) ──▶ 0-100 score                │
│  ├─ engagement       (30%) ──▶ 0-100 score                │
│  ├─ emotion          (20%) ──▶ 0-100 score                │
│  └─ expressionClarity (10%) ──▶ 0-100 score               │
│     └─▶ FACIAL_SCORE = weighted average                    │
│                                                              │
│  CHAT COMPONENT (0-100)                                    │
│  ├─ relevance        (30%) ──▶ 0-100 score                │
│  ├─ completeness     (25%) ──▶ 0-100 score                │
│  ├─ clarity          (25%) ──▶ 0-100 score                │
│  └─ technicalDepth   (20%) ──▶ 0-100 score                │
│     └─▶ CHAT_SCORE = weighted average                      │
│                                                              │
│  FINAL SCORE CALCULATION:                                  │
│                                                              │
│  FINAL_SCORE = (SPEECH_SCORE × 0.35)                       │
│              + (FACIAL_SCORE × 0.35)                       │
│              + (CHAT_SCORE × 0.30)                         │
│                                                              │
│  Range: 0 - 100                                            │
│  Interpretation:                                            │
│  ├─ 90-100: Excellent (Strong hire)                        │
│  ├─ 80-89:  Good (Good candidate)                         │
│  ├─ 70-79:  Average (Consider)                             │
│  ├─ 60-69:  Below Average (Review)                         │
│  └─ 0-59:   Poor (Not recommended)                         │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   PRODUCTION SETUP                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Browser (Client)                                    │  │
│  │ ├─ HTTPS://yourdomain.com:443                      │  │
│  │ └─ React App (Vite build)                          │  │
│  └──────────────────┬───────────────────────────────────┘  │
│                     │                                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Load Balancer / Reverse Proxy (Nginx)               │  │
│  │ ├─ Port: 443 (HTTPS)                               │  │
│  │ ├─ SSL Certificate                                 │  │
│  │ └─ Route to backend servers                        │  │
│  └──────────────────┬───────────────────────────────────┘  │
│                     │                                       │
│     ┌───────────────┴───────────────┐                     │
│     │                               │                      │
│     ▼                               ▼                      │
│  Backend Server 1              Backend Server 2            │
│  Node.js + Express             Node.js + Express           │
│  Port: 5000                    Port: 5000                  │
│  ├─ /api/multimodal/*          ├─ /api/multimodal/*       │
│  └─ Services                   └─ Services                 │
│     │                             │                        │
│     └─────────────┬───────────────┘                        │
│                   │                                         │
│                   ▼                                         │
│        ┌─────────────────────────┐                        │
│        │ Redis Session Store     │                        │
│        │ (Distributed Sessions)  │                        │
│        └─────────────────────────┘                        │
│                   │                                         │
│                   ▼                                         │
│        ┌─────────────────────────┐                        │
│        │ SQLite Database         │                        │
│        │ (Persistent Storage)    │                        │
│        └─────────────────────────┘                        │
│                   │                                         │
│                   ▼                                         │
│        ┌─────────────────────────┐                        │
│        │ File Storage            │                        │
│        │ (Audio/Video clips)     │                        │
│        └─────────────────────────┘                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Monitoring & Logging Points

```
Entry Points:
├─ POST /api/multimodal-interview/start-session
│  └─ LOG: Session created, sessionId
│
├─ POST /api/multimodal-interview/process-speech
│  ├─ LOG: Transcription received
│  └─ LOG: Speech score calculated
│
├─ POST /api/multimodal-interview/process-facial
│  ├─ LOG: Facial metrics processed
│  └─ LOG: Emotions detected
│
├─ POST /api/multimodal-interview/send-message
│  ├─ LOG: Message received
│  └─ LOG: AI response generated
│
├─ GET /api/multimodal-interview/session-metrics/:id
│  └─ LOG: Metrics compiled
│
└─ POST /api/multimodal-interview/end-session
   ├─ LOG: Session ending
   ├─ LOG: Final score calculated
   └─ LOG: Data persisted to database

Metrics to Monitor:
├─ Response times per endpoint
├─ Active session count
├─ Database query performance
├─ Memory usage per session
├─ API error rates
└─ Concurrent user count
```

---

This architecture provides a scalable, real-time, multimodal interview platform with comprehensive data collection and analysis capabilities!
