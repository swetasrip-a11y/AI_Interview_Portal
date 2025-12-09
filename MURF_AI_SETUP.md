# Murf AI Voice Integration Setup

## What is Murf AI?
Murf AI provides realistic, high-quality AI voice synthesis with multiple voice options, emotions, and natural speech patterns.

## Getting Started with Murf AI

### Step 1: Sign Up for Murf AI
1. Go to https://www.murf.ai/
2. Click "Sign Up" and create your account
3. Verify your email
4. Complete the onboarding process

### Step 2: Get Your API Key
1. Log in to Murf AI dashboard
2. Go to **Settings** → **API Keys**
3. Click **Generate New API Key**
4. Copy the API key

### Step 3: Set Up Environment Variable
1. Open `.env` file in `interview-portal-backend` directory
2. Add your Murf API key:
   ```
   MURF_API_KEY=your_murf_api_key_here
   ```
3. Save the file

### Step 4: Restart Backend Server
```bash
npm start
```

## Available Voices

### Male Voices
- **Thomas** (Professional) - Best for formal interviews
- **Matthew** (Friendly) - Best for approachable tone
- **Mike** (Casual) - Best for relaxed interviews

### Female Voices
- **Sarah** (Professional) - Best for formal interviews
- **Emma** (Friendly) - Best for warm tone
- **Olivia** (Energetic) - Best for dynamic interviews

## API Endpoints

### 1. Start Interview Session
```
POST /api/dynamic-interview/start

Body:
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

Response:
{
  "success": true,
  "data": {
    "sessionId": "session_xxx",
    "firstQuestion": { ... },
    "voiceOptions": { ... },
    "totalQuestions": 25,
    "currentQuestionNumber": 1
  }
}
```

### 2. Submit Answer & Get Next Question with Voice
```
POST /api/dynamic-interview/submit-answer

Body:
{
  "sessionId": "session_xxx",
  "answer": "I have experience with JavaScript and built several projects...",
  "voiceId": "en-US-thomas"
}

Response:
{
  "success": true,
  "feedback": "Good detailed response. Let me ask you a follow-up question. ",
  "answerScore": 85,
  "audioUrl": "https://...", // AI response in audio
  "nextQuestion": { ... },
  "sessionProgress": { ... }
}
```

### 3. End Interview Session
```
POST /api/dynamic-interview/end-session

Body:
{
  "sessionId": "session_xxx"
}

Response:
{
  "success": true,
  "data": {
    "finalScore": 82,
    "recommendation": "HIRE - Good performance",
    "categoryScores": { ... },
    "strengths": [ ... ],
    "weaknesses": [ ... ]
  }
}
```

### 4. Get Interview Session Status
```
GET /api/dynamic-interview/session/:sessionId

Response:
{
  "success": true,
  "data": {
    "sessionId": "...",
    "progress": { ... },
    "elapsedTime": 345
  }
}
```

### 5. Get Available Voices
```
GET /api/dynamic-interview/voices

Response:
{
  "success": true,
  "data": {
    "male": [ ... ],
    "female": [ ... ]
  }
}
```

## How It Works

### Interview Flow

```
1. Start Interview
   ↓
   Generate 25 dynamic questions based on candidate profile
   ↓
   Display first question
   ↓

2. For Each Question:
   ↓
   Candidate answers
   ↓
   Evaluate answer (score 0-100)
   ↓
   Generate AI feedback using Murf voice
   ↓
   Generate follow-up question dynamically
   ↓
   Display next question with AI audio response
   ↓

3. Interview Complete
   ↓
   Calculate final score
   ↓
   Generate comprehensive report
   ↓
   Provide hiring recommendation
```

## Question Generation Logic

### Dynamic Question Categories
1. **Technical Questions** (6-7) - Based on candidate skills
2. **HR Questions** (4-5) - Based on experience level
3. **Aptitude Questions** (4-5) - General problem-solving
4. **Scenario Questions** (4-5) - Real-world situations

### Follow-up Question Generation
Questions are dynamically generated based on:
- Answer length and comprehensiveness
- Keywords matching expected answers
- Question category and difficulty
- Conversation history

### Answer Scoring
Each answer is scored 0-100 based on:
- Relevance to question
- Completeness
- Technical accuracy
- Communication clarity

## Voice Features

### Speech Parameters
```javascript
{
  voiceId: "en-US-thomas",  // Voice selection
  rate: 0.95,               // 0.5 - 2.0 (slower to faster)
  pitch: 1.0,               // 0.5 - 2.0 (lower to higher)
  emotion: "professional"   // professional, friendly, energetic
}
```

### Audio Output
- Format: MP3
- Sample Rate: 44.1 kHz
- Quality: High-quality synthesis
- Duration: Varies by text length

## Frontend Integration

The frontend will:
1. Display current question
2. Provide text input for answers
3. Provide voice input button (Web Speech API)
4. Display AI voice response with audio player
5. Auto-play AI voice (if enabled)
6. Track progress
7. Show final score and recommendation

## Fallback Mechanisms

### If Murf API Fails
1. Backend returns `audioUrl: null`
2. Frontend falls back to Web Speech API
3. Uses browser's native text-to-speech
4. Continues interview normally

### If Voice Recording Fails
1. User can type answer instead
2. Manually trigger voice input again
3. Interview continues uninterrupted

## Cost Considerations

- Murf AI offers free tier with limitations
- Paid plans for higher usage
- Check Murf pricing for production use
- Consider caching frequently asked question responses

## Troubleshooting

### API Key Not Working
- Verify API key is correct
- Check key is active in Murf dashboard
- Restart backend server after updating .env

### Voice Generation Slow
- Normal for first requests (100-500ms)
- Consider caching responses for common questions
- Async processing prevents UI blocking

### Audio Quality Issues
- Verify internet connection
- Check Murf server status
- Try different voice ID
- Contact Murf support if persistent

## Security Notes

- Keep API key in `.env` file only
- Never commit `.env` to version control
- Use HTTPS in production
- Validate all user inputs
- Rate limit API calls
- Log API usage

## Next Steps

1. [x] Backend routes created
2. [x] Murf service integrated
3. [ ] Setup frontend component
4. [ ] Add Web Speech API fallback
5. [ ] Test full workflow
6. [ ] Deploy to production

