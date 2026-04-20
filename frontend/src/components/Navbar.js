import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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

  useEffect(() => setMenuOpen(false), [location]);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/rooms', label: 'Rooms' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner">
        <Link to="/" className="nav-logo">
          <span className="logo-bss">BSS</span>
          <span className="logo-rest"> Residency</span>
        </Link>

        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
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

        <Link to="/booking" className="nav-cta">Book Now</Link>

        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile overlay */}
      {menuOpen && (
        <div className="mobile-menu fade-in">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className={location.pathname === l.to ? 'active' : ''}>
              {l.label}
            </Link>
          ))}
          <Link to="/booking" className="mobile-book-btn">Book Now</Link>
        </div>
      )}
    </nav>
  );
}
