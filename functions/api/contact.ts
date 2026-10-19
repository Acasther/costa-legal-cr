// POST /api/contact — validates the contact form, verifies Turnstile and sends the message through Resend.

interface Env {
  RESEND_API_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  CONTACT_TO?: string;
  EMAIL_FROM?: string;
  // Local development only: log the email instead of sending it when no Resend key is set.
  DEV_LOG_EMAILS?: string;
}

interface Context {
  request: Request;
  env: Env;
}

const MAX_BODY_BYTES = 32 * 1024;
const MIN_FILL_MS = 3000;
const MAX_LINKS = 3;
const LIMITS = { name: 100, email: 254, message: 5000 };
const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

// Removes control characters (except newlines/tabs in the message) and trims.
const clean = (value: unknown, multiline = false) => {
  if (typeof value !== 'string') return '';
  const pattern = multiline ? /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g;
  return value.replace(pattern, '').trim();
};

const countLinks = (text: string) => (text.match(/https?:\/\/|www\./gi) ?? []).length;

const verifyTurnstile = async (token: string, secret: string, ip: string | null) => {
  const form = new FormData();
  form.append('secret', secret);
  form.append('response', token);
  if (ip) form.append('remoteip', ip);

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
    const data = (await res.json()) as { success?: boolean; 'error-codes'?: string[] };
    if (!data.success) console.warn('Turnstile rejected', data['error-codes']);
    return data.success === true;
  } catch (err) {
    console.error('Turnstile verification failed', err);
    return false;
  }
};

const buildEmail = (name: string, email: string, message: string, lang: string, country: string) => {
  const sentAt = new Date().toLocaleString('en-US', { timeZone: 'America/Costa_Rica', dateStyle: 'medium', timeStyle: 'short' });
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\r?\n/g, '<br>');
  const language = lang === 'es' ? 'Spanish' : 'English';

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:6px 0;width:110px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#6b7280;vertical-align:top;">${label}</td>
      <td style="padding:6px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#111827;">${value}</td>
    </tr>`;

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background-color:#f3f4f6;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f3f4f6;">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#ffffff;border:1px solid #e5e7eb;">
            <tr>
              <td style="background-color:#000000;padding:20px 24px;font-family:Georgia,'Times New Roman',serif;font-size:22px;letter-spacing:4px;color:#ffffff;">COSTA LEGAL</td>
            </tr>
            <tr>
              <td style="padding:24px;">
                <p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#111827;">New message from the website contact form.</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  ${row('Name', safeName)}
                  ${row('Email', `<a href="mailto:${safeEmail}" style="color:#1f2d4f;">${safeEmail}</a>`)}
                  ${row('Language', language)}
                  ${row('Country', escapeHtml(country))}
                  ${row('Received', sentAt + ' (CR)')}
                </table>
                <div style="margin-top:20px;padding:16px;background-color:#f9fafb;border-left:3px solid #1f2d4f;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:22px;color:#111827;">${safeMessage}</div>
                <p style="margin:20px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#6b7280;">Reply to this email to answer ${safeName} directly.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = [
    'New message from the website contact form.',
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    `Language: ${language}`,
    `Country: ${country}`,
    `Received: ${sentAt} (CR)`,
    '',
    message,
    '',
    `Reply to this email to answer ${name} directly.`,
  ].join('\n');

  return { html, text };
};

export const onRequestPost = async ({ request, env }: Context) => {
  // Only accept submissions from this site.
  const origin = request.headers.get('Origin');
  if (origin && URL.parse(origin)?.host !== new URL(request.url).host) {
    return json(403, { error: 'forbidden' });
  }

  if (!request.headers.get('Content-Type')?.includes('application/json')) {
    return json(415, { error: 'invalid_request' });
  }

  const raw = await request.text();
  if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) {
    return json(413, { error: 'too_large' });
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return json(400, { error: 'invalid_request' });
  }

  const name = clean(body.name);
  const email = clean(body.email).toLowerCase();
  const message = clean(body.message, true);
  const lang = body.lang === 'es' ? 'es' : 'en';
  const token = clean(body.token);
  const honeypot = clean(body.website);
  const elapsedMs = Number(body.elapsedMs);

  // Bots that fill the hidden field or submit instantly get a fake success and nothing is sent.
  if (honeypot || !Number.isFinite(elapsedMs) || elapsedMs < MIN_FILL_MS) {
    console.warn('Dropped likely bot submission', { honeypot: Boolean(honeypot), elapsedMs });
    return json(200, { ok: true });
  }

  if (
    !name || name.length > LIMITS.name ||
    !email || email.length > LIMITS.email || !EMAIL_RE.test(email) ||
    !message || message.length > LIMITS.message
  ) {
    return json(400, { error: 'invalid_fields' });
  }

  if (countLinks(message) > MAX_LINKS || countLinks(name) > 0) {
    return json(400, { error: 'too_many_links' });
  }

  if (!env.TURNSTILE_SECRET_KEY || !env.CONTACT_TO || !env.EMAIL_FROM) {
    console.error('Contact form is missing TURNSTILE_SECRET_KEY, CONTACT_TO or EMAIL_FROM');
    return json(500, { error: 'not_configured' });
  }

  if (!token || !(await verifyTurnstile(token, env.TURNSTILE_SECRET_KEY, request.headers.get('CF-Connecting-IP')))) {
    return json(403, { error: 'captcha_failed' });
  }

  const country = (request as Request & { cf?: { country?: string } }).cf?.country ?? 'Unknown';
  const { html, text } = buildEmail(name, email, message, lang, country);
  const subject = `New inquiry from ${name} — costalegalcr.com`;

  if (!env.RESEND_API_KEY) {
    if (env.DEV_LOG_EMAILS === 'true') {
      console.log(`[dev] Email not sent (no RESEND_API_KEY)\nTo: ${env.CONTACT_TO}\nReply-To: ${email}\nSubject: ${subject}\n\n${text}`);
      return json(200, { ok: true });
    }
    console.error('Contact form is missing RESEND_API_KEY');
    return json(500, { error: 'not_configured' });
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.EMAIL_FROM,
        to: env.CONTACT_TO.split(',').map((address) => address.trim()),
        reply_to: email,
        subject,
        html,
        text,
      }),
    });

    if (!res.ok) {
      console.error('Resend rejected the email', res.status, await res.text());
      return json(502, { error: 'send_failed' });
    }
  } catch (err) {
    console.error('Resend request failed', err);
    return json(502, { error: 'send_failed' });
  }

  return json(200, { ok: true });
};

// Any other method on this route.
export const onRequest = () => json(405, { error: 'method_not_allowed' });
