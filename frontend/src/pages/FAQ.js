import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { CONTACT, waLink } from '../constants';
import './FAQ.css';

const FAQ_DATA = [
  // Booking & Payment
  {
    id: 1, category: 'Booking & Payment',
    q: 'Check-in time and Check-out time என்ன?',
    a: 'Check-in time: 12:00 PM (noon). Check-out time: 11:00 AM. Early check-in and late check-out room availability-ஐ பொறுத்து possible — தயவுசெய்து முன்கூட்டியே தொடர்பு கொள்ளுங்கள்.',
  },
  {
    id: 2, category: 'Booking & Payment',
    q: 'Online booking பண்ண advance எவ்வளவு கட்டணும்?',
    a: '₹500 advance payment கட்டினால் உங்கள் room confirmed ஆகும். Balance amount check-out time-ல pay பண்ணலாம்.',
  },
  {
    id: 3, category: 'Booking & Payment',
    q: 'Booking cancel பண்ணா refund கிடைக்குமா?',
    a: 'Check-in date-க்கு 48 hours முன்பாக cancel பண்ணினால் full refund கிடைக்கும். 48 hours-க்குள் cancel பண்ணினால் advance amount refund ஆகாது. மேலும் தகவலுக்கு WhatsApp-ல தொடர்பு கொள்ளுங்கள்.',
  },
  {
    id: 4, category: 'Booking & Payment',
    q: 'Walk-in booking accept பண்றீங்களா?',
    a: 'ஆமாம்! Walk-in guests-ஐயும் welcome பண்றோம். ஆனால் peak season மற்றும் weekends-ல rooms quickly fill ஆகும். முன்கூட்டியே WhatsApp-ல அல்லது phone-ல availability check பண்ணுவது better.',
  },
  {
    id: 5, category: 'Booking & Payment',
    q: 'Group booking (10+ persons) discount இருக்கா?',
    a: 'ஆமாம்! 10 or more guests-க்கு special group rates கிடைக்கும். Details-க்கு directly +91 88385 99755 call பண்ணுங்கள் அல்லது WhatsApp பண்ணுங்கள்.',
  },
  {
    id: 6, category: 'Booking & Payment',
    q: 'Check-in-க்கு ID proof என்ன கொண்டுவரணும்?',
    a: 'Valid government ID mandatory — Aadhaar Card, Voter ID, Passport, அல்லது Driving License ஏதாவது ஒன்று. All guests 18+ போட வேண்டும்.',
  },
  {
    id: 7, category: 'Booking & Payment',
    q: 'Hotel-ல payment methods என்னென்ன accept பண்றீங்க?',
    a: 'Cash, UPI (GPay, PhonePe, Paytm), Net Banking ஆகியவை accept பண்றோம். Online booking-க்கு advance payment via UPI.',
  },

  // Room & Facilities
  {
    id: 8, category: 'Rooms & Facilities',
    q: 'Room-ல Wi-Fi இருக்கா?',
    a: 'தற்போது Wi-Fi facility இல்லை. ஆனால் Courtallam area-ல நல்ல mobile network (4G/5G) கிடைக்கும். Jio, Airtel, BSNL எல்லாம் good coverage இருக்கு.',
  },
  {
    id: 9, category: 'Rooms & Facilities',
    q: 'Hot water 24 hours கிடைக்குமா?',
    a: 'ஆமாம்! எல்லா rooms-லும் 24-hour hot water கிடைக்கும். Geyser attached bathroom-ல available.',
  },
  {
    id: 10, category: 'Rooms & Facilities',
    q: 'AC room-ல extra charge இருக்கா?',
    a: 'Non-AC மற்றும் AC rooms-க்கு தனித்தனி tariff இருக்கு. AC rooms ₹500–₹800 அதிகமாக இருக்கும். Exact pricing-க்கு Rooms page பாருங்கள்.',
  },
  {
    id: 11, category: 'Rooms & Facilities',
    q: 'Extra mattress / extra bed போடுவீங்களா?',
    a: 'ஆமாம்! Extra mattress available — small additional charge apply ஆகும். Check-in-க்கு முன்பாக தெரிவிக்கவும்.',
  },
  {
    id: 12, category: 'Rooms & Facilities',
    q: 'Room-ல TV இருக்கா?',
    a: 'தேர்ந்தெடுக்கப்பட்ட rooms-ல TV available. Booking பண்ணும்போது இதைப் பற்றி கேட்கலாம்.',
  },
  {
    id: 13, category: 'Rooms & Facilities',
    q: 'Attached bathroom இருக்கா?',
    a: 'ஆமாம்! எல்லா rooms-லும் clean attached bathroom with 24-hour hot & cold water கிடைக்கும்.',
  },
  {
    id: 14, category: 'Rooms & Facilities',
    q: 'Early check-in / Late check-out possible-ஆ?',
    a: 'Room availability-ஐ பொறுத்து possible. முன்கூட்டியே WhatsApp-ல request பண்ணுங்கள். Extra charges apply ஆகலாம்.',
  },
  {
    id: 15, category: 'Rooms & Facilities',
    q: 'Daily housekeeping பண்றீங்களா?',
    a: 'ஆமாம்! Daily housekeeping, fresh towels, மற்றும் clean drinking water provide பண்றோம்.',
  },

  // Transport & Location
  {
    id: 16, category: 'Location & Transport',
    q: 'Courtallam bus stand-லிருந்து BSS Residency எவ்வளவு தூரம்?',
    a: 'Courtallam Old Bus Stand மற்றும் Anna Statue-க்கு அருகில் உள்ளோம் — வெறும் 2 minutes walking distance. Main Falls-க்கு 100 metres மட்டும்!',
  },
  {
    id: 17, category: 'Location & Transport',
    q: 'Parking facility இருக்கா?',
    a: 'Limited parking space available (2-wheeler & 4-wheeler). Peak season-ல nearby public parking use பண்ணலாம். முன்கூட்டியே inform பண்ணுங்கள்.',
  },
  {
    id: 18, category: 'Location & Transport',
    q: 'Main Falls எத்தனை km / minutes-ல போகலாம்?',
    a: 'Main Falls மிக அருகில் — 100 metres மட்டும்! Walking-ல 1-2 minutes. Five Falls 4 km, Tiger Falls 1.5 km, Old Falls 6 km தூரத்தில் உள்ளன.',
  },
  {
    id: 19, category: 'Location & Transport',
    q: 'Nearest railway station எது? எப்படி வருவது?',
    a: 'Nearest railway station: Tenkasi Junction (14 km). From there auto / cab available. Alternatively, Shengottai Station (20 km). Chennai-லிருந்து Nellai Express / Courtallam Express direct train உண்டு.',
  },
  {
    id: 20, category: 'Location & Transport',
    q: 'Auto / Cab arrange பண்ணி தர முடியுமா?',
    a: 'Station அல்லது town-ல இருந்து auto readily available. Local cab details request பண்ணினால் help பண்றோம். WhatsApp பண்ணுங்கள்.',
  },

  // Food & Services
  {
    id: 21, category: 'Food & Services',
    q: 'Hotel-ல food / restaurant இருக்கா?',
    a: 'BSS Residency-ல in-house restaurant இல்லை. ஆனால் அருகிலேயே (50-100m) பல good hotels மற்றும் restaurants உள்ளன — Saravana Bhavan, local mess, juice shops எல்லாம் available.',
  },
  {
    id: 22, category: 'Food & Services',
    q: 'Drinking water provide பண்றீங்களா?',
    a: 'ஆமாம்! Clean drinking water (filtered/bottled) provide பண்றோம். Room-ல water bottles கிடைக்கும்.',
  },
  {
    id: 23, category: 'Food & Services',
    q: 'Room service கிடைக்குமா?',
    a: 'Limited room service available. Specific needs-க்கு reception-ல request பண்ணலாம். Nearby restaurants-ல home delivery possible.',
  },

  // Courtallam & Season
  {
    id: 24, category: 'Courtallam & Season',
    q: 'Courtallam season எப்போ start ஆகும்? எப்போ end ஆகும்?',
    a: 'Courtallam season பொதுவாக June – September (South-West Monsoon). June-July-ல waterfalls full flow-ல இருக்கும். October-May off-season — falls கொஞ்சம் குறைவாக இருக்கும், ஆனால் peaceful stay-க்கு perfect!',
  },
  {
    id: 25, category: 'Courtallam & Season',
    q: 'Season-ல room rate அதிகமா இருக்கா?',
    a: 'ஆமாம். Peak season (June–September) rates slightly higher. Off-season-ல better rates கிடைக்கும். Exact pricing-க்கு call/WhatsApp பண்ணுங்கள்.',
  },
  {
    id: 26, category: 'Courtallam & Season',
    q: 'Falls-ல bathing safe-ஆ? குழந்தைகளுக்கு safe-ஆ?',
    a: 'Main Falls and Chitraruvi are generally safe for bathing. ஆனால் heavy rain season-ல strong currents இருக்கலாம். குழந்தைகளை கவனமாக பார்த்துக்கொள்ளுங்கள். Government safety guidelines follow பண்ணுங்கள்.',
  },
  {
    id: 27, category: 'Courtallam & Season',
    q: 'Pets allowed-ஆ?',
    a: 'தற்போது pets allow பண்றதில்லை. மன்னிக்கவும்!',
  },
  {
    id: 28, category: 'Courtallam & Season',
    q: 'Children-க்கு separate / extra charge இருக்கா?',
    a: '5 years வரை children free. 5–12 years children-க்கு nominal extra charge. 12+ adults-ஆக count ஆவார்கள். Family room booking-ல details கேட்கலாம்.',
  },
];

