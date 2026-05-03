import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SEO = ({ 
  title = "BSS Residency – Premium Lodge & Rooms in Courtallam", 
  description = "Experience premium comfort at BSS Residency, located near Courtallam Bus Stand and Waterfalls. Book A/C & Non-A/C rooms at the best lodge in Courtallam.", 
  keywords = "bss residency, courtallam lodge, rooms in courtallam, best lodge near waterfalls, courtallam hotels, premium rooms courtallam, tenkasi lodge, bss residency courtallam, kutralam rooms, kutralam lodge, courtallam stay, best hotels in courtallam, cheap rooms in courtallam, ac lodge in tenkasi, family lodge near main falls courtallam, five falls courtallam rooms, online room booking courtallam, budget rooms in kutralam, courtallam waterfalls stay, tenkasi room booking, courtallam guest house, tourist stay in courtallam, kutralam resorts, courtallam tourism stay",
  image = "/logo.png",
  schemaMarkup = null
}) => {
  const location = useLocation();
  const currentUrl = `https://bssresidency.com${location.pathname}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook / WhatsApp */}
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

      {/* Canonical Link */}
      <link rel="canonical" href={currentUrl} />

      {/* Structured Data (Schema.org JSON-LD) */}
      {schemaMarkup && (
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
