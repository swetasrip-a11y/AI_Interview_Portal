import React, { useState, useEffect, useRef } from 'react';
import '../styles/candidate-ai-chat.css';

export default function CandidateAIChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: 'Hello! 👋 I\'m your AI Learning Assistant. I can help you prepare for interviews, answer questions about job roles, or discuss career development. What would you like to know?',
      timestamp: new Date()
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const messagesEndRef = useRef(null);
  const token = localStorage.getItem('token');

  const interviewTips = [
    {
      title: 'Technical Preparation',
      tips: [
        'Review data structures and algorithms',
        'Practice system design problems',
        'Build small projects to showcase skills',
        'Stay updated with latest technologies'
      ]
    },
    {
      title: 'Behavioral Interview',
      tips: [
        'Use STAR method (Situation, Task, Action, Result)',
        'Prepare stories about your achievements',
        'Focus on collaboration and problem-solving',
        'Ask thoughtful questions about the role'
      ]
    },
    {
      title: 'Day of Interview',
      tips: [
        'Arrive 10-15 minutes early',
        'Dress professionally for the role',
        'Bring copies of your resume',
        'Maintain eye contact and smile',
        'Ask for feedback on your performance'
      ]
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputValue,
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Call backend AI chat endpoint
      const response = await fetch('/api/aiChat/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: inputValue,
          context: 'candidate_learning'
        })
      });

      let aiResponse = generateAIResponse(inputValue);

      if (response.ok) {
        const data = await response.json();
        aiResponse = data.response || aiResponse;
      }

      const aiMessage = {
        id: messages.length + 2,
        type: 'ai',
        text: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const aiMessage = {
        id: messages.length + 2,
        type: 'ai',
        text: generateAIResponse(inputValue),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = (userInput) => {
    const input = userInput.toLowerCase();

    // Interview preparation responses
    if (input.includes('interview') || input.includes('prepare')) {
      return '💼 Great question! Here are key tips for interview preparation:\n\n' +
        '✅ Technical Skills: Practice coding problems and system design\n' +
        '✅ Communication: Practice explaining your thought process clearly\n' +
        '✅ Behavioral: Prepare STAR method stories from your experience\n' +
        '✅ Research: Learn about the company and role thoroughly\n\n' +
        'Would you like tips on any specific interview type?';
    }

    if (input.includes('skill') || input.includes('learn')) {
      return '🎓 Skill development is crucial! Consider:\n\n' +
        '📚 Online Courses: Take courses on platforms like Udemy, Coursera, LinkedIn Learning\n' +
        '💻 Build Projects: Create real-world applications to strengthen skills\n' +
        '🤝 Networking: Connect with professionals in your field\n' +
        '📖 Read Documentation: Stay updated with technology documentation\n\n' +
        'What skills would you like to focus on?';
    }

    if (input.includes('salary') || input.includes('negotiat')) {
      return '💰 Salary Negotiation Tips:\n\n' +
        '📊 Research: Check market rates for your role and location\n' +
        '🎯 Know Your Value: Quantify your achievements and skills\n' +
        '🤝 Negotiation Strategy: Be respectful but confident\n' +
        '✅ Consider Total Package: Look beyond base salary (benefits, growth, flexibility)\n\n' +
        'Remember: It\'s normal to negotiate!';
    }

    if (input.includes('job') || input.includes('role') || input.includes('position')) {
      return '🔍 Job Search Tips:\n\n' +
        '✨ Use Multiple Platforms: LinkedIn, Indeed, company websites\n' +
        '📝 Customize Resume: Tailor for each position\n' +
        '💬 Network: Reach out to contacts and recruiters\n' +
        '📧 Follow Up: Send thank you notes after interviews\n' +
        '🎯 Set Goals: Apply to 5-10 positions per week\n\n' +
        'Would you like specific advice on any of these areas?';
    }

    if (input.includes('resume') || input.includes('cv')) {
      return '📄 Resume Tips:\n\n' +
        '✅ Format: Keep it clean, 1-2 pages, easy to read\n' +
        '⭐ Keywords: Use industry keywords relevant to the role\n' +
        '📈 Achievements: Focus on results, not just duties\n' +
        '🎯 Customize: Tailor for each job application\n' +
        '✔️ Proofread: Check for grammar and spelling\n\n' +
        'Would you like help with any specific section?';
    }

    if (input.includes('nervous') || input.includes('anxious') || input.includes('stress')) {
      return '😌 Interview Anxiety is Normal!\n\n' +
        '💡 Techniques to Manage Stress:\n' +
        '🧘 Meditation: Practice 10-15 minutes before interview\n' +
        '🏃 Exercise: Helps reduce anxiety\n' +
        '😴 Sleep: Get good rest before the interview\n' +
        '🎤 Practice: Do mock interviews to build confidence\n' +
        '💪 Positive Self-Talk: Remind yourself of your strengths\n\n' +
        'You\'ve got this! 🌟';
    }

    if (input.includes('portfolio') || input.includes('project')) {
      return '🚀 Building Your Portfolio:\n\n' +
        '✨ Start Small: Create 2-3 strong projects\n' +
        '📱 Showcase Variety: Include different technologies\n' +
        '📖 Document Well: Add README with explanation\n' +
        '🔗 Deploy Online: Use GitHub Pages, Vercel, Netlify\n' +
        '⭐ GitHub: Make your code public and well-organized\n\n' +
        'Quality over quantity! What type of projects interest you?';
    }

    // Default responses
    return '👋 Thanks for your question! I\'m here to help with:\n\n' +
      '📚 Interview Preparation\n' +
      '💡 Skill Development\n' +
      '🎯 Job Search Strategy\n' +
      '💼 Resume & Portfolio Tips\n' +
      '📊 Career Advice\n' +
      '🧠 Technical Interview Tips\n\n' +
      'Ask me anything about your career journey! What would you like to know?';
  };

  const handleQuickQuestion = (question) => {
    setInputValue(question);
    // Trigger send after setting input
    setTimeout(() => {
      const form = document.querySelector('.chat-form');
      if (form) {
        form.dispatchEvent(new Event('submit', { bubbles: true }));
      }
    }, 0);
  };

  return (
    <div className="ai-chat-container">
      <div className="ai-chat-wrapper">
        <div className="chat-header">
          <div className="header-content">
            <h2>🤖 AI Learning Assistant</h2>
            <p>Prepare for interviews & advance your career</p>
          </div>
          <button 
            className="tips-btn"
            onClick={() => setShowTips(!showTips)}
          >
            💡 {showTips ? 'Hide' : 'Show'} Tips
          </button>
        </div>

        {showTips && (
          <div className="tips-panel">
            <div className="tips-content">
              {interviewTips.map((category, idx) => (
                <div key={idx} className="tip-category">
                  <h4>{category.title}</h4>
                  <ul>
                    {category.tips.map((tip, tipIdx) => (
                      <li key={tipIdx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="chat-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.type}`}>
              <div className="message-content">
                <div className="message-text">{message.text}</div>
                <span className="message-time">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message ai">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="quick-questions">
          <button onClick={() => handleQuickQuestion('How do I prepare for a technical interview?')}>
            📚 Technical Interview
          </button>
          <button onClick={() => handleQuickQuestion('What skills should I focus on?')}>
            🎓 Skill Development
          </button>
          <button onClick={() => handleQuickQuestion('How do I create a strong portfolio?')}>
            🚀 Portfolio Tips
          </button>
          <button onClick={() => handleQuickQuestion('I\'m feeling nervous about interviews')}>
            😌 Manage Anxiety
          </button>
        </div>

        <form className="chat-form" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me anything about interviews, skills, or career..."
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !inputValue.trim()}>
            {isLoading ? '⏳' : '📤'}
          </button>
        </form>

        <div className="chat-info">
          <p>💬 This AI assistant is here to help you prepare and succeed!</p>
        </div>
      </div>
    </div>
  );
}
