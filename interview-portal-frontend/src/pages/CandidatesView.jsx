import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getInterviewCandidates, updateCandidateEvaluation } from '../api/interviews';

export default function CandidatesView() {
  const { id } = useParams();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    score: '',
    comments: '',
    decision: '',
    marks_obtained: ''
  });

  useEffect(() => {
    fetchCandidates();
  }, [id]);

  const fetchCandidates = async () => {
    try {
      const response = await getInterviewCandidates(id);
      setCandidates(response.data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (candidate) => {
    setEditingId(candidate.id);
    setEditForm({
      score: candidate.score || '',
      comments: candidate.comments || '',
      decision: candidate.decision || '',
      marks_obtained: candidate.marks_obtained || ''
    });
  };

  const handleSave = async (candidateId) => {
    try {
      await updateCandidateEvaluation(id, candidateId, editForm);
      alert('Candidate evaluation updated!');
      setEditingId(null);
      fetchCandidates();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update');
    }
  };

  if (loading) return <div className="container"><h2>Loading...</h2></div>;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #050810|#0a0e27|#1a1f35 0%, #050810|#0a0e27|#1a1f35 50%, #050810|#0a0e27|#1a1f35 100%)' }}>
      <div className="dashboard">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1>Candidates for Interview #{id}</h1>
          <Link to="/interviewer/interviews" className="btn btn-secondary" style={{ width: '150px' }}>
            Back
          </Link>
        </div>

        {candidates.length === 0 ? (
          <div className="user-info">
            <p>No candidates joined this interview yet.</p>
          </div>
        ) : (
          <div>
            {candidates.map((candidate) => (
              <div key={candidate.id} className="interview-card">
                {editingId === candidate.id ? (
                  <div>
                    <h3>{candidate.full_name}</h3>
                    <p><strong>Email:</strong> {candidate.email}</p>

                    <div className="form-group" style={{ marginTop: '15px' }}>
                      <label>Score (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={editForm.score}
                        onChange={(e) => setEditForm({ ...editForm, score: e.target.value })}
                        placeholder="0-100"
                      />
                    </div>

                    <div className="form-group">
                      <label>Marks Obtained</label>
                      <input
                        type="number"
                        value={editForm.marks_obtained}
                        onChange={(e) => setEditForm({ ...editForm, marks_obtained: e.target.value })}
                        placeholder="out of 100"
                      />
                    </div>

                    <div className="form-group">
                      <label>Comments</label>
                      <textarea
                        value={editForm.comments}
                        onChange={(e) => setEditForm({ ...editForm, comments: e.target.value })}
                        placeholder="Add your comments..."
                        style={{ minHeight: '60px' }}
                      />
                    </div>

                    <div className="form-group">
                      <label>Decision</label>
                      <select
                        value={editForm.decision}
                        onChange={(e) => setEditForm({ ...editForm, decision: e.target.value })}
                      >
                        <option value="">Select decision</option>
                        <option value="Selected">Selected</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Hold">Hold</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                      <button 
                        onClick={() => handleSave(candidate.candidate_id)}
                        className="btn btn-success"
                        style={{ width: '100px' }}
                      >
                        Save
                      </button>
                      <button 
                        onClick={() => setEditingId(null)}
                        className="btn btn-secondary"
                        style={{ width: '100px' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3>{candidate.full_name}</h3>
                    <p><strong>Email:</strong> {candidate.email}</p>
                    <p><strong>Status:</strong> <span className={`badge ${candidate.status}`}>{candidate.status}</span></p>
                    {candidate.marks_obtained && <p><strong>Marks:</strong> {candidate.marks_obtained}/100</p>}
                    {candidate.decision && <p><strong>Decision:</strong> {candidate.decision}</p>}
                    {candidate.comments && <p><strong>Comments:</strong> {candidate.comments}</p>}
                    <button 
                      onClick={() => handleEditClick(candidate)}
                      className="btn"
                      style={{ width: '120px', marginTop: '10px' }}
                    >
                      Evaluate
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


