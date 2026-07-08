import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [donationsList, setDonationsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('food_share_token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      };

      // 1. Fetch dashboard metrics stats
      const statsRes = await fetch('http://localhost:5000/api/admin/stats', { headers });
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.data);
      }

      // 2. Fetch users register
      const usersRes = await fetch('http://localhost:5000/api/admin/users', { headers });
      const usersData = await usersRes.json();
      if (usersData.success) {
        setUsersList(usersData.data);
      }

      // 3. Fetch all donations register
      const donationsRes = await fetch('http://localhost:5000/api/admin/donations', { headers });
      const donationsData = await donationsRes.json();
      if (donationsData.success) {
        setDonationsList(donationsData.data);
      }
    } catch (err) {
      console.error('Error fetching admin details:', err);
      setError('Connection failure. Could not connect to Admin API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteListing = async (id) => {
    if (!window.confirm('Admin Alert: Are you sure you want to delete this listing and all associated request logs?')) {
      return;
    }

    try {
      const token = localStorage.getItem('food_share_token');
      const res = await fetch(`http://localhost:5000/api/admin/donations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      const data = await res.json();
      if (data.success) {
        alert('Listing deleted successfully!');
        fetchAdminData(); // Refresh logs
      } else {
        alert(data.message || 'Failed to delete listing.');
      }
    } catch (err) {
      console.error('Error removing listing:', err);
      alert('Server connection error.');
    }
  };

  if (loading) {
    return (
      <div className="text-center" style={{ padding: '5rem 0' }}>
        <div className="loading-spinner"></div>
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading Admin Portal registers...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="dashboard-header">
        <div>
          <h2 className="dashboard-title">Platform Administration Panel</h2>
          <p style={{ color: 'var(--text-muted)' }}>Overview of user registrations and active excess food donation metrics.</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '2rem' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Stats Counter Section */}
      {stats && (
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <div className="stat-card">
            <div className="stat-card-icon" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>👥</div>
            <div className="stat-card-data">
              <h3>{stats.users?.total || 0}</h3>
              <p>Total Registered Users (Donors: {stats.users?.donors}, NGO: {stats.users?.receivers})</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-icon" style={{ backgroundColor: 'var(--info-light)', color: 'var(--info)' }}>🍲</div>
            <div className="stat-card-data">
              <h3>{stats.donations?.total || 0}</h3>
              <p>Total Listed Foods</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-icon" style={{ backgroundColor: 'var(--secondary-light)', color: 'var(--secondary)' }}>🕒</div>
            <div className="stat-card-data">
              <h3>{stats.donations?.reserved || 0}</h3>
              <p>Reserved (Claims Accepted)</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-icon" style={{ backgroundColor: '#eff6ff', color: '#1e40af' }}>🟢</div>
            <div className="stat-card-data">
              <h3>{stats.donations?.available || 0}</h3>
              <p>Available Listings</p>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
        {/* Left: Listings Management Table */}
        <div className="dashboard-section">
          <h3 className="dashboard-section-title" style={{ marginBottom: '1.5rem' }}>📦 Active Listings</h3>
          {donationsList.length > 0 ? (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Food Item</th>
                    <th>Donor</th>
                    <th>Quantity</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {donationsList.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <strong>{item.title}</strong>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {item._id}</p>
                      </td>
                      <td>{item.donorName}</td>
                      <td>{item.quantity}</td>
                      <td>
                        <span 
                          style={{
                            padding: '0.2rem 0.5rem',
                            fontSize: '0.75rem',
                            borderRadius: 'var(--border-radius-sm)',
                            fontWeight: 600,
                            backgroundColor: item.status === 'available' ? 'var(--primary-light)' : item.status === 'reserved' ? 'var(--secondary-light)' : 'var(--info-light)',
                            color: item.status === 'available' ? 'var(--primary-dark)' : item.status === 'reserved' ? 'var(--secondary-hover)' : 'var(--info)'
                          }}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <Link to={`/donation/${item._id}`} className="btn btn-outline btn-sm">View</Link>
                          <button onClick={() => handleDeleteListing(item._id)} className="btn btn-danger btn-sm">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>No food listings active.</p>
          )}
        </div>

        {/* Right: Registered Users List */}
        <div className="dashboard-section">
          <h3 className="dashboard-section-title" style={{ marginBottom: '1.5rem' }}>👥 Registered Partners</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {usersList.length > 0 ? (
              usersList.map((userObj) => (
                <div 
                  key={userObj._id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--border-radius-sm)',
                    backgroundColor: 'var(--neutral-50)'
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '0.95rem' }}>{userObj.name}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{userObj.email} • {userObj.phone || 'No Phone'}</p>
                  </div>
                  <span 
                    style={{
                      padding: '0.2rem 0.5rem',
                      fontSize: '0.75rem',
                      borderRadius: 'var(--border-radius-sm)',
                      fontWeight: 600,
                      backgroundColor: userObj.role === 'admin' ? '#f3e8ff' : userObj.role === 'donor' ? 'var(--primary-light)' : 'var(--info-light)',
                      color: userObj.role === 'admin' ? '#7c3aed' : userObj.role === 'donor' ? 'var(--primary-dark)' : 'var(--info)'
                    }}
                  >
                    {userObj.role}
                  </span>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>No partners registered.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
