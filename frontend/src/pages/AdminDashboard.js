import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Bed,
  CalendarCheck,
  LogOut,
  ExternalLink,
  RefreshCcw,
  Plus,
  Trash2,
  Edit3,
  X,
} from 'lucide-react';
import api from '../api/axios';
import './Admin.css';

const STATUS_COLORS = { Pending: 'orange', Confirmed: 'green', Cancelled: 'red' };
const ROOM_STATUS_COLORS = { Available: 'green', Occupied: 'orange', Maintenance: 'red' };
const ROOM_TYPES = [
  'Double Bed',
  'Double Bed A/C',
  'Four Bed',
  'Four Bed A/C',
  'Deluxe AC',
  'Suite',
];
// Must stay in sync with backend/models/Booking.js roomType enum (includes legacy values)
const BOOKING_ROOM_TYPES = [
  'Double Bed',
  'Double Bed A/C',
  'Four Bed',
  'Four Bed A/C',
  'AC Room',
  'Non-AC Room',
  'Family Room',
  'Dormitory',
  'Suite Room',
];
const BOOKING_LIMIT = 8;

// ---------- Shared components ----------

function Modal({ title, isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h3>{title}</h3>
          <button type="button" className="admin-modal-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <div className="admin-modal-body">{children}</div>
      </div>
    </div>
  );
}

