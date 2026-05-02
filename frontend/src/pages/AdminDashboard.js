import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import {
  LayoutDashboard, Bed, CalendarCheck, Users, CreditCard, PieChart, Settings, MessageSquare, Bell, LogOut, ExternalLink, RefreshCcw, Plus, Trash2, Edit3, CheckCircle, XCircle, Clock, X, MessageCircle, ClipboardCheck, Calendar, Image, Lock
} from 'lucide-react';
import api from '../api/axios';
import './Admin.css';

// --- SHARED COMPONENTS ---

const Modal = ({ title, isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </div>
        {children}
      </div>
    </div>
  );
};

const Sidebar = ({ activeTab, setActiveTab, onLogout, username, unreadCount = 0, unreadReviewCount = 0 }) => {
  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'rooms', label: 'Rooms', icon: <Bed size={20} /> },
    { id: 'bookings', label: 'Bookings', icon: <CalendarCheck size={20} /> },
    { id: 'guests', label: 'Guests', icon: <Users size={20} /> },
    { id: 'payments', label: 'Payments', icon: <CreditCard size={20} /> },
    { id: 'reports', label: 'Reports', icon: <PieChart size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
    { id: 'reviews', label: 'Reviews', icon: <MessageSquare size={20} />, count: unreadReviewCount },
    { id: 'gallery', label: 'Gallery', icon: <Image size={20} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={20} />, count: unreadCount },
  ];

  return (
    <div className="admin-sidebar">
      <div className="sidebar-logo">
        <span className="logo-bss">BSS</span> <span>Residency</span>
      </div>
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <div
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(item.id);
              document.body.classList.remove('sidebar-open');
            }}
          >
            <div style={{ position: 'relative', display: 'flex' }}>
              {item.icon}
              {item.count > 0 && (
                <span className="notif-badge">{item.count}</span>
              )}
            </div>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="user-snippet">
          <div className="user-avatar">{username?.charAt(0).toUpperCase()}</div>
          <div className="user-info">
            <div className="user-name">{username}</div>
            <div className="user-role">Administrator</div>
          </div>
        </div>
        <div className="nav-item" onClick={onLogout} style={{ marginTop: '1rem', color: '#ff4d4d' }}>
          <LogOut size={18} />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

// --- VIEWS ---

