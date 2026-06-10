import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { CONTACT } from '../constants';
import buildingImg from '../assets/building.webp';
import mainFallsImg from '../assets/main-falls.webp';
import fiveFallsImg from '../assets/five falls.webp';
import oldFallsImg from '../assets/old falls.webp';
import './CourtallamLodges.css';

// Local Business schema for Courtallam lodge
const localSchema = {
  "@context": "https://schema.org",
  "@type": "Hotel",
  "name": "BSS Residency",
  "url": `${window.location.origin}/courtallam-lodges`,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Near Main Falls, Courtallam",
    "addressLocality": "Courtallam",
    "addressRegion": "Tamil Nadu",
    "postalCode": "627807",
    "addressCountry": "IN"
  },
  "telephone": "+91 88385 99755",
  "priceRange": "₹500-₹5000",
  "geo": { "@type": "GeoCoordinates", "latitude": 8.9657, "longitude": 77.1072 },
  "sameAs": [
    "https://www.google.com/maps/place/BSS+Residency",
    "https://www.facebook.com/bssresidency",
    "https://www.instagram.com/bssresidency"
  ]
};

const CourtallamLodges = () => {
  return (
    <>
      <SEO
        title="Courtallam Nearby Lodges – BSS Residency | Best Stay Near Waterfalls"
        description="BSS Residency is the top lodge near Courtallam waterfalls. Book premium rooms, enjoy scenic views, and experience excellent hospitality."
        keywords="courtallam nearby lodges, courtallam hotel, courtallam rooms for rent, hotel near courtallam waterfalls, courtallam lodging"
        image="https://www.bssresidency.com/hero-courtallam.jpg"
        schemaMarkup={localSchema}
      />
      
      <div className="courtallam-page">
        {/* Premium Hero Section */}
        <div 
          className="courtallam-hero" 
          style={{ backgroundImage: `url(${mainFallsImg})` }}
        >
          <div className="courtallam-hero-content">
            <span className="courtallam-badge">✦ Courtallam's Premium Stay ✦</span>
            <h1>
              Courtallam Nearby Lodges <br />
              <em>BSS Residency</em>
            </h1>
            <p>
              Experience the absolute comfort of premium A/C & Non-A/C rooms, just a 5-minute walk from the majestic Courtallam Main Falls.
            </p>
            <div className="courtallam-cta-buttons">
              <Link to="/booking" className="courtallam-btn-primary">
                📞 Book Your Stay Now
              </Link>
              <Link to="/rooms" className="courtallam-btn-secondary">
                View Rooms
              </Link>
            </div>
          </div>
        </div>

        {/* Intro Section with Side-by-Side Image */}
        <section className="courtallam-intro-section">
          <div className="courtallam-intro-card">
            <div className="courtallam-intro-text">
              <span className="courtallam-badge" style={{ width: 'fit-content', marginBottom: '1rem' }}>Welcome to Premium Stay</span>
              <h2>Your Perfect Stay <em>Near The Waterfalls</em></h2>
              <div className="courtallam-divider" />
              <p>
                Nestled just minutes from the spectacular Courtallam waterfalls, <strong>BSS Residency</strong> offers premium accommodations, family-friendly amenities, and breathtaking scenery. 
              </p>
              <p>
                Whether you are seeking a romantic getaway, a temple pilgrimage, or a rejuvenating family vacation, our lodge provides highly clean, comfortable, and affordable rooms designed with your comfort in mind.
              </p>
            </div>
            
            <div className="courtallam-intro-image">
              <img src={buildingImg} alt="BSS Residency Building Exterior" loading="lazy" />
              <div className="courtallam-image-overlay">
                🏨 <span>Premium Lodge</span>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Grid */}
        <section className="courtallam-features-section">
          <div className="courtallam-section-title">
            <h2>Why Choose <em>BSS Residency</em>?</h2>
            <p className="courtallam-section-subtitle">We promise quality, hospitality, and an unforgettable staying experience.</p>
          </div>
          
          <div className="courtallam-features-grid">
            <div className="courtallam-feature-card">
              <div className="courtallam-card-icon">📍</div>
              <h3>Prime Location</h3>
              <p>Just a 5-minute walk (100 metres) from Courtallam Main Falls, old bus stand, and local dining hubs.</p>
            </div>
            
            <div className="courtallam-feature-card">
              <div className="courtallam-card-icon">💎</div>
              <h3>Modern Amenities</h3>
              <p>Spacious, pristine rooms featuring high-end DC Inverter air conditioning, premium mattresses, and smart LED TVs.</p>
            </div>
            
            <div className="courtallam-feature-card">
              <div className="courtallam-card-icon">💰</div>
              <h3>Transparent Pricing</h3>
              <p>Highly affordable, flexible pricing options with standard and peak season tariffs clearly detailed with no hidden costs.</p>
            </div>
            
            <div className="courtallam-feature-card">
              <div className="courtallam-card-icon">⚡</div>
              <h3>Instant Booking</h3>
              <p>Secure online lodging requests with instant confirmations and responsive support directly over WhatsApp.</p>
            </div>
          </div>
        </section>

        {/* Attractions Highlights Section */}
        <section className="courtallam-attractions-section">
          <div className="courtallam-section-title">
            <h2>Spectacular <em>Attractions</em> Near Us</h2>
            <p className="courtallam-section-subtitle">Stay close to the most breathtaking locations in Courtallam.</p>
          </div>

          <div className="courtallam-attractions-grid">
            <div className="courtallam-attraction-card">
              <div className="courtallam-attraction-img">
                <img src={mainFallsImg} alt="Main Falls Courtallam" loading="lazy" />
                <span className="courtallam-attraction-tag">📍 100 Metres</span>
              </div>
              <div className="courtallam-attraction-info">
                <h3>Main Falls (Peraruvi)</h3>
                <p>The legendary 60-feet waterfall offering medicinal benefits. Just seconds away from BSS Residency.</p>
              </div>
            </div>

            <div className="courtallam-attraction-card">
              <div className="courtallam-attraction-img">
                <img src={fiveFallsImg} alt="Five Falls Courtallam" loading="lazy" />
                <span className="courtallam-attraction-tag">📍 4.0 km</span>
              </div>
              <div className="courtallam-attraction-info">
                <h3>Five Falls (Aintharuvi)</h3>
                <p>Divided naturally into five beautiful streams. It is highly regarded as one of the best scenic falls here.</p>
              </div>
            </div>

            <div className="courtallam-attraction-card">
              <div className="courtallam-attraction-img">
                <img src={oldFallsImg} alt="Old Falls Courtallam" loading="lazy" />
                <span className="courtallam-attraction-tag">📍 6.0 km</span>
              </div>
              <div className="courtallam-attraction-info">
                <h3>Old Courtallam Falls</h3>
                <p>A tranquil, spacious bathing experience perfect for families looking to avoid the tourist crowd.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Direct CTA Section */}
        <section className="courtallam-cta-section">
          <div className="courtallam-cta-banner">
            <div className="courtallam-cta-content">
              <h2>Ready to Experience <em>Courtallam's Magic</em>?</h2>
              <p>
                Secure your clean and comfortable room directly with us at the best price online. Fast confirmation via WhatsApp is guaranteed!
              </p>
              <div className="courtallam-cta-buttons">
                <Link to="/booking" className="courtallam-btn-primary">
                  📞 Book Now - Best Price!
                </Link>
                <a href={`tel:${CONTACT.phonePrimary.replace(/\s/g, '')}`} className="courtallam-btn-secondary">
                  📞 Call {CONTACT.phonePrimary}
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default CourtallamLodges;
