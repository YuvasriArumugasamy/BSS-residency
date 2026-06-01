import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import SEO from '../components/SEO';
import './ManageBooking.css';

export default function ManageBooking() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/api/bookings'); // Adjust endpoint if needed
        setBookings(res.data.bookings || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <>
      <SEO
        title="Manage Booking | BSS Residency"
        description="View and manage your bookings at BSS Residency."
      />
      <main className="manage-booking-page">
        <section className="hero">
          <h1>Manage Your Bookings</h1>
          <p>Here you can view, edit or cancel your existing bookings.</p>
        </section>
        {loading && <p className="loading">Loading bookings...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && bookings.length === 0 && (
          <p className="empty">No bookings found.</p>
        )}
        {!loading && !error && bookings.length > 0 && (
          <table className="booking-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Room</th>
                <th>Check‑In</th>
                <th>Check‑Out</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td>{b.bookingId || b._id}</td>
                  <td>{b.name}</td>
                  <td>{b.roomType}{b.roomNumber ? ` #${b.roomNumber}` : ''}</td>
                  <td>{new Date(b.checkIn).toLocaleDateString('en‑IN')}</td>
                  <td>{new Date(b.checkOut).toLocaleDateString('en‑IN')}</td>
                  <td>{b.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Link to="/" className="back-home">← Back to Home</Link>
      </main>
    </>
  );
}
