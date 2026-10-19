import { useTranslation } from 'react-i18next';
import photos from '../../assets/photos';
import Icon from '../../components/Icon/Icon';
import { ConsultationButtons, CtaBand, PageHero, SectionHeading } from '../../components/Sections/Sections';

const Immigration = () => {
  const { t } = useTranslation('global');
  const list = (key) => t(key, { returnObjects: true });
  const categories = list('immigration.categories.items');

  return (
    <>
      <PageHero photo={photos.immigration} eyebrow={t('immigration.hero.eyebrow')} title={t('immigration.hero.title')}
        intro={t('immigration.hero.intro')} imageAlt={t('immigration.hero.imageAlt')}>
        <ConsultationButtons />
      </PageHero>

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow={t('immigration.categories.eyebrow')} title={t('immigration.categories.title')}
            intro={t('immigration.categories.intro')} />
          {/* The three financial categories first, then the family and work categories in a row of four. */}
          {[[0, 3, 3], [3, undefined, 4]].map(([start, end, columns]) => (
            <ul key={start} className={`feature-grid feature-grid--${columns} category-grid`}>
              {categories.slice(start, end).map((item) => (
                <li key={item.title} className="card category-card">
                  <div className="category-card__top">
                    <span className="icon-badge"><Icon name={item.icon} size={26} /></span>
                    {item.label && <span className="chip" lang="es">{item.label}</span>}
                  </div>
                  <h3 className="feature-card__title">{item.title}</h3>
                  {item.figure && <p className="category-card__figure">{item.figure}</p>}
                  <p>{item.text}</p>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </section>

      <section className="section section--ivory">
        <div className="container">
          <SectionHeading eyebrow={t('immigration.timeline.eyebrow')} title={t('immigration.timeline.title')}
            intro={t('immigration.timeline.intro')} />
          <ol className="timeline">
            {list('immigration.timeline.stages').map((stage, idx) => (
              <li key={stage.title} className="timeline__item">
                <span className="timeline__marker" aria-hidden="true">{idx + 1}</span>
                <div className="card timeline__card">
                  <p className="timeline__duration"><Icon name="schedule" size={18} /> {stage.duration}</p>
                  <h3 className="timeline__title">{stage.title}</h3>
                  <p>{stage.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="card note-card">
            <h3 className="note-card__title">{t('immigration.pending.title')}</h3>
            <ul className="bullet-list">
              {list('immigration.pending.items').map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container requirements">
          <div>
            <SectionHeading eyebrow={t('immigration.requirements.eyebrow')} title={t('immigration.requirements.title')}
              intro={t('immigration.requirements.intro')} />
            <ol className="req-list">
              {list('immigration.requirements.items').map((item, idx) => (
                <li key={item.title} className="req-list__item">
                  <span className="req-list__number" aria-hidden="true">{String(idx + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="req-list__title">
                      {item.title}
                      {item.handled && <span className="chip chip--gold"><Icon name="check" size={14} /> {t('common.weHandleIt')}</span>}
                    </h3>
                    <p>{item.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <aside className="card note-card note-card--navy requirements__aside">
            <Icon name="document" size={32} className="note-card__icon" />
            <h3 className="note-card__title">{t('immigration.documents.title')}</h3>
            <ul className="bullet-list">
              {list('immigration.documents.items').map((item) => <li key={item}>{item}</li>)}
            </ul>
          </aside>
        </div>
      </section>

      <CtaBand />
    </>
  );
};

export default Immigration;
