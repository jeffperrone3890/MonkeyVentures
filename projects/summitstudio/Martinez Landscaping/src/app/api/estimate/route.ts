import { NextResponse } from 'next/server';

/**
 * POST /api/estimate
 *
 * Receives estimate-request submissions from the contact form. Right now it
 * validates the payload and logs it server-side so the project runs with zero
 * configuration. To actually deliver leads, wire up an email/CRM provider in
 * the marked section below (Resend example included) and set the env vars from
 * .env.example.
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

  // Server-side validation mirrors the client.
  if (!body.name?.trim() || (!body.email?.trim() && !body.phone?.trim())) {
    return NextResponse.json(
      { ok: false, error: 'Name and a phone number or email are required.' },
      { status: 422 },
    );
  }

  // ── Deliver the lead ────────────────────────────────────────────────────
  // Replace this block with your provider. Example with Resend:
  //
  //   import { Resend } from 'resend';
  //   const resend = new Resend(process.env.RESEND_API_KEY);
  //   await resend.emails.send({
  //     from: process.env.ESTIMATE_FROM_EMAIL!,
  //     to: process.env.ESTIMATE_TO_EMAIL!,
  //     subject: `New estimate request — ${body.name}`,
  //     replyTo: body.email,
  //     text: [
  //       `Name: ${body.name}`,
  //       `Phone: ${body.phone ?? '—'}`,
  //       `Email: ${body.email ?? '—'}`,
  //       `Service: ${body.service ?? '—'}`,
  //       `Address: ${body.address ?? '—'}`,
  //       '',
  //       body.message ?? '',
  //     ].join('\n'),
  //   });
  // ─────────────────────────────────────────────────────────────────────────

  // Default no-config behavior: log to the server console.
  console.info('[estimate] new request', {
    name: body.name,
    phone: body.phone,
    email: body.email,
    service: body.service,
    address: body.address,
  });

  return NextResponse.json({ ok: true });
}
