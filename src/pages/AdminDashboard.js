import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { saveAs } from 'file-saver';

const AdminDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, premium: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/properties', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProperties(res.data);
      const premiumCount = res.data.filter(p => p.isPremium).length;
      setStats({ total: res.data.length, premium: premiumCount });
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch:', err);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/properties/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProperties();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleEdit = (id) => {
    navigate(`/upload?id=${id}`);
  };

  const handleMakePremium = async (propertyId) => {
    try {
      const res = await axios.post('/api/payment/create-order');
      const order = res.data;

      const options = {
        key: 'rzp_test_49UolZGmtmQU2O',
        amount: order.amount,
        currency: order.currency,
        name: 'GeoEstate Premium',
        description: 'Upgrade your listing to premium',
        order_id: order.id,
        handler: async function (response) {
          const verify = await axios.post('/api/payment/verify', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            propertyId,
          });
          if (verify.data.success) {
            alert('Payment successful. Listing is now Premium.');
            fetchProperties();
          }
        },
        theme: { color: '#1e3a8a' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Payment Error:', err);
    }
  };

  const exportCSV = () => {
    const rows = properties.map(p => ({
      Title: p.title,
      Price: p.price,
      Location: p.location,
      Premium: p.isPremium ? 'Yes' : 'No',
    }));

    const csv = [
      Object.keys(rows[0]).join(','),
      ...rows.map(row => Object.values(row).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    saveAs(blob, 'properties.csv');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-slate-800">Admin Dashboard</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow text-center">
          <h2 className="text-2xl font-bold text-blue-900">{stats.total}</h2>
          <p className="text-sm text-gray-500">Total Listings</p>
        </div>
        <div className="bg-yellow-50 rounded-2xl p-6 shadow text-center">
          <h2 className="text-2xl font-bold text-yellow-700">{stats.premium}</h2>
          <p className="text-sm text-yellow-700">Premium Listings</p>
        </div>
        <div className="bg-blue-50 rounded-2xl p-6 shadow text-center">
          <h2 className="text-2xl font-bold text-blue-600">₹499</h2>
          <p className="text-sm text-blue-600">Premium Price</p>
        </div>
        <div className="bg-green-50 rounded-2xl p-6 shadow text-center">
          <button
            onClick={exportCSV}
            className="text-green-700 font-medium hover:underline"
          >
            ⬇ Export CSV
          </button>
        </div>
      </div>

      {/* Property Cards */}
      {loading ? (
        <p className="text-center text-gray-500">Loading listings...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {properties.map((p) => (
            <div key={p._id} className="bg-white rounded-2xl shadow-md p-4 relative">
              {p.isPremium && (
                <span className="absolute top-3 right-3 bg-yellow-400 text-white text-xs px-2 py-1 rounded-full">
                  ⭐ Premium
                </span>
              )}
              <img
                src={p.image || '/noimage.jpg'}
                alt={p.title}
                className="h-48 w-full object-cover rounded-lg mb-4"
              />
              <h2 className="text-lg font-semibold text-slate-800 mb-1">{p.title}</h2>
              <p className="text-sm text-gray-500 mb-1">{p.location}</p>
              <p className="text-blue-600 font-semibold mb-3">₹{p.price.toLocaleString()}</p>
              <div className="flex flex-wrap gap-2">
                {!p.isPremium && (
                  <button
                    onClick={() => handleMakePremium(p._id)}
                    className="bg-indigo-600 text-white px-3 py-1 text-sm rounded hover:bg-indigo-700"
                  >
                    Make Premium
                  </button>
                )}
                <button
                  onClick={() => handleEdit(p._id)}
                  className="bg-yellow-400 text-white px-3 py-1 text-sm rounded hover:bg-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
