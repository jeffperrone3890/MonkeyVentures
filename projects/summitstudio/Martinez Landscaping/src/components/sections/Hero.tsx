'use client';

import Image from 'next/image';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { Phone, ArrowRight, ShieldCheck, Clock, MapPin } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { StarRating } from '@/components/ui/StarRating';
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
      {/* Faint signature contour texture — same motif used on the ServiceArea panel */}
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
            {/* Trust strip — proof first, before any persuasion copy */}
            <motion.div
              variants={item}
              className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-surface-50/90"
            >
              <span className="inline-flex items-center gap-2">
                <StarRating rating={BUSINESS.reviews.average} />
                <span className="font-semibold text-surface-50">{BUSINESS.reviews.average}</span>
                <span className="text-surface-50/70">({BUSINESS.reviews.count} reviews)</span>
              </span>
              <span className="hidden h-4 w-px bg-surface-50/25 sm:block" />
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4.5 w-4.5 text-accent-soft" />
                Licensed &amp; insured
              </span>
              <span className="hidden h-4 w-px bg-surface-50/25 sm:block" />
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4.5 w-4.5 text-accent-soft" />
                24/7 storm response
              </span>
            </motion.div>

            <motion.h1
              variants={item}
              className="mt-7 font-display text-display font-semibold text-surface-50"
            >
              Landscaping &amp; tree care, quoted within 24 hours.
            </motion.h1>

            <motion.p variants={item} className="mt-5 max-w-xl text-lg leading-relaxed text-surface-50/85">
              The same trusted crew for lawn care, landscape design, and tree work — serving{' '}
              {BUSINESS.address.county} since {BUSINESS.foundedYear}.
            </motion.p>

            <motion.div variants={item} className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button href="#contact" size="lg">
                Get My Free Estimate
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button href={BUSINESS.phoneHref} variant="outlineOnDark" size="lg">
                <Phone className="h-5 w-5" />
                Call Now
              </Button>
            </motion.div>
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
          alt={`A professionally landscaped property at golden hour in ${BUSINESS.address.county}, ${BUSINESS.address.regionName}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 45vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary/55 via-transparent to-transparent" />
        <div className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full bg-secondary/60 px-4 py-2 text-sm font-medium text-surface-50 backdrop-blur">
          <MapPin className="h-4 w-4 text-accent-soft" />
          {BUSINESS.address.city}, {BUSINESS.address.region}
        </div>
      </div>
    </Reveal>
  );
}
