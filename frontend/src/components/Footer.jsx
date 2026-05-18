import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer section-padding">
      <div className="container grid footer-grid">
        <div className="footer-info">
          <div className="footer-logo-container">
            <img src="/assets/logo.jpg" alt="SM Golden Resorts Logo" className="footer-logo" />
            <h2 className="logo"><span className="gold-text">SM</span> GOLDEN <span className="gold-text">RESORTS</span></h2>
          </div>
          <p>Experience the ultimate luxury nature retreat at the heart of Courtallam. Near Old Falls, SM Golden Resorts offers a serene escape with premium amenities.</p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/#about">About Us</a></li>
            <li><a href="/#rooms">Rooms & Pricing</a></li>
            <li><a href="/#amenities">Amenities</a></li>
            <li><a href="/book">Book Now</a></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h3>Contact Us</h3>
          <ul>
            <li><MapPin size={18} className="gold-text" /> Old Falls Main Road, Courtallam, TN</li>
            <li><Phone size={18} className="gold-text" /> <a href="tel:9443710420">9443710420</a></li>
            <li><Phone size={18} className="gold-text" /> <a href="tel:9003549849">9003549849</a></li>
            <li><Mail size={18} className="gold-text" /> info@smgoldenresorts.com</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom text-center">
        <p>&copy; {new Date().getFullYear()} SM Golden Resorts. All Rights Reserved.</p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .footer {
          background-color: var(--gray);
          border-top: 1px solid rgba(201, 168, 76, 0.2);
        }
        .footer-grid {
          grid-template-columns: 2fr 1fr 1.5fr;
        }
        .footer h3 {
          margin-bottom: 25px;
          font-size: 1.4rem;
        }
        .footer-logo-container {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .footer-logo {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          border: 2px solid var(--gold);
          object-fit: cover;
        }
        .footer-info p {
          color: var(--text-body);
          margin: 20px 0;
          max-width: 400px;
        }
        .social-links {
          display: flex;
          gap: 15px;
        }
        .social-links a {
          color: var(--gold);
          border: 1px solid var(--gold);
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }
        .social-links a:hover {
          background: var(--gold);
          color: var(--black);
        }
        .footer ul {
          list-style: none;
        }
        .footer ul li {
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--text-body);
        }
        .footer-links a:hover {
          color: var(--gold);
          padding-left: 5px;
        }
        .footer-bottom {
          margin-top: 60px;
          padding-top: 30px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          color: #666;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .footer-info, .footer-contact ul li {
            justify-content: center;
            align-items: center;
          }
          .social-links {
            justify-content: center;
          }
          .footer-info p {
            margin: 20px auto;
          }
        }
      `}} />
    </footer>
  );
};

export default Footer;
