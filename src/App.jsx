import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import WhatsAppButton from './components/WhatsAppButton/WhatsAppButton';
import Home from './pages/Home/Home';
import Immigration from './pages/Immigration/Immigration';
import RealEstate from './pages/RealEstate/RealEstate';
import Business from './pages/Business/Business';
import Insurance from './pages/Insurance/Insurance';
import Contact from './pages/Contact/Contact';
import NotFound from './pages/NotFound/NotFound';
import { ScrollToTop } from './utils/commonFuncs';
import { pageForPath } from './routes';
import { preferredLanguage } from './i18n';

// Keeps the document title, description and language in sync after client-side navigation.
const DocumentMeta = () => {
  const { t, i18n } = useTranslation('global');
  const { pathname } = useLocation();

  useEffect(() => {
    const page = pageForPath(pathname);
    document.title = t(`meta.${page.key}.title`);
    document.querySelector('meta[name="description"]')?.setAttribute('content', t(`meta.${page.key}.description`));
    document.documentElement.lang = i18n.language;
  }, [pathname, t, i18n.language]);

  return null;
};

const App = () => {
  const { i18n } = useTranslation('global');

  useEffect(() => {
    const lang = preferredLanguage();
    if (lang !== i18n.language) i18n.changeLanguage(lang);
  }, [i18n]);

  return (
    <>
      <ScrollToTop />
      <DocumentMeta />
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/immigration" element={<Immigration />} />
          <Route path="/real-estate" element={<RealEstate />} />
          <Route path="/business" element={<Business />} />
          <Route path="/insurance" element={<Insurance />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default App;
