'use client';

import { useState, type FormEvent } from 'react';
import { Phone, Mail, MapPin, Clock, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { BUSINESS, SERVICES } from '@/data/business';
import { THEME } from '@/data/theme';
import { cn } from '@/lib/utils';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const fieldBase =
  'w-full rounded-2xl border border-foreground/10 bg-background px-4 py-3 text-[15px] text-foreground placeholder:text-muted/60 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20';

export function Contact() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string>('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setError('');

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    // Honeypot — bots fill hidden fields; humans don't.
    if (data.company) {
      setStatus('success');
      return;
    }

    if (!data.name || (!data.email && !data.phone)) {
      setStatus('error');
      setError('Please add your name and a phone number or email so we can reach you.');
      return;
    }

    try {
      const res = await fetch('/api/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
      setError('Something went wrong sending your request. Please call us at ' + BUSINESS.phone + '.');
    }
  }

  return (
    <Section id="contact" tone="sage">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Info column */}
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Get a free estimate"
              title="Tell us about your project."
              intro="Fill out the form and we'll get back to you within 24 hours with a clear, written estimate. Prefer to talk? Call or text anytime."
            />

            <ul className="mt-8 space-y-4">
              <li>
                <a href={BUSINESS.phoneHref} className="group flex items-center gap-4 rounded-2xl border border-foreground/5 bg-background p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"><Phone className="h-5 w-5" /></span>
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-muted">Call or text</span>
                    <span className="block font-semibold text-secondary">{BUSINESS.phone}</span>
                  </span>
                </a>
              </li>
              <li>
                <a href={BUSINESS.emailHref} className="group flex items-center gap-4 rounded-2xl border border-foreground/5 bg-background p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"><Mail className="h-5 w-5" /></span>
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-muted">Email</span>
                    <span className="block font-semibold text-secondary">{BUSINESS.email}</span>
                  </span>
                </a>
              </li>
              <li className="flex items-center gap-4 rounded-2xl border border-foreground/5 bg-background p-4 shadow-soft">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"><Clock className="h-5 w-5" /></span>
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-muted">Hours</span>
                  <span className="block text-sm font-medium text-secondary">{BUSINESS.hours[0].day}: {BUSINESS.hours[0].time}</span>
                </span>
              </li>
              <li className="flex items-center gap-4 rounded-2xl border border-foreground/5 bg-background p-4 shadow-soft">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"><MapPin className="h-5 w-5" /></span>
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-muted">Service area</span>
                  <span className="block text-sm font-medium text-secondary">{BUSINESS.address.county}, {BUSINESS.address.region}</span>
                </span>
              </li>
            </ul>

            <p className="mt-6 inline-flex items-center gap-2 text-sm text-muted">
              <ShieldCheck className="h-4 w-4 text-highlight" />
              {BUSINESS.credentials.insuranceAmount} · Licensed &amp; insured in {BUSINESS.address.regionName}
            </p>
          </div>

          {/* Form column */}
          <div className="lg:col-span-7">
            <div className="rounded-5xl border border-foreground/5 bg-background p-6 shadow-soft sm:p-9">
              {status === 'success' ? (
                <div className="flex min-h-[24rem] flex-col items-center justify-center text-center" role="status">
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-highlight/15 text-highlight">
                    <CheckCircle2 className="h-9 w-9" />
                  </span>
                  <h3 className="mt-5 font-display text-2xl font-semibold text-secondary">Request received.</h3>
                  <p className="mt-2 max-w-sm text-muted">
                    Thanks — we&rsquo;ve got your details and we&rsquo;ll be in touch within 24 hours with your written estimate. For anything urgent, call {BUSINESS.phone}.
                  </p>
                  <Button onClick={() => setStatus('idle')} variant="outline" className="mt-7">
                    Send another request
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  {/* Honeypot */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="company">Company</label>
                    <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-secondary">
                        Name <span className="text-accent">*</span>
                      </label>
                      <input id="name" name="name" type="text" required autoComplete="name" placeholder="Jane Doe" className={fieldBase} />
                    </div>
                    <div>
                      <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-secondary">Phone</label>
                      <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="(302) 555-0123" className={fieldBase} />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-secondary">Email</label>
                      <input id="email" name="email" type="email" autoComplete="email" placeholder="jane@email.com" className={fieldBase} />
                    </div>
                    <div>
                      <label htmlFor="service" className="mb-1.5 block text-sm font-medium text-secondary">Service needed</label>
                      <select id="service" name="service" defaultValue="" className={cn(fieldBase, 'appearance-none bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10')} style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='${encodeURIComponent(THEME.colors.muted)}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")` }}>
                        <option value="" disabled>Select a service…</option>
                        {SERVICES.map((s) => (
                          <option key={s.slug} value={s.title}>{s.title}</option>
                        ))}
                        <option value="Other / not sure">Other / not sure</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="address" className="mb-1.5 block text-sm font-medium text-secondary">Property address or town</label>
                    <input id="address" name="address" type="text" autoComplete="street-address" placeholder="Town or full address" className={fieldBase} />
                  </div>

                  <div>
                    <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-secondary">Project details</label>
                    <textarea id="message" name="message" rows={4} placeholder="Tell us what you're hoping to do — and a rough timeline if you have one." className={cn(fieldBase, 'resize-y')} />
                  </div>

                  {status === 'error' && (
                    <p className="rounded-2xl bg-accent/10 px-4 py-3 text-sm text-accent" role="alert">
                      {error}
                    </p>
                  )}

                  <div className="flex flex-col items-start gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
                    <Button type="submit" size="lg" disabled={status === 'submitting'}>
                      {status === 'submitting' ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Sending…
                        </>
                      ) : (
                        'Request my free estimate'
                      )}
                    </Button>
                    <p className="text-xs text-muted">We&rsquo;ll never share your details. Reply within 24 hours.</p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
