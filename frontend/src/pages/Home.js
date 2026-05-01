import React from 'react';
import { Link } from 'react-router-dom';
import buildingImg from '../assets/building.png';
import roomImg from '../assets/room.jpg';
import roomAcImg from '../assets/room-ac-2.jpg';
import logo from '../assets/logo.png';
import roomGal1 from '../assets/room-ac-1.jpg';
import roomGal2 from '../assets/room-gallery-2.jpg';
import roomGal3 from '../assets/room-gallery-3.jpg';
import roomGal4 from '../assets/room-gallery-4.jpg';
import mainFalls from '../assets/main-falls-user.jpg';
import fiveFalls from '../assets/five falls.png';
import oldFalls from '../assets/old falls.png';
import chitraruvi from '../assets/Chitraruvi.png';
import tigerFalls from '../assets/tiger falls.jpg';
import palaruviFalls from '../assets/aruvi.png';
import fruitGardenFalls from '../assets/Fruit Garden Falls.png';
import honeyFalls from '../assets/Honey Falls.png';
import shenbagadeviFalls from '../assets/Shenbagadevi Falls.png';
import roomFamily from '../assets/room-family.jpg';
import roomAc3 from '../assets/room-ac-3.jpg';
import gundarDam from '../assets/gundar dam.jpg';
import adaviNainarDam from '../assets/Adavi Nainar Dam.png';
import gadananathiDam from '../assets/Gadananathi Dam.png';
import karuppanadhiDam from '../assets/Karuppanadhi Dam.png';
import ramanadhiDam from '../assets/Ramanadhi Dam.png';
import kasiTemple from '../assets/kasi.png';
import tirumalaiKovil from '../assets/Tirumalai Kovil.jpg';
import kutralanatharTemple from '../assets/Kutralanathar Temple.png';
import ariyankavuTemple from '../assets/Ariyankavu Iyappan Kovil.png';
import { AMENITIES, ROOMS, CONTACT, waLink, WA_TEMPLATES } from '../constants';
import api from '../api/axios';
import './Home.css';

const imgMap = {
  'double-bed': roomAcImg,       // Was 2nd, now 1st
  'double-bed-ac': roomAc3,      // Was 4th, now 2nd
  'four-bed': roomGal1,          // Stays 3rd
  'four-bed-ac': roomFamily,     // Was 1st, now 4th
};

const PEARLS_ITEMS = [
  { letter: 'P', title: 'Peaceful stay', desc: 'A calm and serene environment for your relaxation.' },
  { letter: 'E', title: 'Excellent service', desc: 'Top-notch facilities and dedicated staff at your service.' },
  { letter: 'A', title: 'Affordable cost', desc: 'Premium luxury that fits perfectly within your budget.' },
  { letter: 'R', title: 'Reliability', desc: 'A name you can trust for consistency and quality.' },
  { letter: 'L', title: 'Lucky', desc: 'May your stay bring you joy and good fortune.' },
  { letter: 'S', title: 'Safety', desc: '24/7 security and a safe environment for your family.' },
];

