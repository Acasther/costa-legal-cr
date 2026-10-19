import { useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '../Icon/Icon';

const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;
const LIMITS = { name: 100, email: 254, phone: 30, message: 5000 };
const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;
const PHONE_RE = /^\+?[\d\s().-]+$/;
const EMPTY_FORM = { name: '', email: '', phone: '', message: '', website: '' };

let turnstileScript;
const loadTurnstile = () => {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!turnstileScript) {
    turnstileScript = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = TURNSTILE_SRC;
      script.async = true;
      script.onload = () => resolve(window.turnstile);
      script.onerror = () => {
        turnstileScript = undefined;
        reject(new Error('Turnstile failed to load'));
      };
      document.head.appendChild(script);
    });
  }
  return turnstileScript;
};

const Field = ({ id, label, error, multiline, optionalLabel, ...props }) => {
  const Control = multiline ? 'textarea' : 'input';
  return (
    <div className={`field${error ? ' field--error' : ''}`}>
      <label htmlFor={id} className="field__label">
        {label}
        {optionalLabel ? <span className="field__optional"> ({optionalLabel})</span> : <span aria-hidden="true"> *</span>}
      </label>
      <Control id={id} className="field__control" aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined}
        required={!optionalLabel} {...props} />
      {error && <p id={`${id}-error`} className="field__error">{error}</p>}
    </div>
  );
};

const ContactForm = () => {
  const { t, i18n } = useTranslation('global');
  const idPrefix = useId();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [token, setToken] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorKey, setErrorKey] = useState('');
  const widgetRef = useRef(null);
  const widgetId = useRef(null);
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!SITE_KEY) {
      console.error('VITE_TURNSTILE_SITE_KEY is not set');
      setErrorKey('captchaUnavailable');
      return undefined;
    }
    loadTurnstile()
      .then((turnstile) => {
        if (cancelled || !widgetRef.current) return;
        widgetId.current = turnstile.render(widgetRef.current, {
          sitekey: SITE_KEY,
          action: 'contact',
          language: i18n.language,
          size: 'flexible',
          callback: setToken,
          'expired-callback': () => setToken(''),
          'error-callback': () => setToken(''),
        });
      })
      .catch(() => !cancelled && setErrorKey('captchaUnavailable'));

    return () => {
      cancelled = true;
      if (widgetId.current !== null && window.turnstile) window.turnstile.remove(widgetId.current);
      widgetId.current = null;
      setToken('');
    };
  }, [i18n.language]);

  const resetCaptcha = () => {
    setToken('');
    if (widgetId.current !== null && window.turnstile) window.turnstile.reset(widgetId.current);
  };

  const validate = () => {
    const next = {};
    const name = form.name.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    const message = form.message.trim();
    if (!name) next.name = 'required';
    else if (name.length > LIMITS.name) next.name = 'tooLong';
    if (!email) next.email = 'required';
    else if (email.length > LIMITS.email || !EMAIL_RE.test(email)) next.email = 'invalidEmail';
    if (phone && (phone.length > LIMITS.phone || !PHONE_RE.test(phone) || phone.replace(/\D/g, '').length < 7)) next.phone = 'invalidPhone';
    if (!message) next.message = 'required';
    else if (message.length > LIMITS.message) next.message = 'tooLong';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (status !== 'sending') setStatus('idle');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorKey('');
    if (!validate()) return;
    if (!token) {
      setErrorKey('captchaRequired');
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          lang: i18n.language,
          token,
          elapsedMs: Date.now() - startedAt.current,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || 'send_failed');

      setForm(EMPTY_FORM);
      setErrors({});
      setStatus('sent');
      startedAt.current = Date.now();
    } catch (err) {
      const known = { captcha_failed: 'captchaFailed', invalid_fields: 'invalidFields', too_many_links: 'tooManyLinks' };
      setErrorKey(known[err.message] || 'sendFailed');
      setStatus('idle');
    } finally {
      resetCaptcha();
    }
  };

  const fieldError = (field) => (errors[field] ? t(`contactForm.errors.${errors[field]}`) : '');
  const sending = status === 'sending';

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <h2 className="contact-form__title">{t('contactForm.title')}</h2>
      <p className="contact-form__intro">{t('contactForm.intro')}</p>

      <Field id={`${idPrefix}-name`} label={t('common.name')} name="name" autoComplete="name" maxLength={LIMITS.name}
        value={form.name} onChange={handleChange('name')} error={fieldError('name')} />
      <Field id={`${idPrefix}-email`} label={t('contact.details.email')} name="email" type="email" inputMode="email" autoComplete="email"
        maxLength={LIMITS.email} value={form.email} onChange={handleChange('email')} error={fieldError('email')} />
      <Field id={`${idPrefix}-phone`} label={t('contactForm.phone')} optionalLabel={t('contactForm.optional')} name="phone" type="tel"
        inputMode="tel" autoComplete="tel" maxLength={LIMITS.phone} value={form.phone} onChange={handleChange('phone')} error={fieldError('phone')} />
      <Field id={`${idPrefix}-message`} label={t('common.message')} name="message" multiline rows={5} maxLength={LIMITS.message}
        value={form.message} onChange={handleChange('message')} error={fieldError('message')} />

      {/* Honeypot: hidden from people, often filled in by bots. */}
      <div className="contact-form__hp" aria-hidden="true">
        <label htmlFor={`${idPrefix}-website`}>Website</label>
        <input id={`${idPrefix}-website`} name="website" type="text" tabIndex={-1} autoComplete="off"
          value={form.website} onChange={handleChange('website')} />
      </div>

      <div ref={widgetRef} className="contact-form__captcha"></div>

      <div aria-live="polite">
        {status === 'sent' && <p className="alert alert--success"><Icon name="checkCircle" size={20} /> {t('contactForm.success')}</p>}
        {errorKey && <p className="alert alert--error">{t(`contactForm.errors.${errorKey}`)}</p>}
      </div>

      <button type="submit" className="btn btn--navy btn--block" disabled={sending}>
        {sending && <span className="spinner" aria-hidden="true"></span>}
        {sending ? t('contactForm.sending') : t('common.submit')}
      </button>
      <p className="contact-form__privacy">{t('contactForm.privacy')}</p>
    </form>
  );
};

export default ContactForm;
