import React from 'react';
import './Contact.css';

export default function Contact() {
  return (
    <main className="contact-page">
      <section className="page-hero">
        <p className="section-label" style={{ color: '#93C5FD' }}>Get In Touch</p>
        <h1>Contact <em>Us</em></h1>
        <p>We're here to help. Reach us on WhatsApp for fastest response.</p>
      </section>

      <section className="contact-section container">
        <div className="contact-grid">
          {/* Info cards */}
          <div className="contact-info">
            <div className="contact-card">
              <span className="c-icon">📍</span>
              <div>
                <h3>Address</h3>
                <p>BSS Residency<br />215, Ramanuja Nagar,<br />Courtallam, Tamil Nadu – 627 802</p>
                <a href="https://maps.app.goo.gl/HoVrP5LYitnw8qJ1A" target="_blank" rel="noreferrer" className="c-link">
                  Open in Google Maps →
                </a>
              </div>
            </div>

            <div className="contact-card">
              <span className="c-icon">💬</span>
              <div>
                <h3>WhatsApp Booking</h3>
                <p>+91 XXXXXXXXXX</p>
                <p className="c-note">Available 24 hours · Fastest response</p>
                <a href="https://wa.me/91XXXXXXXXXX?text=Hello%20BSS%20Residency!" target="_blank" rel="noreferrer" className="btn-wa-inline">
                  💬 Chat Now
                </a>
              </div>
            </div>

            <div className="contact-card">
              <span className="c-icon">🕐</span>
              <div>
                <h3>Check-in / Check-out</h3>
                <p>Check-in: <strong>12:00 PM</strong></p>
                <p>Check-out: <strong>11:00 AM</strong></p>
                <p className="c-note">Early / late check-in available on request</p>
              </div>
            </div>

            <div className="contact-card">
              <span className="c-icon">💧</span>
              <div>
                <h3>Nearby Attraction</h3>
                <p>Courtallam Main Falls — just minutes away</p>
                <p className="c-note">The Spa of South India</p>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="map-section">
            <a
              href="https://maps.app.goo.gl/HoVrP5LYitnw8qJ1A"
              target="_blank" rel="noreferrer"
              className="map-placeholder"
            >
              <span className="map-icon-big">🗺️</span>
              <h3>BSS Residency</h3>
              <p>215, Ramanuja Nagar, Courtallam</p>
              <span className="map-cta">Click to open in Google Maps →</span>
            </a>

            <div className="amenities-list">
              <h3>Amenities</h3>
              <div className="am-grid">
                {[
                  ['🍽️', 'Restaurant & Food'],
                  ['🅿️', 'Free Parking'],
                  ['🚿', '24hr Hot Water'],
                  ['🔒', 'CCTV Security'],
                  ['💧', 'Near Courtallam Falls'],
                  ['🛎️', '24/7 Service'],
                ].map(([icon, label]) => (
                  <div key={label} className="am-item">
                    <span>{icon}</span>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
