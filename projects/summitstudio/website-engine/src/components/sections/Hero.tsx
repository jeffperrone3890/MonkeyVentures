'use client';

import Image from 'next/image';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { Phone, ArrowRight, ShieldCheck, Star, MapPin } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { BUSINESS } from '@/data/business';
import { THEME } from '@/data/theme';

export function Hero() {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.1, delayChildren: 0.05 } },
  };
  const item: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section id="top" className="relative isolate flex min-h-[78svh] items-center overflow-hidden bg-secondary">
      {/* Signature contour texture */}
      <svg className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-[0.07]" viewBox="0 0 400 300" fill="none" aria-hidden="true">
        {[0, 1, 2, 3, 4, 5, 6].map((n) => (
          <path
            key={n}
            d={`M-20 ${60 + n * 34} C 80 ${30 + n * 34}, 160 ${100 + n * 34}, 240 ${60 + n * 34} S 380 ${20 + n * 34}, 440 ${70 + n * 34}`}
            stroke={THEME.colors.accent.soft}
            strokeWidth="1"
            fill="none"
          />
        ))}
      </svg>

      <Container className="py-20 pt-32 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Content */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="lg:col-span-6 xl:col-span-5"
          >
            {/* Star rating + trust badges */}
            <motion.div
              variants={item}
              className="flex flex-wrap items-center gap-x-5 gap-y-2.5 text-sm"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-50/10 px-3 py-1.5 text-surface-50">
                <Star className="h-4 w-4 fill-accent text-accent" aria-hidden="true" />
                <span className="font-semibold">{BUSINESS.reviews.average}</span>
                <span className="text-surface-50/70">({BUSINESS.reviews.count} reviews)</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-surface-50/80">
                <ShieldCheck className="h-4 w-4 text-accent-soft" />
                Licensed &amp; insured
              </span>
            </motion.div>

            {/* Tagline as the primary headline — emotionally resonant, per-business */}
            <motion.h1
              variants={item}
              className="mt-6 font-display text-display font-semibold text-surface-50"
            >
              {BUSINESS.tagline}
            </motion.h1>

            {/* Compelling subhead: addresses the real concerns — reliability, no surprises, who's actually showing up */}
            <motion.p variants={item} className="mt-5 max-w-xl text-lg leading-relaxed text-surface-50/85">
              The same trusted crew — every visit, every job. Free written estimates
              within 24 hours, no pressure, and no surprises on the invoice.
              Serving {BUSINESS.address.county} since {BUSINESS.foundedYear}.
            </motion.p>

            {/* CTAs — primary is visually dominant via glow wrapper */}
            <motion.div variants={item} className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative inline-flex shrink-0">
                {/* Subtle glow behind the primary button to increase visual weight */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-full opacity-60 blur-xl"
                  style={{ background: THEME.colors.accent.DEFAULT }}
                  aria-hidden="true"
                />
                <Button href="#contact" size="lg" className="relative">
                  Get My Free Estimate
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
              <Button href={BUSINESS.phoneHref} variant="outlineOnDark" size="lg">
                <Phone className="h-5 w-5" />
                Call Now
              </Button>
            </motion.div>

            {/* Micro-copy beneath the CTAs for final hesitation removal */}
            <motion.p variants={item} className="mt-4 text-sm text-surface-50/50">
              Free estimate · No obligation · Response within 24 hours
            </motion.p>
          </motion.div>

          {/* Featured visual */}
          <div className="lg:col-span-6 xl:col-span-7">
            <HeroVisual />
          </div>
        </div>
      </Container>
    </section>
  );
}

/**
 * The hero's featured visual. Isolated as its own piece so the visual
 * itself — currently a single photo — can later be swapped for a
 * before/after slider or a short looping video without touching the grid
 * layout in Hero() above.
 */
function HeroVisual() {
  return (
    <Reveal from="right">
      <div className="relative aspect-[16/10] overflow-hidden rounded-4xl shadow-lift lg:aspect-[4/5] lg:rounded-5xl">
        <Image
          src="/images/hero.jpg"
          alt={`A professionally landscaped property in ${BUSINESS.address.county}, ${BUSINESS.address.regionName}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 45vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary/55 via-transparent to-transparent" />
        <div className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full bg-secondary/65 px-4 py-2 text-sm font-medium text-surface-50 backdrop-blur-sm">
          <MapPin className="h-4 w-4 text-accent-soft" />
          {BUSINESS.address.city}, {BUSINESS.address.region}
        </div>
      </div>
    </Reveal>
  );
}
