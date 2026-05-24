import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Users, Phone, MapPin, Printer, Star, Heart, CheckCircle2, ChevronRight, Loader2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

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
      const res = await axios.get(`http://localhost:5000/api/booking/${trimmed}`);
      setBooking(res.data.booking);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking not found. Please check your ID.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!inputId.trim()) return;
    navigate(`/booking/status/${inputId.trim()}`);
    fetchBooking(inputId.trim());
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.comment.trim()) return;
    setReviewLoading(true);
    try {
      await axios.post('http://localhost:5000/api/booking/public/reviews', {
        guestName: booking.name,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      });
      setReviewSuccess('Thank you! Your feedback has been received.');
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) {
      alert('Error submitting review: ' + err.message);
    } finally {
      setReviewLoading(false);
    }
  };

  const nights = useMemo(() => {
    if (!booking) return 0;
    const ci = new Date(booking.checkIn);
    const co = new Date(booking.checkOut);
    const diff = Math.round((co - ci) / (1000 * 60 * 60 * 24));
    return Math.max(1, diff);
  }, [booking]);

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString('en-IN', {
          day: '2-digit', month: 'short', year: 'numeric',
        })
      : '—';

  const statusMeta = {
    Pending: {
      color: '#d4af37',
      bg: 'rgba(212, 175, 55, 0.08)',
      borderColor: 'rgba(212, 175, 55, 0.3)',
      icon: '⏳',
      label: 'Pending Confirmation',
      desc: 'Your booking has been received. Our resort staff will verify availability and confirm it via WhatsApp shortly.',
    },
    Confirmed: {
      color: '#4caf50',
      bg: 'rgba(76, 175, 80, 0.08)',
      borderColor: 'rgba(76, 175, 80, 0.3)',
      icon: '✅',
      label: 'Confirmed Stay',
      desc: 'Your booking is officially confirmed! We look forward to welcoming you. Please show this screen or your Booking ID at reception.',
    },
    Cancelled: {
      color: '#f44336',
      bg: 'rgba(244, 67, 54, 0.08)',
      borderColor: 'rgba(244, 67, 54, 0.3)',
      icon: '❌',
      label: 'Booking Cancelled',
      desc: 'This booking has been cancelled. If this is an error or you would like to rebook, please contact us.',
    },
    'Checked-out': {
      color: '#888888',
      bg: 'rgba(255, 255, 255, 0.04)',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      icon: '🏁',
      label: 'Checked Out',
      desc: 'Thank you for choosing SM Golden Resorts! We hope you had a luxurious and peaceful stay in Courtallam. Come visit us again!',
    },
  };

  const meta = booking ? (statusMeta[booking.status] || statusMeta['Pending']) : null;

  const buildWaFollowUp = () => {
    if (!booking) return '';
    const msg = `Hello SM Golden Resorts! 🙏\n\nI'd like to follow up on my stay reservation.\nBooking ID: #${booking.bookingId || booking._id}\nName: ${booking.name}\nRoom Type: ${booking.roomType.toUpperCase()}\nCheck-in: ${formatDate(booking.checkIn)}`;
    return `https://wa.me/919443710420?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="bstatus-page section-padding">
      <div className="container">
        <div className="section-header text-center">
          <span className="gold-text uppercase">Manage Reservation</span>
          <h2>Track Stay Status</h2>
          <p className="subtitle-desc">Enter your Booking ID to view confirmation details, print guest receipt, or complete secure online check-in.</p>
        </div>

        {/* Search Panel */}
        <div className="glass-panel bstatus-search-panel">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-group">
              <input
                type="text"
                value={inputId}
                onChange={(e) => setInputId(e.target.value)}
                placeholder="Paste your 6-digit Booking ID here (e.g. 847291)"
                className="search-input"
                required
              />
              <button type="submit" className="btn-primary search-btn" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" size={18} /> : 'Find Booking'}
              </button>
            </div>
            <p className="search-tip">💡 Tip: Your Booking ID was displayed on-screen right after you submitted your booking.</p>
          </form>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="status-loading text-center">
            <Loader2 className="animate-spin gold-text spinner" size={50} />
            <p>Retrieving your reservation details from secure servers...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="status-error-card text-center">
            <div className="error-icon">⚠️</div>
            <h3>Reservation Not Found</h3>
            <p>{error}</p>
            <button className="btn-outline" onClick={() => { setError(''); setSearched(false); setInputId(''); }}>Try Another ID</button>
          </motion.div>
        )}

        {/* Result Card */}
        {booking && meta && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="booking-result-container"
          >
            {/* Print Area Header */}
            <div className="print-header-brand">
              <h2>SM GOLDEN RESORTS</h2>
              <p>Old Falls Main Road, Courtallam, Tamil Nadu | Phone: 9443710420 / 9003549849</p>
            </div>

            <div className="grid status-result-grid">
              {/* Left Column: Details */}
              <div className="glass-panel result-details-panel">
                <div className="status-banner" style={{ background: meta.bg, borderColor: meta.borderColor }}>
                  <span className="banner-icon">{meta.icon}</span>
                  <div>
                    <h3 style={{ color: meta.color }}>{meta.label}</h3>
                    <p>{meta.desc}</p>
                  </div>
                </div>

                <div className="result-section">
                  <h4 className="gold-text">Reservation Info</h4>
                  <div className="info-table">
                    <div className="info-row">
                      <span>Booking ID</span>
                      <strong className="id-badge">#{booking.bookingId || booking._id}</strong>
                    </div>
                    <div className="info-row">
                      <span>Primary Guest</span>
                      <strong>{booking.name}</strong>
                    </div>
                    <div className="info-row">
                      <span>Phone Number</span>
                      <strong>{booking.phone}</strong>
                    </div>
                    {booking.email && (
                      <div className="info-row">
                        <span>Email Address</span>
                        <strong>{booking.email}</strong>
                      </div>
                    )}
                    <div className="info-row">
                      <span>Room Category</span>
                      <strong className="uppercase">{booking.roomType} Room {booking.roomNumber ? `(Room #${booking.roomNumber})` : ''}</strong>
                    </div>
                    <div className="info-row">
                      <span>Stay Period</span>
                      <strong>{formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}</strong>
                    </div>
                    <div className="info-row">
                      <span>Nights Count</span>
                      <strong>{nights} Night{nights > 1 ? 's' : ''}</strong>
                    </div>
                    <div className="info-row">
                      <span>Rooms & Guests</span>
                      <strong>{booking.rooms || 1} Room(s) × {booking.guests} Guest(s)</strong>
                    </div>
                  </div>
                </div>

                {/* Pricing Details */}
                <div className="result-section pricing-section">
                  <h4 className="gold-text">Charges Summary</h4>
                  <div className="price-table">
                    <div className="price-row">
                      <span>Room charges ({nights} nights)</span>
                      <span>₹{(booking.roomCharges || 0).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="price-row">
                      <span>Luxury GST (12%)</span>
                      <span>₹{(booking.gstAmount || 0).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="price-divider"></div>
                    <div className="price-row total-row">
                      <span>Total Stay Price</span>
                      <strong className="gold-text">₹{(booking.totalPrice || 0).toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="price-row advance-row">
                      <span>Advance Amount Paid</span>
                      <span className="success-text">₹{(booking.advancePaid || 0).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="price-row balance-row">
                      <span>Balance Payable at Resort</span>
                      <strong>₹{Math.max(0, (booking.totalPrice || 0) - (booking.advancePaid || 0)).toLocaleString('en-IN')}</strong>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="result-actions-block no-print">
                  <button className="btn-outline btn-print" onClick={() => window.print()}>
                    <Printer size={18} /> Print Guest Receipt
                  </button>
                  
                  {booking.status === 'Confirmed' && !booking.checkedInOnline && (
                    <Link to={`/booking/checkin/${booking.bookingId || booking._id}`} className="btn-primary btn-checkin">
                      ⚡ Complete Secure Online Check-in
                    </Link>
                  )}

                  {booking.checkedInOnline && (
                    <div className="checkin-done-alert">
                      <CheckCircle2 size={20} /> Online Check-in completed successfully! Safe travels!
                    </div>
                  )}

                  {booking.status === 'Pending' && (
                    <a href={buildWaFollowUp()} target="_blank" rel="noopener noreferrer" className="btn-primary wa-followup-btn">
                      📱 Follow Up via WhatsApp
                    </a>
                  )}

                  <Link to="/book" className="btn-outline">
                    <ArrowLeft size={18} /> Book Another Stay
                  </Link>
                </div>
              </div>

              {/* Right Column: Review & Support */}
              <div className="right-aside-col no-print">
                {/* Rate stay */}
                {(booking.status === 'Confirmed' || booking.status === 'Checked-out') && (
                  <div className="glass-panel review-card-panel">
                    <h3><Heart size={20} className="gold-text" /> Rate Your Stay</h3>
                    {reviewSuccess ? (
                      <div className="review-success-msg text-center">
                        <CheckCircle2 size={40} className="gold-text" />
                        <p>{reviewSuccess}</p>
                      </div>
                    ) : (
                      <form onSubmit={handleReviewSubmit}>
                        <p>How would you describe your comfort and stay experience at SM Golden Resorts?</p>
                        <div className="rating-selector">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              className={reviewForm.rating >= star ? 'star-btn active' : 'star-btn'}
                              onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                            >
                              <Star size={24} fill={reviewForm.rating >= star ? 'var(--gold)' : 'none'} />
                            </button>
                          ))}
                        </div>
                        <div className="form-group">
                          <textarea
                            placeholder="Tell us what you liked (cleanliness, location near waterfalls, hospitality, owner support)..."
                            value={reviewForm.comment}
                            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                            rows="4"
                            required
                          />
                        </div>
                        <button type="submit" className="btn-primary w-full" disabled={reviewLoading}>
                          {reviewLoading ? <Loader2 className="animate-spin" size={18} /> : 'Submit Review'}
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* Contact support */}
                <div className="glass-panel support-panel">
                  <h3>Need Help?</h3>
                  <p>Having trouble finding your room reservation, or need to cancel/change stay dates? Get in touch with our resort owner S. Murugan directly.</p>
                  <div className="support-actions">
                    <a href="tel:9443710420" className="btn-outline w-full text-center">📞 Call 9443710420</a>
                    <a href="https://wa.me/919443710420" target="_blank" rel="noopener noreferrer" className="btn-outline w-full text-center">💬 WhatsApp Support</a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Empty state prior to search */}
        {!booking && !loading && !error && !searched && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bstatus-empty-panel text-center glass-panel">
            <Calendar size={60} className="gold-text empty-icon" />
            <h3>Search Reservation Status</h3>
            <p>Paste the 6-digit booking ID provided after reservation checkout. Our dashboard will display checkout stats, room configurations, payment logs, and check-in statuses.</p>
            <p className="highlight-text">For questions, reach us anytime via WhatsApp at +91 94437 10420</p>
          </motion.div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .bstatus-page { background: var(--bg-deep); min-height: 100vh; padding-top: 130px; }
        .subtitle-desc { color: var(--text-muted); max-width: 600px; margin: 15px auto 0; font-size: 0.95rem; }
        
        .bstatus-search-panel { padding: 40px; margin-bottom: 40px; }
        .search-form { max-width: 750px; margin: 0 auto; }
        .search-input-group { display: flex; gap: 15px; }
        .search-input { 
          flex: 1; 
          padding: 16px 20px; 
          background: var(--bg-deep); 
          border: 1px solid var(--gold-border); 
          color: white; 
          border-radius: 6px; 
          font-size: 1.05rem; 
          transition: var(--transition-smooth);
        }
        .search-input:focus { border-color: var(--gold); outline: none; box-shadow: 0 0 15px rgba(212,175,55,0.15); }
        .search-btn { font-weight: 700; text-transform: uppercase; padding: 0 35px; }
        .search-tip { font-size: 0.85rem; color: var(--text-muted); margin-top: 15px; }
        
        .status-loading { padding: 60px 0; color: var(--text-muted); }
        .status-loading .spinner { margin: 0 auto 20px; }

        .status-error-card { background: rgba(244, 67, 54, 0.05); border: 1px solid rgba(244, 67, 54, 0.2); padding: 50px; border-radius: 12px; max-width: 550px; margin: 40px auto; }
        .status-error-card h3 { margin: 15px 0 10px; font-size: 1.5rem; }
        .status-error-card p { color: var(--text-muted); margin-bottom: 25px; }
        .error-icon { font-size: 3rem; }

        .booking-result-container { margin-top: 20px; }
        .print-header-brand { display: none; text-align: center; border-bottom: 2px solid #333; padding-bottom: 15px; margin-bottom: 30px; }
        .print-header-brand h2 { font-family: var(--font-heading); color: var(--gold); font-size: 2.2rem; }
        .print-header-brand p { font-size: 0.85rem; color: #666; margin-top: 5px; }

        .status-result-grid { grid-template-columns: 1.7fr 1fr; gap: 40px; align-items: start; }
        .result-details-panel { padding: 40px; }
        .status-banner { display: flex; gap: 20px; padding: 25px; border-radius: 8px; border: 1px solid transparent; margin-bottom: 35px; align-items: flex-start; }
        .banner-icon { font-size: 2.2rem; line-height: 1; }
        .status-banner h3 { font-size: 1.3rem; margin-bottom: 6px; }
        .status-banner p { font-size: 0.9rem; color: var(--text-primary); line-height: 1.5; margin: 0; }

        .result-section { margin-bottom: 35px; }
        .result-section h4 { font-size: 1.1rem; border-bottom: 1px solid var(--gold-border); padding-bottom: 10px; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px; }
        .info-table, .price-table { display: flex; flex-direction: column; gap: 15px; }
        .info-row, .price-row { display: flex; justify-content: space-between; font-size: 0.95rem; }
        .info-row span, .price-row span { color: var(--text-muted); }
        .id-badge { background: var(--gold-gradient); -webkit-background-clip: initial; -webkit-text-fill-color: initial; color: var(--bg-deep); padding: 3px 10px; border-radius: 4px; font-family: monospace; font-size: 1.05rem; }
        
        .price-divider { height: 1px; background: var(--gold-border); margin: 5px 0; }
        .total-row { font-size: 1.25rem; font-weight: 700; margin-top: 5px; }
        .advance-row { color: #4caf50; }
        .success-text { color: #4caf50; font-weight: 600; }
        .balance-row { font-size: 1.1rem; font-weight: 700; background: rgba(255,255,255,0.03); padding: 12px 18px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.05); }

        .result-actions-block { display: flex; flex-wrap: wrap; gap: 15px; margin-top: 35px; border-top: 1px solid var(--gold-border); padding-top: 30px; }
        .checkin-done-alert { display: flex; align-items: center; gap: 10px; background: rgba(76, 175, 80, 0.08); border: 1px solid rgba(76, 175, 80, 0.2); color: #4caf50; width: 100%; padding: 15px 20px; border-radius: 6px; font-weight: 600; font-size: 0.95rem; }
        
        .right-aside-col { display: flex; flex-direction: column; gap: 30px; }
        .review-card-panel, .support-panel { padding: 35px; }
        .review-card-panel h3, .support-panel h3 { font-size: 1.3rem; font-weight: 500; border-bottom: 1px solid var(--gold-border); padding-bottom: 12px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
        .review-card-panel p, .support-panel p { color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin-bottom: 20px; }
        
        .rating-selector { display: flex; gap: 8px; margin-bottom: 20px; justify-content: center; }
        .star-btn { background: transparent; border: none; cursor: pointer; color: var(--text-muted); transition: var(--transition-smooth); }
        .star-btn.active { color: var(--gold); }
        .star-btn:hover { transform: scale(1.2); }
        .review-card-panel textarea { width: 100%; padding: 14px 18px; background: var(--bg-deep); border: 1px solid var(--gold-border); color: white; border-radius: 6px; font-size: 0.95rem; transition: var(--transition-smooth); }
        .review-card-panel textarea:focus { border-color: var(--gold); outline: none; }
        .review-success-msg { padding: 30px 0; }
        .review-success-msg p { color: #4caf50; font-size: 1.05rem; font-weight: 600; margin-top: 15px; }

        .support-actions { display: flex; flex-direction: column; gap: 12px; }
        .bstatus-empty-panel { padding: 80px 40px; }
        .empty-icon { margin: 0 auto 25px; }
        .bstatus-empty-panel h3 { font-size: 1.8rem; font-weight: 400; margin-bottom: 15px; }
        .bstatus-empty-panel p { color: var(--text-muted); max-width: 600px; margin: 0 auto 15px; line-height: 1.7; }
        .highlight-text { color: var(--gold); font-weight: 600; margin-top: 25px !important; }

        @media print {
          body { background: white !important; color: black !important; }
          .bstatus-page { padding-top: 0 !important; }
          .no-print { display: none !important; }
          .glass-panel { background: transparent !important; border: none !important; box-shadow: none !important; padding: 0 !important; }
          .print-header-brand { display: block !important; }
          .status-banner { border: 1px solid #ddd !important; background: #fafafa !important; color: black !important; }
          .status-banner p { color: #333 !important; }
          .id-badge { border: 1px solid #000; background: transparent; color: black; }
          .price-divider { background: #ddd !important; }
          .balance-row { border: 1px solid #ccc !important; background: #f9f9f9 !important; color: black !important; }
          .gold-text { background: none !important; -webkit-text-fill-color: initial !important; color: black !important; }
          .status-result-grid { grid-template-columns: 1fr !important; }
        }

        @media (max-width: 992px) {
          .status-result-grid { grid-template-columns: 1fr; }
          .search-input-group { flex-direction: column; }
          .search-btn { padding: 15px 0; }
        }
      `}} />
    </div>
  );
}
