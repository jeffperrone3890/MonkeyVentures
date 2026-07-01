import Image from 'next/image';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { BUSINESS, BENEFITS, STATS } from '@/data/business';

export function WhyChooseUs() {
  const yearsInBusiness = new Date().getFullYear() - BUSINESS.foundedYear;

  return (
    <Section id="why-us" tone="paper">
      <Container>
        {/* Stats band */}
        <Reveal>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-4xl bg-surface-100 shadow-soft lg:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="bg-background px-6 py-8 text-center transition-colors duration-200 hover:bg-primary/5">
                <div className="font-display text-4xl font-semibold text-primary">{stat.value}</div>
                <div className="mt-1.5 text-sm text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="mt-20 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Copy + benefits */}
          <div>
            <SectionHeading
              eyebrow={`Why ${BUSINESS.logo.primary}`}
              title="The crew you'll actually want to keep."
              intro="Anyone can send someone to mow your lawn. We're built for something harder — the long relationship, where you know exactly who's coming, what it costs, and that the work will be done right."
            />

            {/* Expanded company story — reliability, professionalism, craftsmanship */}
            <Reveal delay={0.08}>
              <p className="mt-6 max-w-[52ch] text-[15px] leading-relaxed text-muted">
                {BUSINESS.shortName} has been the trusted name for property care in{' '}
                {BUSINESS.address.county} since {BUSINESS.foundedYear} — that&rsquo;s{' '}
                {yearsInBusiness}+ years of showing up on time, doing honest work, and
                building the kind of reputation that earns referrals from half the
                neighborhood. Every service is delivered by a consistent crew that
                knows your property and takes it personally.
              </p>
            </Reveal>

            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {BENEFITS.map((benefit, i) => (
                <Reveal key={benefit.title} delay={i * 0.06}>
                  <div className="group h-full rounded-3xl border border-foreground/5 bg-background p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-surface-50">
                      <benefit.icon className="h-5.5 w-5.5" />
                    </span>
                    <h3 className="mt-4 font-display text-lg font-semibold text-secondary">
                      {benefit.title}
                    </h3>
                    <p className="mt-2 max-w-[38ch] text-[15px] leading-relaxed text-muted">
                      {benefit.description}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Image with floating credential card */}
          <Reveal from="right" className="relative pb-8 lg:pb-0">
            <div className="relative aspect-[4/5] overflow-hidden rounded-5xl shadow-lift">
              <Image
                src="/images/about.jpg"
                alt={`The ${BUSINESS.shortName} crew at work — professional, reliable, and consistent`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/50 to-transparent" />
            </div>

            {/* Floating credential card */}
            <div className="absolute -bottom-2 -left-4 max-w-[17rem] rounded-3xl border border-foreground/5 bg-background/96 p-5 shadow-lift backdrop-blur sm:-left-8 lg:bottom-2">
              <p className="font-display text-xl font-semibold leading-tight text-primary">
                {BUSINESS.credentials.certification}
              </p>
              <p className="mt-1.5 text-sm leading-snug text-muted">
                {BUSINESS.credentials.insuranceAmount} in general liability.
                Licensed &amp; insured for every job.
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
