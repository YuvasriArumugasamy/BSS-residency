import React, { useState } from 'react';
import buildingImg from '../assets/building.png';
import roomImg from '../assets/room.jpg';
import './Gallery.css';

const photos = [
  { id: 1, src: buildingImg, caption: 'BSS Residency — Exterior View', category: 'Exterior' },
  { id: 2, src: roomImg,     caption: 'AC Room — Premium Comfort',    category: 'Rooms' },
  { id: 3, src: buildingImg, caption: 'Building Facade — Evening',     category: 'Exterior' },
  { id: 4, src: roomImg,     caption: 'Clean & Comfortable Bedding',   category: 'Rooms' },
  { id: 5, src: buildingImg, caption: 'Parking Area — Ample Space',    category: 'Facilities' },
  { id: 6, src: roomImg,     caption: 'Room Interior — Marble Finish', category: 'Rooms' },
];

const categories = ['All', 'Exterior', 'Rooms', 'Facilities'];

export default function Gallery() {
  const [active, setActive] = useState('All');
  const [lightbox, setLightbox] = useState(null);

  const filtered = active === 'All' ? photos : photos.filter(p => p.category === active);

  return (
    <main className="gallery-page">
      <section className="page-hero">
        <div className="page-hero-content">
          <p className="section-label" style={{ color: '#93C5FD' }}>Visual Tour</p>
          <h1>Our <em>Gallery</em></h1>
          <p>Take a look inside BSS Residency — rooms, facilities, and surroundings.</p>
        </div>
      </section>

      <section className="gallery-section container">
        {/* Filter tabs */}
        <div className="filter-tabs">
          {categories.map(c => (
            <button
              key={c}
              className={`filter-tab ${active === c ? 'active' : ''}`}
              onClick={() => setActive(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="photo-grid">
          {filtered.map(photo => (
            <div
              key={photo.id}
              className="photo-card"
              onClick={() => setLightbox(photo)}
            >
              <img src={photo.src} alt={photo.caption} />
              <div className="photo-overlay">
                <span className="photo-zoom">🔍</span>
                <p>{photo.caption}</p>
              </div>
              <span className="photo-cat-tag">{photo.category}</span>
            </div>
          ))}
        </div>

        <div className="gallery-note">
          <p>📸 More photos coming soon! Share yours with us on WhatsApp.</p>
          <a
            href="https://wa.me/91XXXXXXXXXX"
            className="btn-wa"
            target="_blank" rel="noreferrer"
          >
            💬 Send Your Photos
          </a>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <div className="lightbox-inner" onClick={e => e.stopPropagation()}>
            <button className="lb-close" onClick={() => setLightbox(null)}>✕</button>
            <img src={lightbox.src} alt={lightbox.caption} />
            <p className="lb-caption">{lightbox.caption}</p>
          </div>
        </div>
      )}
    </main>
  );
}
