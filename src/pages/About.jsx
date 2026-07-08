import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="about-page">
      {/* Header Banner */}
      <section className="hero" style={{ padding: '4rem 0 3rem 0', textAlign: 'center' }}>
        <div className="container">
          <span className="hero-tagline">Our Mission</span>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Bridging Food Excess and Need</h1>
          <p className="hero-subtitle" style={{ margin: '0 auto', maxWidth: '700px' }}>
            We believe that no edible food should ever go to waste while individuals in our neighborhood go hungry. Meet the team and system making food sharing simple.
          </p>
        </div>
      </section>

      {/* Main Details Section */}
      <section className="section">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '1.25rem', color: 'var(--neutral-900)' }}>
              The Challenge We Face
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: '1.6' }}>
              Every day, supermarkets, local cafes, event organizers, and households throw away perfectly good, fresh food simply because it didn't sell in time or was over-prepared.
            </p>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              At the exact same time, families and shelter centers struggle to find nutritious meals due to rising inflation and supply costs. This isn't just a social issue—food rot in landfills releases methane, accounting for 8% of all global greenhouse emissions.
            </p>
            <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '2rem', color: 'var(--primary)' }}>30%+</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Food is lost or wasted globally</p>
              </div>
              <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '2rem' }}>
                <h3 style={{ fontSize: '2rem', color: 'var(--danger)' }}>1 in 9</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>People face chronic food insecurity</p>
              </div>
            </div>
          </div>

          <div>
            <div 
              style={{
                width: '100%',
                height: '350px',
                borderRadius: 'var(--border-radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)'
              }}
            >
              <img 
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80" 
                alt="Environmental care"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="section section-bg">
        <div className="container">
          <div className="section-header">
            <h2>Our Core Values</h2>
            <p>These four pillars guide every interaction, update, and expansion we execute.</p>
          </div>

          <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            <div className="card">
              <div className="card-body">
                <div className="card-icon" style={{ fontSize: '1.5rem' }}>💚</div>
                <h3 className="card-title">Dignity First</h3>
                <p className="card-text">
                  We believe receiving assistance should be a smooth, private, and dignified experience. Everyone deserves access to quality, fresh meals.
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="card-icon" style={{ fontSize: '1.5rem' }}>🌍</div>
                <h3 className="card-title">Sustainability</h3>
                <p className="card-text">
                  By routing surplus food directly to tables, we prevent organic waste from generating greenhouse gases in rotting landfills.
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="card-icon" style={{ fontSize: '1.5rem' }}>🤝</div>
                <h3 className="card-title">Community Solidarity</h3>
                <p className="card-text">
                  Strengthening local connections between businesses, donors, shelters, and individuals to create a resilient community support system.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="section">
        <div className="container text-center">
          <h2 style={{ marginBottom: '1.5rem' }}>Join the Food Saving Revolution</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2.5rem auto' }}>
            Whether you represent a retail grocery store chain, run a neighborhood cafe, manage a charity shelter, or simply want to volunteer, we want you on board.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <Link to="/register" className="btn btn-primary btn-lg">
              🚀 Sign Up Today
            </Link>
            <Link to="/contact" className="btn btn-secondary btn-lg">
              ✉️ Contact Our Partners
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
