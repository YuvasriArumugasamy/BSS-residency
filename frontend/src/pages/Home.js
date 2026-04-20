import React from 'react';
import { Link } from 'react-router-dom';
import buildingImg from '../assets/building.png';
import roomImg from '../assets/room.jpg';
import './Home.css';

const amenities = [
  { icon: '🍽️', label: 'Restaurant' },
  { icon: '🅿️', label: 'Free Parking' },
  { icon: '🚿', label: '24hr Hot Water' },
  { icon: '🔒', label: 'CCTV Security' },
  { icon: '💧', label: 'Near Courtallam Falls' },
];

const rooms = [
  { icon: '❄️', name: 'AC Room', desc: 'Cool comfort with modern air conditioning.' },
  { icon: '🌿', name: 'Non-AC Room', desc: 'Natural breeze — calm & refreshing.' },
  { icon: '👨‍👩‍👧‍👦', name: 'Family Room', desc: 'Spacious stay for the whole family.' },
  { icon: '🛏️', name: 'Dormitory', desc: 'Budget-friendly shared accommodation.' },
  { icon: '👑', name: 'Suite Room', desc: 'Premium luxury for discerning guests.' },
];

export default function Home() {
  return (
    <main className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-img-wrap">
          <img src={buildingImg} alt="BSS Residency Building" className="hero-bg-img" />
          <div className="hero-overlay" />
        </div>
        <div className="hero-content fade-up">
          <span className="hero-badge">✦ Courtallam's Premium Stay ✦</span>
          <h1>
            Welcome to<br />
            <span className="hero-brand">BSS Residency</span>
          </h1>
          <p>Experience premium comfort steps away from the majestic Courtallam Falls</p>
          <div className="hero-btns">
            <Link to="/booking" className="btn-primary">Book Your Stay</Link>
            <Link to="/rooms" className="btn-outline-white">Explore Rooms</Link>
          </div>
        </div>
        <div className="hero-scroll">
          <div className="scroll-dot" />
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* Amenities strip */}
      <section className="amenities-strip">
        {amenities.map((a) => (
          <div key={a.label} className="amenity">
            <span className="a-icon">{a.icon}</span>
            <span className="a-label">{a.label}</span>
          </div>
        ))}
      </section>

      {/* About section */}
      <section className="home-about container">
        <div className="about-img-wrap">
          <img src={buildingImg} alt="BSS Residency" />
          <div className="about-badge-box">
            <span className="badge-icon">🏨</span>
            <span className="badge-txt">Premium Lodge</span>
          </div>
        </div>
        <div className="about-text">
          <p className="section-label">About Us</p>
          <h2>A Sanctuary in the<br /><em>Heart of Courtallam</em></h2>
          <div className="divider-blue" />
          <p>BSS Residency stands at 215, Ramanuja Nagar — moments from the legendary Courtallam Falls. We offer modern rooms with premium amenities, ideal for families, pilgrims, and leisure travellers.</p>
          <p>With 5 room types ranging from budget dormitories to luxury suites, we have the perfect accommodation for every guest and every budget.</p>
          <div className="about-stats">
            <div className="stat"><span className="stat-n">5</span><span className="stat-l">Room Types</span></div>
            <div className="stat"><span className="stat-n">24/7</span><span className="stat-l">Service</span></div>
            <div className="stat"><span className="stat-n">⭐</span><span className="stat-l">Premium</span></div>
          </div>
          <Link to="/booking" className="btn-primary">Reserve Now</Link>
        </div>
      </section>

      {/* Room preview */}
      <section className="rooms-preview">
        <div className="container">
          <p className="section-label" style={{ textAlign: 'center' }}>Accommodations</p>
          <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Our <em>Room Types</em></h2>
          <p style={{ textAlign: 'center', color: 'var(--gray-400)', marginBottom: '3rem', fontSize: '0.9rem' }}>
            Choose the perfect room for your stay
          </p>
          <div className="rooms-grid">
            {rooms.map((r) => (
              <div key={r.name} className="room-card-home">
                <span className="r-icon">{r.icon}</span>
                <h3>{r.name}</h3>
                <p>{r.desc}</p>
                <Link to="/rooms" className="r-link">View Details →</Link>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/booking" className="btn-primary">Book a Room</Link>
          </div>
        </div>
      </section>

      {/* Room photo section */}
      <section className="room-showcase container">
        <div className="showcase-text">
          <p className="section-label">Room Interior</p>
          <h2>Comfort in Every<br /><em>Detail</em></h2>
          <div className="divider-blue" />
          <p>Our AC rooms feature premium mattresses, clean marble tiles, branded pillows, and modern AC units — all maintained to the highest standard of cleanliness and comfort.</p>
          <ul className="showcase-features">
            <li>✅ DC Inverter AC</li>
            <li>✅ Premium mattress</li>
            <li>✅ Marble tile flooring</li>
            <li>✅ Attached bathroom</li>
            <li>✅ 24hr hot water</li>
            <li>✅ Daily housekeeping</li>
          </ul>
          <Link to="/booking" className="btn-primary" style={{ marginTop: '1.5rem', display: 'inline-block' }}>Book This Room</Link>
        </div>
        <div className="showcase-img">
          <img src={roomImg} alt="BSS Residency AC Room" />
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="cta-inner container">
          <h2>Ready to Experience Courtallam?</h2>
          <p>Book directly with us for the best rates. Instant confirmation via WhatsApp.</p>
          <div className="cta-btns">
            <Link to="/booking" className="btn-primary">Book Now</Link>
            <a href="https://wa.me/91XXXXXXXXXX?text=Hello%20BSS%20Residency!%20I%20would%20like%20to%20make%20a%20booking." className="btn-wa" target="_blank" rel="noreferrer">
              💬 WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
