import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { CONTACT, waLink } from '../constants';
import './FAQ.css';

const FAQ_DATA = [
  // Booking & Payment
  {
    id: 1, category: 'Booking & Payment',
    q: 'What are the Check-in and Check-out times?',
    a: 'Check-in time is 12:00 PM (noon) and Check-out time is 11:00 AM. Early check-in and late check-out may be possible depending on room availability — please contact us in advance.',
  },
  {
    id: 2, category: 'Booking & Payment',
    q: 'How much advance payment is required to confirm a booking?',
    a: 'An advance payment of ₹510 is required to confirm your room booking online. The remaining balance can be paid at check-out.',
  },
  {
    id: 3, category: 'Booking & Payment',
    q: 'Will I get a refund if I cancel my booking?',
    a: 'Cancellations made 48 hours before the check-in date are eligible for a full refund. Cancellations within 48 hours of check-in are non-refundable. For assistance, please reach out via WhatsApp.',
  },
  {
    id: 4, category: 'Booking & Payment',
    q: 'Do you accept walk-in bookings?',
    a: 'Yes! Walk-in guests are welcome. However, rooms fill up quickly during peak season and weekends. We recommend checking availability via WhatsApp or phone call before arriving.',
  },
  {
    id: 5, category: 'Booking & Payment',
    q: 'Is there a discount for group bookings (10+ persons)?',
    a: 'Yes! Special group rates are available for 10 or more guests. Please call or WhatsApp us at +91 88385 99755 for details and customized pricing.',
  },
  {
    id: 6, category: 'Booking & Payment',
    q: 'What ID proof is required at check-in?',
    a: 'A valid government-issued photo ID is mandatory — Aadhaar Card, Voter ID, Passport, or Driving License. All guests aged 18 and above must provide ID proof.',
  },
  {
    id: 7, category: 'Booking & Payment',
    q: 'What payment methods are accepted at the hotel?',
    a: 'We accept Cash, UPI (GPay, PhonePe, Paytm), and Net Banking. Online advance bookings are secured via UPI payment.',
  },

  // Rooms & Facilities
  {
    id: 8, category: 'Rooms & Facilities',
    q: 'Is Wi-Fi available in the rooms?',
    a: 'Yes! We provide complimentary high-speed Wi-Fi access throughout the property for all our guests to stay connected.',
  },
  {
    id: 9, category: 'Rooms & Facilities',
    q: 'Is hot water available 24 hours?',
    a: 'Yes! All rooms are equipped with 24-hour hot water through a geyser in the attached bathroom.',
  },
  {
    id: 10, category: 'Rooms & Facilities',
    q: 'Is there an extra charge for AC rooms?',
    a: 'Yes, AC and Non-AC rooms are priced separately. AC rooms are approximately ₹500–₹800 more per night. Please check our Rooms page for exact pricing.',
  },
  {
    id: 11, category: 'Rooms & Facilities',
    q: 'Can an extra mattress or bed be arranged?',
    a: 'Yes! Extra mattresses are available for a small additional charge. Please inform us before check-in so we can arrange it in advance.',
  },
  {
    id: 12, category: 'Rooms & Facilities',
    q: 'Are TVs available in the rooms?',
    a: 'TVs are available in selected rooms. Please mention your preference while booking or contact us to confirm availability.',
  },
  {
    id: 13, category: 'Rooms & Facilities',
    q: 'Do all rooms have an attached bathroom?',
    a: 'Yes! All rooms have clean attached bathrooms with 24-hour hot and cold water supply.',
  },
  {
    id: 14, category: 'Rooms & Facilities',
    q: 'Is early check-in or late check-out possible?',
    a: 'Early check-in and late check-out are subject to room availability. Please send us a request via WhatsApp in advance. Additional charges may apply.',
  },
  {
    id: 15, category: 'Rooms & Facilities',
    q: 'Is daily housekeeping provided?',
    a: 'Yes! We provide daily housekeeping, fresh towels, and clean drinking water in all rooms.',
  },

  // Location & Transport
  {
    id: 16, category: 'Location & Transport',
    q: 'How far is BSS Residency from the Courtallam Bus Stand?',
    a: 'We are located right next to the Courtallam Old Bus Stand and Anna Statue — just a 2-minute walk. We are only 100 metres from the famous Main Falls!',
  },
  {
    id: 17, category: 'Location & Transport',
    q: 'Is parking available at the hotel?',
    a: 'Limited parking space is available for both 2-wheelers and 4-wheelers. During peak season, public parking nearby is also available. Please inform us in advance if you need parking.',
  },
  {
    id: 18, category: 'Location & Transport',
    q: 'How far are the waterfalls from the hotel?',
    a: 'Main Falls is just 100 metres away — a 1-2 minute walk! Five Falls is 4 km, Tiger Falls is 1.5 km, and Old Falls is 6 km from our property.',
  },
  {
    id: 19, category: 'Location & Transport',
    q: 'What is the nearest railway station and how do I get there?',
    a: 'The nearest railway station is Tenkasi Junction (14 km), with autos and cabs readily available. Shengottai Station (20 km) is another option. Direct trains from Chennai include Nellai Express and Courtallam Express.',
  },
  {
    id: 20, category: 'Location & Transport',
    q: 'Can you arrange an auto or cab for us?',
    a: 'Autos are easily available from the station and town. We can help with local cab or auto contact details on request — just WhatsApp us.',
  },

  // Food & Services
  {
    id: 21, category: 'Food & Services',
    q: 'Is there a restaurant or food service at the hotel?',
    a: 'BSS Residency does not have an in-house restaurant. However, several good hotels and restaurants are within 50–100 metres — including Saravana Bhavan, local mess, and juice shops.',
  },
  {
    id: 22, category: 'Food & Services',
    q: 'Is drinking water provided in the rooms?',
    a: 'Yes! Clean filtered/bottled drinking water is provided in all rooms.',
  },
  {
    id: 23, category: 'Food & Services',
    q: 'Is room service available?',
    a: 'Limited room service is available. For specific needs, please request at the reception. Home delivery from nearby restaurants is also possible.',
  },

  // Courtallam & Season
  {
    id: 24, category: 'Courtallam & Season',
    q: 'When does the Courtallam season start and end?',
    a: 'The Courtallam season typically runs from June to September, coinciding with the South-West Monsoon. The waterfalls are at full flow in June\u2013July. October to May is the off-season \u2014 waterfalls are lighter but it\'s a great time for a peaceful, crowd-free stay!',
  },
  {
    id: 25, category: 'Courtallam & Season',
    q: 'Are room rates higher during the season?',
    a: 'Yes, rates are slightly higher during peak season (June–September). Better rates are available during off-season. Please call or WhatsApp us for exact pricing.',
  },
  {
    id: 26, category: 'Courtallam & Season',
    q: 'Is bathing in the falls safe? Is it safe for children?',
    a: 'Main Falls and Chitraruvi are generally safe for bathing. However, strong currents may occur during heavy rainfall. Please supervise children at all times and follow government safety guidelines.',
  },
  {
    id: 27, category: 'Courtallam & Season',
    q: 'Are pets allowed?',
    a: 'We are sorry, pets are not allowed at BSS Residency at this time.',
  },
  {
    id: 28, category: 'Courtallam & Season',
    q: 'Is there a separate charge for children?',
    a: 'Children up to 5 years stay free. Children aged 5–12 years are charged a nominal extra fee. Guests aged 12 and above are counted as adults. Please mention the number of children while booking.',
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
      <a href="#main" className="skip-link">Skip to main content</a>
      <SEO
        title="FAQ | BSS Residency Courtallam — Frequently Asked Questions"
        description="Get answers to common questions about BSS Residency Courtallam — check-in time, parking, waterfalls distance, room facilities, booking process and more."
        keywords="bss residency faq, courtallam hotel questions, courtallam lodge check in time, courtallam waterfalls distance, hotel near courtallam faq, kutralam hotel booking questions"
        schemaMarkup={schemaFAQ}
      />

      <main className="faq-page" id="main">
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
            <h2>Still have questions?</h2>
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
