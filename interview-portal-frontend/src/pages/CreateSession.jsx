import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateSession() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    jobTitle: '',
    description: '',
    interviewType: 'ai-assisted',
    duration: '45',
    questions: '5',
    difficulty: 'medium',
    category: 'general'
  });

  // Fetch candidates from API on mount
  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/candidates', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCandidates(data.candidates || []);
      } else {
        // Fallback mock data
        setCandidates([
          { id: 1, full_name: 'John Doe', email: 'john@example.com', position: 'Frontend Dev' },
          { id: 2, full_name: 'Sarah Smith', email: 'sarah@example.com', position: 'Full Stack Dev' },
          { id: 3, full_name: 'Michael Johnson', email: 'michael@example.com', position: 'DevOps Engineer' },
          { id: 4, full_name: 'Emily Brown', email: 'emily@example.com', position: 'Data Scientist' },
          { id: 5, full_name: 'Alex Kumar', email: 'alex@example.com', position: 'Backend Dev' },
        ]);
      }
    } catch (error) {
      console.error('Error fetching candidates:', error);
      setCandidates([
        { id: 1, full_name: 'John Doe', email: 'john@example.com', position: 'Frontend Dev' },
        { id: 2, full_name: 'Sarah Smith', email: 'sarah@example.com', position: 'Full Stack Dev' },
        { id: 3, full_name: 'Michael Johnson', email: 'michael@example.com', position: 'DevOps Engineer' },
        { id: 4, full_name: 'Emily Brown', email: 'emily@example.com', position: 'Data Scientist' },
      ]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCandidateToggle = (candidateId) => {
    setSelectedCandidates(prev => 
      prev.includes(candidateId) 
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.jobTitle) {
      alert('Please fill in all required fields');
      return;
    }

    if (selectedCandidates.length === 0) {
      alert('Please select at least one candidate');
      return;
    }

    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      // Create interview session
      const response = await fetch('http://localhost:5000/api/interviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          job_title: formData.jobTitle,
          description: formData.description,
          interview_type: formData.interviewType,
          duration: parseInt(formData.duration),
          num_questions: parseInt(formData.questions),
          difficulty: formData.difficulty,
          category: formData.category,
          candidate_ids: selectedCandidates
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert('Interview session created successfully!');
        navigate('/ai-interviewer-dashboard');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create interview session');
      }
    } catch (error) {
      console.error('Error creating session:', error);
      alert('Failed to create interview session');
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>➕ Create New Interview Session</h1>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>

      <div style={styles.formContainer}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label>Session Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Frontend Developer Round 1"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label>Job Title *</label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              placeholder="e.g., Senior Frontend Developer"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Additional notes about this interview..."
              rows="3"
              style={styles.textarea}
            />
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label>Interview Type *</label>
              <select
                name="interviewType"
                value={formData.interviewType}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="ai-assisted">AI-Assisted Interview</option>
                <option value="live">Live with Interviewer</option>
                <option value="recorded">Pre-recorded Interview</option>
                <option value="technical">Technical Assessment</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label>Duration (minutes) *</label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
                <option value="90">90 minutes</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label>Number of Questions *</label>
              <select
                name="questions"
                value={formData.questions}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="3">3 questions</option>
                <option value="5">5 questions</option>
                <option value="8">8 questions</option>
                <option value="10">10 questions</option>
                <option value="15">15 questions</option>
              </select>
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label>Difficulty Level</label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label>Question Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="general">General Knowledge</option>
                <option value="technical">Technical</option>
                <option value="behavioral">Behavioral</option>
                <option value="coding">Coding</option>
                <option value="domain-specific">Domain Specific</option>
              </select>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label>Select Candidates to Invite ({selectedCandidates.length} selected)</label>
            <div style={styles.candidatesList}>
              {candidates.length > 0 ? (
                candidates.map(candidate => (
                  <div key={candidate.id} style={styles.candidateItem}>
                    <input
                      type="checkbox"
                      id={`candidate-${candidate.id}`}
                      checked={selectedCandidates.includes(candidate.id)}
                      onChange={() => handleCandidateToggle(candidate.id)}
                      style={styles.checkbox}
                    />
                    <label htmlFor={`candidate-${candidate.id}`} style={styles.candidateLabel}>
                      <strong>{candidate.full_name || candidate.name}</strong>
                      <span style={styles.candidateEmail}>{candidate.email}</span>
                      <span style={styles.candidatePosition}>{candidate.position}</span>
                    </label>
                  </div>
                ))
              ) : (
                <div style={{color: '#94a3b8', padding: '1rem', textAlign: 'center'}}>
                  Loading candidates...
                </div>
              )}
            </div>
          </div>

          <div style={styles.actions}>
            <button type="submit" style={styles.submitBtn} disabled={loading}>
              {loading ? '⏳ Creating...' : '✓ Create Session'}
            </button>
            <button
              type="button"
              style={styles.cancelBtn}
              onClick={() => navigate('/ai-interviewer-dashboard')}
            >
              ← Cancel
            </button>
          </div>
        </form>
      </div>

      <style>{`
        * { box-sizing: border-box; }
        select option { background: #1f2937; color: #f8fafc; }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #050810 0%, #0a0e27 50%, #1a1f35 100%)',
    padding: '2rem',
    color: '#f8fafc',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    paddingBottom: '1.5rem',
    borderBottom: '1px solid rgba(100, 116, 139, 0.3)'
  },
  logoutBtn: {
    padding: '0.6rem 1.2rem',
    background: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  },
  formContainer: {
    background: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(100, 116, 139, 0.3)',
    borderRadius: '16px',
    padding: '2rem',
    maxWidth: '900px',
    margin: '0 auto',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem'
  },
  input: {
    padding: '0.75rem 1rem',
    background: 'rgba(30, 41, 59, 0.5)',
    border: '1px solid rgba(100, 116, 139, 0.3)',
    borderRadius: '8px',
    color: '#f8fafc',
    fontSize: '1rem',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease',
    marginTop: '0.5rem'
  },
  textarea: {
    padding: '0.75rem 1rem',
    background: 'rgba(30, 41, 59, 0.5)',
    border: '1px solid rgba(100, 116, 139, 0.3)',
    borderRadius: '8px',
    color: '#f8fafc',
    fontSize: '1rem',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease',
    marginTop: '0.5rem',
    resize: 'vertical'
  },
  select: {
    padding: '0.75rem 1rem',
    background: 'rgba(30, 41, 59, 0.5)',
    border: '1px solid rgba(100, 116, 139, 0.3)',
    borderRadius: '8px',
    color: '#f8fafc',
    fontSize: '1rem',
    fontFamily: 'inherit',
    cursor: 'pointer',
    marginTop: '0.5rem'
  },
  candidatesList: {
    display: 'grid',
    gap: '0.75rem',
    marginTop: '0.5rem',
    maxHeight: '300px',
    overflowY: 'auto',
    padding: '1rem',
    background: 'rgba(30, 41, 59, 0.3)',
    borderRadius: '8px',
    border: '1px solid rgba(100, 116, 139, 0.2)'
  },
  candidateItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.75rem',
    background: 'rgba(99, 102, 241, 0.05)',
    borderRadius: '6px',
    border: '1px solid rgba(99, 102, 241, 0.2)'
  },
  checkbox: {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
    accentColor: '#6366f1'
  },
  candidateLabel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    cursor: 'pointer'
  },
  candidateEmail: {
    fontSize: '0.85rem',
    color: '#cbd5e1'
  },
  candidatePosition: {
    fontSize: '0.8rem',
    color: '#94a3b8'
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem'
  },
  submitBtn: {
    flex: 1,
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.3s ease'
  },
  cancelBtn: {
    flex: 1,
    padding: '0.75rem 1.5rem',
    background: 'rgba(100, 116, 139, 0.2)',
    color: '#cbd5e1',
    border: '1px solid rgba(100, 116, 139, 0.5)',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.3s ease'
  }
};
