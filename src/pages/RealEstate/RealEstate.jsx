import { useTranslation } from 'react-i18next';
import photos from '../../assets/photos';
import { ConsultationButtons, CtaBand, FeatureGrid, IntroColumns, PageHero, SectionHeading } from '../../components/Sections/Sections';

// Shared layout for the Real Estate and Business pages: hero, intro, services grid, call to action.
export const PracticePage = ({ section }) => {
  const { t } = useTranslation('global');
  const list = (key) => t(key, { returnObjects: true });

  return (
    <>
      <PageHero photo={photos[section]} eyebrow={t(`${section}.hero.eyebrow`)} title={t(`${section}.hero.title`)}
        intro={t(`${section}.hero.intro`)} imageAlt={t(`${section}.hero.imageAlt`)}>
        <ConsultationButtons />
      </PageHero>

      <section className="section">
        <div className="container">
          <IntroColumns title={t(`${section}.intro.title`)} paragraphs={list(`${section}.intro.paragraphs`)} />
        </div>
      </section>

      <section className="section section--ivory">
        <div className="container">
          <SectionHeading eyebrow={t(`${section}.services.eyebrow`)} title={t(`${section}.services.title`)} />
          <FeatureGrid items={list(`${section}.services.items`)} />
        </div>
      </section>

      <CtaBand />
    </>
  );
};

const RealEstate = () => <PracticePage section="realEstate" />;

export default RealEstate;