const ATTRACTIONS = {
  falls: [
    { name: 'Main Falls', desc: 'The iconic 60ft waterfall, just 100m from BSS Residency.', distance: '100m', img: mainFalls },
    { name: 'Five Falls', desc: 'Divided naturally into five streams, a must-visit wonder.', distance: '4km', img: fiveFalls },
    { name: 'Old Falls', desc: 'A calm and peaceful bathing spot away from the crowd.', distance: '6km', img: oldFalls },
    { name: 'Chitraruvi', desc: 'A beautiful small cascade located very close to the Main Falls.', distance: '200m', img: chitraruvi },
    { name: 'Tiger Falls', desc: 'A moderate waterfall perfect for children and family bathing.', distance: '1.5km', img: tigerFalls },
    { name: 'Palaruvi Falls', desc: 'A stunning "Milk Falls" located near the Kerala border.', distance: '28km', img: palaruviFalls },
    { name: 'Fruit Garden Falls', desc: 'A beautiful cascade surrounded by fruit orchards and lush greenery.', distance: '2km', img: fruitGardenFalls },
    { name: 'Honey Falls', desc: 'A picturesque waterfall hidden in dense forests, ideal for trekking.', distance: '4km', img: honeyFalls },
    { name: 'Shenbagadevi Falls', desc: 'A serene waterfall named after the nearby Shenbagadevi Amman temple.', distance: '3km', img: shenbagadeviFalls }
  ],
  dams: [
    { name: 'Gundar Dam', desc: 'Breathtaking views of the mountains and a calm reservoir.', distance: '6km', img: gundarDam },
    { name: 'Adavi Nainar Dam', desc: 'A large dam located at the foothills of the Western Ghats.', distance: '15km', img: adaviNainarDam },
    { name: 'Gadananathi Dam', desc: 'Surrounded by lush green hills, a perfect peaceful getaway.', distance: '25km', img: gadananathiDam },
    { name: 'Karuppanadhi Dam', desc: 'A serene and beautiful dam nestled in nature.', distance: '25km', img: karuppanadhiDam },
    { name: 'Ramanadhi Dam', desc: 'Scenic reservoir offering stunning views of the Western Ghats.', distance: '20km', img: ramanadhiDam }
  ],
  temples: [
    { name: 'Kutralanathar Temple', desc: 'Ancient Shiva temple within walking distance from Main Falls.', distance: '200m', img: kutralanatharTemple },
    { name: 'Kasi Viswanathar Temple', desc: 'Famous Tenkasi temple known as the "South Kasi".', distance: '6km', img: kasiTemple },
    { name: 'Tirumalai Kovil', desc: 'Hilltop Murugan temple offering breathtaking panoramic views.', distance: '15km', img: tirumalaiKovil },
    { name: 'Ariyankavu Iyappan Kovil', desc: 'Historical temple located on the Tamil Nadu - Kerala border.', distance: '30km', img: ariyankavuTemple }
  ]
};

