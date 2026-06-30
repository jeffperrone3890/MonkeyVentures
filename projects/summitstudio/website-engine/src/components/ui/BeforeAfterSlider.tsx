'use client';

import { useCallback, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import Image from 'next/image';
import { ArrowLeftRight } from 'lucide-react';
import type { BeforeAfterImage } from '@/types';
import { cn } from '@/lib/utils';

interface BeforeAfterSliderProps {
  before: BeforeAfterImage;
  after: BeforeAfterImage;
  className?: string;
  sizes?: string;
  /** Handle position as a percent (0–100) before any interaction. */
  initialPosition?: number;
}

const STEP = 4;
const BIG_STEP = 12;

/**
 * A draggable before/after comparison. Takes any two images — it has no
 * idea whether they're real before/after photography or two unrelated
 * placeholder shots, so dropping in real pairs later (src/data/business.ts)
 * never requires touching this component.
 *
 * Drag or click anywhere on the image to move the divider; the handle is
 * also keyboard-operable (arrow keys, Home/End) via its `slider` role.
 */
export function BeforeAfterSlider({
  before,
  after,
  className,
  sizes = '(max-width: 768px) 100vw, 50vw',
  initialPosition = 50,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(initialPosition);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    draggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  }

  function onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return;
    updateFromClientX(e.clientX);
  }

  function endDrag() {
    draggingRef.current = false;
  }

  function onKeyDown(e: React.KeyboardEvent) {
    const step = e.shiftKey ? BIG_STEP : STEP;
    if (e.key === 'ArrowLeft') {
      setPosition((p) => Math.max(0, p - step));
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      setPosition((p) => Math.min(100, p + step));
      e.preventDefault();
    } else if (e.key === 'Home') {
      setPosition(0);
      e.preventDefault();
    } else if (e.key === 'End') {
      setPosition(100);
      e.preventDefault();
    }
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'group relative w-full touch-pan-y select-none overflow-hidden rounded-3xl bg-surface-100 shadow-soft',
        className,
      )}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      {/* After — full base layer */}
      <Image src={after.src} alt={after.alt} fill sizes={sizes} className="pointer-events-none object-cover" />

      {/* Before — clipped to the handle position, same box size as the layer above so nothing distorts */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image src={before.src} alt={before.alt} fill sizes={sizes} className="object-cover" />
      </div>

      {/* Corner labels */}
      <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-secondary/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-surface-50 backdrop-blur">
        Before
      </span>
      <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-secondary/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-surface-50 backdrop-blur">
        After
      </span>

      {/* Divider + handle */}
      <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-background" style={{ left: `${position}%` }}>
        <div
          role="slider"
          tabIndex={0}
          aria-label="Before/after comparison"
          aria-valuenow={Math.round(position)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-orientation="horizontal"
          onKeyDown={onKeyDown}
          className="pointer-events-auto absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize place-items-center rounded-full bg-background text-secondary shadow-lift transition-transform group-hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <ArrowLeftRight className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
