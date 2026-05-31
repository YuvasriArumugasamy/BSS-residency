import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import buildingImg from '../assets/building.webp';
import { Eye, EyeOff, User, Lock, ArrowRight } from 'lucide-react';
import './Admin.css';

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [serverStatus, setServerStatus] = useState('waking'); // 'waking' | 'ready' | 'error'
  const navigate = useNavigate();

  useEffect(() => {
    const manifestLink = document.querySelector('link[rel="manifest"]');
    if (manifestLink) {
      manifestLink.setAttribute('href', '/manifest-admin.json');
    }
    return () => {
      if (manifestLink) {
        manifestLink.setAttribute('href', '/manifest.json');
      }
    };
  }, []);

  // Wake up the Render server when the login page loads
  useEffect(() => {
    const wakeServer = async () => {
      try {
        await api.get('/api/admin/settings/public');
        setServerStatus('ready');
      } catch (err) {
        // Retry once after 5 seconds if failed
        setTimeout(async () => {
          try {
            await api.get('/api/admin/settings/public');
            setServerStatus('ready');
          } catch {
            setServerStatus('error');
          }
        }, 5000);
      }
    };
    wakeServer();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await api.post('/api/admin/login', form);
      if (res.data.success) {
        sessionStorage.setItem('bss_admin', JSON.stringify({ username: form.username, password: form.password }));
        navigate('/admin/dashboard');
      }
    } catch (err) {
      if (!err.response) {
        setError('சர்வர் இணைப்பு இல்லை. சிறிது நேரம் காத்திருந்து மீண்டும் முயற்சிக்கவும். (Server is waking up, please wait 30 seconds and try again.)');
      } else {
        setError('தவறான username அல்லது password. (Invalid username or password.)');
      }
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

        {/* Server Status Indicator */}
        {serverStatus === 'waking' && (
          <div style={{ 
            background: 'rgba(251, 191, 36, 0.15)', 
            border: '1px solid rgba(251, 191, 36, 0.4)',
            borderRadius: '10px', padding: '10px 14px', marginBottom: '1rem',
            display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#fbbf24'
          }}>
            <span style={{ animation: 'pulse 1.5s infinite' }}>⏳</span>
            சர்வர் விழிக்கிறது... (Server waking up, please wait...)
          </div>
        )}
        {serverStatus === 'ready' && (
          <div style={{ 
            background: 'rgba(34, 197, 94, 0.15)', 
            border: '1px solid rgba(34, 197, 94, 0.4)',
            borderRadius: '10px', padding: '10px 14px', marginBottom: '1rem',
            display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#22c55e'
          }}>
            ✅ சர்வர் தயார் - Login செய்யலாம்! (Server ready)
          </div>
        )}
        {serverStatus === 'error' && (
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.15)', 
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '10px', padding: '10px 14px', marginBottom: '1rem',
            display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#ef4444'
          }}>
            ⚠️ சர்வர் தொடர்பு இல்லை. Page refresh செய்யுங்கள்.
          </div>
        )}

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
