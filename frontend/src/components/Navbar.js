import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.webp';
import { MAP, CONTACT, waLink } from '../constants';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => setMenuOpen(false), [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/rooms', label: 'Rooms' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/booking/manage', label: 'Manage Booking' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner">
          <Link to="/" className="nav-logo">
            <span className="nav-logo-circle">
              <img src={logo} alt="BSS Residency" width="48" height="48" />
            </span>
            <span className="nav-logo-text">
              <span className="logo-bss">BSS</span>
              <span className="logo-rest">Residency</span>
            </span>
          </Link>

          <ul className="nav-links">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className={location.pathname === l.to ? 'active' : ''}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <a
              href={MAP.directUrl}
              target="_blank"
              rel="noreferrer"
              className="nav-map-btn"
              title="View on Google Maps"
            >
              <i className="fa-solid fa-location-dot"></i> Map
            </a>
            <Link to="/booking" className="nav-cta" style={{
              background: '#e63946',
              color: 'white',
              fontSize: '16px',
              padding: '10px 24px',
              borderRadius: '8px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(230, 57, 70, 0.4)',
              border: 'none'
            }}>
              <i className="fa-solid fa-phone"></i> Book Now
            </Link>
          </div>

          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      <div className={`mobile-overlay ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(false)} />
      
      {/* Mobile Sidebar Panel */}
      <div className={`mobile-sidebar ${menuOpen ? 'open' : ''}`}>
        {/* Sidebar Header - Logo + Close */}
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo" onClick={() => setMenuOpen(false)}>
            <span className="sidebar-logo-circle">
              <img src={logo} alt="BSS Residency" width="48" height="48" />
            </span>
            <span className="sidebar-logo-text">
              <span className="sidebar-bss">BSS</span>
              <span className="sidebar-rest">Residency</span>
            </span>
          </Link>
          <button className="sidebar-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Sidebar Navigation Links */}
        <nav className="sidebar-nav">
          {links.map((l, i) => (
            <Link
              key={l.to}
              to={l.to}
              className={`sidebar-link ${location.pathname === l.to ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
              style={{ animationDelay: `${0.05 + i * 0.05}s` }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Sidebar Contact Info */}
        <div className="sidebar-contact">
          <h4 className="sidebar-contact-title">Contact Info</h4>
          <p className="sidebar-contact-address">
            {CONTACT.addressLine1},<br />
            {CONTACT.addressLine2}
          </p>
          <a href={`tel:${CONTACT.phonePrimary.replace(/\s/g, '')}`} className="sidebar-contact-phone">
            <i className="fa-solid fa-phone"></i> {CONTACT.phonePrimary}
          </a>
          <a href={`tel:${CONTACT.phoneSecondary.replace(/\s/g, '')}`} className="sidebar-contact-phone">
            <i className="fa-solid fa-phone"></i> {CONTACT.phoneSecondary}
          </a>
          <div className="sidebar-social">
            <a
              href={waLink('Hello BSS Residency!')}
              target="_blank"
              rel="noreferrer"
              className="sidebar-social-btn whatsapp"
              title="WhatsApp"
            >
              <i className="fa-brands fa-whatsapp"></i>
            </a>
            <a
              href={`https://instagram.com/${CONTACT.instagram}`}
              target="_blank"
              rel="noreferrer"
              className="sidebar-social-btn instagram"
              title="Instagram"
            >
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a
              href={MAP.directUrl}
              target="_blank"
              rel="noreferrer"
              className="sidebar-social-btn maps"
              title="Google Maps"
            >
              <i className="fa-solid fa-location-dot"></i>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
