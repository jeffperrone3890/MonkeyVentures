import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { BUSINESS } from '@/data/business';

export const metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
};

/**
 * Branded 404. Keeps people on-site with a clear route back home and a phone
 * link, so a mistyped URL never becomes a lost lead.
 */
export default function NotFound() {
  return (
    <section className="flex min-h-[80svh] items-center bg-paper">
      <div className="mx-auto w-full max-w-content px-5 py-24 text-center sm:px-8">
        <div className="mx-auto mb-8 flex justify-center">
          <Logo />
        </div>
        <p className="font-display text-display-lg leading-none text-forest">404</p>
        <h1 className="mt-4 font-display text-heading text-pine">
          We couldn&apos;t find that page
        </h1>
        <p className="mx-auto mt-4 max-w-md text-mute">
          The page you&apos;re after may have moved or never existed. Let&apos;s get you back to
          solid ground.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href="/" variant="primary" size="lg">
            Back to home
          </Button>
          <Button href={BUSINESS.phoneHref} variant="outline" size="lg">
            Call {BUSINESS.phone}
          </Button>
        </div>
        <p className="mt-10 text-sm text-mute">
          Or jump straight to a{' '}
          <Link href="/#contact" className="font-semibold text-fern underline-offset-4 hover:underline">
            free estimate
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
