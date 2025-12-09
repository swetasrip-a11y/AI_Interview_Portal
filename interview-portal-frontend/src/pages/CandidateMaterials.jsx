import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMaterials } from '../api/interviews';
import '../styles/materials.css';

export default function CandidateMaterials() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMaterials, setFilteredMaterials] = useState([]);

  useEffect(() => {
    fetchMaterials();
  }, []);

  useEffect(() => {
    const filtered = materials.filter(
      (material) =>
        material.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMaterials(filtered);
  }, [searchTerm, materials]);

  const fetchMaterials = async () => {
    try {
      const response = await getMaterials();
      setMaterials(response.data || []);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="materials-loading">
        <div className="spinner"></div>
        <p>Loading materials...</p>
      </div>
    );

  return (
    <div className="materials-container">
      <div className="materials-header">
        <div className="header-content">
          <h1>📚 Study Materials</h1>
          <p>Access comprehensive study resources for interview preparation</p>
        </div>
        <Link to="/candidate-dashboard" className="btn btn-secondary">
          ← Back
        </Link>
      </div>

      <div className="materials-search">
        <input
          type="text"
          placeholder="🔍 Search materials by title or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="materials-content">
        {filteredMaterials.length === 0 ? (
          <div className="empty-state">
            <p>No study materials available yet.</p>
          </div>
        ) : (
          <div className="materials-grid">
            {filteredMaterials.map((material) => (
              <div key={material.id} className="material-card">
                <div className="material-header">
                  <span className="material-icon">📖</span>
                  <h3>{material.title}</h3>
                </div>

                <div className="material-meta">
                  <span className="category-badge">{material.category}</span>
                  <span className="difficulty-badge">{material.difficulty || 'Medium'}</span>
                </div>

                <p className="material-description">{material.description}</p>

                <details className="material-details">
                  <summary>View Content</summary>
                  <div className="content-preview">
                    <p>{material.content}</p>
                  </div>
                </details>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


