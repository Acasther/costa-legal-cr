import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource-variable/inter/index.css';
import '@fontsource-variable/lora/index.css';
import './styles/global.css';
import './i18n';
import App from './App.jsx';

// Old links used hash URLs (/#/immigration): move them to the real path before rendering.
const legacyHash = window.location.hash.startsWith('#/');
if (legacyHash) {
  window.history.replaceState(null, '', window.location.hash.slice(1) || '/');
}

const root = document.getElementById('root')!;
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Pre-rendered pages are hydrated; a redirected legacy URL is rendered fresh because its HTML is the home page.
if (root.hasChildNodes() && !legacyHash) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
