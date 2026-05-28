import React from 'react';
import { Link } from 'react-router-dom';
import buildingImg from '../assets/building.webp';
import roomImg from '../assets/room.webp';
import roomAcImg from '../assets/room-ac-2.webp';
import logo from '../assets/logo.webp';
import roomGal1 from '../assets/room-ac-1.webp';
import roomGal2 from '../assets/room-gallery-2.webp';
import roomGal3 from '../assets/room-gallery-3.webp';
import roomGal4 from '../assets/room-gallery-4.webp';

import roomGal5 from '../assets/room-gallery-5.jpg';
import roomGal6 from '../assets/room-gallery-6.jpg';
import roomGal7 from '../assets/room-gallery-7.jpg';
import roomGal8 from '../assets/room-gallery-8.jpg';
import mainFalls from '../assets/main-falls-user.webp';
import fiveFalls from '../assets/five falls.webp';
import oldFalls from '../assets/old falls.webp';
import chitraruvi from '../assets/Chitraruvi.webp';
import tigerFalls from '../assets/tiger falls.webp';
import palaruviFalls from '../assets/aruvi.webp';
import fruitGardenFalls from '../assets/Fruit Garden Falls.webp';
import honeyFalls from '../assets/Honey Falls.webp';
import shenbagadeviFalls from '../assets/Shenbagadevi Falls.webp';
import roomFamily from '../assets/room-family.webp';
import roomAc3 from '../assets/room-ac-3.webp';
import roomThreeBed from '../assets/3bed.webp';
import gundarDam from '../assets/gundar dam.webp';
import adaviNainarDam from '../assets/Adavi Nainar Dam.webp';
import gadananathiDam from '../assets/Gadananathi Dam.webp';
import karuppanadhiDam from '../assets/Karuppanadhi Dam.webp';
import ramanadhiDam from '../assets/Ramanadhi Dam.webp';
import kasiTemple from '../assets/kasi.webp';
import tirumalaiKovil from '../assets/Tirumalai Kovil.webp';
import kutralanatharTemple from '../assets/Kutralanathar Temple.webp';
import ariyankavuTemple from '../assets/Ariyankavu Iyappan Kovil.webp';
import { AMENITIES, ROOMS, CONTACT, waLink, WA_TEMPLATES } from '../constants';
import api from '../api/axios';
import SEO from '../components/SEO';
import './Home.css';
import roomVideo from '../assets/room-video.mp4';

