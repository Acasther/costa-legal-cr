// Single source of truth for pages: used by the router, the navigation, the pre-render script and the sitemap.
export const SITE_URL = 'https://costalegalcr.com';

export const PAGES = [
  { key: 'home', path: '/', file: 'index.html', photo: 'home' },
  { key: 'immigration', path: '/immigration', file: 'immigration.html', photo: 'immigration', nav: true, icon: 'immigration' },
  { key: 'realEstate', path: '/real-estate', file: 'real-estate.html', photo: 'realEstate', nav: true, icon: 'realEstate' },
  { key: 'business', path: '/business', file: 'business.html', photo: 'business', nav: true, icon: 'business' },
  { key: 'insurance', path: '/insurance', file: 'insurance.html', photo: 'insurance', nav: true, icon: 'insurance' },
  { key: 'contact', path: '/contact', file: 'contact.html', photo: 'contact' },
];

export const NOT_FOUND = { key: 'notFound', path: '/404', file: '404.html' };

export const SERVICES = PAGES.filter((page) => page.nav);

export const pageForPath = (pathname) => {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  return PAGES.find((page) => page.path === path) ?? NOT_FOUND;
};
