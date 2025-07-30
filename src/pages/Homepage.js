// src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Dream Home</h1>
        <p className="text-lg md:text-xl mb-6">Explore listings across Ludhiana, Chandigarh, Mohali & more</p>
        <Link
          to="/properties"
          className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-full shadow-md hover:bg-slate-100"
        >
          Browse Listings
        </Link>
      </div>

      {/* 🔍 Map Preview Section (added below Hero) */}
      <div className="max-w-6xl mx-auto mt-8 px-4">
        <div className="rounded-2xl overflow-hidden shadow border">
          <iframe
            title="Map Preview"
            src="https://www.google.com/maps/d/embed?mid=1T3lvdbQlls0N1OYgk4YO_GeRLWvEsj4&ehbc=2E312F"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4 md:px-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-all">
          <h3 className="text-xl font-bold mb-2">🔍 Search by City or Type</h3>
          <p className="text-gray-600">Filter by city, price, or property type to find what suits you.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-all">
          <h3 className="text-xl font-bold mb-2">🌟 Premium Listings</h3>
          <p className="text-gray-600">Highlight your property to get more views & faster sales.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-all">
          <h3 className="text-xl font-bold mb-2">📍 Map View</h3>
          <p className="text-gray-600">Explore properties by location on an interactive map.</p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-12 px-6 text-center border-t border-slate-200">
        <h2 className="text-3xl font-semibold mb-4">Have a Property to List?</h2>
        <p className="text-gray-700 mb-6">Upload your listing in minutes. It’s free!</p>
        <Link
          to="/upload"
          className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700"
        >
          Upload Property
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
