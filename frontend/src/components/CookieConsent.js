import React from 'react';
import './CookieConsent.css';

export default function CookieConsent() {
  const [visible, setVisible] = React.useState(() => {
    return !localStorage.getItem('cookieConsent');
  });

  const accept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setVisible(false);
  };

  const decline = () => {
    // You could implement a different behavior, for now just hide
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-consent-banner">
      <p>We use cookies to improve your experience. By continuing you accept our cookie policy.</p>
      <div className="cookie-consent-actions">
        <button className="btn-accept" onClick={accept}>Accept</button>
        <button className="btn-decline" onClick={decline}>Decline</button>
      </div>
    </div>
  );
}
