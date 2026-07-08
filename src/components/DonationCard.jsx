import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DonationCard = ({ donation, showActions = true, actionButton }) => {
  const { user } = useAuth();
  const { 
    _id, 
    providerName, 
    city, 
    area, 
    coverImage, 
    status, 
    foodItems = [], 
    availableUntil 
  } = donation;

  // Extract properties of the first item
  const firstItem = foodItems[0] || {};
  const firstItemName = firstItem.name || 'Food';
  const firstItemQty = firstItem.quantity || 0;
  const firstItemUnit = firstItem.unit || 'plates';
  const firstItemType = firstItem.foodType || 'veg';
  const firstItemCategory = firstItem.category || 'breakfast';

  const cardTitle = foodItems.length > 1 
    ? `${firstItemName} (+${foodItems.length - 1} more items)` 
    : firstItemName;

  const cardImage = coverImage || firstItem.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=60';

  const getCategoryBadgeClass = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'breakfast': return 'badge-veg';
      case 'lunch': return 'badge-nonveg';
      case 'dinner': return 'badge-vegan';
      case 'snacks': return 'badge-bakery';
      default: return 'badge-veg';
    }
  };

  const getStatusBadgeClass = (stat) => {
    switch (stat?.toLowerCase()) {
      case 'available': return 'status-available';
      case 'reserved': return 'status-claimed';
      case 'completed': return 'status-completed';
      default: return 'status-pending';
    }
  };

  return (
    <div className="card donation-card animate-fade-in">
      <div className="donation-card-img">
        <img 
          src={cardImage} 
          alt={cardTitle} 
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=60';
          }}
        />
        <span className={`donation-badge ${firstItemType.toLowerCase() === 'veg' ? 'badge-veg' : 'badge-nonveg'}`}>
          {firstItemType.toUpperCase()}
        </span>
      </div>

      <div className="card-body">
        <div className="donation-card-meta">
          <span>📦 {firstItemQty} {firstItemUnit}</span>
          {availableUntil && <span>⏳ Until: {availableUntil}</span>}
        </div>

        <h3 className="donation-card-title">{cardTitle}</h3>
        
        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '0.25rem' }}>
          🏨 {providerName}
        </p>
        
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          📍 {city}, {area}
        </p>

        <div className="donation-card-footer">
          <span className={`badge-status ${getCategoryBadgeClass(firstItemCategory)}`} style={{ textTransform: 'capitalize' }}>
            {firstItemCategory}
          </span>
          <span className={`badge-status ${getStatusBadgeClass(status)}`}>
            {status}
          </span>
        </div>
        
        {showActions && (
          <div style={{ marginTop: '1.25rem' }}>
            {actionButton ? actionButton : (
              <Link to={`/donation/${_id}`} className="btn btn-outline btn-full btn-sm">
                🔍 View Details & Items
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationCard;
