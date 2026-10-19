import { useTranslation } from 'react-i18next';
import photos from '../../assets/photos';
import ContactSection from '../../components/ContactSection/ContactSection';
import { PageHero } from '../../components/Sections/Sections';

const Contact = () => {
  const { t } = useTranslation('global');

  return (
    <>
      <PageHero size="compact" photo={photos.contact} eyebrow={t('contact.hero.eyebrow')} title={t('contact.hero.title')}
        intro={t('contact.hero.intro')} imageAlt={t('contact.hero.imageAlt')} />
      <ContactSection id="message" />
    </>
  );
};

export default Contact;
