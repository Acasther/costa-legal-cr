import { useTranslation } from 'react-i18next';
import Icon from '../Icon/Icon';
import { PHONE_NUMBER } from '../../utils/constants';
import { whatsappLink } from '../../utils/commonFuncs';

const WhatsAppButton = () => {
  const { t } = useTranslation('global');

  return (
    <a className="wa-fab" href={whatsappLink(PHONE_NUMBER, t('common.whatsappMessage'))} target="_blank" rel="noopener noreferrer"
      aria-label={t('common.whatsapp')}>
      <Icon name="whatsapp" size={30} />
    </a>
  );
};

export default WhatsAppButton;
