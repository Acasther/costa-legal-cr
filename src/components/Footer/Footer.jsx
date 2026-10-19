import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo from '../../assets/logos/costa_legal_wt.png';
import Icon from '../Icon/Icon';
import { SERVICES } from '../../routes';
import { EMAIL_ADDRESS, PHONE_NUMBER, PERSONAL_PHONE_NUMBER, MAPS_LINK, SOCIAL_LINKS } from '../../utils/constants';
import { whatsappLink } from '../../utils/commonFuncs';

const Footer = () => {
  const { t } = useTranslation('global');
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <img src={logo} alt="Costa Legal" width="168" height="70" loading="lazy" />
          <p>{t('footer.tagline')}</p>
        </div>

        <div>
          <h2 className="site-footer__heading">{t('footer.services')}</h2>
          <ul className="site-footer__list">
            {SERVICES.map((page) => (
              <li key={page.key}><Link to={page.path}>{t(`nav.${page.key}`)}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="site-footer__heading">{t('footer.contact')}</h2>
          <ul className="site-footer__list site-footer__list--icons">
            {[PHONE_NUMBER, PERSONAL_PHONE_NUMBER].map((phone) => (
              <li key={phone}>
                <a href={whatsappLink(phone)} target="_blank" rel="noopener noreferrer">
                  <Icon name="whatsapp" size={18} /> {phone}
                </a>
              </li>
            ))}
            <li><a href={`mailto:${EMAIL_ADDRESS}`}><Icon name="mail" size={18} /> {EMAIL_ADDRESS}</a></li>
            <li>
              <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer">
                <Icon name="place" size={18} /> <span>{t('contact.details.address')}</span>
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="site-footer__heading">{t('footer.follow')}</h2>
          <div className="site-footer__social">
            <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Icon name="instagram" size={22} />
            </a>
            <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Icon name="facebook" size={22} />
            </a>
          </div>
        </div>
      </div>
      <div className="container site-footer__bottom">
        <p>© {year} Costa Legal. {t('footer.rights')}</p>
      </div>
    </footer>
  );
};

export default Footer;
