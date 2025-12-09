import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getQuestion, submitAnswer } from '../api/questions';

export default function QuestionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  const fetchQuestion = async () => {
    try {
      setLoading(true);
      const response = await getQuestion(id);
      setQuestion(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load question');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOption) {
      setError('Please select an option');
      return;
    }

    try {
      setSubmitting(true);
      const response = await submitAnswer(parseInt(id), selectedOption);
      setResult(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit answer');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="container"><h2>Loading question...</h2></div>;

  if (!question) return <div className="container"><h2>Question not found</h2></div>;

  return (
    <div className="container">
      <div style={{ background: 'white', borderRadius: '10px', padding: '30px', maxWidth: '600px', width: '100%' }}>
        <h1>{question.title}</h1>
        {question.description && <p><em>{question.description}</em></p>}
        
        <div style={{ marginTop: '30px', marginBottom: '20px' }}>
          <h3>{question.question_text}</h3>
        </div>

        {!result ? (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              {['option_a', 'option_b', 'option_c', 'option_d'].map((opt, idx) => (
                <label key={opt} style={{ display: 'block', marginBottom: '12px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="option"
                    value={opt[opt.length - 1].toUpperCase()}
                    checked={selectedOption === opt[opt.length - 1].toUpperCase()}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    style={{ marginRight: '10px' }}
                  />
                  <span style={{ fontSize: '16px' }}>
                    <strong>{opt[opt.length - 1].toUpperCase()}.</strong> {question[opt]}
                  </span>
                </label>
              ))}
            </div>

            {error && <div className="error">{error}</div>}

            <button type="submit" className="btn" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Answer'}
            </button>
          </form>
        ) : (
          <div style={{
            padding: '20px',
            borderRadius: '8px',
            backgroundColor: result.is_correct ? '#d4edda' : '#f8d7da',
            color: result.is_correct ? '#155724' : '#721c24',
            marginTop: '20px'
          }}>
            <h2>{result.message}</h2>
            <p><strong>Your answer:</strong> {selectedOption}</p>
            <p><strong>Correct answer:</strong> {result.correct_option}</p>
            <Link to="/questions" className="btn" style={{ display: 'inline-block', padding: '10px 20px', marginTop: '15px', backgroundColor: '#667eea', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>
              Back to Questions
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}


