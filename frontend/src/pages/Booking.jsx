import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Users, User, Phone, Mail, HelpCircle, Shield, Check, Loader2, ArrowRight, Wallet, CheckCircle, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const initForm = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  roomType: 'non-ac',
  checkIn: '',
  checkOut: '',
  guests: 1,
  rooms: 1,
  message: '',
};

const ROOMS = [
  {
    key: 'non-ac',
    name: 'non-ac',
    label: 'Non-AC Room',
    icon: '⛰️',
    type: 'Single & Double Beds',
    seasonPrice: 2000,
    nonSeasonPrice: 1500,
    desc: 'Budget-friendly comfort with majestic nature view near waterfalls.',
  },
  {
    key: 'ac',
    name: 'ac',
    label: 'AC Room',
    icon: '❄️',
    type: 'Air Conditioned Stay',
    seasonPrice: 2500,
    nonSeasonPrice: 2000,
    desc: 'Modern climate-controlled rooms offering premium amenities & superior comfort.',
  },
  {
    key: 'suite',
    name: 'suite',
    label: 'Suite Room',
    icon: '👑',
    type: 'Luxury Family Suite',
    seasonPrice: 12000,
    nonSeasonPrice: 10000,
    desc: 'Exclusive, spacious presidential suites with a grand dining hall and scenic mountain view.',
  }
];

