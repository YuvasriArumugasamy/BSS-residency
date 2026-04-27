import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import buildingImg from '../assets/building.png';
import { Eye, EyeOff, User, Lock, ArrowRight } from 'lucide-react';
import './Admin.css';

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await api.post('/api/admin/login', form);
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
    <div className="admin-login-page" style={{ 
      backgroundImage: `url(${buildingImg})`
    }}>
      <div className="login-card">
        <div className="login-logo">
          BSS Residency
        </div>
        <h2>Admin Panel</h2>
        <p className="login-sub">Sign in to manage bookings</p>

        {error && <div className="alert error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Username</label>
            <div className="input-container">
              <span className="input-icon">
                <User size={20} />
              </span>
              <input
                type="text" value={form.username}
                onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                placeholder="Name" required autoFocus
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-container">
              <span className="input-icon">
                <Lock size={20} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'} 
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                placeholder="•••••" required
                style={{ paddingRight: '45px' }}
              />
              <button 
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Signing in...' : (
              <>
                Sign In <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
