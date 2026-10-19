import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import photos from '../../assets/photos';
import logo from '../../assets/logos/costa_legal_wt.png';
import Icon from '../../components/Icon/Icon';
import ContactSection from '../../components/ContactSection/ContactSection';
import { ConsultationButtons, PageHero, SectionHeading } from '../../components/Sections/Sections';
import { SERVICES } from '../../routes';

const Home = () => {
  const { t } = useTranslation('global');
  const list = (key) => t(key, { returnObjects: true });

  return (
    <>
      <PageHero size="home" photo={photos.home} eyebrow={t('home.hero.eyebrow')} title={t('home.hero.title')}
        intro={t('home.hero.subtitle')} imageAlt={t('home.hero.imageAlt')}>
        <ConsultationButtons />
      </PageHero>

      <section className="trust" aria-label={t('home.hero.eyebrow')}>
        <ul className="container trust__grid">
          {list('home.trust').map((item) => (
            <li key={item.title} className="trust__item">
              <span className="icon-badge icon-badge--sm"><Icon name={item.icon} size={20} /></span>
              <div>
                <p className="trust__title">{item.title}</p>
                <p className="trust__text">{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow={t('home.services.eyebrow')} title={t('home.services.title')} intro={t('home.services.intro')} align="center" />
          <ul className="feature-grid feature-grid--4">
            {SERVICES.map((page) => (
              <li key={page.key} className="card service-card">
                <span className="icon-badge"><Icon name={page.icon} size={26} /></span>
                <h3 className="service-card__title">
                  <Link to={page.path} className="stretched-link">{t(`nav.${page.key}`)}</Link>
                </h3>
                <p>{t(`home.services.items.${page.key}`)}</p>
                <span className="link-arrow" aria-hidden="true">{t('common.learnMore')} <Icon name="arrowRight" size={16} /></span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--sand">
        <div className="container about">
          <div className="about__panel">
            <img src={logo} alt="Costa Legal" width="220" height="92" loading="lazy" />
            <span className="about__rule" aria-hidden="true"></span>
            <ul className="about__facts">
              <li><Icon name="language" size={20} /> <span>{t('home.about.panel.languages')}</span></li>
              <li><Icon name="place" size={20} /> <span>{t('home.about.panel.office')}</span></li>
              <li><Icon name="gavel" size={20} /> <span>{t('home.about.panel.practice')}</span></li>
            </ul>
          </div>
          <div className="about__body">
            <SectionHeading eyebrow={t('home.about.eyebrow')} title={t('home.about.title')} />
            {list('home.about.paragraphs').map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <ul className="check-list">
              {list('home.about.points').map((point) => (
                <li key={point}><Icon name="check" size={20} /> {point}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow={t('home.process.eyebrow')} title={t('home.process.title')} align="center" />
          <ol className="steps">
            {list('home.process.steps').map((step, idx) => (
              <li key={step.title} className="steps__item">
                <span className="steps__number" aria-hidden="true">{idx + 1}</span>
                <h3 className="steps__title">{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--navy">
        <div className="container faq">
          <SectionHeading eyebrow={t('home.faq.eyebrow')} title={t('home.faq.title')} />
          <div className="faq__list">
            {list('home.faq.items').map((item) => (
              <details key={item.q} className="faq__item">
                <summary>
                  <span>{item.q}</span>
                  <Icon name="expand" size={24} className="faq__chevron" />
                </summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />
    </>
  );
};

export default Home;
