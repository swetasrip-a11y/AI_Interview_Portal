import React, { useState, useEffect } from 'react';
import { useRealtime } from '../hooks/useRealtime';
import * as adminAPI from '../api/admin';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const { subscribe } = useRealtime();
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    users: [],
    sessions: [],
    hiringDecisions: [],
    jobOffers: [],
    performanceMetrics: []
  });
  const [realTimeEvents, setRealTimeEvents] = useState([]);

  // Fetch data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Real-time updates
  useEffect(() => {
    // Listen for resume uploads
    const unsubscribeResume = subscribe('resume:uploaded', (event) => {
      addRealTimeEvent('Resume Uploaded', `User ${event.userId} uploaded ${event.filename}`);
      loadData();
    });

    // Listen for AI interview completions
    const unsubscribeInterview = subscribe('ai-interview:completed', (event) => {
      addRealTimeEvent('Interview Completed', `Session ${event.session_id} completed with score ${event.final_score}%`);
      loadData();
    });

    return () => {
      unsubscribeResume();
      unsubscribeInterview();
    };
  }, [subscribe]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [users, sessions, decisions, offers, metrics] = await Promise.all([
        adminAPI.getAllUsers().catch(() => ({ users: [] })),
        adminAPI.getAllInterviewSessions().catch(() => ({ sessions: [] })),
        adminAPI.getHiringDecisions().catch(() => ({ decisions: [] })),
        adminAPI.getJobOffers().catch(() => ({ offers: [] })),
        adminAPI.getAllPerformanceMetrics().catch(() => ({ metrics: [] }))
      ]);

      setData({
        users: users.users || [],
        sessions: sessions.sessions || [],
        hiringDecisions: decisions.decisions || [],
        jobOffers: offers.offers || [],
        performanceMetrics: metrics.metrics || []
      });
    } catch (error) {
      console.error('Error loading data:', error);
      addRealTimeEvent('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const addRealTimeEvent = (type, message) => {
    const event = { type, message, timestamp: new Date().toLocaleTimeString() };
    setRealTimeEvents((prev) => [event, ...prev.slice(0, 9)]);
  };

  const TabOverview = () => (
    <div className="overview-grid">
      <div className="stat-card">
        <h3>Total Users</h3>
        <p className="stat-number">{data.users.length}</p>
      </div>
      <div className="stat-card">
        <h3>Interview Sessions</h3>
        <p className="stat-number">{data.sessions.length}</p>
      </div>
      <div className="stat-card">
        <h3>Hiring Decisions</h3>
        <p className="stat-number">{data.hiringDecisions.length}</p>
      </div>
      <div className="stat-card">
        <h3>Job Offers</h3>
        <p className="stat-number">{data.jobOffers.length}</p>
      </div>

      <div className="recent-events">
        <h3>📡 Real-Time Events</h3>
        <div className="events-list">
          {realTimeEvents.length === 0 ? (
            <p>No events yet</p>
          ) : (
            realTimeEvents.map((event, idx) => (
              <div key={idx} className="event-item">
                <small className="time">{event.timestamp}</small>
                <strong>{event.type}</strong>
                <p>{event.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const TabUsers = () => (
    <div className="table-container">
      <h3>All Users</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Joined</th>
          </tr>
        </thead>
        <tbody>
          {data.users.length === 0 ? (
            <tr><td colSpan="5" className="empty">No users found</td></tr>
          ) : (
            data.users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.full_name}</td>
                <td>{user.email}</td>
                <td><span className={`badge ${user.role}`}>{user.role}</span></td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const TabSessions = () => (
    <div className="table-container">
      <h3>Interview Sessions</h3>
      <table>
        <thead>
          <tr>
            <th>Session ID</th>
            <th>Candidate</th>
            <th>Job</th>
            <th>Type</th>
            <th>Status</th>
            <th>Score</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {data.sessions.length === 0 ? (
            <tr><td colSpan="7" className="empty">No sessions found</td></tr>
          ) : (
            data.sessions.map((session) => (
              <tr key={session.id}>
                <td>#{session.id}</td>
                <td>User {session.candidate_id}</td>
                <td>Job {session.job_id}</td>
                <td>{session.interview_type}</td>
                <td><span className={`badge ${session.status}`}>{session.status}</span></td>
                <td>{session.final_score ? `${session.final_score.toFixed(1)}%` : '-'}</td>
                <td>{session.interview_duration ? `${session.interview_duration}s` : '-'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const TabHiring = () => (
    <div className="table-container">
      <h3>Hiring Decisions</h3>
      <table>
        <thead>
          <tr>
            <th>Candidate</th>
            <th>Job</th>
            <th>AI Score</th>
            <th>Decision</th>
            <th>Feedback</th>
          </tr>
        </thead>
        <tbody>
          {data.hiringDecisions.length === 0 ? (
            <tr><td colSpan="5" className="empty">No decisions found</td></tr>
          ) : (
            data.hiringDecisions.map((decision) => (
              <tr key={decision.id}>
                <td>User {decision.candidate_id}</td>
                <td>Job {decision.job_id}</td>
                <td>{decision.ai_score ? decision.ai_score.toFixed(1) : '-'}</td>
                <td><span className={`badge ${decision.decision}`}>{decision.decision}</span></td>
                <td className="truncate">{decision.feedback || '-'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const TabOffers = () => (
    <div className="table-container">
      <h3>Job Offers</h3>
      <table>
        <thead>
          <tr>
            <th>Candidate</th>
            <th>Job</th>
            <th>Salary</th>
            <th>Start Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.jobOffers.length === 0 ? (
            <tr><td colSpan="5" className="empty">No offers found</td></tr>
          ) : (
            data.jobOffers.map((offer) => (
              <tr key={offer.id}>
                <td>User {offer.candidate_id}</td>
                <td>Job {offer.job_id}</td>
                <td>{offer.salary || '-'}</td>
                <td>{offer.start_date ? new Date(offer.start_date).toLocaleDateString() : '-'}</td>
                <td><span className={`badge ${offer.status}`}>{offer.status}</span></td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>🔧 Admin Dashboard</h1>
        <button onClick={loadData} disabled={loading} className="btn-refresh">
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      <div className="tab-navigation">
        <button className={`tab-btn ${tab === 'overview' ? 'active' : ''}`} onClick={() => setTab('overview')}>
          Overview
        </button>
        <button className={`tab-btn ${tab === 'users' ? 'active' : ''}`} onClick={() => setTab('users')}>
          Users
        </button>
        <button className={`tab-btn ${tab === 'sessions' ? 'active' : ''}`} onClick={() => setTab('sessions')}>
          Sessions
        </button>
        <button className={`tab-btn ${tab === 'hiring' ? 'active' : ''}`} onClick={() => setTab('hiring')}>
          Hiring
        </button>
        <button className={`tab-btn ${tab === 'offers' ? 'active' : ''}`} onClick={() => setTab('offers')}>
          Offers
        </button>
      </div>

      <div className="tab-content">
        {loading && <p className="loading">Loading data...</p>}
        {!loading && (
          <>
            {tab === 'overview' && <TabOverview />}
            {tab === 'users' && <TabUsers />}
            {tab === 'sessions' && <TabSessions />}
            {tab === 'hiring' && <TabHiring />}
            {tab === 'offers' && <TabOffers />}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
