import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { PageCTA } from '@/components/seo/PageCTA';
import { BeforeAfterSlider } from '@/components/ui/BeforeAfterSlider';
import { BUSINESS, GALLERY } from '@/data/business';
import {
  slugToProject,
  projectBreadcrumbs,
  generateProjectMetadata,
  generateProjectJsonLd,
  generateBreadcrumbJsonLd,
} from '@/lib/seo';

interface Props {
  params: { slug: string };
}

/** One static route per gallery project — e.g. /projects/paver-patio */
export function generateStaticParams() {
  return GALLERY.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = slugToProject(params.slug, GALLERY);
  if (!project) return {};
  return generateProjectMetadata(project, BUSINESS);
}

export default function ProjectPage({ params }: Props) {
  const project = slugToProject(params.slug, GALLERY);
  if (!project) notFound();

  const crumbs = projectBreadcrumbs(project);

  // Related projects — all others
  const related = GALLERY.filter((p) => p.slug !== project.slug).slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateProjectJsonLd(project, BUSINESS),
            generateBreadcrumbJsonLd(crumbs, BUSINESS.url),
          ]),
        }}
      />

      {/* Page header */}
      <Section tone="paper">
        <Container>
          <Breadcrumbs items={crumbs} />

          <div className="mt-8 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              {project.category}
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-secondary sm:text-5xl">
              {project.title}
            </h1>
            {project.description && (
              <p className="mt-5 max-w-[58ch] text-[17px] leading-relaxed text-muted">
                {project.description}
              </p>
            )}
          </div>
        </Container>
      </Section>

      {/* Before/after slider */}
      <Section tone="sage">
        <Container>
          <div className="mx-auto max-w-4xl">
            <BeforeAfterSlider
              before={project.before}
              after={project.after}
              initialPosition={35}
            />
            <div className="mt-6 flex justify-between text-xs text-muted">
              <span>Before</span>
              <span>Drag to compare</span>
              <span>After</span>
            </div>
          </div>
        </Container>
      </Section>

      {/* Context */}
      <Section tone="paper">
        <Container>
          <div className="max-w-[56ch]">
            <h2 className="font-display text-2xl font-semibold text-secondary">
              About this project
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-muted">
              {project.description ?? `This ${project.category.toLowerCase()} project is an example of the work ${BUSINESS.shortName} delivers across ${BUSINESS.address.county}.`}
            </p>
            <p className="mt-5 text-sm text-muted">
              {BUSINESS.shortName} · {BUSINESS.address.county}, {BUSINESS.address.regionName} ·{' '}
              {BUSINESS.credentials.insuranceAmount}
            </p>
          </div>
        </Container>
      </Section>

      {/* More projects */}
      {related.length > 0 && (
        <Section tone="sage">
          <Container>
            <h2 className="font-display text-2xl font-semibold text-secondary">
              More of our work
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {related.map((p) => (
                <a
                  key={p.slug}
                  href={`/projects/${p.slug}`}
                  className="group block"
                >
                  <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    {p.category}
                  </span>
                  <span className="mt-2 block font-display text-lg font-semibold text-secondary transition-colors group-hover:text-primary">
                    {p.title}
                  </span>
                  {p.description && (
                    <span className="mt-1.5 block text-sm leading-relaxed text-muted line-clamp-2">
                      {p.description}
                    </span>
                  )}
                </a>
              ))}
            </div>
          </Container>
        </Section>
      )}

      <PageCTA
        heading="Interested in a project like this?"
        subhead={`${BUSINESS.ctaStyle.micro}`}
      />
    </>
  );
}
