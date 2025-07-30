// components/EnquiryModal.js
import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import emailjs from '@emailjs/browser';

const EnquiryModal = ({ isOpen, onClose, property }) => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);

    const templateParams = {
      from_name: form.name,
      from_email: form.email,
      message: form.message,
      property_title: property.title,
    };

    emailjs
      .send(
        service_6kn0q96,
        __ejs-test-mail-service__,
        templateParams,
        VvGXyqjolklK-01WT
      )
      .then(() => {
        alert('Enquiry sent!');
        setForm({ name: '', email: '', message: '' });
        setSending(false);
        onClose();
      })
      .catch((error) => {
        console.error('EmailJS error:', error);
        alert('Failed to send enquiry.');
        setSending(false);
      });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50">
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <div className="bg-white rounded-lg p-6 w-full max-w-md relative z-50">
          <Dialog.Title className="text-lg font-bold mb-2">Contact Seller</Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="w-full border p-2 rounded"
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              className="w-full border p-2 rounded"
            />
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Your Message"
              rows={4}
              required
              className="w-full border p-2 rounded"
            />
            <button
              type="submit"
              disabled={sending}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              {sending ? 'Sending...' : 'Send Enquiry'}
            </button>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default EnquiryModal;
