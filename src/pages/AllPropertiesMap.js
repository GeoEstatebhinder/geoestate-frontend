// pages/AllPropertiesMap.js
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const AllPropertiesMap = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/properties`);
      const data = await res.json();
      setProperties(data);
    };
    fetchAll();
  }, []);

  return (
    <div className="h-screen">
      <MapContainer center={[30.9, 75.8]} zoom={7} className="w-full h-full z-0">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {properties
          .filter((p) => p.latitude && p.longitude)
          .map((property) => (
            <Marker
              key={property._id}
              position={[property.latitude, property.longitude]}
            >
              <Popup>
                <Link
                  to={`/property/${property._id}`}
                  className="text-blue-600 hover:underline"
                >
                  {property.title}
                </Link>
                <br />
                ₹{property.price} <br />
                {property.city}
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
};

export default AllPropertiesMap;
