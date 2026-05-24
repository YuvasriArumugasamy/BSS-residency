import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, Users, ArrowRight } from 'lucide-react';
import Reveal from '../components/Reveal';

const Rooms = () => {
  const navigate = useNavigate();

  const rooms = [
    { type: 'Non-AC Single Room', category: 'Single', price: 1500, img: '/assets/bedroom.jpg', desc: 'A comfortable and budget-friendly room perfect for solo travelers. Features a cozy single bed, nature view, and all essential amenities for a peaceful stay.' },
    { type: 'Non-AC Double Room', category: 'Double', price: 1800, img: '/assets/hallway_open_door.jpg', desc: 'Spacious non-AC room with a double bed, ideal for couples or friends. Enjoy natural ventilation with mountain breeze and scenic surroundings.' },
    { type: 'AC Deluxe Room', category: 'Double', price: 2500, img: '/assets/dining.jpg', desc: 'A premium air-conditioned room offering superior comfort with modern decor, plush bedding, and a private balcony overlooking the lush gardens.' },
    { type: 'AC Family Room', category: 'Family', price: 3500, img: '/assets/outdoor2.jpg', desc: 'Perfect for families, this spacious AC room features multiple beds, a sitting area, and extra amenities to ensure a comfortable stay for everyone.' },
    { type: 'Premium Suite', category: 'Family', price: 6000, img: '/assets/hero.jpg', desc: 'Our premium suite offers an exclusive experience with a separate living area, luxury furnishings, and panoramic views of the Courtallam landscape.' },
    { type: 'Luxury Suite', category: 'Family', price: 10000, img: '/assets/hallway_washbasin.jpg', desc: 'The ultimate indulgence — our luxury suite features opulent decor, a private jacuzzi area, premium amenities, and personalized butler service.' },
  ];

  const animations = ['flip-left', 'fade-up', 'flip-left', 'fade-up', 'flip-left', 'fade-up'];

  return (
    <div className="rooms-page page-transition">
      <div className="page-banner">
        <h1>Our Rooms</h1>
        <p>Choose from our range of comfortable and luxurious rooms</p>
      </div>

      <section className="rooms-section section-padding">
        <div className="container">
          <div className="rooms-grid">
            {rooms.map((room, i) => (
              <Reveal key={i} animation={animations[i]} delay={i % 3 * 120}>
                <div className="room-card card">
                  <div className="room-img-wrap">
                    <img src={room.img} alt={room.type} />
                  </div>
                  <div className="room-body">
                    <h3 className="room-title">{room.type}</h3>
                    <div className="room-category"><Users size={14} /> {room.category}</div>
                    <p className="room-desc">{room.desc}</p>
                    <div className="room-footer">
                      <div className="room-price">
                        <Tag size={16} className="price-icon" />
                        <span className="price-amount">₹{room.price.toLocaleString()}</span>
                        <span className="price-per">/ day</span>
                      </div>
                      <button className="btn-primary room-book-btn" onClick={() => navigate('/book')}>
                        Book Now <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .rooms-page { padding-top: 64px; }
        .rooms-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
        .room-card { background: var(--white); border-radius: 12px; overflow: hidden; box-shadow: var(--shadow-card); transition: var(--transition-smooth); }
        .room-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-xl); }
        .room-img-wrap { height: 220px; overflow: hidden; }
        .room-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: var(--transition-smooth); }
        .room-card:hover .room-img-wrap img { transform: scale(1.05); }
        .room-body { padding: 24px; }
        .room-title { font-family: var(--font-body); font-size: 1.15rem; font-weight: 700; color: var(--text-dark); margin-bottom: 6px; }
        .room-category { display: inline-flex; align-items: center; gap: 4px; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 12px; }
        .room-desc { font-size: 0.88rem; color: var(--text-body); line-height: 1.6; margin-bottom: 20px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .room-footer { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
        .room-price { display: flex; align-items: center; gap: 4px; }
        .price-icon { color: var(--gold-accent); }
        .price-amount { font-size: 1.1rem; font-weight: 700; color: #2e7d32; }
        .price-per { font-size: 0.85rem; color: var(--text-muted); }
        .room-book-btn { padding: 8px 20px; font-size: 0.85rem; }
        @media (max-width: 992px) { .rooms-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .rooms-grid { grid-template-columns: 1fr; } }
      `}} />
    </div>
  );
};

export default Rooms;
