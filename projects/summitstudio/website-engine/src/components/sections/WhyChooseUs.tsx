import Image from 'next/image';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { BUSINESS, BENEFITS, STATS } from '@/data/business';

export function WhyChooseUs() {
  const yearsInBusiness = new Date().getFullYear() - BUSINESS.foundedYear;

  return (
    <Section id="why-us" tone="paper">
      <Container>
        {/* Stats — editorial horizontal strip, no card treatment */}
        <div className="grid grid-cols-2 divide-x divide-foreground/8 border-y border-foreground/8 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="py-8 text-center">
              <div className="font-display text-4xl font-semibold text-primary">{stat.value}</div>
              <div className="mt-1.5 text-sm text-muted">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-20 grid items-start gap-16 lg:grid-cols-2">
          {/* Copy + numbered benefits */}
          <div>
            <SectionHeading
              eyebrow={`Why ${BUSINESS.logo.primary}`}
              title="The crew you'll actually want to keep."
              intro="Anyone can send someone to mow your lawn. We're built for something harder — the long relationship, where you know exactly who's coming, what it costs, and that the work will be done right."
            />

            <p className="mt-6 max-w-[52ch] text-[15px] leading-relaxed text-muted">
              {BUSINESS.shortName} has been the trusted name for property care in{' '}
              {BUSINESS.address.county} since {BUSINESS.foundedYear} — that&rsquo;s{' '}
              {yearsInBusiness}+ years of showing up on time, doing honest work, and
              building the kind of reputation that earns referrals from half the
              neighborhood. Every service is delivered by a consistent crew that
              knows your property and takes it personally.
            </p>

            {/* Editorial numbered list — large decorative numerals, no cards */}
            <ol className="mt-12 space-y-10">
              {BENEFITS.map((benefit, i) => (
                <li key={benefit.title} className="flex gap-6">
                  <span
                    className="w-10 shrink-0 font-display text-5xl font-semibold leading-none text-foreground/10 tabular-nums"
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-secondary">
                      {benefit.title}
                    </h3>
                    <p className="mt-2 max-w-[40ch] text-[15px] leading-relaxed text-muted">
                      {benefit.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* About image */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-5xl">
            <Image
              src="/images/about.jpg"
              alt={`The ${BUSINESS.shortName} crew at work — professional, reliable, and consistent`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 to-transparent" />
          </div>
        </div>
      </Container>
    </Section>
  );
}
