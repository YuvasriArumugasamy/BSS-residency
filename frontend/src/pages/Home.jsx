import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Umbrella, Leaf, UtensilsCrossed, Waves, Compass, HeartHandshake, ArrowRight, Shield, Award, Star } from 'lucide-react';
import Reveal from '../components/Reveal';

const Home = () => {
  const navigate = useNavigate();

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
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>SM Golden Resorts</h1>
          <p className="hero-subtitle">Your Luxury Nature Retreat in Courtallam</p>
          <button className="btn-primary hero-btn" onClick={() => navigate('/admin')}>Login <ArrowRight size={18} /></button>
        </div>
      </section>

      {/* Resort Features */}
      <section className="features-section section-padding">
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

      {/* Our Values */}
      <section className="values-section section-padding" style={{ background: 'var(--bg-section)' }}>
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
        .home-page { padding-top: 0; }

        /* Hero */
        .hero {
          height: 85vh;
          min-height: 500px;
          background: url('/assets/hero.jpg') center/cover no-repeat;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          text-align: center;
        }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(10,20,35,0.50) 0%, rgba(10,20,35,0.65) 100%);
        }
        .hero-content {
          position: relative;
          z-index: 10;
          max-width: 700px;
          padding: 0 24px;
        }
        .hero h1 {
          font-size: 3.5rem;
          font-weight: 500;
          color: var(--white);
          margin-bottom: 16px;
          letter-spacing: 1px;
          line-height: 1.2;
          animation: heroTitle 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s both;
        }
        .hero-subtitle {
          font-size: 1.1rem;
          color: rgba(255,255,255,0.85);
          margin-bottom: 36px;
          font-weight: 400;
          letter-spacing: 0.5px;
          animation: heroSubtitle 0.8s cubic-bezier(0.16,1,0.3,1) 0.45s both;
        }
        .hero-btn {
          padding: 14px 36px;
          font-size: 1rem;
          border-radius: 50px;
          animation: heroBtn 0.7s cubic-bezier(0.16,1,0.3,1) 0.7s both;
        }

        /* Features */
        .features-section {
          background: var(--bg-body);
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }
        .feature-card {
          background: var(--white);
          border-radius: 12px;
          padding: 40px 28px;
          text-align: center;
          box-shadow: var(--shadow-card);
          transition: var(--transition-smooth);
          border: 1px solid transparent;
        }
        .feature-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-xl);
          border-color: var(--gold-accent);
        }
        .feature-card .icon {
          color: var(--gold-accent);
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .feature-card h3 {
          font-family: var(--font-body);
          font-size: 1.15rem;
          font-weight: 700;
          margin-bottom: 12px;
          color: var(--text-dark);
        }
        .feature-card p {
          color: var(--text-body);
          font-size: 0.9rem;
          line-height: 1.6;
        }

        /* Values */
        .values-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }
        .value-card {
          background: var(--white);
          border-radius: 12px;
          padding: 40px 28px;
          text-align: center;
          box-shadow: var(--shadow-card);
          transition: var(--transition-smooth);
        }
        .value-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-xl);
        }
        .value-icon {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: rgba(200,155,60,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: var(--gold-accent);
        }
        .value-card h3 {
          font-family: var(--font-body);
          font-size: 1.15rem;
          font-weight: 700;
          margin-bottom: 12px;
          color: var(--text-dark);
        }
        .value-card p {
          color: var(--text-body);
          font-size: 0.9rem;
          line-height: 1.6;
        }

        @media (max-width: 992px) {
          .hero h1 { font-size: 2.5rem; }
          .features-grid,
          .values-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 600px) {
          .hero { height: 70vh; }
          .hero h1 { font-size: 2rem; }
          .features-grid,
          .values-grid {
            grid-template-columns: 1fr;
          }
        }
      `}} />
    </div>
  );
};

export default Home;
