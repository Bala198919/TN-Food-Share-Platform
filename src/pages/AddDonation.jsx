import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDonations } from '../context/DonationContext';
import { useAuth } from '../context/AuthContext';

const AddDonation = () => {
  const { addDonation } = useDonations();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [providerName, setProviderName] = useState(user ? user.name : '');
  const [contact, setContact] = useState(user ? user.phone : '');
  const [city, setCity] = useState('Chennai');
  const [area, setArea] = useState('');
  const [pickupAddress, setPickupAddress] = useState(user ? user.address : '');
  const [lat, setLat] = useState('13.0827');
  const [lng, setLng] = useState('80.2707');
  const [availableFrom, setAvailableFrom] = useState('');
  const [availableUntil, setAvailableUntil] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [notes, setNotes] = useState('');
  const [donationDate, setDonationDate] = useState(new Date().toISOString().substring(0, 10));

  const defaultCityCoordinates = {
    'Chennai': { lat: '13.0827', lng: '80.2707' },
    'Coimbatore': { lat: '11.0168', lng: '76.9558' },
    'Madurai': { lat: '9.9252', lng: '78.1198' },
    'Trichy': { lat: '10.7905', lng: '78.7047' },
    'Salem': { lat: '11.6643', lng: '78.1460' },
    'Erode': { lat: '11.3410', lng: '77.7172' },
    'Tirunelveli': { lat: '8.7139', lng: '77.7567' },
    'Thanjavur': { lat: '10.7870', lng: '79.1378' },
    'Vellore': { lat: '12.9165', lng: '79.1325' },
    'Tuticorin': { lat: '8.7642', lng: '78.1348' }
  };

  const handleCityChange = (newCity) => {
    setCity(newCity);
    if (defaultCityCoordinates[newCity]) {
      setLat(defaultCityCoordinates[newCity].lat);
      setLng(defaultCityCoordinates[newCity].lng);
    }
  };

  const [foodItems, setFoodItems] = useState([
    { name: '', quantity: '', unit: 'plates', category: 'breakfast', foodType: 'veg', image: '', description: '' }
  ]);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAddItem = () => {
    setFoodItems(prev => [
      ...prev,
      { name: '', quantity: '', unit: 'plates', category: 'breakfast', foodType: 'veg', image: '', description: '' }
    ]);
  };

  const handleRemoveItem = (index) => {
    if (foodItems.length === 1) return;
    setFoodItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    setFoodItems(prev => {
      const copy = [...prev];
      copy[index][field] = value;
      return copy;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!user) {
      setError('You must be logged in to list donations.');
      return;
    }

    if (!providerName || !city || !area || !pickupAddress || !contact) {
      setError('Please fill in all provider and pickup address fields.');
      return;
    }

    // Basic foodItems validations
    for (let i = 0; i < foodItems.length; i++) {
      const item = foodItems[i];
      if (!item.name.trim()) {
        setError(`Food Item #${i + 1} has no name.`);
        return;
      }
      if (!item.quantity || isNaN(item.quantity) || Number(item.quantity) <= 0) {
        setError(`Food Item #${i + 1} has invalid quantity. Must be a positive number.`);
        return;
      }
    }

    try {
      setSubmitting(true);
      const payload = {
        providerName,
        state: 'Tamil Nadu',
        city,
        area,
        pickupAddress,
        contact,
        donationDate,
        availableFrom,
        availableUntil,
        coverImage,
        notes,
        foodItems: foodItems.map(item => ({
          ...item,
          quantity: Number(item.quantity)
        })),
        coordinates: {
          lat: parseFloat(lat),
          lng: parseFloat(lng)
        }
      };

      const res = await addDonation(payload);
      if (res.success) {
        setSuccess('🎉 MERN Tamil Nadu surplus food donation listed successfully!');
        setTimeout(() => {
          navigate('/my-donations');
        }, 1500);
      } else {
        setError(res.message || 'Failed to submit donation. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Server connection failure.');
    } finally {
      setSubmitting(false);
    }
  };

  const cities = ['Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem', 'Erode', 'Tirunelveli', 'Thanjavur', 'Vellore', 'Tuticorin'];

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 0' }}>
      <div 
        style={{
          backgroundColor: 'white',
          padding: '2.5rem',
          borderRadius: 'var(--border-radius-md)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', textAlign: 'center' }}>🥗 Share Surplus Food (Tamil Nadu)</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', textAlign: 'center', fontSize: '0.95rem' }}>
          List excess meals, catering leftovers, or grocery items to link with registered shelters.
        </p>

        {error && <div className="alert alert-danger">⚠️ {error}</div>}
        {success && <div className="alert alert-success">✅ {success}</div>}

        <form onSubmit={handleSubmit}>
          
          {/* Section 1: Provider Details */}
          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.25rem', fontSize: '1.2rem' }}>🧑 Provider & Contact</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Hotel / Provider Name</label>
              <input
                type="text"
                value={providerName}
                onChange={(e) => setProviderName(e.target.value)}
                placeholder="e.g. A2B Adyar Ananda Bhavan"
                className="form-control"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Contact Number</label>
              <input
                type="tel"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="e.g. 9840123456"
                className="form-control"
                required
              />
            </div>
          </div>

          {/* Section 2: Location Details */}
          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.25rem', marginTop: '1.5rem', fontSize: '1.2rem' }}>📍 Pickup Location</h3>
          
          <div className="form-row" style={{ gridTemplateColumns: '1fr 2fr 2fr' }}>
            <div className="form-group">
              <label className="form-label">State</label>
              <input
                type="text"
                value="Tamil Nadu"
                disabled
                className="form-control"
                style={{ backgroundColor: 'var(--neutral-100)', cursor: 'not-allowed' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">City</label>
              <select
                value={city}
                onChange={(e) => handleCityChange(e.target.value)}
                className="form-control"
                required
              >
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Area / Locality</label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. Mylapore / Tambaram"
                className="form-control"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Full Pickup Address</label>
            <textarea
              value={pickupAddress}
              onChange={(e) => setPickupAddress(e.target.value)}
              placeholder="Door number, street name, landmarks..."
              className="form-control"
              rows="2"
              required
            />
          </div>

          <div 
            style={{ 
              padding: '1.25rem', 
              backgroundColor: 'var(--neutral-50)', 
              borderRadius: 'var(--border-radius-sm)', 
              border: '1px solid var(--border-color)',
              marginBottom: '1.5rem' 
            }}
          >
            <strong style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem' }}>🗺️ Map Coordinates Selector (Auto-filled)</strong>
            <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Coordinates are loaded based on your selected city. You can manually adjust them to set your exact location for NGOs discovery.
            </p>
            <div className="form-row" style={{ margin: 0, gap: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  className="form-control"
                  style={{ fontSize: '0.85rem' }}
                  required
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  className="form-control"
                  style={{ fontSize: '0.85rem' }}
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 3: Availability Parameters */}
          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.25rem', marginTop: '1.5rem', fontSize: '1.2rem' }}>🕒 Availability & Timings</h3>
          
          <div className="form-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className="form-group">
              <label className="form-label">Donation Date</label>
              <input
                type="date"
                value={donationDate}
                onChange={(e) => setDonationDate(e.target.value)}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Available From</label>
              <input
                type="text"
                value={availableFrom}
                onChange={(e) => setAvailableFrom(e.target.value)}
                placeholder="e.g. 12:30 PM"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Available Until</label>
              <input
                type="text"
                value={availableUntil}
                onChange={(e) => setAvailableUntil(e.target.value)}
                placeholder="e.g. 03:00 PM"
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Cover Image URL (Optional)</label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://example.com/cover-image.jpg"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Additional Instructions / Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Bring own containers, item is refrigerated, etc."
              className="form-control"
              rows="2"
            />
          </div>

          {/* Section 4: Dynamic Food Items */}
          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.25rem', marginTop: '1.5rem', fontSize: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>🍲 Food Items List</span>
            <button 
              type="button" 
              onClick={handleAddItem}
              className="btn btn-outline btn-sm"
              style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}
            >
              ➕ Add Food Item
            </button>
          </h3>

          {foodItems.map((item, index) => (
            <div 
              key={index} 
              style={{
                padding: '1.5rem',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--border-radius-sm)',
                backgroundColor: 'var(--neutral-50)',
                marginBottom: '1.5rem',
                position: 'relative'
              }}
            >
              {foodItems.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'var(--danger)',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '1.1rem'
                  }}
                  title="Remove this item"
                >
                  ✕
                </button>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Food Item Name *</label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                    placeholder="e.g. Dosa / Pongal / Meals"
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Quantity *</label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    placeholder="e.g. 20"
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Unit *</label>
                  <select
                    value={item.unit}
                    onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                    className="form-control"
                    required
                  >
                    <option value="plates">plates</option>
                    <option value="packets">packets</option>
                    <option value="boxes">boxes</option>
                    <option value="persons">persons</option>
                    <option value="kg">kg</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Veg / Non-Veg *</label>
                  <select
                    value={item.foodType}
                    onChange={(e) => handleItemChange(index, 'foodType', e.target.value)}
                    className="form-control"
                    required
                  >
                    <option value="veg">Veg</option>
                    <option value="non-veg">Non-Veg</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Meal Type *</label>
                  <select
                    value={item.category}
                    onChange={(e) => handleItemChange(index, 'category', e.target.value)}
                    className="form-control"
                    required
                  >
                    <option value="breakfast">breakfast</option>
                    <option value="lunch">lunch</option>
                    <option value="dinner">dinner</option>
                    <option value="snacks">snacks</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Item Photo URL (Optional)</label>
                <input
                  type="url"
                  value={item.image}
                  onChange={(e) => handleItemChange(index, 'image', e.target.value)}
                  placeholder="https://example.com/item-photo.jpg"
                  className="form-control"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Short Description (Optional)</label>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  placeholder="e.g. Sambar and chutney included, fresh hot"
                  className="form-control"
                />
              </div>
            </div>
          ))}

          <button 
            type="submit" 
            disabled={submitting} 
            className="btn btn-primary btn-full mt-4 btn-lg"
          >
            {submitting ? 'Submitting Surplus...' : '🤝 Publish Food Listing'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDonation;
