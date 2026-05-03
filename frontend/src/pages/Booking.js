import React, { useMemo, useState, useEffect } from 'react';
import api from '../api/axios';
import { Link, useLocation } from 'react-router-dom';
import { ROOMS, CONTACT, waLink } from '../constants';
import SEO from '../components/SEO';
import './Booking.css';

const initForm = {
  salutation: 'Mr.',
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  roomType: '',
  checkIn: '',
  checkOut: '',
  guests: 1,
  rooms: 1,
  message: '',
};

const GST_FIXED = 200;

export default function Booking() {
  const [form, setForm] = useState(initForm);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [step, setStep] = useState(1);
  const [pendingBooking, setPendingBooking] = useState(null);
  const [availability, setAvailability] = useState({});
  const [dailyAvailability, setDailyAvailability] = useState({});
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roomKey = params.get('room');
    if (roomKey) {
      const room = ROOMS.find(r => r.key === roomKey);
      if (room) {
        setForm(prev => ({ ...prev, roomType: room.name }));
      }
    }
  }, [location]);
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth() + 1);
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [isCalendarLoading, setIsCalendarLoading] = useState(false);
  const [showSpecialReq, setShowSpecialReq] = useState(false);
  const [policyChecked, setPolicyChecked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSeason, setIsSeason] = useState(false);

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
    
    const fetchSeasonStatus = async () => {
      try {
        const res = await api.get('/api/admin/settings/public');
        if (res.data.success) setIsSeason(res.data.isSeason);
      } catch (err) {
        console.error('Failed to fetch season status', err);
      }
    };
    fetchSeasonStatus();
  }, []);

  useEffect(() => {
    if (!form.roomType) return;
    
    const fetchDailyAvailability = async () => {
      setIsCalendarLoading(true);
      try {
        const res = await api.get('/api/bookings/availability', {
          params: {
            roomType: form.roomType,
            month: calendarMonth,
            year: calendarYear
          }
        });
        if (res.data.success) {
          setDailyAvailability(res.data.availability);
        }
      } catch (err) {
        console.error('Failed to fetch daily availability', err);
      } finally {
        setIsCalendarLoading(false);
      }
    };
    fetchDailyAvailability();
  }, [form.roomType, calendarMonth, calendarYear]);

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

  const getPrice = (room) => isSeason ? room.seasonPrice : room.nonSeasonPrice;

  const roomCharges = useMemo(() => {
    if (!selectedRoom || !nights) return 0;
    return getPrice(selectedRoom) * nights * Math.max(1, Number(form.rooms) || 1);
  }, [selectedRoom, nights, form.rooms, isSeason]);

  const gstAmount = GST_FIXED;
  const totalPrice = useMemo(() => roomCharges + gstAmount, [roomCharges, gstAmount]);
  const advanceAmount = 500; // Flat ₹500 advance

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (result) setResult(null);
  };

  const pickRoom = (name) => {
    setForm((prev) => ({ ...prev, roomType: name }));
    if (result) setResult(null);
  };

  const clearDates = () => {
    setForm(prev => ({ ...prev, checkIn: '', checkOut: '' }));
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
    if (!form.firstName || !form.phone) {
      setResult({ success: false, message: 'Please enter your name and phone number.' });
      return;
    }
    if (!policyChecked) {
      setResult({ success: false, message: 'Please accept the booking policy to proceed.' });
      return;
    }
    setLoading(true);
    try {
      const fullName = `${form.salutation} ${form.firstName} ${form.lastName}`.trim();
      
      // Clean payload for backend
      const payload = {
        name: fullName,
        email: form.email,
        phone: form.phone,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        roomType: form.roomType,
        rooms: Number(form.rooms) || 1,
        guests: Number(form.guests) || 1,
        children: Number(form.children) || 0,
        message: form.message // Changed from specialRequests to message to match backend
      };

      const res = await api.post('/api/bookings', payload);

      setPendingBooking({
        ...res.data.booking,
        nights,
        totalPrice,
        roomCharges,
        gstAmount,
      });
      setForm(initForm);
      setStep(1);
      setPolicyChecked(false);
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
    const bookingId = pendingBooking.bookingId || (pendingBooking._id ? String(parseInt(pendingBooking._id.toString().slice(-6), 16)).padStart(6, '0').slice(-6) : '');
    const shortId = bookingId;
    const waMsg = `Hello BSS Residency! 🙏\n\nI just submitted a booking request.\nBooking ID: ${bookingId}\nName: ${pendingBooking.name}\nRoom: ${pendingBooking.roomType}\nCheck-in: ${new Date(pendingBooking.checkIn).toLocaleDateString('en-IN')}\nCheck-out: ${new Date(pendingBooking.checkOut).toLocaleDateString('en-IN')}\n\nI have paid the advance of ₹500 via UPI. Please confirm!`;

    return (
      <>
        <SEO 
          title="Booking Confirmed | BSS Residency"
          description="Your booking request has been received. Please complete the advance payment."
        />
        <main className="booking-page">
        <section className="page-hero">
          <p className="section-label gold">Reservation</p>
          <h1>Booking <em>Received!</em></h1>
          <p>Pay advance to confirm your stay at BSS Residency.</p>
        </section>

        <section className="booking-section container">
          <div className="pending-screen">
            <div className="pending-icon-wrap">
              <div className="pending-pulse" />
              <span className="pending-icon">🕐</span>
            </div>

            <div className="pending-card">
              <div className="pending-header">
                <span className="status-badge-large pending">⏳ Pending Advance Payment</span>
                <div className="booking-id-display">
                  <span>Booking ID</span>
                  <strong className="bid">{bookingId}</strong>
                  <small>Short ref: BSS-{shortId}</small>
                </div>
              </div>

              {/* Premium Payment Section */}
              <div className="payment-checkout-card">
                <div className="pc-badge">Action Required: Secure Your Booking</div>
                <h3 className="pc-title">Pay Advance ₹ {advanceAmount}</h3>
                <p className="pc-subtitle">Scan QR code or use the UPI ID below to pay via GPay, PhonePe, or Paytm.</p>
                
                <div className="pc-grid">
                  <div className="pc-qr-wrap">
                    {(() => {
                      const upiUrl = `upi://pay?pa=santhoshgk9498@oksbi&am=500&cu=INR`;
                      const qrUrl = `https://chart.googleapis.com/chart?cht=qr&chl=${encodeURIComponent(upiUrl)}&chs=300x300&choe=UTF-8&chld=L|2&v=${Date.now()}`;
                      
                      return (
                        <div className="pc-payment-actions">
                          <div className="pc-qr-frame" style={{ background: '#fff', padding: '15px', borderRadius: '16px', border: '2px solid #d4a857', boxShadow: '0 10px 25px rgba(212,168,87,0.2)' }}>
                            <img 
                              src={qrUrl} 
                              alt="Payment QR Code" 
                              className="pc-qr-img" 
                              style={{ width: '100%', maxWidth: '220px', display: 'block', margin: '0 auto' }}
                            />
                            <p style={{ fontSize: '0.7rem', color: '#888', marginTop: '8px', textAlign: 'center' }}>Scan with GPay / PhonePe / Paytm</p>
                          </div>
                          
                          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <button 
                              type="button"
                              onClick={() => {
                                window.location.href = upiUrl;
                              }}
                              className="admin-btn admin-btn-primary" 
                              style={{ 
                                background: '#1a1a1a', 
                                color: '#fff', 
                                padding: '1.25rem', 
                                borderRadius: '12px', 
                                fontWeight: '800',
                                fontSize: '1rem',
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                              }}
                            >
                              🚀 CLICK HERE TO PAY NOW
                            </button>
                            
                            <div style={{ background: '#fffbeb', padding: '1rem', borderRadius: '10px', border: '1px solid #fef3c7' }}>
                              <p style={{ fontSize: '0.8rem', color: '#92400e', margin: '0 0 0.5rem 0', fontWeight: '700' }}>Alternative: GPay directly to Number</p>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <strong style={{ fontSize: '1.2rem', color: '#000' }}>93449 89393</strong>
                                <button 
                                  type="button" 
                                  onClick={() => copyToClipboard('9344989393')}
                                  style={{ background: '#d4a857', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}
                                >
                                  {copied ? '✅ COPIED' : '📋 COPY'}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="pc-info-wrap">
                    <div className="upi-copy-box" style={{ background: '#fff', border: '1px solid #e2e8f0' }}>
                      <div className="ucb-label">Alternative UPI ID</div>
                      <div className="ucb-value-row">
                        <strong className="ucb-id">santhoshgk9498@oksbi</strong>
                        <button 
                          type="button" 
                          className={`copy-btn ${copied ? 'copied' : ''}`}
                          onClick={() => copyToClipboard('santhoshgk9498@oksbi')}
                        >
                          {copied ? '✓' : '📋'}
                        </button>
                      </div>
                      <div className="ucb-value-row" style={{ marginTop: '0.5rem' }}>
                        <strong className="ucb-id">9344989393</strong>
                        <button 
                          type="button" 
                          className={`copy-btn ${copied ? 'copied' : ''}`}
                          onClick={() => copyToClipboard('9344989393')}
                        >
                          {copied ? '✓ Copied' : '📋 Copy'}
                        </button>
                      </div>
                      <p className="ucb-name">Verified Name: <strong>Santhosh G (BSS Residency)</strong></p>
                    </div>

                    <div className="payment-steps-new">
                      <div className="psn-item">
                        <span className="psn-num">1</span>
                        <span>Pay <strong>₹ {advanceAmount}</strong> advance</span>
                      </div>
                      <div className="psn-item">
                        <span className="psn-num">2</span>
                        <span>Take <strong>Screenshot</strong></span>
                      </div>
                      <div className="psn-item">
                        <span className="psn-num">3</span>
                        <span>Share on <strong>WhatsApp</strong></span>
                      </div>
                    </div>
                  </div>
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

              <div className="pending-price-breakdown">
                <div className="pb-row">
                  <span>Room Charges</span>
                  <span>₹ {pendingBooking.roomCharges?.toLocaleString('en-IN')}</span>
                </div>
                <div className="pb-row">
                  <span>GST (12%)</span>
                  <span>₹ {pendingBooking.gstAmount?.toLocaleString('en-IN')}</span>
                </div>
                <div className="pb-total">
                  <span>Total Amount</span>
                  <strong>₹ {pendingBooking.totalPrice?.toLocaleString('en-IN')}</strong>
                </div>
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
                
                <div className="pending-sub-actions">
                  <Link
                    to={`/booking/status/${bookingId}`}
                    className="btn-status-check"
                  >
                    🔍 Check Status
                  </Link>
                  <button
                    className="btn-new-booking"
                    onClick={() => setPendingBooking(null)}
                  >
                    ← New Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      </>
    );
  }

  return (
    <>
      <SEO 
        title="Book Your Room in Courtallam Online | BSS Residency"
        description="Book your stay at BSS Residency Courtallam. Instant WhatsApp confirmation, safe & secure, and best prices guaranteed."
        keywords="book lodge courtallam, online booking courtallam, courtallam room booking"
      />
      <main className="booking-page">
      <section className="page-hero">
        <p className="section-label gold">Reservations</p>
        <h1>Book Your <em>Stay</em></h1>
        <p>Complete the form below to book your room at BSS Residency, Courtallam.</p>
      </section>

      <section className="booking-section container">
        <div className="booking-grid-new">

          {/* LEFT COLUMN — Form */}
          <div className="booking-main-col">

            {/* Step indicator */}
            <div className="steps-bar">
              <div className={`step-item ${step >= 1 ? 'active' : ''} ${step > 1 ? 'done' : ''}`}>
                <div className="step-circle">{step > 1 ? '✓' : '1'}</div>
                <span>Room & Dates</span>
              </div>
              <div className="step-connector" />
              <div className={`step-item ${step >= 2 ? 'active' : ''}`}>
                <div className="step-circle">2</div>
                <span>Guest Information</span>
              </div>
            </div>

            {result && step === 1 && (
              <div className="result-msg error animate-in">
                ⚠️ {result.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="booking-form-new">

              {/* STEP 1 — Room & Dates */}
              {step === 1 && (
                <div className="form-card animate-in">
                  <div className="form-card-header">
                    <span className="form-card-icon">🏠</span>
                    <div>
                      <h2>Select Room & Dates</h2>
                      <p className="form-subtext">Choose your room type and stay duration.</p>
                    </div>
                  </div>

                  {/* Room Picker */}
                  <div className="form-group">
                    <label>Room Type <span className="req">*</span></label>
                    <div className="room-picker-new">
                      {ROOMS.map((r) => {
                        const count = availability[r.name];
                        const hasDbData = Object.keys(availability).length > 0;
                        const isSoldOut = hasDbData && count === 0;
                        return (
                          <button
                            type="button"
                            key={r.key}
                            className={`room-card-new ${form.roomType === r.name ? 'active' : ''} ${isSoldOut ? 'sold-out' : ''}`}
                            onClick={() => !isSoldOut && pickRoom(r.name)}
                            disabled={isSoldOut}
                          >
                            <div className="rc-top">
                              <span className="rc-icon">{r.icon}</span>
                              <div className="rc-badge-wrap">
                                {isSoldOut ? (
                                  <span className="rc-badge sold-out">Sold Out</span>
                                ) : count > 0 ? (
                                  <span className="rc-badge available">{count} Available</span>
                                ) : (
                                  <span className="rc-badge available">Available</span>
                                )}
                              </div>
                            </div>
                            <div className="rc-info">
                              <strong>{r.name}</strong>
                              <span className="rc-type">{r.type}</span>
                            </div>
                            <div className="rc-price">
                              <span className="rc-rate">₹ {getPrice(r).toLocaleString('en-IN')}</span>
                              <span className="rc-per">/ night</span>
                            </div>
                            {form.roomType === r.name && (
                              <span className="rc-check">✓</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Availability Calendar Integration */}
                  {form.roomType && (
                    <div className="availability-calendar-section animate-in">
                      <div className="calendar-header-custom">
                        <h3><span className="cal-icon">🗓️</span> Availability for {form.roomType}</h3>
                        <div className="calendar-nav-custom">
                          <button type="button" onClick={() => {
                            if (calendarMonth === 1) {
                              setCalendarMonth(12);
                              setCalendarYear(calendarYear - 1);
                            } else {
                              setCalendarMonth(calendarMonth - 1);
                            }
                          }} disabled={calendarYear === new Date().getFullYear() && calendarMonth === new Date().getMonth() + 1}>‹</button>
                          <span>{new Date(calendarYear, calendarMonth - 1).toLocaleString('en-IN', { month: 'long', year: 'numeric' })}</span>
                          <button type="button" onClick={() => {
                            if (calendarMonth === 12) {
                              setCalendarMonth(1);
                              setCalendarYear(calendarYear + 1);
                            } else {
                              setCalendarMonth(calendarMonth + 1);
                            }
                          }}>›</button>
                        </div>
                      </div>
                      
                      <div className="calendar-grid-custom">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                          <div key={d} className="calendar-day-name">{d}</div>
                        ))}
                        {/* Empty slots for first week */}
                        {Array.from({ length: new Date(calendarYear, calendarMonth - 1, 1).getDay() }).map((_, i) => (
                          <div key={`empty-${i}`} className="calendar-day-empty" />
                        ))}
                        {/* Days of month */}
                        {Array.from({ length: new Date(calendarYear, calendarMonth, 0).getDate() }).map((_, i) => {
                          const day = i + 1;
                          const avail = dailyAvailability[day];
                          const date = new Date(calendarYear, calendarMonth - 1, day);
                          const isPast = date < new Date().setHours(0,0,0,0);
                          const ds = `${calendarYear}-${String(calendarMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                          const isSelected = form.checkIn === ds || form.checkOut === ds;
                          
                          const statusClass = avail === 0 ? 'full' : (avail === 1 ? 'limited' : 'available');
                          const isActuallyPast = isPast; // already calculated above

                          return (
                            <div 
                              key={day} 
                              className={`calendar-day ${isActuallyPast ? 'past' : statusClass} ${isSelected ? 'selected' : ''}`}
                              onClick={() => {
                                if (!isActuallyPast && (avail === undefined || avail > 0)) {
                                  if (!form.checkIn || (form.checkIn && form.checkOut)) {
                                    setForm(prev => ({ ...prev, checkIn: ds, checkOut: '' }));
                                  } else {
                                    if (new Date(ds) > new Date(form.checkIn)) {
                                      setForm(prev => ({ ...prev, checkOut: ds }));
                                    } else {
                                      setForm(prev => ({ ...prev, checkIn: ds, checkOut: '' }));
                                    }
                                  }
                                }
                              }}
                            >
                              <span className="day-num">{day}</span>
                              {!isActuallyPast && (
                                <span className="day-avail">
                                  {avail === 0 ? 'Full' : (avail === undefined ? 'Available' : 'Available')}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <div className="calendar-legend">
                        <div className="legend-item"><span className="legend-dot available" /> Available</div>
                        <div className="legend-item"><span className="legend-dot full" /> Sold Out</div>
                      </div>
                    </div>
                  )}

                  {/* Dates */}
                  <div className="form-row-2">
                    <div className="form-group">
                      <label>
                        <span className="label-icon">📅</span> Check-in Date <span className="req">*</span>
                      </label>
                      <div className="input-with-action">
                        <input
                          name="checkIn"
                          value={form.checkIn}
                          onChange={handleChange}
                          type="date"
                          min={today}
                          required
                          className="input-styled"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>
                        <span className="label-icon">📅</span> Check-out Date <span className="req">*</span>
                      </label>
                      <div className="input-with-action">
                        <input
                          name="checkOut"
                          value={form.checkOut}
                          onChange={handleChange}
                          type="date"
                          min={form.checkIn || today}
                          required
                          className="input-styled"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Nights & Clear */}
                  <div className="dates-feedback-row">
                    {nights > 0 ? (
                      <div className="nights-badge">
                        🌙 {nights} Night{nights > 1 ? 's' : ''} stay
                      </div>
                    ) : <div />}
                    {(form.checkIn || form.checkOut) && (
                      <button type="button" className="btn-clear-dates" onClick={clearDates}>
                        ✕ Clear Dates
                      </button>
                    )}
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label>Number of Rooms</label>
                      <input
                        name="rooms"
                        value={form.rooms}
                        onChange={handleChange}
                        type="number"
                        min="1"
                        max="20"
                        className="input-styled"
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
                        max="50"
                        className="input-styled"
                      />
                    </div>
                  </div>

                  <button type="button" className="btn-continue" onClick={nextStep}>
                    Continue to Guest Details →
                  </button>
                </div>
              )}

              {/* STEP 2 — Guest Information */}
              {step === 2 && (
                <div className="form-card animate-in">
                  <div className="form-card-header">
                    <span className="form-card-icon">👤</span>
                    <div>
                      <h2>Guest Information</h2>
                      <p className="form-subtext">All fields marked with <span className="req">*</span> are required.</p>
                    </div>
                  </div>

                  {/* Name Row */}
                  <div className="form-row-name">
                    <div className="form-group salutation-group">
                      <label>Salutation <span className="req">*</span></label>
                      <select name="salutation" value={form.salutation} onChange={handleChange} className="input-styled">
                        <option>Mr.</option>
                        <option>Ms.</option>
                        <option>Mrs.</option>
                        <option>Dr.</option>
                        <option>Prof.</option>
                      </select>
                    </div>
                    <div className="form-group" style={{flex: 1}}>
                      <label>First Name <span className="req">*</span></label>
                      <input
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        placeholder="First name"
                        className="input-styled"
                        required
                      />
                    </div>
                    <div className="form-group" style={{flex: 1}}>
                      <label>Last Name</label>
                      <input
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        placeholder="Last name"
                        className="input-styled"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="form-group">
                    <label>
                      <span className="label-icon">📱</span> Mobile Number <span className="req">*</span>
                    </label>
                    <div className="phone-input-wrap">
                      <span className="phone-country-code">🇮🇳 +91</span>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="XXXXX XXXXX"
                        className="input-styled phone-number-input"
                        required
                        type="tel"
                        maxLength={10}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="form-group">
                    <label>
                      <span className="label-icon">✉️</span> Email Address
                    </label>
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      type="email"
                      placeholder="your@email.com"
                      className="input-styled"
                    />
                    <p className="field-hint">Your booking confirmation will be sent to this email address.</p>
                  </div>

                  {/* Special Requests — Expandable */}
                  <div className="form-group">
                    <button
                      type="button"
                      className="special-req-toggle"
                      onClick={() => setShowSpecialReq(!showSpecialReq)}
                    >
                      <span>Special Requests / Notes</span>
                      <span className={`toggle-icon ${showSpecialReq ? 'open' : ''}`}>
                        {showSpecialReq ? '−' : '+'}
                      </span>
                    </button>
                    {showSpecialReq && (
                      <div className="special-req-body">
                        <textarea
                          name="message"
                          value={form.message}
                          onChange={handleChange}
                          rows="3"
                          placeholder="E.g. early check-in request, extra bed needed, any allergies..."
                          className="input-styled"
                        />
                      </div>
                    )}
                  </div>

                  {/* Policy Checkbox */}
                  <div className="policy-section">
                    <label className="policy-label">
                      <input
                        type="checkbox"
                        checked={policyChecked}
                        onChange={(e) => setPolicyChecked(e.target.checked)}
                        className="policy-check"
                      />
                      <span>
                        I agree to the <strong>booking policies</strong> of BSS Residency. I understand that the booking is subject to confirmation via WhatsApp and payment is to be made at the property.
                      </span>
                    </label>
                  </div>

                  <div className="form-actions-new">
                    <button
                      type="button"
                      className="btn-back-new"
                      onClick={() => setStep(1)}
                    >
                      ← Back
                    </button>
                    {result && step === 2 && (
                      <div className={`result-msg ${result.success ? 'success' : 'error'}`} style={{ marginBottom: '1rem', width: '100%' }}>
                        {result.success ? '✅' : '⚠️'} {result.message}
                      </div>
                    )}
                    <button type="submit" className="btn-book-now" disabled={loading}>
                      {loading ? (
                        <>
                          <span className="btn-spinner" />Submitting...
                        </>
                      ) : (
                        <>📩 Confirm Booking</>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* RIGHT COLUMN — Sticky Sidebar */}
          <aside className="booking-sidebar-new">

            {/* Hotel Info Card */}
            <div className="hotel-info-card">
              <div className="hotel-card-brand">
                <span className="hotel-logo-icon">🏨</span>
                <div>
                  <h3>BSS Residency</h3>
                  <p>Courtallam, Tamil Nadu</p>
                </div>
              </div>
              <div className="hotel-contact-grid">
                <div className="hotel-contact-item">
                  <span className="hci-icon">📍</span>
                  <span>{CONTACT.addressLine1}, {CONTACT.addressLine2}</span>
                </div>
                <div className="hotel-contact-item">
                  <span className="hci-icon">📞</span>
                  <a href={`tel:${CONTACT.phonePrimary.replace(/\s/g, '')}`}>
                    {CONTACT.phonePrimary}
                  </a>
                </div>
                <div className="hotel-contact-item">
                  <span className="hci-icon">💬</span>
                  <a href={waLink('Hello BSS Residency!')} target="_blank" rel="noreferrer">
                    WhatsApp Us
                  </a>
                </div>
              </div>
            </div>

            {/* Booking Summary Card */}
            <div className="summary-card-new">
              <h3 className="summary-title">
                <span>Booking Summary</span>
                {step === 2 && form.checkIn && (
                  <button
                    type="button"
                    className="change-dates-btn"
                    onClick={() => setStep(1)}
                  >
                    Change
                  </button>
                )}
              </h3>

              {/* Dates */}
              <div className="summary-dates">
                <div className="summary-date-box">
                  <span className="sdb-label">Check-in</span>
                  <span className="sdb-value">{formatDate(form.checkIn)}</span>
                </div>
                <div className="summary-nights-badge">
                  {nights > 0 ? `${nights}N` : '—'}
                </div>
                <div className="summary-date-box">
                  <span className="sdb-label">Check-out</span>
                  <span className="sdb-value">{formatDate(form.checkOut)}</span>
                </div>
              </div>

              {/* Room and Guests */}
              <div className="summary-details">
                <div className="sd-row">
                  <span>Room Type</span>
                  <strong>{form.roomType || '—'}</strong>
                </div>
                <div className="sd-row">
                  <span>Rooms</span>
                  <strong>{form.rooms}</strong>
                </div>
                <div className="sd-row">
                  <span>Guests</span>
                  <strong>{form.guests}</strong>
                </div>
              </div>

              {/* Price Breakdown */}
              {selectedRoom && nights > 0 && (
                <div className="price-breakdown">
                  <div className="pb-header">Price Breakdown</div>
                  <div className="pb-row">
                    <span>₹ {getPrice(selectedRoom).toLocaleString('en-IN')} × {nights} night{nights > 1 ? 's' : ''} × {form.rooms} room{form.rooms > 1 ? 's' : ''}</span>
                    <span>₹ {roomCharges.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="pb-row">
                    <span>GST</span>
                    <span>₹ {gstAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="pb-total-row">
                    <span>Total</span>
                    <strong>₹ {totalPrice.toLocaleString('en-IN')}</strong>
                  </div>
                  <p className="pb-note">Inclusive of all taxes. Payment at property.</p>
                </div>
              )}

              {(!selectedRoom || !nights) && (
                <div className="summary-placeholder">
                  <span>💡 Select a room and dates to see pricing</span>
                </div>
              )}
            </div>

            {/* Policy Info Card */}
            <div className="policy-info-card">
              <h4>📋 Booking Policies</h4>
              <ul>
                <li>✅ Flexible Check-in / Check-out</li>
                <li>✅ Extra Bed Available (on request)</li>
                <li>✅ Confirmation via WhatsApp</li>
                <li>✅ Payment at property</li>
                <li>ℹ️ Valid ID proof required at check-in</li>
              </ul>
            </div>

            {/* Quick Booking Card */}
            <div className="quick-book-card">
              <h4>📞 Need Help?</h4>
              <p>Prefer to book over the phone? Call or WhatsApp us directly.</p>
              <div className="quick-btns">
                <a
                  href={waLink('Hello BSS Residency! I would like to make a booking.')}
                  className="qb-btn whatsapp"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="fa-brands fa-whatsapp" /> WhatsApp
                </a>
                <a
                  href={`tel:${CONTACT.phonePrimary.replace(/\s/g, '')}`}
                  className="qb-btn call"
                >
                  📞 Call Now
                </a>
              </div>
            </div>

          </aside>
        </div>
      </section>
    </main>
    </>
  );
}
