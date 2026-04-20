import React, { useState } from 'react';
import axios from 'axios';
import './Booking.css';

const roomTypes = ['AC Room', 'Non-AC Room', 'Family Room', 'Dormitory', 'Suite Room'];

const initForm = { name: '', phone: '', email: '', roomType: '', checkIn: '', checkOut: '', guests: 1, message: '' };

export default function Booking() {
  const [form, setForm] = useState(initForm);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { success, message }

  const today = new Date().toISOString().split('T')[0];

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (result) setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.roomType || !form.checkIn || !form.checkOut) {
      setResult({ success: false, message: 'Please fill all required fields.' });
      return;
    }
    if (new Date(form.checkIn) >= new Date(form.checkOut)) {
      setResult({ success: false, message: 'Check-out date must be after check-in date.' });
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('/api/bookings', form);
      setResult({ success: true, message: res.data.message });
      setForm(initForm);
      // Also open WhatsApp
      const msg = `Hello BSS Residency! 🙏\n\nBooking Request:\n👤 Name: ${form.name}\n📱 Phone: ${form.phone}\n🛏️ Room: ${form.roomType}\n📅 Check-in: ${form.checkIn}\n📅 Check-out: ${form.checkOut}\n👥 Guests: ${form.guests}\n💬 Message: ${form.message || 'None'}\n\nPlease confirm my booking. Thank you!`;
      window.open(`https://wa.me/91XXXXXXXXXX?text=${encodeURIComponent(msg)}`, '_blank');
    } catch (err) {
      setResult({ success: false, message: err.response?.data?.message || 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="booking-page">
      <section className="page-hero">
        <p className="section-label" style={{ color: '#93C5FD' }}>Reservations</p>
        <h1>Book Your <em>Stay</em></h1>
        <p>Fill the form below. We'll confirm your booking on WhatsApp instantly.</p>
      </section>

      <section className="booking-section container">
        <div className="booking-grid">
          {/* Form */}
          <div className="booking-form-wrap">
            <h2>Booking Details</h2>
            <p className="form-subtext">All fields marked with <span style={{color:'var(--danger)'}}>*</span> are required.</p>

            {result && (
              <div className={`result-msg ${result.success ? 'success' : 'error'}`}>
                {result.success ? '✅' : '❌'} {result.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="booking-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name <span className="req">*</span></label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Your full name" required />
                </div>
                <div className="form-group">
                  <label>Phone Number <span className="req">*</span></label>
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" required />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="your@email.com (optional)" />
              </div>

              <div className="form-group">
                <label>Room Type <span className="req">*</span></label>
                <select name="roomType" value={form.roomType} onChange={handleChange} required>
                  <option value="">— Select Room Type —</option>
                  {roomTypes.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Check-in Date <span className="req">*</span></label>
                  <input name="checkIn" value={form.checkIn} onChange={handleChange} type="date" min={today} required />
                </div>
                <div className="form-group">
                  <label>Check-out Date <span className="req">*</span></label>
                  <input name="checkOut" value={form.checkOut} onChange={handleChange} type="date" min={form.checkIn || today} required />
                </div>
              </div>

              <div className="form-group">
                <label>Number of Guests <span className="req">*</span></label>
                <input name="guests" value={form.guests} onChange={handleChange} type="number" min="1" max="20" required />
              </div>

              <div className="form-group">
                <label>Special Requests / Message</label>
                <textarea name="message" value={form.message} onChange={handleChange} rows="3" placeholder="Any special requirements or questions..." />
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? <><span className="btn-spinner" />Submitting...</> : '💬 Confirm Booking via WhatsApp'}
              </button>
            </form>
          </div>

          {/* Info sidebar */}
          <div className="booking-sidebar">
            <div className="info-card">
              <h3>📋 Booking Info</h3>
              <ul>
                <li><strong>Check-in:</strong> 12:00 PM</li>
                <li><strong>Check-out:</strong> 11:00 AM</li>
                <li><strong>Early/Late:</strong> On request</li>
                <li><strong>Confirmation:</strong> Via WhatsApp</li>
              </ul>
            </div>

            <div className="info-card">
              <h3>🏨 Room Types</h3>
              <ul>
                {roomTypes.map(r => <li key={r}>✓ {r}</li>)}
              </ul>
            </div>

            <div className="info-card blue-card">
              <h3>💬 Quick Booking</h3>
              <p>Prefer to book directly? Chat with us on WhatsApp for instant confirmation.</p>
              <a
                href="https://wa.me/91XXXXXXXXXX?text=Hello%20BSS%20Residency!%20I%20would%20like%20to%20make%20a%20booking."
                className="btn-wa" target="_blank" rel="noreferrer"
                style={{ display: 'block', textAlign: 'center', marginTop: '1rem' }}
              >
                💬 Open WhatsApp
              </a>
            </div>

            <div className="info-card">
              <h3>📍 Location</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)', lineHeight: 1.7 }}>
                215, Ramanuja Nagar,<br />Courtallam, Tamil Nadu – 627 802
              </p>
              <a href="https://maps.app.goo.gl/HoVrP5LYitnw8qJ1A" target="_blank" rel="noreferrer"
                style={{ fontSize: '0.82rem', color: 'var(--blue)', display: 'block', marginTop: '0.75rem' }}>
                View on Google Maps →
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
