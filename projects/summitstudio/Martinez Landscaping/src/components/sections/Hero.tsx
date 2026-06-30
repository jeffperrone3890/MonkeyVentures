'use client';

import Image from 'next/image';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { Phone, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { StarRating } from '@/components/ui/StarRating';
import { BUSINESS } from '@/data/business';

export function Hero() {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.12, delayChildren: 0.1 } },
  };
  const item: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section id="top" className="relative isolate flex min-h-[92svh] items-center overflow-hidden">
      {/* Background photography */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/hero.jpg"
          alt={`A professionally landscaped property at golden hour in ${BUSINESS.address.county}, ${BUSINESS.address.regionName}`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Legibility scrim — deepest at the bottom-left where the copy sits */}
        <div className="absolute inset-0 bg-gradient-to-tr from-forest/90 via-forest/55 to-forest/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-transparent to-forest/30" />
      </div>

      <Container className="py-28 pt-36">
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-2xl">
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-sage-50/20 bg-sage-50/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-sage-50 backdrop-blur-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-amber" />
            Serving {BUSINESS.address.county} since {BUSINESS.foundedYear}
          </motion.span>

          <motion.h1
            variants={item}
            className="mt-6 font-display text-display-lg font-semibold text-sage-50"
          >
            Landscapes worth
            <br />
            coming home to.
          </motion.h1>

          <motion.p variants={item} className="mt-6 max-w-xl text-lg leading-relaxed text-sage-50/85">
            Expert lawn care, landscape design, and certified tree services — done by a
            crew that shows up on time and treats your property like its own. Get a clear,
            written estimate within 24 hours.
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button href="#contact" size="lg">
              Get a free estimate
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button href={BUSINESS.phoneHref} variant="onDark" size="lg">
              <Phone className="h-5 w-5" />
              {BUSINESS.phone}
            </Button>
          </motion.div>

          {/* Trust line */}
          <motion.div
            variants={item}
            className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-sage-50/90"
          >
            <span className="inline-flex items-center gap-2">
              <StarRating rating={BUSINESS.reviews.average} />
              <span className="font-semibold">{BUSINESS.reviews.average}</span>
              <span className="text-sage-50/70">({BUSINESS.reviews.count} reviews)</span>
            </span>
            <span className="hidden h-4 w-px bg-sage-50/25 sm:block" />
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4.5 w-4.5 text-amber-soft" />
              Licensed &amp; insured
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4.5 w-4.5 text-amber-soft" />
              24/7 storm response
            </span>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
