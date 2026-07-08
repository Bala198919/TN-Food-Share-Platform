import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDonations } from '../context/DonationContext';
import { API_BASE_URL } from '../config';

const DonorDashboard = () => {
  const { user } = useAuth();
  const { donations } = useDonations();
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  const fetchIncomingRequests = async () => {
    if (!user) return;
    try {
      setLoadingRequests(true);
      const token = localStorage.getItem('food_share_token');
      const res = await fetch(`${API_BASE_URL}/api/requests/my`, {
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
      console.error('Error fetching incoming requests:', err);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    fetchIncomingRequests();
  }, [user, donations]);

  const myListings = donations.filter((d) => {
    const donorId = d.donor && typeof d.donor === 'object' ? d.donor._id : d.donor;
    return donorId === user?._id;
  });

  const stats = {
    totalShared: myListings.length,
    active: myListings.filter((d) => d.status === 'available').length,
    reserved: myListings.filter((d) => d.status === 'reserved').length,
    completed: myListings.filter((d) => d.status === 'completed').length,
    pendingReqs: requests.filter((r) => r.status === 'pending').length
  };

  const reservedListings = myListings.filter((d) => d.status === 'reserved');
  const recentListings = myListings.slice(0, 5);

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
          borderTop: '6px solid var(--primary)',
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
          <span style={{ fontSize: '0.8rem', backgroundColor: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '0.35rem 0.8rem', borderRadius: 'var(--border-radius-sm)', fontWeight: 800, textTransform: 'uppercase', border: '1px solid rgba(217,119,6,0.15)' }}>
            🏨 Food Provider Hub
          </span>
          <h2 style={{ fontSize: '1.75rem', margin: '0.75rem 0 0.25rem 0', fontFamily: 'var(--font-heading)', color: 'var(--primary-dark)' }}>
            Welcome, {user?.name || 'Partner Provider'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Establishment Type: <strong style={{ textTransform: 'capitalize' }}>{user?.providerType || 'Restaurant'}</strong> • Area: {user?.area || 'Tamil Nadu'}
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link 
            to="/add-donation" 
            className="btn" 
            style={{ 
              backgroundColor: 'var(--primary)', 
              color: 'white', 
              fontWeight: 700, 
              padding: '0.65rem 1.25rem',
              borderRadius: 'var(--border-radius-sm)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            ➕ Post Surplus Food
          </Link>
          <Link 
            to="/browse-donations" 
            className="btn btn-outline" 
            style={{ padding: '0.65rem 1.25rem', borderRadius: 'var(--border-radius-sm)', borderColor: 'var(--primary)', color: 'var(--primary)' }}
          >
            🔍 Browse Live Feed
          </Link>
        </div>
      </div>

      {/* Stats Counter Section */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        <div className="stat-card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <div className="stat-card-icon" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>🍲</div>
          <div className="stat-card-data">
            <h3 style={{ color: 'var(--primary-dark)' }}>{stats.totalShared}</h3>
            <p>Total Listings</p>
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid var(--secondary)' }}>
          <div className="stat-card-icon" style={{ backgroundColor: 'var(--secondary-light)', color: 'var(--secondary)' }}>🟢</div>
          <div className="stat-card-data">
            <h3 style={{ color: 'var(--secondary-dark)' }}>{stats.active}</h3>
            <p>Active Posts</p>
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div className="stat-card-icon" style={{ backgroundColor: '#fffbeb', color: '#f59e0b' }}>🕒</div>
          <div className="stat-card-data">
            <h3 style={{ color: '#92400e' }}>{stats.reserved}</h3>
            <p>Reserved Pickups</p>
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid var(--secondary)' }}>
          <div className="stat-card-icon" style={{ backgroundColor: 'var(--secondary-light)', color: 'var(--secondary-dark)' }}>✅</div>
          <div className="stat-card-data">
            <h3 style={{ color: 'var(--secondary-dark)' }}>{stats.completed}</h3>
            <p>Handovers</p>
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid var(--danger)' }}>
          <div className="stat-card-icon" style={{ backgroundColor: 'var(--danger-light)', color: 'var(--danger)' }}>📥</div>
          <div className="stat-card-data">
            <h3 style={{ color: 'var(--danger)' }}>{stats.pendingReqs}</h3>
            <p>Pending Claims</p>
          </div>
        </div>
      </div>

      {/* Main Sections */}
      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
        
        {/* Left Column: My Food Listings */}
        <div>
          <div className="dashboard-section" style={{ backgroundColor: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-md)', padding: '2rem' }}>
            <div className="dashboard-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 className="dashboard-section-title" style={{ margin: 0, fontSize: '1.2rem', color: 'var(--primary-dark)' }}>📦 Active Surplus Inventory</h3>
              <Link to="/my-donations" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700 }}>Manage All →</Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recentListings.length > 0 ? (
                recentListings.map((item) => {
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
                        gap: '1.5rem'
                      }}
                    >
                      <div>
                        <h4 style={{ fontSize: '0.95rem', margin: 0, color: 'var(--neutral-800)' }}>
                          {firstItem.name || 'Food Listing'} {item.foodItems?.length > 1 ? `(+${item.foodItems.length - 1} more items)` : ''}
                        </h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>
                          📍 {item.area}, {item.city} • Available Until: <strong>{item.availableUntil || 'N/A'}</strong>
                        </p>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span 
                          style={{
                            padding: '0.25rem 0.6rem',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            borderRadius: '4px',
                            textTransform: 'uppercase',
                            backgroundColor: item.status === 'available' ? 'var(--secondary-light)' : item.status === 'reserved' ? '#fffbeb' : 'var(--neutral-200)',
                            color: item.status === 'available' ? 'var(--secondary-dark)' : item.status === 'reserved' ? '#92400e' : 'var(--neutral-700)',
                            border: item.status === 'available' ? '1px solid var(--secondary)' : item.status === 'reserved' ? '1px solid #f59e0b' : 'none'
                          }}
                        >
                          {item.status}
                        </span>
                        <Link to={`/donation/${item._id}`} className="btn btn-outline btn-sm" style={{ padding: '0.35rem 0.75rem', borderColor: 'var(--primary)', color: 'var(--primary)' }}>
                          Manage
                        </Link>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center" style={{ padding: '3rem 0', color: 'var(--text-muted)' }}>
                  <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🍛</p>
                  <p>No surplus food listings are registered under your hotel profile.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Pending Pickup Approvals & Account Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Active Handovers Tracker */}
          <div className="dashboard-section" style={{ backgroundColor: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-md)', padding: '2rem' }}>
            <h3 className="dashboard-section-title" style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--primary-dark)' }}>🕒 Urgent Handover Pickups</h3>
            
            {reservedListings.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {reservedListings.map((item) => (
                  <div 
                    key={item._id}
                    style={{
                      padding: '1.25rem',
                      border: '1px solid #f59e0b',
                      borderRadius: 'var(--border-radius-sm)',
                      backgroundColor: '#fffbeb'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '0.95rem', color: '#92400e' }}>{item.foodItems?.[0]?.name || 'Meals'} Handover</strong>
                      <span className="badge-status status-claimed" style={{ fontSize: '0.7rem' }}>reserved</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#92400e', marginTop: '0.5rem', marginBottom: '1rem', lineHeight: '1.5' }}>
                      NGO Organization: <strong>{item.receiverName}</strong>
                      <br />
                      NGO Mobile: <strong>{item.receiverPhone || 'N/A'}</strong>
                    </p>
                    <Link 
                      to={`/donation/${item._id}`} 
                      className="btn btn-sm btn-full" 
                      style={{ 
                        backgroundColor: 'var(--secondary)', 
                        color: 'white', 
                        fontWeight: 700,
                        padding: '0.5rem 0.85rem',
                        boxShadow: '0 4px 6px rgba(5,150,105,0.2)',
                        borderRadius: 'var(--border-radius-sm)'
                      }}
                    >
                      Confirm Complete Handover
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center" style={{ padding: '2rem 0', color: 'var(--text-muted)' }}>
                <p>No active reserved claims requiring pickups currently.</p>
              </div>
            )}
          </div>

          {/* Impact Overview details */}
          <div className="dashboard-section" style={{ backgroundColor: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-md)', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>🌱 Zero-Waste Carbon Impact</h3>
            <div style={{ padding: '1.25rem', backgroundColor: 'var(--primary-light)', border: '1px solid rgba(217,119,6,0.2)', borderRadius: 'var(--border-radius-sm)', fontSize: '0.85rem' }}>
              <p style={{ margin: '0 0 0.75rem 0', color: 'var(--primary-dark)', lineHeight: '1.5' }}>
                By listing surplus food, you are directly preventing organic landfill waste and feeding local care shelters.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, borderTop: '1px dashed rgba(217,119,6,0.3)', paddingTop: '0.5rem', color: 'var(--primary-dark)' }}>
                <span>CO₂ Avoided:</span>
                <span>{stats.completed * 8} kg</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;
