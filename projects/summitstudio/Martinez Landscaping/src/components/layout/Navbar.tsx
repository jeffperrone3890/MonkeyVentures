'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { BUSINESS } from '@/data/business';
import { NAV_LINKS } from '@/lib/nav';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  // Solid background once the user scrolls off the hero.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        solid
          ? 'border-b border-ink/5 bg-paper/85 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <Container className="flex h-18 items-center justify-between py-3">
        <a href="#top" aria-label={`${BUSINESS.name} — home`} className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber">
          <Logo invert={!solid} />
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:opacity-70',
                solid ? 'text-ink' : 'text-sage-50',
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={BUSINESS.phoneHref}
            className={cn(
              'inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:opacity-70',
              solid ? 'text-pine' : 'text-sage-50',
            )}
          >
            <Phone className="h-4 w-4" />
            {BUSINESS.phone}
          </a>
          <Button href="#contact" size="sm">
            Free estimate
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className={cn(
            'grid h-11 w-11 place-items-center rounded-xl transition-colors lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber',
            solid ? 'text-ink hover:bg-ink/5' : 'text-sage-50 hover:bg-white/10',
          )}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-ink/5 bg-paper lg:hidden"
          >
            <Container className="flex flex-col gap-1 py-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-base font-medium text-ink transition-colors hover:bg-sage-50"
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-2 flex flex-col gap-2 border-t border-ink/5 pt-4">
                <a
                  href={BUSINESS.phoneHref}
                  className="inline-flex items-center gap-2 px-4 text-base font-semibold text-pine"
                >
                  <Phone className="h-4 w-4" />
                  {BUSINESS.phone}
                </a>
                <Button href="#contact" onClick={() => setOpen(false)} className="w-full" size="lg">
                  Get a free estimate
                </Button>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
