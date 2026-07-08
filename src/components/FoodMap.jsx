import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';

// Custom icons using stable Leaflet CDN resources to prevent Vite bundler asset resolution errors
const greenMarkerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const redMarkerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const blueMarkerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Helper component to recenter map view dynamically when center coordinates change
const RecenterMap = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom || map.getZoom());
    }
  }, [center, zoom, map]);
  return null;
};

const FoodMap = ({ listings = [], center = [11.1271, 78.6569], zoom = 7, userLocation = null, height = '450px' }) => {
  
  // Calculate center of map: if userLocation coordinates exist, center there
  const mapCenter = userLocation && userLocation.lat && userLocation.lng
    ? [userLocation.lat, userLocation.lng]
    : center;

  const mapZoom = userLocation ? 11 : zoom;

  return (
    <div style={{ height, width: '100%', borderRadius: 'var(--border-radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
      <MapContainer 
        center={mapCenter} 
        zoom={mapZoom} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User Location Marker (Blue) */}
        {userLocation && userLocation.lat && userLocation.lng && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={blueMarkerIcon}>
            <Popup>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                📍 Your Saved Location
              </div>
            </Popup>
          </Marker>
        )}

        {/* Food Listings Markers (Green for Available, Red for Claimed/Reserved) */}
        {listings.map((item) => {
          const lat = item.coordinates?.lat;
          const lng = item.coordinates?.lng;

          if (!lat || !lng) return null;

          const firstItem = item.foodItems?.[0] || {};
          const foodName = firstItem.name || 'Food Platter';
          const qtyText = `${firstItem.quantity || item.quantity || 0} ${firstItem.unit || 'plates'}`;
          const isAvailable = item.status === 'available';

          return (
            <Marker 
              key={item._id} 
              position={[lat, lng]} 
              icon={isAvailable ? greenMarkerIcon : redMarkerIcon}
            >
              <Popup>
                <div style={{ width: '180px', fontSize: '0.85rem', lineHeight: '1.4' }}>
                  {item.coverImage && (
                    <img 
                      src={item.coverImage} 
                      alt={foodName} 
                      style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '4px', marginBottom: '0.5rem' }}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=180';
                      }}
                    />
                  )}
                  <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem', fontWeight: 700 }}>
                    {foodName} {item.foodItems?.length > 1 ? `(+${item.foodItems.length - 1} items)` : ''}
                  </h4>
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary-dark)' }}>
                    🏨 {item.providerName}
                  </p>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    📦 Qty: {qtyText} <br />
                    📍 {item.area}, {item.city} <br />
                    ⏳ Until: {item.availableUntil || 'N/A'}
                  </p>
                  
                  <Link 
                    to={`/donation/${item._id}`} 
                    className="btn btn-outline btn-sm btn-full"
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', textAlign: 'center', display: 'block' }}
                  >
                    View Details & Claim
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Dynamic recentering controller */}
        <RecenterMap center={mapCenter} zoom={mapZoom} />
      </MapContainer>
    </div>
  );
};

export default FoodMap;
