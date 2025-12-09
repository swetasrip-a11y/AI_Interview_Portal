import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getQuestions } from '../api/questions';

export default function QuestionsList() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await getQuestions();
      setQuestions(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container"><h2>Loading questions...</h2></div>;

  return (
    <div className="container">
      <div style={{ background: 'white', borderRadius: '10px', padding: '30px' }}>
        <h1>Interview Questions</h1>
        {error && <div className="error">{error}</div>}
        
        {questions.length === 0 ? (
          <p>No questions available yet.</p>
        ) : (
          <div style={{ marginTop: '20px' }}>
            {questions.map((q) => (
              <div key={q.id} style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '15px',
                backgroundColor: '#f9f9f9'
              }}>
                <Link to={`/question/${q.id}`} style={{ textDecoration: 'none', color: '#667eea' }}>
                  <h3>{q.title}</h3>
                </Link>
                <p><strong>Question:</strong> {q.question_text}</p>
                <p><strong>Difficulty:</strong> <span style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  backgroundColor: q.difficulty === 'easy' ? '#d4edda' : q.difficulty === 'medium' ? '#fff3cd' : '#f8d7da',
                  color: q.difficulty === 'easy' ? '#155724' : q.difficulty === 'medium' ? '#856404' : '#721c24'
                }}>{q.difficulty}</span></p>
              </div>
            ))}
          </div>
        )}
        
        <div style={{ marginTop: '30px' }}>
          <Link to="/dashboard" className="btn" style={{ display: 'inline-block', padding: '10px 20px', backgroundColor: '#667eea', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}


