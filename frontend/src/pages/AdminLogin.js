import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import buildingImg from '../assets/building.webp';
import { Eye, EyeOff, User, Lock, ArrowRight, Globe } from 'lucide-react';
import './Admin.css';

const ADMIN_LOGIN_TEXT = {
  en: {
    title: 'Admin Panel',
    subtitle: 'Sign in to manage bookings',
    username: 'Username',
    usernamePlaceholder: 'Name',
    password: 'Password',
    signIn: 'Sign In',
    signingIn: 'Signing in...',
    waking: 'Server waking up, please wait...',
    ready: 'Server ready - You can login now!',
    error: 'Server not reachable. Please refresh the page.',
    invalidCreds: 'Invalid username or password.',
    serverDown: 'Server connection failed. Please wait 30 seconds and try again.',
  },
  ta: {
    title: 'நிர்வாக பக்கம்',
    subtitle: 'முன்பதிவுகளை நிர்வகிக்க உள்நுழையவும்',
    username: 'பயனர் பெயர்',
    usernamePlaceholder: 'பெயர்',
    password: 'கடவுச்சொல்',
    signIn: 'உள்நுழை',
    signingIn: 'உள்நுழைகிறது...',
    waking: 'சர்வர் விழிக்கிறது... காத்திருங்கள்...',
    ready: 'சர்வர் தயார் - Login செய்யலாம்!',
    error: '⚠️ சர்வர் தொடர்பு இல்லை. Page refresh செய்யுங்கள்.',
    invalidCreds: 'தவறான username அல்லது password.',
    serverDown: 'சர்வர் இணைப்பு இல்லை. சிறிது நேரம் காத்திருந்து மீண்டும் முயற்சிக்கவும்.',
  }
};

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [serverStatus, setServerStatus] = useState('waking'); // 'waking' | 'ready' | 'error'
  const [lang, setLang] = useState(() => localStorage.getItem('bss_admin_lang') || 'en');
  const navigate = useNavigate();
  const t = ADMIN_LOGIN_TEXT[lang];

  const toggleLang = () => {
    const next = lang === 'en' ? 'ta' : 'en';
    setLang(next);
    localStorage.setItem('bss_admin_lang', next);
  };

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
        setError(t.serverDown);
      } else {
        setError(t.invalidCreds);
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
        {/* Language Toggle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div className="login-logo" style={{ margin: 0 }}>BSS Residency</div>
          <button
            type="button"
            onClick={toggleLang}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'rgba(212, 168, 87, 0.15)',
              border: '1px solid rgba(212, 168, 87, 0.5)',
              borderRadius: '8px', padding: '6px 12px',
              color: '#d4a857', fontSize: '0.82rem', fontWeight: 700,
              cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            <Globe size={14} />
            {lang === 'en' ? 'தமிழ்' : 'English'}
          </button>
        </div>

        <h2>{t.title}</h2>
        <p className="login-sub">{t.subtitle}</p>

        {/* Server Status Indicator */}
        {serverStatus === 'waking' && (
          <div style={{ 
            background: 'rgba(251, 191, 36, 0.15)', 
            border: '1px solid rgba(251, 191, 36, 0.4)',
            borderRadius: '10px', padding: '10px 14px', marginBottom: '1rem',
            display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#fbbf24'
          }}>
            <span style={{ animation: 'pulse 1.5s infinite' }}>⏳</span>
            {t.waking}
          </div>
        )}
        {serverStatus === 'ready' && (
          <div style={{ 
            background: 'rgba(34, 197, 94, 0.15)', 
            border: '1px solid rgba(34, 197, 94, 0.4)',
            borderRadius: '10px', padding: '10px 14px', marginBottom: '1rem',
            display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#22c55e'
          }}>
            ✅ {t.ready}
          </div>
        )}
        {serverStatus === 'error' && (
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.15)', 
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '10px', padding: '10px 14px', marginBottom: '1rem',
            display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#ef4444'
          }}>
            {t.error}
          </div>
        )}

        {error && <div className="alert error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>{t.username}</label>
            <div className="input-container">
              <span className="input-icon">
                <User size={20} />
              </span>
              <input
                type="text" value={form.username}
                onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                placeholder={t.usernamePlaceholder} required autoFocus
              />
            </div>
          </div>

          <div className="form-group">
            <label>{t.password}</label>
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
            {loading ? t.signingIn : (
              <>
                {t.signIn} <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
