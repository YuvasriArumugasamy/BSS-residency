import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import roomAc1 from '../assets/room-ac-1.jpg';
import roomAc2 from '../assets/room-ac-2.jpg';
import roomAc3 from '../assets/room-ac-3.jpg';
import roomFamily from '../assets/room-family.jpg';
import { ROOMS, waLink, WA_TEMPLATES, CONTACT } from '../constants';
import './Rooms.css';

const imgMap = {
  'double-bed': roomAc2,
  'double-bed-ac': roomAc3,
  'four-bed': roomAc1,
  'four-bed-ac': roomFamily,
};

export default function Rooms() {
  const [isSeason, setIsSeason] = useState(false);

  useEffect(() => {
    api.get('/api/admin/settings/public')
      .then(res => {
        if (res.data.success) setIsSeason(res.data.isSeason);
      })
      .catch(err => console.error('Error fetching season status:', err));
  }, []);

  const getPrice = (room) => isSeason ? room.seasonPrice : room.nonSeasonPrice;

  return (
    <main className="rooms-page">
      {/* Page Hero */}
      <section className="page-hero">
        <div className="page-hero-content">
          <p className="section-label gold">Accommodations</p>
          <h1>Our <em>Rooms & Tariff</em></h1>
          <p>Four room types — clean, comfortable, and priced right. Something for every guest.</p>
        </div>
      </section>

      {/* Tariff summary table */}
      <section className="tariff-summary container">
        <h2>Room Tariff</h2>
        <div className="divider-gold center" />
        <div className="tariff-table-wrap">
          <table className="tariff-table">
            <thead>
              <tr>
                <th>Room Type</th>
                <th>Category</th>
                <th>Price / Night</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {ROOMS.map((r) => (
                <tr key={r.key}>
                  <td>
                    <span className="tt-icon">{r.icon}</span>
                    <strong>{r.name}</strong>
                  </td>
                  <td><span className="tt-pill">{r.type}</span></td>
                  <td className="tt-price">₹{getPrice(r).toLocaleString('en-IN')}</td>
                  <td>
                    <Link to="/booking" className="btn-gold-sm"><span>Book Now</span></Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="tariff-note">All rates are per night. Taxes as applicable. Rates may vary during festival/peak seasons.</p>
      </section>

      {/* Rooms List */}
      <section className="rooms-list container">
        {ROOMS.map((room, i) => (
          <div key={room.key} className={`room-detail-card ${i % 2 === 1 ? 'reverse' : ''}`}>
            <div className="room-detail-img">
              <img src={imgMap[room.key]} alt={room.name} />
              <div className="room-type-badge">{room.type}</div>
              <div className="room-price-badge">
                <span className="currency-symbol">₹</span>{getPrice(room).toLocaleString('en-IN')}<span>/ night</span>
              </div>
            </div>
            <div className="room-detail-info">
              <span className="r-icon-lg">{room.icon}</span>
              <h2>{room.name}</h2>
              <div className="divider-gold" />
              <p className="r-desc">{room.desc}</p>
              <ul className="r-features-grid">
                {room.features.map((f) => (
                  <li key={f}><span className="check">✓</span> {f}</li>
                ))}
              </ul>
              <div className="r-price-note">
                <div className="r-price-inline">
                  <span className="currency-symbol">₹</span>
                  <span className="r-price-inline-amt">{getPrice(room).toLocaleString('en-IN')}</span>
                  <span className="r-price-inline-unit">/ night</span>
                </div>
                <Link to="/booking" className="btn-primary-sm"><span>Book Online</span></Link>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Pricing note */}
      <section className="pricing-note-section">
        <div className="container">
          <div className="pricing-note-card">
            <h3>📋 Quick Booking</h3>
            <p>Prefer to book instantly? Chat with us on WhatsApp or call for immediate confirmation. We guarantee the best rates when you book directly with us.</p>
            <div className="pricing-actions">
              <a href={waLink('Hello BSS Residency! Please share the current room tariff.')} className="btn-wa" target="_blank" rel="noreferrer"><i className="fa-brands fa-whatsapp"></i> WhatsApp Us</a>
              <Link to="/booking" className="btn-gold"><span>Book Now</span></Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