function Sidebar({ activeTab, setActiveTab, onLogout, username }) {
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'rooms', label: 'Rooms', icon: <Bed size={18} /> },
    { id: 'bookings', label: 'Bookings', icon: <CalendarCheck size={18} /> },
  ];
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-logo">
        <span className="logo-bss">BSS</span> Admin
      </div>
      <nav className="admin-sidebar-nav">
        {items.map((it) => (
          <button
            key={it.id}
            type="button"
            className={`admin-nav-item ${activeTab === it.id ? 'active' : ''}`}
            onClick={() => setActiveTab(it.id)}
          >
            {it.icon}
            <span>{it.label}</span>
          </button>
        ))}
      </nav>
      <div className="admin-sidebar-footer">
        <div className="admin-user-card">
          <div className="admin-user-avatar">{(username || '?').charAt(0).toUpperCase()}</div>
          <div className="admin-user-meta">
            <div className="admin-user-name">{username || '—'}</div>
            <div className="admin-user-role">Administrator</div>
          </div>
        </div>
        <button type="button" className="admin-nav-item admin-logout" onClick={onLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

// ---------- Views ----------

function DashboardView({ stats }) {
  if (!stats) return <div className="spinner" />;

  const statCards = [
    { label: 'Total Bookings', value: stats.total, color: 'blue' },
    { label: 'Pending', value: stats.pending, color: 'orange' },
    { label: 'Confirmed', value: stats.confirmed, color: 'green' },
    { label: 'Cancelled', value: stats.cancelled, color: 'red' },
  ];

  const byRoom = Array.isArray(stats.byRoom) ? stats.byRoom : [];

  return (
    <div className="admin-view-content">
      <div className="stats-row">
        {statCards.map((s) => (
          <div key={s.label} className={`stat-card stat-${s.color}`}>
            <span className="sc-value">{s.value}</span>
            <span className="sc-label">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="admin-card">
        <h2 className="section-title">Bookings by Room Type</h2>
        {byRoom.length === 0 ? (
          <div className="empty-state">No booking data yet.</div>
        ) : (
          <div className="table-wrap">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Room Type</th>
                  <th>Bookings</th>
                </tr>
              </thead>
              <tbody>
                {byRoom.map((r) => (
                  <tr key={r._id || 'unknown'}>
                    <td>{r._id || '—'}</td>
                    <td><strong>{r.count}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function RoomsView({ rooms, loading, onAdd, onEdit, onDelete }) {
  return (
    <div className="admin-view-content">
      <div className="filters-row">
        <h2 className="section-title">Rooms</h2>
        <div className="filters">
          <button type="button" className="admin-primary-btn" onClick={onAdd}>
            <Plus size={16} /> Add Room
          </button>
        </div>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : rooms.length === 0 ? (
        <div className="empty-state">No rooms added yet. Click "Add Room" to create one.</div>
      ) : (
        <div className="rooms-grid">
          {rooms.map((room) => (
            <div key={room._id} className="room-card">
              <div className="room-card-head">
                <div>
                  <div className="room-number">#{room.roomNumber}</div>
                  <div className="room-type">{room.type}</div>
                </div>
                <span className={`status-pill status-${ROOM_STATUS_COLORS[room.status] || 'orange'}`}>
                  {room.status}
                </span>
              </div>
              <div className="room-price">₹{Number(room.price).toLocaleString('en-IN')}<span>/night</span></div>
              {room.notes && <div className="room-notes">{room.notes}</div>}
              <div className="room-actions">
                <button type="button" className="icon-btn" onClick={() => onEdit(room)} title="Edit">
                  <Edit3 size={16} />
                </button>
                <button type="button" className="icon-btn icon-btn-danger" onClick={() => onDelete(room)} title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BookingsView({
  bookings,
  total,
  page,
  setPage,
  filter,
  setFilter,
  loading,
  updateStatus,
  deleteBooking,
  formatDate,
}) {
  return (
    <div className="admin-view-content">
      <div className="filters-row">
        <h2 className="section-title">Bookings</h2>
        <div className="filters">
          <select
            value={filter.status}
            onChange={(e) => {
              setFilter((p) => ({ ...p, status: e.target.value }));
              setPage(1);
            }}
          >
            <option value="">All Status</option>
            <option>Pending</option>
            <option>Confirmed</option>
            <option>Cancelled</option>
          </select>
          <select
            value={filter.roomType}
            onChange={(e) => {
              setFilter((p) => ({ ...p, roomType: e.target.value }));
              setPage(1);
            }}
          >
            <option value="">All Rooms</option>
            {BOOKING_ROOM_TYPES.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

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
                    <td>{(page - 1) * BOOKING_LIMIT + i + 1}</td>
                    <td>
                      <strong>{b.name}</strong>
                      {b.email && (<><br /><small>{b.email}</small></>)}
                    </td>
                    <td>
                      <a
                        href={`https://wa.me/${b.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="wa-link"
                      >
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
                        onChange={(e) => updateStatus(b._id, e.target.value)}
                        className={`status-select status-${STATUS_COLORS[b.status]}`}
                      >
                        <option>Pending</option>
                        <option>Confirmed</option>
                        <option>Cancelled</option>
                      </select>
                    </td>
                    <td>{formatDate(b.createdAt)}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => deleteBooking(b._id)}
                        className="icon-btn icon-btn-danger"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button type="button" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              ← Prev
            </button>
            <span>
              Page {page} of {Math.max(1, Math.ceil(total / BOOKING_LIMIT))}
            </span>
            <button
              type="button"
              disabled={page >= Math.ceil(total / BOOKING_LIMIT)}
              onClick={() => setPage((p) => p + 1)}
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ---------- Main component ----------

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [total, setTotal] = useState(0);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState({ status: '', roomType: '' });
  const [page, setPage] = useState(1);

  // Room modal state
  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [roomForm, setRoomForm] = useState({
    roomNumber: '',
    type: ROOM_TYPES[0],
    price: '',
    status: 'Available',
    notes: '',
  });
  const [roomError, setRoomError] = useState('');
  const [savingRoom, setSavingRoom] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('bss_admin');
    if (!stored) {
      navigate('/admin/login');
      return;
    }
    setAuth(JSON.parse(stored));
  }, [navigate]);

  const authHeaders = useCallback(
    () => (auth ? { username: auth.username, password: auth.password } : {}),
    [auth]
  );

  const fetchData = useCallback(async () => {
    if (!auth) return;
    setLoading(true);
    const headers = { username: auth.username, password: auth.password };
    try {
      const [statsRes, bookingsRes, roomsRes] = await Promise.all([
        api.get('/api/admin/stats', { headers }),
        api.get('/api/admin/bookings', {
          headers,
          params: { ...filter, page, limit: BOOKING_LIMIT },
        }),
        api.get('/api/admin/rooms', { headers }),
      ]);
      setStats(statsRes.data.stats);
      setBookings(bookingsRes.data.bookings);
      setTotal(bookingsRes.data.total);
      setRooms(roomsRes.data.rooms || []);
    } catch (err) {
      if (err?.response?.status === 401) {
        navigate('/admin/login');
      } else {
        console.error('Admin fetch failed:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [auth, filter, page, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ---------- Booking handlers ----------

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/api/admin/bookings/${id}`, { status }, { headers: authHeaders() });
      fetchData();
    } catch (err) {
      window.alert('Failed to update booking: ' + (err?.response?.data?.message || err.message));
    }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm('Delete this booking?')) return;
    try {
      await api.delete(`/api/admin/bookings/${id}`, { headers: authHeaders() });
      fetchData();
    } catch (err) {
      window.alert('Failed to delete booking: ' + (err?.response?.data?.message || err.message));
    }
  };

  // ---------- Room handlers ----------

  const openAddRoom = () => {
    setEditingRoomId(null);
    setRoomForm({
      roomNumber: '',
      type: ROOM_TYPES[0],
      price: '',
      status: 'Available',
      notes: '',
    });
    setRoomError('');
    setRoomModalOpen(true);
  };

  const openEditRoom = (room) => {
    setEditingRoomId(room._id);
    setRoomForm({
      roomNumber: room.roomNumber,
      type: room.type,
      price: String(room.price ?? ''),
      status: room.status,
      notes: room.notes || '',
    });
    setRoomError('');
    setRoomModalOpen(true);
  };

  const submitRoom = async (e) => {
    e.preventDefault();
    setSavingRoom(true);
    setRoomError('');
    const payload = {
      roomNumber: roomForm.roomNumber.trim(),
      type: roomForm.type,
      price: Number(roomForm.price),
      status: roomForm.status,
      notes: roomForm.notes,
    };
    try {
      if (editingRoomId) {
        await api.patch(`/api/admin/rooms/${editingRoomId}`, payload, { headers: authHeaders() });
      } else {
        await api.post('/api/admin/rooms', payload, { headers: authHeaders() });
      }
      setRoomModalOpen(false);
      fetchData();
    } catch (err) {
      setRoomError(err?.response?.data?.message || err.message || 'Failed to save room.');
    } finally {
      setSavingRoom(false);
    }
  };

  const deleteRoom = async (room) => {
    if (!window.confirm(`Delete room #${room.roomNumber}?`)) return;
    try {
      await api.delete(`/api/admin/rooms/${room._id}`, { headers: authHeaders() });
      fetchData();
    } catch (err) {
      window.alert('Failed to delete room: ' + (err?.response?.data?.message || err.message));
    }
  };

  // ---------- Misc ----------

  const logout = () => {
    sessionStorage.removeItem('bss_admin');
    navigate('/admin/login');
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

  const titleMap = {
    dashboard: 'Dashboard',
    rooms: 'Rooms',
    bookings: 'Bookings',
  };

  const renderView = () => {
    switch (activeTab) {
      case 'rooms':
        return (
          <RoomsView
            rooms={rooms}
            loading={loading}
            onAdd={openAddRoom}
            onEdit={openEditRoom}
            onDelete={deleteRoom}
          />
        );
      case 'bookings':
        return (
          <BookingsView
            bookings={bookings}
            total={total}
            page={page}
            setPage={setPage}
            filter={filter}
            setFilter={setFilter}
            loading={loading}
            updateStatus={updateStatus}
            deleteBooking={deleteBooking}
            formatDate={formatDate}
          />
        );
      case 'dashboard':
      default:
        return <DashboardView stats={stats} />;
    }
  };

  return (
    <div className="admin-dashboard admin-layout">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={logout}
        username={auth?.username}
      />

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <h1 className="admin-topbar-title">{titleMap[activeTab]}</h1>
            <p className="admin-topbar-sub">Manage your BSS Residency operations</p>
          </div>
          <div className="admin-topbar-actions">
            <button type="button" onClick={fetchData} className="refresh-btn">
              <RefreshCcw size={14} /> Refresh
            </button>
            <a href="/" target="_blank" rel="noreferrer" className="view-site-btn">
              <ExternalLink size={14} /> View Site
            </a>
          </div>
        </header>

        <div className="admin-body">{renderView()}</div>
      </main>

      <Modal
        title={editingRoomId ? 'Edit Room' : 'Add Room'}
        isOpen={roomModalOpen}
        onClose={() => setRoomModalOpen(false)}
      >
        <form onSubmit={submitRoom} className="room-form">
          {roomError && <div className="alert error">{roomError}</div>}

          <div className="form-row">
            <div className="form-group">
              <label>Room Number</label>
              <input
                type="text"
                required
                value={roomForm.roomNumber}
                onChange={(e) => setRoomForm((p) => ({ ...p, roomNumber: e.target.value }))}
                placeholder="e.g. 101"
              />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select
                value={roomForm.type}
                onChange={(e) => setRoomForm((p) => ({ ...p, type: e.target.value }))}
              >
                {ROOM_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price (₹ / night)</label>
              <input
                type="number"
                min="0"
                required
                value={roomForm.price}
                onChange={(e) => setRoomForm((p) => ({ ...p, price: e.target.value }))}
                placeholder="1200"
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                value={roomForm.status}
                onChange={(e) => setRoomForm((p) => ({ ...p, status: e.target.value }))}
              >
                <option>Available</option>
                <option>Occupied</option>
                <option>Maintenance</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Notes (optional)</label>
            <textarea
              rows={2}
              value={roomForm.notes}
              onChange={(e) => setRoomForm((p) => ({ ...p, notes: e.target.value }))}
              placeholder="e.g. Sea-view, Wi-Fi, etc."
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="ghost-btn"
              onClick={() => setRoomModalOpen(false)}
              disabled={savingRoom}
            >
              Cancel
            </button>
            <button type="submit" className="admin-primary-btn" disabled={savingRoom}>
              {savingRoom ? 'Saving...' : editingRoomId ? 'Save Changes' : 'Create Room'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
