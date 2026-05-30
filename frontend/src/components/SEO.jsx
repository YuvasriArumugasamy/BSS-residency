import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEO component to inject metadata into the document head.
 * Props:
 * - title: Page title
 * - description: Meta description
 * - keywords: Comma‑separated keyword list
 * - schemaMarkup: JSON‑LD object (optional) – will be rendered via a script tag.
 */
const SEO = ({ title, description, keywords, schemaMarkup }) => (
  <Helmet>
    {title && <title>{title}</title>}
    {description && <meta name="description" content={description} />}
    {keywords && <meta name="keywords" content={keywords} />}
    {/* Open Graph */}
    {title && <meta property="og:title" content={title} />}
    {description && <meta property="og:description" content={description} />}
    <meta property="og:type" content="website" />
    <meta property="og:url" content={window.location.href} />
    {/* Twitter */}
    <meta name="twitter:card" content="summary_large_image" />
    {title && <meta name="twitter:title" content={title} />}
    {description && <meta name="twitter:description" content={description} />}
    {/* JSON‑LD schema – only rendered if provided */}
    {schemaMarkup && (
      <script type="application/ld+json">
        {JSON.stringify(schemaMarkup)}
      </script>
    )}
  </Helmet>
);

export default SEO;
