import React, { useMemo, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { ROOMS, CONTACT, waLink } from '../constants';
import './Booking.css';

const initForm = {
  name: '',
  phone: '',
  email: '',
  roomType: '',
  checkIn: '',
  checkOut: '',
  guests: 1,
  rooms: 1,
  message: '',
};

export default function Booking() {
  const [form, setForm] = useState(initForm);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [step, setStep] = useState(1); // 1: dates/room, 2: guest details

  const today = new Date().toISOString().split('T')[0];

  const selectedRoom = useMemo(
    () => ROOMS.find((r) => r.name === form.roomType),
    [form.roomType],
  );

  const nights = useMemo(() => {
    if (!form.checkIn || !form.checkOut) return 0;
    const ci = new Date(form.checkIn);
    const co = new Date(form.checkOut);
    const diff = Math.round((co - ci) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  }, [form.checkIn, form.checkOut]);

  const totalPrice = useMemo(() => {
    if (!selectedRoom || !nights) return 0;
    return selectedRoom.price * nights * Math.max(1, Number(form.rooms) || 1);
  }, [selectedRoom, nights, form.rooms]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (result) setResult(null);
  };

  const pickRoom = (name) => {
    setForm((prev) => ({ ...prev, roomType: name }));
    if (result) setResult(null);
  };

  const nextStep = () => {
    if (!form.roomType || !form.checkIn || !form.checkOut) {
      setResult({ success: false, message: 'Please select a room and both dates.' });
      return;
    }
    if (new Date(form.checkIn) >= new Date(form.checkOut)) {
      setResult({ success: false, message: 'Check-out must be after check-in.' });
      return;
    }
    setResult(null);
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      setResult({ success: false, message: 'Please enter your name and phone number.' });
      return;
    }
    setLoading(true);
    try {
      // Backend still accepts the form; submit a compatible payload
      const res = await api.post('/api/bookings', {
        ...form,
        guests: Number(form.guests),
      });
      setResult({ success: true, message: res.data.message });
      // WhatsApp summary
      const msg = [
        'Hello BSS Residency! 🙏',
        '',
        'Booking Request:',
        `Name: ${form.name}`,
        `Phone: ${form.phone}`,
        form.email ? `Email: ${form.email}` : null,
        `Room: ${form.roomType}`,
        `Rooms: ${form.rooms}`,
        `Check-in: ${form.checkIn}`,
        `Check-out: ${form.checkOut}`,
        `Nights: ${nights}`,
        `Guests: ${form.guests}`,
        totalPrice ? `Estimated Total: ₹${totalPrice.toLocaleString('en-IN')}` : null,
        form.message ? `Notes: ${form.message}` : null,
        '',
        'Please confirm my booking. Thank you!',
      ]
        .filter(Boolean)
        .join('\n');
      window.open(waLink(msg), '_blank');
      setForm(initForm);
      setStep(1);
    } catch (err) {
      setResult({
        success: false,
        message: err.response?.data?.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="booking-page">
      <section className="page-hero">
        <p className="section-label gold">Reservations</p>
        <h1>Book Your <em>Stay</em></h1>
        <p>Fill the form below. We'll confirm your booking on WhatsApp instantly.</p>
      </section>

      <section className="booking-section container">
        <div className="booking-grid">
          {/* Form */}
          <div className="booking-form-wrap">
            {/* Step indicator */}
            <div className="steps">
              <div className={`step ${step >= 1 ? 'active' : ''}`}>
                <span className="step-num">1</span>
                <span className="step-label">Room & Dates</span>
              </div>
              <div className="step-bar" />
              <div className={`step ${step >= 2 ? 'active' : ''}`}>
                <span className="step-num">2</span>
                <span className="step-label">Your Details</span>
              </div>
            </div>

            {result && (
              <div className={`result-msg ${result.success ? 'success' : 'error'}`}>
                {result.success ? '✅' : '⚠️'} {result.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="booking-form">
              {step === 1 && (
                <>
                  <h2>Select Room & Dates</h2>
                  <p className="form-subtext">Choose a room type and your stay dates.</p>

                  <div className="form-group">
                    <label>Room Type <span className="req">*</span></label>
                    <div className="room-picker">
                      {ROOMS.map((r) => (
                        <button
                          type="button"
                          key={r.key}
                          className={`room-pick-card ${form.roomType === r.name ? 'active' : ''}`}
                          onClick={() => pickRoom(r.name)}
                        >
                          <span className="rp-icon">{r.icon}</span>
                          <div className="rp-info">
                            <strong>{r.name}</strong>
                            <span className="rp-type">{r.type}</span>
                          </div>
                          <span className="rp-price">₹{r.price.toLocaleString('en-IN')}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Check-in Date <span className="req">*</span></label>
                      <input
                        name="checkIn"
                        value={form.checkIn}
                        onChange={handleChange}
                        type="date"
                        min={today}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Check-out Date <span className="req">*</span></label>
                      <input
                        name="checkOut"
                        value={form.checkOut}
                        onChange={handleChange}
                        type="date"
                        min={form.checkIn || today}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Number of Rooms</label>
                      <input
                        name="rooms"
                        value={form.rooms}
                        onChange={handleChange}
                        type="number"
                        min="1"
                        max="10"
                      />
                    </div>
                    <div className="form-group">
                      <label>Number of Guests</label>
                      <input
                        name="guests"
                        value={form.guests}
                        onChange={handleChange}
                        type="number"
                        min="1"
                        max="20"
                      />
                    </div>
                  </div>

                  <button type="button" className="submit-btn" onClick={nextStep}>
                    Continue →
                  </button>
                </>
              )}

              {step === 2 && (
                <>
                  <h2>Your Details</h2>
                  <p className="form-subtext">
                    We'll use this to confirm your booking on WhatsApp.
                  </p>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name <span className="req">*</span></label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone Number <span className="req">*</span></label>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+91 XXXXX XXXXX"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      type="email"
                      placeholder="your@email.com (optional)"
                    />
                  </div>

                  <div className="form-group">
                    <label>Special Requests / Message</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Any special requirements or questions..."
                    />
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn-back"
                      onClick={() => setStep(1)}
                    >
                      ← Back
                    </button>
                    <button type="submit" className="submit-btn" disabled={loading}>
                      {loading ? (
                        <>
                          <span className="btn-spinner" />Submitting...
                        </>
                      ) : (
                        <><i className="fa-brands fa-whatsapp"></i> Confirm Booking via WhatsApp</>
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>

          {/* Summary sidebar */}
          <aside className="booking-sidebar">
            <div className="summary-card">
              <h3>Your Booking</h3>
              <div className="summary-row">
                <span>Room</span>
                <strong>{form.roomType || '—'}</strong>
              </div>
              <div className="summary-row">
                <span>Check-in</span>
                <strong>{form.checkIn || '—'}</strong>
              </div>
              <div className="summary-row">
                <span>Check-out</span>
                <strong>{form.checkOut || '—'}</strong>
              </div>
              <div className="summary-row">
                <span>Nights</span>
                <strong>{nights || '—'}</strong>
              </div>
              <div className="summary-row">
                <span>Rooms × Guests</span>
                <strong>{form.rooms} × {form.guests}</strong>
              </div>
              {selectedRoom && (
                <div className="summary-row">
                  <span>Rate / night</span>
                  <strong>₹{selectedRoom.price.toLocaleString('en-IN')}</strong>
                </div>
              )}
              <div className="summary-total">
                <span>Estimated total</span>
                <strong>
                  {totalPrice ? `₹${totalPrice.toLocaleString('en-IN')}` : '₹—'}
                </strong>
              </div>
              <p className="summary-note">
                Taxes as applicable. Final price confirmed on WhatsApp.
              </p>
            </div>

            <div className="info-card">
              <h3>Booking Info</h3>
              <ul>
                <li><strong>Check-in:</strong> {CONTACT.checkIn}</li>
                <li><strong>Check-out:</strong> {CONTACT.checkOut}</li>
                <li><strong>Early/Late:</strong> On request</li>
                <li><strong>Confirmation:</strong> Via WhatsApp</li>
              </ul>
            </div>

            <div className="info-card gold-card">
              <h3>Quick Booking</h3>
              <p>Prefer to book directly? Call or WhatsApp us.</p>
              <div className="quick-actions">
                <a
                  href={waLink('Hello BSS Residency! I would like to make a booking.')}
                  className="btn-wa"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="fa-brands fa-whatsapp"></i> WhatsApp
                </a>
                <a
                  href={`https://instagram.com/${CONTACT.instagram}`}
                  className="btn-insta-small"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="fa-brands fa-square-instagram"></i> Instagram
                </a>
              </div>
              <a
                href={`tel:${CONTACT.phonePrimary.replace(/\s/g, '')}`}
                className="btn-dark-inline"
              >
                📞 {CONTACT.phonePrimary}
              </a>
              <a
                href={`tel:+91${CONTACT.phoneSecondary.replace(/[^0-9]/g, '').slice(-10)}`}
                className="btn-dark-inline"
              >
                📞 {CONTACT.phoneSecondary}
              </a>
            </div>

            <div className="info-card">
              <h3>Location</h3>
              <p className="addr">
                {CONTACT.addressLine1}<br />{CONTACT.addressLine2}
              </p>
              <Link to="/contact" className="map-mini-link">
                View map & nearby →
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
