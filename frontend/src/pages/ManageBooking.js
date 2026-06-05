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
        title="Manage Bookings | BSS Residency"
        description="View and manage your bookings at BSS Residency."
      />
      <main className="manage-booking-page">
        <section className="page-hero">
          <p className="section-label gold">Admin View</p>
          <h1>Manage Your <em>Bookings</em></h1>
          <p>Here you can view, track, or manage existing bookings in the system.</p>
        </section>

        <div className="manage-booking-section container">
          {loading && (
            <div className="manage-loading">
              <div className="spinner" />
              <p>Loading bookings list...</p>
            </div>
          )}

          {error && (
            <div className="manage-error">
              <p>⚠️ {error}</p>
            </div>
          )}

          {!loading && !error && bookings.length === 0 && (
            <div className="manage-empty">
              <p>No bookings found in the system.</p>
            </div>
          )}

          {!loading && !error && bookings.length > 0 && (
            <div className="booking-table-wrap">
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
                      <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{b.bookingId || b._id}</td>
                      <td style={{ fontWeight: 600 }}>{b.name}</td>
                      <td>{b.roomType}{b.roomNumber ? ` #${b.roomNumber}` : ''}</td>
                      <td>{new Date(b.checkIn).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      <td>{new Date(b.checkOut).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      <td>
                        <span className={`status-badge ${(b.status || 'Pending').toLowerCase().replace(' ', '-')}`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <Link to="/" className="btn-back">← Back to Home</Link>
        </div>
      </main>
    </>
  );
}
