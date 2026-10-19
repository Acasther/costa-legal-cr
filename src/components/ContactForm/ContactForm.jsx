import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, CircularProgress, Stack, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import './ContactForm.css';

const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;
const LIMITS = { name: 100, email: 254, message: 5000 };
const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;
const EMPTY_FORM = { name: '', email: '', message: '', website: '' };

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

const ContactForm = () => {
  const { t, i18n } = useTranslation("global");
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [token, setToken] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorKey, setErrorKey] = useState('');
  const widgetRef = useRef(null);
  const widgetId = useRef(null);
  const startedAt = useRef(Date.now());

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
    const message = form.message.trim();
    if (!name) next.name = 'required';
    else if (name.length > LIMITS.name) next.name = 'tooLong';
    if (!email) next.email = 'required';
    else if (email.length > LIMITS.email || !EMAIL_RE.test(email)) next.email = 'invalidEmail';
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

  const fieldError = (field) => (errors[field] ? t(`contactForm.errors.${errors[field]}`) : ' ');
  const sending = status === 'sending';

  return (
    <form className="contact-form-card" onSubmit={handleSubmit} noValidate>
      <Typography variant="h2">{t("contactForm.title")}</Typography>
      <span className="article-divider"></span>
      <Typography variant="body2" className="contact-form-intro">{t("contactForm.intro")}</Typography>

      <Stack spacing={1}>
        <TextField label={t("common.name")} name="name" autoComplete="name" value={form.name} onChange={handleChange('name')}
          error={Boolean(errors.name)} helperText={fieldError('name')} required fullWidth
          slotProps={{ htmlInput: { maxLength: LIMITS.name } }} />
        <TextField label={t("contact.email")} name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange('email')}
          error={Boolean(errors.email)} helperText={fieldError('email')} required fullWidth
          slotProps={{ htmlInput: { maxLength: LIMITS.email, inputMode: 'email' } }} />
        <TextField label={t("common.message")} name="message" value={form.message} onChange={handleChange('message')}
          error={Boolean(errors.message)} helperText={fieldError('message')} required fullWidth multiline minRows={5}
          slotProps={{ htmlInput: { maxLength: LIMITS.message } }} />

        {/* Honeypot: hidden from people, often filled in by bots. */}
        <div className="contact-form-hp" aria-hidden="true">
          <label htmlFor="contact-website">Website</label>
          <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={handleChange('website')} />
        </div>

        <div ref={widgetRef} className="contact-form-captcha"></div>

        {status === 'sent' && <Alert severity="success">{t("contactForm.success")}</Alert>}
        {errorKey && <Alert severity="error">{t(`contactForm.errors.${errorKey}`)}</Alert>}

        <div className="submit-btn">
          <Button type="submit" disabled={sending} fullWidth startIcon={sending ? <CircularProgress size={20} color="inherit" /> : null}>
            {sending ? t("contactForm.sending") : t("common.submit")}
          </Button>
        </div>
        <Typography variant="caption" className="contact-form-privacy">{t("contactForm.privacy")}</Typography>
      </Stack>
    </form>
  );
};

export default ContactForm;