function ImageCarousel({ images, alt }) {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="carousel-container">
      {images.map((img, i) => (
        <img
          key={i}
          src={img}
          alt={`${alt} ${i + 1}`}
          className={`carousel-img ${i === index ? 'active' : ''}`}
        />
      ))}
      <div className="carousel-dots">
        {images.map((_, i) => (
          <span
            key={i}
            className={`dot ${i === index ? 'active' : ''}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [reviews, setReviews] = React.useState([]);
  const [selectedReview, setSelectedReview] = React.useState(null);
  const [isSeason, setIsSeason] = React.useState(false);
  const [showNotice, setShowNotice] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('falls');
  const attractionsRef = React.useRef(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  const checkScroll = () => {
    if (attractionsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = attractionsRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  React.useEffect(() => {
    checkScroll();
  }, [activeTab]);

  const reviewsRef = React.useRef(null);
  const [canScrollRevLeft, setCanScrollRevLeft] = React.useState(false);
  const [canScrollRevRight, setCanScrollRevRight] = React.useState(true);

  const checkRevScroll = () => {
    if (reviewsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = reviewsRef.current;
      setCanScrollRevLeft(scrollLeft > 0);
      setCanScrollRevRight(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  React.useEffect(() => {
    const timer = setTimeout(() => checkRevScroll(), 100);
    return () => clearTimeout(timer);
  }, [reviews]);

  React.useEffect(() => {
    // Show notice only once per session
    const hasSeenNotice = sessionStorage.getItem('bss_notice_seen');
    if (!hasSeenNotice) {
      setTimeout(() => {
        setShowNotice(true);
      }, 1500);
    }
  }, []);

  const closeNotice = () => {
    setShowNotice(false);
    sessionStorage.setItem('bss_notice_seen', 'true');
  };

  React.useEffect(() => {
    const fetchPublicSettings = async () => {
      try {
        const res = await api.get('/api/admin/settings/public');
        if (res.data.success) setIsSeason(res.data.isSeason);
      } catch (err) {
        console.error('Error fetching season status:', err);
      }
    };
    fetchPublicSettings();
  }, []);

  const getPrice = (room) => isSeason ? room.seasonPrice : room.nonSeasonPrice;

  React.useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get('/api/bookings/public/reviews');
        setReviews(res.data.reviews);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      }
    };
    fetchReviews();
  }, []);

  return (
    <>
      <main className="home">
        {/* Hero */}
        <section className="hero">
          <div className="hero-img-wrap">
            <img src={buildingImg} alt="BSS Residency Building" className="hero-bg-img" />
            <div className="hero-overlay" />
          </div>
          <div className="hero-content fade-up">
            <span className="hero-logo-wrap">
              <img src={logo} alt="BSS Residency" />
            </span>
            <span className="hero-badge">✦ Courtallam's Premium Stay ✦</span>
            <h1>
              Welcome to<br />
              <span className="hero-brand">BSS Residency</span>
            </h1>
            <p>Experience premium comfort steps away from the majestic Courtallam Falls</p>
            <div className="hero-btns">
              <Link to="/booking" className="btn-gold">Book Your Stay</Link>
              <Link to="/rooms" className="btn-outline-light">Explore Rooms</Link>
            </div>
          </div>
          <div className="hero-scroll">
            <div className="scroll-dot" />
            <span>Scroll to explore</span>
          </div>
        </section>

        {/* Amenities strip */}
        <section className="amenities-strip">
          {AMENITIES.map((a) => (
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
            <div className="divider-gold" />
            <p>BSS Residency is located just 100 metres from the legendary Courtallam Falls — moments from the bus stand and Anna Statue. We offer modern rooms with premium amenities, ideal for families, pilgrims, and leisure travellers.</p>
            <p>From comfortable non-A/C doubles to spacious four-bed A/C rooms, we have the perfect accommodation for every guest and every budget.</p>
            <div className="about-stats">
              <div className="stat"><span className="stat-n">4</span><span className="stat-l">Room Types</span></div>
              <div className="stat"><span className="stat-n">4.6★</span><span className="stat-l">Rating</span></div>
              <div className="stat"><span className="stat-n">100m</span><span className="stat-l">to Falls</span></div>
            </div>
            <Link to="/booking" className="btn-primary"><span>Reserve Now</span></Link>
          </div>
        </section>

        {/* Attractions Section */}
        <section className="attractions-section">
          <div className="container">
            <div className="attractions-header">
              <p className="section-label">Nearest Attractions</p>
              <h2>The Magic of <em>Courtallam & Beyond</em></h2>
              <p className="attractions-sub">Discover the finest waterfalls, historic temples, and scenic dams near your stay.</p>
            </div>

            <div className="attractions-tabs">
              <button 
                className={`tab-btn ${activeTab === 'falls' ? 'active' : ''}`}
                onClick={() => setActiveTab('falls')}
              >
                🌊 Waterfalls
              </button>
              <button 
                className={`tab-btn ${activeTab === 'dams' ? 'active' : ''}`}
                onClick={() => setActiveTab('dams')}
              >
                🏞️ Dams
              </button>
              <button 
                className={`tab-btn ${activeTab === 'temples' ? 'active' : ''}`}
                onClick={() => setActiveTab('temples')}
              >
                🙏 Temples
              </button>
            </div>

            <div className="carousel-container">
              <button 
                className="carousel-nav prev" 
                onClick={() => attractionsRef.current?.scrollBy({ left: -380, behavior: 'smooth' })}
                disabled={!canScrollLeft}
              >
                ‹
              </button>

              <div className="attractions-grid" ref={attractionsRef} onScroll={checkScroll}>
                {ATTRACTIONS[activeTab].map((att) => (
                  <div key={att.name} className="attraction-card fade-up">
                    <div className="att-img-wrap">
                      <img src={att.img} alt={att.name} loading="lazy" />
                      <div className="att-distance">📍 {att.distance}</div>
                    </div>
                    <div className="att-info">
                      <h3>{att.name}</h3>
                      <p>{att.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                className="carousel-nav next" 
                onClick={() => attractionsRef.current?.scrollBy({ left: 380, behavior: 'smooth' })}
                disabled={!canScrollRight}
              >
                ›
              </button>
            </div>
          </div>
        </section>

        {/* PEARLS Brand Section */}
        <section className="pearls-section">
          <div className="container">
            <div className="pearls-header fade-up">
              <p className="section-label-light">Why Choose Us</p>
              <h2>The <em>PEARLS</em> of BSS Residency</h2>
              <p className="pearls-intro">"Comfort and Quality is our promise to every guest."</p>
            </div>

            <div className="pearls-grid">
              {PEARLS_ITEMS.map((item, idx) => (
                <div key={item.letter} className="pearl-card" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="pearl-letter">{item.letter}</div>
                  <div className="pearl-content">
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pearls-footer fade-up">
              <h3>BSS RESIDENCY — <em>Premium Guesthouse</em></h3>
            </div>
          </div>
        </section>

        {/* Tariff / room preview */}
        <section className="rooms-preview">
          <div className="container">
            <p className="section-label" style={{ textAlign: 'center' }}>Tariff</p>
            <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Our <em>Rooms & Prices</em></h2>
            <p className="rooms-preview-sub">
              Best rates guaranteed when you book directly with us
            </p>
            <div className="rooms-grid">
              {ROOMS.map((r) => (
                <div key={r.key} className="room-card-home">
                  <div className="r-img-wrapper">
                    <img src={imgMap[r.key]} alt={r.name} className="r-card-img" />
                  </div>
                  <h3>{r.name}</h3>
                  <span className="r-type-pill">{r.type}</span>
                  <div className="r-price">
                    <span className="r-price-currency">₹</span>
                    <span className="r-price-amount">{getPrice(r).toLocaleString('en-IN')}</span>
                    <span className="r-price-unit">/ night</span>
                  </div>
                  <div className="r-actions-home">
                    <Link to="/booking" className="r-book-btn"><span>Book Now</span></Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="tariff-foot">
              <Link to="/rooms" className="btn-primary"><span>View All Rooms</span></Link>
            </div>
          </div>
        </section>

        {/* Room photo section */}
        <section className="room-showcase container">
          <div className="showcase-text">
            <p className="section-label">Room Interior</p>
            <h2>Comfort in Every<br /><em>Detail</em></h2>
            <div className="divider-gold" />
            <p>Our A/C rooms feature premium mattresses, clean marble tiles, branded pillows, and modern A/C units — all maintained to the highest standard of cleanliness and comfort.</p>
            <ul className="showcase-features">
              <li><span className="tick">✓</span> DC Inverter A/C</li>
              <li><span className="tick">✓</span> Premium mattress</li>
              <li><span className="tick">✓</span> Marble tile flooring</li>
              <li><span className="tick">✓</span> Attached bathroom</li>
              <li><span className="tick">✓</span> 24hr hot water</li>
              <li><span className="tick">✓</span> Daily housekeeping</li>
            </ul>
            <Link to="/booking" className="btn-primary" style={{ marginTop: '1.5rem', display: 'inline-block' }}><span>Book This Room</span></Link>
          </div>
          <div className="showcase-img">
            <ImageCarousel images={[roomGal1, roomGal2, roomGal3, roomGal4]} alt="BSS Residency A/C Room" />
          </div>
        </section>

        {/* Reviews / Testimonials */}
        {reviews.length > 0 && (
          <section className="testimonials">
            <p className="section-label" style={{ textAlign: 'center' }}>Guest Experiences</p>
            <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>What Our <em>Guests Say</em></h2>

            <div className="carousel-container">
              <button 
                className="carousel-nav prev" 
                onClick={() => reviewsRef.current?.scrollBy({ left: -380, behavior: 'smooth' })}
                disabled={!canScrollRevLeft}
              >
                ‹
              </button>

              <div className="reviews-carousel" ref={reviewsRef} onScroll={checkRevScroll}>
                {reviews.map((r, idx) => {
                  const initial = r.guestName ? r.guestName.charAt(0).toUpperCase() : '?';
                  const colors = ['#1a73e8', '#d93025', '#188038', '#f29900', '#a142f4', '#00acc1'];
                  const bgColor = colors[initial.charCodeAt(0) % colors.length];

                  const formattedDate = new Date(r.date).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  });

                  return (
                    <div
                      key={r._id}
                      className="google-review-card"
                      onClick={() => setSelectedReview(r)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="gr-header">
                        <div className="gr-avatar" style={{ backgroundColor: bgColor }}>{initial}</div>
                        <div className="gr-name-wrap">
                          <span className="gr-name">{r.guestName}</span>
                          <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="G" className="gr-google-logo" />
                        </div>
                      </div>

                      <div className="gr-content">
                        <p className="gr-text">
                          {r.comment && r.comment.length > 150
                            ? `${r.comment.substring(0, 150)}...`
                            : r.comment}
                        </p>
                        {r.comment && r.comment.length > 150 && (
                          <button
                            className="gr-read-more"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedReview(r);
                            }}
                          >
                            Read More
                          </button>
                        )}
                      </div>

                      <div className="gr-footer">
                        <div className="gr-stars">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < r.rating ? 'gr-star filled' : 'gr-star'}>★</span>
                          ))}
                        </div>
                        <div className="gr-time">{formattedDate} on Google</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button 
                className="carousel-nav next" 
                onClick={() => reviewsRef.current?.scrollBy({ left: 380, behavior: 'smooth' })}
                disabled={!canScrollRevRight}
              >
                ›
              </button>
            </div>

          </section>
        )}


        {/* CTA Banner */}
        <section className="cta-banner">
          <div className="cta-inner container">
            <h2>Ready to Experience Courtallam?</h2>
            <p>Book directly with us for the best rates. Instant confirmation via WhatsApp.</p>
            <div className="cta-btns">
              <Link to="/booking" className="btn-gold">Book Now</Link>
              <a href={`tel:${CONTACT.phonePrimary.replace(/\s/g, '')}`} className="btn-outline-light">
                📞 {CONTACT.phonePrimary}
              </a>
            </div>
          </div>
        </section>

      </main>

      {/* Review Modal Popup - Moved outside main to avoid transform issues */}
      {selectedReview && (
        <div className="review-modal-overlay" onClick={() => setSelectedReview(null)}>
          <div className="review-modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedReview(null)}>×</button>
            <div className="modal-header">
              <div className="modal-user-side">
                <div className="modal-avatar" style={{
                  backgroundColor: ['#1a73e8', '#d93025', '#188038', '#f29900'][(selectedReview.guestName || 'G').charCodeAt(0) % 4]
                }}>
                  {(selectedReview.guestName || 'G').charAt(0).toUpperCase()}
                </div>
                <h3>{selectedReview.guestName || 'Guest'}</h3>
              </div>
              <div className="modal-google-side">
                <div className="modal-google-icon-wrap">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="G" />
                  <span className="modal-google-text">Google</span>
                </div>
              </div>
            </div>
            <div className="modal-meta-row">
              <div className="modal-stars">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < (selectedReview.rating || 5) ? 'filled' : ''}>★</span>
                ))}
              </div>
              <div className="modal-date-text">
                {selectedReview.date ? new Date(selectedReview.date).toLocaleDateString('en-GB') : 'Recently'} on Google
              </div>
            </div>
            <div className="modal-body">
              <p>{selectedReview.comment || 'No comment provided.'}</p>
            </div>
          </div>
        </div>
      )}
      {/* Important Notice Modal */}
      {showNotice && (
        <div className="notice-overlay">
          <div className="notice-modal fade-up">
            <button className="notice-close" onClick={closeNotice}>&times;</button>
            <div className="notice-header">
              <h2 className="notice-title">BSS Residency Special</h2>
            </div>
            <div className="notice-body">
              <h3 className="notice-sub">Enjoy the Best of Courtallam! 🌊</h3>
              <p className="notice-main">Premium facilities at the most affordable prices. Visit <strong>BSS Residency</strong> to make your stay truly memorable and happy!</p>
              
              <div className="notice-footer-small">
                <p>For bookings & queries: <strong>+91 88385 99755</strong></p>
              </div>
            </div>
            <div className="notice-actions">
              <button className="notice-btn" onClick={closeNotice}>WELCOME BSS RESIDENCY</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
