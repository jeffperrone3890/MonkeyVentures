import { NextResponse } from 'next/server';
import { Resend } from 'resend';

/**
 * POST /api/estimate
 *
 * Receives estimate-request submissions from the contact form, validates
 * them, and emails the lead via Resend. Configure delivery with these env
 * vars (see .env.example) — never hardcode the API key:
 *
 *   RESEND_API_KEY        — server-only secret, from resend.com/api-keys
 *   ESTIMATE_TO_EMAIL      — where leads should land
 *   ESTIMATE_FROM_EMAIL    — a sender address on a domain verified in Resend
 *
 * If any of the three are unset, delivery falls back to a server console log
 * instead of failing outright — useful so the project still runs with zero
 * configuration in local dev. Production deployments must set all three, or
 * every submission is only ever logged, never delivered.
 */

interface EstimatePayload {
  name?: string;
  email?: string;
  phone?: string;
  service?: string;
  address?: string;
  message?: string;
  company?: string; // honeypot
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_SHORT = 200;
const MAX_MESSAGE = 5000;

function validate(body: EstimatePayload): string | null {
  const name = body.name?.trim() ?? '';
  const email = body.email?.trim() ?? '';
  const phone = body.phone?.trim() ?? '';

  if (!name) return 'Please add your name.';
  if (name.length > MAX_SHORT) return 'Name is too long.';
  if (!email && !phone) return 'Please add a phone number or email so we can reach you.';
  if (email && !EMAIL_RE.test(email)) return 'Please add a valid email address.';
  if (email.length > MAX_SHORT || phone.length > MAX_SHORT) return 'That entry is too long.';
  if ((body.service?.length ?? 0) > MAX_SHORT) return 'Service is too long.';
  if ((body.address?.length ?? 0) > MAX_SHORT) return 'Address is too long.';
  if ((body.message?.length ?? 0) > MAX_MESSAGE) return 'Project details are too long.';

  return null;
}

export async function POST(request: Request) {
  let body: EstimatePayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
  }

  // Honeypot — silently accept and drop bot submissions.
  if (body.company) {
    return NextResponse.json({ ok: true });
  }

  const validationError = validate(body);
  if (validationError) {
    return NextResponse.json({ ok: false, error: validationError }, { status: 422 });
  }

  const name = body.name!.trim();
  const email = body.email?.trim() || undefined;
  const phone = body.phone?.trim() || undefined;

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.ESTIMATE_TO_EMAIL;
  const fromEmail = process.env.ESTIMATE_FROM_EMAIL;

  if (!apiKey || !toEmail || !fromEmail) {
    const missing = [
      !apiKey && 'RESEND_API_KEY',
      !toEmail && 'ESTIMATE_TO_EMAIL',
      !fromEmail && 'ESTIMATE_FROM_EMAIL',
    ].filter(Boolean);
    console.warn(`[estimate] Resend not configured (missing ${missing.join(', ')}) — logging instead of emailing.`);
    console.info('[estimate] new request', { name, phone, email, service: body.service, address: body.address });
    return NextResponse.json({ ok: true });
  }

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: email,
      subject: `New estimate request — ${name}`,
      text: [
        `Name: ${name}`,
        `Phone: ${phone ?? '—'}`,
        `Email: ${email ?? '—'}`,
        `Service: ${body.service ?? '—'}`,
        `Address: ${body.address ?? '—'}`,
        '',
        body.message ?? '',
      ].join('\n'),
    });

    if (error) {
      console.error('[estimate] Resend rejected the email:', error.message);
      return NextResponse.json(
        { ok: false, error: 'We could not send your request right now. Please call us instead.' },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[estimate] Failed to reach Resend:', err);
    return NextResponse.json(
      { ok: false, error: 'We could not send your request right now. Please call us instead.' },
      { status: 502 },
    );
  }
}