const imgMap = {
  'double-bed': roomAcImg,
  'double-bed-ac': roomAc3,
  'three-bed': roomThreeBed,

  'three-bed-ac': roomAc3,
  'four-bed-ac': roomFamily,
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
          loading={i === 0 ? 'eager' : 'lazy'}
          width="800"
          height="600"
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

  

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "name": "BSS Residency",
    "url": "https://bssresidency.com",
    "image": "https://bssresidency.com/logo.webp",
    "description": "BSS Residency is the best hotel near Courtallam waterfalls. We offer A/C and Non-A/C rooms for families near Main Falls, Courtallam Bus Stand.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Near Anna Statue, Old Bus Stand",
      "addressLocality": "Courtallam",
      "addressRegion": "Tamil Nadu",
      "postalCode": "627802",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "8.9333",
      "longitude": "77.2833"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.6",
      "reviewCount": "150"
    },
    "review": [
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Ramesh K" },
        "datePublished": "2024-09-12",
        "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
        "reviewBody": "Excellent stay! Clean rooms, friendly staff, and perfect location near the falls."
      },
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Anjali S" },
        "datePublished": "2025-02-18",
        "reviewRating": { "@type": "Rating", "ratingValue": "4", "bestRating": "5" },
        "reviewBody": "Great value for money, friendly staff, and comfortable accommodation."
      }
    ],
    "amenityFeature": [
      { "@type": "LocationFeatureSpecification", "name": "Air Conditioning", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "24-hour Front Desk", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Free Parking", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Hot Water", "value": true }
    ],
    "checkinTime": "12:00",
    "checkoutTime": "11:00",
    "starRating": { "@type": "Rating", "ratingValue": "4.6" }
  };

  return (
    <>
      <SEO 
        title="BSS Residency Courtallam | Best Hotel Near Waterfalls | Book Now"
        description="BSS Residency is the best hotel near Courtallam waterfalls. Book A/C & Non-A/C rooms for families at affordable prices. Courtallam lodging near Main Falls, Old Bus Stand."
        keywords="bss residency courtallam, courtallam hotel, hotel near courtallam waterfalls, courtallam rooms for rent, kutralam lodging, family hotel courtallam, best lodge courtallam, courtallam accommodation, lodge near main falls courtallam, kutralam hotel booking"
        schemaMarkup={schemaMarkup}
      />
      <main id="main" className="home">
        {/* Hero */}
        <section className="hero">
          <div className="hero-img-wrap">
            <img src={buildingImg} alt="BSS Residency Building" className="hero-bg-img" width="1200" height="800" />
            <div className="hero-overlay" />
          </div>
          <div className="hero-content fade-up">
            <span className="hero-logo-wrap">
              <img src={logo} alt="BSS Residency" width="150" height="150" />
            </span>
            <span className="hero-badge">✦ Courtallam's Premium Stay ✦</span>
            <h1>
              Welcome to<br />
              <span className="hero-brand">BSS Residency</span>
            </h1>
            <p>Experience premium comfort steps away from the majestic Courtallam Falls</p>
            <div className="hero-btns">
              <Link to="/booking" className="btn-book-now-hero">
                📞 Book Now - Best Price!
              </Link>
              <Link to="/rooms" className="btn-outline-light">Explore Rooms</Link>
            </div>
          </div>
          <style>{`
            .hero-scroll {
              position: absolute;
              bottom: 2rem;
              left: 50%;
              transform: translateX(-50%);
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 0.4rem;
              color: rgba(255, 255, 255, 0.55);
              font-size: 0.7rem;
              letter-spacing: 0.15em;
              text-transform: uppercase;
              animation: fadeIn 1s ease 1.5s both;
            }


          `}</style>
          <div className="hero-scroll">
            <div className="scroll-dot" />
            <span>Scroll to explore</span>
          </div>
        </section>



        {/* Amenities strip — infinite CSS marquee */}
        <section className="amenities-strip">
          <div className="amenities-track">
            {[...AMENITIES, ...AMENITIES].map((a, i) => (
              <div key={i} className="amenity">
                <span className="a-icon">{a.icon}</span>
                <span className="a-label">{a.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* About section */}
        <section className="home-about container">
          <div className="about-img-wrap fade-left">
            <img src={buildingImg} alt="BSS Residency" width="800" height="600" loading="lazy" />
            <div className="about-badge-box">
              <span className="badge-icon">🏨</span>
              <span className="badge-txt">Premium Lodge</span>
            </div>
          </div>
          <div className="about-text fade-right">
            <p className="section-label">About Us</p>
            <h2>A Sanctuary in the<br /><em>Heart of Courtallam</em></h2>
            <div className="divider-gold" />
            <p>BSS Residency is the best <strong>hotel near Courtallam waterfalls</strong>, located just 100 metres from the legendary Main Falls — moments from the bus stand and Anna Statue. We offer modern <strong>Courtallam rooms for rent</strong> with premium amenities, ideal for families, pilgrims, and leisure travellers.</p>
            <p>From comfortable non-A/C doubles to spacious four-bed A/C rooms, our <strong>family hotel in Courtallam</strong> has the perfect accommodation for every guest and every budget. Looking for <strong>Kutralam lodging</strong>? BSS Residency is your best choice.</p>
            <div className="about-stats">
              <div className="stat fade-up"><span className="stat-n">5</span><span className="stat-l">Room Types</span></div>
              <div className="stat fade-up" style={{ animationDelay: '0.2s' }}><span className="stat-n">4.6★</span><span className="stat-l">Rating</span></div>
              <div className="stat fade-up" style={{ animationDelay: '0.4s' }}><span className="stat-n">100m</span><span className="stat-l">to Main Falls</span></div>
              <div className="stat fade-up" style={{ animationDelay: '0.6s' }}><span className="stat-n">24/7</span><span className="stat-l">Service</span></div>
            </div>
            <Link to="/booking" className="btn-primary fade-up" style={{ animationDelay: '0.6s' }}><span>Reserve Now</span></Link>
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
                aria-label="Previous attractions"
                onClick={() => attractionsRef.current?.scrollBy({ left: -380, behavior: 'smooth' })}
                disabled={!canScrollLeft}
              >
                ‹
              </button>

              <div className="attractions-grid" ref={attractionsRef} onScroll={checkScroll}>
                {ATTRACTIONS[activeTab].map((att) => (
                  <div key={att.name} className="attraction-card fade-up">
                    <div className="att-img-wrap">
                      <img src={att.img} alt={att.name} loading="lazy" width="400" height="260" />
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
                aria-label="Next attractions"
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
            <p className="section-label fade-up" style={{ textAlign: 'center' }}>Tariff</p>
            <h2 className="fade-up" style={{ textAlign: 'center', marginBottom: '0.5rem', animationDelay: '0.1s' }}>Our <em>Rooms & Prices</em></h2>
            <p className="rooms-preview-sub fade-up" style={{ animationDelay: '0.2s' }}>
              Best rates guaranteed when you book directly with us
            </p>
            <div className="rooms-carousel-container">
              <div className="rooms-grid">
                {ROOMS.map((r) => (
                  <div key={r.key} className="room-card-home">
                    <div className="r-img-wrapper">
                      <img src={imgMap[r.key]} alt={r.name} className="r-card-img" loading="lazy" width="400" height="260" />
                    </div>
                    <h3>{r.name}</h3>
                    <span className="r-type-pill">{r.type}</span>
                    <div className="r-price">
                      <span className="r-price-currency">₹</span>
                      <span className="r-price-amount">{getPrice(r).toLocaleString('en-IN')}</span>
                      <span className="r-price-unit">/ night</span>
                    </div>
                    <div className="r-actions-home">
                      <Link to={`/booking?room=${r.key}`} className="r-book-btn"><span>Book Now</span></Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="tariff-foot fade-up">
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
            <ImageCarousel images={[roomGal1, roomGal2, roomGal3, roomGal4, roomGal5, roomGal6, roomGal7, roomGal8]} alt="BSS Residency A/C Room" />
          </div>
        </section>

        {/* Reviews / Testimonials */}
        <section className="testimonials">
          <p className="section-label" style={{ textAlign: 'center' }}>Guest Experiences</p>
          <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>What Our <em>Guests Say</em></h2>

          <div className="elfsight-app-08e831ad-a3ef-41b1-8975-543cc3147c48" data-elfsight-app-lazy></div>
        </section>

        {/* CTA Banner */}
        <section className="cta-banner">
          <div className="cta-inner container">
            <h2>Ready to Experience Courtallam?</h2>
            <p>Book directly with us for the best rates. Instant confirmation via WhatsApp.</p>
            <div className="cta-btns">
              <Link to="/booking" className="btn-book-now-hero">
                📞 Book Now - Best Price!
              </Link>
              <a href={`tel:${CONTACT.phonePrimary.replace(/\s/g, '')}`} className="btn-outline-light">
                📞 {CONTACT.phonePrimary}
              </a>
            </div>
          </div>
        </section>

      </main>

      {/* Review Modal removed */}
      {/* Important Notice Modal */}
      {showNotice && (
        <div className="notice-overlay">
          <div className="notice-modal fade-up">
            <button className="notice-close" aria-label="Close notice" onClick={closeNotice}>&times;</button>
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
