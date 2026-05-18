import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LogIn, Trash2, Check, X, RefreshCw, BarChart } from 'lucide-react';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'smgolden2024') {
      setIsAuthenticated(true);
      fetchBookings();
    } else {
      setError('Invalid Password');
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/bookings');
      setBookings(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch bookings');
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/booking/${id}`, { status });
      fetchBookings();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const deleteBooking = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await axios.delete(`http://localhost:5000/api/booking/${id}`);
        fetchBookings();
      } catch (err) {
        alert('Failed to delete booking');
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login section-padding">
        <div className="container">
          <div className="login-card">
            <div className="text-center">
              <span className="gold-text uppercase">Staff Access</span>
              <h2>Admin Login</h2>
            </div>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Access Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              {error && <p className="error-msg">{error}</p>}
              <button type="submit" className="btn-primary w-full">Login to Dashboard</button>
            </form>
          </div>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
          .admin-login { height: 80vh; display: flex; align-items: center; }
          .login-card { background: var(--gray); padding: 50px; border-radius: 12px; border: 1px solid var(--gold); max-width: 400px; margin: 0 auto; }
          .login-card h2 { margin: 10px 0 30px; }
          .error-msg { color: #ff4d4d; margin-bottom: 20px; text-align: center; }
        `}} />
      </div>
    );
  }

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    revenue: bookings.reduce((acc, b) => acc + b.totalPrice, 0)
  };

  return (
    <div className="admin-dashboard section-padding">
      <div className="container">
        <div className="admin-header">
          <div>
            <span className="gold-text uppercase">Management Console</span>
            <h2>Booking Dashboard</h2>
          </div>
          <button className="btn-outline" onClick={fetchBookings}>
            <RefreshCw size={18} /> Refresh
          </button>
        </div>

        <div className="grid admin-stats-grid">
          <div className="admin-stat-card">
            <p>Total Bookings</p>
            <h3>{stats.total}</h3>
          </div>
          <div className="admin-stat-card">
            <p>Pending</p>
            <h3 className="gold-text">{stats.pending}</h3>
          </div>
          <div className="admin-stat-card">
            <p>Confirmed</p>
            <h3 style={{ color: '#4caf50' }}>{stats.confirmed}</h3>
          </div>
          <div className="admin-stat-card">
            <p>Total Revenue</p>
            <h3>₹{stats.revenue.toLocaleString()}</h3>
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Guest Details</th>
                <th>Room Type</th>
                <th>Stay Period</th>
                <th>Guests</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td>
                    <div className="guest-info">
                      <strong>{b.guestName}</strong>
                      <span>{b.phone}</span>
                    </div>
                  </td>
                  <td className="uppercase">{b.roomType}</td>
                  <td>
                    <div className="stay-info">
                      <span>{new Date(b.checkIn).toLocaleDateString()}</span>
                      <span className="to-arrow">→</span>
                      <span>{new Date(b.checkOut).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td>{b.guests}</td>
                  <td>₹{b.totalPrice.toLocaleString()}</td>
                  <td>
                    <span className={`status-badge ${b.status}`}>{b.status}</span>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button className="confirm-btn" onClick={() => updateStatus(b._id, 'confirmed')} title="Confirm"><Check size={18} /></button>
                      <button className="cancel-btn" onClick={() => updateStatus(b._id, 'cancelled')} title="Cancel"><X size={18} /></button>
                      <button className="delete-btn" onClick={() => deleteBooking(b._id)} title="Delete"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {bookings.length === 0 && !loading && (
            <div className="text-center no-data">No bookings found.</div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .admin-dashboard { background: var(--black); min-height: 100vh; padding-top: 120px; }
        .admin-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 40px; }
        
        .admin-stats-grid { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); margin-bottom: 40px; }
        .admin-stat-card { background: var(--gray); padding: 25px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); }
        .admin-stat-card p { color: #888; font-size: 0.9rem; margin-bottom: 5px; }
        .admin-stat-card h3 { font-size: 1.8rem; margin: 0; }

        .admin-table-container { background: var(--gray); border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); }
        .admin-table { width: 100%; border-collapse: collapse; text-align: left; }
        .admin-table th { background: #111; padding: 15px 20px; font-weight: 600; color: var(--gold); border-bottom: 2px solid #222; }
        .admin-table td { padding: 15px 20px; border-bottom: 1px solid #222; }
        
        .guest-info { display: flex; flex-direction: column; }
        .guest-info span { font-size: 0.85rem; color: #888; }
        .stay-info { display: flex; flex-direction: column; font-size: 0.85rem; }
        .to-arrow { color: var(--gold); font-weight: bold; margin: 2px 0; }

        .status-badge { padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; text-transform: uppercase; font-weight: 600; }
        .status-badge.pending { background: rgba(201, 168, 76, 0.2); color: var(--gold); }
        .status-badge.confirmed { background: rgba(76, 175, 80, 0.2); color: #4caf50; }
        .status-badge.cancelled { background: rgba(244, 67, 54, 0.2); color: #f44336; }

        .admin-actions { display: flex; gap: 10px; }
        .admin-actions button { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 4px; color: white; opacity: 0.7; }
        .admin-actions button:hover { opacity: 1; }
        .confirm-btn { background: #4caf50; }
        .cancel-btn { background: #ff9800; }
        .delete-btn { background: #f44336; }

        .no-data { padding: 50px; color: #666; }

        @media (max-width: 992px) {
          .admin-table-container { overflow-x: auto; }
          .admin-table { min-width: 800px; }
        }
      `}} />
    </div>
  );
};

export default Admin;
