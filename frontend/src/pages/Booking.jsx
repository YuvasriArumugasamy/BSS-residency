import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Users, User, Phone, CreditCard, CheckCircle, Loader2, Home as HomeIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const Booking = () => {
  const [formData, setFormData] = useState({
    guestName: '',
    phone: '',
    roomType: 'non-ac',
    checkIn: '',
    checkOut: '',
    guests: 1,
  });

  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const prices = {
    'non-ac': 1500,
    'ac': 2000,
    'suite': 10000
  };

  useEffect(() => {
    if (formData.checkIn && formData.checkOut) {
      const start = new Date(formData.checkIn);
      const end = new Date(formData.checkOut);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
      setTotalPrice(prices[formData.roomType] * diffDays);
    } else {
      setTotalPrice(prices[formData.roomType]);
    }
  }, [formData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/booking', {
        ...formData,
        totalPrice
      });
      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="booking-success section-padding text-center">
        <div className="container">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="success-card"
          >
            <CheckCircle size={80} className="gold-text" />
            <h2>Booking Successful!</h2>
            <p>Thank you, {formData.guestName}. Your reservation at SM Golden Resorts has been received. We will contact you shortly on {formData.phone} to confirm.</p>
            <button className="btn-primary" onClick={() => window.location.href = '/'}>Back to Home</button>
          </motion.div>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
        .booking-page { background: var(--bg-deep); min-height: 100vh; padding-top: 130px; }
        .booking-grid { grid-template-columns: 1.5fr 1fr; gap: 50px; align-items: start; }
        
        .booking-form { 
          background: var(--bg-card); 
          padding: 45px; 
          border-radius: 16px; 
          border: 1px solid var(--gold-border); 
          box-shadow: var(--shadow-premium);
          transition: var(--transition-smooth);
        }
        .booking-form:hover {
          border-color: rgba(212, 175, 55, 0.25);
        }
        
        .form-group { margin-bottom: 25px; }
        .form-group label { 
          display: flex; 
          align-items: center; 
          gap: 10px; 
          margin-bottom: 12px; 
          color: var(--gold); 
          font-weight: 600; 
          font-family: var(--font-body);
          font-size: 0.9rem;
          letter-spacing: 0.5px;
        }
        .form-group input, .form-group select {
          width: 100%;
          padding: 14px 18px;
          background: var(--bg-deep);
          border: 1px solid var(--gold-border);
          color: var(--text-primary);
          border-radius: 6px;
          font-family: var(--font-body);
          transition: var(--transition-smooth);
        }
        .form-group input:focus, .form-group select:focus { 
          border-color: var(--gold); 
          outline: none; 
          box-shadow: 0 0 15px rgba(212, 175, 55, 0.15);
        }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

        .booking-summary { 
          background: rgba(21, 20, 17, 0.85); 
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          padding: 45px; 
          border-radius: 16px; 
          border: 1px solid var(--gold); 
          position: sticky; 
          top: 130px; 
          box-shadow: var(--shadow-premium), var(--shadow-gold-glow);
        }
        .booking-summary h3 {
          font-size: 1.6rem;
          font-weight: 500;
          border-bottom: 1px solid rgba(212, 175, 55, 0.15);
          padding-bottom: 15px;
          margin-bottom: 25px;
        }
        .summary-details { margin: 30px 0; }
        .summary-item { display: flex; justify-content: space-between; margin-bottom: 18px; font-weight: 500; }
        .summary-divider { height: 1px; background: rgba(212,175,55,0.15); margin: 25px 0; }
        .summary-total { display: flex; justify-content: space-between; align-items: center; }
        
        .total-amount { 
          font-size: 2.3rem; 
          font-weight: 300; 
          background: var(--gold-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-family: var(--font-heading); 
        }
        .booking-note { font-size: 0.85rem; color: var(--text-muted); line-height: 1.6; }
        .booking-note p { margin-bottom: 8px; }
        
        .error-msg { 
          background: rgba(255, 77, 77, 0.08); 
          color: #ff4d4d; 
          padding: 12px; 
          border-radius: 6px; 
          margin-bottom: 25px; 
          text-align: center; 
          border: 1px solid rgba(255, 77, 77, 0.2);
        }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .w-full { width: 100%; }

        @media (max-width: 992px) {
          .booking-grid { grid-template-columns: 1fr; }
          .booking-summary { position: static; }
        }
      `}} />
      </div>
    );
  }

  return (
    <div className="booking-page section-padding">
      <div className="container">
        <div className="section-header text-center">
          <span className="gold-text uppercase">Reservations</span>
          <h2>Book Your Luxury Stay</h2>
        </div>

        <div className="grid booking-grid">
          <div className="booking-form-container">
            <form onSubmit={handleSubmit} className="booking-form">
              <div className="form-group">
                <label><User size={18} /> Guest Name</label>
                <input 
                  type="text" name="guestName" required 
                  placeholder="Enter your full name"
                  value={formData.guestName} onChange={handleChange} 
                />
              </div>

              <div className="form-group">
                <label><Phone size={18} /> Phone Number</label>
                <input 
                  type="tel" name="phone" required 
                  placeholder="Enter your phone number"
                  value={formData.phone} onChange={handleChange} 
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label><HomeIcon size={18} /> Room Type</label>
                  <select name="roomType" value={formData.roomType} onChange={handleChange}>
                    <option value="non-ac">Non-AC (₹1,500)</option>
                    <option value="ac">AC Room (₹2,000)</option>
                    <option value="suite">Suite Room (₹10,000)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label><Users size={18} /> Number of Guests</label>
                  <input 
                    type="number" name="guests" min="1" max="80" required 
                    value={formData.guests} onChange={handleChange} 
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label><Calendar size={18} /> Check-in Date</label>
                  <input 
                    type="date" name="checkIn" required 
                    value={formData.checkIn} onChange={handleChange} 
                  />
                </div>
                <div className="form-group">
                  <label><Calendar size={18} /> Check-out Date</label>
                  <input 
                    type="date" name="checkOut" required 
                    value={formData.checkOut} onChange={handleChange} 
                  />
                </div>
              </div>

              {error && <div className="error-msg">{error}</div>}

              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : 'Confirm Booking'}
              </button>
            </form>
          </div>

          <div className="booking-summary">
            <h3>Reservation Summary</h3>
            <div className="summary-details">
              <div className="summary-item">
                <span>Room Type</span>
                <span className="gold-text uppercase">{formData.roomType}</span>
              </div>
              <div className="summary-item">
                <span>Price per night</span>
                <span>₹{prices[formData.roomType].toLocaleString()}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-total">
                <span>Total Price</span>
                <span className="total-amount">₹{totalPrice.toLocaleString()}</span>
              </div>
            </div>
            <div className="booking-note">
              <p>* Payment will be collected at the resort or via phone confirmation.</p>
              <p>* Free cancellation up to 24 hours before check-in.</p>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .booking-page { background: var(--bg-deep); min-height: 100vh; padding-top: 130px; }
        .booking-grid { grid-template-columns: 1.5fr 1fr; gap: 50px; align-items: start; }
        
        .booking-form { 
          background: var(--bg-card); 
          padding: 45px; 
          border-radius: 16px; 
          border: 1px solid var(--gold-border); 
          box-shadow: var(--shadow-premium);
          transition: var(--transition-smooth);
        }
        .booking-form:hover {
          border-color: rgba(212, 175, 55, 0.25);
        }
        
        .form-group { margin-bottom: 25px; }
        .form-group label { 
          display: flex; 
          align-items: center; 
          gap: 10px; 
          margin-bottom: 12px; 
          color: var(--gold); 
          font-weight: 600; 
          font-family: var(--font-body);
          font-size: 0.9rem;
          letter-spacing: 0.5px;
        }
        .form-group input, .form-group select {
          width: 100%;
          padding: 14px 18px;
          background: var(--bg-deep);
          border: 1px solid var(--gold-border);
          color: var(--text-primary);
          border-radius: 6px;
          font-family: var(--font-body);
          transition: var(--transition-smooth);
        }
        .form-group input:focus, .form-group select:focus { 
          border-color: var(--gold); 
          outline: none; 
          box-shadow: 0 0 15px rgba(212, 175, 55, 0.15);
        }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

        .booking-summary { 
          background: rgba(21, 20, 17, 0.85); 
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          padding: 45px; 
          border-radius: 16px; 
          border: 1px solid var(--gold); 
          position: sticky; 
          top: 130px; 
          box-shadow: var(--shadow-premium), var(--shadow-gold-glow);
        }
        .booking-summary h3 {
          font-size: 1.6rem;
          font-weight: 500;
          border-bottom: 1px solid rgba(212, 175, 55, 0.15);
          padding-bottom: 15px;
          margin-bottom: 25px;
        }
        .summary-details { margin: 30px 0; }
        .summary-item { display: flex; justify-content: space-between; margin-bottom: 18px; font-weight: 500; }
        .summary-divider { height: 1px; background: rgba(212,175,55,0.15); margin: 25px 0; }
        .summary-total { display: flex; justify-content: space-between; align-items: center; }
        
        .total-amount { 
          font-size: 2.3rem; 
          font-weight: 300; 
          background: var(--gold-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-family: var(--font-heading); 
        }
        .booking-note { font-size: 0.85rem; color: var(--text-muted); line-height: 1.6; }
        .booking-note p { margin-bottom: 8px; }
        
        .error-msg { 
          background: rgba(255, 77, 77, 0.08); 
          color: #ff4d4d; 
          padding: 12px; 
          border-radius: 6px; 
          margin-bottom: 25px; 
          text-align: center; 
          border: 1px solid rgba(255, 77, 77, 0.2);
        }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .w-full { width: 100%; }

        @media (max-width: 992px) {
          .booking-grid { grid-template-columns: 1fr; }
          .booking-summary { position: static; }
        }
      `}} />
    </div>
  );
};

export default Booking;