const DashboardOverview = ({ stats, bookings, period, setPeriod, selectedMonth, setSelectedMonth }) => {
  if (!stats) return <div className="spinner" />;

  const statCards = [
    { label: 'Total Rooms', value: stats.totalRooms, color: 'purple' },
    { label: 'Total Bookings', value: stats.totalBookings, color: 'blue' },
    { label: 'Available Rooms', value: stats.availableRooms, color: 'green' },
    { label: 'Today Check-ins', value: stats.checkInsToday, color: 'orange' },
    { label: 'Today Check-outs', value: stats.checkOutsToday, color: 'red' },
  ];

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });

  return (
    <div className="view-content fade-in">
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fff', padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <Calendar size={16} color="#64748b" />
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            style={{ border: 'none', fontWeight: 600, color: '#475569', outline: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            <option value="month">Month View</option>
            <option value="all">All Time</option>
          </select>
          {period === 'month' && (
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{ border: 'none', borderLeft: '1px solid #eee', paddingLeft: '0.5rem', fontWeight: 600, color: 'var(--admin-primary)', outline: 'none', fontSize: '0.85rem' }}
            />
          )}
        </div>
      </div>

      <div className="stats-grid">
        {statCards.map(s => (
          <div key={s.label} className="stat-card">
            <span className="stat-label">{s.label}</span>
            <span className="stat-value">{s.value}</span>
            <div style={{ fontSize: '0.75rem', color: '#68d391' }}>Real-time update</div>
          </div>
        ))}
      </div>

      <div className="dash-layout">
        <div className="card">
          <div className="card-header">
            <h3>Revenue Summary</h3>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--admin-primary)' }}>
              ₹{stats.totalRevenue?.toLocaleString('en-IN')}
            </span>
          </div>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <AreaChart data={stats.revenueHistory}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--admin-primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--admin-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, angle: -30, textAnchor: 'end' }} 
                  interval={0}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="amount" stroke="var(--admin-primary)" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Recent Bookings</h3>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Guest</th>
                  <th>Room</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 5).map(b => (
                  <tr key={b._id}>
                    <td><div style={{ fontWeight: 600 }}>{b.name}</div><div style={{ fontSize: '0.7rem', color: '#888' }}>{formatDate(b.checkIn)}</div></td>
                    <td>{b.roomType}</td>
                    <td><span className={`status-pill status-${b.status}`}>{b.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const RoomManagement = ({ rooms, onAddClick, onDeleteRoom, onUpdateRoom }) => {
  return (
    <div className="view-content fade-in">
      <div className="card-header" style={{ marginBottom: '1.5rem' }}>
        <p style={{ color: '#666' }}>Manage your inventory and pricing</p>
        <button onClick={onAddClick} className="admin-btn admin-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Add Room
        </button>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        {rooms.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>No rooms added yet.</div>
        ) : rooms.map(room => (
          <div key={room._id} className="card room-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>#{room.roomNumber}</div>
                <div style={{ fontSize: '0.85rem', color: '#666' }}>{room.type}</div>
              </div>
              <span className={`status-pill status-${room.status}`}>{room.status}</span>
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--admin-primary)', marginBottom: '1rem' }}>
              ₹{room.price}/night
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="admin-btn admin-btn-outline"
                onClick={() => onUpdateRoom(room)}
                style={{ flex: 1, height: '36px', padding: 0 }}
              >
                <Edit3 size={16} />
              </button>
              <button
                className="admin-btn admin-btn-outline"
                onClick={() => onDeleteRoom(room._id)}
                style={{ flex: 1, height: '36px', padding: 0, color: '#ff4d4d' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const BookingManagement = ({ bookings = [], rooms = [], period, setPeriod, onConfirm, onCancel, onWhatsApp, onCheckOut, onUpdateRoomNumber, onDelete, onAddPayment, onViewCheckin, formatDate }) => {
  const [filter, setFilter] = React.useState('All');

  const safeBookings = Array.isArray(bookings) ? bookings : [];
  const filteredBookings = filter === 'All'
    ? safeBookings
    : safeBookings.filter(b => b && b.status === filter);

  return (
    <div className="card">
      <div className="card-header" style={{ marginBottom: '1rem' }}>
        <h3 style={{ margin: 0 }}>Booking Management</h3>
      </div>
      
      <div className="filter-tabs-row" style={{ marginBottom: '1.5rem', padding: '0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div className="filter-tabs" style={{ 
          display: 'flex', 
          gap: '0.6rem', 
          background: '#f1f5f9', 
          padding: '0.5rem', 
          borderRadius: '10px', 
          overflowX: 'auto', 
          flexWrap: 'nowrap', 
          msOverflowStyle: 'none', 
          scrollbarWidth: 'none', 
          width: '100%',
          justifyContent: 'flex-start',
          alignItems: 'center',
          touchAction: 'pan-x',
          WebkitOverflowScrolling: 'touch'
        }}>
          <div style={{ minWidth: '30px', height: '1px' }} /> {/* Large Spacer */}
          {['All', 'Pending', 'Confirmed', 'Checked-out', 'Cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              style={{
                padding: '0.5rem 1.4rem',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                background: filter === tab ? 'white' : 'transparent',
                color: filter === tab ? 'var(--admin-primary)' : '#64748b',
                boxShadow: filter === tab ? '0 2px 5px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              {tab}
            </button>
          ))}
          <div style={{ minWidth: '30px', height: '1px' }} />
        </div>
      </div>
        <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
          <div>Showing <strong>{filteredBookings.length}</strong> bookings</div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fff', padding: '0.2rem 0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              style={{ border: 'none', fontWeight: 600, color: '#475569', outline: 'none', cursor: 'pointer' }}
            >
              <option value="month">Month View</option>
              <option value="all">All Time</option>
            </select>

            {period === 'month' && (
              <input
                type="month"
                value={window.selectedMonthGlobal || ''}
                onChange={(e) => window.setSelectedMonthGlobal(e.target.value)}
                style={{ border: 'none', borderLeft: '1px solid #eee', paddingLeft: '0.5rem', fontWeight: 600, color: 'var(--admin-primary)', outline: 'none' }}
              />
            )}
          </div>
        </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Guest</th>
              <th>Phone</th>
              <th>Room</th>
              <th>Check-in/out</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>No {filter !== 'All' ? filter.toLowerCase() : ''} bookings found.</td></tr>
            ) : filteredBookings.map((b, i) => (
              <tr key={b._id}>
                <td>{i + 1}</td>
                <td>
                  <div style={{ fontWeight: 600 }}>{b.name || 'Unknown'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--admin-primary)', fontWeight: 600 }}>
                    #{b.bookingId || (b._id ? String(parseInt(b._id.toString().slice(-6), 16)).padStart(6, '0').slice(-6) : 'N/A')}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#888' }}>{b.email || ''}</div>
                </td>
                <td>{b.phone}</td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div style={{ fontWeight: 600 }}>{b.roomType}</div>
                    <select
                      value={b.roomNumber || ''}
                      onChange={(e) => onUpdateRoomNumber(b._id, e.target.value)}
                      style={{ width: '130px', fontSize: '0.8rem', padding: '4px 8px', borderRadius: '4px', border: '1px solid #ddd', backgroundColor: '#f9fafb', cursor: 'pointer' }}
                    >
                      <option value="">Assign Room</option>
                      {rooms.map(r => (
                        <option key={r.roomNumber} value={r.roomNumber}>
                          {r.roomNumber} ({r.type.split(' ')[0]})
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
                <td style={{ fontSize: '0.85rem' }}>
                  {formatDate(b.checkIn)} -<br />{formatDate(b.checkOut)}
                </td>
                <td>
                  <span className={`status-pill status-${b.status?.replace(' ', '-') || 'Pending'}`}>{b.status || 'Pending'}</span>
                  {b.checkedInOnline && (
                    <span style={{ display: 'block', marginTop: '4px', fontSize: '0.68rem', background: '#d1fae5', color: '#065f46', borderRadius: '4px', padding: '2px 6px', fontWeight: 700 }}>
                      🧾 Online CI Done
                    </span>
                  )}
                </td>
                <td>
                  <div className="admin-actions-container">
                    {/* Status Management */}
                    <div className="action-stack">
                      {b.status === 'Pending' && (
                        <button className="action-btn-main confirm" onClick={() => onConfirm(b._id, b)}>
                          <CheckCircle size={15} /> Confirm Booking
                        </button>
                      )}

                      {b.status === 'Confirmed' && (
                        <button className="action-btn-main confirm" onClick={() => onCheckOut(b._id, b)} style={{ background: '#6366f1', borderColor: '#6366f1', color: '#fff' }}>
                          <LogOut size={15} /> Check-out
                        </button>
                      )}

                      <button className="action-btn-main whatsapp" onClick={() => onWhatsApp(b)}>
                        <MessageSquare size={15} /> WhatsApp Guest
                      </button>

                      {(b.status === 'Pending' || b.status === 'Confirmed') && (
                        <button className="action-btn-main cancel" onClick={() => onCancel(b._id, b)}>
                          <XCircle size={15} /> Cancel Booking
                        </button>
                      )}
                    </div>

                    {/* Secondary Utilities */}
                    <div className="action-footer">
                      {b.checkedInOnline && (
                        <button className="action-btn-main checkin" onClick={() => onViewCheckin(b)} style={{ background: '#065f46', borderColor: '#065f46', color: '#fff' }}>
                          <ClipboardCheck size={15} /> View Check-in
                        </button>
                      )}
                      <button className="action-btn-main payment" onClick={() => onAddPayment(b)}>
                        <CreditCard size={15} /> Add Payment
                      </button>
                      <button className="action-link delete" onClick={() => onDelete(b._id)}>
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Payments = ({ payments, totalRevenue }) => {
  return (
    <div className="view-content fade-in">
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total Revenue</span>
          <span className="stat-value">₹{totalRevenue?.toLocaleString('en-IN') || 0}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Active Payments</span>
          <span className="stat-value">{payments.length}</span>
        </div>
      </div>
      <div className="card">
        <h3>Transaction History</h3>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Guest</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>No payment records.</td></tr>
              ) : payments.map(p => (
                <tr key={p._id}>
                  <td style={{ fontWeight: 600 }}>{p.guestName}</td>
                  <td>{new Date(p.date).toLocaleDateString()}</td>
                  <td style={{ fontWeight: 700 }}>₹{p.amount}</td>
                  <td>{p.method}</td>
                  <td><span className={`status-pill status-${p.status === 'Paid' ? 'Confirmed' : (p.status === 'Pending' ? 'Pending' : 'Cancelled')}`}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Reports = ({ stats, period, setPeriod, selectedMonth, setSelectedMonth }) => {
  return (
    <div className="view-content fade-in">
      <div className="card-header" style={{ marginBottom: '1.5rem', justifyContent: 'flex-end' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: '#fff', padding: '0.3rem 0.6rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            style={{ border: 'none', fontWeight: 600, color: '#475569', outline: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            <option value="month">Month View</option>
            <option value="all">All Time</option>
          </select>

          {period === 'month' && (
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{ border: 'none', borderLeft: '1px solid #eee', paddingLeft: '0.8rem', fontWeight: 700, color: 'var(--admin-primary)', outline: 'none', fontSize: '0.85rem' }}
            />
          )}
        </div>
      </div>

      <div className="dash-layout">
        <div className="card">
          <div className="card-header">
            <h3>Occupancy by Room Type</h3>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              {period === 'all' ? 'All bookings' : `Bookings in ${new Date(selectedMonth).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}`}
            </span>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={stats?.byRoom || []} margin={{ bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis 
                  dataKey="_id" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, angle: -30, textAnchor: 'end' }} 
                  interval={0}
                />
                <YAxis axisLine={false} tickLine={false} allowDecimals={false} tick={{ fontSize: 10 }} />
                <Tooltip cursor={{ fill: 'rgba(212, 168, 87, 0.05)' }} />
                <Bar dataKey="count" fill="var(--admin-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <h3>Key Metrics</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="stat-card">
              <span className="stat-label">Avg Rev / Booking</span>
              <span className="stat-value">₹{(stats?.totalRevenue / (stats?.totalBookings || 1)).toFixed(0)}</span>
              <div style={{ fontSize: '0.7rem', color: '#888', marginTop: '4px' }}>Based on {stats?.totalBookings} bookings</div>
            </div>
            <div className="stat-card">
              <span className="stat-label">Confirmation Rate</span>
              <span className="stat-value">{((stats?.confirmed / (stats?.totalBookings || 1)) * 100).toFixed(1)}%</span>
              <div style={{ fontSize: '0.7rem', color: '#888', marginTop: '4px' }}>{stats?.confirmed} of {stats?.totalBookings} confirmed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsView = ({ isSeason, onToggleSeason }) => (
  <div className="view-content fade-in">
    <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>System Settings</h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>Manage your lodge's global configuration and seasonal pricing.</p>
      </div>

      <div className="settings-section" style={{ marginBottom: '2.5rem', padding: '1.5rem', background: isSeason ? '#fffbeb' : '#f8fafc', borderRadius: '16px', border: '1px solid', borderColor: isSeason ? '#fef3c7' : '#e2e8f0', transition: 'all 0.3s ease' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem' }}>{isSeason ? '🔥' : '❄️'}</span>
              <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>Peak Season Pricing</h4>
            </div>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', lineHeight: '1.5' }}>
              When activated, the website will automatically transition to peak season rates (₹1300 / ₹2500).
            </p>
          </div>
          <div
            onClick={() => onToggleSeason(!isSeason)}
            style={{
              width: '64px',
              height: '32px',
              background: isSeason ? '#d4a857' : '#cbd5e1',
              borderRadius: '20px',
              position: 'relative',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: isSeason ? '0 4px 12px rgba(212, 168, 87, 0.3)' : 'none'
            }}
          >
            <div style={{
              width: '26px',
              height: '26px',
              background: 'white',
              borderRadius: '50%',
              position: 'absolute',
              top: '3px',
              left: isSeason ? '35px' : '3px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
            }} />
          </div>
        </div>
        
        <div style={{ 
          marginTop: '1.25rem', 
          padding: '10px 15px', 
          background: isSeason ? 'rgba(212, 168, 87, 0.1)' : 'rgba(107, 114, 128, 0.05)', 
          borderRadius: '10px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px' 
        }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isSeason ? '#d4a857' : '#64748b', animation: isSeason ? 'pulse 2s infinite' : 'none' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isSeason ? '#92400e' : '#475569' }}>
            {isSeason ? 'PEAK SEASON RATES ARE LIVE' : 'REGULAR RATES ARE LIVE'}
          </span>
        </div>
      </div>

      <form className="settings-form" style={{ display: 'grid', gap: '1.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '2rem', marginTop: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Lock size={20} color="var(--admin-primary)" />
          <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>Security & Login</h4>
        </div>
        <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>Update your admin credentials. You will be logged out after changing these.</p>
        
        <div className="form-row" style={{ marginBottom: 0 }}>
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.85rem', color: '#475569' }}>New Username</label>
            <input 
              type="text" 
              id="new-username"
              placeholder="Leave blank to keep current"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', fontSize: '0.95rem' }} 
            />
          </div>
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.85rem', color: '#475569' }}>New Password</label>
            <input 
              type="password" 
              id="new-password"
              placeholder="Minimum 6 characters"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', fontSize: '0.95rem' }} 
            />
          </div>
        </div>

        <div style={{ padding: '1rem', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fee2e2' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.85rem', color: '#991b1b' }}>Current Password (Required to Save)</label>
          <input 
            type="password" 
            id="current-password"
            required
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #fecaca', background: '#fff', fontSize: '0.95rem' }} 
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <button 
            type="button" 
            className="admin-btn admin-btn-primary" 
            style={{ padding: '0.75rem 2.5rem', background: '#1e293b' }}
            onClick={async () => {
              const newU = document.getElementById('new-username').value;
              const newP = document.getElementById('new-password').value;
              const currP = document.getElementById('current-password').value;
              
              if (!currP) return alert('Current password is required');
              if (newP && newP.length < 6) return alert('New password must be at least 6 characters');
              
              if (!window.confirm('Are you sure you want to change your login credentials? You will be logged out.')) return;
              
              const auth = JSON.parse(sessionStorage.getItem('bss_admin'));
              try {
                const headers = { username: auth.username, password: auth.password };
                await api.patch('/api/admin/profile', {
                  oldUsername: auth.username,
                  oldPassword: currP,
                  newUsername: newU || undefined,
                  newPassword: newP || undefined
                }, { headers });
                
                alert('Success! Please login with your new credentials.');
                sessionStorage.removeItem('bss_admin');
                window.location.reload();
              } catch (err) {
                alert(err.response?.data?.message || 'Error updating profile');
              }
            }}
          >
            Save Security Settings
          </button>
        </div>
      </form>
    </div>
  </div>
);

const ReviewsView = ({ reviews, onDeleteReview, period, setPeriod, selectedMonth, setSelectedMonth }) => {
  return (
    <div className="view-content fade-in">
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fff', padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <Calendar size={16} color="#64748b" />
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            style={{ border: 'none', fontWeight: 600, color: '#475569', outline: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            <option value="month">Month View</option>
            <option value="all">All Time</option>
          </select>

          {period === 'month' && (
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{ border: 'none', borderLeft: '1px solid #eee', paddingLeft: '0.5rem', fontWeight: 600, color: 'var(--admin-primary)', outline: 'none', fontSize: '0.85rem' }}
            />
          )}
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="card">No guest reviews yet for this period.</div>
      ) : reviews.map(r => (
        <div key={r._id} className="card" style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: 700 }}>{r.guestName}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ color: '#d4a857' }}>{'★'.repeat(r.rating)}</span>
              <button
                onClick={() => onDeleteReview(r._id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ff4d4d',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '4px',
                  transition: 'background 0.2s'
                }}
                className="delete-review-btn"
                title="Delete Review"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
          <p style={{ color: '#555', fontSize: '0.9rem' }}>"{r.comment}"</p>
          <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.5rem' }}>{new Date(r.date).toLocaleDateString()}</div>
        </div>
      ))}
    </div>
  );
};

const GalleryManagement = ({ auth }) => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'Room', image: null });

  const fetchImages = useCallback(async () => {
    try {
      const res = await api.get('/api/gallery');
      if (res.data.success) setImages(res.data.images);
    } catch (err) {
      console.error('Fetch gallery error:', err);
    }
  }, []);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  const handleFileChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!form.image) return alert('Select an image');
    setUploading(true);
    const formData = new FormData();
    formData.append('image', form.image);
    formData.append('title', form.title);
    formData.append('category', form.category);

    try {
      const headers = { 
        username: auth.username, 
        password: auth.password 
      };
      await api.post('/api/gallery/upload', formData, { headers });
      setForm({ title: '', category: 'Room', image: null });
      fetchImages();
      alert('Uploaded successfully!');
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete image?')) return;
    try {
      const headers = { username: auth.username, password: auth.password };
      await api.delete(`/api/gallery/${id}`, { headers });
      fetchImages();
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="view-content fade-in">
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3>Upload New Photo</h3>
        <form onSubmit={handleUpload} style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
          <div className="form-row">
            <div className="form-group">
              <label>Title / Caption</label>
              <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Deluxe Room View" />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                <option value="Room">Rooms</option>
                <option value="Exterior">Exterior</option>
                <option value="Nearby">Nearby</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Select Image File</label>
            <input type="file" accept="image/*" onChange={handleFileChange} style={{ border: '1px solid #ddd', padding: '0.5rem', borderRadius: '4px' }} />
          </div>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload to Gallery'}
          </button>
        </form>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
        {images.map(img => (
          <div key={img._id} className="card" style={{ padding: '0.5rem', position: 'relative' }}>
            <img 
              src={`${process.env.REACT_APP_API_URL || 'https://bss-residency-2.onrender.com'}${img.imageUrl}`} 
              alt={img.title} 
              style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }} 
            />
            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', fontWeight: 600 }}>{img.title || 'Untitled'}</div>
            <div style={{ fontSize: '0.7rem', color: '#666' }}>{img.category}</div>
            <button 
              onClick={() => handleDelete(img._id)}
              style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255, 77, 77, 0.9)', color: 'white', border: 'none', borderRadius: '4px', padding: '4px', cursor: 'pointer' }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const NotificationsView = ({ notifications, period, setPeriod, selectedMonth, setSelectedMonth }) => {
  return (
    <div className="view-content fade-in">
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fff', padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <Calendar size={16} color="#64748b" />
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            style={{ border: 'none', fontWeight: 600, color: '#475569', outline: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            <option value="month">Month View</option>
            <option value="all">All Time</option>
          </select>

          {period === 'month' && (
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{ border: 'none', borderLeft: '1px solid #eee', paddingLeft: '0.5rem', fontWeight: 600, color: 'var(--admin-primary)', outline: 'none', fontSize: '0.85rem' }}
            />
          )}
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="card">No notifications yet for this period.</div>
      ) : notifications.map(a => (
        <div key={a._id} className="card" style={{ marginBottom: '1rem', borderLeft: '4px solid var(--admin-primary)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ background: '#fdfaf4', padding: '0.75rem', borderRadius: '50%', color: 'var(--admin-primary)' }}>
            {a.type === 'booking' ? <CalendarCheck size={20} /> : (a.type === 'wa' ? <MessageSquare size={20} /> : <Clock size={20} />)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{a.title}</div>
            <div style={{ fontSize: '0.85rem', color: '#666' }}>{a.message}</div>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#aaa' }}>{new Date(a.date).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
};

// --- MAIN DASHBOARD ---

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [guests, setGuests] = useState([]);
  const [payments, setPayments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadReviewCount, setUnreadReviewCount] = useState(0);
  const [isSeason, setIsSeason] = useState(false);
  const [statsPeriod, setStatsPeriod] = useState('all');
  const [bookingsPeriod, setBookingsPeriod] = useState('month');
  const [reviewsPeriod, setReviewsPeriod] = useState('month');
  const [notificationsPeriod, setNotificationsPeriod] = useState('month');
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
  const [loading, setLoading] = useState(true);

  // Global access for shared components
  window.selectedMonthGlobal = selectedMonth;
  window.setSelectedMonthGlobal = setSelectedMonth;
  const prevBookingCountRef = useRef(0);
  const audioRef = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'));

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomForm, setRoomForm] = useState({ roomNumber: '', type: 'AC Double Bed', price: '', status: 'Available' });
  const [editingRoomId, setEditingRoomId] = useState(null);

  // Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({ guestName: '', bookingId: '', amount: '', method: 'Cash', status: 'Paid' });
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Check-in Modal State
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);
  const [selectedCheckin, setSelectedCheckin] = useState(null);

  const fetchData = useCallback(async () => {
    if (!auth) return;
    // Only show loading spinner on initial load
    if (!stats) setLoading(true);
    const [year, month] = selectedMonth.split('-');
    const headers = { username: auth.username, password: auth.password };
    try {
      const [statsRes, bookingsRes, roomsRes, guestsRes, paymentsRes, reviewsRes, notifRes, settingsRes] = await Promise.all([
        api.get('/api/admin/stats', { headers, params: { period: statsPeriod, month, year } }),
        api.get('/api/admin/bookings', { headers, params: { page: 1, limit: 100, period: bookingsPeriod, month, year } }),
        api.get('/api/admin/rooms', { headers }),
        api.get('/api/admin/guests', { headers }),
        api.get('/api/admin/payments', { headers }),
        api.get('/api/admin/reviews', { headers, params: { period: reviewsPeriod, month, year } }),
        api.get('/api/admin/notifications', { headers, params: { period: notificationsPeriod, month, year } }),
        api.get('/api/admin/settings', { headers })
      ]);
      setStats(statsRes.data.stats);
      setBookings(bookingsRes.data.bookings);
      setRooms(roomsRes.data.rooms);
      setGuests(guestsRes.data.guests);
      setPayments(paymentsRes.data.payments);
      setIsSeason(settingsRes.data.settings.isSeason);
      const finalReviews = reviewsRes.data.reviews;
      const seenReviews = parseInt(localStorage.getItem('bss_seen_reviews_count') || '0');
      if (activeTab !== 'reviews' && finalReviews.length > seenReviews) {
        setUnreadReviewCount(finalReviews.length - seenReviews);
      } else if (activeTab === 'reviews') {
        localStorage.setItem('bss_seen_reviews_count', finalReviews.length.toString());
      }
      setReviews(finalReviews);

      const finalNotifs = notifRes.data.notifications;
      const seenNotifs = parseInt(localStorage.getItem('bss_seen_notifs_count') || '0');
      if (activeTab !== 'notifications' && finalNotifs.length > seenNotifs) {
        setUnreadCount(finalNotifs.length - seenNotifs);
      } else if (activeTab === 'notifications') {
        localStorage.setItem('bss_seen_notifs_count', finalNotifs.length.toString());
      }

      setNotifications(finalNotifs);

      // Check for new bookings to trigger alert
      const currentCount = bookingsRes.data.bookings.length;
      if (prevBookingCountRef.current > 0 && currentCount > prevBookingCountRef.current) {
        // Play sound
        audioRef.current.play().catch(e => console.log('Audio play blocked:', e));
        // Browser Alert
        if (Notification.permission === 'granted') {
          new Notification('New Booking Received! 🔔', {
            body: `You have a new booking from ${bookingsRes.data.bookings[0].name}`,
            icon: '/favicon.ico'
          });
        } else {
          alert('New Booking Received! 🔔 Check the bookings list.');
        }
      }
      prevBookingCountRef.current = currentCount;
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [auth, statsPeriod, bookingsPeriod, reviewsPeriod, notificationsPeriod, selectedMonth]);

  useEffect(() => {
    if (activeTab === 'notifications') {
      setUnreadCount(0);
      localStorage.setItem('bss_seen_notifs_count', notifications.length.toString());
    }
    if (activeTab === 'reviews') {
      setUnreadReviewCount(0);
      localStorage.setItem('bss_seen_reviews_count', reviews.length.toString());
    }
  }, [activeTab, notifications.length, reviews.length]);

  useEffect(() => {
    const stored = sessionStorage.getItem('bss_admin');
    if (!stored) { navigate('/admin/login'); return; }
    setAuth(JSON.parse(stored));
  }, [navigate]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Request Notification Permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Silent Polling: Auto refresh every 30 seconds for alerts/sound
  useEffect(() => {
    fetchData(); // Initial fetch
    const interval = setInterval(() => {
      // Background fetch without showing loading spinner
      fetchData();
    }, 120000); // Refresh every 2 minutes instead of 30s
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    const headers = { username: auth.username, password: auth.password };
    try {
      if (editingRoomId) {
        await api.patch(`/api/admin/rooms/${editingRoomId}`, roomForm, { headers });
      } else {
        await api.post('/api/admin/rooms', roomForm, { headers });
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert('Error saving room: ' + err.message);
    }
  };

  const openAddModal = () => {
    setRoomForm({ roomNumber: '', type: 'AC Double Bed', price: '', status: 'Available' });
    setEditingRoomId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (room) => {
    setRoomForm({ roomNumber: room.roomNumber, type: room.type, price: room.price, status: room.status });
    setEditingRoomId(room._id);
    setIsModalOpen(true);
  };

  const handleDeleteRoom = async (id) => {
    if (!window.confirm('Delete this room?')) return;
    const headers = { username: auth.username, password: auth.password };
    await api.delete(`/api/admin/rooms/${id}`, { headers });
    fetchData();
  };

  const handleUpdateStatus = async (id, status) => {
    const headers = { username: auth.username, password: auth.password };
    const res = await api.patch(`/api/admin/bookings/${id}`, { status }, { headers });
    // If backend returns a waLink (on confirm/cancel), open it automatically
    if (res.data?.waLink) {
      window.open(res.data.waLink, '_blank');
    }
    fetchData();
  };

  // Confirm a booking → update status + auto-open WhatsApp
  const handleConfirmBooking = async (id, booking) => {
    if (!window.confirm(`Confirm booking for ${booking.name}? WhatsApp will open to notify the guest.`)) return;
    const headers = { username: auth.username, password: auth.password };
    try {
      const res = await api.patch(`/api/admin/bookings/${id}`, { status: 'Confirmed' }, { headers });
      if (res.data?.waLink) {
        window.open(res.data.waLink, '_blank');
      }
      fetchData();
    } catch (err) {
      alert('Error confirming booking: ' + err.message);
    }
  };

  // Cancel a booking → update status + auto-open WhatsApp
  const handleCancelBooking = async (id, booking) => {
    const reason = window.prompt(`Cancellation reason for ${booking.name} (optional):`, '') || '';
    if (reason === null) return; // user hit Cancel on prompt
    const headers = { username: auth.username, password: auth.password };
    try {
      const res = await api.patch(`/api/admin/bookings/${id}`, { status: 'Cancelled', cancellationReason: reason }, { headers });
      if (res.data?.waLink) {
        window.open(res.data.waLink, '_blank');
      }
      fetchData();
    } catch (err) {
      alert('Error cancelling booking: ' + err.message);
    }
  };

  // Open WhatsApp for a booking
  const handleWhatsAppBooking = (booking) => {
    const checkIn = new Date(booking.checkIn).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const checkOut = new Date(booking.checkOut).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const msg = 
      `✅ *BSS Residency – Booking Update*\n\n` +
      `Dear ${booking.name},\n\n` +
      `Regarding your booking (ID: *${booking.bookingId || booking._id}*):\n\n` +
      `🛏️ Room: *${booking.roomType}*${booking.roomNumber ? ` (Room #${booking.roomNumber})` : ''}\n` +
      `📅 Check-in: *${checkIn}*\n` +
      `📅 Check-out: *${checkOut}*\n` +
      `📊 Status: *${booking.status}*\n\n` +
      `📍 BSS Residency, Bus Stand, Near Anna Statue, Courtallam – 627 802\n\n` +
      `Thank you! 🙏`;
    const phone = booking.phone.replace(/[^0-9]/g, '');
    const formatted = phone.startsWith('91') ? phone : `91${phone}`;
    window.open(`https://wa.me/${formatted}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Open Add Payment modal for a specific booking
  const openAddPaymentModal = (booking) => {
    setPaymentForm({
      guestName: booking.name,
      bookingId: booking._id,
      amount: '',
      method: 'Cash',
      status: 'Paid',
    });
    setIsPaymentModalOpen(true);
  };

  const openCheckinModal = (booking) => {
    setSelectedCheckin(booking);
    setIsCheckinModalOpen(true);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!paymentForm.amount || Number(paymentForm.amount) <= 0) {
      alert('Please enter a valid amount.');
      return;
    }
    setPaymentLoading(true);
    const headers = { username: auth.username, password: auth.password };
    try {
      await api.post('/api/admin/payments', paymentForm, { headers });
      setIsPaymentModalOpen(false);
      fetchData();
    } catch (err) {
      alert('Error recording payment: ' + err.message);
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleDeleteGuest = async (id) => {
    if (!window.confirm('Are you sure you want to delete this guest record?')) return;
    const headers = { username: auth.username, password: auth.password };
    try {
      await api.delete(`/api/admin/guests/${id}`, { headers });
      fetchData();
    } catch (err) {
      console.error('Error deleting guest:', err);
      alert('Failed to delete guest record.');
    }
  };

  const handleUpdateRoomNumber = async (id, roomNumber) => {
    const headers = { username: auth.username, password: auth.password };
    await api.patch(`/api/admin/bookings/${id}`, { roomNumber }, { headers });
    // Local update for better UX before refresh
    setBookings(prev => prev.map(b => b._id === id ? { ...b, roomNumber } : b));
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    const headers = { username: auth.username, password: auth.password };
    await api.delete(`/api/admin/bookings/${id}`, { headers });
    fetchData();
  };

  const handleCheckOut = async (id, booking) => {
    if (!window.confirm(`Complete Check-out for ${booking.name}?`)) return;
    const headers = { username: auth.username, password: auth.password };
    try {
      await api.patch(`/api/admin/bookings/${id}`, { status: 'Checked-out' }, { headers });
      
      // WhatsApp Feedback Message Link
      const guestPhone = booking.phone.replace(/[^0-9]/g, '');
      const formattedPhone = guestPhone.startsWith('91') ? guestPhone : `91${guestPhone}`;
      const msg = `Hello ${booking.name}! 👋\n\nThank you for staying at *BSS Residency*. We hope you had a pleasant stay!\n\nWe would love to hear about your experience. Please share your valuable feedback/review here:\n🔗 https://g.page/r/YOUR_GOOGLE_REVIEW_ID/review\n\nWe look forward to hosting you again! 😊`;
      const waUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(msg)}`;
      
      window.open(waUrl, '_blank');
      fetchData();
    } catch (err) {
      alert('Error during check-out: ' + err.message);
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    const headers = { username: auth.username, password: auth.password };
    try {
      await api.delete(`/api/admin/reviews/${id}`, { headers });
      fetchData();
    } catch (err) {
      alert('Error deleting review: ' + err.message);
    }
  };

  const logout = () => {
    sessionStorage.removeItem('bss_admin');
    navigate('/admin/login');
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

  const renderView = () => {
    switch (activeTab) {
      case 'overview': return <DashboardOverview 
        stats={stats} 
        bookings={bookings} 
        period={statsPeriod}
        setPeriod={setStatsPeriod}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
      />;
      case 'rooms': return <RoomManagement rooms={rooms} onAddClick={openAddModal} onDeleteRoom={handleDeleteRoom} onUpdateRoom={openEditModal} />;
      case 'bookings': return <BookingManagement
        bookings={bookings}
        rooms={rooms}
        period={bookingsPeriod}
        setPeriod={setBookingsPeriod}
        onConfirm={handleConfirmBooking}
        onCancel={handleCancelBooking}
        onWhatsApp={handleWhatsAppBooking}
        onCheckOut={handleCheckOut}
        onUpdateRoomNumber={handleUpdateRoomNumber}
        onDelete={handleDeleteBooking}
        onAddPayment={openAddPaymentModal}
        onViewCheckin={openCheckinModal}
        formatDate={formatDate}
      />;
      case 'guests':
        return (
          <div className="card fade-in">
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Guest Name</th>
                    <th>Phone</th>
                    <th>Total Stays</th>
                    <th>Level</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {guests.length === 0 ? (
                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No guest records.</td></tr>
                  ) : guests.map(g => (
                    <tr key={g._id}>
                      <td style={{ fontWeight: 600 }}>{g.name}</td>
                      <td>{g.phone}</td>
                      <td>{g.totalStays}</td>
                      <td><span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--admin-primary)', fontWeight: 700 }}>{g.loyaltyLevel}</span></td>
                      <td>
                        <button
                          className="action-link delete"
                          onClick={() => handleDeleteGuest(g._id)}
                          style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#e74c3c' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'payments': return <Payments payments={payments} totalRevenue={stats?.totalRevenue} />;
      case 'reports': return <Reports stats={stats} period={statsPeriod} setPeriod={setStatsPeriod} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />;
      case 'settings': return <SettingsView isSeason={isSeason} onToggleSeason={async (val) => {
        const headers = { username: auth.username, password: auth.password };
        try {
          await api.patch('/api/admin/settings', { isSeason: val }, { headers });
          setIsSeason(val);
        } catch (err) {
          alert('Error updating season mode');
        }
      }} />;
      case 'reviews': return <ReviewsView 
        reviews={reviews} 
        onDeleteReview={handleDeleteReview} 
        period={reviewsPeriod}
        setPeriod={setReviewsPeriod}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
      />;
      case 'notifications': return <NotificationsView 
        notifications={notifications} 
        period={notificationsPeriod}
        setPeriod={setNotificationsPeriod}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
      />;
      case 'gallery': return <GalleryManagement auth={auth} />;
      default: return <div className="card">Coming Soon...</div>;
    }
  };

  return (
    <div className="admin-dashboard">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={logout} username={auth?.username} unreadCount={unreadCount} unreadReviewCount={unreadReviewCount} />

      <main className="admin-main">
        {/* Mobile Header */}
        <header className="admin-mobile-header">
          <div className="mobile-logo">BSS <span>Residency</span></div>
          <button 
            className="mobile-menu-btn" 
            onClick={() => document.body.classList.toggle('sidebar-open')}
            aria-label="Toggle Menu"
          >
            <div className="hamburger"></div>
          </button>
        </header>

        <header className="view-header">
          <div className="view-header-flex">
            <div className="view-header-titles">
              <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
              <p>Work with real occupancy and data logs</p>
            </div>
            <div className="view-header-actions">
              <button onClick={fetchData} className="admin-btn admin-btn-outline header-btn">
                <RefreshCcw size={16} /> <span>Refresh</span>
              </button>
              <a href="/" target="_blank" rel="noreferrer" className="admin-btn admin-btn-primary header-btn">
                <ExternalLink size={16} /> <span>View Site</span>
              </a>
            </div>
          </div>
        </header>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
            <RefreshCcw size={40} className="spinner" />
          </div>
        ) : renderView()}
      </main>

      {/* Room Modal */}
      <Modal
        title={editingRoomId ? "Edit Room" : "Add New Room"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={handleRoomSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Room Number</label>
              <input
                type="text" required
                value={roomForm.roomNumber}
                onChange={e => setRoomForm({ ...roomForm, roomNumber: e.target.value })}
                placeholder="e.g. 101"
              />
            </div>
            <div className="form-group">
              <label>Room Type</label>
              <select value={roomForm.type} onChange={e => setRoomForm({ ...roomForm, type: e.target.value })}>
                <option>Double Bed</option>
                <option>Double Bed A/C</option>
                <option>Four Bed</option>
                <option>Four Bed A/C</option>
                <option>Three Bed</option>
                <option>Deluxe AC</option>
                <option>Suite</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Price (₹)</label>
              <input
                type="number" required
                value={roomForm.price}
                onChange={e => setRoomForm({ ...roomForm, price: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={roomForm.status} onChange={e => setRoomForm({ ...roomForm, status: e.target.value })}>
                <option>Available</option>
                <option>Occupied</option>
                <option>Maintenance</option>
              </select>
            </div>
          </div>
          <button type="submit" className="admin-btn admin-btn-primary" style={{ width: '100%' }}>
            {editingRoomId ? "Update Room" : "Create Room"}
          </button>
        </form>
      </Modal>

      {/* Payment Modal */}
      <Modal
        title="Record Payment"
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      >
        <form onSubmit={handlePaymentSubmit}>
          <div className="form-group">
            <label>Guest Name</label>
            <input
              type="text" required
              value={paymentForm.guestName}
              onChange={e => setPaymentForm({ ...paymentForm, guestName: e.target.value })}
              placeholder="Guest full name"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Amount (₹)</label>
              <input
                type="number" required min="1"
                value={paymentForm.amount}
                onChange={e => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                placeholder="e.g. 2600"
              />
            </div>
            <div className="form-group">
              <label>Payment Method</label>
              <select
                value={paymentForm.method}
                onChange={e => setPaymentForm({ ...paymentForm, method: e.target.value })}
              >
                <option>Cash</option>
                <option>UPI</option>
                <option>Card</option>
                <option>Net Banking</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              value={paymentForm.status}
              onChange={e => setPaymentForm({ ...paymentForm, status: e.target.value })}
            >
              <option>Paid</option>
              <option>Pending</option>
              <option>Refunded</option>
            </select>
          </div>
          <button type="submit" className="admin-btn admin-btn-primary" style={{ width: '100%' }} disabled={paymentLoading}>
            {paymentLoading ? 'Saving...' : '💾 Record Payment'}
          </button>
        </form>
      </Modal>
      {/* Online Check-in Modal */}
      <Modal
        title="🧾 Online Check-in Details"
        isOpen={isCheckinModalOpen}
        onClose={() => setIsCheckinModalOpen(false)}
      >
        {selectedCheckin && selectedCheckin.checkinData && (
          <div className="checkin-details-modal">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>Full Name</label>
                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{selectedCheckin.checkinData.fullName}</div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>Age / Gender</label>
                <div style={{ fontWeight: 600 }}>{selectedCheckin.checkinData.age || '—'} / {selectedCheckin.checkinData.gender || '—'}</div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>Address</label>
                <div style={{ fontWeight: 600 }}>
                  {selectedCheckin.checkinData.address}, {selectedCheckin.checkinData.city}, {selectedCheckin.checkinData.state} - {selectedCheckin.checkinData.pincode}
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>ID Proof ({selectedCheckin.checkinData.idType})</label>
                <div style={{ fontWeight: 600, color: 'var(--admin-primary)' }}>{selectedCheckin.checkinData.idNumber}</div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>Vehicle Number</label>
                <div style={{ fontWeight: 600 }}>{selectedCheckin.checkinData.vehicleNumber || 'No vehicle'}</div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>Additional Guests</label>
                <div style={{ fontWeight: 600 }}>
                  {selectedCheckin.checkinData.numberOfGuests} Guests Total
                  {selectedCheckin.checkinData.guestNames?.length > 0 && (
                    <div style={{ fontSize: '0.85rem', fontWeight: 400, color: '#666', marginTop: '4px' }}>
                      Names: {selectedCheckin.checkinData.guestNames.join(', ')}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>Special Requests</label>
                <div style={{ fontStyle: 'italic', color: '#444' }}>{selectedCheckin.checkinData.specialRequests || 'None'}</div>
              </div>
            </div>

            {selectedCheckin.checkinData.idProofImage && (
              <div style={{ borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                <label style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>ID Proof Image</label>
                <img
                  src={selectedCheckin.checkinData.idProofImage}
                  alt="ID Proof"
                  style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #ddd' }}
                />
              </div>
            )}

            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
              <button className="admin-btn admin-btn-primary" onClick={() => setIsCheckinModalOpen(false)}>
                Close Details
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