const CATEGORIES = ['All', 'Booking & Payment', 'Rooms & Facilities', 'Location & Transport', 'Food & Services', 'Courtallam & Season'];

const CAT_ICONS = {
  'All': '❓',
  'Booking & Payment': '💳',
  'Rooms & Facilities': '🛏️',
  'Location & Transport': '📍',
  'Food & Services': '🍽️',
  'Courtallam & Season': '🌊',
};

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [openId, setOpenId] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = FAQ_DATA;
    if (activeCategory !== 'All') list = list.filter(f => f.category === activeCategory);
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter(f => f.q.toLowerCase().includes(s) || f.a.toLowerCase().includes(s));
    }
    return list;
  }, [activeCategory, search]);

  const toggle = (id) => setOpenId(prev => prev === id ? null : id);

  const schemaFAQ = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQ_DATA.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  };

  return (
    <>
      <SEO
        title="FAQ | BSS Residency Courtallam — Frequently Asked Questions"
        description="Get answers to common questions about BSS Residency Courtallam — check-in time, parking, waterfalls distance, room facilities, booking process and more."
        keywords="bss residency faq, courtallam hotel questions, courtallam lodge check in time, courtallam waterfalls distance, hotel near courtallam faq, kutralam hotel booking questions"
        schemaMarkup={schemaFAQ}
      />

      <main className="faq-page">
        {/* Hero */}
        <section className="page-hero faq-hero">
          <p className="section-label gold">Help Center</p>
          <h1>Frequently Asked <em>Questions</em></h1>
          <p>Everything you need to know about your stay at BSS Residency</p>

          {/* Search */}
          <div className="faq-search-wrap">
            <span className="faq-search-icon">🔍</span>
            <input
              type="text"
              className="faq-search"
              placeholder="Search questions..."
              value={search}
              onChange={e => { setSearch(e.target.value); setActiveCategory('All'); }}
            />
            {search && (
              <button className="faq-search-clear" onClick={() => setSearch('')}>✕</button>
            )}
          </div>
        </section>

        {/* Category Tabs */}
        <section className="faq-cats-wrap">
          <div className="faq-cats container">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`faq-cat-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => { setActiveCategory(cat); setSearch(''); setOpenId(null); }}
              >
                <span>{CAT_ICONS[cat]}</span> {cat}
              </button>
            ))}
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="faq-section container">
          <div className="faq-count">
            {filtered.length} question{filtered.length !== 1 ? 's' : ''}
            {activeCategory !== 'All' && ` in "${activeCategory}"`}
            {search && ` matching "${search}"`}
          </div>

          {filtered.length === 0 ? (
            <div className="faq-empty">
              <span>🤔</span>
              <p>No questions found. Try a different search or category.</p>
              <button onClick={() => { setSearch(''); setActiveCategory('All'); }}>Clear filters</button>
            </div>
          ) : (
            <div className="faq-list">
              {filtered.map((faq, idx) => (
                <div
                  key={faq.id}
                  className={`faq-item ${openId === faq.id ? 'open' : ''}`}
                  style={{ animationDelay: `${idx * 0.04}s` }}
                >
                  <button className="faq-question" onClick={() => toggle(faq.id)}>
                    <span className="faq-q-num">{String(faq.id).padStart(2, '0')}</span>
                    <span className="faq-q-text">{faq.q}</span>
                    <span className="faq-chevron">{openId === faq.id ? '−' : '+'}</span>
                  </button>
                  <div className="faq-answer-wrap">
                    <div className="faq-answer">
                      <span className="faq-cat-badge">{CAT_ICONS[faq.category]} {faq.category}</span>
                      <p>{faq.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="faq-cta">
          <div className="faq-cta-inner container">
            <h2>இன்னும் doubt இருக்கா?</h2>
            <p>We're available 24/7 — just WhatsApp or call us directly!</p>
            <div className="faq-cta-btns">
              <a
                href={waLink('Hello BSS Residency! I have a question about my stay.')}
                className="btn-gold"
                target="_blank"
                rel="noreferrer"
              >
                💬 WhatsApp Us
              </a>
              <a href={`tel:${CONTACT.phonePrimary.replace(/\s/g, '')}`} className="btn-outline-light">
                📞 {CONTACT.phonePrimary}
              </a>
              <Link to="/booking" className="btn-primary"><span>Book Now</span></Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
