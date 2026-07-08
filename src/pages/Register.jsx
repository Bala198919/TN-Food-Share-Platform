import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [activeTab, setActiveTab] = useState('donor'); // 'donor' = Provider, 'receiver' = Acceptor
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    city: 'Chennai',
    area: '',
    pincode: '',
    contactPersonName: '',
    logoUrl: '',
    description: '',
    providerType: 'restaurant',
    businessId: '',
    acceptorType: 'NGO',
    peopleServed: ''
  });

  const cities = ['Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem', 'Erode', 'Tirunelveli', 'Thanjavur', 'Vellore', 'Tuticorin'];

  const providerTypes = [
    { value: 'hotel', label: 'Hotel' },
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'catering', label: 'Catering Service' },
    { value: 'mess', label: 'Local Mess / Canteen' },
    { value: 'marriage hall', label: 'Marriage Hall' },
    { value: 'hostel', label: 'Hostel Mess' },
    { value: 'bakery', label: 'Bakery' },
    { value: 'home donor', label: 'Home Food Donor' }
  ];

  const acceptorTypes = [
    { value: 'NGO', label: 'Non-Governmental Org (NGO)' },
    { value: 'old age home', label: 'Old Age Home' },
    { value: 'orphanage', label: 'Orphanage / Children Home' },
    { value: 'child care home', label: 'Child Care Home' },
    { value: 'shelter', label: 'Night Shelter' },
    { value: 'trust', label: 'Charitable Trust' },
    { value: 'community kitchen', label: 'Community / Relief Kitchen' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTabChange = (role) => {
    setActiveTab(role);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        role: activeTab,
        state: 'Tamil Nadu'
      };

      if (activeTab === 'donor') {
        payload.acceptorType = '';
        payload.peopleServed = undefined;
      } else {
        payload.providerType = '';
        payload.businessId = '';
      }

      const res = await register(payload);
      if (res.success) {
        setSuccess('🎉 Profile created successfully! Directing to dashboard...');
        setTimeout(() => {
          navigate(activeTab === 'donor' ? '/donor-dashboard' : '/receiver-dashboard');
        }, 1500);
      } else {
        setError(res.message || 'Email might already be registered.');
      }
    } catch (err) {
      console.error(err);
      setError('Server connection failure.');
    } finally {
      setSubmitting(false);
    }
  };

  const themeColor = activeTab === 'donor' ? '#10b981' : '#2563eb';
  const themeLightBg = activeTab === 'donor' ? '#ecfdf5' : '#eff6ff';
  const themeTextDark = activeTab === 'donor' ? '#065f46' : '#1e3a8a';

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 0', maxWidth: '750px' }}>
      <div 
        className="form-card" 
        style={{ 
          maxWidth: '100%', 
          padding: '2.5rem', 
          backgroundColor: 'white', 
          borderRadius: 'var(--border-radius-md)', 
          borderTop: `6px solid ${themeColor}`,
          borderLeft: '1px solid var(--border-color)',
          borderRight: '1px solid var(--border-color)',
          borderBottom: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-lg)',
          transition: 'border-color 0.4s ease'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ fontSize: '3rem' }}>{activeTab === 'donor' ? '🏨' : '🙋'}</span>
          <h2 style={{ fontSize: '2rem', marginTop: '0.5rem', fontFamily: 'var(--font-heading)', color: themeTextDark }}>
            {activeTab === 'donor' ? 'Register as Food Provider' : 'Register as Food Acceptor'}
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            {activeTab === 'donor' 
              ? 'List surplus meals, canteens leftovers, or wedding catering harvests.' 
              : 'Claim available food listings to distribute at orphanages, homes, or trusts.'}
          </p>
        </div>

        {/* Tab Selectors */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '0.5rem', 
            backgroundColor: 'var(--neutral-100)', 
            padding: '0.4rem', 
            borderRadius: 'var(--border-radius-sm)',
            marginBottom: '2rem'
          }}
        >
          <button
            type="button"
            onClick={() => handleTabChange('donor')}
            style={{
              padding: '0.75rem',
              borderRadius: 'var(--border-radius-sm)',
              fontWeight: '700',
              fontSize: '0.95rem',
              backgroundColor: activeTab === 'donor' ? 'white' : 'transparent',
              color: activeTab === 'donor' ? '#065f46' : 'var(--neutral-500)',
              boxShadow: activeTab === 'donor' ? 'var(--shadow-sm)' : 'none',
              transition: 'var(--transition-smooth)'
            }}
          >
            🏨 Food Provider
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('receiver')}
            style={{
              padding: '0.75rem',
              borderRadius: 'var(--border-radius-sm)',
              fontWeight: '700',
              fontSize: '0.95rem',
              backgroundColor: activeTab === 'receiver' ? 'white' : 'transparent',
              color: activeTab === 'receiver' ? '#1e3a8a' : 'var(--neutral-500)',
              boxShadow: activeTab === 'receiver' ? 'var(--shadow-sm)' : 'none',
              transition: 'var(--transition-smooth)'
            }}
          >
            🙋 Food Acceptor
          </button>
        </div>

        {error && <div className="alert alert-danger">⚠️ {error}</div>}
        {success && <div className="alert alert-success">✅ {success}</div>}

        <form onSubmit={handleSubmit}>
          <h3 style={{ color: themeTextDark, borderBottom: `2px solid ${themeLightBg}`, paddingBottom: '0.5rem', marginBottom: '1.25rem', fontSize: '1.15rem' }}>
            📋 Step 1: Organization Details
          </h3>

          <div className="form-group">
            <label className="form-label">
              {activeTab === 'donor' ? 'Establishment / Hotel Name *' : 'NGO / Foundation Name *'}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={activeTab === 'donor' ? 'e.g. A2B Adyar Ananda Bhavan' : 'e.g. Anbu Old Age Home'}
              className="form-control"
              style={{ borderFocus: `1px solid ${themeColor}` }}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Type *</label>
              {activeTab === 'donor' ? (
                <select
                  name="providerType"
                  value={formData.providerType}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  {providerTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              ) : (
                <select
                  name="acceptorType"
                  value={formData.acceptorType}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  {acceptorTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Contact Person Name *</label>
              <input
                type="text"
                name="contactPersonName"
                value={formData.contactPersonName}
                onChange={handleChange}
                placeholder="Name of representative"
                className="form-control"
                required
              />
            </div>
          </div>

          <h3 style={{ color: themeTextDark, borderBottom: `2px solid ${themeLightBg}`, paddingBottom: '0.5rem', marginBottom: '1.25rem', marginTop: '1.5rem', fontSize: '1.15rem' }}>
            📍 Step 2: Location & Contact
          </h3>

          <div className="form-row" style={{ gridTemplateColumns: '1fr 2fr' }}>
            <div className="form-group">
              <label className="form-label">Mobile Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. 9840123456"
                className="form-control"
                required
              />
            </div>

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
          </div>

          <div className="form-row" style={{ gridTemplateColumns: '1.5fr 2fr 1fr' }}>
            <div className="form-group">
              <label className="form-label">City *</label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="form-control"
                required
              >
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Area / Locality *</label>
              <input
                type="text"
                name="area"
                value={formData.area}
                onChange={handleChange}
                placeholder="e.g. Mylapore"
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Pincode *</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="600004"
                className="form-control"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Full Address *</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Door number, street name, landmarks..."
              className="form-control"
              required
            />
          </div>

          <h3 style={{ color: themeTextDark, borderBottom: `2px solid ${themeLightBg}`, paddingBottom: '0.5rem', marginBottom: '1.25rem', marginTop: '1.5rem', fontSize: '1.15rem' }}>
            🔑 Step 3: Login Credentials
          </h3>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@organization.org"
              className="form-control"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                className="form-control"
                required
              />
            </div>
          </div>

          <h3 style={{ color: themeTextDark, borderBottom: `2px solid ${themeLightBg}`, paddingBottom: '0.5rem', marginBottom: '1.25rem', marginTop: '1.5rem', fontSize: '1.15rem' }}>
            📝 Step 4: Verification & Description
          </h3>

          <div className="form-row">
            {activeTab === 'donor' ? (
              <div className="form-group">
                <label className="form-label">GST / Food Business Registration ID</label>
                <input
                  type="text"
                  name="businessId"
                  value={formData.businessId}
                  onChange={handleChange}
                  placeholder="e.g. 33AAAAA0000A1Z1"
                  className="form-control"
                />
              </div>
            ) : (
              <div className="form-group">
                <label className="form-label">Average People Served Daily</label>
                <input
                  type="number"
                  name="peopleServed"
                  value={formData.peopleServed}
                  onChange={handleChange}
                  placeholder="e.g. 150"
                  className="form-control"
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Logo / Image URL</label>
              <input
                type="url"
                name="logoUrl"
                value={formData.logoUrl}
                onChange={handleChange}
                placeholder="https://example.com/logo.png"
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description / Vision Statement</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={activeTab === 'donor' ? 'Tell receivers about your kitchen capacities, daily prep routines...' : 'Tell providers about your trust purpose, feeding targets...'}
              className="form-control"
              rows="3"
            />
          </div>

          <button 
            type="submit" 
            disabled={submitting} 
            className="btn btn-full mt-4 btn-lg"
            style={{ 
              backgroundColor: themeColor, 
              color: 'white', 
              fontWeight: '700', 
              boxShadow: `0 8px 15px -3px ${themeColor}40`,
              transition: 'var(--transition-smooth)'
            }}
          >
            {submitting ? 'Creating Profile...' : '🤝 Create Account Profile'}
          </button>
        </form>

        <div className="form-footer" style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: themeColor, fontWeight: '700' }}>Log in here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
