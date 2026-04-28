import React from 'react';
import { waLink, WA_TEMPLATES } from '../constants';
import './FloatingContact.css';

export default function FloatingContact() {
  return (
    <div className="floating-contact">
      <a
        href={WA_TEMPLATES.getWelcome()}
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
