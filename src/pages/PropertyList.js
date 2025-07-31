import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const pageSize = 6;

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/properties`, {
        params: {
          search,
          city,
          minPrice,
          maxPrice,
          sort,
          page: currentPage,
          limit: pageSize,
        },
      });

      const result = res.data;

      const propertyArray = Array.isArray(result?.properties)
        ? result.properties
        : Array.isArray(result)
        ? result
        : [];

      setProperties(propertyArray);
      setTotalPages(result.totalPages || 1);
    } catch (err) {
      console.error('❌ Error fetching properties:', err);
      setProperties([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [search, city, minPrice, maxPrice, sort, currentPage]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const clearFilters = () => {
    setSearch('');
    setCity('');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    setCurrentPage(1);
  };

  const cityOptions = ['Chandigarh', 'Mohali', 'Ludhiana', 'Jalandhar'];

  return (
    <div className="bg-gray-50 min-h-screen px-4 sm:px-8 py-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        🏘️ Explore Properties for Sale
      </h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <input
          type="text"
          placeholder="Search by title or description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded-md"
        />
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="">All Cities</option>
          {cityOptions.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="p-2 border rounded-md"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="p-2 border rounded-md"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="lowToHigh">Price: Low to High</option>
          <option value="highToLow">Price: High to Low</option>
        </select>
      </div>

      <div className="text-right mb-4">
        <button
          onClick={clearFilters}
          className="bg-gray-300 hover:bg-gray-400 text-sm px-3 py-1 rounded-md"
        >
          Clear Filters
        </button>
      </div>

      {/* Listings */}
      {loading ? (
        <p className="text-center text-gray-500">Loading properties...</p>
      ) : properties.length === 0 ? (
        <p className="text-center text-gray-500">No properties found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div
              key={property._id}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <Link to={`/property/${property._id}`}>
                <img
                  src={property.images?.[0] || 'https://via.placeholder.com/400'}
                  alt={property.title}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4">
                  <div className="flex justify-between items-center mb-1">
                    <h2 className="text-lg font-semibold">{property.title}</h2>
                    {property.isPremium && (
                      <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                        ⭐ Premium
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{property.location}</p>
                  <p className="text-indigo-600 font-bold text-lg mt-2">
                    ₹{property.price.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {property.bedrooms} Bed • {property.bathrooms} Bath • {property.area} sqft
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-8 flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, idx) => (
          <button
            key={idx + 1}
            onClick={() => setCurrentPage(idx + 1)}
            className={`px-3 py-1 rounded-md text-sm ${
              currentPage === idx + 1
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PropertyList;
