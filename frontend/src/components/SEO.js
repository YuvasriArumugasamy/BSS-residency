import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SEO = ({
  title = "BSS Residency Courtallam | Best Hotel Near Waterfalls | Book Now",
  description = "BSS Residency — Best hotel near Courtallam waterfalls. Book A/C & Non-A/C rooms for families at affordable rates. Courtallam lodging near Main Falls & Bus Stand.",
  keywords = "bss residency, courtallam hotel, courtallam rooms for rent, hotel near courtallam waterfalls, kutralam lodging, family hotel courtallam, best lodge courtallam, courtallam lodge, rooms in courtallam, best lodge near waterfalls, courtallam hotels, premium rooms courtallam, tenkasi lodge, bss residency courtallam, kutralam rooms, kutralam lodge, courtallam stay, best hotels in courtallam, cheap rooms in courtallam, ac lodge in tenkasi, family lodge near main falls courtallam, five falls courtallam rooms, online room booking courtallam, budget rooms in kutralam, courtallam waterfalls stay, tenkasi room booking, courtallam guest house, tourist stay in courtallam, kutralam resorts, courtallam tourism stay",
  image = "https://www.bssresidency.com/logo.webp",
  schemaMarkup = null,
}) => {
  const location = useLocation();
  const currentUrl = `https://www.bssresidency.com${location.pathname}`;
  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "name": "BSS Residency",
    "url": currentUrl,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Near Main Falls, Courtallam",
      "addressLocality": "Courtallam",
      "addressRegion": "Tamil Nadu",
      "postalCode": "627807",
      "addressCountry": "IN"
    },
    "telephone": "+91 88385 99755",
    "priceRange": "₹500-₹5000"
  };

  const finalSchema = schemaMarkup || defaultSchema;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Canonical */}
      <link rel="canonical" href={currentUrl} />

      {/* Structured Data */}
      {finalSchema && (
        <script type="application/ld+json">
          {JSON.stringify(finalSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
