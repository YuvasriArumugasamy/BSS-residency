import React, { useState } from 'react';
import buildingImg from '../assets/building.png';
import roomImg from '../assets/room.jpg';
import roomAc1 from '../assets/room-ac-1.jpg';
import roomAc2 from '../assets/room-ac-2.jpg';
import roomAc3 from '../assets/room-ac-3.jpg';
import roomFamily from '../assets/room-family.jpg';
import { waLink, CONTACT } from '../constants';
import api from '../api/axios';
import './Gallery.css';

const staticPhotos = [
  { id: 's1', src: buildingImg, caption: 'BSS Residency — Exterior View',  category: 'Exterior' },
  { id: 's2', src: roomAc2,     caption: 'A/C Room — Premium Comfort',      category: 'Rooms' },
  { id: 's3', src: roomAc1,     caption: 'Four Bed A/C Room',               category: 'Rooms' },
  { id: 's4', src: roomImg,     caption: 'Clean & Comfortable Bedding',     category: 'Rooms' },
  { id: 's5', src: roomFamily,  caption: 'Double Bed Room — Cosy Interiors', category: 'Rooms' },
  { id: 's6', src: roomAc3,     caption: 'Spacious Family Room',            category: 'Rooms' },
  { id: 's7', src: buildingImg, caption: 'Parking Area (Limited Space)',      category: 'Facilities' },
];

const categories = ['All', 'Exterior', 'Rooms', 'Facilities', 'Other'];

const API_BASE = process.env.REACT_APP_API_URL || 'https://bss-residency-2.onrender.com';

export default function Gallery() {
  const [active, setActive] = useState('All');
  const [lightbox, setLightbox] = useState(null);
  const [dynamicPhotos, setDynamicPhotos] = useState([]);

  React.useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await api.get('/api/gallery');
        if (res.data.success) {
          const formatted = res.data.images.map(img => ({
            id: img._id,
            src: img.imageUrl.startsWith('http') ? img.imageUrl : `${API_BASE}${img.imageUrl}`,
            caption: img.title,
            category: img.category === 'Room' ? 'Rooms' : img.category // Map to existing categories
          }));
          setDynamicPhotos(formatted);
        }
      } catch (err) {
        console.error('Error fetching gallery:', err);
      }
    };
    fetchGallery();
  }, []);

  const photos = [...dynamicPhotos, ...staticPhotos];
  const filtered = active === 'All' ? photos : photos.filter(p => p.category === active);

  return (
    <main className="gallery-page">
      <section className="page-hero">
        <div className="page-hero-content">
          <p className="section-label gold">Visual Tour</p>
          <h1>Our <em>Gallery</em></h1>
          <p>Take a look inside BSS Residency — rooms, facilities, and surroundings.</p>
        </div>
      </section>

      <section className="gallery-section container">
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
          <div className="gallery-actions">
            <a
              href={waLink('Hello BSS Residency! I would like to share/request gallery photos.')}
              className="btn-wa"
              target="_blank" rel="noreferrer"
            >
              Send Your Photos
            </a>
            <a
              href={`https://instagram.com/${CONTACT.instagram}`}
              className="btn-insta-sm"
              target="_blank" rel="noreferrer"
            >
              <i className="fa-brands fa-square-instagram"></i> Instagram
            </a>
          </div>
        </div>
      </section>

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
