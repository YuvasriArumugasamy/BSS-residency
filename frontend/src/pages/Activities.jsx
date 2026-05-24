import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import Reveal from '../components/Reveal';

const Activities = () => {
  const activities = [
    { title: 'Five Falls Trek', duration: '3-4 hours', price: 500, category: 'ADVENTURE', img: '/assets/hero.jpg', desc: 'Explore the famous Five Falls of Courtallam through lush green forests and rocky terrains on this guided trek adventure.' },
    { title: 'Herbal Oil Massage', duration: '1-2 hours', price: 800, category: 'WELLNESS', img: '/assets/outdoor2.jpg', desc: 'Experience traditional Courtallam herbal oil massage therapy known for its healing properties and rejuvenating effects.' },
    { title: 'Waterfall Bath Experience', duration: '2-3 hours', price: 300, category: 'NATURE', img: '/assets/hallway_washbasin.jpg', desc: 'Visit the medicinal waterfalls of Courtallam for a unique bathing experience with naturally infused herbal waters.' },
    { title: 'Sunrise Mountain Hike', duration: '4-5 hours', price: 700, category: 'ADVENTURE', img: '/assets/bedroom.jpg', desc: 'Wake up early for a breathtaking sunrise hike through the Western Ghats with panoramic views of the valley.' },
    { title: 'Local Village Tour', duration: '3-4 hours', price: 400, category: 'CULTURE', img: '/assets/dining.jpg', desc: 'Discover the rich culture and traditions of local Tamil villages with authentic food tasting and craft demonstrations.' },
    { title: 'Sunset River Walk', duration: '2-3 hours', price: 350, category: 'NATURE', img: '/assets/hallway_open_door.jpg', desc: 'Take a peaceful evening walk along the Chittar river, enjoying the golden sunset and serene natural surroundings.' },
  ];

  const getCategoryColor = (cat) => {
    const colors = { ADVENTURE: '#2563eb', WELLNESS: '#059669', NATURE: '#0891b2', CULTURE: '#9333ea' };
    return colors[cat] || '#2563eb';
  };

  return (
    <div className="activities-page page-transition">
      <div className="page-banner">
        <h1>Activities</h1>
        <p>Explore exciting experiences during your stay</p>
      </div>

      <section className="activities-section section-padding">
        <div className="container">
          <div className="activities-grid">
            {activities.map((item, i) => (
              <Reveal key={i} animation={i % 2 === 0 ? 'slide-left' : 'slide-right'} delay={i % 3 * 100}>
                <div className="activity-card card">
                  <div className="activity-img-wrap">
                    <img src={item.img} alt={item.title} />
                    <span className="activity-badge" style={{ background: getCategoryColor(item.category) }}>{item.category}</span>
                  </div>
                  <div className="activity-body">
                    <h3>{item.title}</h3>
                    <div className="activity-duration"><Clock size={14} /> {item.duration}</div>
                    <p className="activity-desc">{item.desc}</p>
                    <div className="activity-footer">
                      <div className="activity-price">
                        <span className="price-val">₹{item.price}</span>
                        <span className="price-label">per person</span>
                      </div>
                      <button className="btn-primary activity-btn">View Details <ArrowRight size={16} /></button>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .activities-page { padding-top: 64px; }
        .activities-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
        .activity-card { background: var(--white); border-radius: 12px; overflow: hidden; box-shadow: var(--shadow-card); transition: var(--transition-smooth); }
        .activity-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-xl); }
        .activity-img-wrap { height: 220px; overflow: hidden; position: relative; }
        .activity-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: var(--transition-smooth); }
        .activity-card:hover .activity-img-wrap img { transform: scale(1.05); }
        .activity-badge { position: absolute; top: 14px; left: 14px; color: white; font-size: 0.7rem; font-weight: 700; letter-spacing: 1px; padding: 4px 12px; border-radius: 6px; }
        .activity-body { padding: 24px; }
        .activity-body h3 { font-family: var(--font-body); font-size: 1.15rem; font-weight: 700; color: var(--text-dark); margin-bottom: 6px; }
        .activity-duration { display: inline-flex; align-items: center; gap: 4px; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 12px; }
        .activity-desc { font-size: 0.88rem; color: var(--text-body); line-height: 1.6; margin-bottom: 20px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .activity-footer { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; padding-top: 16px; border-top: 1px solid var(--border-light); }
        .price-val { font-size: 1.1rem; font-weight: 700; color: #2e7d32; }
        .price-label { font-size: 0.8rem; color: var(--text-muted); margin-left: 4px; }
        .activity-btn { padding: 8px 20px; font-size: 0.85rem; }
        @media (max-width: 992px) { .activities-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .activities-grid { grid-template-columns: 1fr; } }
      `}} />
    </div>
  );
};

export default Activities;
