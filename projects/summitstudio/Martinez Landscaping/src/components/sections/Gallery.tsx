'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { GALLERY, GALLERY_CATEGORIES } from '@/data/business';
import { cn } from '@/lib/utils';

export function Gallery() {
  const [filter, setFilter] = useState<string>('All');
  const [active, setActive] = useState<number | null>(null);
  const reduce = useReducedMotion();

  const items = filter === 'All' ? GALLERY : GALLERY.filter((g) => g.category === filter);

  const close = useCallback(() => setActive(null), []);
  const go = useCallback(
    (dir: 1 | -1) => {
      setActive((cur) => {
        if (cur === null) return cur;
        return (cur + dir + items.length) % items.length;
      });
    },
    [items.length],
  );

  // Keyboard controls for the lightbox.
  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [active, close, go]);

  return (
    <Section id="gallery" tone="paper">
      <Container>
        <SectionHeading
          eyebrow="Our work"
          title="Real Delaware properties, transformed."
          intro="A look at recent projects across the county — design installs, hardscaping, tree work, and the lawns we keep sharp all season."
        />

        {/* Filters */}
        <div className="mt-8 flex flex-wrap gap-2.5" role="tablist" aria-label="Filter gallery by category">
          {GALLERY_CATEGORIES.map((cat) => {
            const selected = filter === cat;
            return (
              <button
                key={cat}
                role="tab"
                aria-selected={selected}
                onClick={() => setFilter(cat)}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine focus-visible:ring-offset-2 focus-visible:ring-offset-paper',
                  selected
                    ? 'bg-pine text-sage-50 shadow-soft'
                    : 'bg-sage-50 text-ink hover:bg-sage-100',
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Masonry grid */}
        <div className="mt-8 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
          {items.map((item, i) => (
            <motion.button
              key={item.src}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setActive(i)}
              aria-label={`View ${item.caption}`}
              className="group relative block w-full overflow-hidden rounded-3xl shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={900}
                height={item.tall ? 1100 : 700}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="w-full transition-transform duration-500 ease-out-expo group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-forest/75 via-forest/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="absolute inset-x-0 bottom-0 flex translate-y-2 items-center justify-between p-5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <span className="text-left">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-amber-soft">{item.category}</span>
                  <span className="mt-0.5 block font-display text-lg font-semibold text-sage-50">{item.caption}</span>
                </span>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sage-50/20 text-sage-50 backdrop-blur">
                  <Plus className="h-5 w-5" />
                </span>
              </span>
            </motion.button>
          ))}
        </div>
      </Container>

      {/* Lightbox */}
      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-forest/95 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label={items[active].caption}
            onClick={close}
          >
            <button
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full bg-sage-50/10 text-sage-50 transition-colors hover:bg-sage-50/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
            >
              <X className="h-6 w-6" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); go(-1); }}
              aria-label="Previous"
              className="absolute left-4 grid h-12 w-12 place-items-center rounded-full bg-sage-50/10 text-sage-50 transition-colors hover:bg-sage-50/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber sm:left-8"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <motion.figure
              key={items[active].src}
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-h-[82vh] w-full max-w-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={items[active].src}
                alt={items[active].alt}
                width={1100}
                height={items[active].tall ? 1400 : 850}
                className="mx-auto max-h-[82vh] w-auto rounded-3xl object-contain shadow-lift"
              />
              <figcaption className="mt-4 text-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-soft">{items[active].category}</span>
                <p className="mt-1 font-display text-lg text-sage-50">{items[active].caption}</p>
              </figcaption>
            </motion.figure>

            <button
              onClick={(e) => { e.stopPropagation(); go(1); }}
              aria-label="Next"
              className="absolute right-4 grid h-12 w-12 place-items-center rounded-full bg-sage-50/10 text-sage-50 transition-colors hover:bg-sage-50/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber sm:right-8"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
