import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AllSessions() {
  const navigate = useNavigate();
  const [sessions] = useState([
    {
      id: 1,
      title: 'Frontend Developer Round 1',
      jobTitle: 'Senior Frontend Developer',
      status: 'Active',
      candidates: 3,
      createdAt: '2024-01-15',
      type: 'AI-Assisted'
    },
    {
      id: 2,
      title: 'Full Stack Developer Round 1',
      jobTitle: 'Full Stack Developer',
      status: 'Completed',
      candidates: 5,
      createdAt: '2024-01-14',
      type: 'Live'
    },
    {
      id: 3,
      title: 'DevOps Engineer Round 1',
      jobTitle: 'DevOps Engineer',
      status: 'Scheduled',
      candidates: 2,
      createdAt: '2024-01-13',
      type: 'AI-Assisted'
    },
    {
      id: 4,
      title: 'Data Scientist Round 1',
      jobTitle: 'Data Scientist',
      status: 'Completed',
      candidates: 4,
      createdAt: '2024-01-12',
      type: 'Recorded'
    },
    {
      id: 5,
      title: 'Security Engineer Round 1',
      jobTitle: 'Security Engineer',
      status: 'Active',
      candidates: 3,
      createdAt: '2024-01-11',
      type: 'AI-Assisted'
    }
  ]);

  const [filter, setFilter] = useState('all');

  const filteredSessions = filter === 'all' 
    ? sessions 
    : sessions.filter(s => s.status.toLowerCase() === filter.toLowerCase());

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return '#6366f1';
      case 'Completed': return '#10b981';
      case 'Scheduled': return '#f97316';
      default: return '#6b7280';
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'AI-Assisted': return '#8b5cf6';
      case 'Live': return '#06b6d4';
      case 'Recorded': return '#ec4899';
      default: return '#6b7280';
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>📋 All Interview Sessions</h1>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>

      <div style={styles.controls}>
        <button
          onClick={() => setFilter('all')}
          style={{...styles.filterBtn, ...(filter === 'all' ? styles.filterBtnActive : {})}}
        >
          All ({sessions.length})
        </button>
        <button
          onClick={() => setFilter('active')}
          style={{...styles.filterBtn, ...(filter === 'active' ? styles.filterBtnActive : {})}}
        >
          Active ({sessions.filter(s => s.status === 'Active').length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          style={{...styles.filterBtn, ...(filter === 'completed' ? styles.filterBtnActive : {})}}
        >
          Completed ({sessions.filter(s => s.status === 'Completed').length})
        </button>
        <button
          onClick={() => setFilter('scheduled')}
          style={{...styles.filterBtn, ...(filter === 'scheduled' ? styles.filterBtnActive : {})}}
        >
          Scheduled ({sessions.filter(s => s.status === 'Scheduled').length})
        </button>
      </div>

      <div style={styles.sessionsList}>
        {filteredSessions.length === 0 ? (
          <div style={styles.emptyState}>
            <p>No sessions found</p>
          </div>
        ) : (
          filteredSessions.map(session => (
            <div key={session.id} style={styles.sessionCard}>
              <div style={styles.sessionHeader}>
                <div>
                  <h3 style={styles.sessionTitle}>{session.title}</h3>
                  <p style={styles.sessionSubtitle}>{session.jobTitle}</p>
                </div>
                <div style={styles.sessionMeta}>
                  <span style={{...styles.badge, backgroundColor: getStatusColor(session.status) + '40', color: getStatusColor(session.status)}}>
                    {session.status}
                  </span>
                </div>
              </div>

              <div style={styles.sessionDetails}>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Type:</span>
                  <span style={{...styles.badge, backgroundColor: getTypeColor(session.type) + '40', color: getTypeColor(session.type)}}>
                    {session.type}
                  </span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>👥 Candidates:</span>
                  <span>{session.candidates}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>📅 Created:</span>
                  <span>{new Date(session.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div style={styles.sessionActions}>
                <button
                  style={styles.viewBtn}
                  onClick={() => alert(`Viewing session: ${session.title}`)}
                >
                  👁️ View Details
                </button>
                <button
                  style={styles.editBtn}
                  onClick={() => alert(`Editing session: ${session.title}`)}
                >
                  ✏️ Edit
                </button>
                <button
                  style={styles.deleteBtn}
                  onClick={() => alert(`Deleted session: ${session.title}`)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <button
        onClick={() => navigate('/ai-interviewer-dashboard')}
        style={styles.backBtn}
      >
        ← Back to Dashboard
      </button>
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
  controls: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap'
  },
  filterBtn: {
    padding: '0.6rem 1.2rem',
    background: 'rgba(100, 116, 139, 0.2)',
    border: '1px solid rgba(100, 116, 139, 0.5)',
    color: '#cbd5e1',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  },
  filterBtnActive: {
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    border: 'none',
    color: 'white',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
  },
  sessionsList: {
    display: 'grid',
    gap: '1.5rem',
    marginBottom: '2rem',
    maxWidth: '1000px',
    margin: '0 auto 2rem'
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem',
    background: 'rgba(15, 23, 42, 0.8)',
    borderRadius: '16px',
    border: '1px solid rgba(100, 116, 139, 0.3)'
  },
  sessionCard: {
    background: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(100, 116, 139, 0.3)',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease'
  },
  sessionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid rgba(100, 116, 139, 0.3)'
  },
  sessionTitle: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.3rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  sessionSubtitle: {
    margin: '0',
    color: '#cbd5e1',
    fontSize: '0.95rem'
  },
  sessionMeta: {
    display: 'flex',
    gap: '0.75rem'
  },
  sessionDetails: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '1rem'
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.95rem'
  },
  detailLabel: {
    color: '#94a3b8',
    fontWeight: '600'
  },
  badge: {
    display: 'inline-block',
    padding: '0.4rem 0.8rem',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: '600'
  },
  sessionActions: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap'
  },
  viewBtn: {
    padding: '0.6rem 1rem',
    background: 'rgba(99, 102, 241, 0.2)',
    color: '#6366f1',
    border: '1px solid rgba(99, 102, 241, 0.5)',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  },
  editBtn: {
    padding: '0.6rem 1rem',
    background: 'rgba(34, 197, 94, 0.2)',
    color: '#10b981',
    border: '1px solid rgba(34, 197, 94, 0.5)',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  },
  deleteBtn: {
    padding: '0.6rem 1rem',
    background: 'rgba(239, 68, 68, 0.2)',
    color: '#ef4444',
    border: '1px solid rgba(239, 68, 68, 0.5)',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  },
  backBtn: {
    padding: '0.75rem 1.5rem',
    background: 'rgba(100, 116, 139, 0.2)',
    color: '#cbd5e1',
    border: '1px solid rgba(100, 116, 139, 0.5)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
    display: 'block',
    margin: '0 auto',
    transition: 'all 0.3s ease'
  }
};
