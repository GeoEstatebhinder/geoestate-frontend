// src/pages/MapView.js
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

// Fix default icon issue with Leaflet in React
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

const MapView = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/properties');
        setProperties(res.data);
      } catch (err) {
        console.error('Map fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-slate-100">
      <h1 className="text-3xl font-bold mb-4">Map View</h1>
      {loading ? (
        <p className="text-center text-gray-600">Loading map...</p>
      ) : (
        <MapContainer
          center={[30.7333, 76.7794]} // Center around Chandigarh
          zoom={7}
          scrollWheelZoom={true}
          className="h-[80vh] w-full rounded-xl shadow"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {properties.map((p) => (
            <Marker key={p._id} position={[p.latitude || 30.7333, p.longitude || 76.7794]}>
              <Popup>
                <div className="text-sm">
                  <strong>{p.title}</strong>
                  <br />
                  ₹{p.price.toLocaleString()}
                  <br />
                  {p.city || p.location}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
};

export default MapView;