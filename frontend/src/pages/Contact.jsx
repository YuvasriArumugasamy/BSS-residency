import React, { useState } from 'react';
import { MapPin, Phone, Mail, Shield, Clock, Users, Send } from 'lucide-react';
import Reveal from '../components/Reveal';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSent(false), 4000);
    }, 1500);
  };

  return (
    <div className="contact-page page-transition">
      <div className="page-banner">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you. Get in touch with us.</p>
      </div>

      <section className="contact-section section-padding">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Form - slide from left */}
            <Reveal animation="slide-left">
              <div className="contact-form-wrap">
                <h2 className="form-title">Send us a Message</h2>
                <p className="form-subtitle">Fill out the form below and we'll get back to you shortly.</p>
                {sent && <div className="success-msg">✅ Message sent successfully! We'll contact you soon.</div>}
                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Your Name</label>
                      <input type="text" placeholder="Enter your name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input type="email" placeholder="Enter your email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Subject</label>
                    <input type="text" placeholder="How can we help?" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Message</label>
                    <textarea rows="5" placeholder="Tell us how we can help you..." value={form.message} onChange={e => setForm({...form, message: e.target.value})} required></textarea>
                  </div>
                  <button type="submit" className="btn-gold submit-btn" disabled={sending}>
                    <Send size={16} /> {sending ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </Reveal>

            {/* Contact Info - slide from right */}
            <Reveal animation="slide-right" delay={150}>
              <div className="contact-info-wrap">
                <div className="info-card">
                  <h3>Contact Information</h3>
                  <div className="info-items">
                    <div className="info-item">
                      <div className="info-icon"><Phone size={18} /></div>
                      <div>
                        <h4>Phone</h4>
                        <p><a href="tel:9443710420">9443710420</a></p>
                        <p><a href="tel:9003549849">9003549849</a></p>
                      </div>
                    </div>
                    <div className="info-item">
                      <div className="info-icon"><Mail size={18} /></div>
                      <div>
                        <h4>Email</h4>
                        <p>info@smgoldenresorts.com</p>
                      </div>
                    </div>
                    <div className="info-item">
                      <div className="info-icon"><MapPin size={18} /></div>
                      <div>
                        <h4>Address</h4>
                        <p>Old Falls Main Road, Courtallam, Tamil Nadu</p>
                      </div>
                    </div>
                  </div>
                  <div className="info-badges">
                    <span><Shield size={14} /> Secure communication</span>
                    <span><Clock size={14} /> 24h response time</span>
                    <span><Users size={14} /> Dedicated support</span>
                  </div>
                </div>
                <div className="contact-map">
                  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15764.55280016024!2d77.2699!3d8.9317!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOMKwNTUnNTQuMSJOIDc3wrAxNicxMS42IkU!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin" width="100%" height="200" style={{ border: 0, borderRadius: '8px' }} allowFullScreen="" loading="lazy"></iframe>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .contact-page { padding-top: 64px; }
        .contact-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 40px; align-items: start; }
        .form-title { font-size: 1.6rem; color: var(--navy); margin-bottom: 8px; font-weight: 500; }
        .form-subtitle { color: var(--text-body); margin-bottom: 24px; font-size: 0.95rem; }
        .success-msg { background: #ecfdf5; color: #065f46; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; font-weight: 500; font-size: 0.9rem; border: 1px solid #a7f3d0; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; font-weight: 600; font-size: 0.85rem; color: var(--text-dark); margin-bottom: 6px; }
        .form-group input, .form-group textarea { width: 100%; padding: 12px 16px; border: 1px solid var(--border-light); border-radius: 8px; font-size: 0.9rem; color: var(--text-dark); background: var(--white); transition: var(--transition); outline: none; }
        .form-group input:focus, .form-group textarea:focus { border-color: var(--blue-accent); box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
        .form-group textarea { resize: vertical; }
        .submit-btn { width: 100%; justify-content: center; margin-top: 4px; }
        .info-card { background: var(--white); border-radius: 12px; padding: 28px; box-shadow: var(--shadow-card); margin-bottom: 20px; }
        .info-card h3 { font-family: var(--font-body); font-size: 1.15rem; font-weight: 700; color: var(--text-dark); margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid var(--border-light); }
        .info-items { display: flex; flex-direction: column; gap: 18px; }
        .info-item { display: flex; gap: 14px; align-items: flex-start; }
        .info-icon { width: 40px; height: 40px; border-radius: 50%; background: rgba(37,99,235,0.08); display: flex; align-items: center; justify-content: center; color: var(--blue-accent); flex-shrink: 0; }
        .info-item h4 { font-family: var(--font-body); font-size: 0.9rem; font-weight: 700; color: var(--text-dark); margin-bottom: 2px; }
        .info-item p { font-size: 0.85rem; color: var(--text-body); margin: 0; }
        .info-item a { color: var(--text-body); text-decoration: none; }
        .info-item a:hover { color: var(--blue-accent); }
        .info-badges { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border-light); }
        .info-badges span { display: inline-flex; align-items: center; gap: 4px; font-size: 0.78rem; color: var(--text-muted); }
        .contact-map { border-radius: 12px; overflow: hidden; box-shadow: var(--shadow-card); }
        @media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr; } .form-row { grid-template-columns: 1fr; } }
      `}} />
    </div>
  );
};

export default Contact;
