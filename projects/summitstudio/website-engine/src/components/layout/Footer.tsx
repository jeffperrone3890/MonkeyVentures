import { Phone, Mail, MapPin, Clock, Facebook, Instagram, ShieldCheck } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { BUSINESS, SERVICES } from '@/data/business';
import { NAV_LINKS } from '@/lib/nav';

export function Footer() {
  const year = new Date().getFullYear();
  const { address } = BUSINESS;

  return (
    <footer className="bg-secondary text-surface-50">
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand + pitch */}
          <div className="lg:col-span-4">
            <Logo invert />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-surface/70">
              Full-service lawn care and landscaping for {BUSINESS.address.county}, {BUSINESS.address.regionName}. Family-owned since {BUSINESS.foundedYear}.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-surface-50/10 px-3.5 py-1.5 text-xs font-semibold text-accent-soft">
              <ShieldCheck className="h-4 w-4" />
              {BUSINESS.credentials.insuranceAmount} · Licensed &amp; insured
            </div>
          </div>

          {/* Explore */}
          <nav className="lg:col-span-2" aria-label="Footer">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-soft">Explore</h3>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-surface/80 transition-colors hover:text-surface-50">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <nav className="lg:col-span-3" aria-label="Services">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-soft">Services</h3>
            <ul className="mt-4 space-y-2.5">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <a href="#services" className="text-sm text-surface/80 transition-colors hover:text-surface-50">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-soft">Get in touch</h3>
            <ul className="mt-4 space-y-3 text-sm text-surface/80">
              <li>
                <a href={BUSINESS.phoneHref} className="inline-flex items-center gap-2.5 transition-colors hover:text-surface-50">
                  <Phone className="h-4 w-4 shrink-0 text-highlight" />
                  {BUSINESS.phone}
                </a>
              </li>
              <li>
                <a href={BUSINESS.emailHref} className="inline-flex items-center gap-2.5 transition-colors hover:text-surface-50">
                  <Mail className="h-4 w-4 shrink-0 text-highlight" />
                  {BUSINESS.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-highlight" />
                <span>
                  {address.street}
                  <br />
                  {address.city}, {address.region} {address.postalCode}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-highlight" />
                <span>{BUSINESS.emergencyNote}</span>
              </li>
            </ul>
            <Button href="#contact" size="sm" className="mt-5">
              Free estimate
            </Button>
          </div>
        </div>

        {/* Legal bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-surface-50/10 pt-8 text-xs text-surface/60 sm:flex-row">
          <p>
            © {year} {BUSINESS.legalName}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <a href={BUSINESS.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="transition-colors hover:text-surface-50">
              <Facebook className="h-4 w-4" />
            </a>
            <a href={BUSINESS.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="transition-colors hover:text-surface-50">
              <Instagram className="h-4 w-4" />
            </a>
            <span className="text-surface/40">Site by Summit Studio</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
