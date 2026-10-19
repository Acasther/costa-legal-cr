import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import photos from '../../assets/photos';
import insLogo from '../../assets/logos/ins_white.png';
import Icon from '../../components/Icon/Icon';
import { ConsultationButtons, CtaBand, FeatureGrid, IntroColumns, PageHero, SectionHeading } from '../../components/Sections/Sections';

const Insurance = () => {
  const { t } = useTranslation('global');
  const list = (key) => t(key, { returnObjects: true });

  return (
    <>
      <PageHero photo={photos.insurance} eyebrow={t('insurance.hero.eyebrow')} title={t('insurance.hero.title')}
        intro={t('insurance.hero.intro')} imageAlt={t('insurance.hero.imageAlt')}>
        <ConsultationButtons />
      </PageHero>

      <section className="partner-band">
        <div className="container partner-band__inner">
          <img src={insLogo} alt={t('insurance.partner.logoAlt')} width="160" height="30" loading="lazy" />
          <div>
            <h2 className="partner-band__title">{t('insurance.partner.title')}</h2>
            <p>{t('insurance.partner.text')}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <IntroColumns title={t('insurance.intro.title')} paragraphs={list('insurance.intro.paragraphs')} />
        </div>
      </section>

      <section className="section section--ivory">
        <div className="container">
          <SectionHeading eyebrow={t('insurance.types.eyebrow')} title={t('insurance.types.title')} />
          <FeatureGrid items={list('insurance.types.items')} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="card highlight-card">
            <span className="icon-badge icon-badge--lg"><Icon name="gavel" size={32} /></span>
            <div>
              <p className="eyebrow">{t('insurance.disputes.eyebrow')}</p>
              <h2 className="highlight-card__title">{t('insurance.disputes.title')}</h2>
              <p>{t('insurance.disputes.text')}</p>
              <Link to="/contact" className="btn btn--navy">{t('common.bookConsultation')}</Link>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
};

export default Insurance;
