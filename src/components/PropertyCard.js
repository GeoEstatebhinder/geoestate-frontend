import React from 'react';
import { Link } from 'react-router-dom';

const PropertyCard = ({ property }) => {
  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-lg overflow-hidden transition-all">
      <Link to={`/property/${property._id}`}>
        <div className="h-48 w-full overflow-hidden">
          <img
            src={property.image || 'https://via.placeholder.com/400'}
            alt={property.title}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800 truncate">{property.title}</h2>
            {property.isPremium && (
              <span className="bg-yellow-400 text-sm text-white font-semibold px-2 py-1 rounded-full">Premium</span>
            )}
          </div>
          <p className="text-blue-600 font-bold text-lg mt-1">₹ {property.price.toLocaleString()}</p>
          <p className="text-gray-600 text-sm mt-1">{property.location}</p>
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;
