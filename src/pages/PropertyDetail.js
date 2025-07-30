// src/pages/PropertyDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch(`/api/properties/${id}`)
      .then(res => res.json())
      .then(data => setProperty(data));
  }, [id]);

  const customIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  if (!property) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10">
      {/* Image */}
      <div className="mb-6">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-[450px] object-cover rounded-xl shadow-md"
        />
      </div>

      {/* Title and Price */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold">{property.title}</h1>
          <p className="text-gray-600">{property.address}, {property.city}</p>
        </div>
        <p className="text-blue-700 text-3xl font-semibold mt-2 md:mt-0">
          ₹{property.price.toLocaleString()}
        </p>
      </div>

      {/* Description */}
      <p className="text-gray-700 leading-7 mb-6">{property.description}</p>

      {/* Map */}
      {property.latitude && property.longitude && (
        <div className="h-[300px] w-full mb-6 rounded-xl overflow-hidden shadow">
          <MapContainer
            center={[property.latitude, property.longitude]}
            zoom={14}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={[property.latitude, property.longitude]}
              icon={customIcon}
            >
              <Popup>{property.title}</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}

      {/* Contact Seller Button */}
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Contact Seller
      </button>

      {/* Contact Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">Contact Seller</h2>
            <p className="text-gray-700 mb-2">Email: <span className="font-medium">{property.sellerEmail}</span></p>
            <p className="text-gray-700 mb-4">Phone: <span className="font-medium">{property.sellerPhone || 'N/A'}</span></p>
            <a
              href={`mailto:${property.sellerEmail}`}
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Send Email
            </a>
            <button
              onClick={() => setShowModal(false)}
              className="ml-4 inline-block text-gray-600 hover:text-red-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetail;
