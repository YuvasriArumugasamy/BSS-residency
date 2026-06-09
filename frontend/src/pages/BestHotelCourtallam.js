import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { CONTACT, ROOMS, AMENITIES, waLink } from '../constants';
import buildingImg from '../assets/building.webp';
import mainFallsImg from '../assets/main-falls.webp';
import fiveFallsImg from '../assets/five falls.webp';
import oldFallsImg from '../assets/old falls.webp';
import shenbagadeviImg from '../assets/Shenbagadevi Falls.webp';
import honeyFallsImg from '../assets/Honey Falls.webp';
import tigerFallsImg from '../assets/tiger falls.webp';
import roomAc1 from '../assets/room-ac-1.webp';
import './BestHotelCourtallam.css';

// FAQ data
const FAQS = [
  {
    q: 'What is the best hotel near Courtallam waterfalls?',
    a: 'BSS Residency is widely regarded as the best hotel near Courtallam waterfalls. Located just 100 metres from the Main Falls, it offers premium AC and Non-AC rooms with modern amenities, excellent cleanliness, and affordable pricing starting from ₹1,000 per night.'
  },
  {
    q: 'How far is BSS Residency from Courtallam Main Falls?',
    a: 'BSS Residency is located just 100 metres (approximately a 2-minute walk) from the Courtallam Main Falls (Peraruvi). This makes it the closest premium accommodation to the main waterfall area.'
  },
  {
    q: 'What are the room rates at BSS Residency?',
    a: 'Room rates start from ₹1,000/night for Non-AC Double Bed rooms during off-season. AC Double Bed rooms start at ₹1,300/night. Three Bed rooms start at ₹1,500/night and premium Four Bed AC rooms start at ₹2,500/night. Season rates may vary slightly.'
  },
  {
    q: 'What is the best time to visit Courtallam?',
    a: 'The best time to visit Courtallam is during the monsoon season from June to September when the waterfalls are at their most spectacular. However, BSS Residency is open year-round and offers comfortable stays in every season.'
  },
  {
    q: 'Does BSS Residency offer online booking?',
    a: 'Yes! BSS Residency offers convenient online booking through their website with instant WhatsApp confirmation. You can also call directly at +91 88385 99755 to reserve your room.'
  },
  {
    q: 'What amenities does BSS Residency provide?',
    a: 'BSS Residency provides DC Inverter AC, 24-hour hot water, LED TV, free Wi-Fi, CCTV security, daily housekeeping, attached bathrooms with premium fittings, and extra bed availability. The hotel also offers quick laundry services and waterproof bag storage for waterfall visitors.'
  },
  {
    q: 'Is BSS Residency suitable for families?',
    a: 'Absolutely! BSS Residency is very family-friendly with spacious Three Bed and Four Bed room options. The hotel\'s proximity to the waterfalls makes it convenient for families with elderly members or children.'
  },
  {
    q: 'How do I reach BSS Residency from Tenkasi?',
    a: 'BSS Residency is located about 5 km from Tenkasi town center, near the Anna Statue at Courtallam Bus Stand. You can reach by local bus, auto-rickshaw, or taxi from Tenkasi Railway Station. The hotel staff can also arrange pickup if requested in advance.'
  }
];

// Structured data for SEO
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Best Hotel Near Courtallam Waterfalls – BSS Residency",
  "description": "Discover why BSS Residency is the best hotel near Courtallam waterfalls. Premium AC & Non-AC rooms, just 100m from Main Falls. Complete guide with room types, pricing, and travel tips.",
  "image": "https://www.bssresidency.com/building.webp",
  "author": {
    "@type": "Organization",
    "name": "BSS Residency"
  },
  "publisher": {
    "@type": "Organization",
    "name": "BSS Residency",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.bssresidency.com/logo.webp"
    }
  },
  "datePublished": "2025-01-15",
  "dateModified": "2025-06-08",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://www.bssresidency.com/best-hotel-courtallam-waterfalls"
  }
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": FAQS.map(f => ({
    "@type": "Question",
    "name": f.q,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": f.a
    }
  }))
};

