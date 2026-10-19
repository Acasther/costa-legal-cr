import { useTranslation } from 'react-i18next';
import ContactForm from '../ContactForm/ContactForm';
import Icon from '../Icon/Icon';
import { EMAIL_ADDRESS, PHONE_NUMBER, PERSONAL_PHONE_NUMBER, MAPS_LINK, MAPS_EMBED } from '../../utils/constants';
import { whatsappLink } from '../../utils/commonFuncs';

const ContactSection = ({ id = 'contact' }) => {
  const { t } = useTranslation('global');

  return (
    <section id={id} className="section section--ivory contact-section">
      <div className="container contact-section__grid">
        <div className="card contact-section__form">
          <ContactForm />
        </div>

        <div className="contact-section__info">
          <h2 className="contact-section__title">{t('contact.details.title')}</h2>
          <ul className="contact-list">
            <li>
              <span className="icon-badge icon-badge--sm"><Icon name="whatsapp" size={20} /></span>
              <div>
                <p className="contact-list__label">{t('contact.details.whatsapp')}</p>
                {[PHONE_NUMBER, PERSONAL_PHONE_NUMBER].map((phone) => (
                  <a key={phone} href={whatsappLink(phone)} target="_blank" rel="noopener noreferrer">{phone}</a>
                ))}
              </div>
            </li>
            <li>
              <span className="icon-badge icon-badge--sm"><Icon name="mail" size={20} /></span>
              <div>
                <p className="contact-list__label">{t('contact.details.email')}</p>
                <a href={`mailto:${EMAIL_ADDRESS}`}>{EMAIL_ADDRESS}</a>
              </div>
            </li>
            <li>
              <span className="icon-badge icon-badge--sm"><Icon name="place" size={20} /></span>
              <div>
                <p className="contact-list__label">{t('contact.details.office')}</p>
                <p>{t('contact.details.address')}</p>
                <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="link-arrow">
                  {t('contact.details.directions')} <Icon name="arrowRight" size={16} />
                </a>
              </div>
            </li>
          </ul>
          <div className="map-frame">
            <iframe src={MAPS_EMBED} title={t('contact.mapTitle')} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
