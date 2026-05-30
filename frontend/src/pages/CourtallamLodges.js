import React from 'react';
import SEO from '../components/SEO';
import './CourtallamLodges.css'; // optional styling file

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
      <div className="courtallam-hero" style={{
        minHeight: '70vh',
        backgroundImage: 'url(https://www.bssresidency.com/hero-courtallam.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        textShadow: '0 2px 4px rgba(0,0,0,0.6)'
      }}>
        <h1 style={{ fontSize: '2.8rem', fontWeight: 800 }}>Courtallam Nearby Lodges – BSS Residency</h1>
      </div>
      <section className="courtallam-content" style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#333' }}>
          Nestled just minutes from the spectacular Courtallam waterfalls, BSS Residency offers premium rooms, family‑friendly amenities, and breathtaking views.
          Whether you are seeking a romantic getaway or a family vacation, our lodge provides comfortable A/C and non‑A/C rooms at affordable rates.
        </p>
        <h2 style={{ marginTop: '2rem', fontSize: '1.8rem', color: '#1e293b' }}>Why Choose BSS Residency?</h2>
        <ul style={{ marginTop: '1rem', color: '#475569', fontSize: '1rem' }}>
          <li>Prime location – just a 5‑minute walk from Main Falls and the bus stand.</li>
          <li>Spacious rooms with modern amenities.</li>
          <li>Flexible pricing – peak season rates and regular rates clearly displayed.</li>
          <li>Easy online booking and instant confirmation.</li>
          <li>Highly rated guest reviews on Google and TripAdvisor.</li>
        </ul>
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <a href="/booking" style={{
            display: 'inline-block',
            background: '#d4a857',
            color: '#fff',
            padding: '0.8rem 1.6rem',
            borderRadius: '8px',
            fontSize: '1rem',
            textDecoration: 'none',
            boxShadow: '0 2px 6px rgba(212,168,87,0.3)'
          }}>Book Your Stay Now</a>
        </div>
      </section>
    </>
  );
};

export default CourtallamLodges;
