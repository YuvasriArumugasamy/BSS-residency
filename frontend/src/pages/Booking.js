import React, { useMemo, useState, useEffect } from 'react';
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
  const [pendingBooking, setPendingBooking] = useState(null); // after submit
  const [availability, setAvailability] = useState({});

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await api.get('/api/bookings/availability');
        if (res.data.success) {
          setAvailability(res.data.availability);
        }
      } catch (err) {
        console.error('Failed to fetch availability', err);
      }
    };
    fetchAvailability();
  }, []);

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
      const res = await api.post('/api/bookings', {
        ...form,
        guests: Number(form.guests),
      });

      // Store the confirmed booking data from DB
      setPendingBooking({
        ...res.data.booking,
        nights,
        totalPrice,
      });
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

  // --- SUCCESS / PENDING SCREEN ---
  if (pendingBooking) {
    const bookingId = pendingBooking._id;
    const shortId = bookingId?.slice(-6).toUpperCase() || '';
    const waMsg = `Hello BSS Residency! 🙏\n\nI just submitted a booking request.\nBooking ID: ${bookingId}\nName: ${pendingBooking.name}\nRoom: ${pendingBooking.roomType}\nCheck-in: ${new Date(pendingBooking.checkIn).toLocaleDateString('en-IN')}\nCheck-out: ${new Date(pendingBooking.checkOut).toLocaleDateString('en-IN')}\n\nPlease confirm!`;

    return (
      <main className="booking-page">
        <section className="page-hero">
          <p className="section-label gold">Reservation</p>
          <h1>Booking <em>Received!</em></h1>
          <p>We've received your request. Confirmation coming shortly via WhatsApp.</p>
        </section>

        <section className="booking-section container">
          <div className="pending-screen">
            {/* Animated pending icon */}
            <div className="pending-icon-wrap">
              <div className="pending-pulse" />
              <span className="pending-icon">🕐</span>
            </div>

            <div className="pending-card">
              <div className="pending-header">
                <span className="status-badge-large pending">⏳ Pending Confirmation</span>
                <div className="booking-id-display">
                  <span>Booking ID</span>
                  <strong className="bid">{bookingId}</strong>
                  <small>Short ref: BSS-{shortId}</small>
                </div>
              </div>

              <div className="pending-details-grid">
                <div className="pd-item">
                  <span>Guest Name</span>
                  <strong>{pendingBooking.name}</strong>
                </div>
                <div className="pd-item">
                  <span>Phone</span>
                  <strong>{pendingBooking.phone}</strong>
                </div>
                <div className="pd-item full">
                  <span>Room Type</span>
                  <strong>{pendingBooking.roomType}</strong>
                </div>
                <div className="pd-item">
                  <span>Check-in</span>
                  <strong>{new Date(pendingBooking.checkIn).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</strong>
                </div>
                <div className="pd-item">
                  <span>Check-out</span>
                  <strong>{new Date(pendingBooking.checkOut).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</strong>
                </div>
                <div className="pd-item">
                  <span>Nights</span>
                  <strong>{pendingBooking.nights}</strong>
                </div>
                <div className="pd-item">
                  <span>Rooms × Guests</span>
                  <strong>{pendingBooking.rooms} × {pendingBooking.guests}</strong>
                </div>
              </div>

              <div className="pending-total">
                <span>Estimated Total</span>
                <strong>₹{pendingBooking.totalPrice?.toLocaleString('en-IN')}</strong>
              </div>

              <p className="pending-note">
                📋 Please <strong>save your Booking ID</strong> above. The admin will confirm your booking via WhatsApp. You can also check your booking status anytime using the button below.
              </p>

              <div className="pending-actions">
                <a
                  href={waLink(waMsg)}
                  className="btn-wa-solid"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="fa-brands fa-whatsapp" /> Follow Up on WhatsApp
                </a>
                <Link
                  to={`/booking/status/${bookingId}`}
                  className="btn-status-check"
                >
                  🔍 Check Booking Status
                </Link>
                <button
                  className="btn-back"
                  onClick={() => setPendingBooking(null)}
                >
                  ← New Booking
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

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
                <span className="step-label">Room &amp; Dates</span>
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
                  <h2>Select Room &amp; Dates</h2>
                  <p className="form-subtext">Choose a room type and your stay dates.</p>

                  <div className="form-group">
                    <label>Room Type <span className="req">*</span></label>
                    <div className="room-picker">
                      {ROOMS.map((r) => {
                        const count = availability[r.name];
                        // If no room data in DB at all, treat all as available (don't block booking)
                        const hasDbData = Object.keys(availability).length > 0;
                        const isSoldOut = hasDbData && count === 0;
                        return (
                          <button
                            type="button"
                            key={r.key}
                            className={`room-pick-card ${form.roomType === r.name ? 'active' : ''} ${isSoldOut ? 'sold-out' : ''}`}
                            onClick={() => !isSoldOut && pickRoom(r.name)}
                            disabled={isSoldOut}
                          >
                            <span className="rp-icon">{r.icon}</span>
                            <div className="rp-info">
                              <strong>{r.name}</strong>
                              <span className="rp-type">{r.type}</span>
                              <div className="rp-availability">
                                {isSoldOut ? (
                                  <span className="status-badge sold-out">Sold Out</span>
                                ) : count > 0 ? (
                                  <span className="status-badge available">{count} Available</span>
                                ) : (
                                  <span className="status-badge available">Available</span>
                                )}
                              </div>
                            </div>
                            <span className="rp-price">₹{r.price.toLocaleString('en-IN')}</span>
                          </button>
                        );
                      })}
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
                        <>📩 Submit Booking Request</>
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
                <li><strong>Check-in:</strong> 11:00 AM onwards</li>
                <li><strong>Check-out:</strong> Before 10:00 AM</li>
                <li><strong>Confirmation:</strong> Via WhatsApp</li>
                <li><strong>Payment:</strong> At property</li>
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
                  <i className="fa-brands fa-whatsapp" /> WhatsApp
                </a>
                <a
                  href={`https://instagram.com/${CONTACT.instagram}`}
                  className="btn-insta-small"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="fa-brands fa-square-instagram" /> Instagram
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
                View map &amp; nearby →
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
