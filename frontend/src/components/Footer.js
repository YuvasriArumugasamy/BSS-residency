import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="logo-bss">BSS</span> Residency
          </div>
          <p>215, Ramanuja Nagar, Courtallam,<br />Tamil Nadu – 627 802</p>
          <a
            href="https://wa.me/91XXXXXXXXXX"
            className="footer-wa"
            target="_blank"
            rel="noreferrer"
          >
            💬 WhatsApp Us
          </a>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/rooms">Rooms</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/booking">Book Now</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="footer-links">
          <h4>Room Types</h4>
          <span>AC Room</span>
          <span>Non-AC Room</span>
          <span>Family Room</span>
          <span>Dormitory</span>
          <span>Suite Room</span>
        </div>

        <div className="footer-contact">
          <h4>Contact</h4>
          <p>📍 Courtallam, Tamil Nadu</p>
          <p>💬 +91 XXXXXXXXXX</p>
          <p>🕐 Check-in: 12:00 PM</p>
          <p>🕐 Check-out: 11:00 AM</p>
          <a href="https://maps.app.goo.gl/HoVrP5LYitnw8qJ1A" target="_blank" rel="noreferrer" className="map-link">
            View on Google Maps →
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 BSS Residency, Courtallam. All rights reserved.</p>
        <Link to="/admin/login" className="admin-link">Admin</Link>
      </div>
    </footer>
  );
}
