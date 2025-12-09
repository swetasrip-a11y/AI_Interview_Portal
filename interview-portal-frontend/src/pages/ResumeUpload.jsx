import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/resume-upload.css';

export default function ResumeUpload() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedResumes, setUploadedResumes] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [filePreview, setFilePreview] = useState(null);
  const [showAllResumes, setShowAllResumes] = useState(false);
  const [primaryResume, setPrimaryResume] = useState(null);

  // Fetch existing resumes
  useEffect(() => {
    fetchUploadedResumes();
  }, []);

  const fetchUploadedResumes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/resume/list', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUploadedResumes(data.resumes || []);
        if (data.resumes && data.resumes.length > 0) {
          setPrimaryResume(data.resumes[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching resumes:', error);
    }
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles[0]) {
      handleFileSelect(droppedFiles[0]);
    }
  };

  // Handle file selection
  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;

    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
    const validExtensions = ['pdf', 'doc', 'docx', 'txt'];

    if (!validExtensions.includes(fileExtension) && !validTypes.includes(selectedFile.type)) {
      setMessage({ type: 'error', text: 'Please upload a PDF, DOC, DOCX or TXT file' });
      setFile(null);
      setFilePreview(null);
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File size must be less than 10MB' });
      setFile(null);
      setFilePreview(null);
      return;
    }

    setFile(selectedFile);
    setFilePreview(selectedFile.name);
    setMessage({ type: 'success', text: `File selected: ${selectedFile.name}` });
    setUploadProgress(0);
  };

  // Upload resume
  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a file' });
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setUploadProgress(Math.round(percentComplete));
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200 || xhr.status === 201) {
          setMessage({ type: 'success', text: 'Resume uploaded successfully!' });
          setFile(null);
          setFilePreview(null);
          setUploadProgress(100);
          setTimeout(() => {
            fetchUploadedResumes();
            setUploadProgress(0);
          }, 1000);
        } else {
          setMessage({ type: 'error', text: 'Upload failed. Please try again.' });
        }
        setUploading(false);
      });

      xhr.addEventListener('error', () => {
        setMessage({ type: 'error', text: 'Network error. Please try again.' });
        setUploading(false);
      });

      xhr.open('POST', 'http://localhost:5000/api/resume/upload');
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send(formData);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
      setUploading(false);
    }
  };

  // Delete resume
  const handleDelete = async (resumeId) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/resume/delete/${resumeId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Resume deleted successfully' });
        if (primaryResume === resumeId) setPrimaryResume(null);
        fetchUploadedResumes();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error deleting resume' });
    }
  };

  const handleSetPrimary = (resumeId) => {
    setPrimaryResume(resumeId);
    setMessage({ type: 'success', text: 'Resume set as primary' });
  };

  const displayedResumes = showAllResumes ? uploadedResumes : uploadedResumes.slice(0, 3);

  return (
    <div className="resume-upload-container">
      <div className="resume-header">
        <div className="resume-header-content">
          <h1>📄 Resume Upload</h1>
          <p>Upload your resume to get started with interviews</p>
        </div>
        <Link to="/candidate-dashboard" className="btn btn-secondary" style={{ width: '80px', padding: '0.5rem 0.8rem', fontSize: '0.9rem' }}>
          ← Back
        </Link>
      </div>

      <div className="resume-content">
        {message.text && (
          <div className={`alert alert-${message.type}`}>
            {message.type === 'success' ? '✓' : '✕'} {message.text}
          </div>
        )}

        <div
          className={`upload-area ${dragActive ? 'active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="upload-icon">📤</div>
          <h2>Drag and drop your resume here</h2>
          <p>or</p>
          <label className="file-input-label">
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => handleFileSelect(e.target.files[0])}
              style={{ display: 'none' }}
            />
            <span className="btn btn-primary">Browse Files</span>
          </label>
          <p className="file-info">PDF, DOC, DOCX, TXT up to 10MB</p>

          {filePreview && (
            <div className="file-preview">
              <div className="preview-item">
                <span className="preview-icon">📄</span>
                <span className="preview-name">{filePreview}</span>
                <button
                  className="preview-remove"
                  onClick={() => {
                    setFile(null);
                    setFilePreview(null);
                  }}
                >
                  ✕
                </button>
              </div>

              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${uploadProgress}%` }}
                  />
                  <span className="progress-text">{uploadProgress}%</span>
                </div>
              )}

              <button
                className="btn btn-primary"
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? '⏳ Uploading...' : '⬆️ Upload'}
              </button>
            </div>
          )}
        </div>

        {uploadedResumes.length > 0 && (
          <div className="resumes-section">
            <h3>📚 Your Resumes ({uploadedResumes.length})</h3>
            <div className="resumes-list">
              {displayedResumes.map((resume) => (
                <div key={resume.id} className={`resume-item ${primaryResume === resume.id ? 'primary' : ''}`}>
                  <div className="resume-info">
                    <span className="resume-name">📄 {resume.filename}</span>
                    <span className="resume-size">{(resume.size / 1024).toFixed(2)} KB</span>
                    <span className="resume-date">{new Date(resume.uploaded_at).toLocaleDateString()}</span>
                    {primaryResume === resume.id && <span className="badge-primary">Primary</span>}
                  </div>
                  <div className="resume-actions">
                    {primaryResume !== resume.id && (
                      <button
                        className="btn btn-small btn-info"
                        onClick={() => handleSetPrimary(resume.id)}
                      >
                        ⭐ Set Primary
                      </button>
                    )}
                    <a
                      href={`http://localhost:5000${resume.file_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-small btn-success"
                    >
                      👁️ View
                    </a>
                    <button
                      className="btn btn-small btn-danger"
                      onClick={() => handleDelete(resume.id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {uploadedResumes.length > 3 && !showAllResumes && (
              <button
                className="btn btn-secondary"
                onClick={() => setShowAllResumes(true)}
              >
                Show All Resumes ({uploadedResumes.length})
              </button>
            )}

            {showAllResumes && uploadedResumes.length > 3 && (
              <button
                className="btn btn-secondary"
                onClick={() => setShowAllResumes(false)}
              >
                Show Less
              </button>
            )}
          </div>
        )}

        <div className="tips-section">
          <h3>💡 Tips for Better Resume</h3>
          <ul>
            <li>Use a clear, professional format</li>
            <li>Include key skills and experience</li>
            <li>Highlight achievements and metrics</li>
            <li>Keep it to 1-2 pages</li>
            <li>Use a readable font size (10-12pt)</li>
            <li>Proofread for spelling and grammar</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
