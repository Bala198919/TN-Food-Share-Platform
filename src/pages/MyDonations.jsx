import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDonations } from '../context/DonationContext';

const MyDonations = () => {
  const { user } = useAuth();
  const { donations, updateDonationStatus, deleteDonation } = useDonations();
  const [activeTab, setActiveTab] = useState('all');

  const myListings = donations.filter((d) => d.donorId === user?._id);

  const filteredListings = myListings.filter((item) => {
    if (activeTab === 'all') return true;
    return item.status.toLowerCase() === activeTab.toLowerCase();
  });

  const handleComplete = (id) => {
    updateDonationStatus(id, 'completed');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      deleteDonation(id);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'available': return 'status-available';
      case 'reserved': return 'status-claimed'; // status-claimed class maps to yellow color in CSS
      case 'completed': return 'status-completed';
      default: return 'status-pending';
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="dashboard-header">
        <div>
          <h2 className="dashboard-title">My Surplus Listings</h2>
          <p style={{ color: 'var(--text-muted)' }}>Manage and track all excess food listings you have published.</p>
        </div>
        <Link to="/add-donation" className="btn btn-primary btn-sm">
          ➕ Share Excess Food
        </Link>
      </div>

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
        {['all', 'available', 'reserved', 'completed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--border-radius-sm)',
              fontWeight: 600,
              textTransform: 'capitalize',
              backgroundColor: activeTab === tab ? 'var(--primary-light)' : 'transparent',
              color: activeTab === tab ? 'var(--primary-dark)' : 'var(--neutral-600)',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {tab === 'reserved' ? 'reserved (claimed)' : tab}
          </button>
        ))}
      </div>

      {/* Listings Table/Cards */}
      <div className="dashboard-section" style={{ padding: '1rem' }}>
        {filteredListings.length > 0 ? (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Food Listing</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Expiry</th>
                  <th>Status</th>
                  <th>Action Needed / Info</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredListings.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div>
                        <strong>{item.title}</strong>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Posted: {new Date(item.createdAt).toLocaleDateString()}</p>
                      </div>
                    </td>
                    <td>
                      <span className="badge-status status-pending" style={{ textTransform: 'uppercase', fontSize: '0.7rem' }}>
                        {item.category}
                      </span>
                    </td>
                    <td>{item.quantity}</td>
                    <td>{item.expiryTime}</td>
                    <td>
                      <span className={`badge-status ${getStatusBadgeClass(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      {item.status === 'reserved' ? (
                        <div style={{ fontSize: '0.8rem' }}>
                          🧑 Claimed by: <strong>{item.receiverName}</strong>
                          <br />
                          📞 Ph: <strong>{item.receiverPhone || 'N/A'}</strong>
                        </div>
                      ) : item.status === 'completed' ? (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Picked up</span>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--primary-dark)' }}>Waiting for claim...</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <Link to={`/donation/${item._id}`} className="btn btn-outline btn-sm">
                          View
                        </Link>
                        {item.status === 'reserved' && (
                          <button 
                            onClick={() => handleComplete(item._id)} 
                            className="btn btn-primary btn-sm"
                          >
                            Complete
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(item._id)} 
                          className="btn btn-danger btn-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center" style={{ padding: '4rem 0', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦🌾</div>
            <h3>No Listings Found</h3>
            <p style={{ marginTop: '0.5rem' }}>No listings match your selected tab filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyDonations;
