import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <h3 className="footer-title">SM Golden Resorts</h3>
              <div className="footer-underline"></div>
              <p className="footer-desc">
                Experience unparalleled luxury nestled in the heart of Courtallam, near the majestic waterfalls. Your sanctuary awaits.
              </p>
              <div className="footer-socials">
                <a href="#" aria-label="Facebook" className="social-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                </a>
                <a href="#" aria-label="Instagram" className="social-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
                <a href="#" aria-label="Twitter" className="social-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
                </a>
              </div>
            </div>

            <div className="footer-links-col">
              <h3 className="footer-title">Quick Links</h3>
              <div className="footer-underline"></div>
              <ul className="footer-link-list">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/rooms">Rooms</Link></li>
                <li><Link to="/activities">Activities</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
              </ul>
            </div>

            <div className="footer-contact-col">
              <h3 className="footer-title">Contact Us</h3>
              <div className="footer-underline"></div>
              <ul className="footer-contact-list">
                <li>
                  <MapPin size={16} />
                  <span>Old Falls Main Road, Courtallam, Tamil Nadu</span>
                </li>
                <li>
                  <Phone size={16} />
                  <span>9443710420 / 9003549849</span>
                </li>
                <li>
                  <Mail size={16} />
                  <span>info@smgoldenresorts.com</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p><strong>SM Golden Resorts</strong> v1.0</p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .footer {
          background: var(--bg-footer);
          color: var(--text-nav);
        }
        .footer-main {
          padding: 60px 0 40px;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1.5fr;
          gap: 50px;
        }
        .footer-title {
          font-family: var(--font-body);
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--white);
          margin-bottom: 4px;
        }
        .footer-underline {
          width: 40px;
          height: 3px;
          background: var(--gold-accent);
          margin-bottom: 20px;
          border-radius: 2px;
        }
        .footer-desc {
          font-size: 0.9rem;
          line-height: 1.7;
          color: rgba(255,255,255,0.65);
          margin-bottom: 20px;
        }
        .footer-socials {
          display: flex;
          gap: 10px;
        }
        .social-icon {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.7);
          transition: var(--transition);
        }
        .social-icon:hover {
          background: rgba(255,255,255,0.2);
          color: var(--white);
        }
        .footer-link-list {
          list-style: none;
          padding: 0;
        }
        .footer-link-list li {
          margin-bottom: 10px;
        }
        .footer-link-list a {
          color: rgba(255,255,255,0.65);
          font-size: 0.9rem;
          transition: var(--transition);
          text-decoration: none;
        }
        .footer-link-list a:hover {
          color: var(--white);
          padding-left: 4px;
        }
        .footer-contact-list {
          list-style: none;
          padding: 0;
        }
        .footer-contact-list li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 14px;
          color: rgba(255,255,255,0.65);
          font-size: 0.9rem;
        }
        .footer-contact-list li svg {
          flex-shrink: 0;
          margin-top: 3px;
          color: rgba(255,255,255,0.5);
        }
        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.1);
          padding: 20px 0;
          text-align: center;
        }
        .footer-bottom p {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.5);
        }

        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 36px;
          }
        }
      `}} />
    </footer>
  );
};

export default Footer;
