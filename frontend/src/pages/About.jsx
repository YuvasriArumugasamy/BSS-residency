import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Umbrella, Leaf, UtensilsCrossed, Waves, Compass, HeartHandshake, Shield, Award, Star } from 'lucide-react';
import Reveal from '../components/Reveal';

const About = () => {
  const features = [
    { icon: <Umbrella size={40} />, title: 'Waterfall Access', desc: 'Enjoy exclusive proximity to the famous Courtallam waterfalls with guided nature walks.' },
    { icon: <Leaf size={40} />, title: 'Nature Spa', desc: 'Rejuvenate with natural therapies inspired by the ancient herbal traditions of Courtallam.' },
    { icon: <UtensilsCrossed size={40} />, title: 'Local Cuisine', desc: 'Savor authentic South Indian culinary delights prepared with locally sourced ingredients.' },
    { icon: <Waves size={40} />, title: 'Scenic Views', desc: 'Experience breathtaking mountain and waterfall views from our well-appointed rooms.' },
    { icon: <Compass size={40} />, title: 'Adventure Activities', desc: 'From guided mountain treks to waterfall exploration, we offer curated experiences.' },
    { icon: <HeartHandshake size={40} />, title: 'Personalized Service', desc: 'Our dedicated team ensures every detail of your stay is perfectly tailored to you.' },
  ];

  const values = [
    { icon: <Shield size={36} />, title: 'Sustainability', desc: 'We are committed to preserving the natural beauty of Courtallam through eco-friendly practices and conservation initiatives.' },
    { icon: <Award size={36} />, title: 'Exceptional Service', desc: 'Our dedicated team provides personalized attention to ensure every guest experience exceeds expectations.' },
    { icon: <Star size={36} />, title: 'Luxury with Purpose', desc: 'We believe true luxury enhances well-being, connecting guests to nature, culture, and themselves.' },
  ];

  return (
    <div className="about-page page-transition">
      <div className="page-banner">
        <h1>About Us</h1>
        <p>Learn about our story and what makes us special</p>
      </div>

      {/* Story Section - slide from sides */}
      <section className="about-story section-padding">
        <div className="container">
          <div className="story-grid">
            <Reveal animation="slide-left">
              <div className="story-text">
                <h2 className="story-heading">Welcome to <em>SM Golden Resorts</em></h2>
                <p className="story-lead">Nestled in the heart of Courtallam, the "Spa of South India," SM Golden Resorts stands as a testament to luxury, comfort, and natural beauty.</p>
                <p>Founded by S. Murugan with a passion for hospitality, our resort has grown from a humble retreat into a premier destination for travelers seeking tranquility amidst nature's grandeur. Located on the Old Falls Main Road, we offer 11 meticulously designed rooms that cater to every traveler's needs.</p>
                <p>Over the years, we've evolved from a small nature retreat to an award-worthy resort, yet we've never lost sight of our founding principle: to provide an intimate, personalized experience where every guest feels truly cherished.</p>
              </div>
            </Reveal>
            <Reveal animation="slide-right" delay={150}>
              <div className="story-image">
                <img src="/assets/outdoor2.jpg" alt="SM Golden Resorts Exterior" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Features - zoom-in staggered */}
      <section className="about-features section-padding" style={{ background: 'var(--bg-section)' }}>
        <div className="container">
          <Reveal animation="fade-up">
            <div className="section-header text-center">
              <h2>Resort Features</h2>
            </div>
          </Reveal>
          <div className="features-grid">
            {features.map((item, i) => (
              <Reveal key={i} animation="zoom-in" delay={i * 80}>
                <div className="feature-card">
                  <span className="icon">{item.icon}</span>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Values - flip-up staggered */}
      <section className="about-values section-padding">
        <div className="container">
          <Reveal animation="fade-up">
            <div className="section-header text-center">
              <h2>Our Values</h2>
            </div>
          </Reveal>
          <div className="values-grid">
            {values.map((item, i) => (
              <Reveal key={i} animation="flip-up" delay={i * 150}>
                <div className="value-card">
                  <div className="value-icon">{item.icon}</div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .about-page { padding-top: 64px; }
        .story-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 50px; align-items: center; }
        .story-heading { font-size: 2.2rem; color: var(--navy); margin-bottom: 20px; font-weight: 400; }
        .story-lead { font-size: 1.05rem; color: var(--text-dark); font-weight: 500; margin-bottom: 16px; line-height: 1.7; }
        .story-text p { color: var(--text-body); font-size: 0.95rem; line-height: 1.8; margin-bottom: 14px; }
        .story-image { border-radius: 12px; overflow: hidden; box-shadow: var(--shadow-lg); }
        .story-image img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
        .feature-card { background: var(--white); border-radius: 12px; padding: 40px 28px; text-align: center; box-shadow: var(--shadow-card); transition: var(--transition-smooth); border: 1px solid transparent; }
        .feature-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-xl); border-color: var(--gold-accent); }
        .feature-card .icon { color: var(--gold-accent); margin-bottom: 20px; display: flex; align-items: center; justify-content: center; }
        .feature-card h3 { font-family: var(--font-body); font-size: 1.1rem; font-weight: 700; margin-bottom: 12px; color: var(--text-dark); }
        .feature-card p { color: var(--text-body); font-size: 0.88rem; line-height: 1.6; }
        .values-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
        .value-card { background: var(--white); border-radius: 12px; padding: 40px 28px; text-align: center; box-shadow: var(--shadow-card); transition: var(--transition-smooth); }
        .value-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-xl); }
        .value-icon { width: 70px; height: 70px; border-radius: 50%; background: rgba(200,155,60,0.08); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: var(--gold-accent); }
        .value-card h3 { font-family: var(--font-body); font-size: 1.1rem; font-weight: 700; margin-bottom: 12px; color: var(--text-dark); }
        .value-card p { color: var(--text-body); font-size: 0.88rem; line-height: 1.6; }
        @media (max-width: 992px) { .story-grid { grid-template-columns: 1fr; } .features-grid, .values-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .features-grid, .values-grid { grid-template-columns: 1fr; } .story-heading { font-size: 1.8rem; } }
      `}} />
    </div>
  );
};

export default About;
