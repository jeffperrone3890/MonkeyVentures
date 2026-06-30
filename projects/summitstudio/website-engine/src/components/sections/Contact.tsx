'use client';

import { useState, type FormEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, CheckCircle2, Loader2, ShieldCheck, Upload, ChevronDown } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { StarRating } from '@/components/ui/StarRating';
import { BUSINESS, SERVICES } from '@/data/business';
import { THEME } from '@/data/theme';
import { cn } from '@/lib/utils';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const fieldBase =
  'w-full rounded-2xl border border-foreground/10 bg-background px-4 py-3.5 text-[15px] text-foreground placeholder:text-muted/60 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20';

export function Contact() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string>('');
  const [showMore, setShowMore] = useState(false);
  const [photoNames, setPhotoNames] = useState<string[]>([]);
  const reduce = useReducedMotion();

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
      setShowMore(false);
      setPhotoNames([]);
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
              eyebrow="Free estimate"
              title="Let's talk about your property."
              intro="We make it simple — fill out the form or call us directly. You'll have a clear, written estimate within 24 hours. No pressure, no obligation."
            />

            {/* Prominent phone CTA — the easiest conversion path for trade businesses */}
            <Reveal delay={0.05}>
              <a
                href={BUSINESS.phoneHref}
                className="group mt-8 flex items-center gap-4 rounded-3xl border border-foreground/5 bg-background p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lift"
                aria-label={`Call ${BUSINESS.shortName} at ${BUSINESS.phone}`}
              >
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-surface-50">
                  <Phone className="h-6 w-6" />
                </span>
                <span className="flex-1">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-muted">Call or text directly</span>
                  <span className="mt-0.5 block text-2xl font-bold tabular-nums text-secondary">
                    {BUSINESS.phone}
                  </span>
                  <span className="block text-xs text-muted">Tap to call · Available {BUSINESS.hours[0].day}</span>
                </span>
              </a>
            </Reveal>

            <ul className="mt-3 space-y-3">
              <li>
                <a href={BUSINESS.emailHref} className="group flex items-center gap-4 rounded-2xl border border-foreground/5 bg-background p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"><Mail className="h-5 w-5" /></span>
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-muted">Email</span>
                    <span className="block font-semibold text-secondary">{BUSINESS.email}</span>
                  </span>
                </a>
              </li>
              <li className="flex items-center gap-4 rounded-2xl border border-foreground/5 bg-background p-5 shadow-soft">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"><Clock className="h-5 w-5" /></span>
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-muted">Hours</span>
                  <span className="block text-sm font-medium text-secondary">{BUSINESS.hours[0].day}: {BUSINESS.hours[0].time}</span>
                </span>
              </li>
              <li className="flex items-center gap-4 rounded-2xl border border-foreground/5 bg-background p-5 shadow-soft">
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
            <div className="rounded-5xl border border-foreground/5 bg-background p-7 shadow-soft sm:p-10">
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
                <>
                  {/* Response-time reassurance — first thing read, before any field */}
                  <div className="mb-7 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                    <Clock className="h-4 w-4" />
                    We typically respond within 24 hours
                  </div>

                  <form onSubmit={handleSubmit} noValidate className="space-y-6">
                    {/* Honeypot */}
                    <div className="hidden" aria-hidden="true">
                      <label htmlFor="company">Company</label>
                      <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
                    </div>

                    {/* Group 1 — who you are */}
                    <fieldset className="m-0 space-y-5 border-0 p-0">
                      <legend className="mb-1 block w-full p-0 text-xs font-semibold uppercase tracking-wider text-muted">
                        Your contact info
                      </legend>
                      <div>
                        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-secondary">
                          Name <span className="text-accent">*</span>
                        </label>
                        <input id="name" name="name" type="text" required autoComplete="name" placeholder="Jane Doe" className={fieldBase} />
                      </div>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-secondary">Phone</label>
                          <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="(302) 555-0123" className={fieldBase} />
                        </div>
                        <div>
                          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-secondary">Email</label>
                          <input id="email" name="email" type="email" autoComplete="email" placeholder="jane@email.com" className={fieldBase} />
                        </div>
                      </div>
                    </fieldset>

                    {/* Group 2 — what you need */}
                    <div className="border-t border-foreground/5 pt-6">
                      <fieldset className="m-0 space-y-5 border-0 p-0">
                        <legend className="mb-1 block w-full p-0 text-xs font-semibold uppercase tracking-wider text-muted">
                          Your project
                        </legend>
                        <div className="grid gap-5 sm:grid-cols-2">
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
                          <div>
                            <label htmlFor="address" className="mb-1.5 block text-sm font-medium text-secondary">Property address or town</label>
                            <input id="address" name="address" type="text" autoComplete="street-address" placeholder="Town or full address" className={fieldBase} />
                          </div>
                        </div>
                      </fieldset>
                    </div>

                    {/* Group 3 — optional extras, collapsed by default to keep the form feeling short */}
                    <div className="border-t border-foreground/5 pt-6">
                      <button
                        type="button"
                        onClick={() => setShowMore((v) => !v)}
                        aria-expanded={showMore}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-secondary"
                      >
                        <ChevronDown className={cn('h-4 w-4 transition-transform duration-200', showMore && 'rotate-180')} />
                        {showMore ? 'Hide project details' : 'Add project details or photos'}
                        <span className="font-normal text-muted">(optional)</span>
                      </button>

                      <AnimatePresence initial={false}>
                        {showMore && (
                          <motion.div
                            initial={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
                            animate={reduce ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
                            exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
                            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-5 pt-5">
                              <div>
                                <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-secondary">Project details</label>
                                <textarea id="message" name="message" rows={4} placeholder="Tell us what you're hoping to do — and a rough timeline if you have one." className={cn(fieldBase, 'resize-y')} />
                              </div>

                              <div>
                                <span className="mb-1.5 block text-sm font-medium text-secondary">
                                  Photos <span className="font-normal text-muted">(optional)</span>
                                </span>
                                <label
                                  htmlFor="photos"
                                  className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-dashed border-foreground/15 bg-surface-50/50 px-4 py-7 text-center transition-colors hover:border-primary/40 hover:bg-surface-50"
                                >
                                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                                    <Upload className="h-5 w-5" />
                                  </span>
                                  <span className="text-sm font-medium text-secondary">
                                    {photoNames.length > 0
                                      ? `${photoNames.length} photo${photoNames.length > 1 ? 's' : ''} selected`
                                      : 'Click to add photos'}
                                  </span>
                                  <span className="text-xs text-muted">A picture of the area helps us quote faster</span>
                                  {/* No `name` attribute — selected files are UI-only for now and
                                      aren't part of the JSON payload this form submits. Wiring real
                                      uploads means switching submission to multipart/form-data (or a
                                      presigned-URL flow) and reading e.target.files here directly. */}
                                  <input
                                    id="photos"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="sr-only"
                                    onChange={(e) => setPhotoNames(Array.from(e.target.files ?? []).map((f) => f.name))}
                                  />
                                </label>
                                {photoNames.length > 0 && (
                                  <ul className="mt-2 flex flex-wrap gap-1.5">
                                    {photoNames.map((name) => (
                                      <li key={name} className="rounded-full bg-surface-50 px-3 py-1 text-xs text-secondary">
                                        {name}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Submit — inline trust sits right where hesitation happens */}
                    <div className="border-t border-foreground/5 pt-6">
                      {status === 'error' && (
                        <p className="mb-5 rounded-2xl bg-accent/10 px-4 py-3 text-sm text-accent" role="alert">
                          {error}
                        </p>
                      )}
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <Button type="submit" size="lg" disabled={status === 'submitting'}>
                          {status === 'submitting' ? (
                            <>
                              <Loader2 className="h-5 w-5 animate-spin" />
                              Sending…
                            </>
                          ) : (
                            'Send my estimate request'
                          )}
                        </Button>
                        <div className="flex flex-col gap-1.5 text-xs text-muted sm:items-end sm:text-right">
                          <span className="inline-flex items-center gap-1.5">
                            <StarRating rating={BUSINESS.reviews.average} size={13} />
                            <span className="font-semibold text-foreground">{BUSINESS.reviews.average}</span>
                            <span>({BUSINESS.reviews.count} reviews)</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <ShieldCheck className="h-3.5 w-3.5 text-highlight" />
                            Your info is never shared
                          </span>
                        </div>
                      </div>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
