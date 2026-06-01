// src/seo/schema.js
// JSON‑LD schema markup for BSS Residency (Hotel) and FAQPage.
// This object will be injected via the <SEO> component.

const schemaMarkup = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Hotel",
      "@id": "https://www.bssresidency.com/#hotel",
      "name": "BSS Residency Courtallam",
      "description": "Best budget hotel in Courtallam near Main Falls. AC and Non‑AC rooms, free parking, 24/7 service.",
      "url": "https://www.bssresidency.com",
      "telephone": "+91-88385-99755",
      "priceRange": "₹1,000 - ₹2,300",
      "currenciesAccepted": "INR",
      "paymentAccepted": "Cash, UPI, Credit Card, Debit Card",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Bus Stand, Near Anna Statue",
        "addressLocality": "Courtallam",
        "addressRegion": "Tamil Nadu",
        "postalCode": "627802",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 8.9307,
        "longitude": 77.2780
      },
      "starRating": { "@type": "Rating", "ratingValue": "4.6" },
      "amenityFeature": [
        { "@type": "LocationFeatureSpecification", "name": "Free Parking", "value": true },
        { "@type": "LocationFeatureSpecification", "name": "24‑hour Front Desk", "value": true },
        { "@type": "LocationFeatureSpecification", "name": "Air Conditioning", "value": true },
        { "@type": "LocationFeatureSpecification", "name": "Free WiFi", "value": true },
        { "@type": "LocationFeatureSpecification", "name": "Hot Water", "value": true }
      ],
      "checkinTime": "12:00",
      "checkoutTime": "11:00"
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What are the room rates at BSS Residency Courtallam?",
          "acceptedAnswer": { "@type": "Answer", "text": "Double Bed Non‑AC: ₹1,000/night, Double Bed A/C: ₹1,300/night, Three Bed Non‑AC: ₹1,500/night, Four Bed A/C: ₹2,300/night." }
        },
        {
          "@type": "Question",
          "name": "How far is BSS Residency from Courtallam Main Falls?",
          "acceptedAnswer": { "@type": "Answer", "text": "BSS Residency is just 500 m (5 minutes walk) from the Main Falls." }
        },
        {
          "@type": "Question",
          "name": "Is parking available?",
          "acceptedAnswer": { "@type": "Answer", "text": "Yes, free parking is available for all guests." }
        }
      ]
    }
  ]
};

export default schemaMarkup;
