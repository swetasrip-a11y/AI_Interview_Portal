import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createQuestion, getQuestion, updateQuestion } from '../api/questions';

export default function QuestionForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_option: '',
    difficulty: 'medium'
  });

  useEffect(() => {
    if (id) {
      fetchQuestion();
    }
  }, [id]);

  const fetchQuestion = async () => {
    try {
      const response = await getQuestion(id);
      setForm({
        title: response.data.title,
        description: response.data.description,
        question_text: response.data.question_text,
        option_a: response.data.option_a,
        option_b: response.data.option_b,
        option_c: response.data.option_c,
        option_d: response.data.option_d,
        correct_option: response.data.correct_option,
        difficulty: response.data.difficulty
      });
    } catch (err) {
      setError('Failed to load question');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title || !form.question_text || !form.option_a || !form.option_b || !form.option_c || !form.option_d || !form.correct_option) {
      setError('All fields are required');
      return;
    }

    try {
      setSubmitting(true);
      if (id) {
        await updateQuestion(id, form);
        alert('Question updated successfully');
      } else {
        await createQuestion(form);
        alert('Question created successfully');
      }
      navigate('/admin/questions');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save question');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="container"><h2>Loading...</h2></div>;

  return (
    <div className="container">
      <div style={{ background: 'white', borderRadius: '10px', padding: '30px', maxWidth: '800px' }}>
        <h1>{id ? 'Edit Question' : 'Create New Question'}</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g., JavaScript Basics"
              required
            />
          </div>

          <div className="form-group">
            <label>Description (Optional)</label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Add a brief description"
            />
          </div>

          <div className="form-group">
            <label>Question Text</label>
            <textarea
              name="question_text"
              value={form.question_text}
              onChange={handleChange}
              placeholder="Enter the question"
              style={{ width: '100%', padding: '10px', minHeight: '80px', borderRadius: '5px', border: '1px solid #ddd' }}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label>Option A</label>
              <input
                type="text"
                name="option_a"
                value={form.option_a}
                onChange={handleChange}
                placeholder="Option A"
                required
              />
            </div>
            <div className="form-group">
              <label>Option B</label>
              <input
                type="text"
                name="option_b"
                value={form.option_b}
                onChange={handleChange}
                placeholder="Option B"
                required
              />
            </div>
            <div className="form-group">
              <label>Option C</label>
              <input
                type="text"
                name="option_c"
                value={form.option_c}
                onChange={handleChange}
                placeholder="Option C"
                required
              />
            </div>
            <div className="form-group">
              <label>Option D</label>
              <input
                type="text"
                name="option_d"
                value={form.option_d}
                onChange={handleChange}
                placeholder="Option D"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label>Correct Option</label>
              <select
                name="correct_option"
                value={form.correct_option}
                onChange={handleChange}
                required
              >
                <option value="">Select correct option</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>

            <div className="form-group">
              <label>Difficulty Level</label>
              <select
                name="difficulty"
                value={form.difficulty}
                onChange={handleChange}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          {error && <div className="error">{error}</div>}

          <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Question'}
            </button>
            <button type="button" className="btn" onClick={() => navigate('/admin/questions')} style={{ backgroundColor: '#95a5a6' }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


