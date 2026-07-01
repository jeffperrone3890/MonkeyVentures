import { ShieldCheck, Star, CalendarCheck, ClipboardList, Users } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { BUSINESS } from '@/data/business';

const yearsInBusiness = new Date().getFullYear() - BUSINESS.foundedYear;

const trustItems = [
  {
    icon: ShieldCheck,
    label: 'Licensed & Insured',
    detail: BUSINESS.credentials.insuranceAmount,
  },
  {
    icon: CalendarCheck,
    label: `${yearsInBusiness}+ Years`,
    detail: 'Of professional service',
  },
  {
    icon: Star,
    label: `${BUSINESS.reviews.average}★ Rated`,
    detail: `${BUSINESS.reviews.count} verified reviews`,
  },
  {
    icon: ClipboardList,
    label: 'Free Estimates',
    detail: 'Written quote in 24 hours',
  },
  {
    icon: Users,
    label: 'Same Crew Every Visit',
    detail: 'No rotating subcontractors',
  },
] as const;

/**
 * Five trust indicators displayed as a horizontal card strip immediately
 * below the hero. Builds credibility at first scroll before the visitor
 * reaches any persuasion copy. All content is derived from BUSINESS data
 * — no new fields required.
 */
export function TrustStrip() {
  return (
    <section aria-label="Why choose us at a glance" className="border-b border-foreground/5 bg-background py-10">
      <Container>
        <Reveal>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {trustItems.map(({ icon: Icon, label, detail }) => (
              <div
                key={label}
                className="group flex flex-col items-center gap-2.5 rounded-2xl border border-foreground/5 bg-background px-4 py-5 text-center shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lift"
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-surface-50">
                  <Icon className="h-6 w-6" strokeWidth={1.75} />
                </span>
                <span>
                  <span className="block text-[15px] font-bold text-secondary">{label}</span>
                  <span className="mt-0.5 block text-[13px] leading-snug text-muted">{detail}</span>
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
