import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Home as HomeIcon, Clock, CreditCard, CheckCircle, MapPin, Phone, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const navigate = useNavigate();

  const stats = [
    { icon: <HomeIcon size={24} />, label: "11 Rooms", sub: "Premium Quality" },
    { icon: <Users size={24} />, label: "80 Guests", sub: "Max Capacity" },
    { icon: <Clock size={24} />, label: "24/7 Open", sub: "Always Available" },
    { icon: <CreditCard size={24} />, label: "From ₹1,500", sub: "Best Rates" },
  ];

  const amenities = [
    { icon: "🍳", title: "Full Kitchen", desc: "Equipped for your needs" },
    { icon: "🐾", title: "Pets Allowed", desc: "Bring your furry friends" },
    { icon: "🚗", title: "Free Parking", desc: "Safe and spacious" },
    { icon: "🔑", title: "24-Hour Access", desc: "Freedom to move" },
    { icon: "⛰️", title: "Mountain View", desc: "Scenic landscapes" },
    { icon: "🌊", title: "Near Waterfalls", desc: "Walk to the falls" },
    { icon: "🌳", title: "Nature Retreat", desc: "Peaceful atmosphere" },
    { icon: "👨‍👩‍👧‍👦", title: "Group Bookings", desc: "Perfect for families" },
  ];

  const rooms = [
    { 
      type: "Non-AC Room", 
      price: 1500, 
      img: "/assets/bedroom.jpg",
      features: ["Single & Double Bedrooms", "Nature View", "Budget Friendly"]
    },
    { 
      type: "AC Room", 
      price: 2000, 
      img: "/assets/hallway_open_door.jpg",
      features: ["Air Conditioned", "Modern Decor", "Superior Comfort"]
    },
    { 
      type: "Suite Room", 
      price: 10000, 
      img: "/assets/dining.jpg",
      features: ["Luxury Suite", "Premium Amenities", "Exclusive Experience"]
    }
  ];

  const galleryItems = [
    { img: "/assets/hero.jpg", category: "Exterior", title: "Resort Building View" },
    { img: "/assets/outdoor2.jpg", category: "Nature", title: "Tranquil Greenery Yard" },
    { img: "/assets/bedroom.jpg", category: "Interior", title: "Elegant Suite Interior" },
    { img: "/assets/dining.jpg", category: "Dining", title: "Grand Dining Hall" },
    { img: "/assets/hallway_washbasin.jpg", category: "Amenities", title: "Premium Washbasin Area" },
    { img: "/assets/hallway_open_door.jpg", category: "Corridor", title: "Sleek Green Hallway" }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="container hero-content text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            SM GOLDEN <span className="gold-text">RESORTS</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Your Ultimate Luxury Nature Retreat in Courtallam
          </motion.p>
          <motion.div 
            className="hero-btns"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <button className="btn-primary" onClick={() => navigate('/book')}>Book Your Stay</button>
            <a href="#rooms" className="btn-outline">Explore Rooms</a>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="stats-bar">
        <div className="container grid stats-grid">
          {stats.map((stat, i) => (
            <div key={i} className="stat-item">
              <div className="stat-icon">{stat.icon}</div>
              <div>
                <h4>{stat.label}</h4>
                <p>{stat.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about section-padding">
        <div className="container grid about-grid">
          <div className="about-img">
            <img src="/assets/outdoor2.jpg" alt="Resort" />
            <div className="img-accent"></div>
          </div>
          <div className="about-text">
            <span className="gold-text uppercase tracking-widest">About Us</span>
            <h2>A Sanctuary of Peace & Luxury</h2>
            <p>Owned by S. Murugan, SM Golden Resorts is more than just a stay; it's an experience. Located on the Old Falls Main Road, we provide a perfect blend of modern comfort and natural beauty. Whether you're looking for a budget-friendly Non-AC room or a lavish Luxury Suite, we cater to all your needs with 11 well-appointed rooms and a capacity for 80 guests.</p>
            <div className="about-features">
              <div className="feature-item"><CheckCircle size={18} className="gold-text" /> <span>Prime location near waterfalls</span></div>
              <div className="feature-item"><CheckCircle size={18} className="gold-text" /> <span>24-hour guest support</span></div>
              <div className="feature-item"><CheckCircle size={18} className="gold-text" /> <span>Safe and secure parking</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Amenities Grid */}
      <section id="amenities" className="amenities section-padding bg-gray">
        <div className="container">
          <div className="section-header text-center">
            <span className="gold-text uppercase">Our Amenities</span>
            <h2>Designed for Your Comfort</h2>
          </div>
          <div className="grid amenities-grid">
            {amenities.map((item, i) => (
              <motion.div 
                key={i} 
                className="amenity-card"
                whileHover={{ y: -10 }}
              >
                <div className="amenity-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Rooms Section */}
      <section id="rooms" className="rooms section-padding">
        <div className="container">
          <div className="section-header text-center">
            <span className="gold-text uppercase">Room Types</span>
            <h2>Select Your Perfect Stay</h2>
          </div>
          <div className="grid rooms-grid">
            {rooms.map((room, i) => (
              <div key={i} className="room-card">
                <div className="room-img">
                  <img src={room.img} alt={room.type} />
                  <div className="room-price">₹{room.price}<span>/day</span></div>
                </div>
                <div className="room-info">
                  <h3>{room.type}</h3>
                  <ul>
                    {room.features.map((f, j) => <li key={j}>{f}</li>)}
                  </ul>
                  <button className="btn-outline w-full" onClick={() => navigate('/book')}>Book This Room</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="gallery section-padding bg-gray">
        <div className="container">
          <div className="section-header text-center">
            <span className="gold-text uppercase">Gallery</span>
            <h2>Glimpse of SM Golden</h2>
          </div>
          <div className="gallery-grid">
            {galleryItems.map((item, i) => (
              <div key={i} className="gallery-item">
                <img src={item.img} alt={item.title} />
                <div className="gallery-overlay">
                  <div className="gallery-caption">
                    <h4>{item.category}</h4>
                    <p>{item.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gold CTA Banner */}
      <section className="cta-banner">
        <div className="container text-center">
          <h2>Ready to Experience Luxury?</h2>
          <p>Book your retreat today or call us for group booking discounts!</p>
          <div className="cta-phones">
            <a href="tel:9443710420">9443710420</a>
            <span className="divider">|</span>
            <a href="tel:9003549849">9003549849</a>
          </div>
          <button className="btn-primary invert" onClick={() => navigate('/book')}>Book Now <ArrowRight size={18} /></button>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact section-padding">
        <div className="container grid contact-grid">
          <div className="contact-info">
            <span className="gold-text uppercase">Contact</span>
            <h2>Get in Touch</h2>
            <p>Our owner S. Murugan and team are here to help you with any queries or special requests.</p>
            <div className="contact-details">
              <div className="detail-item">
                <MapPin className="gold-text" />
                <div>
                  <h4>Location</h4>
                  <p>Old Falls Main Road, Old Falls, Courtallam, Tamil Nadu</p>
                </div>
              </div>
              <div className="detail-item">
                <Phone className="gold-text" />
                <div>
                  <h4>Phone</h4>
                  <p><a href="tel:9443710420">9443710420</a> / <a href="tel:9003549849">9003549849</a></p>
                </div>
              </div>
            </div>
          </div>
          <div className="contact-map">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15764.55280016024!2d77.2699!3d8.9317!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOMKwNTUnNTQuMSJOIDc3wrAxNicxMS42IkU!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0, borderRadius: '8px' }} 
              allowFullScreen="" 
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .hero {
          height: 100vh;
          background: linear-gradient(180deg, rgba(7,7,6,0.25) 0%, rgba(7,7,6,0.85) 100%), url('/assets/hero.jpg') center/cover no-repeat;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle, rgba(0,0,0,0) 40%, rgba(7,7,6,0.7) 100%);
          z-index: 1;
        }
        .hero-content {
          position: relative;
          z-index: 10;
          max-width: 900px;
        }
        .hero h1 {
          font-size: 5.5rem;
          font-weight: 300;
          letter-spacing: 4px;
          margin-bottom: 25px;
          text-shadow: 0 4px 20px rgba(0,0,0,0.6);
          line-height: 1.1;
        }
        .hero p {
          font-size: 1.3rem;
          font-weight: 400;
          margin-bottom: 45px;
          color: var(--text-muted);
          letter-spacing: 3px;
          text-transform: uppercase;
        }
        .hero-btns {
          display: flex;
          gap: 25px;
          justify-content: center;
        }
        
        /* Floating Glass Stats Bar */
        .stats-bar {
          background: rgba(21, 20, 17, 0.85);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          padding: 25px 40px;
          color: var(--text-primary);
          border: 1px solid var(--gold-border);
          border-radius: 100px;
          max-width: 1050px;
          margin: -60px auto 0;
          position: relative;
          z-index: 100;
          box-shadow: var(--shadow-premium), var(--shadow-gold-glow);
        }
        .stats-grid {
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }
        .stat-item {
          display: flex;
          align-items: center;
          gap: 15px;
          justify-content: center;
          border-right: 1px solid rgba(212, 175, 55, 0.15);
        }
        .stat-item:last-child {
          border-right: none;
        }
        .stat-icon {
          color: var(--gold);
          background: rgba(212, 175, 55, 0.08);
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          border: 1px solid rgba(212, 175, 55, 0.2);
          box-shadow: 0 0 10px rgba(212, 175, 55, 0.05);
        }
        .stat-item h4 {
          color: var(--text-primary);
          margin: 0;
          font-size: 1.15rem;
          font-weight: 600;
          font-family: var(--font-body);
        }
        .stat-item p {
          margin: 3px 0 0;
          font-size: 0.8rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .bg-gray { background-color: var(--bg-warm); }
        .section-header h2 { font-size: 2.8rem; margin: 10px 0 50px; }
        
        /* Layered Asymmetric About Section */
        .about-grid { grid-template-columns: 1fr 1fr; gap: 70px; align-items: center; }
        .about-img { position: relative; }
        .about-img img { 
          width: 100%; 
          border-radius: 12px; 
          box-shadow: var(--shadow-premium); 
          border: 1px solid var(--gold-border);
          position: relative;
          z-index: 5;
          display: block;
        }
        .img-accent {
          position: absolute;
          bottom: -20px;
          right: -20px;
          width: 100%;
          height: 100%;
          border: 2px solid var(--gold);
          border-radius: 12px;
          z-index: 1;
        }
        .about-text h2 { margin-bottom: 25px; line-height: 1.2; }
        .about-text p { color: var(--text-muted); font-size: 1.05rem; margin-bottom: 30px; }
        .about-features { display: grid; gap: 15px; }
        .feature-item { display: flex; align-items: center; gap: 12px; font-weight: 500; font-family: var(--font-body); }

        /* Luxury Glassmorphic Amenities */
        .amenities-grid { grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 30px; }
        .amenity-card {
          background: var(--bg-card);
          padding: 50px 35px;
          border-radius: 12px;
          text-align: center;
          border: 1px solid var(--gold-border);
          transition: var(--transition-smooth);
          box-shadow: var(--shadow-premium);
        }
        .amenity-card:hover {
          transform: translateY(-8px);
          border-color: var(--gold);
          box-shadow: var(--shadow-premium), var(--shadow-gold-glow);
          background: var(--bg-card-hover);
        }
        .amenity-icon { 
          font-size: 3rem; 
          margin-bottom: 25px;
          display: inline-block;
          filter: drop-shadow(0 0 15px rgba(212, 175, 55, 0.2));
        }
        .amenity-card h3 { margin-bottom: 12px; font-size: 1.35rem; color: var(--text-primary); font-weight: 500; }
        .amenity-card p { color: var(--text-muted); font-size: 0.95rem; }

        /* Luxury Room Cards */
        .rooms-grid { grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 40px; }
        .room-card {
          background: var(--bg-card);
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid var(--gold-border);
          box-shadow: var(--shadow-premium);
          transition: var(--transition-smooth);
        }
        .room-card:hover { 
          transform: translateY(-8px); 
          border-color: var(--gold);
          box-shadow: var(--shadow-premium), var(--shadow-gold-glow);
        }
        .room-img { position: relative; height: 280px; overflow: hidden; }
        .room-img img { width: 100%; height: 100%; object-fit: cover; transition: var(--transition-smooth); }
        .room-card:hover .room-img img { transform: scale(1.06); }
        .room-price {
          position: absolute;
          top: 25px;
          right: 25px;
          background: var(--gold-gradient);
          color: var(--bg-deep);
          padding: 8px 20px;
          border-radius: 30px;
          font-weight: 750;
          font-size: 0.95rem;
          font-family: var(--font-body);
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
        }
        .room-price span { font-size: 0.75rem; font-weight: 500; }
        .room-info { padding: 35px; }
        .room-info h3 { margin-bottom: 20px; font-size: 1.6rem; color: var(--text-primary); font-weight: 500; }
        .room-info ul { list-style: none; margin-bottom: 30px; }
        .room-info li { margin-bottom: 10px; color: var(--text-muted); display: flex; align-items: center; gap: 10px; font-size: 0.95rem; }
        .room-info li::before { content: "•"; color: var(--gold); font-size: 1.3rem; line-height: 1; }

        /* Premium Gallery with Hover Caption Overlay */
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .gallery-item { 
          height: 280px; 
          overflow: hidden; 
          border-radius: 12px; 
          border: 1px solid var(--gold-border);
          position: relative;
          box-shadow: var(--shadow-premium);
          cursor: pointer;
        }
        .gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: var(--transition-smooth); }
        
        .gallery-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(7,7,6,0.95) 0%, rgba(7,7,6,0.3) 60%, transparent 100%);
          display: flex;
          align-items: flex-end;
          padding: 25px;
          opacity: 0;
          transition: var(--transition-smooth);
          z-index: 2;
        }
        .gallery-item:hover .gallery-overlay {
          opacity: 1;
        }
        .gallery-item:hover img { 
          transform: scale(1.08); 
        }
        .gallery-caption {
          transform: translateY(15px);
          transition: var(--transition-smooth);
          width: 100%;
        }
        .gallery-item:hover .gallery-caption {
          transform: translateY(0);
        }
        .gallery-caption h4 {
          font-family: var(--font-body);
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--gold);
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 5px;
        }
        .gallery-caption p {
          font-family: var(--font-heading);
          font-size: 1.3rem;
          color: var(--text-primary);
        }

        /* Luxury CTA Banner */
        .cta-banner {
          background: linear-gradient(135deg, rgba(7,7,6,0.95) 0%, rgba(15,14,12,0.85) 100%), url('/assets/hero.jpg') center/cover no-repeat;
          border-top: 1px solid var(--gold-border);
          border-bottom: 1px solid var(--gold-border);
          padding: 100px 0;
          position: relative;
        }
        .cta-banner::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(212, 175, 55, 0.03);
          pointer-events: none;
        }
        .cta-banner h2 { font-size: 3.5rem; font-weight: 300; margin-bottom: 25px; }
        .cta-banner p { font-size: 1.15rem; margin-bottom: 35px; color: var(--text-muted); }
        .cta-phones { 
          font-size: 3.2rem; 
          font-weight: 300; 
          margin-bottom: 45px; 
          font-family: var(--font-heading); 
          color: var(--text-primary);
          letter-spacing: 1px;
        }
        .cta-phones a {
          background: var(--gold-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .cta-phones a:hover { 
          filter: brightness(1.2);
        }
        .cta-phones .divider { margin: 0 25px; color: var(--gold-border); -webkit-text-fill-color: initial; }

        /* Premium Contact Grid */
        .contact-grid { grid-template-columns: 1fr 1.2fr; gap: 70px; }
        .contact-info h2 { margin-bottom: 25px; }
        .contact-info p { color: var(--text-muted); font-size: 1.05rem; }
        .detail-item { 
          display: flex; 
          gap: 20px; 
          margin-top: 35px; 
          background: var(--bg-card);
          padding: 25px;
          border-radius: 12px;
          border: 1px solid var(--gold-border);
          transition: var(--transition-smooth);
        }
        .detail-item:hover {
          border-color: var(--gold-border-hover);
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        }
        .detail-item h4 { color: var(--text-primary); font-family: var(--font-body); font-weight: 600; margin-bottom: 5px; }
        .detail-item p { color: var(--text-muted); margin: 0; }
        
        .contact-map { 
          border-radius: 16px; 
          overflow: hidden; 
          border: 1px solid var(--gold-border); 
          box-shadow: var(--shadow-premium);
          height: 480px;
        }

        @media (max-width: 992px) {
          .hero h1 { font-size: 3.8rem; }
          .about-grid, .contact-grid { grid-template-columns: 1fr; gap: 40px; text-align: center; }
          .about-img { max-width: 550px; margin: 0 auto 30px; }
          .img-accent { display: none; }
          .gallery-grid { grid-template-columns: repeat(2, 1fr); }
          .cta-phones { font-size: 2rem; }
          .stats-bar { border-radius: 30px; margin-top: -30px; padding: 25px; }
          .stat-item { border-right: none; border-bottom: 1px solid rgba(212, 175, 55, 0.15); padding-bottom: 15px; }
          .stat-item:last-child { border-bottom: none; padding-bottom: 0; }
          .contact-map { height: 350px; }
        }
        @media (max-width: 600px) {
          .gallery-grid { grid-template-columns: 1fr; }
        }
      `}} />
    </div>
  );
};

export default Home;
