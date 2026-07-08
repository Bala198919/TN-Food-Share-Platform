import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [activeTab, setActiveTab] = useState('donor'); // 'donor' = Provider, 'receiver' = Acceptor, 'admin' = Admin
  const [email, setEmail] = useState('donor@food.com');
  const [password, setPassword] = useState('donor123');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleTabChange = (role) => {
    setActiveTab(role);
    setError('');
    if (role === 'donor') {
      setEmail('donor@food.com');
      setPassword('donor123');
    } else if (role === 'receiver') {
      setEmail('receiver@food.com');
      setPassword('receiver123');
    } else {
      setEmail('admin@food.com');
      setPassword('admin123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await login(email, password);
      
      if (res.success) {
        const savedUser = JSON.parse(localStorage.getItem('food_share_user'));
        
        if (savedUser.role === 'donor') {
          navigate('/donor-dashboard');
        } else if (savedUser.role === 'receiver') {
          navigate('/receiver-dashboard');
        } else {
          navigate('/admin-dashboard');
        }
      } else {
        setError(res.message || 'Invalid email or password.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection failure. Check if server is running.');
    } finally {
      setSubmitting(false);
    }
  };

  const themeColor = activeTab === 'donor' 
    ? '#10b981' 
    : activeTab === 'receiver' 
      ? '#2563eb' 
      : '#6366f1';

  const themeLightBg = activeTab === 'donor' 
    ? '#ecfdf5' 
    : activeTab === 'receiver' 
      ? '#eff6ff' 
      : '#f5f3ff';

  const themeTextDark = activeTab === 'donor' 
    ? '#065f46' 
    : activeTab === 'receiver' 
      ? '#1e3a8a' 
      : '#312e81';

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 0', maxWidth: '500px' }}>
      <div 
        className="form-card"
        style={{
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
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '3rem' }}>
            {activeTab === 'donor' ? '🏨' : activeTab === 'receiver' ? '🙋' : '⚙️'}
          </span>
          <h2 style={{ fontSize: '1.85rem', marginTop: '0.5rem', fontFamily: 'var(--font-heading)', color: themeTextDark }}>
            {activeTab === 'donor' 
              ? 'Food Provider Login' 
              : activeTab === 'receiver' 
                ? 'Food Acceptor Login' 
                : 'Administrator Sign In'}
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            {activeTab === 'donor' 
              ? 'Manage and list surplus meals' 
              : activeTab === 'receiver' 
                ? 'Coordinate claims for local shelters' 
                : 'Platform statistics block panel'}
          </p>
        </div>

        {/* Tab Selectors */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr 1fr', 
            gap: '0.25rem', 
            backgroundColor: 'var(--neutral-100)', 
            padding: '0.35rem', 
            borderRadius: 'var(--border-radius-sm)',
            marginBottom: '2rem'
          }}
        >
          <button
            type="button"
            onClick={() => handleTabChange('donor')}
            style={{
              padding: '0.6rem 0.25rem',
              borderRadius: 'var(--border-radius-sm)',
              fontWeight: '700',
              fontSize: '0.8rem',
              backgroundColor: activeTab === 'donor' ? 'white' : 'transparent',
              color: activeTab === 'donor' ? '#065f46' : 'var(--neutral-500)',
              boxShadow: activeTab === 'donor' ? 'var(--shadow-sm)' : 'none',
              transition: 'var(--transition-smooth)'
            }}
          >
            🏨 Provider
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('receiver')}
            style={{
              padding: '0.6rem 0.25rem',
              borderRadius: 'var(--border-radius-sm)',
              fontWeight: '700',
              fontSize: '0.8rem',
              backgroundColor: activeTab === 'receiver' ? 'white' : 'transparent',
              color: activeTab === 'receiver' ? '#1e3a8a' : 'var(--neutral-500)',
              boxShadow: activeTab === 'receiver' ? 'var(--shadow-sm)' : 'none',
              transition: 'var(--transition-smooth)'
            }}
          >
            🙋 Acceptor
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('admin')}
            style={{
              padding: '0.6rem 0.25rem',
              borderRadius: 'var(--border-radius-sm)',
              fontWeight: '700',
              fontSize: '0.8rem',
              backgroundColor: activeTab === 'admin' ? 'white' : 'transparent',
              color: activeTab === 'admin' ? '#312e81' : 'var(--neutral-500)',
              boxShadow: activeTab === 'admin' ? 'var(--shadow-sm)' : 'none',
              transition: 'var(--transition-smooth)'
            }}
          >
            ⚙️ Admin
          </button>
        </div>

        {error && <div className="alert alert-danger">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              placeholder="name@organization.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              placeholder="••••••••"
              required
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
            {submitting ? 'Authenticating...' : '🚀 Secure Sign In'}
          </button>
        </form>

        {/* Demo Help Banner */}
        <div 
          style={{
            marginTop: '2rem',
            padding: '1rem',
            backgroundColor: 'var(--neutral-50)',
            borderRadius: 'var(--border-radius-sm)',
            fontSize: '0.8rem',
            border: `1px dashed ${themeColor}`
          }}
        >
          <strong style={{ color: themeTextDark }}>💡 Click Tabs Above to Autocomplete Demo Credentials:</strong>
          <ul style={{ paddingLeft: '1.25rem', marginTop: '0.5rem', listStyleType: 'circle' }}>
            <li><strong>Provider:</strong> donor@food.com / donor123</li>
            <li><strong>Acceptor (NGO):</strong> receiver@food.com / receiver123</li>
            <li><strong>Admin:</strong> admin@food.com / admin123</li>
          </ul>
        </div>

        <div className="form-footer" style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem' }}>
          Don't have an account? <Link to="/register" style={{ color: themeColor, fontWeight: '700' }}>Create one here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
