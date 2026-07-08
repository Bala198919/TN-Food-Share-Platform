import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDonations } from '../context/DonationContext';

const ReceiverDashboard = () => {
  const { user } = useAuth();
  const { donations } = useDonations();
  
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  const fetchMyRequests = async () => {
    if (!user) return;
    try {
      setLoadingRequests(true);
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
      }
    } catch (err) {
      console.error('Error fetching receiver requests:', err);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    fetchMyRequests();
  }, [user, donations]);

  const stats = {
    totalRequests: requests.length,
    pending: requests.filter((r) => r.status === 'pending').length,
    accepted: requests.filter((r) => r.status === 'accepted').length,
    completed: requests.filter((r) => r.status === 'completed' || (r.donationId && r.donationId.status === 'completed')).length
  };

  const nearbyListings = donations
    .filter((d) => d.status === 'available' && (d.city === user?.city || !user?.city))
    .slice(0, 3);

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0', backgroundColor: 'var(--neutral-50)' }}>
      
      {/* Welcome Banner */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'white',
          padding: '2.5rem',
          borderRadius: 'var(--border-radius-md)',
          borderTop: '6px solid var(--info)',
          borderLeft: '1px solid var(--border-color)',
          borderRight: '1px solid var(--border-color)',
          borderBottom: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-md)',
          marginBottom: '2.5rem',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}
      >
        <div>
          <span style={{ fontSize: '0.8rem', backgroundColor: 'var(--info-light)', color: 'var(--info)', padding: '0.35rem 0.8rem', borderRadius: 'var(--border-radius-sm)', fontWeight: 700, textTransform: 'uppercase', border: '1px solid rgba(37,99,235,0.15)' }}>
            🙋 Food Acceptor Hub
          </span>
          <h2 style={{ fontSize: '1.75rem', margin: '0.75rem 0 0.25rem 0', fontFamily: 'var(--font-heading)', color: 'var(--info)' }}>
            Welcome, {user?.name || 'Acceptor Foundation'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Organization Type: <strong style={{ textTransform: 'capitalize' }}>{user?.acceptorType || 'NGO'}</strong> • City: {user?.city || 'Tamil Nadu'}
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link 
            to="/browse-donations" 
            className="btn" 
            style={{ 
              backgroundColor: 'var(--info)', 
              color: 'white', 
              fontWeight: 700, 
              padding: '0.65rem 1.25rem',
              borderRadius: 'var(--border-radius-sm)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            🔍 Browse Live Listings
          </Link>
          <Link 
            to="/my-requests" 
            className="btn btn-outline" 
            style={{ padding: '0.65rem 1.25rem', borderRadius: 'var(--border-radius-sm)', borderColor: 'var(--info)', color: 'var(--info)' }}
          >
            📋 My Claims Logs
          </Link>
        </div>
      </div>

      {/* Stats Counter Section */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        <div className="stat-card" style={{ borderLeft: '4px solid var(--info)' }}>
          <div className="stat-card-icon" style={{ backgroundColor: 'var(--info-light)', color: 'var(--info)' }}>📥</div>
          <div className="stat-card-data">
            <h3 style={{ color: 'var(--info)' }}>{stats.totalRequests}</h3>
            <p>Total Claims Requested</p>
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #3b82f6' }}>
          <div className="stat-card-icon" style={{ backgroundColor: '#eff6ff', color: '#3b82f6' }}>🕒</div>
          <div className="stat-card-data">
            <h3 style={{ color: '#1e3a8a' }}>{stats.pending}</h3>
            <p>Pending Approval</p>
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div className="stat-card-icon" style={{ backgroundColor: '#fffbeb', color: '#f59e0b' }}>🏃</div>
          <div className="stat-card-data">
            <h3 style={{ color: '#92400e' }}>{stats.accepted}</h3>
            <p>Approved Pickups</p>
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid var(--secondary)' }}>
          <div className="stat-card-icon" style={{ backgroundColor: 'var(--secondary-light)', color: 'var(--secondary-dark)' }}>✅</div>
          <div className="stat-card-data">
            <h3 style={{ color: 'var(--secondary-dark)' }}>{stats.completed}</h3>
            <p>Completed Handover</p>
          </div>
        </div>
      </div>

      {/* Main Sections */}
      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
        
        {/* Left Column: Live Nearby Food & My Requests */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Section: Nearby surplus listings */}
          <div className="dashboard-section" style={{ backgroundColor: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-md)', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--info)' }}>🍛 Available Food in {user?.city || 'Your Area'}</h3>
              <Link to="/browse-donations" style={{ fontSize: '0.85rem', color: 'var(--info)', fontWeight: 700 }}>Explore All →</Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {nearbyListings.length > 0 ? (
                nearbyListings.map((item) => {
                  const firstItem = item.foodItems?.[0] || {};
                  return (
                    <div 
                      key={item._id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1rem',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--border-radius-sm)',
                        backgroundColor: 'var(--neutral-100)',
                        flexWrap: 'wrap',
                        gap: '1rem'
                      }}
                    >
                      <div>
                        <h4 style={{ fontSize: '0.95rem', margin: 0, color: 'var(--neutral-800)' }}>
                          {firstItem.name || 'Food Platter'} {item.foodItems?.length > 1 ? `(+${item.foodItems.length - 1} more items)` : ''}
                        </h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>
                          🏨 Provider: <strong>{item.providerName}</strong> • {item.area}
                        </p>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link to={`/donation/${item._id}`} className="btn btn-sm" style={{ padding: '0.35rem 0.75rem', backgroundColor: 'var(--info)', color: 'white', fontWeight: 700, borderRadius: 'var(--border-radius-sm)' }}>
                          View Details
                        </Link>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center" style={{ padding: '3rem 0', color: 'var(--text-muted)' }}>
                  <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🍽️</p>
                  <p>No active food listings available right now in your city.</p>
                </div>
              )}
            </div>
          </div>

          {/* Section: Claims Logs */}
          <div className="dashboard-section" style={{ backgroundColor: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-md)', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--info)' }}>📋 Active Claims Tracker</h3>
              <Link to="/my-requests" style={{ fontSize: '0.85rem', color: 'var(--info)', fontWeight: 700 }}>Full Claims List</Link>
            </div>

            {loadingRequests ? (
              <p>Loading history...</p>
            ) : requests.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {requests.slice(0, 4).map((req) => (
                  <div 
                    key={req._id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '1rem',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--border-radius-sm)',
                      backgroundColor: 'var(--neutral-100)',
                      flexWrap: 'wrap',
                      gap: '1rem'
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: '0.95rem', margin: 0, color: 'var(--neutral-800)' }}>
                        {req.donationId?.providerName || 'Provider'} Food Claim
                      </h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>
                        Requested: {new Date(req.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <span 
                      style={{
                        padding: '0.2rem 0.5rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        borderRadius: '4px',
                        textTransform: 'uppercase',
                        backgroundColor: req.status === 'accepted' ? 'var(--secondary-light)' : req.status === 'pending' ? '#fffbeb' : '#fee2e2',
                        color: req.status === 'accepted' ? 'var(--secondary-dark)' : req.status === 'pending' ? '#92400e' : '#ef4444',
                        border: req.status === 'accepted' ? '1px solid var(--secondary)' : req.status === 'pending' ? '1px solid #f59e0b' : '1px solid #ef4444'
                      }}
                    >
                      {req.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center" style={{ padding: '2rem 0', color: 'var(--text-muted)' }}>
                <p>You have not made any claim requests yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Safe Food Handling guidelines */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div 
            style={{
              backgroundColor: 'white',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--border-radius-md)',
              padding: '2rem'
            }}
          >
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--info)' }}>💡 Safe Food Handling Instructions</h3>
            <p style={{ color: 'var(--neutral-600)', fontSize: '0.85rem', lineHeight: '1.6', margin: '0 0 1rem 0' }}>
              When collecting excess meals from hotels, wedding halls, or catering providers:
            </p>
            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--neutral-600)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Carry insulated bags or secure containers for transport.</li>
              <li>Keep hot food warm or refrigerate immediately.</li>
              <li>Check freshness visually and check smell before serving.</li>
              <li>Complete pickups strictly within the donor's schedule frame.</li>
            </ul>
          </div>

          <div 
            style={{
              backgroundColor: 'var(--neutral-900)',
              color: 'white',
              borderRadius: 'var(--border-radius-md)',
              padding: '2rem'
            }}
          >
            <h3 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '0.5rem' }}>📞 Support Helpline</h3>
            <p style={{ color: 'var(--neutral-300)', fontSize: '0.85rem', margin: '0 0 1rem 0' }}>
              Need assistance coordinating a pickup or report food safety issues?
            </p>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
              📞 1800-425-1234
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ReceiverDashboard;
