import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>🥗 FoodShare</h3>
            <p>
              Bridging the gap between food abundance and food scarcity. Join our community to share excess food, reduce waste, and feed those in need.
            </p>
            <div className="footer-socials">
              <a href="#" className="footer-social-btn" aria-label="Facebook">FB</a>
              <a href="#" className="footer-social-btn" aria-label="Twitter">TW</a>
              <a href="#" className="footer-social-btn" aria-label="Instagram">IG</a>
              <a href="#" className="footer-social-btn" aria-label="LinkedIn">LN</a>
            </div>
          </div>

          <div>
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/browse-donations" className="footer-link">Browse Food</Link></li>
              <li><Link to="/about" className="footer-link">About Us</Link></li>
              <li><Link to="/contact" className="footer-link">Contact Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Our Impact</h4>
            <ul className="footer-links">
              <li><span className="footer-link">15,000+ Meals Shared</span></li>
              <li><span className="footer-link">250+ Active Donors</span></li>
              <li><span className="footer-link">50+ Local Shelters</span></li>
              <li><span className="footer-link">1.2 Tons Waste Prevented</span></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Contact Us</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--neutral-400)', marginBottom: '0.5rem' }}>
              Have questions? We are here to help.
            </p>
            <p style={{ fontSize: '0.9rem', color: 'white', fontWeight: 500 }}>
              support@foodshare.org
            </p>
            <p style={{ fontSize: '0.9rem', color: 'var(--neutral-400)', marginTop: '0.5rem' }}>
              +1 (555) 123-4567
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} FoodShare. All rights reserved.</p>
          <p>Made with 💚 to protect our planet.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
