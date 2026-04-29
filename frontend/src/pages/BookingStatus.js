import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { waLink, CONTACT } from '../constants';
import gpayLogo from '../assets/gpay.png';
import paytmLogo from '../assets/paytm.png';
import './BookingStatus.css';

const ROOM_PRICES = {
  'Double Bed': 1300,
  'Double Bed A/C': 1600,
  'Four Bed': 2500,
  'Four Bed A/C': 2800,
};

export default function BookingStatus() {
  const { id: urlId } = useParams();
  const navigate = useNavigate();

  const [inputId, setInputId] = useState(urlId || '');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');

  // Auto-search if ID comes from URL
  useEffect(() => {
    if (urlId) {
      fetchBooking(urlId);
    }
    // eslint-disable-next-line
  }, [urlId]);

  const fetchBooking = async (id) => {
    const trimmed = (id || inputId).trim();
    if (!trimmed) {
      setError('Please enter a Booking ID.');
      return;
    }
    setLoading(true);
    setError('');
    setBooking(null);
    setSearched(true);
    try {
      const res = await api.get(`/api/bookings/${trimmed}`);
      setBooking(res.data.booking);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking not found. Please check your ID.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/booking/status/${inputId.trim()}`);
    fetchBooking(inputId.trim());
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.comment.trim()) return;
    setReviewLoading(true);
    try {
      await api.post('/api/bookings/public/reviews', {
        guestName: booking.name,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      });
      setReviewSuccess('Thank you! Your review has been submitted.');
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) {
      alert('Error submitting review: ' + err.message);
    } finally {
      setReviewLoading(false);
    }
  };

  // Compute nights and total
  const nights = useMemo(() => {
    if (!booking) return 0;
    const ci = new Date(booking.checkIn);
    const co = new Date(booking.checkOut);
    return Math.max(0, Math.round((co - ci) / (1000 * 60 * 60 * 24)));
  }, [booking]);

  const totalPrice = useMemo(() => {
    if (!booking) return 0;
    const price = ROOM_PRICES[booking.roomType] || 0;
    return price * nights * Math.max(1, booking.rooms || 1);
  }, [booking, nights]);

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString('en-IN', {
          day: '2-digit', month: 'short', year: 'numeric',
        })
      : '—';

  const statusMeta = {
    Pending: {
      color: '#f59e0b',
      bg: '#fffbeb',
      icon: '⏳',
      label: 'Pending Confirmation',
      desc: 'Your booking has been received. The hotel admin will confirm it via WhatsApp shortly.',
    },
    Confirmed: {
      color: '#10b981',
      bg: '#f0fdf4',
      icon: '✅',
      label: 'Confirmed',
      desc: 'Your booking is confirmed! Please present your Booking ID at reception.',
    },
    Cancelled: {
      color: '#ef4444',
      bg: '#fef2f2',
      icon: '❌',
      label: 'Cancelled',
      desc: 'This booking has been cancelled. Please contact us to rebook.',
    },
    'Checked-out': {
      color: '#6b7280',
      bg: '#f9fafb',
      icon: '🏁',
      label: 'Checked Out',
      desc: 'Thank you for staying at BSS Residency! We hope to see you again.',
    },
  };

  const meta = booking ? (statusMeta[booking.status] || statusMeta['Pending']) : null;

  const waConfirmFollowUp = booking
    ? `Hello BSS Residency! 🙏\n\nI'd like to follow up on my booking.\nBooking ID: ${booking._id}\nName: ${booking.name}\nRoom: ${booking.roomType}\nCheck-in: ${formatDate(booking.checkIn)}\n\nPlease confirm!`
    : '';

  return (
    <main className="bstatus-page">
      <section className="page-hero">
        <p className="section-label gold">Manage Your Stay</p>
        <h1>Manage <em>Booking</em></h1>
        <p>Enter your Booking ID to track status, pay advance, or complete online check-in.</p>
      </section>

      <section className="bstatus-section container">
        {/* Search Bar */}
        <div className="bstatus-search-wrap">
          <form className="bstatus-search-form" onSubmit={handleSearch}>
            <div className="search-input-group">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                value={inputId}
                onChange={(e) => setInputId(e.target.value)}
                placeholder="Paste your Booking ID here..."
                className="bstatus-input"
                autoFocus
              />
              <button type="submit" className="btn-search" disabled={loading}>
                {loading ? <span className="btn-spinner" /> : 'Find Booking'}
              </button>
            </div>
            <p className="search-hint">
              Your Booking ID was shown after submitting your booking request. It looks like: <code>68...</code>
            </p>
          </form>
        </div>

        {/* Error State */}
        {error && (
          <div className="bstatus-error">
            <span>⚠️</span>
            <div>
              <strong>Not Found</strong>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="bstatus-loading">
            <div className="loading-spinner" />
            <p>Fetching your booking...</p>
          </div>
        )}

        {/* Result Card */}
        {booking && meta && (
          <div className="bstatus-result">
            {/* Status Banner */}
            <div className="status-banner" style={{ background: meta.bg, borderColor: meta.color }}>
              <span className="status-banner-icon" style={{ color: meta.color }}>{meta.icon}</span>
              <div>
                <div className="status-banner-label" style={{ color: meta.color }}>{meta.label}</div>
                <p className="status-banner-desc">{meta.desc}</p>
              </div>
            </div>

            {/* Booking ID */}
            <div className="bid-display">
              <span>Booking ID</span>
              <code className="bid-code">{booking.bookingId || booking._id}</code>
            </div>

            {/* Details Grid */}
            <div className="bstatus-details-grid">
              <div className="bsd-item">
                <span>Guest Name</span>
                <strong>{booking.name}</strong>
              </div>
              <div className="bsd-item">
                <span>Phone</span>
                <strong>{booking.phone}</strong>
              </div>
              {booking.email && (
                <div className="bsd-item">
                  <span>Email</span>
                  <strong>{booking.email}</strong>
                </div>
              )}
              <div className="bsd-item full">
                <span>Room Type</span>
                <strong>{booking.roomType}{booking.roomNumber ? ` — Room #${booking.roomNumber}` : ''}</strong>
              </div>
              <div className="bsd-item">
                <span>Check-in</span>
                <strong>{formatDate(booking.checkIn)}</strong>
              </div>
              <div className="bsd-item">
                <span>Check-out</span>
                <strong>{formatDate(booking.checkOut)}</strong>
              </div>
              <div className="bsd-item">
                <span>Nights</span>
                <strong>{nights}</strong>
              </div>
              <div className="bsd-item">
                <span>Rooms × Guests</span>
                <strong>{booking.rooms || 1} × {booking.guests}</strong>
              </div>
              <div className="bsd-item">
                <span>Booked On</span>
                <strong>{formatDate(booking.createdAt)}</strong>
              </div>
            </div>

            {/* Total */}
            <div className="bstatus-total">
              <span>Estimated Total</span>
              <strong>₹{totalPrice.toLocaleString('en-IN')}</strong>
            </div>

            {/* Payment options — only for confirmed bookings */}
            {booking.status === 'Confirmed' && (
              <div className="bstatus-confirmed-actions">
                <h3>💳 Pay in Advance (Optional)</h3>
                <p>You can pay at the property. If you wish to pay now, use the options below.</p>
                <div className="payment-btns">
                  <button
                    className="btn-gpay"
                    onClick={() => {
                      const upiLink = `upi://pay?pa=9344989393@okaxis&pn=BSS%20Residency&am=${totalPrice}&cu=INR`;
                      window.open(upiLink, '_blank');
                    }}
                  >
                    <img
                      src={gpayLogo}
                      alt="Google Pay"
                    />
                  </button>
                  <button
                    className="btn-paytm"
                    onClick={() => {
                      const upiLink = `upi://pay?pa=9344989393@paytm&pn=BSS%20Residency&am=${totalPrice}&cu=INR`;
                      window.open(upiLink, '_blank');
                    }}
                  >
                    <img
                      src={paytmLogo}
                      alt="Paytm"
                    />
                  </button>
                </div>

                {/* Print receipt */}
                <button className="btn-print" onClick={() => window.print()}>
                  <i className="fa-solid fa-file-pdf" /> Save / Print Receipt
                </button>
              </div>
            )}

            {/* Review Form — only for confirmed or checked-out bookings */}
            {(booking.status === 'Confirmed' || booking.status === 'Checked-out') && (
              <div className="bstatus-review-section">
                <h3>⭐ Rate Your Stay</h3>
                {reviewSuccess ? (
                  <div className="review-success">✅ {reviewSuccess}</div>
                ) : (
                  <form onSubmit={handleReviewSubmit}>
                    <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>
                      How was your experience at BSS Residency?
                    </p>
                    <div className="rating-select">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          className={reviewForm.rating >= num ? 'star active' : 'star'}
                          onClick={() => setReviewForm({ ...reviewForm, rating: num })}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <textarea
                      placeholder="Share your experience with us..."
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      required
                    />
                    <button type="submit" className="btn-submit-review" disabled={reviewLoading}>
                      {reviewLoading ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="bstatus-actions">
              {booking.status === 'Confirmed' && !booking.checkedInOnline && (
                <Link
                  to={`/checkin/${booking.bookingId || booking._id}`}
                  className="btn-checkin-online"
                >
                  🧾 Complete Online Check-in
                </Link>
              )}
              {booking.checkedInOnline && (
                <div className="checkin-done-badge">
                  ✅ Online Check-in Done
                </div>
              )}
              {booking.status === 'Pending' && (
                <a
                  href={waLink(waConfirmFollowUp)}
                  className="btn-wa-solid"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="fa-brands fa-whatsapp" /> Follow Up on WhatsApp
                </a>
              )}
              <a
                href={`tel:${CONTACT.phonePrimary.replace(/\s/g, '')}`}
                className="btn-call"
              >
                📞 Call Hotel
              </a>
              <Link to="/booking" className="btn-back">
                ← Make Another Booking
              </Link>
            </div>
          </div>
        )}

        {/* Empty state (after search, no result, no error) */}
        {!loading && !error && !booking && !searched && (
          <div className="bstatus-empty">
            <div className="empty-icon">📋</div>
            <h3>Enter your Booking ID above</h3>
            <p>
              Your Booking ID was displayed after submitting the booking form.
              <br />If you need help, contact us on{' '}
              <a href={waLink('Hello! I need help finding my booking ID.')} target="_blank" rel="noreferrer">WhatsApp</a>.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
