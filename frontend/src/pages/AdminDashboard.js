import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import api from '../api/axios';
import { getSocket, disconnectSocket } from '../api/socket';
import { ROOMS } from '../constants';
import './Admin.css';

const STATUS_COLORS = { Pending: 'orange', Confirmed: 'green', Cancelled: 'red' };

function playNotificationSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 800;
    osc.type = 'sine';
    gain.gain.value = 0.3;
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.stop(ctx.currentTime + 0.5);
  } catch {
    // Audio not supported
  }
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(null);
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', roomType: '' });
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [connected, setConnected] = useState(false);
  const [activeTab, setActiveTab] = useState('bookings');
  const LIMIT = 8;
  const searchTimeout = useRef(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('bss_admin');
    if (!stored) { navigate('/admin/login'); return; }
    setAuth(JSON.parse(stored));
  }, [navigate]);

  const fetchData = useCallback(async () => {
    if (!auth) return;
    setLoading(true);
    const headers = { username: auth.username, password: auth.password };
    try {
      const params = { ...filter, page, limit: LIMIT };
      if (search) params.search = search;
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;

      const [statsRes, bookingsRes] = await Promise.all([
        api.get('/api/admin/stats', { headers }),
        api.get('/api/admin/bookings', { headers, params }),
      ]);
      setStats(statsRes.data.stats);
      setBookings(bookingsRes.data.bookings);
      setTotal(bookingsRes.data.total);
    } catch {
      navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  }, [auth, filter, page, search, dateFrom, dateTo, navigate]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Socket.IO real-time connection
  useEffect(() => {
    if (!auth) return;

    const socket = getSocket();

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.on('booking:new', (booking) => {
      playNotificationSound();
      toast.success(
        `New booking from ${booking.name} — ${booking.roomType}`,
        { duration: 5000, icon: '🔔' }
      );
      fetchData();
    });

    socket.on('booking:updated', () => {
      fetchData();
    });

    socket.on('booking:deleted', () => {
      fetchData();
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('booking:new');
      socket.off('booking:updated');
      socket.off('booking:deleted');
      disconnectSocket();
    };
  }, [auth, fetchData]);

  const updateStatus = async (id, status) => {
    const headers = { username: auth.username, password: auth.password };
    await api.patch(`/api/admin/bookings/${id}`, { status }, { headers });
  };

  const deleteBooking = async (id) => {
    if (!window.confirm('Delete this booking?')) return;
    const headers = { username: auth.username, password: auth.password };
    await api.delete(`/api/admin/bookings/${id}`, { headers });
  };

  const exportCSV = () => {
    if (!auth) return;
    const params = new URLSearchParams();
    if (filter.status) params.set('status', filter.status);
    if (filter.roomType) params.set('roomType', filter.roomType);
    if (dateFrom) params.set('dateFrom', dateFrom);
    if (dateTo) params.set('dateTo', dateTo);

    const baseURL = process.env.REACT_APP_API_URL || '';
    const url = `${baseURL}/api/admin/export?${params.toString()}`;

    fetch(url, { headers: { username: auth.username, password: auth.password } })
      .then(res => res.blob())
      .then(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'bss-bookings.csv';
        a.click();
        URL.revokeObjectURL(a.href);
        toast.success('CSV exported successfully');
      })
      .catch(() => toast.error('Export failed'));
  };

  const handleSearch = (value) => {
    setSearch(value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => setPage(1), 300);
  };

  const logout = () => { sessionStorage.removeItem('bss_admin'); navigate('/admin/login'); };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
  const timeAgo = (d) => {
    if (!d) return '';
    const diff = (Date.now() - new Date(d).getTime()) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const clearFilters = () => {
    setFilter({ status: '', roomType: '' });
    setSearch('');
    setDateFrom('');
    setDateTo('');
    setPage(1);
  };

  const hasFilters = filter.status || filter.roomType || search || dateFrom || dateTo;

  return (
    <div className="admin-dashboard">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="admin-header">
        <div className="admin-logo">
          <span className="logo-bss">BSS</span> Admin Panel
        </div>
        <div className="admin-header-right">
          <span className={`connection-dot ${connected ? 'online' : 'offline'}`} />
          <span className="connection-label">{connected ? 'Live' : 'Offline'}</span>
          <span className="admin-user">{auth?.username}</span>
          <button onClick={logout} className="logout-btn">Logout</button>
          <a href="/" className="view-site-btn" target="_blank" rel="noreferrer">View Site</a>
        </div>
      </header>

      <div className="admin-body">
        {/* Stats Cards */}
        {stats && (
          <div className="stats-row">
            {[
              { label: 'Total Bookings', value: stats.total, color: 'blue', icon: '📋' },
              { label: 'Pending', value: stats.pending, color: 'orange', icon: '⏳' },
              { label: 'Confirmed', value: stats.confirmed, color: 'green', icon: '✓' },
              { label: 'Cancelled', value: stats.cancelled, color: 'red', icon: '✕' },
            ].map(s => (
              <div key={s.label} className={`stat-card stat-${s.color}`}>
                <span className="sc-icon">{s.icon}</span>
                <span className="sc-value">{s.value}</span>
                <span className="sc-label">{s.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Time-based Stats */}
        {stats && (
          <div className="time-stats-row">
            <div className="time-stat">
              <span className="ts-value">{stats.todayBookings}</span>
              <span className="ts-label">Today</span>
            </div>
            <div className="time-stat-divider" />
            <div className="time-stat">
              <span className="ts-value">{stats.weekBookings}</span>
              <span className="ts-label">This Week</span>
            </div>
            <div className="time-stat-divider" />
            <div className="time-stat">
              <span className="ts-value">{stats.monthBookings}</span>
              <span className="ts-label">This Month</span>
            </div>
            {stats.byRoom && stats.byRoom.length > 0 && (
              <>
                <div className="time-stat-divider" />
                <div className="time-stat room-breakdown">
                  <span className="ts-label">By Room</span>
                  <div className="room-chips">
                    {stats.byRoom.map(r => (
                      <span key={r._id} className="room-chip">{r._id}: {r.count}</span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Tab Switcher */}
        <div className="tab-row">
          <button
            className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            Bookings
          </button>
          <button
            className={`tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            Recent Activity
          </button>
        </div>

        {activeTab === 'bookings' && (
          <>
            {/* Search & Filters */}
            <div className="filters-row">
              <div className="search-box">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  value={search}
                  onChange={e => handleSearch(e.target.value)}
                  placeholder="Search by name, phone, or email..."
                  className="search-input"
                />
              </div>
              <div className="filters">
                <select value={filter.status} onChange={e => { setFilter(p => ({ ...p, status: e.target.value })); setPage(1); }}>
                  <option value="">All Status</option>
                  <option>Pending</option>
                  <option>Confirmed</option>
                  <option>Cancelled</option>
                </select>
                <select value={filter.roomType} onChange={e => { setFilter(p => ({ ...p, roomType: e.target.value })); setPage(1); }}>
                  <option value="">All Rooms</option>
                  {ROOMS.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
                </select>
                <input
                  type="date" value={dateFrom}
                  onChange={e => { setDateFrom(e.target.value); setPage(1); }}
                  className="date-filter"
                  title="From date"
                />
                <input
                  type="date" value={dateTo}
                  onChange={e => { setDateTo(e.target.value); setPage(1); }}
                  className="date-filter"
                  title="To date"
                />
                {hasFilters && (
                  <button onClick={clearFilters} className="clear-btn" title="Clear all filters">Clear</button>
                )}
                <button onClick={exportCSV} className="export-btn" title="Export to CSV">CSV Export</button>
              </div>
            </div>

            {/* Table */}
            {loading ? (
              <div className="spinner" />
            ) : bookings.length === 0 ? (
              <div className="empty-state">No bookings found.</div>
            ) : (
              <>
                <div className="table-wrap">
                  <table className="bookings-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Guest</th>
                        <th>Phone</th>
                        <th>Room</th>
                        <th>Rooms</th>
                        <th>Check-in</th>
                        <th>Check-out</th>
                        <th>Guests</th>
                        <th>Status</th>
                        <th>Booked On</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b, i) => (
                        <tr key={b._id} className={b.status === 'Pending' ? 'row-pending' : ''}>
                          <td>{(page - 1) * LIMIT + i + 1}</td>
                          <td>
                            <strong>{b.name}</strong>
                            {b.email && <><br /><small>{b.email}</small></>}
                            {b.message && <><br /><small className="msg-preview" title={b.message}>📝 {b.message.slice(0, 40)}{b.message.length > 40 ? '...' : ''}</small></>}
                          </td>
                          <td>
                            <a href={`https://wa.me/${b.phone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="wa-link">
                              {b.phone}
                            </a>
                          </td>
                          <td>{b.roomType}</td>
                          <td>{b.rooms || 1}</td>
                          <td>{formatDate(b.checkIn)}</td>
                          <td>{formatDate(b.checkOut)}</td>
                          <td>{b.guests}</td>
                          <td>
                            <select
                              value={b.status}
                              onChange={e => updateStatus(b._id, e.target.value)}
                              className={`status-select status-${STATUS_COLORS[b.status]}`}
                            >
                              <option>Pending</option>
                              <option>Confirmed</option>
                              <option>Cancelled</option>
                            </select>
                          </td>
                          <td>
                            <span title={formatDate(b.createdAt)}>{timeAgo(b.createdAt)}</span>
                          </td>
                          <td>
                            <button onClick={() => deleteBooking(b._id)} className="del-btn" title="Delete">🗑️</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="pagination">
                  <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                  <span>Page {page} of {Math.ceil(total / LIMIT) || 1}</span>
                  <button disabled={page >= Math.ceil(total / LIMIT)} onClick={() => setPage(p => p + 1)}>Next →</button>
                  <span className="total-count">{total} total</span>
                </div>
              </>
            )}
          </>
        )}

        {activeTab === 'activity' && stats && stats.recentActivity && (
          <div className="activity-feed">
            <h3 className="activity-title">Recent Bookings</h3>
            {stats.recentActivity.length === 0 ? (
              <div className="empty-state">No recent activity.</div>
            ) : (
              <div className="activity-list">
                {stats.recentActivity.map((a) => (
                  <div key={a._id} className="activity-item">
                    <div className={`activity-dot dot-${STATUS_COLORS[a.status] || 'blue'}`} />
                    <div className="activity-content">
                      <div className="activity-main">
                        <strong>{a.name}</strong>
                        <span className="activity-room">{a.roomType}</span>
                        <span className={`activity-status badge-${STATUS_COLORS[a.status]}`}>{a.status}</span>
                      </div>
                      <div className="activity-meta">
                        <a href={`https://wa.me/${(a.phone || '').replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="wa-link">
                          {a.phone}
                        </a>
                        <span className="activity-time">{timeAgo(a.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
