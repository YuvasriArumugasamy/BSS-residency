import React from 'react';
import { waLink } from '../constants';
import './FloatingContact.css';

export default function FloatingContact() {
  return (
    <div className="floating-contact">
      <a
        href={waLink('Hello BSS Residency! I would like to make a booking.')}
        target="_blank"
        rel="noreferrer"
        className="float-btn float-wa"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <i className="fa-brands fa-whatsapp"></i>
      </a>
    </div>
  );
}
