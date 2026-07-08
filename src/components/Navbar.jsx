import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    if (user.role === 'admin') return '/admin-dashboard';
    if (user.role === 'donor') return '/donor-dashboard';
    return '/receiver-dashboard';
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="navbar" style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: 'white', borderBottom: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
      <div className="container navbar-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px', position: 'relative' }}>
        
        {/* Brand Logo */}
        <Link 
          to="/" 
          className="logo" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.6rem', 
            fontWeight: '800', 
            fontSize: '1.4rem',
            color: 'var(--neutral-900)'
          }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="6" fill="var(--primary-light)" />
            <path d="M7 15C7 19.4 11 23 16 23C21 23 25 19.4 25 15" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M12 12C12 14.2 14 16 16 16C18 16 20 12.2 20 12" stroke="var(--secondary)" strokeWidth="2" strokeLinecap="round" />
            <circle cx="16" cy="8.5" r="1.5" fill="var(--rust)" />
          </svg>
          <span style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.5px' }}>
            TN Food<span style={{ color: 'var(--primary)' }}>Share</span>
          </span>
        </Link>

        {/* Mobile Toggle Hamburger Button */}
        <button 
          onClick={toggleMobileMenu} 
          style={{ display: 'none', flexDirection: 'column', gap: '5px', background: 'none', border: 'none', cursor: 'pointer' }}
          className="mobile-hamburger-btn"
        >
          <span style={{ width: '25px', height: '3px', backgroundColor: 'var(--neutral-850)', borderRadius: '2px' }}></span>
          <span style={{ width: '25px', height: '3px', backgroundColor: 'var(--neutral-850)', borderRadius: '2px' }}></span>
          <span style={{ width: '25px', height: '3px', backgroundColor: 'var(--neutral-850)', borderRadius: '2px' }}></span>
        </button>

        {/* Responsive Wrap Menu Container */}
        <div className={`nav-menu ${mobileMenuOpen ? 'mobile-open' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          
          {/* Navigation Links */}
          <ul className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', listStyle: 'none', margin: 0, padding: 0 }}>
            <li>
              <NavLink 
                to="/" 
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                style={{ fontWeight: 550, color: 'var(--neutral-600)', transition: 'var(--transition-fast)' }}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/browse-donations" 
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                style={{ fontWeight: 550, color: 'var(--neutral-600)', transition: 'var(--transition-fast)' }}
              >
                Browse Food
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/about" 
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                style={{ fontWeight: 550, color: 'var(--neutral-600)', transition: 'var(--transition-fast)' }}
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/contact" 
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                style={{ fontWeight: 550, color: 'var(--neutral-600)', transition: 'var(--transition-fast)' }}
              >
                Contact
              </NavLink>
            </li>
            {user && (
              <li>
                <NavLink 
                  to={getDashboardPath()} 
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  style={{ fontWeight: 600, color: 'var(--primary-dark)', transition: 'var(--transition-fast)' }}
                >
                  Dashboard
                </NavLink>
              </li>
            )}
          </ul>

          {/* User Sign In/Sign Out Buttons */}
          <div className="nav-buttons" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} className="user-profile-nav">
                <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--neutral-700)' }}>
                  Hi, <strong style={{ color: 'var(--primary-dark)' }}>{user.name.split(' ')[0]}</strong> 
                  <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--neutral-100)', padding: '0.2rem 0.5rem', borderRadius: '4px', marginLeft: '0.25rem', textTransform: 'capitalize' }}>
                    {user.role === 'donor' ? 'Provider' : user.role === 'receiver' ? 'Acceptor' : 'Admin'}
                  </span>
                </span>
                <button 
                  onClick={handleLogout} 
                  className="btn btn-outline btn-sm"
                  style={{ padding: '0.4rem 0.85rem' }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link to="/login" className="btn btn-outline btn-sm" style={{ padding: '0.45rem 1rem' }}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm" style={{ padding: '0.45rem 1rem' }}>
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
