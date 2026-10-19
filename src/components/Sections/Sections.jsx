import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Icon from '../Icon/Icon';
import { PHONE_NUMBER } from '../../utils/constants';
import { whatsappLink } from '../../utils/commonFuncs';

export const SectionHeading = ({ eyebrow, title, intro, align = 'left', as: Heading = 'h2' }) => (
  <div className={`section-heading section-heading--${align}`}>
    {eyebrow && <p className="eyebrow">{eyebrow}</p>}
    <Heading className="section-heading__title">{title}</Heading>
    {intro && <p className="section-heading__intro">{intro}</p>}
  </div>
);

export const ConsultationButtons = ({ onDark = true }) => {
  const { t } = useTranslation('global');

  return (
    <div className="button-row">
      <Link to="/contact" className="btn btn--gold">{t('common.bookConsultation')}</Link>
      <a className={`btn ${onDark ? 'btn--ghost-light' : 'btn--ghost'}`} href={whatsappLink(PHONE_NUMBER, t('common.whatsappMessage'))}
        target="_blank" rel="noopener noreferrer">
        <Icon name="whatsapp" size={20} /> {t('common.whatsapp')}
      </a>
    </div>
  );
};

export const PageHero = ({ photo, eyebrow, title, intro, imageAlt, size = 'page', children }) => (
  <section className={`hero hero--${size}`}>
    <img className="hero__image" src={photo.src} srcSet={photo.srcSet} sizes="100vw" width={photo.width} height={photo.height}
      alt={imageAlt} fetchPriority="high" decoding="async" />
    <div className="hero__overlay" aria-hidden="true"></div>
    <div className="container hero__content">
      {eyebrow && <p className="eyebrow eyebrow--light">{eyebrow}</p>}
      <h1 className="hero__title">{title}</h1>
      {intro && <p className="hero__intro">{intro}</p>}
      {children}
    </div>
  </section>
);

export const CtaBand = () => {
  const { t } = useTranslation('global');

  return (
    <section className="cta-band">
      <div className="container cta-band__inner">
        <div>
          <h2 className="cta-band__title">{t('cta.title')}</h2>
          <p className="cta-band__text">{t('cta.text')}</p>
        </div>
        <ConsultationButtons />
      </div>
    </section>
  );
};

export const FeatureGrid = ({ items, columns = 3 }) => (
  <ul className={`feature-grid feature-grid--${columns}`}>
    {items.map((item) => (
      <li key={item.title} className="card feature-card">
        <span className="icon-badge"><Icon name={item.icon} size={26} /></span>
        <h3 className="feature-card__title">{item.title}</h3>
        <p>{item.text}</p>
      </li>
    ))}
  </ul>
);

export const IntroColumns = ({ title, paragraphs }) => (
  <div className="intro-columns">
    <h2 className="intro-columns__title">{title}</h2>
    <div className="intro-columns__body">
      {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
    </div>
  </div>
);
