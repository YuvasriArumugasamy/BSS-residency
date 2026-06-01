import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.webp';
import { CONTACT, ROOMS, MAP, waLink } from '../constants';
import api from '../api/axios';
import './Footer.css';

export default function Footer() {
  const [isSeason, setIsSeason] = useState(false);

  useEffect(() => {
    const fetchSeasonStatus = async () => {
      try {
        const res = await api.get('/api/admin/settings/public');
        if (res.data.success) {
          setIsSeason(res.data.isSeason);
        }
      } catch (err) {
        console.error('Failed to fetch season status in footer:', err);
      }
    };
    fetchSeasonStatus();
  }, []);

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo-row">
            <span className="footer-logo-circle">
              <img src={logo} alt="BSS Residency" width="48" height="48" />
            </span>
            <div className="footer-logo-text">
              <span className="logo-bss">BSS</span>
              <span className="logo-rest">Residency</span>
            </div>
          </div>
          <p className="footer-addr">
            {CONTACT.addressLine1},<br />
            {CONTACT.addressLine2}
          </p>
          <a
            href={waLink('Hello BSS Residency!')}
            className="footer-wa"
            target="_blank"
            rel="noreferrer"
          >
            <i className="fa-brands fa-whatsapp"></i> WhatsApp Us
          </a>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/rooms">Rooms</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/booking">Book Now</Link>
          <Link to="/booking/manage">Manage Booking</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/faq">FAQ</Link>
        </div>

        <div className="footer-links">
          <h4>Our Rooms</h4>
          {ROOMS.map((r) => (
            <span key={r.key}>
              {r.name} — {r.type}
            </span>
          ))}
          <p className="footer-price-note">
            Starts from <span className="currency-symbol">₹</span>{isSeason ? '1,300' : '1,000'} / night
          </p>
        </div>

        <div className="footer-contact">
          <h4>Contact</h4>
          <p>📞 {CONTACT.phonePrimary}</p>
          <p>📞 {CONTACT.phoneSecondary}</p>
          <p><i className="fa-brands fa-instagram"></i> <a href={`https://instagram.com/${CONTACT.instagram}`} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>@{CONTACT.instagram}</a></p>
          <a
            href={MAP.directUrl}
            target="_blank"
            rel="noreferrer"
            className="map-link"
          >
            View on Google Maps →
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>Copyright © {new Date().getFullYear()} BSS Residency, Courtallam. All rights reserved | Website Designed ❤️ by <span style={{ color: 'var(--accent)' }}>-Yuvasri Arumugasamy</span></p>
        <Link to="/admin/login" className="admin-link">Admin</Link>
      </div>
    </footer>
  );
}