// Fade-in observer hook
function useFadeIn() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function FadeSection({ children, className = '' }) {
  const ref = useFadeIn();
  return (
    <div ref={ref} className={`fade-in-section ${className}`}>
      {children}
    </div>
  );
}

// FAQ Item component
function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="blog-faq-item" id={`faq-${question.slice(0, 20).replace(/\s/g, '-').toLowerCase()}`}>
      <button className="blog-faq-question" onClick={() => setOpen(!open)} aria-expanded={open}>
        {question}
        <span className={`faq-toggle ${open ? 'open' : ''}`}>+</span>
      </button>
      {open && <div className="blog-faq-answer">{answer}</div>}
    </div>
  );
}

const BestHotelCourtallam = () => {
  // Scroll to section handler
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <SEO
        title="Best Hotel Near Courtallam Waterfalls – BSS Residency | Premium Rooms"
        description="Discover BSS Residency – the best hotel near Courtallam waterfalls. Premium AC & Non-AC rooms just 100m from Main Falls. Book online with instant confirmation. Starting ₹1,000/night."
        keywords="best hotel near courtallam waterfalls, courtallam best hotel, bss residency courtallam, hotel near courtallam main falls, courtallam accommodation, courtallam lodge near waterfalls, best stay courtallam, courtallam rooms booking, kutralam best hotel, courtallam waterfalls hotel, tenkasi hotel near falls, courtallam premium lodge, family hotel courtallam waterfalls, cheap hotel courtallam, courtallam resort near falls"
        image="https://www.bssresidency.com/building.webp"
        schemaMarkup={[articleSchema, faqSchema]}
      />

      <div className="courtallam-page">
        {/* ══════════ HERO ══════════ */}
        <div className="blog-hero" style={{ backgroundImage: `url(${mainFallsImg})` }}>
          <div className="blog-hero-content">
            <span className="blog-hero-badge">✦ Travel Guide 2025 ✦</span>
            <h1>
              Best Hotel Near<br />
              <em>Courtallam Waterfalls</em>
            </h1>
            <p className="hero-subtitle">
              Discover why BSS Residency is the #1 choice for travellers visiting the "Spa of South India" — premium rooms just 100 metres from the majestic Main Falls.
            </p>
            <div className="blog-hero-meta">
              <span>📅 Updated June 2025</span>
              <span>⏱️ 8 min read</span>
              <span>🏨 BSS Residency</span>
            </div>
          </div>
        </div>

        {/* ══════════ CONTENT ══════════ */}
        <div className="blog-container">
          <article className="blog-article">

            {/* Table of Contents */}
            <FadeSection>
              <div className="blog-toc">
                <h3>📑 Table of Contents</h3>
                <ol>
                  <li><button onClick={() => scrollTo('intro')} style={{background:'none',border:'none',cursor:'pointer',color:'#555',fontSize:'0.95rem',fontFamily:'Inter,sans-serif',padding:0,textAlign:'left'}}>Introduction – Courtallam, the Spa of South India</button></li>
                  <li><button onClick={() => scrollTo('why-bss')} style={{background:'none',border:'none',cursor:'pointer',color:'#555',fontSize:'0.95rem',fontFamily:'Inter,sans-serif',padding:0,textAlign:'left'}}>Why BSS Residency is the Best Choice</button></li>
                  <li><button onClick={() => scrollTo('rooms')} style={{background:'none',border:'none',cursor:'pointer',color:'#555',fontSize:'0.95rem',fontFamily:'Inter,sans-serif',padding:0,textAlign:'left'}}>Room Types – AC &amp; Non-AC Options</button></li>
                  <li><button onClick={() => scrollTo('amenities')} style={{background:'none',border:'none',cursor:'pointer',color:'#555',fontSize:'0.95rem',fontFamily:'Inter,sans-serif',padding:0,textAlign:'left'}}>Amenities &amp; Facilities</button></li>
                  <li><button onClick={() => scrollTo('waterfalls')} style={{background:'none',border:'none',cursor:'pointer',color:'#555',fontSize:'0.95rem',fontFamily:'Inter,sans-serif',padding:0,textAlign:'left'}}>Waterfalls Near BSS Residency</button></li>
                  <li><button onClick={() => scrollTo('tips')} style={{background:'none',border:'none',cursor:'pointer',color:'#555',fontSize:'0.95rem',fontFamily:'Inter,sans-serif',padding:0,textAlign:'left'}}>Travel Tips for Courtallam Visitors</button></li>
                  <li><button onClick={() => scrollTo('faq')} style={{background:'none',border:'none',cursor:'pointer',color:'#555',fontSize:'0.95rem',fontFamily:'Inter,sans-serif',padding:0,textAlign:'left'}}>Frequently Asked Questions</button></li>
                </ol>
              </div>
            </FadeSection>

            {/* ── Section 1: Introduction ── */}
            <FadeSection>
              <section id="intro">
                <h2>Introduction – Courtallam, the Spa of South India</h2>
                <p className="drop-cap">
                  Courtallam, often called the <strong>"Spa of South India"</strong>, is a mesmerizing hill station nestled in the Western Ghats of Tamil Nadu. This natural wonder draws thousands of visitors every year who come seeking the therapeutic benefits of its famous waterfalls. The cascading waters here are believed to have medicinal properties due to the herbs and minerals they collect while flowing through the dense forest.
                </p>
                <p>
                  The town offers nine different waterfalls, each with its own unique charm and healing qualities. From the mighty <strong>Main Falls (Peraruvi)</strong> to the gentler <strong>Shenbagadevi Falls</strong>, every cascade tells a story of nature's power and beauty. The sound of rushing water fills the air long before you can see the falls, and the cool mist provides instant relief from the humid South Indian weather.
                </p>

                <div className="blog-image-section">
                  <img src={mainFallsImg} alt="Courtallam Main Falls - the iconic Peraruvi waterfall in Western Ghats" loading="lazy" />
                  <div className="blog-image-caption">
                    📸 Courtallam Main Falls (Peraruvi) – The iconic 60-feet waterfall known for its medicinal waters
                  </div>
                </div>

                <p>
                  What makes Courtallam special is not just its natural beauty, but also the local belief in the healing powers of these waters. Many visitors come here for <strong>ayurvedic treatments and natural therapy sessions</strong>. The best time to visit is during the monsoon season from <strong>June to September</strong> when the waterfalls are at their most spectacular.
                </p>

                <div className="blog-quote">
                  Finding the right place to stay can make or break your Courtallam experience. Choosing the right hotel is just as important as planning which waterfalls to visit — and that's where BSS Residency stands apart from the rest.
                </div>
              </section>
            </FadeSection>

            {/* ── Section 2: Why BSS ── */}
            <FadeSection>
              <section id="why-bss">
                <h2>Why BSS Residency is the Best Choice</h2>
                <p>
                  <strong>BSS Residency</strong> stands out as the premier accommodation option near Courtallam waterfalls. What impresses guests most is how the hotel manages to blend <strong>comfort with affordability</strong> — something that's surprisingly rare in tourist destinations.
                </p>

                <div className="blog-image-section">
                  <img src={buildingImg} alt="BSS Residency Courtallam - Best Hotel Near Waterfalls exterior view" loading="lazy" />
                  <div className="blog-image-caption">
                    🏨 BSS Residency – Premium accommodation just 100 metres from Courtallam Main Falls
                  </div>
                </div>

                <h3>📍 Unbeatable Location</h3>
                <p>
                  The hotel's location is perhaps its biggest advantage. Situated just a <strong>2-minute walk (100 metres) from the main waterfall area</strong>, BSS Residency saves you from the hassle of long commutes or expensive local transport. You can return to your room quickly after getting soaked at the falls — especially convenient when travelling with elderly family members or children.
                </p>

                <h3>💎 Genuine Hospitality</h3>
                <p>
                  The staff at BSS Residency genuinely cares about guest satisfaction. The reception team provides detailed information about the best times to visit each waterfall and can arrange for a local guide when requested. Their knowledge of the area proves invaluable, especially regarding safety precautions during monsoon season.
                </p>

                <h3>🎯 Tailored for Waterfall Visitors</h3>
                <p>
                  What sets this hotel apart is its understanding of what Courtallam visitors actually need. They provide <strong>quick laundry services</strong> (essential when you're getting wet at waterfalls daily), <strong>waterproof bag storage</strong>, and even <strong>umbrellas for guests</strong>. These small touches show they understand their guests' requirements better than larger, more generic hotels in the area.
                </p>

                <h3>✨ Impeccable Cleanliness</h3>
                <p>
                  The hotel maintains excellent cleanliness standards, which is crucial in a humid climate like Courtallam. Every room receives daily housekeeping with fresh linens, and common areas are maintained throughout the day.
                </p>
              </section>
            </FadeSection>

            {/* ── Section 3: Rooms ── */}
            <FadeSection>
              <section id="rooms">
                <h2>Room Types — AC &amp; Non-AC Options</h2>
                <p>
                  BSS Residency offers a range of room options to suit different budgets and preferences. Whether you prefer the natural breeze of a Non-AC room during monsoon season or the controlled comfort of an air-conditioned space, there's a perfect option for you.
                </p>

                <div className="blog-image-section">
                  <img src={roomAc1} alt="BSS Residency AC Room Interior - premium furnished room" loading="lazy" />
                  <div className="blog-image-caption">
                    🛏️ Spacious AC Room at BSS Residency with premium mattress and modern amenities
                  </div>
                </div>

                <div className="blog-rooms-grid">
                  {ROOMS.map(room => (
                    <div className="blog-room-card" key={room.key} id={`room-${room.key}`}>
                      <span className="room-icon">{room.icon}</span>
                      <h4>{room.name}</h4>
                      <span className={`room-type ${room.type === 'A/C' ? 'ac' : 'non-ac'}`}>
                        {room.type}
                      </span>
                      <div className="room-price">
                        ₹{room.nonSeasonPrice.toLocaleString()} <small>/ night (off-season)</small>
                      </div>
                      <p className="room-desc">{room.desc}</p>
                      <ul className="room-features">
                        {room.features.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="blog-quote">
                  <strong>Pro Tip:</strong> During the monsoon season (June–September), Non-AC rooms are actually more comfortable as the natural Courtallam breeze keeps rooms pleasantly cool. AC rooms are recommended for the hotter months of March–May.
                </div>
              </section>
            </FadeSection>

            {/* ── Section 4: Amenities ── */}
            <FadeSection>
              <section id="amenities">
                <h2>Amenities &amp; Facilities</h2>
                <p>
                  BSS Residency is equipped with all the modern amenities you need for a comfortable stay near the waterfalls. Every detail has been thoughtfully designed to enhance your Courtallam experience.
                </p>

                <div className="blog-amenities-grid">
                  {AMENITIES.map((a, i) => (
                    <div className="blog-amenity-item" key={i}>
                      <span className="amenity-icon">{a.icon}</span>
                      <span>{a.label}</span>
                    </div>
                  ))}
                  {/* Additional blog-specific amenities */}
                  <div className="blog-amenity-item">
                    <span className="amenity-icon">🧺</span>
                    <span>Quick Laundry Service</span>
                  </div>
                  <div className="blog-amenity-item">
                    <span className="amenity-icon">🎒</span>
                    <span>Waterproof Bag Storage</span>
                  </div>
                  <div className="blog-amenity-item">
                    <span className="amenity-icon">☂️</span>
                    <span>Complimentary Umbrellas</span>
                  </div>
                  <div className="blog-amenity-item">
                    <span className="amenity-icon">🗺️</span>
                    <span>Local Guide Assistance</span>
                  </div>
                </div>
              </section>
            </FadeSection>

            {/* ── Section 5: Waterfalls ── */}
            <FadeSection>
              <section id="waterfalls">
                <h2>Waterfalls Near BSS Residency</h2>
                <p>
                  One of the greatest advantages of staying at BSS Residency is the incredible proximity to Courtallam's famous waterfalls. Here's a guide to the most popular falls you can easily visit during your stay:
                </p>

                <div className="blog-waterfall-grid">
                  <div className="blog-waterfall-card">
                    <img src={mainFallsImg} alt="Courtallam Main Falls Peraruvi" loading="lazy" />
                    <div className="waterfall-info">
                      <h4>Main Falls (Peraruvi)</h4>
                      <div className="waterfall-distance">📍 100 metres from BSS Residency</div>
                      <p>The legendary 60-feet waterfall offering medicinal benefits. The most iconic falls in Courtallam, believed to cure ailments through its herb-enriched waters.</p>
                    </div>
                  </div>

                  <div className="blog-waterfall-card">
                    <img src={tigerFallsImg} alt="Tiger Falls Courtallam" loading="lazy" />
                    <div className="waterfall-info">
                      <h4>Tiger Falls (Puliyanruvi)</h4>
                      <div className="waterfall-distance">📍 0.38 km from BSS Residency</div>
                      <p>A thrilling waterfall named after its powerful flow resembling a tiger's leap. Perfect for adventurous visitors seeking an exhilarating experience.</p>
                    </div>
                  </div>

                  <div className="blog-waterfall-card">
                    <img src={fiveFallsImg} alt="Five Falls Courtallam Aintharuvi" loading="lazy" />
                    <div className="waterfall-info">
                      <h4>Five Falls (Aintharuvi)</h4>
                      <div className="waterfall-distance">📍 4.0 km from BSS Residency</div>
                      <p>Divided naturally into five beautiful streams, this is one of the most scenic and photographed waterfalls in the Courtallam region.</p>
                    </div>
                  </div>

                  <div className="blog-waterfall-card">
                    <img src={oldFallsImg} alt="Old Courtallam Falls" loading="lazy" />
                    <div className="waterfall-info">
                      <h4>Old Courtallam Falls</h4>
                      <div className="waterfall-distance">📍 6.0 km from BSS Residency</div>
                      <p>A tranquil, spacious bathing experience perfect for families looking to avoid the tourist crowd. Surrounded by lush greenery.</p>
                    </div>
                  </div>

                  <div className="blog-waterfall-card">
                    <img src={shenbagadeviImg} alt="Shenbagadevi Falls Courtallam" loading="lazy" />
                    <div className="waterfall-info">
                      <h4>Shenbagadevi Falls</h4>
                      <div className="waterfall-distance">📍 4.2 km from BSS Residency</div>
                      <p>Named after the goddess Shenbagadevi, this serene waterfall offers a peaceful bathing experience with beautiful temple nearby.</p>
                    </div>
                  </div>

                  <div className="blog-waterfall-card">
                    <img src={honeyFallsImg} alt="Honey Falls Courtallam Thenaruvi" loading="lazy" />
                    <div className="waterfall-info">
                      <h4>Honey Falls (Thenaruvi)</h4>
                      <div className="waterfall-distance">📍 5.1 km from BSS Residency</div>
                      <p>Known for its sweet, honey-like taste, this waterfall is famous for the unique flavor imparted by the beehives located upstream.</p>
                    </div>
                  </div>
                </div>
              </section>
            </FadeSection>

            {/* ── Section 6: Tips ── */}
            <FadeSection>
              <section id="tips">
                <h2>Travel Tips for Courtallam Visitors</h2>
                <p>
                  Planning your visit to Courtallam? Here are some essential tips to make the most of your trip and your stay at BSS Residency:
                </p>

                <ol className="blog-tips-list">
                  <li>
                    <strong>Visit during monsoon (June–September)</strong> for the best waterfall experience. The falls are at their full glory with maximum water flow and the surrounding forests are lush green.
                  </li>
                  <li>
                    <strong>Book your rooms in advance</strong> during peak season. BSS Residency fills up quickly, especially on weekends and holidays. Online booking through the website ensures instant confirmation.
                  </li>
                  <li>
                    <strong>Carry extra sets of clothes</strong> — you'll get thoroughly drenched at the waterfalls! BSS Residency's quick laundry service is a lifesaver for multi-day visits.
                  </li>
                  <li>
                    <strong>Wear non-slip footwear</strong> near the waterfalls. The rocks can be slippery, especially during heavy flow. Rubber sandals or waterproof shoes are recommended.
                  </li>
                  <li>
                    <strong>Visit Main Falls early morning (6-8 AM)</strong> to avoid crowds. Being at BSS Residency, you're just a 2-minute walk away — giving you a significant advantage over hotels located further away.
                  </li>
                  <li>
                    <strong>Keep valuables safe</strong> — use BSS Residency's waterproof bag storage before heading to the falls. Don't carry expensive electronics to the waterfalls.
                  </li>
                  <li>
                    <strong>Try local South Indian cuisine</strong> at the restaurants near the bus stand. Courtallam is famous for its banana chips and freshly made dosas. The BSS Residency staff can recommend the best local eateries.
                  </li>
                  <li>
                    <strong>Plan 2-3 days for a complete experience</strong> — Courtallam has nine different waterfalls, temples, and dams to explore. One day is never enough to truly experience the magic of this place.
                  </li>
                </ol>
              </section>
            </FadeSection>

            {/* ── CTA Section ── */}
            <FadeSection>
              <div className="blog-cta-section">
                <h2>Ready to Experience <em>Courtallam's Magic</em>?</h2>
                <p className="tamil-msg">கொட்டலத்தில் உங்கள் அழகான பயணத்தை அனுபவிக்க இப்போதே பதிவு செய்யவும்!</p>
                <p>
                  Book your stay at BSS Residency today and enjoy the perfect Courtallam waterfall vacation. Instant confirmation via WhatsApp guaranteed!
                </p>
                <div className="blog-cta-buttons">
                  <Link to="/booking" className="blog-btn-primary" id="blog-book-now">
                    📞 Book Your Stay Now
                  </Link>
                  <a
                    href={waLink('Hi! I read your blog about Courtallam. I want to book a room at BSS Residency. 🙏')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="blog-btn-secondary"
                    id="blog-whatsapp-cta"
                  >
                    💬 WhatsApp Us
                  </a>
                  <a
                    href={`tel:${CONTACT.phonePrimary.replace(/\s/g, '')}`}
                    className="blog-btn-secondary"
                    id="blog-call-cta"
                  >
                    📞 Call {CONTACT.phonePrimary}
                  </a>
                </div>
              </div>
            </FadeSection>

            {/* ── Section 7: FAQs ── */}
            <FadeSection>
              <section id="faq">
                <h2>Frequently Asked Questions</h2>
                <p>
                  Here are answers to the most common questions visitors ask about staying at BSS Residency near Courtallam waterfalls:
                </p>

                <div style={{ marginTop: '1.5rem' }}>
                  {FAQS.map((faq, i) => (
                    <FAQItem key={i} question={faq.q} answer={faq.a} />
                  ))}
                </div>
              </section>
            </FadeSection>

            {/* ── Final CTA ── */}
            <FadeSection>
              <div className="blog-cta-section" style={{ marginTop: '2rem' }}>
                <h2>Don't Miss Out — <em>Book Today!</em></h2>
                <p>
                  Rooms fill up fast during peak season. Secure your clean, comfortable room at BSS Residency — the best hotel near Courtallam waterfalls.
                </p>
                <div className="blog-cta-buttons">
                  <Link to="/booking" className="blog-btn-primary" id="blog-final-book">
                    🏨 Reserve Your Room
                  </Link>
                  <Link to="/rooms" className="blog-btn-secondary" id="blog-view-rooms">
                    🛏️ View All Rooms
                  </Link>
                </div>
              </div>
            </FadeSection>

            {/* ── Author ── */}
            <div className="blog-author-card">
              <div className="blog-author-avatar">🏨</div>
              <div className="blog-author-info">
                <h4>BSS Residency, Courtallam</h4>
                <p>Premium hotel near Courtallam waterfalls • {CONTACT.addressLine1}, {CONTACT.addressLine2} • {CONTACT.phonePrimary}</p>
              </div>
            </div>

          </article>
        </div>
      </div>
    </>
  );
};

export default BestHotelCourtallam;
