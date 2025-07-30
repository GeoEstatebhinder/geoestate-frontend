// UploadPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const UploadPage = () => {
  const [form, setForm] = useState({
    title: '',
    price: '',
    location: '',
    description: '',
    image: '',
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const editingId = params.get('id');

  useEffect(() => {
    if (editingId) {
      axios.get(`/api/properties/${editingId}`).then((res) => {
        setForm(res.data);
      });
    }
  }, [editingId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUploadImage = async () => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'geoestate');
    const res = await axios.post('https://api.cloudinary.com/v1_1/demo/image/upload', data);
    return res.data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      let imageUrl = form.image;
      if (file) imageUrl = await handleUploadImage();
      const payload = { ...form, image: imageUrl };

      if (editingId) {
        await axios.put(`/api/properties/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post('/api/properties', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      navigate('/dashboard');
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-xl mt-8">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {editingId ? 'Edit Property' : 'Upload New Property'}
      </h1>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Property Title"
          className="p-3 border border-gray-300 rounded-lg"
          required
        />
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price in ₹"
          className="p-3 border border-gray-300 rounded-lg"
          required
        />
        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location (City, Area)"
          className="p-3 border border-gray-300 rounded-lg"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Property Description"
          rows="4"
          className="p-3 border border-gray-300 rounded-lg"
          required
        ></textarea>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="p-2"
        />
        {form.image && (
          <img src={form.image} alt="Preview" className="h-48 object-cover rounded" />
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700"
        >
          {loading ? 'Saving...' : editingId ? 'Update Property' : 'Upload Property'}
        </button>
      </form>
    </div>
  );
};

export default UploadPage;