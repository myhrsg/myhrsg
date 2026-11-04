import { Helmet } from "react-helmet-async";

const SITE_NAME = "myHRSG";
const BASE_URL = "https://www.myhrsg.org";
const DEFAULT_OG_IMAGE = `${BASE_URL}/logo-myHRSG.jpeg`;

/**
 * SEOHead — Reusable component for per-page SEO meta tags.
 *
 * @param {string} title — Page title (max 60 chars recommended)
 * @param {string} description — Meta description (max 155 chars recommended)
 * @param {string} path — Route path, e.g. "/membership"
 * @param {string} [ogImage] — Open Graph image URL (defaults to site logo)
 * @param {string} [ogType] — Open Graph type (defaults to "website")
 * @param {object} [structuredData] — Optional JSON-LD structured data object
 */
const SEOHead = ({
  title,
  description,
  path = "/",
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  structuredData = null,
}) => {
  const canonicalUrl = `${BASE_URL}${path}`;
  const fullTitle = path === "/" ? title : `${title} | ${SITE_NAME}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="myHRSG" />
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="Pune, India" />

      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
