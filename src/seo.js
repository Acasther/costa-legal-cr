import { SITE_URL, NOT_FOUND } from './routes';
import { EMAIL_ADDRESS, PHONE_NUMBER, SOCIAL_LINKS } from './utils/constants';

const escapeAttr = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const canonicalUrl = (page) => (page.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${page.path}`);

const legalServiceSchema = (description) => ({
  '@context': 'https://schema.org',
  '@type': 'LegalService',
  name: 'Costa Legal',
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/logo512.png`,
  image: `${SITE_URL}/og-image.jpg`,
  description,
  telephone: PHONE_NUMBER.replace(/[^\d+]/g, ''),
  email: EMAIL_ADDRESS,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Edificio Monterrico, Trejos Montealegre',
    addressLocality: 'Escazú',
    addressRegion: 'San José',
    addressCountry: 'CR',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 9.9355164, longitude: -84.1330552 },
  areaServed: 'CR',
  availableLanguage: ['English', 'Spanish'],
  knowsAbout: ['Immigration law', 'Residency', 'Real estate law', 'Corporate law', 'Insurance'],
  sameAs: Object.values(SOCIAL_LINKS),
});

// Head tags injected into each pre-rendered HTML file.
export const buildHead = (t, page, preload) => {
  const title = t(`meta.${page.key}.title`);
  const description = t(`meta.${page.key}.description`);
  const tags = [
    `<title>${escapeAttr(title)}</title>`,
    `<meta name="description" content="${escapeAttr(description)}" />`,
  ];

  if (page.key === NOT_FOUND.key) {
    tags.push('<meta name="robots" content="noindex" />');
  } else {
    const url = canonicalUrl(page);
    tags.push(
      `<link rel="canonical" href="${url}" />`,
      '<meta property="og:type" content="website" />',
      '<meta property="og:site_name" content="Costa Legal" />',
      '<meta property="og:locale" content="en_US" />',
      '<meta property="og:locale:alternate" content="es_CR" />',
      `<meta property="og:url" content="${url}" />`,
      `<meta property="og:title" content="${escapeAttr(title)}" />`,
      `<meta property="og:description" content="${escapeAttr(description)}" />`,
      `<meta property="og:image" content="${SITE_URL}/og-image.jpg" />`,
      '<meta property="og:image:width" content="1200" />',
      '<meta property="og:image:height" content="630" />',
      '<meta name="twitter:card" content="summary_large_image" />',
    );
  }

  if (preload) {
    tags.push(`<link rel="preload" as="image" type="image/webp" imagesrcset="${preload.srcSet}" imagesizes="100vw" fetchpriority="high" />`);
  }

  if (page.key === 'home') {
    const schema = JSON.stringify(legalServiceSchema(description)).replace(/</g, '\\u003c');
    tags.push(`<script type="application/ld+json">${schema}</script>`);
  }

  return tags.join('\n    ');
};
