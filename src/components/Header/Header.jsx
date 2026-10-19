import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo from '../../assets/logos/costa_legal_wt.png';
import Icon from '../Icon/Icon';
import { SERVICES } from '../../routes';
import { rememberLanguage } from '../../i18n';

const Header = () => {
  const { t, i18n } = useTranslation('global');
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const nextLang = i18n.language === 'es' ? 'en' : 'es';

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    if (!menuOpen) return undefined;
    const onKey = (event) => event.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const switchLanguage = () => {
    i18n.changeLanguage(nextLang);
    rememberLanguage(nextLang);
  };

  const links = [...SERVICES, { key: 'contact', path: '/contact' }];

  return (
    <header className="site-header">
      <a className="skip-link" href="#main">{t('nav.skip')}</a>
      <div className="container site-header__inner">
        <Link to="/" className="site-header__logo" aria-label={t('nav.logo')}>
          <img src={logo} alt="" width="144" height="60" />
        </Link>

        <nav className="site-nav" aria-label="Main">
          <ul className="site-nav__list">
            {links.map((page) => (
              <li key={page.key}>
                <NavLink to={page.path} className="site-nav__link">{t(`nav.${page.key}`)}</NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header__actions">
          <button type="button" className="lang-toggle" onClick={switchLanguage} aria-label={t('nav.switchLanguage')} lang={nextLang}>
            <Icon name="language" size={18} />
            <span>{nextLang.toUpperCase()}</span>
          </button>
          <Link to="/contact" className="btn btn--gold btn--sm site-header__cta">{t('nav.cta')}</Link>
          <button type="button" className="menu-toggle" onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}>
            <Icon name={menuOpen ? 'close' : 'menu'} size={28} />
          </button>
        </div>
      </div>

      <div id="mobile-menu" className={`mobile-menu${menuOpen ? ' is-open' : ''}`} hidden={!menuOpen}>
        <nav className="container" aria-label="Mobile">
          <ul className="mobile-menu__list">
            <li><NavLink to="/" end className="mobile-menu__link">{t('nav.home')}</NavLink></li>
            {links.map((page) => (
              <li key={page.key}>
                <NavLink to={page.path} className="mobile-menu__link">{t(`nav.${page.key}`)}</NavLink>
              </li>
            ))}
          </ul>
          <Link to="/contact" className="btn btn--gold btn--block">{t('common.bookConsultation')}</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
