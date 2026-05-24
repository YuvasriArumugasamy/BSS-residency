import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Shield, Clock, FileText, CheckCircle2, ChevronRight, Upload, Trash2, Loader2, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

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
  const fileInputRef = useRef();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1); // 1 = Find Booking, 2 = Check-in Form, 3 = Success
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

  useEffect(() => {
    if (id) {
      fetchBooking(id);
    } else {
      setLoading(false);
    }
  }, [id]);

  const fetchBooking = async (bookingId) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`http://localhost:5000/api/booking/${bookingId}`);
      if (res.data.success) {
        const b = res.data.booking;
        if (b.checkedInOnline) {
          setError('✅ Secure online check-in has already been completed for this stay reservation.');
          setLoading(false);
          return;
        }
        if (b.status === 'Cancelled') {
          setError('❌ This stay reservation has been cancelled.');
          setLoading(false);
          return;
        }
        setBooking(b);
        setForm(prev => ({
          ...prev,
          fullName: b.name || '',
          numberOfGuests: b.guests || 1,
          guestNames: Array(Math.max(0, b.guests - 1)).fill(''),
        }));
        setStep(2);
      }
    } catch (err) {
      setError('Reservation not found. Please review the 6-digit Booking ID.');
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

  const handleGuestNameChange = (i, val) => {
    const names = [...form.guestNames];
    names[i] = val;
    setForm(prev => ({ ...prev, guestNames: names }));
  };

  const handleGuestCountChange = (val) => {
    const count = Math.max(1, Math.min(80, Number(val)));
    const names = Array(Math.max(0, count - 1)).fill('').map((_, i) => form.guestNames[i] || '');
    setForm(prev => ({ ...prev, numberOfGuests: count, guestNames: names }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError('ID proof document photo must be under 2MB.');
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
    if (!form.idType || !form.idNumber) return setError('Please fill in your ID details.');
    if (!form.address || !form.city) return setError('Please enter your home address.');

    setSubmitting(true);
    setError('');
    try {
      const bookingId = booking.bookingId || booking._id;
      await axios.post(`http://localhost:5000/api/booking/${bookingId}/checkin`, form);
      setSuccess(true);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Check-in submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString('en-IN', {
          day: '2-digit', month: 'short', year: 'numeric',
        })
      : '—';

  // Step 1: Find booking
  if (step === 1) {
    return (
      <div className="checkin-page section-padding">
        <div className="container">
          <div className="section-header text-center">
            <span className="gold-text uppercase">Pre-arrival Check-in</span>
            <h2>Guest Check-in</h2>
            <p className="subtitle-desc">Skip the front-desk registration queue. Securely upload ID proof and verify details beforehand for instant room key access.</p>
          </div>

          <div className="glass-panel checkin-search-panel">
            <div className="search-icon-wrap">🧾</div>
            <h3>Verify Booking ID</h3>
            <p>Enter the 6-digit Booking ID associated with your stay at SM Golden Resorts.</p>

            {error && <div className="checkin-alert error">{error}</div>}

            <form onSubmit={handleSearch} className="search-form-ci">
              <input
                type="text"
                value={searchId}
                onChange={e => { setSearchId(e.target.value); setError(''); }}
                placeholder="Enter 6-digit Booking ID (e.g. 917240)"
                className="search-input-ci"
                required
              />
              <button type="submit" className="btn-primary search-btn-ci" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" size={18} /> : 'Verify & Continue'}
              </button>
            </form>
          </div>

          {/* Quick Perks */}
          <div className="checkin-perks-grid">
            <div className="perk-card glass-panel">
              <span className="perk-icon">⚡</span>
              <h4>Express Key Collection</h4>
              <p>Just present your Booking ID on arrival and grab your room keys instantly.</p>
            </div>
            <div className="perk-card glass-panel">
              <span className="perk-icon">🔒</span>
              <h4>Fully Secure & Encrypted</h4>
              <p>Your ID proof photos and contact details are fully encrypted and kept secure.</p>
            </div>
            <div className="perk-card glass-panel">
              <span className="perk-icon">📱</span>
              <h4>Paperless & Contactless</h4>
              <p>Complete everything in under 2 minutes right from your smartphone.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Success check-in screen
  if (step === 3) {
    return (
      <div className="checkin-page section-padding">
        <div className="container">
          <div className="glass-panel checkin-success-panel text-center">
            <div className="success-icon-badge">✅</div>
            <h2>Check-in Complete!</h2>
            <p>Thank you! Your pre-arrival online check-in was registered successfully. We are preparing for your stay at SM Golden Resorts.</p>
            
            <div className="success-booking-card">
              <div className="scd-row"><span>Lead Guest</span><strong>{booking?.name}</strong></div>
              <div className="scd-row"><span>Room Category</span><strong className="uppercase">{booking?.roomType} Room</strong></div>
              <div className="scd-row"><span>Check-in Date</span><strong>📅 {formatDate(booking?.checkIn)}</strong></div>
              <div className="scd-row"><span>Check-out Date</span><strong>📅 {formatDate(booking?.checkOut)}</strong></div>
              <div className="scd-row"><span>Total Guests</span><strong>👥 {form.numberOfGuests}</strong></div>
            </div>

            <div className="success-notes-box">
              <p>🏨 <strong>What's next?</strong> When you arrive, simply head to the reception and tell S. Murugan or our staff your booking ID. Since your ID registration is done, you will receive your room keys right away!</p>
              <p>📍 <strong>Resort Address:</strong> Old Falls Main Road, Courtallam, Tamil Nadu (Phone: 9443710420)</p>
            </div>

            <button className="btn-primary" onClick={() => navigate('/')}>Back to Home</button>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Main Form
  return (
    <div className="checkin-page section-padding">
      <div className="container">
        <div className="section-header text-center">
          <span className="gold-text uppercase">Pre-arrival Check-in</span>
          <h2>Register Stay Details</h2>
          <p className="subtitle-desc">Please fill in details matching your official government ID proof.</p>
        </div>

        {/* Booking Summary Banner */}
        {booking && (
          <div className="glass-panel booking-summary-banner">
            <div className="bsb-item"><span>Stay Ref</span><strong>#{booking.bookingId || booking._id}</strong></div>
            <div className="bsb-item"><span>Room Category</span><strong className="uppercase">{booking.roomType}</strong></div>
            <div className="bsb-item"><span>Check-in Date</span><strong>{formatDate(booking.checkIn)}</strong></div>
            <div className="bsb-item"><span>Check-out Date</span><strong>{formatDate(booking.checkOut)}</strong></div>
            <div className="bsb-item"><span>Rooms Booked</span><strong>{booking.rooms || 1} Room(s)</strong></div>
          </div>
        )}

        {error && <div className="checkin-alert error">{error}</div>}

        <form onSubmit={handleSubmit} className="checkin-form-body">
          {/* Section 1: Personal info */}
          <div className="glass-panel form-card-section">
            <div className="section-title-ci">
              <span className="sec-icon-ci">👤</span>
              <div>
                <h3>Personal Information</h3>
                <p>Lead guest contact details</p>
              </div>
            </div>

            <div className="grid-2-ci">
              <div className="form-group-ci full-width-ci">
                <label>Full Name <span className="req">*</span></label>
                <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="As printed on your ID proof" required />
              </div>
              <div className="form-group-ci">
                <label>Age</label>
                <input name="age" type="number" value={form.age} onChange={handleChange} min="1" max="110" placeholder="e.g. 28" />
              </div>
              <div className="form-group-ci">
                <label>Gender</label>
                <select name="gender" value={form.gender} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Home Address */}
          <div className="glass-panel form-card-section">
            <div className="section-title-ci">
              <span className="sec-icon-ci">🏠</span>
              <div>
                <h3>Home Address</h3>
                <p>Your permanent address details</p>
              </div>
            </div>

            <div className="grid-2-ci">
              <div className="form-group-ci full-width-ci">
                <label>Permanent Address <span className="req">*</span></label>
                <input name="address" value={form.address} onChange={handleChange} placeholder="Door No., Street name, Area" required />
              </div>
              <div className="form-group-ci">
                <label>City <span className="req">*</span></label>
                <input name="city" value={form.city} onChange={handleChange} placeholder="e.g. Tenkasi" required />
              </div>
              <div className="form-group-ci">
                <label>State</label>
                <select name="state" value={form.state} onChange={handleChange}>
                  {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group-ci">
                <label>Pincode / Postal Code</label>
                <input name="pincode" value={form.pincode} onChange={handleChange} maxLength={6} placeholder="e.g. 627802" />
              </div>
            </div>
          </div>

          {/* Section 3: ID Verification */}
          <div className="glass-panel form-card-section">
            <div className="section-title-ci">
              <span className="sec-icon-ci">🪪</span>
              <div>
                <h3>ID Verification Document</h3>
                <p>Select and upload an official government photo ID</p>
              </div>
            </div>

            <div className="grid-2-ci">
              <div className="form-group-ci">
                <label>ID Document Type <span className="req">*</span></label>
                <select name="idType" value={form.idType} onChange={handleChange} required>
                  {ID_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group-ci">
                <label>ID Document Number <span className="req">*</span></label>
                <input name="idNumber" value={form.idNumber} onChange={handleChange} placeholder={form.idType === 'Aadhaar' ? 'XXXX XXXX XXXX' : 'Enter ID number'} required />
              </div>
              <div className="form-group-ci full-width-ci">
                <label>Upload Document Photo (Front side / Main page)</label>
                <div className="upload-dropzone-ci" onClick={() => fileInputRef.current.click()}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="Uploaded ID Document Preview" className="uploaded-preview-img" />
                  ) : (
                    <div className="upload-placeholder">
                      <Upload size={36} className="gold-text" />
                      <p>Tap here to capture a photo or select an image file</p>
                      <small>Supports JPG/PNG formats (Max size: 2MB)</small>
                    </div>
                  )}
                </div>
                <input type="file" ref={fileInputRef} accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                {imagePreview && (
                  <button type="button" className="btn-remove-preview" onClick={() => { setImagePreview(''); setForm(prev => ({ ...prev, idProofImage: '' })); }}>
                    <Trash2 size={16} /> Delete & Re-upload Image
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Section 4: Accompanying Guests */}
          <div className="glass-panel form-card-section">
            <div className="section-title-ci">
              <span className="sec-icon-ci">👨‍👩‍👧‍👦</span>
              <div>
                <h3>Accompanying Guests</h3>
                <p>List all other guests staying in the resort room</p>
              </div>
            </div>

            <div className="grid-2-ci">
              <div className="form-group-ci">
                <label>Total Guest Count</label>
                <input type="number" value={form.numberOfGuests} onChange={e => handleGuestCountChange(e.target.value)} min="1" max="80" />
              </div>
              <div className="form-group-ci">
                <label>Vehicle Number (if arriving by personal car/bike)</label>
                <input name="vehicleNumber" value={form.vehicleNumber} onChange={handleChange} placeholder="e.g. TN 76 AB 1234" />
              </div>

              {form.guestNames.length > 0 && (
                <div className="form-group-ci full-width-ci">
                  <label>Names of Co-guests</label>
                  <div className="passenger-list-inputs">
                    {form.guestNames.map((name, i) => (
                      <div key={i} className="co-guest-row">
                        <span className="co-guest-index">{i + 2}</span>
                        <input value={name} onChange={e => handleGuestNameChange(i, e.target.value)} placeholder={`Full name of guest ${i + 2}`} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 5: Requests */}
          <div className="glass-panel form-card-section">
            <div className="section-title-ci">
              <span className="sec-icon-ci">📝</span>
              <div>
                <h3>Special Requests (Optional)</h3>
                <p>E.g. Ground floor request, extra towels, early check-in hours</p>
              </div>
            </div>
            <div className="form-group-ci full-width-ci">
              <textarea name="specialRequests" value={form.specialRequests} onChange={handleChange} placeholder="Let us know if you need anything specific for your luxury stay..." rows="3" />
            </div>
          </div>

          {/* Declaration Box */}
          <div className="declaration-box-ci">
            <p>🛡️ <strong>Declaration:</strong> I hereby declare that all stay details, government ID numbers, and passenger names entered in this portal are correct and true. I agree to abide by the resort safety guidelines and house rules.</p>
          </div>

          {/* Action Row */}
          <div className="checkin-action-row">
            <button type="button" className="btn-outline" onClick={() => { setStep(1); setBooking(null); }}>← Find Another Booking</button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? <Loader2 className="animate-spin" size={18} /> : 'Complete Secure Check-in ✅'}
            </button>
          </div>
        </form>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .checkin-page { background: var(--bg-deep); min-height: 100vh; padding-top: 130px; }
        .subtitle-desc { color: var(--text-muted); max-width: 600px; margin: 15px auto 0; font-size: 0.95rem; }

        .checkin-search-panel { max-width: 600px; margin: 0 auto 50px; padding: 50px; text-align: center; }
        .search-icon-wrap { font-size: 3.5rem; line-height: 1; margin-bottom: 20px; }
        .checkin-search-panel h3 { font-size: 1.6rem; margin-bottom: 10px; font-weight: 500; }
        .checkin-search-panel p { color: var(--text-muted); font-size: 0.95rem; margin-bottom: 30px; }
        .checkin-alert.error { background: rgba(244, 67, 54, 0.08); border: 1px solid rgba(244, 67, 54, 0.2); color: #f44336; padding: 15px; border-radius: 6px; text-align: center; margin-bottom: 25px; font-size: 0.95rem; }
        
        .search-form-ci { display: flex; flex-direction: column; gap: 15px; }
        .search-input-ci { padding: 15px 18px; background: var(--bg-deep); border: 1px solid var(--gold-border); color: white; border-radius: 6px; font-size: 1.05rem; text-align: center; transition: var(--transition-smooth); }
        .search-input-ci:focus { border-color: var(--gold); outline: none; }
        .search-btn-ci { text-transform: uppercase; letter-spacing: 1px; font-weight: 700; padding: 15px 0; }

        .checkin-perks-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-top: 50px; }
        .perk-card { padding: 35px 25px; text-align: center; }
        .perk-icon { font-size: 2.2rem; display: inline-block; margin-bottom: 15px; }
        .perk-card h4 { font-size: 1.15rem; font-weight: 600; margin-bottom: 10px; color: var(--text-primary); }
        .perk-card p { color: var(--text-muted); font-size: 0.85rem; line-height: 1.6; }

        /* Step 2 Form Styling */
        .booking-summary-banner { display: flex; justify-content: space-around; flex-wrap: wrap; padding: 20px 30px; margin-bottom: 40px; border-color: var(--gold); background: rgba(212,175,55,0.02); }
        .bsb-item { display: flex; flex-direction: column; text-align: center; gap: 4px; padding: 5px 15px; }
        .bsb-item span { color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; }
        .bsb-item strong { color: var(--gold); font-size: 1.1rem; }

        .checkin-form-body { display: flex; flex-direction: column; gap: 30px; max-width: 850px; margin: 0 auto; }
        .form-card-section { padding: 40px; }
        .section-title-ci { display: flex; gap: 15px; align-items: flex-start; border-bottom: 1px solid var(--gold-border); padding-bottom: 15px; margin-bottom: 30px; }
        .sec-icon-ci { font-size: 1.8rem; line-height: 1; }
        .section-title-ci h3 { font-size: 1.3rem; font-weight: 500; }
        .section-title-ci p { color: var(--text-muted); font-size: 0.85rem; margin-top: 2px; }

        .grid-2-ci { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; }
        .full-width-ci { grid-column: span 2; }
        
        .form-group-ci { display: flex; flex-direction: column; gap: 10px; }
        .form-group-ci label { color: var(--text-primary); font-weight: 600; font-size: 0.9rem; }
        .form-group-ci input, .form-group-ci select, .form-group-ci textarea {
          width: 100%;
          padding: 13px 18px;
          background: var(--bg-deep);
          border: 1px solid var(--gold-border);
          color: white;
          border-radius: 6px;
          font-size: 0.95rem;
          transition: var(--transition-smooth);
        }
        .form-group-ci input:focus, .form-group-ci select:focus, .form-group-ci textarea:focus { border-color: var(--gold); outline: none; }
        .req { color: #f44336; }

        /* Upload area styling */
        .upload-dropzone-ci { border: 2px dashed var(--gold-border); background: rgba(255,255,255,0.01); text-align: center; border-radius: 8px; cursor: pointer; padding: 40px 20px; transition: var(--transition-smooth); }
        .upload-dropzone-ci:hover { border-color: var(--gold); background: rgba(212,175,55,0.03); }
        .upload-placeholder { display: flex; flex-direction: column; align-items: center; gap: 12px; }
        .upload-placeholder p { font-size: 0.95rem; color: var(--text-primary); font-weight: 500; }
        .upload-placeholder small { color: var(--text-muted); }
        .uploaded-preview-img { max-height: 250px; width: auto; max-width: 100%; border-radius: 6px; object-fit: contain; border: 1px solid var(--gold-border); }
        .btn-remove-preview { display: inline-flex; align-items: center; gap: 8px; color: #f44336; background: transparent; border: none; font-size: 0.85rem; font-weight: 600; cursor: pointer; margin-top: 10px; transition: var(--transition-smooth); }
        .btn-remove-preview:hover { filter: brightness(1.2); }

        /* Accomodation guests */
        .passenger-list-inputs { display: flex; flex-direction: column; gap: 15px; }
        .co-guest-row { display: flex; align-items: center; gap: 12px; }
        .co-guest-index { display: flex; align-items: center; justify-content: center; width: 30px; height: 30px; background: rgba(255,255,255,0.05); border: 1px solid var(--gold-border); color: var(--gold); border-radius: 50%; font-weight: 700; font-size: 0.85rem; }

        /* Declaration */
        .declaration-box-ci { background: rgba(212,175,55,0.02); border: 1px solid var(--gold-border); padding: 20px 25px; border-radius: 6px; font-size: 0.85rem; line-height: 1.6; color: var(--text-muted); }
        .checkin-action-row { display: flex; justify-content: space-between; margin-top: 10px; }

        /* Success Step styling */
        .checkin-success-panel { max-width: 650px; margin: 0 auto; padding: 60px 40px; }
        .success-icon-badge { font-size: 4rem; line-height: 1; margin-bottom: 25px; }
        .checkin-success-panel h2 { font-size: 2.2rem; margin-bottom: 15px; }
        .checkin-success-panel p { color: var(--text-muted); font-size: 1rem; line-height: 1.7; margin-bottom: 35px; }
        
        .success-booking-card { background: rgba(255,255,255,0.02); border: 1px solid var(--gold-border); padding: 25px; border-radius: 8px; margin-bottom: 35px; display: flex; flex-direction: column; gap: 15px; text-align: left; }
        .scd-row { display: flex; justify-content: space-between; font-size: 0.95rem; }
        .scd-row span { color: var(--text-muted); }
        
        .success-notes-box { background: rgba(76, 175, 80, 0.04); border: 1px solid rgba(76,175,80,0.15); border-radius: 8px; padding: 25px; text-align: left; margin-bottom: 40px; display: flex; flex-direction: column; gap: 12px; font-size: 0.9rem; line-height: 1.6; }

        @media (max-width: 992px) {
          .checkin-perks-grid { grid-template-columns: 1fr; gap: 20px; }
          .booking-summary-banner { flex-direction: column; gap: 15px; align-items: flex-start; padding: 20px; }
          .bsb-item { text-align: left; padding: 0; }
          .grid-2-ci { grid-template-columns: 1fr; }
          .full-width-ci { grid-column: span 1; }
          .checkin-action-row { flex-direction: column; gap: 15px; }
          .checkin-action-row button { width: 100%; }
        }
      `}} />
    </div>
  );
}
