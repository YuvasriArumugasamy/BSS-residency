import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container nav-content">
        <Link to="/" className="logo nav-logo-container">
          <img src="/assets/logo.jpg" alt="SM Golden Resorts Logo" className="nav-logo" />
          <span className="logo-text"><span className="gold-text">SM</span> GOLDEN <span className="gold-text">RESORTS</span></span>
        </Link>

        <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <a href="/#about" onClick={() => setIsMobileMenuOpen(false)}>About</a>
          <a href="/#rooms" onClick={() => setIsMobileMenuOpen(false)}>Rooms</a>
          <a href="/#amenities" onClick={() => setIsMobileMenuOpen(false)}>Amenities</a>
          <a href="/#contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</a>
          <button className="btn-primary mobile-book-btn" onClick={() => { navigate('/book'); setIsMobileMenuOpen(false); }}>
            Book Now
          </button>
        </div>

        <div className="nav-actions">
          <a href="tel:9443710420" className="phone-link">
            <Phone size={18} /> <span>9443710420</span>
          </a>
          <button className="btn-primary desktop-book-btn" onClick={() => navigate('/book')}>
            Book Now
          </button>
          <button className="menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          padding: 20px 0;
          z-index: 1000;
          transition: var(--transition);
          background: transparent;
        }
        .navbar.scrolled {
          background: rgba(0, 0, 0, 0.95);
          padding: 15px 0;
          border-bottom: 1px solid var(--gold);
        }
        .nav-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .nav-logo-container {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }
        .nav-logo {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          border: 2px solid var(--gold);
          object-fit: cover;
          box-shadow: 0 0 10px rgba(201, 168, 76, 0.3);
        }
        .logo-text {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1.5rem;
          color: var(--white);
          letter-spacing: 2px;
        }
        .nav-links {
          display: flex;
          gap: 30px;
          align-items: center;
        }
        .nav-links a {
          font-weight: 500;
          text-transform: uppercase;
          font-size: 0.9rem;
          letter-spacing: 1px;
        }
        .nav-links a:hover {
          color: var(--gold);
        }
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .phone-link {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--gold);
          font-weight: 600;
        }
        .menu-toggle {
          display: none;
          background: transparent;
          color: var(--gold);
        }
        .mobile-book-btn {
          display: none;
        }

        @media (max-width: 992px) {
          .nav-links {
            position: fixed;
            top: 0;
            right: -100%;
            height: 100vh;
            width: 70%;
            background: var(--black);
            flex-direction: column;
            justify-content: center;
            transition: 0.4s ease-in-out;
            border-left: 1px solid var(--gold);
          }
          .nav-links.active {
            right: 0;
          }
          .menu-toggle {
            display: block;
          }
          .desktop-book-btn, .phone-link span {
            display: none;
          }
          .mobile-book-btn {
            display: block;
            margin-top: 20px;
          }
        }
      `}} />
    </nav>
  );
};

export default Navbar;
