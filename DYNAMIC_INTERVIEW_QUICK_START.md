# 🚀 Dynamic AI Interview - Quick Start Guide

## 5-Minute Setup

### Step 1: Get Murf API Key (2 minutes)
```
1. Visit https://www.murf.ai/
2. Sign up (or log in if existing user)
3. Go to Settings → API Keys
4. Click "Generate API Key"
5. Copy the key (you'll need it in Step 2)
```

### Step 2: Configure Backend (2 minutes)
```bash
# Navigate to backend directory
cd interview-portal-backend

# Open .env file and add:
MURF_API_KEY=paste_your_key_here

# Save and restart backend (if running)
npm start
```

### Step 3: Access the Interview (1 minute)
```
1. Open http://localhost:3001/ai/dynamic-interview
2. Select a candidate from the list
3. Click "▶️ Start Interview"
```

---

## Feature Overview

### 🎯 What Happens During Interview

#### Phase 1: Initialization
- System generates 25 dynamic questions based on candidate profile
- Questions cover: Technical, HR, Aptitude, Scenarios
- Initial question displayed with audio option

#### Phase 2: Interview Loop (× 25 questions)
1. **Candidate Answers**
   - Type answer in text box
   - OR record voice answer
   - AI speech-to-text converts recording to text

2. **AI Evaluates**
   - Scores answer 0-100
   - Analyzes keywords and completeness
   - Generates feedback

3. **AI Responds**
   - Creates personalized feedback
   - Generates follow-up question
   - Converts response to speech using Murf AI
   - Plays audio to candidate

4. **Next Question**
   - Shows next dynamically-generated question
   - Updates progress bar
   - Repeats loop

#### Phase 3: Results
- Calculates final score
- Provides hiring recommendation
- Shows detailed analytics:
  - Strengths (highest scoring answers)
  - Weaknesses (lowest scoring answers)
  - Category breakdown
  - Duration and question count

---

## Voice Features

### Recording Voice Answers
```
1. Click 🎙️ "Record Answer" button
2. Speak your answer clearly
3. Click ⏹️ "Stop Recording"
4. Your speech is transcribed to text
5. Audio preview shows below button
6. Click "✓ Submit Answer" to proceed
```

### Voice Options Panel (Right Side)

**Select AI Voice:**
- Thomas (Professional Male) - Formal interviews
- Matthew (Friendly Male) - Approachable tone
- Mike (Casual Male) - Relaxed interviews
- Sarah (Professional Female) - Formal interviews
- Emma (Friendly Female) - Warm tone
- Olivia (Energetic Female) - Dynamic interviews

**Auto-play Voice:**
- ✅ Checked (default): AI voice plays automatically
- ☐ Unchecked: Click play to listen to response

### Pro Tips
- Record in quiet environment
- Speak clearly and at normal pace
- Use full sentences, not abbreviations
- Take time to think before answering
- Listen to AI feedback before next question

---

## Understanding Scores

### Individual Answer Scores
```
90-100: Excellent
├─ Comprehensive answer
├─ All keywords covered
├─ Clearly articulated
└─ Well-structured response

80-89: Very Good
├─ Detailed answer
├─ Most keywords included
├─ Good communication
└─ Some minor gaps

70-79: Good
├─ Adequate answer
├─ Main points covered
├─ Acceptable communication
└─ Some missing details

60-69: Satisfactory
├─ Basic answer
├─ Core concepts present
├─ Average communication
└─ Significant gaps

Below 60: Needs Improvement
├─ Incomplete answer
├─ Missing key concepts
├─ Poor articulation
└─ Major knowledge gaps
```

### Final Score Interpretation
```
85+: STRONG HIRE - Exceptional performance
├─ Excellent technical knowledge
├─ Strong problem-solving skills
└─ Outstanding communication

75-84: HIRE - Good performance, ready for role
├─ Good technical skills
├─ Solid problem-solving approach
└─ Clear communication

65-74: MAYBE - Needs additional discussion
├─ Basic technical skills
├─ Average problem-solving
└─ Moderate communication gaps

50-64: REVIEW - Borderline, needs evaluation
├─ Below average performance
├─ Limited technical knowledge
└─ Communication challenges

<50: NO HIRE - Below expectations
├─ Insufficient technical skills
├─ Weak problem-solving
└─ Poor communication
```

---

## Component Layout

### Left Section: Chat Interface
```
┌─────────────────────────────────────┐
│ Interview with John (5/25)          │ ← Candidate & progress
├─────────────────────────────────────┤
│ ████████░░░░░░░░░░░ 20%             │ ← Progress bar
├─────────────────────────────────────┤
│                                     │
│ AI: "Tell me about your experience" │ ← Questions
│                                     │
│ You: "I have 3 years of experience" │ ← Your answers
│ Score: 85/100                       │
│                                     │
│ AI: "Great! Can you provide..."     │ ← Feedback
│                                     │
├─────────────────────────────────────┤
│ ┌────────────────────────────────┐  │
│ │ Type answer or use voice...    │  │ ← Text input
│ └────────────────────────────────┘  │
│                                     │
│ [🎙️ Record] [Audio player] [✓ Go]  │ ← Controls
└─────────────────────────────────────┘
```

