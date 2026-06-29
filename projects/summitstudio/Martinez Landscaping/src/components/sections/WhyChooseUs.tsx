import Image from 'next/image';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { BENEFITS, STATS } from '@/lib/data';
import { SITE } from '@/lib/site';

export function WhyChooseUs() {
  return (
    <Section id="why-us" tone="paper">
      <Container>
        {/* Stats band */}
        <Reveal>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-4xl bg-sage-100 shadow-soft lg:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="bg-paper px-6 py-8 text-center">
                <div className="font-display text-4xl font-semibold text-pine">{stat.value}</div>
                <div className="mt-1.5 text-sm text-mute">{stat.label}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="mt-20 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Copy + benefits */}
          <div>
            <SectionHeading
              eyebrow="Why Martinez"
              title="The crew you'll actually want to keep."
              intro="Anyone can mow a lawn. We're built for the long relationship — reliable, accountable, and genuinely good at the craft. Here's what that looks like."
            />

            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {BENEFITS.map((benefit, i) => (
                <Reveal key={benefit.title} delay={i * 0.06}>
                  <div className="group h-full rounded-3xl border border-ink/5 bg-paper p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-pine/10 text-pine transition-colors group-hover:bg-pine group-hover:text-sage-50">
                      <benefit.icon className="h-5.5 w-5.5" />
                    </span>
                    <h3 className="mt-4 font-display text-lg font-semibold text-forest">
                      {benefit.title}
                    </h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-mute">
                      {benefit.description}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Image with floating credential card */}
          <Reveal from="right" className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-5xl shadow-lift">
              <Image
                src="/images/about.jpg"
                alt="The Martinez Landscaping crew on a job site"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/40 to-transparent" />
            </div>

            <div className="absolute -bottom-6 -left-4 max-w-[15rem] rounded-3xl border border-ink/5 bg-paper/95 p-5 shadow-lift backdrop-blur sm:-left-8">
              <p className="font-display text-3xl font-semibold text-pine">{SITE.credentials.certification.split(' on')[0]}</p>
              <p className="mt-1 text-sm text-mute">on staff — guiding every prune and removal.</p>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
