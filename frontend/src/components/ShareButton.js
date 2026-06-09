import React, { useState } from 'react';

/**
 * ShareButton – provides a button that uses the native Web Share API when available.
 * If the API is not supported (desktop browsers), it falls back to copying the URL
 * to the clipboard and briefly shows a toast message.
 */
export default function ShareButton({ title, text, url }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (err) {
        // User cancelled or share failed – fall back to copy
        fallbackCopy();
      }
    } else {
      fallbackCopy();
    }
  };

  const fallbackCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{ display: 'inline-block', position: 'relative' }}>
      <button
        className="share-btn"
        onClick={handleShare}
        aria-label="Share this page"
      >
        📤 Share
      </button>
      {copied && (
        <div className="share-toast" role="alert">
          Link copied to clipboard!
        </div>
      )}
    </div>
  );
}