### Right Section: Voice Settings
```
┌──────────────────────┐
│ 🔊 Voice Settings    │
├──────────────────────┤
│ AI Voice:            │
│ ┌──────────────────┐ │
│ │ Thomas (Prof)  ▼ │ │ ← Voice selector
│ └──────────────────┘ │
│                      │
│ ☑ Auto-play Voice   │ ← Auto-play toggle
│                      │
│ 💡 Tips:            │
│ • Speak clearly     │
│ • Full sentences    │
│ • Take time         │
│ • Listen carefully  │
│ • Stay positive     │
│                      │
│ [⏹️ End Interview]   │
└──────────────────────┘
```

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Enter` (in textarea) | New line (Shift+Enter submits) |
| `Space` (recording) | Start/stop recording |
| `Tab` | Move between fields |
| `Ctrl+Enter` | Submit answer |

---

## Common Issues & Solutions

### Issue: Audio not playing
**Solution:**
1. Check speakers/volume
2. Enable "Auto-play Voice" in settings
3. Click play button manually
4. Check browser console for errors

### Issue: Microphone not working
**Solution:**
1. Allow microphone permission in browser
2. Check microphone is connected
3. Test microphone in system settings
4. Try different browser

### Issue: Speech not being recognized
**Solution:**
1. Speak clearly and slowly
2. Reduce background noise
3. Check microphone sensitivity
4. Try typing answer instead

### Issue: Getting wrong next question
**Solution:**
1. Ensure answer was submitted successfully
2. Check if page loaded completely
3. Refresh and try again
4. Report bug with session ID

### Issue: Score seems wrong
**Solution:**
1. Score based on: Relevance (40%), Completeness (30%), Keywords (20%), Communication (10%)
2. Detailed answers score higher
3. Using key terms improves score
4. Clear articulation helps score

---

## Advanced Features

### Session Tracking
- View real-time progress percentage
- See current question number
- Monitor average score live
- Track elapsed time

### Performance Analytics
- View answer scores for each question
- See strongest and weakest areas
- Category-wise performance:
  - Technical Knowledge
  - Problem Solving
  - Communication
  - Experience

### Download Report
- Get PDF report of interview
- Share results with recruiters
- Document for future reference

---

## Interview Best Practices

### Before Interview
✅ Test microphone and speakers
✅ Ensure quiet environment
✅ Close unnecessary browser tabs
✅ Have water nearby
✅ Wear appropriate attire (on camera if applicable)

### During Interview
✅ Take time to think before answering
✅ Provide detailed, specific examples
✅ Use technical terminology when appropriate
✅ Ask for clarification if unclear
✅ Speak clearly and confidently
✅ Stay positive and professional

### After Interview
✅ Review your scores and feedback
✅ Note areas for improvement
✅ Download report for records
✅ Share with recruiters if requested

---

## API Integration (for Developers)

### Start Interview Session
```javascript
const response = await axios.post(
  'http://localhost:5000/api/dynamic-interview/start',
  {
    candidateProfile: {
      name: 'John Doe',
      skills: ['JavaScript', 'React'],
      experience: [{ company: 'Tech Corp', years: 3 }]
    },
    jobRole: 'Full Stack Developer'
  }
);

const { sessionId, firstQuestion } = response.data.data;
```

### Submit Answer
```javascript
const response = await axios.post(
  'http://localhost:5000/api/dynamic-interview/submit-answer',
  {
    sessionId: sessionId,
    answer: 'My answer...',
    voiceId: 'en-US-thomas'
  }
);

const { feedback, nextQuestion, audioUrl, answerScore } = response.data;
```

### End Session
```javascript
const response = await axios.post(
  'http://localhost:5000/api/dynamic-interview/end-session',
  { sessionId: sessionId }
);

const { finalScore, recommendation, report } = response.data.data;
```

---

## FAQ

**Q: Can I use the same session twice?**  
A: No, sessions are one-time use. Start a new interview for another attempt.

**Q: How long does interview typically take?**  
A: Depends on answer length, typically 30-45 minutes for 25 questions.

**Q: Can I pause the interview?**  
A: Session stays active for 1 hour. You can click "End Interview" to stop.

**Q: What if I don't have a microphone?**  
A: You can type your answers instead of recording.

**Q: Will my interview be recorded?**  
A: Audio is processed for speech-to-text but not permanently stored (per your privacy settings).

**Q: Can I re-take the interview?**  
A: Yes, click "Start New Interview" after completion.

**Q: How are follow-up questions generated?**  
A: Based on your answer quality, keywords matched, and conversation history.

**Q: Can I change the voice during interview?**  
A: Yes, change voice in the settings panel before submitting next answer.

**Q: What if I get a low score?**  
A: Review feedback for each question. Area for improvement are highlighted.

**Q: Is my data secure?**  
A: All data encrypted. Interview sessions auto-deleted after 24 hours.

---

## Support

**Need Help?**
- Check DYNAMIC_AI_INTERVIEW_GUIDE.md for detailed documentation
- Review MURF_AI_SETUP.md for setup issues
- Check browser console for error messages
- Report bugs with session ID and error details

**Contact:**
- Backend Issues: Check server logs
- Frontend Issues: Check browser console
- Murf API Issues: Check Murf API status page

---

## What's Next?

1. ✅ Interview complete
2. 📊 Review detailed report
3. 💼 Share with recruiters
4. 🎯 Discuss feedback with interviewer
5. 📈 Work on improvement areas

---

**Good luck with your interview! 🎤✨**

Version: 1.0  
Last Updated: December 7, 2024

