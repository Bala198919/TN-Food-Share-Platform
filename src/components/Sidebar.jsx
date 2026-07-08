import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderNavLinks = () => {
    switch (user.role) {
      case 'donor':
        return (
          <>
            <li>
              <NavLink to="/donor-dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                📊 Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/add-donation" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                ➕ Add Donation
              </NavLink>
            </li>
            <li>
              <NavLink to="/my-donations" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                📦 My Donations
              </NavLink>
            </li>
          </>
        );
      case 'receiver':
        return (
          <>
            <li>
              <NavLink to="/receiver-dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                📊 Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/browse-donations" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                🔍 Browse Food
              </NavLink>
            </li>
            <li>
              <NavLink to="/my-requests" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                📥 My Requests
              </NavLink>
            </li>
          </>
        );
      case 'admin':
        return (
          <>
            <li>
              <NavLink to="/admin-dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                ⚙️ Admin Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/browse-donations" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                🔍 Browse All Food
              </NavLink>
            </li>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-user">
        <div className="sidebar-avatar">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="sidebar-user-info">
          <h4>{user.name}</h4>
          <p>{user.role}</p>
        </div>
      </div>

      <ul className="sidebar-nav">
        {renderNavLinks()}
      </ul>

      <div className="sidebar-logout">
        <button onClick={handleLogout} className="btn btn-danger btn-full btn-sm">
          👋 Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
