import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDonations } from '../context/DonationContext';
import { useAuth } from '../context/AuthContext';
import FoodMap from '../components/FoodMap';

const DonationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { donations, deleteDonation } = useDonations();
  const { user } = useAuth();
  
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [notes, setNotes] = useState('');
  
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const donation = donations.find((d) => d._id === id);

  const fetchRequestsForListing = async () => {
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
      console.error('Error fetching requests details:', err);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    fetchRequestsForListing();
  }, [id, user, donations]);

  if (!donation) {
    return (
      <div className="container text-center" style={{ padding: '5rem 0' }}>
        <h3>Listing Not Found</h3>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>The food donation item might have expired or been removed.</p>
        <Link to="/browse-donations" className="btn btn-primary mt-4">
          Browse Active Food
        </Link>
      </div>
    );
  }

  // Safe checks for donor object or ID string
  const donorIdStr = (donation.donor && typeof donation.donor === 'object') 
    ? donation.donor._id 
    : donation.donor;

  const isOwner = user && user._id === donorIdStr;
  const isAdmin = user && user.role === 'admin';

  // Filter requests related to this donation listing
  const donationRequests = requests.filter(
    (req) => req.donationId && req.donationId._id === donation._id
  );

  // For receivers: check if they have submitted a request
  const myRequest = donationRequests.find(
    (req) => req.receiverId && req.receiverId._id === user?._id
  );

  const handleClaim = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'receiver') {
      setErrorMsg('Only registered Receivers/NGOs can request food donations.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');
      setSuccessMsg('');
      const token = localStorage.getItem('food_share_token');
      const res = await fetch('http://localhost:5000/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
          donationId: donation._id,
          notes
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Your claim request has been submitted successfully! Waiting for donor approval.');
        setNotes('');
        fetchRequestsForListing();
      } else {
        setErrorMsg(data.message || 'Failed to submit claim request.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Connection error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelClaim = async (requestId) => {
    if (!window.confirm('Are you sure you want to cancel your claim request?')) {
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');
      setSuccessMsg('');
      const token = localStorage.getItem('food_share_token');
      const res = await fetch(`http://localhost:5000/api/requests/${requestId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Your claim request has been cancelled.');
        fetchRequestsForListing();
      } else {
        setErrorMsg(data.message || 'Failed to cancel claim request.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Connection error.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestDecision = async (requestId, status) => {
    try {
      setSubmitting(true);
      setErrorMsg('');
      setSuccessMsg('');
      const token = localStorage.getItem('food_share_token');
      const res = await fetch(`http://localhost:5000/api/requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Request successfully ${status}!`);
        navigate(0); 
      } else {
        setErrorMsg(data.message || `Failed to ${status} request.`);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Connection error.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleComplete = async () => {
    try {
      setSubmitting(true);
      setErrorMsg('');
      setSuccessMsg('');
      const token = localStorage.getItem('food_share_token');
      const res = await fetch(`http://localhost:5000/api/requests/complete/${donation._id}`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Donation successfully marked as Completed/Collected!');
        navigate(0);
      } else {
        setErrorMsg(data.message || 'Failed to mark completion.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Connection error.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      deleteDonation(donation._id);
      navigate(user?.role === 'donor' ? '/my-donations' : '/browse-donations');
    }
  };

  const firstItem = donation.foodItems[0] || {};
  const coverImageUrl = donation.coverImage || firstItem.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80';

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 0' }}>
      <Link to="/browse-donations" style={{ color: 'var(--primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginBottom: '2rem' }}>
        ← Back to Browse
      </Link>

      {successMsg && <div className="alert alert-success">✅ {successMsg}</div>}
      {errorMsg && <div className="alert alert-danger">⚠️ {errorMsg}</div>}

      <div className="details-grid">
        {/* Left Side: Images & Location Details */}
        <div>
          <div className="details-image">
            <img 
              src={coverImageUrl} 
              alt={donation.providerName}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80';
              }}
            />
          </div>

          <div className="details-section" style={{ marginTop: '2rem' }}>
            <h3>🏨 Provider Details</h3>
            <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>
              {donation.providerName}
            </p>
            {user && (
              <p style={{ color: 'var(--neutral-700)', marginBottom: '0.5rem' }}>
                📞 Contact Phone: <strong>{donation.contact}</strong>
              </p>
            )}
            <p style={{ color: 'var(--neutral-700)', lineHeight: '1.6' }}>
              📍 Pickup Address:
              <br />
              <strong>{donation.pickupAddress}</strong>
              <br />
              Area: {donation.area} • City: {donation.city} • {donation.state}
            </p>
            {/* Location Map Preview */}
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ marginBottom: '0.75rem', fontSize: '1.1rem' }}>🗺️ Pickup Map Location</h3>
              <FoodMap 
                listings={[donation]} 
                center={[donation.coordinates?.lat || 13.0827, donation.coordinates?.lng || 80.2707]} 
                zoom={14} 
                height="240px" 
              />
            </div>
          </div>
        </div>

        {/* Right Side: Food Items & Action Panel */}
        <div className="details-info">
          <div className="details-header">
            <h1 style={{ fontSize: '2.25rem' }}>Surplus Food Listing</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Available timings: ⏳ <strong>{donation.availableFrom || 'Anytime'} - {donation.availableUntil || 'Anytime'}</strong>
            </p>
          </div>

          {/* Section: List of food items */}
          <div className="details-section">
            <h3 style={{ marginBottom: '1rem' }}>🥗 Food Items Included</h3>
            <div className="table-responsive">
              <table className="table" style={{ width: '100%', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--neutral-100)' }}>
                    <th>Photo</th>
                    <th>Item Name</th>
                    <th>Quantity</th>
                    <th>Meal Category</th>
                    <th>Type</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {donation.foodItems.map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <img 
                          src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=80&auto=format&fit=crop&q=80'} 
                          alt={item.name}
                          style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: 'var(--border-radius-sm)' }}
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=80&auto=format&fit=crop&q=80';
                          }}
                        />
                      </td>
                      <td><strong>{item.name}</strong></td>
                      <td>{item.quantity} {item.unit}</td>
                      <td style={{ textTransform: 'capitalize' }}>{item.category}</td>
                      <td>
                        <span className={`badge-status ${item.foodType === 'veg' ? 'status-available' : 'status-claimed'}`} style={{ fontSize: '0.75rem', padding: '0.1rem 0.4rem' }}>
                          {item.foodType}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{item.description || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {donation.notes && (
            <div className="details-section" style={{ backgroundColor: 'var(--neutral-50)', padding: '1rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '0.25rem' }}>📝 Special Notes / Instructions:</h4>
              <p style={{ fontStyle: 'italic', fontSize: '0.85rem' }}>"{donation.notes}"</p>
            </div>
          )}

          {/* Action Panel based on state/roles */}
          <div className="details-section" style={{ borderTop: '2px solid var(--border-color)', paddingTop: '2rem', marginTop: '2rem' }}>
            
            {/* 1. ANONYMOUS USER */}
            {!user && (
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  Please log in or register as a Receiver (NGO) to request this donation.
                </p>
                <Link to="/login" className="btn btn-primary btn-full">
                  🔑 Log In to Request
                </Link>
              </div>
            )}

            {/* 2. RECEIVER USER */}
            {user && user.role === 'receiver' && (
              <div>
                {donation.status === 'available' && !myRequest && (
                  <form onSubmit={handleClaim}>
                    <div style={{ marginBottom: '1rem' }}>
                      <label htmlFor="notes" style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>
                        Add Request Notes (optional)
                      </label>
                      <textarea
                        id="notes"
                        rows="2"
                        className="form-control"
                        placeholder="e.g. NGO pickup timings..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      ></textarea>
                    </div>
                    <button type="submit" disabled={submitting} className="btn btn-primary btn-full btn-lg">
                      {submitting ? 'Submitting Request...' : '🙋 Request This Food'}
                    </button>
                  </form>
                )}

                {myRequest && myRequest.status === 'pending' && (
                  <div style={{ padding: '1rem', backgroundColor: 'var(--secondary-light)', border: '1px solid var(--secondary)', borderRadius: 'var(--border-radius-sm)' }}>
                    <p style={{ fontWeight: 600, color: 'var(--secondary-dark)' }}>🕒 Claim Request Pending Approval</p>
                    <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
                      The donor has been notified of your request.
                    </p>
                    <button 
                      onClick={() => handleCancelClaim(myRequest._id)} 
                      disabled={submitting}
                      className="btn btn-outline btn-danger btn-full btn-sm"
                    >
                      {submitting ? 'Cancelling...' : '❌ Cancel Request'}
                    </button>
                  </div>
                )}

                {myRequest && myRequest.status === 'accepted' && (
                  <div className="alert alert-success">
                    <h4>🎉 Request Approved!</h4>
                    <p style={{ marginTop: '0.5rem' }}>
                      Please coordinate pickup with the donor:
                      <br />
                      📞 Contact Phone: <strong>{donation.contact}</strong>
                      <br />
                      📍 Pickup Address: <strong>{donation.pickupAddress}</strong>
                    </p>
                  </div>
                )}

                {myRequest && myRequest.status === 'rejected' && (
                  <div className="alert alert-danger">
                    <p>⚠️ Sorry, your request for this food was rejected or claimed by another NGO.</p>
                  </div>
                )}

                {donation.status === 'reserved' && !myRequest && (
                  <button className="btn btn-secondary btn-full" disabled>
                    🔒 Reserved for another NGO
                  </button>
                )}

                {donation.status === 'completed' && (
                  <button className="btn btn-secondary btn-full" disabled>
                    ✅ Completed / Picked Up
                  </button>
                )}
              </div>
            )}

            {/* 3. DONOR OWNER USER */}
            {user && isOwner && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>📋 Claims / Requests for this listing</h3>
                  
                  {loadingRequests ? (
                    <p>Loading requests...</p>
                  ) : donationRequests.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {donationRequests.map((req) => (
                        <div 
                          key={req._id} 
                          style={{
                            padding: '1rem',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--border-radius-sm)',
                            backgroundColor: 'white'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <strong>NGO: {req.receiverId?.name || 'NGO User'}</strong>
                            <span className="badge-status status-pending" style={{ textTransform: 'capitalize' }}>
                              {req.status}
                            </span>
                          </div>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                            Contact: {req.receiverId?.phone || 'N/A'} | Email: {req.receiverId?.email || 'N/A'}
                          </p>
                          {req.notes && (
                            <p style={{ fontStyle: 'italic', fontSize: '0.85rem', marginTop: '0.5rem', backgroundColor: 'var(--neutral-50)', padding: '0.5rem' }}>
                              "{req.notes}"
                            </p>
                          )}
                          
                          {req.status === 'pending' && donation.status === 'available' && (
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                              <button 
                                onClick={() => handleRequestDecision(req._id, 'accepted')}
                                disabled={submitting}
                                className="btn btn-primary btn-sm"
                              >
                                Accept Claim
                              </button>
                              <button 
                                onClick={() => handleRequestDecision(req._id, 'rejected')}
                                disabled={submitting}
                                className="btn btn-outline btn-danger btn-sm"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-muted)' }}>No requests received yet for this listing.</p>
                  )}
                </div>

                {donation.status === 'reserved' && (
                  <div style={{ padding: '1rem', backgroundColor: 'var(--secondary-light)', border: '1px solid var(--secondary)', borderRadius: 'var(--border-radius-sm)' }}>
                    <h4>👤 Claim Reserved to:</h4>
                    <p style={{ fontWeight: 600, marginTop: '0.25rem' }}>{donation.receiverName}</p>
                    <p>Phone: <strong>{donation.receiverPhone || 'N/A'}</strong></p>
                    <button 
                      onClick={handleComplete} 
                      disabled={submitting} 
                      className="btn btn-primary btn-full mt-4"
                    >
                      {submitting ? 'Updating...' : '✅ Mark Handover Complete'}
                    </button>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button onClick={handleDelete} className="btn btn-danger btn-full btn-sm">
                    🗑️ Delete Listing
                  </button>
                </div>
              </div>
            )}

            {/* 4. ADMIN USER */}
            {user && isAdmin && (
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={handleDelete} className="btn btn-danger btn-full">
                  🗑️ Remove Listing (Admin Action)
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationDetails;
