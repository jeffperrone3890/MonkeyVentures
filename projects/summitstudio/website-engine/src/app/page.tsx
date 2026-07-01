import { Hero } from '@/components/sections/Hero';
import { WhyChooseUs } from '@/components/sections/WhyChooseUs';
import { Services } from '@/components/sections/Services';
import { StatementSection } from '@/components/sections/StatementSection';
import { Gallery } from '@/components/sections/Gallery';
import { Testimonials } from '@/components/sections/Testimonials';
import { ServiceArea } from '@/components/sections/ServiceArea';
import { CTA } from '@/components/sections/CTA';
import { Contact } from '@/components/sections/Contact';
import { FAQSection } from '@/components/sections/FAQSection';
import { ProofBar } from '@/components/ui/ProofBar';
import { Guarantee } from '@/components/ui/Guarantee';
import { HairlineDivider } from '@/components/ui/HairlineDivider';
import { HorizonDivider } from '@/components/ui/HorizonDivider';
import { BUSINESS } from '@/data/business';
import { THEME } from '@/data/theme';

/**
 * Home — the single marketing page.
 *
 * Section order maps to the visitor's decision journey:
 *   1. Hero ................... hook + primary CTA
 *   2. ProofBar ............... five trust credentials (no card chrome)
 *   3. WhyChooseUs ............ numbered editorial list of differentiators
 *   4. Services ............... what we do (icon + typography, no photos)
 *   5. StatementSection ....... editorial pull quote — deliberate pause
 *   6. Gallery ................ before/after work quality proof
 *   7. Testimonials ........... social proof
 *   8. ServiceArea ............ geographic scope — remove "do you serve me?" friction
 *   9. CTA .................... restate the offer
 *  10. Guarantee .............. risk reversal (renders null if no guarantee)
 *  11. Contact ................ estimate form — the conversion goal
 *  12. FAQSection ............. remaining objections (renders null if no FAQ)
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <ProofBar />
      <WhyChooseUs />
      <Services />
      <StatementSection statement={BUSINESS.businessStory.differentiator} />
      <Gallery />
      <Testimonials />
      <ServiceArea />
      <HorizonDivider fill={THEME.colors.secondary} />
      <CTA />
      <Guarantee />
      <Contact />
      {/* HairlineDivider separates Contact and FAQSection — both share bg-surface-50 */}
      <HairlineDivider />
      <FAQSection />
    </>
  );
}
