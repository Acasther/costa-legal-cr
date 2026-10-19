// Build-time renderer used by scripts/prerender.mjs to produce static HTML for every page.
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import i18n from './i18n';
import App from './App.jsx';
import photos from './assets/photos';
import { buildHead } from './seo';

export { PAGES, NOT_FOUND, SITE_URL } from './routes';
export { canonicalUrl } from './seo';

export const render = (page) => {
  const html = renderToString(
    <StrictMode>
      <StaticRouter location={page.path}>
        <App />
      </StaticRouter>
    </StrictMode>
  );
  const t = i18n.getFixedT('en', 'global');
  const head = buildHead(t, page, page.photo ? photos[page.photo] : null);
  return { html, head };
};
