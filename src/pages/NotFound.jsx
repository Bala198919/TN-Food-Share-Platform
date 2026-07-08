import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container animate-fade-in">
      <div className="notfound-wrapper">
        <div className="notfound-code">404</div>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>This Plate is Empty!</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: '1.6' }}>
          Oops! The page you are looking for doesn't exist. It might have been devoured, expired, or moved to another table.
        </p>
        <div style={{ fontSize: '5rem', marginBottom: '2rem' }}>🍽️❌</div>
        <div>
          <Link to="/" className="btn btn-primary btn-lg">
            🏠 Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
