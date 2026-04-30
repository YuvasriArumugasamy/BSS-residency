import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
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
    { to: '/booking/status', label: 'Manage Booking' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner">
          <Link to="/" className="nav-logo">
            <span className="nav-logo-circle">
              <img src={logo} alt="BSS Residency" />
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
            <Link to="/booking" className="nav-cta"><span>Book Now</span></Link>
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

      {/* Mobile overlay */}
      {menuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className={`mobile-link ${location.pathname === l.to ? 'active' : ''}`}>
                {l.label}
              </Link>
            ))}
            <a
              href={MAP.directUrl}
              target="_blank"
              rel="noreferrer"
              className="mobile-book-btn"
            >
              📍 View on Google Maps
            </a>
          </div>
        </div>
      )}
    </>
  );
}
