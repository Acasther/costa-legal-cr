import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { t } = useTranslation('global');

  return (
    <section className="section not-found">
      <div className="container not-found__inner">
        <p className="eyebrow">{t('notFound.eyebrow')}</p>
        <h1 className="section-heading__title">{t('notFound.title')}</h1>
        <p>{t('notFound.text')}</p>
        <Link to="/" className="btn btn--navy">{t('notFound.back')}</Link>
      </div>
    </section>
  );
};

export default NotFound;
