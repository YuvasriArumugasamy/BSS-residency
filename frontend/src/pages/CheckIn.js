import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './CheckIn.css';

const ID_TYPES = ['Aadhaar', 'Driving License', 'Passport', 'Voter ID'];
const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh','Puducherry',
];

export default function CheckIn() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileRef = useRef();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1); // 1=search, 2=form, 3=success
  const [searchId, setSearchId] = useState(id || '');
  const [imagePreview, setImagePreview] = useState('');

  const [form, setForm] = useState({
    fullName: '',
    age: '',
    gender: '',
    address: '',
    city: '',
    state: 'Tamil Nadu',
    pincode: '',
    idType: 'Aadhaar',
    idNumber: '',
    idProofImage: '',
    numberOfGuests: 1,
    guestNames: [''],
    vehicleNumber: '',
    specialRequests: '',
  });

  // Auto-load booking if ID is in URL
  useEffect(() => {
    if (id) fetchBooking(id);
    else setLoading(false);
  }, [id]);

  const fetchBooking = async (bookingId) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/api/bookings/${bookingId}`);
      if (res.data.success) {
        const b = res.data.booking;
        if (b.checkedInOnline) {
          setError('✅ Online check-in already completed for this booking.');
          setLoading(false);
          return;
        }
        if (b.status === 'Cancelled') {
          setError('❌ This booking has been cancelled.');
          setLoading(false);
          return;
        }
        setBooking(b);
        // Pre-fill from booking data
        setForm(prev => ({
          ...prev,
          fullName: b.name || '',
          numberOfGuests: b.guests || 1,
          guestNames: Array(Math.max(1, b.guests - 1)).fill(''),
        }));
        setStep(2);
      }
    } catch {
      setError('Booking not found. Please check your Booking ID.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchId.trim()) return setError('Please enter your Booking ID.');
    fetchBooking(searchId.trim());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleGuestName = (i, val) => {
    const names = [...form.guestNames];
    names[i] = val;
    setForm(prev => ({ ...prev, guestNames: names }));
  };

  const handleGuestCount = (val) => {
    const n = Math.max(1, Math.min(20, Number(val)));
    const names = Array(Math.max(0, n - 1)).fill('').map((_, i) => form.guestNames[i] || '');
    setForm(prev => ({ ...prev, numberOfGuests: n, guestNames: names }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError('ID proof image must be less than 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setForm(prev => ({ ...prev, idProofImage: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName) return setError('Please enter your full name.');
    if (!form.idType || !form.idNumber) return setError('Please select ID type and enter ID number.');
    if (!form.address || !form.city) return setError('Please enter your address details.');

    setSubmitting(true);
    setError('');
    try {
      const bookingId = booking.bookingId || booking._id;
      await api.post(`/api/bookings/${bookingId}/checkin`, form);
      setSuccess(true);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  // --- STEP 1: Booking ID Search ---
  if (step === 1) {
    return (
      <main className="checkin-page">
        <section className="checkin-hero">
          <p className="ci-label">Online Check-in</p>
          <h1>Guest <em>Check-in</em></h1>
          <p>Skip the queue — complete your check-in before arrival</p>
        </section>

        <section className="ci-container">
          <div className="ci-search-card">
            <div className="ci-search-icon">🧾</div>
            <h2>Enter Your Booking ID</h2>
            <p>Find your booking ID in the confirmation message or booking receipt.</p>

            {error && <div className="ci-alert error">{error}</div>}

            <form onSubmit={handleSearch} className="ci-search-form">
              <input
                type="text"
                value={searchId}
                onChange={e => { setSearchId(e.target.value); setError(''); }}
                placeholder="e.g. 123456 or full Booking ID"
                className="ci-input"
                autoFocus
              />
              <button type="submit" className="ci-btn-primary" disabled={loading}>
                {loading ? <span className="ci-spinner" /> : '🔍 Find Booking'}
              </button>
            </form>

            <div className="ci-hint">
              <span>💡 Your Booking ID was shared via WhatsApp when you booked.</span>
            </div>
          </div>

          <div className="ci-features">
            {[
              { icon: '⚡', title: 'Fast Check-in', desc: 'Skip front desk queue on arrival' },
              { icon: '🔒', title: 'Secure', desc: 'Your data is safe and encrypted' },
              { icon: '📱', title: 'Easy Process', desc: 'Takes less than 2 minutes' },
            ].map(f => (
              <div key={f.title} className="ci-feature-card">
                <span className="ci-feat-icon">{f.icon}</span>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    );
  }

  // --- STEP 3: Success ---
  if (step === 3) {
    return (
      <main className="checkin-page">
        <section className="ci-container" style={{ paddingTop: '120px' }}>
          <div className="ci-success-card">
            <div className="ci-success-anim">✅</div>
            <h2>Check-in Complete!</h2>
            <p>Your online check-in is confirmed. See you soon at BSS Residency!</p>
            <div className="ci-success-details">
              <div className="ci-sd-row"><span>Guest</span><strong>{booking?.name}</strong></div>
              <div className="ci-sd-row"><span>Room</span><strong>{booking?.roomType}</strong></div>
              <div className="ci-sd-row"><span>Check-in</span><strong>📅 {formatDate(booking?.checkIn)}</strong></div>
              <div className="ci-sd-row"><span>Check-out</span><strong>📅 {formatDate(booking?.checkOut)}</strong></div>
            </div>
            <div className="ci-success-note">
              <p>🏨 Just walk in — no waiting at reception!</p>
              <p>📍 BSS Residency, Bus Stand, Near Anna Statue, Courtallam</p>
            </div>
            <button className="ci-btn-primary" onClick={() => navigate('/')}>
              🏠 Back to Home
            </button>
          </div>
        </section>
      </main>
    );
  }

  // --- STEP 2: Check-in Form ---
  return (
    <main className="checkin-page">
      <section className="checkin-hero">
        <p className="ci-label">Online Check-in</p>
        <h1>Complete Your <em>Check-in</em></h1>
        <p>Please fill in all details as per your ID proof</p>
      </section>

      <section className="ci-container">
        {/* Booking Summary Banner */}
        {booking && (
          <div className="ci-booking-banner">
            <div className="ci-bb-item">
              <span>Booking ID</span>
              <strong>#{booking.bookingId || booking._id?.toString().slice(-6).toUpperCase()}</strong>
            </div>
            <div className="ci-bb-item">
              <span>Room</span>
              <strong>🛏️ {booking.roomType}</strong>
            </div>
            <div className="ci-bb-item">
              <span>Check-in</span>
              <strong>📅 {formatDate(booking.checkIn)}</strong>
            </div>
            <div className="ci-bb-item">
              <span>Check-out</span>
              <strong>📅 {formatDate(booking.checkOut)}</strong>
            </div>
            <div className="ci-bb-item">
              <span>Guests</span>
              <strong>👥 {booking.guests}</strong>
            </div>
          </div>
        )}

        {error && <div className="ci-alert error">{error}</div>}

        <form onSubmit={handleSubmit} className="ci-form">

          {/* Section 1 — Personal Details */}
          <div className="ci-section">
            <div className="ci-section-header">
              <span className="ci-sec-icon">👤</span>
              <div>
                <h3>Personal Details</h3>
                <p>Enter details as they appear on your ID proof</p>
              </div>
            </div>

            <div className="ci-grid-2">
              <div className="ci-field full">
                <label>Full Name <span className="req">*</span></label>
                <input name="fullName" value={form.fullName} onChange={handleChange}
                  placeholder="As per ID proof" className="ci-input" required />
              </div>
              <div className="ci-field">
                <label>Age</label>
                <input name="age" value={form.age} onChange={handleChange}
                  type="number" min="1" max="120" placeholder="Age" className="ci-input" />
              </div>
              <div className="ci-field">
                <label>Gender</label>
                <select name="gender" value={form.gender} onChange={handleChange} className="ci-input">
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2 — Address */}
          <div className="ci-section">
            <div className="ci-section-header">
              <span className="ci-sec-icon">🏠</span>
              <div>
                <h3>Home Address</h3>
                <p>Your permanent address</p>
              </div>
            </div>

            <div className="ci-grid-2">
              <div className="ci-field full">
                <label>Address <span className="req">*</span></label>
                <input name="address" value={form.address} onChange={handleChange}
                  placeholder="Door No., Street, Area" className="ci-input" required />
              </div>
              <div className="ci-field">
                <label>City <span className="req">*</span></label>
                <input name="city" value={form.city} onChange={handleChange}
                  placeholder="City" className="ci-input" required />
              </div>
              <div className="ci-field">
                <label>State</label>
                <select name="state" value={form.state} onChange={handleChange} className="ci-input">
                  {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="ci-field">
                <label>PIN Code</label>
                <input name="pincode" value={form.pincode} onChange={handleChange}
                  placeholder="6-digit PIN" maxLength={6} className="ci-input" />
              </div>
            </div>
          </div>

          {/* Section 3 — ID Proof */}
          <div className="ci-section">
            <div className="ci-section-header">
              <span className="ci-sec-icon">🪪</span>
              <div>
                <h3>ID Proof</h3>
                <p>Government issued photo ID</p>
              </div>
            </div>

            <div className="ci-grid-2">
              <div className="ci-field">
                <label>ID Type <span className="req">*</span></label>
                <select name="idType" value={form.idType} onChange={handleChange} className="ci-input" required>
                  {ID_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="ci-field">
                <label>ID Number <span className="req">*</span></label>
                <input name="idNumber" value={form.idNumber} onChange={handleChange}
                  placeholder={form.idType === 'Aadhaar' ? 'XXXX XXXX XXXX' : 'ID Number'}
                  className="ci-input" required />
              </div>
              <div className="ci-field full">
                <label>Upload ID Proof Photo</label>
                <div className="ci-upload-area" onClick={() => fileRef.current.click()}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="ID Preview" className="ci-id-preview" />
                  ) : (
                    <>
                      <span className="ci-upload-icon">📷</span>
                      <p>Click to upload photo of your ID</p>
                      <small>JPG/PNG — Max 2MB</small>
                    </>
                  )}
                </div>
                <input type="file" ref={fileRef} accept="image/*" onChange={handleImageUpload}
                  style={{ display: 'none' }} />
                {imagePreview && (
                  <button type="button" className="ci-remove-img"
                    onClick={() => { setImagePreview(''); setForm(p => ({ ...p, idProofImage: '' })); }}>
                    ✕ Remove Image
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Section 4 — Guests */}
          <div className="ci-section">
            <div className="ci-section-header">
              <span className="ci-sec-icon">👨‍👩‍👧‍👦</span>
              <div>
                <h3>Guest Details</h3>
                <p>List all guests staying with you</p>
              </div>
            </div>

            <div className="ci-grid-2">
              <div className="ci-field">
                <label>Total Number of Guests</label>
                <input type="number" value={form.numberOfGuests}
                  onChange={e => handleGuestCount(e.target.value)}
                  min="1" max="20" className="ci-input" />
              </div>
              <div className="ci-field">
                <label>Vehicle Number (Optional)</label>
                <input name="vehicleNumber" value={form.vehicleNumber} onChange={handleChange}
                  placeholder="TN 00 AB 0000" className="ci-input" />
              </div>

              {form.guestNames.length > 0 && (
                <div className="ci-field full">
                  <label>Other Guest Names</label>
                  <div className="ci-guest-names">
                    {form.guestNames.map((g, i) => (
                      <input key={i} value={g} onChange={e => handleGuestName(i, e.target.value)}
                        placeholder={`Guest ${i + 2} name`} className="ci-input" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 5 — Special Requests */}
          <div className="ci-section">
            <div className="ci-section-header">
              <span className="ci-sec-icon">📝</span>
              <div>
                <h3>Special Requests</h3>
                <p>Any additional requirements for your stay</p>
              </div>
            </div>
            <textarea name="specialRequests" value={form.specialRequests} onChange={handleChange}
              rows="3" placeholder="E.g. Extra pillow, early check-in, ground floor room..."
              className="ci-input ci-textarea" />
          </div>

          {/* Declaration */}
          <div className="ci-declaration">
            <p>📋 I hereby declare that all the information provided above is true and accurate. I understand that providing false information may result in cancellation of my booking.</p>
          </div>

          <div className="ci-form-actions">
            <button type="button" className="ci-btn-back" onClick={() => { setStep(1); setBooking(null); }}>
              ← Change Booking
            </button>
            <button type="submit" className="ci-btn-primary" disabled={submitting}>
              {submitting ? <><span className="ci-spinner" /> Submitting...</> : '✅ Complete Check-in'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
