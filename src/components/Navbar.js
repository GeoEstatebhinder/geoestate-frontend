import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [city, setCity] = useState('');
  const [type, setType] = useState('');
  const [price, setPrice] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem('token'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.append('city', city);
    if (type) params.append('type', type);
    if (price) params.append('price_lte', price);
    navigate(`/?${params.toString()}`);
  };

  return (
    <nav className="bg-white border-b shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Logo & Links */}
        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-start">
          <Link to="/" className="text-xl font-bold text-blue-700">
            GeoEstate
          </Link>
          <div className="flex gap-4 text-sm sm:text-base">
            <Link to="/" className="text-gray-700 hover:text-blue-600">
              Home
            </Link>
            <Link to="/map" className="text-gray-700 hover:text-blue-600">
              Map View
            </Link>
            {loggedIn && (
              <>
                <Link to="/upload" className="text-gray-700 hover:text-blue-600">
                  Upload
                </Link>
                <Link to="/admin" className="text-gray-700 hover:text-blue-600">
                  Dashboard
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Search Form */}
        <form
          onSubmit={handleSearch}
          className="flex flex-wrap gap-2 items-center justify-center"
        >
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border p-2 rounded-md text-sm w-[100px] sm:w-[140px]"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border p-2 rounded-md text-sm w-[100px] sm:w-[120px]"
          >
            <option value="">Type</option>
            <option value="House">House</option>
            <option value="Flat">Flat</option>
            <option value="Plot">Plot</option>
          </select>
          <input
            type="number"
            placeholder="Max Budget (₹)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border p-2 rounded-md text-sm w-[120px]"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm"
          >
            Search
          </button>
        </form>

        {/* Auth Button */}
        <div className="mt-3 md:mt-0">
          {loggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-1.5 rounded hover:bg-red-600 text-sm"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 text-sm"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