export default function Booking() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState(initForm);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [step, setStep] = useState(1);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [isSeason, setIsSeason] = useState(false);
  const [policyChecked, setPolicyChecked] = useState(false);
  const [availability, setAvailability] = useState({});

  // Sync room type from URL query param if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roomParam = params.get('room');
    if (roomParam && ROOMS.find(r => r.key === roomParam)) {
      setForm(prev => ({ ...prev, roomType: roomParam }));
    }
  }, [location]);

  // Fetch season toggle and basic availability from backend
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/settings');
        if (res.data.success) {
          setIsSeason(res.data.settings?.isSeason === true);
        }
      } catch (err) {
        console.error('Failed to load seasonal configuration:', err);
      }
    };

    const fetchAvailability = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/booking/availability');
        if (res.data.success) {
          setAvailability(res.data.availability || {});
        }
      } catch (err) {
        console.error('Failed to load availability metrics:', err);
      }
    };

    fetchSettings();
    fetchAvailability();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (result) setResult(null);
  };

  const selectRoomType = (roomKey) => {
    setForm({ ...form, roomType: roomKey });
    if (result) setResult(null);
  };

  const nights = useMemo(() => {
    if (!form.checkIn || !form.checkOut) return 0;
    const start = new Date(form.checkIn);
    const end = new Date(form.checkOut);
    const diff = Math.round((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  }, [form.checkIn, form.checkOut]);

  const activeRoom = useMemo(() => ROOMS.find(r => r.key === form.roomType), [form.roomType]);

  const roomRate = useMemo(() => {
    if (!activeRoom) return 1500;
    return isSeason ? activeRoom.seasonPrice : activeRoom.nonSeasonPrice;
  }, [activeRoom, isSeason]);

  const roomCharges = useMemo(() => {
    return roomRate * nights * (Number(form.rooms) || 1);
  }, [roomRate, nights, form.rooms]);

  const gstAmount = useMemo(() => Math.round(roomCharges * 0.12), [roomCharges]);
  const totalPrice = useMemo(() => roomCharges + gstAmount, [roomCharges, gstAmount]);

  const today = new Date().toISOString().split('T')[0];

  const validateStep1 = () => {
    if (!form.roomType || !form.checkIn || !form.checkOut) {
      setResult({ success: false, message: 'Please select a room category and both check-in/out dates.' });
      return false;
    }
    if (new Date(form.checkIn) >= new Date(form.checkOut)) {
      setResult({ success: false, message: 'Your check-out date must be strictly after the check-in date.' });
      return false;
    }
    setResult(null);
    return true;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // 1. Submit Request via standard "Pay at Resort" flow
  const handleRequestBooking = async (e) => {
    e.preventDefault();
    if (!form.firstName || !form.phone) {
      setResult({ success: false, message: 'Please enter your guest name and phone number.' });
      return;
    }
    if (!policyChecked) {
      setResult({ success: false, message: 'You must agree to the SM Golden Resorts booking policies to proceed.' });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const fullName = `${form.firstName} ${form.lastName}`.trim();
      const payload = {
        name: fullName,
        phone: form.phone,
        email: form.email || '',
        roomType: form.roomType,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        guests: Number(form.guests) || 1,
        rooms: Number(form.rooms) || 1,
        message: form.message || ''
      };

      const res = await axios.post('http://localhost:5000/api/booking', payload);
      if (res.data.success) {
        setConfirmedBooking({
          ...res.data.booking,
          nights,
          roomCharges,
          gstAmount,
          totalPrice,
          paymentStatus: 'Pending',
          advancePaid: 0
        });
      } else {
        setResult({ success: false, message: res.data.message || 'Failed to submit stay reservation request.' });
      }
    } catch (err) {
      setResult({ success: false, message: err.response?.data?.message || 'Server error. Please review room capacities and try again.' });
    } finally {
      setLoading(false);
    }
  };

  // 2. Pay Advance (₹20 sandbox/live test) via Razorpay checkout
  const handlePayAdvanceBooking = async () => {
    if (!form.firstName || !form.phone) {
      setResult({ success: false, message: 'Please enter your guest name and phone number.' });
      return;
    }
    if (!policyChecked) {
      setResult({ success: false, message: 'You must agree to the SM Golden Resorts booking policies to proceed.' });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const testAdvance = 20; // Fixed ₹20 for sandbox live checking

      // A. Create Razorpay order on MERN backend
      const orderRes = await axios.post('http://localhost:5000/api/booking/create-order', {
        amount: testAdvance
      });

      if (!orderRes.data.success) {
        throw new Error('Failed to communicate with payment gateway order endpoint.');
      }

      const { order_id } = orderRes.data;

      // B. Load Razorpay script options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_live_SptqBPCmbCGB7n', // Your Live/Test Key ID
        amount: testAdvance * 100,
        currency: "INR",
        name: "SM Golden Resorts",
        description: `Advance Stay Payment for ${activeRoom.label}`,
        image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=200&auto=format&fit=crop",
        order_id: order_id,
        handler: async (response) => {
          try {
            setLoading(true);
            const fullName = `${form.firstName} ${form.lastName}`.trim();
            const verificationPayload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingData: {
                name: fullName,
                email: form.email || '',
                phone: form.phone,
                checkIn: form.checkIn,
                checkOut: form.checkOut,
                roomType: form.roomType,
                rooms: Number(form.rooms) || 1,
                guests: Number(form.guests) || 1,
                message: form.message || ''
              }
            };

            const verifyRes = await axios.post('http://localhost:5000/api/booking/verify-payment', verificationPayload);
            if (verifyRes.data.success) {
              setConfirmedBooking({
                ...verifyRes.data.booking,
                nights,
                roomCharges,
                gstAmount,
                totalPrice,
                paymentStatus: 'Completed',
                advancePaid: testAdvance
              });
            } else {
              setResult({ success: false, message: 'Razorpay payment signature verification failed. Please contact us.' });
            }
          } catch (verifyErr) {
            console.error('Signature Verification Error:', verifyErr);
            setResult({ success: false, message: 'Failed to verify transaction. Please contact resort owner S. Murugan with Payment ID.' });
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email || '',
          contact: form.phone
        },
        theme: {
          color: "#d4af37"
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          }
        }
      };

      if (!window.Razorpay) {
        throw new Error('Payment gateway script failed to load. Please disable ad-blockers, reload, and try again.');
      }

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (errResponse) {
        setResult({ success: false, message: errResponse.error.description || 'Transaction declined by bank gateway.' });
        setLoading(false);
      });
      rzp.open();

    } catch (err) {
      console.error('Razorpay Init Error:', err);
      setResult({ success: false, message: err.message || 'Payment system initialization failed.' });
      setLoading(false);
    }
  };

  // --- SUCCESS BOOKING SCREEN ---
  if (confirmedBooking) {
    const bookingId = confirmedBooking.bookingId || '000000';
    const waMsg = `Hello SM Golden Resorts! 🙏\n\nI just submitted a stay booking request.\nBooking ID: #${bookingId}\nName: ${confirmedBooking.name}\nRoom Type: ${confirmedBooking.roomType.toUpperCase()}\nCheck-in: ${formatDate(confirmedBooking.checkIn)}\nCheck-out: ${formatDate(confirmedBooking.checkOut)}\n\nStay details registered. Please verify!`;
    const waLink = `https://wa.me/919443710420?text=${encodeURIComponent(waMsg)}`;

    return (
      <div className="booking-page section-padding">
        <div className="container">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="glass-panel booking-success-card text-center"
          >
            <CheckCircle size={80} className="gold-text success-check-icon" />
            <h2>Reservation Received!</h2>
            <p className="success-tagline">Your stay details have been saved securely under Booking ID: <strong>#{bookingId}</strong></p>
            
            <div className="success-grid-breakdown">
              {/* Payment Box */}
              <div className="payment-checkout-card success-card-glow">
                {confirmedBooking.paymentStatus === 'Completed' ? (
                  <>
                    <div className="pc-badge success-label">Verified Online Payment ✅</div>
                    <h3>Advance Paid: ₹{confirmedBooking.advancePaid || 20}</h3>
                    <p>Thank you! Your advance transaction has been verified successfully via Razorpay.</p>
                    <small>Payment ID: {confirmedBooking.razorpayPaymentId}</small>
                  </>
                ) : (
                  <>
                    <div className="pc-badge pending-label">Pay at Resort / Cash ⏳</div>
                    <h3>Advance Paid: ₹0</h3>
                    <p>Stay reservation requested without immediate deposit. Balance is due at check-in.</p>
                  </>
                )}
              </div>

              {/* Booking Specs */}
              <div className="success-specs-details">
                <div className="spec-row"><span>Lead Guest:</span><strong>{confirmedBooking.name}</strong></div>
                <div className="spec-row"><span>Room Category:</span><strong className="uppercase">{confirmedBooking.roomType} Room</strong></div>
                <div className="spec-row"><span>Check-in Date:</span><strong>{formatDate(confirmedBooking.checkIn)}</strong></div>
                <div className="spec-row"><span>Check-out Date:</span><strong>{formatDate(confirmedBooking.checkOut)}</strong></div>
                <div className="spec-row"><span>Stay Nights:</span><strong>{confirmedBooking.nights} Night(s)</strong></div>
                <div className="spec-row"><span>Nights Total:</span><strong>₹{(confirmedBooking.totalPrice || totalPrice).toLocaleString('en-IN')}</strong></div>
              </div>
            </div>

            <div className="success-next-steps">
              <p>📍 <strong>What's next?</strong> Save your Booking ID above. We recommend completing our secure <strong>pre-arrival online check-in</strong> to register guest ID proofs and skip the front desk registration lines on arrival!</p>
            </div>

            <div className="success-actions-row">
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-primary wa-btn-success">
                📱 Follow Up on WhatsApp
              </a>
              <Link to={`/booking/checkin/${bookingId}`} className="btn-outline checkin-btn-success">
                ⚡ Express Check-in Online
              </Link>
              <button className="btn-outline" onClick={() => { setConfirmedBooking(null); setStep(1); setForm(initForm); setPolicyChecked(false); }}>
                Book Another Stay
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // --- BOOKING FORM WIZARD SCREEN ---
  return (
    <div className="booking-page section-padding">
      <div className="container">
        <div className="section-header text-center">
          <span className="gold-text uppercase">Luxury Courtallam Lodging</span>
          <h2>Book Your Nature Retreat</h2>
          <p className="subtitle-desc">Complete your booking in 2 simple steps. Connect with nature and waterfalls in absolute premium comfort.</p>
        </div>

        {/* Steps bar indicator */}
        <div className="booking-steps-indicator">
          <div className={`step-node ${step >= 1 ? 'active' : ''} ${step > 1 ? 'done' : ''}`}>
            <div className="node-num">{step > 1 ? '✓' : '1'}</div>
            <span>Room & Dates</span>
          </div>
          <div className="node-connector" />
          <div className={`step-node ${step >= 2 ? 'active' : ''}`}>
            <div className="node-num">2</div>
            <span>Guest Information</span>
          </div>
        </div>

        {result && (
          <div className="booking-error-notification">
            <span>⚠️</span>
            <p>{result.message}</p>
          </div>
        )}

        <div className="grid booking-layout-grid">
          {/* Main Booking Panel */}
          <div className="glass-panel booking-form-panel">
            {step === 1 ? (
              // STEP 1: Select Room and Dates
              <div className="wizard-step-content">
                <div className="step-section-header">
                  <span className="step-sec-icon">🏠</span>
                  <div>
                    <h3>Select Room Category & Stay Dates</h3>
                    <p>We host 11 premium rooms with standard capacities.</p>
                  </div>
                </div>

                {/* Rooms Picker */}
                <div className="form-group room-picker-section">
                  <label className="picker-label">Available Room Types</label>
                  <div className="rooms-custom-picker">
                    {ROOMS.map(r => {
                      const count = availability[r.name];
                      const isSelected = form.roomType === r.name;
                      const isSoldOut = count === 0;

                      return (
                        <div 
                          key={r.key} 
                          className={`custom-room-card ${isSelected ? 'active' : ''} ${isSoldOut ? 'sold-out' : ''}`}
                          onClick={() => !isSoldOut && selectRoomType(r.name)}
                        >
                          <div className="crc-header">
                            <span className="crc-icon">{r.icon}</span>
                            {isSoldOut ? (
                              <span className="availability-tag sold-out">Sold Out</span>
                            ) : count !== undefined ? (
                              <span className="availability-tag available">{count} Available</span>
                            ) : (
                              <span className="availability-tag available">Available</span>
                            )}
                          </div>
                          <div className="crc-body">
                            <h4>{r.label}</h4>
                            <p className="crc-sub">{r.type}</p>
                            <p className="crc-desc">{r.desc}</p>
                          </div>
                          <div className="crc-footer">
                            <span className="rate-value">₹{(isSeason ? r.seasonPrice : r.nonSeasonPrice).toLocaleString()}</span>
                            <span className="rate-per">/ night</span>
                          </div>
                          {isSelected && <span className="crc-check-badge">✓</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Date Selection */}
                <div className="grid-2-col">
                  <div className="form-group">
                    <label><Calendar size={16} /> Check-in Date</label>
                    <input 
                      type="date" 
                      name="checkIn" 
                      min={today}
                      value={form.checkIn} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label><Calendar size={16} /> Check-out Date</label>
                    <input 
                      type="date" 
                      name="checkOut" 
                      min={form.checkIn || today}
                      value={form.checkOut} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                </div>

                {/* Rooms and Guests Count */}
                <div className="grid-2-col" style={{ marginTop: '20px' }}>
                  <div className="form-group">
                    <label><Users size={16} /> Number of Rooms</label>
                    <input 
                      type="number" 
                      name="rooms" 
                      min="1" 
                      max="11" 
                      value={form.rooms} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div className="form-group">
                    <label><Users size={16} /> Total Guests</label>
                    <input 
                      type="number" 
                      name="guests" 
                      min="1" 
                      max="80" 
                      value={form.guests} 
                      onChange={handleChange} 
                    />
                  </div>
                </div>

                {nights > 0 && (
                  <div className="nights-feedback-badge">
                    🌙 Selected stay duration: <strong>{nights} Night{nights > 1 ? 's' : ''}</strong>
                  </div>
                )}

                <button type="button" className="btn-primary w-full next-step-btn" onClick={handleNextStep}>
                  Continue to Guest Details <ArrowRight size={18} />
                </button>
              </div>
            ) : (
              // STEP 2: Guest Details
              <div className="wizard-step-content">
                <div className="step-section-header">
                  <span className="step-sec-icon">👤</span>
                  <div>
                    <h3>Guest Information & Checkout</h3>
                    <p>All details are processed securely and encrypted.</p>
                  </div>
                </div>

                <div className="grid-2-col">
                  <div className="form-group">
                    <label><User size={16} /> First Name <span className="req">*</span></label>
                    <input 
                      type="text" 
                      name="firstName" 
                      placeholder="e.g. Santhosh" 
                      value={form.firstName} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label><User size={16} /> Last Name</label>
                    <input 
                      type="text" 
                      name="lastName" 
                      placeholder="e.g. Murugan" 
                      value={form.lastName} 
                      onChange={handleChange} 
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: '20px' }}>
                  <label><Phone size={16} /> Mobile Number (WhatsApp preferred) <span className="req">*</span></label>
                  <div className="phone-prefix-wrap">
                    <span className="country-prefix">🇮🇳 +91</span>
                    <input 
                      type="tel" 
                      name="phone" 
                      maxLength="10"
                      placeholder="e.g. 9443710420" 
                      value={form.phone} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: '20px' }}>
                  <label><Mail size={16} /> Email Address (Optional)</label>
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="e.g. yourname@gmail.com" 
                    value={form.email} 
                    onChange={handleChange} 
                  />
                  <small className="help-text">Receive your confirmation guest slip directly in your inbox.</small>
                </div>

                <div className="form-group" style={{ marginTop: '20px' }}>
                  <label><MessageSquare size={16} /> Special Requests / Message</label>
                  <textarea 
                    name="message" 
                    rows="3" 
                    placeholder="E.g. Ground floor room preferred, early check-in details, extra beds needed..." 
                    value={form.message} 
                    onChange={handleChange} 
                  />
                </div>

                {/* Policy Agreement */}
                <div className="policy-checkbox-container">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={policyChecked} 
                      onChange={(e) => setPolicyChecked(e.target.checked)} 
                    />
                    <span>I hereby agree to the SM Golden Resorts terms & reservation rules. I understand that my booking is validated through an advance payment or resort manager confirmation.</span>
                  </label>
                </div>

                {/* Dual Booking Buttons */}
                <div className="dual-checkout-actions">
                  <div className="payment-checkout-info-block">
                    <h4>💳 Pay ₹20 Advance Deposit</h4>
                    <p>Confirm reservation instantly via Razorpay live transaction. Balance is payable at checkout.</p>
                    <button 
                      type="button" 
                      className="btn-primary pay-advance-btn w-full"
                      onClick={handlePayAdvanceBooking}
                      disabled={loading}
                    >
                      {loading ? <Loader2 className="animate-spin" /> : <><Wallet size={18} /> Confirm & Pay Advance</>}
                    </button>
                  </div>

                  <div className="payment-checkout-info-block outline-block">
                    <h4>⏳ Cash / Pay at Resort</h4>
                    <p>Request reservation without immediate payment. Resort staff will follow up via phone to confirm.</p>
                    <button 
                      type="button" 
                      className="btn-outline w-full request-stay-btn"
                      onClick={handleRequestBooking}
                      disabled={loading}
                    >
                      {loading ? <Loader2 className="animate-spin" /> : 'Request Stay Booking'}
                    </button>
                  </div>
                </div>

                <button type="button" className="btn-outline back-step-btn w-full" onClick={() => setStep(1)} style={{ marginTop: '20px' }}>
                  ← Modify Stay Dates & Room Category
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Dynamic Reservation Summary Panel */}
          <div className="booking-summary-aside sticky-aside">
            <div className="glass-panel summary-panel-card">
              <h3>Stay Summary</h3>
              
              <div className="summary-breakdown-details">
                <div className="summary-row">
                  <span>Selected Category</span>
                  <strong className="uppercase gold-text">{activeRoom?.label}</strong>
                </div>
                <div className="summary-row">
                  <span>Room Price</span>
                  <strong>₹{roomRate.toLocaleString()}/night</strong>
                </div>
                <div className="summary-row">
                  <span>Duration</span>
                  <strong>{nights} Night{nights > 1 ? 's' : ''}</strong>
                </div>
                <div className="summary-row">
                  <span>Room Units</span>
                  <strong>{form.rooms} Room(s)</strong>
                </div>
                
                <div className="summary-divider"></div>
                
                <div className="summary-row">
                  <span>Room charges</span>
                  <span>₹{roomCharges.toLocaleString()}</span>
                </div>
                <div className="summary-row">
                  <span>Luxury GST (12%)</span>
                  <span>₹{gstAmount.toLocaleString()}</span>
                </div>
                
                <div className="summary-divider"></div>
                
                <div className="summary-row total-price-row">
                  <span>Total Charges</span>
                  <strong className="gold-text price-total">₹{totalPrice.toLocaleString()}</strong>
                </div>
              </div>

              <div className="summary-guarantee-badge">
                <Shield size={18} className="gold-text" />
                <div>
                  <h5>100% Secure Checkout</h5>
                  <p>Flexible cancellation up to 24 hours prior to check-in.</p>
                </div>
              </div>

              {/* Status Tracking Link */}
              <div className="status-track-promo">
                <Link to="/booking/status" className="track-link">
                  🔍 Have a booking already? Click here to Track Stay Status & Complete Online Check-in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .booking-page { background: var(--bg-body); min-height: 100vh; padding-top: 100px; }
        .booking-page .section-header h2 { font-style: italic; }
        .booking-page .gold-text { color: var(--gold-accent); font-weight: 700; font-size: 0.82rem; letter-spacing: 1px; text-transform: uppercase; display: block; margin-bottom: 6px; }
        .subtitle-desc { color: var(--text-muted); max-width: 600px; margin: 10px auto 0; font-size: 0.95rem; }

        .booking-steps-indicator { display: flex; align-items: center; justify-content: center; max-width: 420px; margin: 36px auto 44px; }
        .step-node { display: flex; flex-direction: column; align-items: center; gap: 8px; font-size: 0.82rem; color: var(--text-muted); font-weight: 600; }
        .step-node.active { color: var(--blue-accent); }
        .step-node.done { color: #16a34a; }
        .node-num { display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border: 2px solid var(--border-light); border-radius: 50%; background: var(--white); font-weight: 700; color: var(--text-muted); transition: var(--transition); }
        .step-node.active .node-num { border-color: var(--blue-accent); background: rgba(37,99,235,0.06); color: var(--blue-accent); }
        .step-node.done .node-num { border-color: #16a34a; background: #ecfdf5; color: #16a34a; }
        .node-connector { flex: 1; height: 2px; background: var(--border-light); margin: 0 14px; margin-top: -18px; }

        .booking-error-notification { display: flex; align-items: center; gap: 12px; background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; padding: 14px 20px; border-radius: 8px; margin-bottom: 30px; font-size: 0.9rem; }

        .booking-layout-grid { grid-template-columns: 1.6fr 1fr; gap: 32px; align-items: start; }
        .booking-form-panel { padding: 36px; background: var(--white); border-radius: 16px; box-shadow: var(--shadow-card); border: 1px solid var(--border-card); }

        .step-section-header { display: flex; gap: 14px; align-items: flex-start; border-bottom: 1px solid var(--border-light); padding-bottom: 18px; margin-bottom: 28px; }
        .step-sec-icon { font-size: 2rem; line-height: 1; }
        .step-section-header h3 { font-size: 1.25rem; font-weight: 700; color: var(--navy); font-family: var(--font-body); }
        .step-section-header p { color: var(--text-muted); font-size: 0.82rem; margin-top: 2px; }

        .room-picker-section { display: flex; flex-direction: column; gap: 12px; }
        .picker-label { color: var(--text-dark); font-weight: 700; font-size: 0.88rem; margin-bottom: 4px; }
        .rooms-custom-picker { display: flex; flex-direction: column; gap: 12px; }
        .custom-room-card { display: grid; grid-template-columns: auto 1fr auto; gap: 16px; padding: 20px; background: var(--bg-section); border: 2px solid var(--border-light); border-radius: 10px; cursor: pointer; transition: var(--transition); position: relative; overflow: hidden; align-items: center; }
        .custom-room-card:hover { border-color: var(--blue-accent); background: rgba(37,99,235,0.03); }
        .custom-room-card.active { border-color: var(--blue-accent); background: rgba(37,99,235,0.05); box-shadow: 0 0 0 3px rgba(37,99,235,0.12); }
        .custom-room-card.sold-out { opacity: 0.5; cursor: not-allowed; }
        .crc-header { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .crc-icon { font-size: 2.2rem; line-height: 1; }
        .availability-tag { font-size: 0.68rem; font-weight: 700; padding: 2px 8px; border-radius: 20px; text-transform: uppercase; }
        .availability-tag.available { background: #ecfdf5; color: #16a34a; }
        .availability-tag.sold-out { background: #fef2f2; color: #dc2626; }
        .crc-body h4 { font-size: 1.1rem; font-weight: 700; color: var(--text-dark); margin-bottom: 2px; }
        .crc-sub { font-size: 0.78rem; color: var(--blue-accent); font-weight: 600; margin-bottom: 4px; }
        .crc-desc { font-size: 0.82rem; color: var(--text-body); line-height: 1.5; }
        .crc-footer { display: flex; flex-direction: column; text-align: right; }
        .rate-value { font-size: 1.2rem; font-weight: 700; color: #16a34a; }
        .rate-per { font-size: 0.72rem; color: var(--text-muted); }
        .crc-check-badge { position: absolute; top: 10px; right: 12px; font-weight: bold; color: var(--blue-accent); font-size: 1rem; }

        .grid-2-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-group label { display: flex; align-items: center; gap: 6px; font-size: 0.85rem; font-weight: 600; color: var(--text-dark); }
        .form-group input, .form-group textarea { width: 100%; padding: 11px 16px; background: var(--white); border: 1px solid var(--border-light); color: var(--text-dark); border-radius: 8px; font-size: 0.9rem; transition: var(--transition); outline: none; font-family: var(--font-body); }
        .form-group input:focus, .form-group textarea:focus { border-color: var(--blue-accent); box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
        .req { color: #dc2626; }

        .nights-feedback-badge { background: #eff6ff; border: 1px solid #bfdbfe; padding: 12px 18px; border-radius: 8px; font-size: 0.88rem; color: var(--text-dark); text-align: center; margin: 20px 0; }
        .next-step-btn { padding: 13px 0; font-weight: 700; text-transform: uppercase; font-size: 0.9rem; margin-top: 8px; }

        .phone-prefix-wrap { display: flex; align-items: center; background: var(--white); border: 1px solid var(--border-light); border-radius: 8px; overflow: hidden; transition: var(--transition); }
        .phone-prefix-wrap:focus-within { border-color: var(--blue-accent); box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
        .country-prefix { padding: 0 14px; color: var(--text-muted); font-size: 0.88rem; font-weight: 600; border-right: 1px solid var(--border-light); background: var(--bg-section); height: 100%; display: flex; align-items: center; }
        .phone-prefix-wrap input { border: none !important; box-shadow: none !important; }
        .help-text { font-size: 0.75rem; color: var(--text-muted); }

        .policy-checkbox-container { margin: 20px 0; background: var(--bg-section); border: 1px solid var(--border-light); padding: 14px 18px; border-radius: 8px; }
        .checkbox-label { display: flex; gap: 10px; cursor: pointer; align-items: flex-start; }
        .checkbox-label input { width: 16px; height: 16px; margin-top: 3px; accent-color: var(--blue-accent); }
        .checkbox-label span { font-size: 0.82rem; line-height: 1.6; color: var(--text-body); }

        .dual-checkout-actions { display: grid; grid-template-columns: 1.2fr 1fr; gap: 16px; border-top: 1px solid var(--border-light); padding-top: 24px; margin-top: 20px; }
        .payment-checkout-info-block { display: flex; flex-direction: column; gap: 8px; background: #eff6ff; border: 1px solid #bfdbfe; padding: 20px; border-radius: 10px; }
        .payment-checkout-info-block.outline-block { background: var(--bg-section); border: 1px solid var(--border-light); }
        .payment-checkout-info-block h4 { font-size: 0.95rem; font-weight: 700; color: var(--text-dark); font-family: var(--font-body); }
        .payment-checkout-info-block p { font-size: 0.78rem; color: var(--text-body); line-height: 1.5; flex: 1; margin-bottom: 8px; }
        .pay-advance-btn { font-size: 0.82rem; padding: 10px 0; font-weight: 700; text-transform: uppercase; gap: 6px; }
        .request-stay-btn { font-size: 0.82rem; padding: 10px 0; font-weight: 700; text-transform: uppercase; }
        .back-step-btn { padding: 10px 0; font-size: 0.82rem; text-transform: uppercase; font-weight: 600; }

        .sticky-aside { position: sticky; top: 100px; }
        .summary-panel-card { padding: 28px; background: var(--white); border-radius: 16px; box-shadow: var(--shadow-card); border: 1px solid var(--border-card); }
        .summary-panel-card h3 { font-size: 1.15rem; font-weight: 700; color: var(--navy); border-bottom: 1px solid var(--border-light); padding-bottom: 12px; margin-bottom: 20px; font-family: var(--font-body); }
        .summary-breakdown-details { display: flex; flex-direction: column; gap: 12px; }
        .summary-row { display: flex; justify-content: space-between; font-size: 0.88rem; }
        .summary-row span { color: var(--text-muted); }
        .summary-row strong { color: var(--text-dark); }
        .summary-divider { height: 1px; background: var(--border-light); margin: 4px 0; }
        .total-price-row { font-size: 1.1rem; font-weight: 700; margin-top: 4px; }
        .price-total { font-size: 1.5rem; color: #16a34a !important; }
        .summary-row .uppercase.gold-text { color: var(--blue-accent) !important; }

        .summary-guarantee-badge { display: flex; gap: 12px; margin-top: 22px; background: #ecfdf5; padding: 14px 16px; border-radius: 8px; border: 1px solid #a7f3d0; align-items: center; }
        .summary-guarantee-badge h5 { font-size: 0.82rem; font-weight: 700; color: #065f46; margin-bottom: 2px; }
        .summary-guarantee-badge p { font-size: 0.72rem; color: #047857; margin: 0; }
        .summary-guarantee-badge .gold-text { color: #16a34a !important; }

        .status-track-promo { margin-top: 20px; border-top: 1px dashed var(--border-light); padding-top: 16px; text-align: center; }
        .track-link { font-size: 0.78rem; color: var(--blue-accent); font-weight: 600; line-height: 1.5; display: inline-block; text-decoration: underline; }
        .track-link:hover { color: var(--navy); }

        .booking-success-card { padding: 50px 40px; max-width: 800px; margin: 0 auto; background: var(--white); border-radius: 16px; box-shadow: var(--shadow-xl); border: 1px solid var(--border-card); }
        .success-check-icon { margin: 0 auto 20px; color: #16a34a !important; }
        .booking-success-card h2 { font-size: 2.2rem; margin-bottom: 8px; color: var(--navy); }
        .success-tagline { color: var(--text-body); font-size: 1rem; margin-bottom: 30px; }
        .success-grid-breakdown { display: grid; grid-template-columns: 1.2fr 1fr; gap: 24px; align-items: start; margin-bottom: 28px; }
        .success-card-glow { background: #ecfdf5 !important; border: 1px solid #a7f3d0 !important; padding: 24px; border-radius: 10px; text-align: left; display: flex; flex-direction: column; gap: 8px; }
        .success-card-glow h3 { font-size: 1.2rem; font-weight: 700; color: var(--navy); font-family: var(--font-body); }
        .success-card-glow p { font-size: 0.82rem; color: var(--text-body); line-height: 1.6; margin: 0; }
        .success-card-glow small { font-family: monospace; color: var(--text-muted); font-size: 0.72rem; word-break: break-all; }
        .success-label { background: #ecfdf5; color: #16a34a; display: inline-block; width: max-content; padding: 2px 10px; border-radius: 20px; font-size: 0.68rem; font-weight: 700; text-transform: uppercase; }
        .pending-label { background: #fffbeb; color: #d97706; display: inline-block; width: max-content; padding: 2px 10px; border-radius: 20px; font-size: 0.68rem; font-weight: 700; text-transform: uppercase; }
        .pc-badge { margin-bottom: 4px; }
        .success-specs-details { display: flex; flex-direction: column; gap: 12px; text-align: left; background: var(--bg-section); border: 1px solid var(--border-light); padding: 20px; border-radius: 10px; }
        .spec-row { display: flex; justify-content: space-between; font-size: 0.88rem; }
        .spec-row span { color: var(--text-muted); }
        .spec-row strong { color: var(--text-dark); }
        .success-next-steps { background: #eff6ff; border: 1px solid #bfdbfe; padding: 20px; border-radius: 8px; font-size: 0.88rem; line-height: 1.6; text-align: left; margin-bottom: 32px; color: var(--text-body); }
        .success-actions-row { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; }
        .wa-btn-success { background: #25d366 !important; color: white !important; font-weight: 700; border: none !important; box-shadow: 0 4px 15px rgba(37,211,102,0.2) !important; padding: 12px 28px !important; }
        .wa-btn-success:hover { background: #20ba56 !important; }
        .checkin-btn-success { font-weight: 700; padding: 12px 28px !important; }

        @media (max-width: 992px) {
          .booking-layout-grid { grid-template-columns: 1fr; }
          .sticky-aside { position: static; margin-top: 24px; }
          .booking-form-panel { padding: 24px 20px; }
          .custom-room-card { grid-template-columns: 1fr; gap: 10px; text-align: center; }
          .crc-header { align-items: center; }
          .crc-footer { text-align: center; }
          .grid-2-col { grid-template-columns: 1fr; gap: 14px; }
          .dual-checkout-actions { grid-template-columns: 1fr; gap: 16px; }
          .success-grid-breakdown { grid-template-columns: 1fr; }
          .booking-success-card { padding: 32px 20px; }
        }
      `}} />
    </div>
  );
}

