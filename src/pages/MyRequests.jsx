import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MyRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterTab, setFilterTab] = useState('all');

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('food_share_token');
      const res = await fetch('http://localhost:5000/api/requests/my', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      const data = await res.json();
      if (data.success) {
        setRequests(data.data);
      } else {
        setError(data.message || 'Failed to fetch requests.');
      }
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError('Failed to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleCancelClaim = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this request?')) {
      return;
    }

    try {
      const token = localStorage.getItem('food_share_token');
      const res = await fetch(`http://localhost:5000/api/requests/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      const data = await res.json();
      if (data.success) {
        alert('Request cancelled successfully!');
        fetchRequests(); // Refresh list
      } else {
        alert(data.message || 'Failed to cancel request.');
      }
    } catch (err) {
      console.error('Error cancelling request:', err);
      alert('Failed to connect to server.');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'status-pending';
      case 'accepted': return 'status-completed'; // green badge for accepted
      case 'rejected': return 'status-claimed'; // red/yellow badge for rejected
      case 'cancelled': return 'status-claimed';
      default: return 'status-pending';
    }
  };

  const filteredClaims = requests.filter((req) => {
    if (filterTab === 'all') return true;
    return req.status.toLowerCase() === filterTab.toLowerCase();
  });

  if (loading) {
    return (
      <div className="text-center" style={{ padding: '4rem 0' }}>
        <div className="loading-spinner"></div>
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading your requests...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="dashboard-header">
        <div>
          <h2 className="dashboard-title">My Claim Requests</h2>
          <p style={{ color: 'var(--text-muted)' }}>Track and manage all surplus food items you have requested.</p>
        </div>
        <Link to="/browse-donations" className="btn btn-primary btn-sm">
          🔍 Browse More Food
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '2rem' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Tabs */}
      <div 
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--border-color)',
          marginBottom: '2rem',
          paddingBottom: '0.5rem'
        }}
      >
        <button
          onClick={() => setFilterTab('all')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 'var(--border-radius-sm)',
            fontWeight: 600,
            backgroundColor: filterTab === 'all' ? 'var(--primary-light)' : 'transparent',
            color: filterTab === 'all' ? 'var(--primary-dark)' : 'var(--neutral-600)',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          All Requests ({requests.length})
        </button>
        <button
          onClick={() => setFilterTab('pending')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 'var(--border-radius-sm)',
            fontWeight: 600,
            backgroundColor: filterTab === 'pending' ? 'var(--primary-light)' : 'transparent',
            color: filterTab === 'pending' ? 'var(--primary-dark)' : 'var(--neutral-600)',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Pending ({requests.filter(c => c.status === 'pending').length})
        </button>
        <button
          onClick={() => setFilterTab('accepted')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 'var(--border-radius-sm)',
            fontWeight: 600,
            backgroundColor: filterTab === 'accepted' ? 'var(--primary-light)' : 'transparent',
            color: filterTab === 'accepted' ? 'var(--primary-dark)' : 'var(--neutral-600)',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Accepted ({requests.filter(c => c.status === 'accepted').length})
        </button>
        <button
          onClick={() => setFilterTab('rejected')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 'var(--border-radius-sm)',
            fontWeight: 600,
            backgroundColor: filterTab === 'rejected' ? 'var(--primary-light)' : 'transparent',
            color: filterTab === 'rejected' ? 'var(--primary-dark)' : 'var(--neutral-600)',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Rejected ({requests.filter(c => c.status === 'rejected').length})
        </button>
      </div>

      {/* List */}
      <div className="dashboard-section" style={{ padding: '1.5rem' }}>
        {filteredClaims.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {filteredClaims.map((req) => {
              const item = req.donationId || {};
              const donor = req.donorId || {};
              return (
                <div 
                  key={req._id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--border-radius-md)',
                    padding: '1.5rem',
                    backgroundColor: 'var(--neutral-50)',
                    flexWrap: 'wrap',
                    gap: '1.5rem'
                  }}
                >
                  {/* Details */}
                  <div style={{ flex: 1, minWidth: '250px' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span className={`badge-status ${getStatusBadgeClass(req.status)}`} style={{ textTransform: 'capitalize' }}>
                        {req.status}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Request ID: {req._id}</span>
                    </div>
                    
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{item.title || 'Deleted Food Item'}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>{item.description || 'This food item details are no longer available.'}</p>
                    
                    {item.title && (
                      <div 
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                          gap: '1rem',
                          fontSize: '0.85rem',
                          padding: '1rem',
                          backgroundColor: 'white',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--border-radius-sm)'
                        }}
                      >
                        <div>
                          <p style={{ color: 'var(--text-muted)' }}>📍 Pickup Address:</p>
                          <p style={{ fontWeight: 600 }}>{item.pickupLocation}</p>
                        </div>
                        <div>
                          <p style={{ color: 'var(--text-muted)' }}>👤 Shared By:</p>
                          <p style={{ fontWeight: 600 }}>{donor.name || item.donorName || 'Donor'}</p>
                        </div>
                        <div>
                          <p style={{ color: 'var(--text-muted)' }}>📞 Contact Phone:</p>
                          <p style={{ fontWeight: 600 }}>{donor.phone || item.phone || 'N/A'}</p>
                        </div>
                        {req.notes && (
                          <div style={{ gridColumn: '1 / -1' }}>
                            <p style={{ color: 'var(--text-muted)' }}>📝 My Notes:</p>
                            <p style={{ fontStyle: 'italic' }}>"{req.notes}"</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignSelf: 'center' }}>
                    {item._id && (
                      <Link to={`/donation/${item._id}`} className="btn btn-outline btn-sm" style={{ width: '120px' }}>
                        🔍 View details
                      </Link>
                    )}
                    {req.status === 'pending' && (
                      <button 
                        onClick={() => handleCancelClaim(req._id)} 
                        className="btn btn-danger btn-sm"
                        style={{ width: '120px' }}
                      >
                        ❌ Cancel
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center" style={{ padding: '3rem 0', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋🍽️</div>
            <h3>No Requests Found</h3>
            <p style={{ marginTop: '0.5rem' }}>You don't have any items matching this tab filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequests;
