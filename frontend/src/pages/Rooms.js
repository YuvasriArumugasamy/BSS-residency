import React from 'react';
import { Link } from 'react-router-dom';
import roomImg from '../assets/room.jpg';
import './Rooms.css';

const rooms = [
  {
    icon: '❄️', type: 'Standard', name: 'AC Room',
    desc: 'Beat the heat with our modern inverter air-conditioned rooms. Featuring premium mattresses, marble flooring, and all essential amenities for a comfortable stay.',
    features: ['DC Inverter AC', '24hr Hot Water', 'LED TV', 'Daily Housekeeping', 'Attached Bathroom', 'Power Backup'],
    img: null,
  },
  {
    icon: '🌿', type: 'Classic', name: 'Non-AC Room',
    desc: "Experience Courtallam's naturally cool climate in our well-ventilated rooms. Fresh air, clean surroundings, and all the comforts you need at a great value.",
    features: ['Ceiling Fan', '24hr Hot Water', 'LED TV', 'Daily Housekeeping', 'Attached Bathroom', 'Natural Ventilation'],
    img: null,
  },
  {
    icon: '👨‍👩‍👧‍👦', type: 'Family', name: 'Family Room',
    desc: 'Spacious family rooms designed with extra beds and ample space. Perfect for families visiting Courtallam together — plenty of room for everyone to relax.',
    features: ['Extra Beds', 'AC / Non-AC Options', '24hr Hot Water', 'LED TV', 'Spacious Layout', 'Housekeeping'],
    img: null,
  },
  {
    icon: '🛏️', type: 'Dormitory', name: 'Dormitory',
    desc: 'Clean, safe, and affordable shared accommodation. Ideal for pilgrims, solo travellers, and groups looking for budget-friendly lodging near Courtallam Falls.',
    features: ['Bunk Beds', 'Common Bathroom', '24hr Hot Water', 'Secure Lockers', 'Fan', 'CCTV Security'],
    img: null,
  },
  {
    icon: '👑', type: 'Luxury', name: 'Suite Room',
    desc: 'Our finest accommodation. Expansive suites with premium furnishings, a separate sitting area, and superior amenities for guests who expect the very best.',
    features: ['Premium AC', 'King Size Bed', 'Sitting Area', 'Premium Toiletries', 'LED TV', 'Priority Service'],
    img: roomImg,
  },
];

export default function Rooms() {
  return (
    <main className="rooms-page">
      {/* Page Hero */}
      <section className="page-hero">
        <div className="page-hero-content">
          <p className="section-label" style={{ color: '#93C5FD' }}>Accommodations</p>
          <h1>Our <em>Room Types</em></h1>
          <p>5 types of rooms — from budget dormitory to luxury suite. Something for every guest.</p>
        </div>
      </section>

      {/* Rooms List */}
      <section className="rooms-list container">
        {rooms.map((room, i) => (
          <div key={room.name} className={`room-detail-card ${i % 2 === 1 ? 'reverse' : ''}`}>
            <div className="room-detail-img">
              {room.img ? (
                <img src={room.img} alt={room.name} />
              ) : (
                <div className="img-placeholder">
                  <span>{room.icon}</span>
                  <p>Photo coming soon</p>
                </div>
              )}
              <div className="room-type-badge">{room.type}</div>
            </div>
            <div className="room-detail-info">
              <span className="r-icon-lg">{room.icon}</span>
              <h2>{room.name}</h2>
              <div className="divider-blue" />
              <p className="r-desc">{room.desc}</p>
              <ul className="r-features-grid">
                {room.features.map((f) => (
                  <li key={f}><span className="check">✓</span> {f}</li>
                ))}
              </ul>
              <div className="r-price-note">
                <span>💬 Contact for best tariff</span>
                <a
                  href={`https://wa.me/91XXXXXXXXXX?text=Hello!%20I%20would%20like%20to%20book%20a%20${encodeURIComponent(room.name)}%20at%20BSS%20Residency.`}
                  className="btn-wa-sm"
                  target="_blank" rel="noreferrer"
                >
                  Book via WhatsApp
                </a>
                <Link to="/booking" className="btn-primary-sm">Book Online</Link>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Pricing note */}
      <section className="pricing-note-section">
        <div className="container">
          <div className="pricing-note-card">
            <h3>📋 Tariff Information</h3>
            <p>Room rates at BSS Residency vary by season, room type, and special occasions. For the most accurate and current pricing, please contact us directly on WhatsApp or call us. We guarantee the best rates when you book directly with us.</p>
            <div className="pricing-actions">
              <a href="https://wa.me/91XXXXXXXXXX?text=Hello%20BSS%20Residency!%20Please%20share%20the%20current%20room%20tariff." className="btn-wa" target="_blank" rel="noreferrer">💬 Get Tariff on WhatsApp</a>
              <Link to="/booking" className="btn-primary">Book Now</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
