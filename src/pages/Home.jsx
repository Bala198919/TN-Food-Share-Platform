import React from 'react';
import { Link } from 'react-router-dom';
import { useDonations } from '../context/DonationContext';
import { useAuth } from '../context/AuthContext';
import DonationCard from '../components/DonationCard';

const Home = () => {
  const { donations } = useDonations();
  const { user } = useAuth();
  
  // Get active listings
  const featuredDonations = donations
    .filter(d => d.status === 'available')
    .slice(0, 3);

  return (
    <div className="home-page" style={{ backgroundColor: 'var(--neutral-50)', minHeight: '100vh' }}>
      
      {/* 1. Hero Section - Warm Asymmetric Layout */}
      <section style={{ padding: '5rem 0', borderBottom: '1px solid var(--neutral-200)', background: 'linear-gradient(180deg, #f5f2e9 0%, var(--neutral-50) 100%)' }}>
        <div className="container hero-grid">
          
          <div style={{ textAlign: 'left' }}>
            <span style={{ 
              display: 'inline-block', 
              backgroundColor: 'var(--primary-light)', 
              color: 'var(--primary-dark)', 
              padding: '0.4rem 0.8rem', 
              borderRadius: 'var(--border-radius-sm)', 
              fontWeight: '700', 
              fontSize: '0.8rem', 
              marginBottom: '1rem',
              letterSpacing: '0.05em',
              border: '1px solid rgba(217, 119, 6, 0.2)'
            }}>
              🌾 TAMIL NADU SURPLUS RESCUE INITIATIVE
            </span>
            
            <h1 style={{ fontSize: '3rem', fontWeight: '800', lineHeight: '1.15', color: 'var(--neutral-900)', fontFamily: 'var(--font-heading)' }}>
              Redirect Food Surplus <br />
              <span style={{ color: 'var(--primary)' }}>To Local Shelters</span>
            </h1>
            
            <p style={{ fontSize: '1.1rem', color: 'var(--neutral-600)', margin: '1.25rem 0 2rem 0', lineHeight: '1.65', maxWidth: '580px' }}>
              We facilitate transparent food redistribution. Commercial kitchens, wedding halls, and restaurants across Tamil Nadu list fresh excess meals directly for registered NGOs and community kitchens.
            </p>
            
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link 
                to="/browse-donations" 
                className="btn" 
                style={{ 
                  backgroundColor: 'var(--primary)', 
                  color: 'white', 
                  padding: '0.75rem 1.5rem', 
                  fontWeight: '700', 
                  borderRadius: 'var(--border-radius-sm)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                🔍 Browse Available Listings
              </Link>
              
              {!user ? (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link 
                    to="/register" 
                    className="btn btn-outline" 
                    style={{ 
                      borderColor: 'var(--secondary)', 
                      color: 'var(--secondary-dark)', 
                      padding: '0.75rem 1.25rem',
                      fontWeight: '700'
                    }}
                  >
                    🏨 Register Provider
                  </Link>
                  <Link 
                    to="/register" 
                    className="btn btn-outline" 
                    style={{ 
                      borderColor: 'var(--info)', 
                      color: 'var(--info)', 
                      padding: '0.75rem 1.25rem',
                      fontWeight: '700'
                    }}
                  >
                    🙋 Register NGO
                  </Link>
                </div>
              ) : (
                <Link 
                  to={user.role === 'donor' ? '/donor-dashboard' : '/receiver-dashboard'} 
                  className="btn btn-outline"
                  style={{ padding: '0.75rem 1.5rem', fontWeight: '700' }}
                >
                  Go to {user.role === 'donor' ? 'Provider Hub' : 'Acceptor Hub'} →
                </Link>
              )}
            </div>

            {/* Local Trust Bar */}
            <div style={{ marginTop: '3rem', borderTop: '1px dashed var(--neutral-300)', paddingTop: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--neutral-500)', textTransform: 'uppercase' }}>Active Districts:</span>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {['Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem'].map(d => (
                  <span key={d} style={{ fontSize: '0.85rem', backgroundColor: 'var(--neutral-100)', padding: '0.25rem 0.6rem', borderRadius: '4px', color: 'var(--neutral-700)', fontWeight: 600 }}>
                    📍 {d}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Handcrafted visual */}
          <div style={{ position: 'relative' }}>
            <img 
              src="https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80" 
              alt="Traditional South Indian Meal Serving"
              style={{
                width: '100%',
                height: '400px',
                objectFit: 'cover',
                borderRadius: 'var(--border-radius-md)',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--neutral-200)'
              }}
            />
            {/* Impact stats pill */}
            <div style={{
              position: 'absolute',
              bottom: '1.5rem',
              left: '1.5rem',
              backgroundColor: 'white',
              border: '1px solid var(--neutral-200)',
              borderRadius: 'var(--border-radius-sm)',
              padding: '1rem',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <span style={{ fontSize: '1.75rem' }}>🍲</span>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>52,480+</h4>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Surplus Meals Redistributed</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. How it works Section - Asymmetric Steps */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--neutral-100)', borderBottom: '1px solid var(--neutral-200)' }}>
        <div className="container">
          <div className="steps-grid" style={{ marginBottom: '3.5rem' }}>
            <div>
              <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)' }}>How It Works</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.5rem', lineHeight: '1.6' }}>
                Simple, transparent coordination between commercial donors and local shelters.
              </p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
              <div style={{ backgroundColor: 'white', padding: '1.75rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--neutral-200)' }}>
                <span style={{ display: 'inline-block', backgroundColor: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '0.25rem 0.5rem', fontSize: '0.8rem', fontWeight: 700, borderRadius: '4px', marginBottom: '1rem' }}>STEP 01</span>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>🏨 Hotels Post Surplus</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  Providers enter item detail (e.g. Idly/Pongal, plate count) and time limits.
                </p>
              </div>

              <div style={{ backgroundColor: 'white', padding: '1.75rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--neutral-200)' }}>
                <span style={{ display: 'inline-block', backgroundColor: 'var(--secondary-light)', color: 'var(--secondary-dark)', padding: '0.25rem 0.5rem', fontSize: '0.8rem', fontWeight: 700, borderRadius: '4px', marginBottom: '1rem' }}>STEP 02</span>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>🙋 NGOs Claim Posts</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  NGOs browse the map feed or filter by city, then tap to claim matching listings.
                </p>
              </div>

              <div style={{ backgroundColor: 'white', padding: '1.75rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--neutral-200)' }}>
                <span style={{ display: 'inline-block', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '0.25rem 0.5rem', fontSize: '0.8rem', fontWeight: 700, borderRadius: '4px', marginBottom: '1rem' }}>STEP 03</span>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>🚚 Fast Safe Pickup</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  Once claims are approved, volunteers collect and serve the food safely.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Live Surplus Listings Grid */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--neutral-50)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.85rem', fontFamily: 'var(--font-heading)', color: 'var(--neutral-900)' }}>Live Surplus Listings</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                Rescued items requiring immediate pickup in Chennai, Madurai, and Coimbatore.
              </p>
            </div>
            <Link to="/browse-donations" style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.9rem' }}>
              Explore Map Feed →
            </Link>
          </div>

          {featuredDonations.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {featuredDonations.map((donation) => (
                <DonationCard key={donation._id} donation={donation} />
              ))}
            </div>
          ) : (
            <div 
              style={{
                padding: '4rem 0',
                backgroundColor: 'white',
                border: '1px dashed var(--neutral-200)',
                borderRadius: 'var(--border-radius-md)',
                textAlign: 'center',
                color: 'var(--text-muted)'
              }}
            >
              <span style={{ fontSize: '2.5rem' }}>🍽️</span>
              <h3 style={{ fontSize: '1.1rem', marginTop: '0.5rem' }}>No Listings Available Right Now</h3>
              <p style={{ fontSize: '0.85rem' }}>Check back soon or post a new food availability listing!</p>
            </div>
          )}
        </div>
      </section>

      {/* 4. Call to Action - Earthy Terracotta Panel */}
      <section style={{ padding: '4.5rem 0', backgroundColor: '#7c2d12', color: '#ffedd5' }}>
        <div className="container text-center" style={{ maxWidth: '750px' }}>
          <h2 style={{ color: 'white', fontSize: '2.25rem', fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>
            Help Us Close the Hunger Gap
          </h2>
          <p style={{ color: '#ffedd5', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '2rem' }}>
            Are you a caterer with weekend event surplus, or a shelter manager feeding children daily? Partner with us to ensure no good meal goes to waste.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link 
              to="/register" 
              className="btn" 
              style={{ 
                backgroundColor: '#ea580c', 
                color: 'white', 
                padding: '0.75rem 1.5rem', 
                fontWeight: '700', 
                borderRadius: 'var(--border-radius-sm)' 
              }}
            >
              ✨ Partner With Us
            </Link>
            <Link 
              to="/browse-donations" 
              className="btn btn-outline" 
              style={{ 
                color: 'white', 
                borderColor: 'white', 
                padding: '0.75rem 1.5rem', 
                fontWeight: '700' 
              }}
            >
              🔍 Locate Available Food
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
