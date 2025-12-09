import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CompanyUserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([
    { id: 1, name: 'John Smith', email: 'john@company.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Sarah Lee', email: 'sarah@company.com', role: 'Manager', status: 'Active' },
    { id: 3, name: 'Mike Johnson', email: 'mike@company.com', role: 'Interviewer', status: 'Active' },
    { id: 4, name: 'Emily Davis', email: 'emily@company.com', role: 'Interviewer', status: 'Inactive' }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Interviewer',
    status: 'Active'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      alert('Please fill in all fields');
      return;
    }

    const newUser = {
      id: users.length + 1,
      ...formData
    };

    setUsers([...users, newUser]);
    setFormData({ name: '', email: '', role: 'Interviewer', status: 'Active' });
    setShowForm(false);
    alert('User added successfully!');
  };

  const handleDeleteUser = (id) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
      alert('User deleted successfully!');
    }
  };

  const handleEditUser = (id) => {
    const user = users.find(u => u.id === id);
    setFormData(user);
    setShowForm(true);
    // In real app, you'd update the user instead
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>👥 User Management</h1>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>

      <div style={styles.contentWrapper}>
        <div style={styles.usersSection}>
          <div style={styles.sectionHeader}>
            <h2>Company Users ({users.length})</h2>
            <button
              onClick={() => setShowForm(!showForm)}
              style={styles.addBtn}
            >
              {showForm ? '✕ Cancel' : '➕ Add User'}
            </button>
          </div>

          <div style={styles.usersTable}>
            <div style={styles.tableHeader}>
              <div style={styles.tableCell}>Name</div>
              <div style={styles.tableCell}>Email</div>
              <div style={styles.tableCell}>Role</div>
              <div style={styles.tableCell}>Status</div>
              <div style={styles.tableCell}>Actions</div>
            </div>

            {users.map(user => (
              <div key={user.id} style={styles.tableRow}>
                <div style={styles.tableCell}>{user.name}</div>
                <div style={styles.tableCell}>{user.email}</div>
                <div style={styles.tableCell}>
                  <span style={{...styles.badge, backgroundColor: getRoleColor(user.role) + '40', color: getRoleColor(user.role)}}>
                    {user.role}
                  </span>
                </div>
                <div style={styles.tableCell}>
                  <span style={{...styles.badge, backgroundColor: user.status === 'Active' ? '#10b98140' : '#6b728040', color: user.status === 'Active' ? '#10b981' : '#6b7280'}}>
                    {user.status}
                  </span>
                </div>
                <div style={styles.tableCell}>
                  <button
                    onClick={() => handleEditUser(user.id)}
                    style={styles.editBtn}
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    style={styles.deleteBtn}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showForm && (
          <div style={styles.formSection}>
            <h3>Add New User</h3>
            <form onSubmit={handleAddUser} style={styles.form}>
              <div style={styles.formGroup}>
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label>Role *</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  style={styles.select}
                >
                  <option>Admin</option>
                  <option>Manager</option>
                  <option>Interviewer</option>
                  <option>HR</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label>Status *</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  style={styles.select}
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>

              <button type="submit" style={styles.submitBtn}>
                ✓ Add User
              </button>
            </form>
          </div>
        )}
      </div>

      <button
        onClick={() => navigate('/company-dashboard')}
        style={styles.backBtn}
      >
        ← Back to Dashboard
      </button>
    </div>
  );
}

function getRoleColor(role) {
  switch(role) {
    case 'Admin': return '#6366f1';
    case 'Manager': return '#8b5cf6';
    case 'Interviewer': return '#06b6d4';
    case 'HR': return '#f97316';
    default: return '#6b7280';
  }
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
  contentWrapper: {
    display: 'grid',
    gridTemplateColumns: '1fr 350px',
    gap: '2rem',
    marginBottom: '2rem',
    maxWidth: '1200px',
    margin: '0 auto 2rem'
  },
  usersSection: {
    background: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(100, 116, 139, 0.3)',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid rgba(100, 116, 139, 0.3)'
  },
  addBtn: {
    padding: '0.6rem 1.2rem',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  },
  usersTable: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
    border: '1px solid rgba(100, 116, 139, 0.3)',
    borderRadius: '8px',
    overflow: 'hidden'
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '200px 250px 120px 100px 150px',
    gap: '1rem',
    padding: '1rem',
    background: 'rgba(99, 102, 241, 0.1)',
    borderBottom: '1px solid rgba(100, 116, 139, 0.3)',
    fontWeight: '700',
    color: '#cbd5e1'
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '200px 250px 120px 100px 150px',
    gap: '1rem',
    padding: '1rem',
    borderBottom: '1px solid rgba(100, 116, 139, 0.2)',
    alignItems: 'center',
    transition: 'background 0.3s ease'
  },
  tableCell: {
    color: '#cbd5e1',
    fontSize: '0.95rem'
  },
  badge: {
    display: 'inline-block',
    padding: '0.4rem 0.8rem',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: '600'
  },
  editBtn: {
    padding: '0.4rem 0.8rem',
    background: 'rgba(99, 102, 241, 0.2)',
    color: '#6366f1',
    border: '1px solid rgba(99, 102, 241, 0.5)',
    borderRadius: '6px',
    cursor: 'pointer',
    marginRight: '0.5rem',
    transition: 'all 0.3s ease'
  },
  deleteBtn: {
    padding: '0.4rem 0.8rem',
    background: 'rgba(239, 68, 68, 0.2)',
    color: '#ef4444',
    border: '1px solid rgba(239, 68, 68, 0.5)',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  formSection: {
    background: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(100, 116, 139, 0.3)',
    borderRadius: '16px',
    padding: '1.5rem',
    height: 'fit-content',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginTop: '1rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  input: {
    padding: '0.6rem 0.8rem',
    background: 'rgba(30, 41, 59, 0.5)',
    border: '1px solid rgba(100, 116, 139, 0.3)',
    borderRadius: '6px',
    color: '#f8fafc',
    fontSize: '0.9rem',
    fontFamily: 'inherit',
    marginTop: '0.4rem'
  },
  select: {
    padding: '0.6rem 0.8rem',
    background: 'rgba(30, 41, 59, 0.5)',
    border: '1px solid rgba(100, 116, 139, 0.3)',
    borderRadius: '6px',
    color: '#f8fafc',
    fontSize: '0.9rem',
    fontFamily: 'inherit',
    cursor: 'pointer',
    marginTop: '0.4rem'
  },
  submitBtn: {
    padding: '0.6rem 1rem',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '0.5rem'
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
