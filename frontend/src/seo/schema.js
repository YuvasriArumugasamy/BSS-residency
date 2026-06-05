// src/seo/schema.js
// JSON-LD schema markup for BSS Residency (Hotel) and LocalBusiness.
// This object will be injected via the <SEO> component on the Home page.

const schemaMarkup = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Hotel",
      "@id": "https://www.bssresidency.com/#hotel",
      "name": "BSS Residency Courtallam",
      "description": "Best budget hotel in Courtallam near Main Falls. AC and Non-AC rooms, free parking, 24/7 service.",
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
        { "@type": "LocationFeatureSpecification", "name": "24-hour Front Desk", "value": true },
        { "@type": "LocationFeatureSpecification", "name": "Air Conditioning", "value": true },
        { "@type": "LocationFeatureSpecification", "name": "Free WiFi", "value": true },
        { "@type": "LocationFeatureSpecification", "name": "Hot Water", "value": true },
        { "@type": "LocationFeatureSpecification", "name": "Room Service", "value": true }
      ],
      "checkinTime": "12:00",
      "checkoutTime": "11:00",
      "image": "https://www.bssresidency.com/social_preview.png"
    },
    {
      "@type": "LocalBusiness",
      "@id": "https://www.bssresidency.com/#business",
      "name": "BSS Residency",
      "image": "https://www.bssresidency.com/social_preview.png",
      "telephone": "+91-88385-99755",
      "priceRange": "₹₹",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Bus Stand, Near Anna Statue",
        "addressLocality": "Courtallam",
        "addressRegion": "Tamil Nadu",
        "postalCode": "627802",
        "addressCountry": "IN"
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
        "opens": "00:00",
        "closes": "23:59"
      }
    }
  ]
};

export default schemaMarkup;
