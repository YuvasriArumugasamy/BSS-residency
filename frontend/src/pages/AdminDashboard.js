import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './Admin.css';

const STATUS_COLORS = { Pending: 'orange', Confirmed: 'green', Cancelled: 'red' };

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(null);
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', roomType: '' });
  const [page, setPage] = useState(1);
  const LIMIT = 8;

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
      const [statsRes, bookingsRes] = await Promise.all([
        api.get('/api/admin/stats', { headers }),
        api.get('/api/admin/bookings', {
          headers,
          params: { ...filter, page, limit: LIMIT },
        }),
      ]);
      setStats(statsRes.data.stats);
      setBookings(bookingsRes.data.bookings);
      setTotal(bookingsRes.data.total);
    } catch {
      navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  }, [auth, filter, page, navigate]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const updateStatus = async (id, status) => {
    const headers = { username: auth.username, password: auth.password };
    await api.patch(`/api/admin/bookings/${id}`, { status }, { headers });
    fetchData();
  };

  const deleteBooking = async (id) => {
    if (!window.confirm('Delete this booking?')) return;
    const headers = { username: auth.username, password: auth.password };
    await api.delete(`/api/admin/bookings/${id}`, { headers });
    fetchData();
  };

  const logout = () => { sessionStorage.removeItem('bss_admin'); navigate('/admin/login'); };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-logo"><span className="logo-bss">BSS</span> Admin Panel</div>
        <div className="admin-header-right">
          <span className="admin-user">👤 {auth?.username}</span>
          <button onClick={logout} className="logout-btn">Logout</button>
          <a href="/" className="view-site-btn" target="_blank" rel="noreferrer">View Site ↗</a>
        </div>
      </header>

      <div className="admin-body">
        {/* Stats */}
        {stats && (
          <div className="stats-row">
            {[
              { label: 'Total Bookings', value: stats.total, color: 'blue' },
              { label: 'Pending', value: stats.pending, color: 'orange' },
              { label: 'Confirmed', value: stats.confirmed, color: 'green' },
              { label: 'Cancelled', value: stats.cancelled, color: 'red' },
            ].map(s => (
              <div key={s.label} className={`stat-card stat-${s.color}`}>
                <span className="sc-value">{s.value}</span>
                <span className="sc-label">{s.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="filters-row">
          <h2 className="section-title">Bookings</h2>
          <div className="filters">
            <select value={filter.status} onChange={e => { setFilter(p => ({ ...p, status: e.target.value })); setPage(1); }}>
              <option value="">All Status</option>
              <option>Pending</option>
              <option>Confirmed</option>
              <option>Cancelled</option>
            </select>
            <select value={filter.roomType} onChange={e => { setFilter(p => ({ ...p, roomType: e.target.value })); setPage(1); }}>
              <option value="">All Rooms</option>
              {['AC Room','Non-AC Room','Family Room','Dormitory','Suite Room'].map(r => <option key={r}>{r}</option>)}
            </select>
            <button onClick={fetchData} className="refresh-btn">🔄 Refresh</button>
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
                    <tr key={b._id}>
                      <td>{(page - 1) * LIMIT + i + 1}</td>
                      <td><strong>{b.name}</strong>{b.email && <><br /><small>{b.email}</small></>}</td>
                      <td>
                        <a href={`https://wa.me/${b.phone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="wa-link">
                          {b.phone}
                        </a>
                      </td>
                      <td>{b.roomType}</td>
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
                      <td>{formatDate(b.createdAt)}</td>
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
              <span>Page {page} of {Math.ceil(total / LIMIT)}</span>
              <button disabled={page >= Math.ceil(total / LIMIT)} onClick={() => setPage(p => p + 1)}>Next →</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
