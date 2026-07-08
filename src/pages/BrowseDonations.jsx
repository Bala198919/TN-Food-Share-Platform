import React, { useState, useEffect } from 'react';
import { useDonations } from '../context/DonationContext';
import { useAuth } from '../context/AuthContext';
import DonationCard from '../components/DonationCard';
import FoodMap from '../components/FoodMap';

const BrowseDonations = () => {
  const { donations, pagination, refreshDonations, loading } = useDonations();
  const { user } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('available');
  const [foodTypeFilter, setFoodTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Tab View for Mobile Screens (map vs list)
  const [mobileViewTab, setMobileViewTab] = useState('list'); // 'list' or 'map'

  // Dynamic Map Coordinates focus based on city filter
  const [mapCenter, setMapCenter] = useState([11.1271, 78.6569]);
  const [mapZoom, setMapZoom] = useState(7);

  const cityCoordinates = {
    'chennai': [13.0827, 80.2707],
    'coimbatore': [11.0168, 76.9558],
    'madurai': [9.9252, 78.1198],
    'trichy': [10.7905, 78.7047],
    'salem': [11.6643, 78.1460],
    'erode': [11.3410, 77.7172],
    'tirunelveli': [8.7139, 77.7567],
    'thanjavur': [10.7870, 79.1378],
    'vellore': [12.9165, 79.1325],
    'tuticorin': [8.7642, 78.1348]
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      refreshDonations({
        search: searchTerm,
        city: cityFilter,
        category: categoryFilter,
        status: statusFilter,
        foodType: foodTypeFilter,
        page: currentPage,
        limit: 12
      });
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, cityFilter, categoryFilter, statusFilter, foodTypeFilter, currentPage]);

  // Handle City coordinates shifts
  useEffect(() => {
    if (cityFilter && cityFilter !== 'all') {
      const cityKey = cityFilter.toLowerCase().trim();
      if (cityCoordinates[cityKey]) {
        setMapCenter(cityCoordinates[cityKey]);
        setMapZoom(11);
      }
    } else {
      setMapCenter([11.1271, 78.6569]);
      setMapZoom(7);
    }
  }, [cityFilter]);

  const handleFilterChange = (setter, value) => {
    setter(value);
    setCurrentPage(1);
  };

  const resetAllFilters = () => {
    setSearchTerm('');
    setCityFilter('all');
    setCategoryFilter('all');
    setStatusFilter('available');
    setFoodTypeFilter('all');
    setCurrentPage(1);
  };

  const cities = ['Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem', 'Erode', 'Tirunelveli', 'Thanjavur', 'Vellore', 'Tuticorin'];

  // User location details for map marker alignment
  const userLocationCoords = user && user.coordinates && user.coordinates.lat && user.coordinates.lng
    ? { lat: user.coordinates.lat, lng: user.coordinates.lng }
    : null;

  return (
    <div className="container animate-fade-in" style={{ padding: '2.5rem 0' }}>
      
      {/* Title */}
      <div className="section-header" style={{ marginBottom: '2rem' }}>
        <h2>Available Surplus Food (Map Discovery)</h2>
        <p>Explore live available food donations from hotels, caterers and canteens visually across Tamil Nadu.</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="filters-bar" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', alignItems: 'center', marginBottom: '2rem' }}>
        <div className="search-input-wrapper" style={{ gridColumn: 'span 2' }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleFilterChange(setSearchTerm, e.target.value)}
            className="form-control"
            placeholder="🔍 Search Dosa, Idly, Biryani, Hotels, Cities..."
            style={{ margin: 0 }}
          />
        </div>

        <div>
          <select
            value={cityFilter}
            onChange={(e) => handleFilterChange(setCityFilter, e.target.value)}
            className="form-control"
            style={{ margin: 0 }}
          >
            <option value="all">📍 All Cities</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <select
            value={categoryFilter}
            onChange={(e) => handleFilterChange(setCategoryFilter, e.target.value)}
            className="form-control"
            style={{ margin: 0 }}
          >
            <option value="all">🥦 All Meals</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snacks">Snacks</option>
          </select>
        </div>

        <div>
          <select
            value={foodTypeFilter}
            onChange={(e) => handleFilterChange(setFoodTypeFilter, e.target.value)}
            className="form-control"
            style={{ margin: 0 }}
          >
            <option value="all">🍛 All Types</option>
            <option value="veg">Veg</option>
            <option value="non-veg">Non-Veg</option>
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => handleFilterChange(setStatusFilter, e.target.value)}
            className="form-control"
            style={{ margin: 0 }}
          >
            <option value="available">🟢 Available</option>
            <option value="reserved">🟡 Reserved</option>
            <option value="completed">🔵 Completed</option>
            <option value="all">⚪ All Listings</option>
          </select>
        </div>
      </div>

      {/* Mobile Toggle Switches */}
      <div 
        className="mobile-view-toggle-container"
        style={{
          display: 'none',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          backgroundColor: 'var(--neutral-100)',
          padding: '0.35rem',
          borderRadius: 'var(--border-radius-sm)'
        }}
      >
        <button
          type="button"
          onClick={() => setMobileViewTab('list')}
          style={{
            padding: '0.5rem',
            borderRadius: 'var(--border-radius-sm)',
            fontWeight: '600',
            fontSize: '0.85rem',
            backgroundColor: mobileViewTab === 'list' ? 'white' : 'transparent',
            color: mobileViewTab === 'list' ? 'var(--primary-dark)' : 'var(--neutral-600)',
            boxShadow: mobileViewTab === 'list' ? 'var(--shadow-sm)' : 'none'
          }}
        >
          📋 List View
        </button>
        <button
          type="button"
          onClick={() => setMobileViewTab('map')}
          style={{
            padding: '0.5rem',
            borderRadius: 'var(--border-radius-sm)',
            fontWeight: '600',
            fontSize: '0.85rem',
            backgroundColor: mobileViewTab === 'map' ? 'white' : 'transparent',
            color: mobileViewTab === 'map' ? 'var(--primary-dark)' : 'var(--neutral-600)',
            boxShadow: mobileViewTab === 'map' ? 'var(--shadow-sm)' : 'none'
          }}
        >
          🗺️ Interactive Map
        </button>
      </div>

      {/* Split Cards Grid and Map Section */}
      <div className="browse-split-layout" style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left Side: Cards */}
        <div className={`browse-cards-side ${mobileViewTab !== 'list' ? 'mobile-hidden' : ''}`}>
          {loading ? (
            <div className="text-center" style={{ padding: '5rem 0' }}>
              <div className="loading-spinner"></div>
              <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Searching database for food items...</p>
            </div>
          ) : donations.length > 0 ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                {donations.map((donation) => (
                  <DonationCard key={donation._id} donation={donation} />
                ))}
              </div>

              {/* Pagination Controls */}
              {pagination && pagination.totalPages > 1 && (
                <div 
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '2.5rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--border-color)',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}
                >
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Showing {Math.min(((pagination.page - 1) * 12) + 1, pagination.total)}–
                    {Math.min(pagination.page * 12, pagination.total)} of {pagination.total} listings
                  </span>

                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button
                      type="button"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={pagination.page === 1}
                      className="btn btn-outline btn-sm"
                      style={{ padding: '0.4rem 0.75rem', opacity: pagination.page === 1 ? 0.5 : 1 }}
                    >
                      ◀ Prev
                    </button>
                    {Array.from({ length: pagination.totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setCurrentPage(pageNum)}
                        className={`btn btn-sm ${pagination.page === pageNum ? 'btn-primary' : 'btn-outline'}`}
                        style={{ padding: '0.4rem 0.75rem' }}
                      >
                        {pageNum}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                      disabled={pagination.page === pagination.totalPages}
                      className="btn btn-outline btn-sm"
                      style={{ padding: '0.4rem 0.75rem', opacity: pagination.page === pagination.totalPages ? 0.5 : 1 }}
                    >
                      Next ▶
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div 
              className="text-center" 
              style={{
                padding: '4rem 0',
                backgroundColor: 'white',
                borderRadius: 'var(--border-radius-md)',
                border: '1px dashed var(--border-color)',
                color: 'var(--text-muted)'
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍛🔍</div>
              <h3>No Food Listings Found</h3>
              <p style={{ marginTop: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>No listings matched your active search term or filters.</p>
              <button onClick={resetAllFilters} className="btn btn-primary btn-sm">
                🔄 Reset All Filters
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Sticky Map Canvas */}
        <div 
          className={`browse-map-side ${mobileViewTab !== 'map' ? 'mobile-hidden' : ''}`}
          style={{ position: 'sticky', top: '90px', height: 'calc(100vh - 140px)', minHeight: '350px' }}
        >
          <FoodMap 
            listings={donations} 
            center={mapCenter} 
            zoom={mapZoom} 
            userLocation={userLocationCoords}
            height="100%" 
          />
        </div>

      </div>
    </div>
  );
};

export default BrowseDonations;
