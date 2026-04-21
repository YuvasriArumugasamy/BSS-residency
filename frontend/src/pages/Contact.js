import React from 'react';
import { CONTACT, MAP, NEARBY_PLACES, AMENITIES, waLink } from '../constants';
import './Contact.css';

export default function Contact() {
  return (
    <main className="contact-page">
      <section className="page-hero">
        <p className="section-label gold">Get In Touch</p>
        <h1>Contact <em>Us</em></h1>
        <p>We're here to help. Reach us on WhatsApp for fastest response.</p>
      </section>

      <section className="contact-section container">
        <div className="contact-grid">
          {/* Info cards */}
          <div className="contact-info">
            <div className="contact-card">
              <span className="c-icon"><i className="fa-solid fa-location-dot"></i></span>
              <div>
                <h3>Address</h3>
                <p>
                  BSS Residency<br />
                  {CONTACT.addressLine1},<br />
                  {CONTACT.addressLine2}
                </p>
                <a
                  href={MAP.directUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="c-link"
                >
                  Open in Google Maps →
                </a>
              </div>
            </div>

            <div className="contact-card">
              <span className="c-icon">📞</span>
              <div>
                <h3>Phone</h3>
                <p>
                  <a href={`tel:${CONTACT.phonePrimary.replace(/\s/g, '')}`}>
                    {CONTACT.phonePrimary}
                  </a>
                </p>
                <p>
                  <a href={`tel:+91${CONTACT.phoneSecondary.replace(/[^0-9]/g, '').slice(-10)}`}>
                    {CONTACT.phoneSecondary}
                  </a>
                </p>
                <p className="c-note">Available 24 hours</p>
              </div>
            </div>

            <div className="contact-card">
              <span className="c-icon"><i className="fa-brands fa-whatsapp"></i></span>
              <div>
                <h3>WhatsApp Booking</h3>
                <p>{CONTACT.phonePrimary}</p>
                <p className="c-note">Fastest response — 24/7</p>
                <div className="contact-card-actions">
                  <a
                    href={waLink('Hello BSS Residency! I would like to make a booking.')}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-wa-inline"
                  >
                    <i className="fa-brands fa-whatsapp"></i> WhatsApp
                  </a>
                  <a
                    href={`https://instagram.com/${CONTACT.instagram}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-insta-inline"
                  >
                    <i className="fa-brands fa-square-instagram"></i> Instagram
                  </a>
                </div>
              </div>
            </div>

            <div className="contact-card">
              <span className="c-icon"><i className="fa-brands fa-square-instagram"></i></span>
              <div>
                <h3>Instagram</h3>
                <p>
                  <a href={`https://instagram.com/${CONTACT.instagram}`} target="_blank" rel="noreferrer">
                    @{CONTACT.instagram}
                  </a>
                </p>
                <p className="c-note">Follow us for latest updates & photos</p>
              </div>
            </div>

            <div className="contact-card">
              <span className="c-icon">🕐</span>
              <div>
                <h3>Check-in / Check-out</h3>
                <p>Check-in: <strong>{CONTACT.checkIn}</strong></p>
                <p>Check-out: <strong>{CONTACT.checkOut}</strong></p>
                <p className="c-note">Early / late check-in available on request</p>
              </div>
            </div>
          </div>

          {/* Map + nearby */}
          <div className="map-section">
            <div className="map-embed-wrap">
              <iframe
                src={MAP.embedSrc}
                title="BSS Residency — Courtallam"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <a
                href={MAP.directUrl}
                target="_blank"
                rel="noreferrer"
                className="map-cta-overlay"
              >
                🗺️ Open in Google Maps
              </a>
            </div>

            <div className="nearby-card">
              <div className="nearby-head">
                <h3>
                  <i className="fa-solid fa-location-dot"></i> Nearby Places
                </h3>
                <span className="nearby-count">{NEARBY_PLACES.length} spots</span>
              </div>
              <ul className="nearby-list">
                {NEARBY_PLACES.map((p) => (
                  <li key={p.name} className="nearby-item">
                    <span className="nearby-dot" />
                    <span className="nearby-name">{p.name}</span>
                    <span className="nearby-dist">{p.distance}</span>
                  </li>
                ))}
              </ul>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Courtallam+tourist+places"
                target="_blank"
                rel="noreferrer"
                className="nearby-more"
              >
                View more on Google Maps →
              </a>
            </div>

            <div className="amenities-list">
              <h3>Amenities</h3>
              <div className="am-grid">
                {AMENITIES.map((a) => (
                  <div key={a.label} className="am-item">
                    <span>{a.icon}</span>
                    <span>{a.label}</span>
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
