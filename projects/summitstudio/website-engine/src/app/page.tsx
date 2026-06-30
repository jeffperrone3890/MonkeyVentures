import { Hero } from '@/components/sections/Hero';
import { TrustStrip } from '@/components/sections/TrustStrip';
import { WhyChooseUs } from '@/components/sections/WhyChooseUs';
import { Services } from '@/components/sections/Services';
import { Gallery } from '@/components/sections/Gallery';
import { Testimonials } from '@/components/sections/Testimonials';
import { ServiceArea } from '@/components/sections/ServiceArea';
import { CTA } from '@/components/sections/CTA';
import { Contact } from '@/components/sections/Contact';
import { HorizonDivider } from '@/components/ui/HorizonDivider';
import { THEME } from '@/data/theme';

/**
 * Home — the single marketing page.
 *
 * Section order is intentional and maps to a visitor's decision journey:
 *   1. Hero ............ hook + primary call to action (request an estimate)
 *   2. WhyChooseUs ..... build trust (credentials, proof, differentiators)
 *   3. Services ........ show what we do
 *   4. Gallery ......... show the quality of the work
 *   5. Testimonials .... social proof
 *   6. ServiceArea ..... "do you serve me?" — reduce friction before asking
 *   7. CTA ............. restate the offer once trust is established
 *   8. Contact ......... the estimate form (the conversion goal)
 *
 * The HorizonDivider — our signature landscape-contour element — leads the
 * eye from the lighter ServiceArea band into the dark secondary-color CTA band.
 *
 * Page-level <head> metadata is inherited from src/app/layout.tsx.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <WhyChooseUs />
      <Services />
      <Gallery />
      <Testimonials />
      <ServiceArea />
      <HorizonDivider fill={THEME.colors.secondary} />
      <CTA />
      <Contact />
    </>
  );
}
