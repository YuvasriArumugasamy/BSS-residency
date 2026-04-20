import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Admin.css';

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await axios.post('/api/admin/login', form);
      if (res.data.success) {
        sessionStorage.setItem('bss_admin', JSON.stringify({ username: form.username, password: form.password }));
        navigate('/admin/dashboard');
      }
    } catch {
      setError('Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="login-card">
        <div className="login-logo">
          <span className="logo-bss">BSS</span> Residency
        </div>
        <h2>Admin Panel</h2>
        <p className="login-sub">Sign in to manage bookings</p>

        {error && <div className="alert error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text" value={form.username}
              onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
              placeholder="admin" required autoFocus
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password" value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              placeholder="••••••••" required
            />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <p className="login-hint">Default: admin / bss@2025 (change in .env)</p>
      </div>
    </div>
  );
}
