import React, { useState, useEffect } from 'react';
import apiClient from '../utils/apiClient';
import { 
  LogIn, RefreshCw, Calendar, Users, Phone, MapPin, DollarSign, CheckCircle2, 
  XCircle, Trash2, Home, Settings, MessageSquare, AlertCircle, PlusCircle, 
  ArrowRight, ShieldCheck, UserCheck, Moon, Sun, ToggleLeft, ToggleRight, Info, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [adminCreds, setAdminCreds] = useState({ username: '', password: '' });
  
  // Dashboard states
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalBookings: 0, pending: 0, confirmed: 0, cancelled: 0,
    totalRevenue: 0, availableRooms: 11, occupiedRooms: 0, totalRooms: 11,
    checkInsToday: 0, checkOutsToday: 0, revenueHistory: [], byRoom: []
  });
  const [rooms, setRooms] = useState([]);
  const [guests, setGuests] = useState([]);
  const [payments, setPayments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState({ isSeason: false });

  // UI Control states
  const [activeTab, setActiveTab] = useState('overview');

  // Scroll to top whenever the active tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [cancellationModal, setCancellationModal] = useState({ show: false, bookingId: '', reason: '' });
  const [assignRoomModal, setAssignRoomModal] = useState({ show: false, booking: null, selectedRoom: '' });

  // Offline stay booking form
  const [offlineForm, setOfflineForm] = useState({
    name: '', phone: '', email: '', roomType: 'non-ac',
    checkIn: '', checkOut: '', guests: 1, rooms: 1,
    message: '', advancePaid: 0, paymentMethod: 'Cash'
  });

  // Load credentials from localStorage if present
  useEffect(() => {
    const savedUser = localStorage.getItem('sm_admin_user');
    const savedPass = localStorage.getItem('sm_admin_pass');
    if (savedUser && savedPass) {
      setAdminCreds({ username: savedUser, password: savedPass });
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch all management data when authenticated
  useEffect(() => {
    if (isAuthenticated && adminCreds.username) {
      fetchDashboardData();
    }
  }, [isAuthenticated, adminCreds, activeTab]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    const headers = { username: adminCreds.username, password: adminCreds.password };
    try {
      // 1. Fetch Stats
      const statsRes = await apiClient.get('http://localhost:5000/api/admin/stats', { headers });
      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }

      // 2. Fetch Bookings
      const bookingsRes = await apiClient.get('http://localhost:5000/api/admin/bookings?limit=250', { headers });
      if (bookingsRes.data.success) {
        setBookings(bookingsRes.data.bookings);
      }

      // 3. Fetch Rooms
      const roomsRes = await apiClient.get('http://localhost:5000/api/admin/rooms', { headers });
      if (roomsRes.data.success) {
        setRooms(roomsRes.data.rooms);
      }

      // 4. Fetch settings
      const settingsRes = await apiClient.get('http://localhost:5000/api/admin/settings', { headers });
      if (settingsRes.data.success) {
        setSettings(settingsRes.data.settings);
      }

      // Fetch tab specific items
      if (activeTab === 'guests') {
        const guestsRes = await apiClient.get('http://localhost:5000/api/admin/guests', { headers });
        setGuests(guestsRes.data.guests || []);
      } else if (activeTab === 'payments') {
        const paymentsRes = await apiClient.get('http://localhost:5000/api/admin/payments', { headers });
        setPayments(paymentsRes.data.payments || []);
      } else if (activeTab === 'reviews') {
        const reviewsRes = await apiClient.get('http://localhost:5000/api/admin/reviews', { headers });
        setReviews(reviewsRes.data.reviews || []);
      } else if (activeTab === 'notifications') {
        const notifRes = await apiClient.get('http://localhost:5000/api/admin/notifications', { headers });
        setNotifications(notifRes.data.notifications || []);
      }
    } catch (err) {
      console.error(err);
      setError('Unauthorized or server connection failure. Please review admin access token.');
      if (err.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = { username: usernameInput.trim(), password: passwordInput.trim() };
      const res = await apiClient.post('http://localhost:5000/api/admin/login', payload);
      
      if (res.data.success) {
        localStorage.setItem('sm_admin_user', payload.username);
        localStorage.setItem('sm_admin_pass', payload.password);
        setAdminCreds(payload);
        setIsAuthenticated(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid administrative credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sm_admin_user');
    localStorage.removeItem('sm_admin_pass');
    setIsAuthenticated(false);
    setAdminCreds({ username: '', password: '' });
    setUsernameInput('');
    setPasswordInput('');
  };

  // Toggle Season mode settings
  const toggleSeasonMode = async () => {
    const nextVal = !settings.isSeason;
    const headers = { username: adminCreds.username, password: adminCreds.password };
    try {
      setLoading(true);
      const res = await apiClient.patch('http://localhost:5000/api/admin/settings', { isSeason: nextVal }, { headers });
      if (res.data.success) {
        setSettings({ isSeason: nextVal });
        fetchDashboardData();
      }
    } catch (err) {
      alert('Failed to update season settings.');
    } finally {
      setLoading(false);
    }
  };

  // Reset 11 Room Layout Database Seeding
  const handleResetRoomLayout = async () => {
    if (!window.confirm('WARNING: This will erase all custom room details and reset to default 11 room layouts (101-201) with official prices. Proceed?')) return;
    const headers = { username: adminCreds.username, password: adminCreds.password };
    try {
      setLoading(true);
      const res = await apiClient.post('http://localhost:5000/api/admin/rooms/reset-layout', {}, { headers });
      if (res.data.success) {
        alert(res.data.message);
        fetchDashboardData();
      }
    } catch (err) {
      alert('Failed to reset rooms database layout.');
    } finally {
      setLoading(false);
    }
  };

  // Confirm booking & generate WA message link
  const handleConfirmBooking = async (booking) => {
    const headers = { username: adminCreds.username, password: adminCreds.password };
    try {
      setLoading(true);
      // Ask which room number to assign first!
      const availableRoomsForType = rooms.filter(r => r.type === booking.roomType && r.status === 'Available');
      
      if (availableRoomsForType.length === 0) {
        if (!window.confirm('No rooms currently showing as "Available" for this category. Would you like to confirm anyway without room number?')) {
          setLoading(false);
          return;
        }
        const res = await apiClient.patch(`http://localhost:5000/api/admin/bookings/${booking._id}`, { status: 'Confirmed' }, { headers });
        if (res.data.success) {
          if (res.data.waLink) window.open(res.data.waLink, '_blank');
          fetchDashboardData();
        }
      } else {
        // Open assign room modal
        setAssignRoomModal({ show: true, booking, selectedRoom: availableRoomsForType[0].roomNumber });
        setLoading(false);
      }
    } catch (err) {
      alert('Failed to confirm stay.');
      setLoading(false);
    }
  };

  const submitAssignRoomConfirm = async () => {
    const headers = { username: adminCreds.username, password: adminCreds.password };
    try {
      setLoading(true);
      const res = await apiClient.patch(
        `http://localhost:5000/api/admin/bookings/${assignRoomModal.booking._id}`, 
        { status: 'Confirmed', roomNumber: assignRoomModal.selectedRoom }, 
        { headers }
      );
      if (res.data.success) {
        setAssignRoomModal({ show: false, booking: null, selectedRoom: '' });
        if (res.data.waLink) window.open(res.data.waLink, '_blank');
        fetchDashboardData();
      }
    } catch (err) {
      alert('Failed to assign room and confirm.');
    } finally {
      setLoading(false);
    }
  };

  // Open cancellation popup
  const handleCancelClick = (id) => {
    setCancellationModal({ show: true, bookingId: id, reason: '' });
  };

  const submitCancellation = async () => {
    if (!cancellationModal.reason.trim()) return alert('Please input cancellation reason.');
    const headers = { username: adminCreds.username, password: adminCreds.password };
    try {
      setLoading(true);
      const res = await apiClient.patch(
        `http://localhost:5000/api/admin/bookings/${cancellationModal.bookingId}`,
        { status: 'Cancelled', cancellationReason: cancellationModal.reason },
        { headers }
      );
      if (res.data.success) {
        setCancellationModal({ show: false, bookingId: '', reason: '' });
        if (res.data.waLink) window.open(res.data.waLink, '_blank');
        fetchDashboardData();
      }
    } catch (err) {
      alert('Failed to cancel stay reservation.');
    } finally {
      setLoading(false);
    }
  };

  // Complete Guest Check-out
  const handleCheckOutBooking = async (id) => {
    if (!window.confirm('Check out this guest and release assigned room keys back to available pool?')) return;
    const headers = { username: adminCreds.username, password: adminCreds.password };
    try {
      setLoading(true);
      const res = await apiClient.patch(`http://localhost:5000/api/admin/bookings/${id}`, { status: 'Checked-out' }, { headers });
      if (res.data.success) {
        fetchDashboardData();
      }
    } catch (err) {
      alert('Checkout failed.');
    } finally {
      setLoading(false);
    }
  };

  // Delete stay history log
  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Are you absolutely sure you want to permanently delete this booking log from databases?')) return;
    const headers = { username: adminCreds.username, password: adminCreds.password };
    try {
      setLoading(true);
      const res = await apiClient.delete(`http://localhost:5000/api/admin/bookings/${id}`, { headers });
      if (res.data.success) {
        fetchDashboardData();
      }
    } catch (err) {
      alert('Delete failed.');
    } finally {
      setLoading(false);
    }
  };

  // Create Manual stay booking
  const handleOfflineBookingSubmit = async (e) => {
    e.preventDefault();
    const headers = { username: adminCreds.username, password: adminCreds.password };
    try {
      setLoading(true);
      const res = await apiClient.post('http://localhost:5000/api/admin/bookings/offline', offlineForm, { headers });
      if (res.data.success) {
        alert('Direct stay booking logged successfully!');
        setShowOfflineModal(false);
        setOfflineForm({
          name: '', phone: '', email: '', roomType: 'non-ac',
          checkIn: '', checkOut: '', guests: 1, rooms: 1,
          message: '', advancePaid: 0, paymentMethod: 'Cash'
        });
        fetchDashboardData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to record manual booking details.');
    } finally {
      setLoading(false);
    }
  };

  // Release/Edit Room maintenance statuses
  const handleRoomStatusChange = async (roomId, currentStatus) => {
    const nextStatus = currentStatus === 'Maintenance' ? 'Available' : 'Maintenance';
    const headers = { username: adminCreds.username, password: adminCreds.password };
    try {
      setLoading(true);
      const res = await apiClient.patch(`http://localhost:5000/api/admin/rooms/${roomId}`, { status: nextStatus }, { headers });
      if (res.data.success) {
        fetchDashboardData();
      }
    } catch (err) {
      alert('Failed to modify room state.');
    } finally {
      setLoading(false);
    }
  };

  // Format Dates utility
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  };

  // Clear notifs
  const handleClearNotifications = async () => {
    if (!window.confirm('Delete all alerts history?')) return;
    const headers = { username: adminCreds.username, password: adminCreds.password };
    try {
      await apiClient.delete('http://localhost:5000/api/admin/notifications/all', { headers });
      fetchDashboardData();
    } catch (err) {}
  };

  // --- LOGIN INTERFACE ---
  if (!isAuthenticated) {
    return (
      <div className="admin-login-page">
        <div className="login-split">
          <div className="login-image-side">
            <img src="/assets/hero.jpg" alt="SM Golden Resorts" />
            <div className="login-image-overlay">
              <h2>SM Golden Resorts</h2>
              <p>Resort Management System</p>
            </div>
          </div>
          <div className="login-form-side">
            <div className="login-form-wrap">
              <div className="login-brand">
                <ShieldCheck size={32} style={{ color: 'var(--blue-accent)' }} />
                <h2>Admin Login</h2>
                <p>Sign in to access the management dashboard</p>
              </div>

              {error && <div className="login-error-msg">{error}</div>}

              <form onSubmit={handleLoginSubmit} className="login-form">
                <div className="form-group-ci">
                  <label>Username</label>
                  <input 
                    type="text" 
                    value={usernameInput} 
                    onChange={e => setUsernameInput(e.target.value)} 
                    placeholder="Enter your username" 
                    required 
                  />
                </div>

                <div className="form-group-ci">
                  <label>Password</label>
                  <input 
                    type="password" 
                    value={passwordInput} 
                    onChange={e => setPasswordInput(e.target.value)} 
                    placeholder="Enter your password" 
                    required 
                  />
                </div>

                <button type="submit" className="btn-gold submit-login-btn" disabled={loading}>
                  <LogIn size={18} /> {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
            </div>
          </div>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
          .admin-login-page { min-height: 100vh; padding-top: 64px; }
          .login-split { display: grid; grid-template-columns: 1fr 1fr; min-height: calc(100vh - 64px); }
          .login-image-side { position: relative; overflow: hidden; }
          .login-image-side img { width: 100%; height: 100%; object-fit: cover; }
          .login-image-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(15,28,46,0.7), rgba(15,28,46,0.85)); display: flex; flex-direction: column; align-items: center; justify-content: center; }
          .login-image-overlay h2 { color: white; font-size: 2.5rem; margin-bottom: 8px; }
          .login-image-overlay p { color: rgba(255,255,255,0.7); font-size: 1.1rem; }
          /* Right-align the form side for desktop */
          .login-form-side { display: flex; align-items: center; justify-content: flex-end; padding: 40px 80px 40px 40px; background: var(--bg-body); }
          .login-form-wrap { width: 100%; max-width: 380px; }
          .login-brand { margin-bottom: 32px; }
          .login-brand h2 { font-size: 1.8rem; color: var(--navy); margin: 12px 0 6px; font-weight: 500; font-family: var(--font-heading); }
          .login-brand p { color: var(--text-body); font-size: 0.9rem; }
          .login-error-msg { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; padding: 12px; border-radius: 8px; font-size: 0.85rem; text-align: center; margin-bottom: 20px; }
          .login-form { display: flex; flex-direction: column; gap: 18px; }
          .submit-login-btn { width: 100%; justify-content: center; padding: 14px 0; font-size: 0.95rem; margin-top: 8px; }
          @media (max-width: 768px) {
            .login-split { grid-template-columns: 1fr; }
            .login-image-side { height: 200px; }
            /* Center the form on small screens */
            .login-form-side { justify-content: center; padding: 20px; }
          }`}} />
      </div>
    );
  }

  return (
    <div className="admin-console-page section-padding">
      <div className="container-fluid admin-container">
        {/* Left Aside Navigation Panel */}
        <aside className="glass-panel console-navigation">
          <div className="console-brand">
            <UserCheck size={30} className="gold-text" />
            <div>
              <h3>SM Golden</h3>
              <span className="badge-mgr">RESORT MANAGER</span>
            </div>
          </div>

  <nav className="nav-menu">
  <button className={`nav-link-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => { setActiveTab('overview'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
    <Home size={18} /> Dashboard Overview
  </button>
  <button className={`nav-link-btn ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => { setActiveTab('bookings'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
    <Calendar size={18} /> Occupancy Bookings
  </button>
  <button className={`nav-link-btn ${activeTab === 'rooms' ? 'active' : ''}`} onClick={() => { setActiveTab('rooms'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
    <Moon size={18} /> Room Layout Panel
  </button>
  <button className={`nav-link-btn ${activeTab === 'guests' ? 'active' : ''}`} onClick={() => { setActiveTab('guests'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
    <Users size={18} /> Guest Loyalty Profiles
  </button>
  <button className={`nav-link-btn ${activeTab === 'payments' ? 'active' : ''}`} onClick={() => { setActiveTab('payments'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
    <DollarSign size={18} /> Financial Ledger
  </button>
  <button className={`nav-link-btn ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => { setActiveTab('reviews'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
    <MessageSquare size={18} /> Ratings & Reviews
  </button>
  <button className={`nav-link-btn ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => { setActiveTab('notifications'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
    <AlertCircle size={18} /> Alerts Notification
  </button>
</nav>
        </aside>

        {/* Right Main Content Body */}
        <main className="console-main-body">
          {/* Header Bar */}
          <header className="console-header-bar glass-panel">
            <div className="header-meta">
              <span className="subtitle gold-text">Management Cockpit</span>
              <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Control</h2>
            </div>

            <div className="action-meta-buttons">
              <button className="btn-outline refresh-btn" onClick={fetchDashboardData} disabled={loading}>
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Synchronize Data
              </button>

              <button className="btn-primary offline-booking-btn" onClick={() => setShowOfflineModal(true)}>
                <PlusCircle size={16} /> Add Phone Booking
              </button>
            </div>
          </header>

          {/* Error alerts */}
          {error && (
            <div className="console-error-alert-banner">
              <AlertCircle size={20} />
              <p>{error}</p>
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="tab-pane-view">
              {/* Quick stats grid */}
              <div className="grid stats-panel-grid">
                <div className="stat-panel-card glass-panel">
                  <span className="span-lbl">Total Stays Logged</span>
                  <h3>{stats.totalBookings}</h3>
                  <p>In-house registry database</p>
                </div>
                <div className="stat-panel-card glass-panel">
                  <span className="span-lbl">Pending Requests</span>
                  <h3 className="gold-text">{stats.pending}</h3>
                  <p>Awaiting WhatsApp replies</p>
                </div>
                <div className="stat-panel-card glass-panel">
                  <span className="span-lbl">Occupied Rooms</span>
                  <h3 className="success-color">{stats.occupiedRooms} / {stats.totalRooms}</h3>
                  <p>Live occupancy ratio</p>
                </div>
                <div className="stat-panel-card glass-panel">
                  <span className="span-lbl">Gross Ledger Receipts</span>
                  <h3>₹{stats.totalRevenue.toLocaleString('en-IN')}</h3>
                  <p>Online deposits & manual cash</p>
                </div>
              </div>

              {/* Occupancy status widget & Quick Action Panel */}
              <div className="grid double-overview-columns" style={{ marginTop: '30px' }}>
                {/* Available rooms grid */}
                <div className="glass-panel occupancy-display-card">
                  <div className="card-header-console">
                    <h3>Real-time Room Occupancy</h3>
                    <button className="btn-outline small-btn" onClick={handleResetRoomLayout}>Reset 11 Rooms Layout</button>
                  </div>
                  <div className="rooms-occupancy-map">
                    {rooms.map(r => {
                      const colorMap = {
                        Available: '#4caf50',
                        Occupied: '#d4af37',
                        Maintenance: '#f44336'
                      };
                      return (
                        <div key={r._id} className="room-cell" style={{ borderColor: colorMap[r.status] }}>
                          <span className="room-num">{r.roomNumber}</span>
                          <span className="room-cat uppercase">{r.type}</span>
                          <span className="status-label-cell" style={{ color: colorMap[r.status] }}>{r.status}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Live calendar logs */}
                <div className="glass-panel quick-schedule-card">
                  <h3>Check-ins / Check-outs Today</h3>
                  <div className="today-summary-widget">
                    <div className="widget-side">
                      <span className="num success-color">{stats.checkInsToday}</span>
                      <span>Scheduled Check-ins</span>
                    </div>
                    <div className="widget-separator" />
                    <div className="widget-side">
                      <span className="num">{stats.checkOutsToday}</span>
                      <span>Expected Check-outs</span>
                    </div>
                  </div>

                  <div className="occupancy-info-box">
                    <Info size={16} className="gold-text" />
                    <p>Dynamic pricing is set to: <strong>{settings.isSeason ? 'SEASON' : 'NON-SEASON'}</strong>. Guest website rates are synchronized automatically.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BOOKINGS TABLE */}
          {activeTab === 'bookings' && (
            <div className="tab-pane-view glass-panel table-panel">
              <div className="table-header-lbl">
                <h3>Occupancy Stay Registrations</h3>
                <span>Viewing latest {bookings.length} reservations</span>
              </div>

              <div className="console-table-container">
                <table className="console-data-table">
                  <thead>
                    <tr>
                      <th>Guest Details</th>
                      <th>Stay Period</th>
                      <th>Room & Assigned</th>
                      <th>Total charges</th>
                      <th>Payment Status</th>
                      <th>Status Badge</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => {
                      const nightsCount = Math.round((new Date(b.checkOut) - new Date(b.checkIn)) / (1000 * 60 * 60 * 24)) || 1;
                      
                      return (
                        <tr key={b._id}>
                          <td>
                            <div className="guest-col">
                              <strong>{b.name}</strong>
                              <span>📞 {b.phone}</span>
                              {b.checkedInOnline && <span className="online-tag">⚡ Pre-checked In</span>}
                            </div>
                          </td>
                          <td>
                            <div className="stay-col">
                              <strong>{formatDate(b.checkIn)} → {formatDate(b.checkOut)}</strong>
                              <span>{nightsCount} Night(s) | {b.guests} Guests</span>
                            </div>
                          </td>
                          <td>
                            <div className="room-col">
                              <span className="uppercase font-body">{b.roomType} room ({b.rooms || 1} unit)</span>
                              <strong>Room: {b.roomNumber || 'Not assigned'}</strong>
                            </div>
                          </td>
                          <td>
                            <div className="price-col">
                              <strong>₹{b.totalPrice.toLocaleString()}</strong>
                              <span>Deposit: ₹{b.advancePaid || 0}</span>
                            </div>
                          </td>
                          <td>
                            <span className={`badge-payment ${b.paymentStatus === 'Completed' ? 'paid' : 'due'}`}>
                              {b.paymentStatus === 'Completed' ? 'Paid' : 'Due'}
                            </span>
                          </td>
                          <td>
                            <span className={`badge-status ${b.status}`}>
                              {b.status}
                            </span>
                          </td>
                          <td>
                            <div className="console-actions-row">
                              {b.status === 'Pending' && (
                                <button className="btn-confirm-action" title="Confirm Booking & open WhatsApp" onClick={() => handleConfirmBooking(b)}>
                                  Confirm Stay
                                </button>
                              )}
                              {b.status === 'Confirmed' && (
                                <button className="btn-checkout-action" title="Check guest out" onClick={() => handleCheckOutBooking(b._id)}>
                                  Check-out
                                </button>
                              )}
                              {b.status !== 'Cancelled' && b.status !== 'Checked-out' && (
                                <button className="btn-cancel-action" title="Cancel Booking & send notification" onClick={() => handleCancelClick(b._id)}>
                                  Cancel
                                </button>
                              )}
                              <button className="btn-delete-action" title="Permanently delete log" onClick={() => handleDeleteBooking(b._id)}>
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {bookings.length === 0 && (
                  <div className="text-center empty-table">No guest stay records found in MongoDB.</div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ROOMS MANAGER */}
          {activeTab === 'rooms' && (
            <div className="tab-pane-view glass-panel table-panel">
              <div className="card-header-console flex-between">
                <div>
                  <h3>Resort Rooms Management</h3>
                  <p>Live status toggle for resort's 11 guest chambers.</p>
                </div>
                <button className="btn-outline" onClick={handleResetRoomLayout}>Trigger 11 Rooms Layout Reset</button>
              </div>

              <div className="rooms-management-grid">
                {rooms.map(room => (
                  <div key={room._id} className="room-mgr-card glass-panel" style={{ borderColor: room.status === 'Maintenance' ? '#f44336' : 'var(--gold-border)' }}>
                    <div className="rmc-header">
                      <strong className="rmc-num">Room {room.roomNumber}</strong>
                      <span className={`status-pill ${room.status}`}>
                        {room.status}
                      </span>
                    </div>
                    <div className="rmc-body">
                      <p>Category: <strong className="uppercase">{room.type}</strong></p>
                      <p>Standard Tariff: <strong>₹{room.price}/night</strong></p>
                    </div>
                    <div className="rmc-actions">
                      <button 
                        className={`btn-action-rmc ${room.status === 'Maintenance' ? 'warn' : ''}`}
                        onClick={() => handleRoomStatusChange(room._id, room.status)}
                      >
                        {room.status === 'Maintenance' ? 'End Maintenance' : 'Set to Maintenance'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: GUEST PROFILES */}
          {activeTab === 'guests' && (
            <div className="tab-pane-view glass-panel table-panel">
              <div className="table-header-lbl">
                <h3>Loyalty Guest Database</h3>
                <p>Track guest stays count and loyalty milestones.</p>
              </div>

              <div className="console-table-container">
                <table className="console-data-table">
                  <thead>
                    <tr>
                      <th>Guest Name</th>
                      <th>Phone Number</th>
                      <th>Email</th>
                      <th>Total Visited Stay nights</th>
                      <th>Loyalty Tier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {guests.map(g => (
                      <tr key={g._id}>
                        <td><strong>{g.name}</strong></td>
                        <td>{g.phone}</td>
                        <td>{g.email || '—'}</td>
                        <td>{g.totalStays} Stays registered</td>
                        <td>
                          <span className={`loyalty-badge ${g.loyaltyLevel.toLowerCase()}`}>
                            {g.loyaltyLevel}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: LEDGER LEDGER */}
          {activeTab === 'payments' && (
            <div className="tab-pane-view glass-panel table-panel">
              <div className="table-header-lbl">
                <h3>Financial Income Ledger</h3>
                <p>Track Razorpay payment gateways receipts and resort cash logs.</p>
              </div>

              <div className="console-table-container">
                <table className="console-data-table">
                  <thead>
                    <tr>
                      <th>Guest Name</th>
                      <th>Amount Received</th>
                      <th>Payment Mode</th>
                      <th>Audit Date</th>
                      <th>Transaction ID / Reference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map(p => (
                      <tr key={p._id}>
                        <td><strong>{p.guestName}</strong></td>
                        <td><strong className="success-color">₹{p.amount.toLocaleString()}</strong></td>
                        <td><span className="payment-mode-label">{p.method}</span></td>
                        <td>{new Date(p.date).toLocaleString('en-IN')}</td>
                        <td><span className="tx-code">{p.razorpayPaymentId || p._id}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="tab-pane-view glass-panel table-panel">
              <div className="table-header-lbl">
                <h3>Guest Reviews Panel</h3>
                <p>Latest feedback submitted by guests on tracking screens.</p>
              </div>

              <div className="reviews-admin-grid">
                {reviews.map(r => (
                  <div key={r._id} className="review-admin-card glass-panel">
                    <div className="rac-header">
                      <strong>{r.guestName}</strong>
                      <div className="stars-wrap">
                        {Array(r.rating).fill('★').join('')}
                      </div>
                    </div>
                    <p className="rac-comment">"{r.comment}"</p>
                    <small className="rac-date">{new Date(r.date).toLocaleDateString('en-IN')}</small>
                  </div>
                ))}
                {reviews.length === 0 && (
                  <div className="text-center no-notifs">No reviews logged yet.</div>
                )}
              </div>
            </div>
          )}

          {/* TAB 7: ALERTS */}
          {activeTab === 'notifications' && (
            <div className="tab-pane-view glass-panel table-panel">
              <div className="card-header-console flex-between">
                <div>
                  <h3>System Alerts History</h3>
                  <p>Instant notifications of guest online check-ins, payments, and booking requests.</p>
                </div>
                <button className="btn-outline small-btn" onClick={handleClearNotifications}>Clear Alerts Log</button>
              </div>

              <div className="notifs-list">
                {notifications.map(n => (
                  <div key={n._id} className="notif-item-admin glass-panel">
                    <span className="notif-bullet">🔔</span>
                    <div className="notif-body-admin">
                      <h4>{n.title}</h4>
                      <p>{n.message}</p>
                      <small>{new Date(n.createdAt).toLocaleString('en-IN')}</small>
                    </div>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <div className="text-center no-notifs">Occupancy notifications pool is empty.</div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* --- OFFLINE STAY BOOKING FORM MODAL --- */}
      <AnimatePresence>
        {showOfflineModal && (
          <div className="console-modal-overlay no-print">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="glass-panel console-modal-card">
              <div className="modal-header-ci">
                <h3>Direct Phone Stay Registration</h3>
                <button className="btn-close-modal" onClick={() => setShowOfflineModal(false)}>✕</button>
              </div>

              <form onSubmit={handleOfflineBookingSubmit} className="modal-form-ci">
                <div className="grid-2-ci">
                  <div className="form-group-ci">
                    <label>Guest Name</label>
                    <input type="text" value={offlineForm.name} onChange={e => setOfflineForm({...offlineForm, name: e.target.value})} placeholder="Santhosh" required />
                  </div>
                  <div className="form-group-ci">
                    <label>Mobile Number</label>
                    <input type="tel" value={offlineForm.phone} onChange={e => setOfflineForm({...offlineForm, phone: e.target.value})} placeholder="9443710420" required />
                  </div>
                  <div className="form-group-ci">
                    <label>Email Address</label>
                    <input type="email" value={offlineForm.email} onChange={e => setOfflineForm({...offlineForm, email: e.target.value})} placeholder="guest@gmail.com" />
                  </div>
                  <div className="form-group-ci">
                    <label>Room Category</label>
                    <select value={offlineForm.roomType} onChange={e => setOfflineForm({...offlineForm, roomType: e.target.value})}>
                      <option value="non-ac">Non-AC Room (₹1500)</option>
                      <option value="ac">AC Room (₹2000)</option>
                      <option value="suite">Suite Room (₹10000)</option>
                    </select>
                  </div>
                  <div className="form-group-ci">
                    <label>Check-in Date</label>
                    <input type="date" value={offlineForm.checkIn} onChange={e => setOfflineForm({...offlineForm, checkIn: e.target.value})} required />
                  </div>
                  <div className="form-group-ci">
                    <label>Check-out Date</label>
                    <input type="date" value={offlineForm.checkOut} onChange={e => setOfflineForm({...offlineForm, checkOut: e.target.value})} required />
                  </div>
                  <div className="form-group-ci">
                    <label>Room Count</label>
                    <input type="number" min="1" max="11" value={offlineForm.rooms} onChange={e => setOfflineForm({...offlineForm, rooms: e.target.value})} />
                  </div>
                  <div className="form-group-ci">
                    <label>Total Guest Count</label>
                    <input type="number" min="1" max="80" value={offlineForm.guests} onChange={e => setOfflineForm({...offlineForm, guests: e.target.value})} />
                  </div>
                  <div className="form-group-ci">
                    <label>Advance Deposit Amount (₹)</label>
                    <input type="number" value={offlineForm.advancePaid} onChange={e => setOfflineForm({...offlineForm, advancePaid: e.target.value})} />
                  </div>
                  <div className="form-group-ci">
                    <label>Payment Method</label>
                    <select value={offlineForm.paymentMethod} onChange={e => setOfflineForm({...offlineForm, paymentMethod: e.target.value})}>
                      <option value="Cash">Manual Cash</option>
                      <option value="UPI">PhonePe/GPay UPI</option>
                      <option value="Card">Credit/Debit Card</option>
                    </select>
                  </div>
                </div>

                <div className="form-group-ci full-width-ci" style={{ marginTop: '15px' }}>
                  <label>Booking Notes</label>
                  <textarea value={offlineForm.message} onChange={e => setOfflineForm({...offlineForm, message: e.target.value})} placeholder="Any special remarks..." rows="2" />
                </div>

                <button type="submit" className="btn-primary w-full submit-btn-modal">Record Phone Booking</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- CANCELLATION DIALOGUE MODAL --- */}
      <AnimatePresence>
        {cancellationModal.show && (
          <div className="console-modal-overlay no-print">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="glass-panel console-modal-card mini">
              <div className="modal-header-ci">
                <h3>Cancel Stay Reservation</h3>
                <button className="btn-close-modal" onClick={() => setCancellationModal({ show: false, bookingId: '', reason: '' })}>✕</button>
              </div>

              <div className="form-group-ci" style={{ padding: '20px 0' }}>
                <label>Reason for Cancellation <span className="req">*</span></label>
                <input 
                  type="text" 
                  value={cancellationModal.reason} 
                  onChange={e => setCancellationModal({ ...cancellationModal, reason: e.target.value })} 
                  placeholder="e.g. Guest cancelled via phone call / double booked stay"
                  required
                />
              </div>

              <div className="modal-actions-row">
                <button className="btn-outline" onClick={() => setCancellationModal({ show: false, bookingId: '', reason: '' })}>Discard</button>
                <button className="btn-primary warn-btn-submit" onClick={submitCancellation}>Confirm Cancel Stay</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- ROOM ASSIGNMENT MODAL --- */}
      <AnimatePresence>
        {assignRoomModal.show && (
          <div className="console-modal-overlay no-print">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="glass-panel console-modal-card mini">
              <div className="modal-header-ci">
                <h3>Confirm & Assign Room Number</h3>
                <button className="btn-close-modal" onClick={() => setAssignRoomModal({ show: false, booking: null, selectedRoom: '' })}>✕</button>
              </div>

              <div className="form-group-ci" style={{ padding: '20px 0' }}>
                <label>Select Chamber Key to Assign</label>
                <select 
                  value={assignRoomModal.selectedRoom} 
                  onChange={e => setAssignRoomModal({ ...assignRoomModal, selectedRoom: e.target.value })}
                >
                  {rooms
                    .filter(r => r.type === assignRoomModal.booking?.roomType && r.status === 'Available')
                    .map(r => (
                      <option key={r._id} value={r.roomNumber}>Chamber #{r.roomNumber} ({r.type})</option>
                    ))}
                </select>
                <small className="help-text">Chamber statuses release automatically upon guest check-out audits.</small>
              </div>

              <div className="modal-actions-row">
                <button className="btn-outline" onClick={() => setAssignRoomModal({ show: false, booking: null, selectedRoom: '' })}>Discard</button>
                <button className="btn-primary" onClick={submitAssignRoomConfirm}>Assign Room & Confirm Stay</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .admin-console-page { background: var(--bg-body); min-height: 100vh; padding-top: 100px; }
        .admin-container { display: grid; grid-template-columns: 280px 1fr; gap: 30px; }
        
        /* Left Aside panel */
        .console-navigation { display: flex; flex-direction: column; height: calc(100vh - 160px); padding: 30px 20px; position: sticky; top: 100px; background: var(--white); border-radius: 12px; box-shadow: var(--shadow-card); border: 1px solid var(--border-card); }
        .console-brand { display: flex; gap: 12px; align-items: center; border-bottom: 1px solid var(--border-light); padding-bottom: 20px; margin-bottom: 20px; }
        .console-brand h3 { font-size: 1.15rem; font-weight: 700; line-height: 1; color: var(--navy); font-family: var(--font-body); }
        .badge-mgr { font-size: 0.6rem; color: var(--blue-accent); font-weight: 700; letter-spacing: 2px; }

        .nav-menu { display: flex; flex-direction: column; gap: 4px; flex: 1; }
        .nav-link-btn { display: flex; align-items: center; gap: 10px; background: transparent; border: none; color: var(--text-body); padding: 10px 14px; border-radius: 8px; font-weight: 500; font-size: 0.85rem; text-align: left; cursor: pointer; transition: var(--transition); }
        .nav-link-btn:hover { background: var(--bg-section); color: var(--text-dark); }
        .nav-link-btn.active { background: var(--blue-accent); color: var(--white); font-weight: 600; box-shadow: 0 2px 8px rgba(37,99,235,0.3); }
        
        .console-footer-settings { border-top: 1px solid var(--border-light); padding-top: 20px; display: flex; flex-direction: column; gap: 12px; }
        .settings-header-aside { display: flex; align-items: center; gap: 6px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; color: var(--text-muted); }
        .season-toggle-aside-card { display: flex; justify-content: space-between; align-items: center; background: var(--bg-section); border: 1px solid var(--border-light); padding: 10px 14px; border-radius: 8px; }
        .toggle-info-lbl { display: flex; flex-direction: column; gap: 2px; }
        .toggle-info-lbl strong { font-size: 0.8rem; color: var(--text-dark); }
        .toggle-info-lbl span { font-size: 0.6rem; color: var(--text-muted); }
        .toggle-slider-btn { background: transparent; border: none; cursor: pointer; transition: var(--transition-smooth); }
        .logout-btn-aside { padding: 10px 0; font-size: 0.8rem; text-transform: uppercase; font-weight: 600; }

        /* Right Content Body */
        .console-main-body { display: flex; flex-direction: column; gap: 24px; }
        .console-header-bar { display: flex; justify-content: space-between; align-items: center; padding: 20px 30px; background: var(--white); border-radius: 12px; box-shadow: var(--shadow-card); }
        .header-meta .subtitle { font-size: 0.75rem; font-weight: 700; color: var(--blue-accent); }
        .header-meta h2 { font-size: 1.5rem; margin-top: 4px; color: var(--navy); font-family: var(--font-body); }
        .action-meta-buttons { display: flex; gap: 12px; }
        .refresh-btn { font-size: 0.78rem; text-transform: uppercase; padding: 10px 20px; }
        .offline-booking-btn { font-size: 0.78rem; text-transform: uppercase; padding: 10px 20px; font-weight: 700; }
        
        .console-error-alert-banner { display: flex; align-items: center; gap: 12px; background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; padding: 14px 24px; border-radius: 8px; font-size: 0.9rem; }

        /* TAB overview stats */
        .stats-panel-grid { grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .stat-panel-card { padding: 24px 20px; text-align: left; background: var(--white); border-radius: 12px; box-shadow: var(--shadow-card); }
        .stat-panel-card .span-lbl { font-size: 0.7rem; text-transform: uppercase; color: var(--text-muted); letter-spacing: 1px; }
        .stat-panel-card h3 { font-size: 2rem; font-weight: 700; margin: 6px 0; font-family: var(--font-body); color: var(--navy); }
        .stat-panel-card p { font-size: 0.72rem; color: var(--text-muted); margin: 0; }
        .success-color { color: #16a34a !important; }

        .double-overview-columns { grid-template-columns: 1.6fr 1fr; gap: 24px; }
        .occupancy-display-card { padding: 30px; background: var(--white); border-radius: 12px; box-shadow: var(--shadow-card); }
        .card-header-console { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-light); padding-bottom: 14px; margin-bottom: 20px; }
        .card-header-console h3 { font-size: 1.1rem; font-weight: 700; color: var(--navy); font-family: var(--font-body); }
        .flex-between { display: flex; justify-content: space-between; align-items: center; }
        .small-btn { font-size: 0.7rem; padding: 6px 14px; }

        .rooms-occupancy-map { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 12px; }
        .room-cell { display: flex; flex-direction: column; text-align: center; gap: 4px; padding: 12px 8px; background: var(--bg-section); border: 2px solid; border-radius: 8px; transition: var(--transition); }
        .room-cell:hover { transform: translateY(-2px); box-shadow: var(--shadow-card); }
        .room-num { font-size: 1.1rem; font-weight: 700; color: var(--navy); }
        .room-cat { font-size: 0.6rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; }
        .status-label-cell { font-size: 0.7rem; font-weight: 700; }

        .quick-schedule-card { padding: 30px; background: var(--white); border-radius: 12px; box-shadow: var(--shadow-card); display: flex; flex-direction: column; gap: 20px; }
        .quick-schedule-card h3 { font-size: 1.1rem; font-weight: 700; color: var(--navy); font-family: var(--font-body); border-bottom: 1px solid var(--border-light); padding-bottom: 14px; }
        .today-summary-widget { display: flex; justify-content: space-around; text-align: center; align-items: center; background: var(--bg-section); border: 1px solid var(--border-light); padding: 20px; border-radius: 8px; }
        .widget-side { display: flex; flex-direction: column; gap: 4px; }
        .widget-side .num { font-size: 2rem; font-family: var(--font-body); font-weight: 700; line-height: 1; color: var(--navy); }
        .widget-side span { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; }
        .widget-connector { width: 1px; height: 40px; background: var(--border-light); }
        .widget-separator { width: 1px; height: 40px; background: var(--border-light); }
        .occupancy-info-box { display: flex; gap: 12px; background: #eff6ff; border: 1px solid #bfdbfe; padding: 16px; border-radius: 8px; font-size: 0.83rem; line-height: 1.6; align-items: flex-start; color: var(--text-body); }

        /* Tables and grid tabs */
        .table-panel { padding: 30px; background: var(--white); border-radius: 12px; box-shadow: var(--shadow-card); }
        .table-header-lbl { border-bottom: 1px solid var(--border-light); padding-bottom: 14px; margin-bottom: 20px; }
        .table-header-lbl h3 { font-size: 1.1rem; font-weight: 700; color: var(--navy); font-family: var(--font-body); }
        .table-header-lbl p, .table-header-lbl span { color: var(--text-muted); font-size: 0.82rem; margin-top: 2px; }

        .console-table-container { overflow-x: auto; }
        .console-data-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.85rem; }
        .console-data-table th { padding: 12px 16px; color: var(--text-muted); border-bottom: 2px solid var(--border-light); font-weight: 700; text-transform: uppercase; font-size: 0.7rem; letter-spacing: 1px; }
        .console-data-table td { padding: 14px 16px; border-bottom: 1px solid var(--border-light); vertical-align: middle; }
        
        .guest-col { display: flex; flex-direction: column; gap: 2px; }
        .guest-col strong { font-size: 0.9rem; color: var(--text-dark); }
        .guest-col span { font-size: 0.72rem; color: var(--text-muted); }
        .online-tag { background: #ecfdf5; color: #16a34a; display: inline-block; width: max-content; padding: 1px 6px; border-radius: 4px; font-size: 0.6rem; font-weight: 700; text-transform: uppercase; margin-top: 2px; }

        .stay-col { display: flex; flex-direction: column; gap: 2px; }
        .stay-col strong { color: var(--text-dark); }
        .stay-col span { font-size: 0.72rem; color: var(--text-muted); }

        .room-col { display: flex; flex-direction: column; gap: 2px; }
        .room-col span { font-size: 0.72rem; color: var(--text-muted); }
        
        .price-col { display: flex; flex-direction: column; gap: 2px; }
        .price-col strong { color: var(--text-dark); }
        .price-col span { font-size: 0.72rem; color: var(--text-muted); }

        .badge-payment { padding: 3px 10px; border-radius: 4px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; }
        .badge-payment.paid { background: rgba(76,175,80,0.1); color: #4caf50; }
        .badge-payment.due { background: rgba(244,67,54,0.1); color: #f44336; }

        .badge-status { padding: 3px 10px; border-radius: 20px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; }
        .badge-status.Pending { background: #fffbeb; color: #d97706; }
        .badge-status.Confirmed { background: #ecfdf5; color: #16a34a; }
        .badge-status.Cancelled { background: #fef2f2; color: #dc2626; }
        .badge-status.Checked-out { background: var(--bg-section); color: var(--text-muted); }

        .console-actions-row { display: flex; gap: 6px; }
        .console-actions-row button { padding: 5px 10px; border-radius: 6px; font-size: 0.72rem; font-weight: 600; cursor: pointer; border: none; transition: var(--transition); }
        .btn-confirm-action { background: #16a34a; color: white; }
        .btn-confirm-action:hover { background: #15803d; }
        .btn-checkout-action { background: var(--gold-accent); color: white; }
        .btn-checkout-action:hover { background: var(--gold-dark); }
        .btn-cancel-action { background: transparent; border: 1px solid #fecaca !important; color: #dc2626; }
        .btn-cancel-action:hover { background: #fef2f2; }
        .btn-delete-action { background: transparent; border: 1px solid var(--border-light) !important; color: var(--text-muted); display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; padding: 0 !important; }
        .btn-delete-action:hover { color: #dc2626; border-color: #dc2626 !important; }

        .empty-table { padding: 50px 0; color: var(--text-muted); }

        /* Rooms tab grid */
        .rooms-management-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 16px; margin-top: 20px; }
        .room-mgr-card { padding: 20px; background: var(--white); border-radius: 10px; box-shadow: var(--shadow-card); }
        .rmc-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-light); padding-bottom: 10px; margin-bottom: 12px; }
        .rmc-num { font-size: 1.05rem; color: var(--navy); font-family: var(--font-body); }
        .status-pill { font-size: 0.65rem; font-weight: 700; padding: 2px 8px; border-radius: 20px; text-transform: uppercase; }
        .status-pill.Available { background: #ecfdf5; color: #16a34a; }
        .status-pill.Occupied { background: #fffbeb; color: #d97706; }
        .status-pill.Maintenance { background: #fef2f2; color: #dc2626; }
        .rmc-body { font-size: 0.82rem; color: var(--text-body); display: flex; flex-direction: column; gap: 4px; margin-bottom: 12px; }
        .rmc-actions button { width: 100%; padding: 8px 0; border-radius: 6px; border: 1px solid var(--border-light); background: transparent; color: var(--text-body); font-size: 0.72rem; font-weight: 600; cursor: pointer; transition: var(--transition); }
        .rmc-actions button:hover { border-color: var(--blue-accent); color: var(--blue-accent); }
        .btn-action-rmc.warn:hover { border-color: #16a34a; color: #16a34a; }

        .loyalty-badge { padding: 3px 10px; border-radius: 20px; font-size: 0.68rem; font-weight: 700; text-transform: uppercase; }
        .loyalty-badge.new { background: var(--bg-section); color: var(--text-muted); }
        .loyalty-badge.regular { background: #fffbeb; color: #d97706; }
        .loyalty-badge.vip { background: var(--blue-accent); color: white; }
        .payment-mode-label { background: var(--bg-section); border: 1px solid var(--border-light); padding: 2px 8px; border-radius: 4px; font-size: 0.72rem; color: var(--text-dark); }
        .tx-code { font-family: monospace; color: var(--text-muted); font-size: 0.78rem; }

        .reviews-admin-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; margin-top: 20px; }
        .review-admin-card { padding: 20px; background: var(--white); border-radius: 10px; box-shadow: var(--shadow-card); display: flex; flex-direction: column; gap: 10px; }
        .rac-header { display: flex; justify-content: space-between; align-items: flex-start; }
        .rac-header strong { font-size: 0.9rem; color: var(--text-dark); }
        .stars-wrap { color: var(--gold-accent); font-size: 0.85rem; letter-spacing: 2px; }
        .rac-comment { font-size: 0.82rem; color: var(--text-body); line-height: 1.6; font-style: italic; flex: 1; }
        .rac-date { font-size: 0.72rem; color: var(--text-muted); }

        /* System alerts notifs list */
        .notifs-list { display: flex; flex-direction: column; gap: 12px; margin-top: 20px; }
        .notif-item-admin { display: flex; gap: 16px; padding: 20px; background: var(--white); border-radius: 10px; box-shadow: var(--shadow-card); align-items: flex-start; }
        .notif-bullet { font-size: 1.2rem; }
        .notif-body-admin h4 { font-size: 0.9rem; font-weight: 600; color: var(--text-dark); font-family: var(--font-body); margin-bottom: 4px; }
        .notif-body-admin p { font-size: 0.82rem; color: var(--text-body); line-height: 1.5; margin-bottom: 4px; }
        .notif-body-admin small { font-size: 0.68rem; color: var(--text-muted); }
        .no-notifs { padding: 50px 0; color: var(--text-muted); }

        /* MODALS POPUPS */
        .console-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 20px; }
        .console-modal-card { width: 100%; max-width: 700px; padding: 36px; max-height: calc(100vh - 40px); overflow-y: auto; background: var(--white); border-radius: 16px; box-shadow: var(--shadow-xl); }
        .console-modal-card.mini { max-width: 460px; }
        .modal-header-ci { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-light); padding-bottom: 14px; margin-bottom: 20px; }
        .modal-header-ci h3 { font-size: 1.2rem; font-weight: 700; color: var(--navy); font-family: var(--font-body); }
        .btn-close-modal { background: transparent; border: none; color: var(--text-muted); font-size: 1.2rem; cursor: pointer; transition: var(--transition); }
        .btn-close-modal:hover { color: var(--text-dark); }

        .modal-form-ci { display: flex; flex-direction: column; }
        .form-group-ci { margin-bottom: 14px; }
        .form-group-ci label { display: block; font-weight: 600; font-size: 0.82rem; color: var(--text-dark); margin-bottom: 5px; }
        .form-group-ci .req { color: #dc2626; }
        .form-group-ci input, .form-group-ci select, .form-group-ci textarea { width: 100%; padding: 10px 14px; border: 1px solid var(--border-light); border-radius: 8px; font-size: 0.88rem; color: var(--text-dark); background: var(--white); outline: none; transition: var(--transition); font-family: var(--font-body); }
        .form-group-ci input:focus, .form-group-ci select:focus, .form-group-ci textarea:focus { border-color: var(--blue-accent); box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
        .form-group-ci .help-text { font-size: 0.72rem; color: var(--text-muted); margin-top: 4px; display: block; }
        .grid-2-ci { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .w-full { width: 100%; }
        .uppercase { text-transform: uppercase; }
        .submit-btn-modal { padding: 12px 0; font-weight: 700; text-transform: uppercase; margin-top: 20px; }
        .modal-actions-row { display: flex; justify-content: flex-end; gap: 12px; border-top: 1px solid var(--border-light); padding-top: 16px; margin-top: 12px; }
        .warn-btn-submit { background: #dc2626 !important; color: white !important; box-shadow: none !important; border-radius: 50px !important; }
        .warn-btn-submit:hover { background: #b91c1c !important; }

        @media (max-width: 1200px) {
          .admin-container { grid-template-columns: 1fr; }
          .console-navigation { height: auto; position: static; }
          .nav-menu { flex-direction: row; flex-wrap: wrap; }
          .stats-panel-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .stats-panel-grid { grid-template-columns: 1fr; }
          .double-overview-columns { grid-template-columns: 1fr; }
          .console-header-bar { flex-direction: column; gap: 20px; text-align: center; }
          .nav-menu { flex-direction: column; }
        }
      `}} />
    </div>
  );
}
