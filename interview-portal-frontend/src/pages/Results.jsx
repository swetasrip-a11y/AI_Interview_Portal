import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserResults } from '../api/questions';

export default function Results() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await getUserResults();
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container"><h2>Loading results...</h2></div>;

  if (!results) return <div className="container"><h2>No results available</h2></div>;

  return (
    <div className="container">
      <div style={{ background: 'white', borderRadius: '10px', padding: '30px', maxWidth: '800px', width: '100%' }}>
        <h1>Your Results</h1>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '15px',
          marginBottom: '30px'
        }}>
          <div style={{
            background: '#667eea',
            color: 'white',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h3>Total Questions</h3>
            <h2>{results.total}</h2>
          </div>
          <div style={{
            background: '#27ae60',
            color: 'white',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h3>Correct Answers</h3>
            <h2>{results.correct}</h2>
          </div>
          <div style={{
            background: '#f39c12',
            color: 'white',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h3>Score</h3>
            <h2>{results.score}%</h2>
          </div>
        </div>

        {results.results.length > 0 && (
          <div>
            <h2>Detailed Results</h2>
            {results.results.map((r, idx) => (
              <div key={idx} style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '15px',
                backgroundColor: r.is_correct ? '#d4edda' : '#f8d7da'
              }}>
                <h4>{r.title}</h4>
                <p><strong>Question:</strong> {r.question_text}</p>
                <p><strong>Your answer:</strong> {r.selected_option}</p>
                <p><strong>Status:</strong> <span style={{ color: r.is_correct ? '#155724' : '#721c24', fontWeight: 'bold' }}>
                  {r.is_correct ? '✓ Correct' : '✗ Incorrect'}
                </span></p>
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


