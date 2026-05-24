import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogIn } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/rooms', label: 'Rooms' },
    { path: '/about', label: 'About Us' },
    { path: '/contact', label: 'Contact' },
    { path: '/book', label: 'Book Now', highlight: true },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <img src="/assets/logo.jpg" alt="SM Golden Resorts" className="nav-logo-img" />
          <span className="nav-brand-text">SM Golden Resorts</span>
        </Link>

        <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <button className="nav-close-btn" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} />
          </button>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${isActive(link.path) ? 'active' : ''} ${link.highlight ? 'nav-link-cta' : ''}`}
            >
              {link.label}
            </Link>
          ))}
          
        </div>

        <div className="nav-right">
          <button className="nav-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <Menu size={24} />
          </button>
        </div>
      
      </div>

      {isMobileMenuOpen && <div className="nav-overlay" onClick={() => setIsMobileMenuOpen(false)} />}

      <style dangerouslySetInnerHTML={{ __html: `
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          background: var(--bg-navbar);
          transition: var(--transition);
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        .navbar.scrolled {
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
        }
        .nav-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        .nav-logo-img {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(255,255,255,0.2);
        }
        .nav-brand-text {
          font-family: var(--font-body);
          font-weight: 700;
          font-size: 1.15rem;
          color: var(--white);
          letter-spacing: 0.5px;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .nav-link {
          color: var(--text-nav);
          font-weight: 500;
          font-size: 0.9rem;
          padding: 8px 16px;
          border-radius: 6px;
          transition: var(--transition);
          text-decoration: none;
        }
        .nav-link:hover,
        .nav-link.active {
          color: var(--white);
          text-decoration: underline;
          text-underline-offset: 4px;
        }
        .nav-link-cta {
          background: var(--gold-accent) !important;
          color: var(--navy) !important;
          font-weight: 700 !important;
          padding: 8px 20px !important;
          border-radius: 50px !important;
          text-decoration: none !important;
          letter-spacing: 0.3px;
          transition: var(--transition) !important;
        }
        .nav-link-cta:hover {
          background: #b8893a !important;
          color: var(--white) !important;
          text-decoration: none !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(200,155,60,0.4);
        }
        .nav-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .nav-toggle {
          display: none;
          background: none;
          border: none;
          color: var(--white);
          cursor: pointer;
          padding: 4px;
        }
        .nav-close-btn {
          display: none;
        }
        .nav-overlay {
          display: none;
        }
        
        @media (max-width: 768px) {
          .nav-links {
            position: fixed;
            top: 0;
            right: -100%;
            width: 280px;
            height: 100vh;
            background: var(--navy-dark);
            flex-direction: column;
            align-items: flex-start;
            padding: 70px 24px 24px;
            gap: 4px;
            transition: 0.3s ease;
            z-index: 1001;
            box-shadow: -5px 0 20px rgba(0,0,0,0.3);
          }
          .nav-links.active {
            right: 0;
          }
          .nav-link {
            width: 100%;
            padding: 12px 16px;
            font-size: 1rem;
          }
          .nav-close-btn {
            display: block;
            position: absolute;
            top: 16px;
            right: 16px;
            background: none;
            border: none;
            color: var(--white);
            cursor: pointer;
          }
          .nav-toggle {
            display: block;
          }
          .nav-login {
            display: none;
          }
          .nav-login-mobile {
            display: flex;
            align-items: center;
            gap: 6px;
            color: var(--text-nav);
            font-weight: 500;
            padding: 12px 16px;
            margin-top: 16px;
            border-top: 1px solid rgba(255,255,255,0.1);
            width: 100%;
            text-decoration: none;
          }
          .nav-overlay {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.5);
            z-index: 1000;
          }
        }
      `}} />
    </nav>
  );
};

export default Navbar;
