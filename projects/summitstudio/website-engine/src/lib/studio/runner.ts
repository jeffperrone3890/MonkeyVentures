/**
 * Studio pipeline runner.
 *
 * Runs each stage manually so timing can be reported between steps.
 * Calls the same underlying functions as runPipeline() but with a
 * stage-event callback instead of being a monolithic operation.
 *
 * Bridges Sprint 11 (real web importer) → Sprint 10 (AI generation pipeline).
 */

import { fetchPage } from '@/lib/importer/fetch';
import {
  extractSchemaOrg,
  extractTitle,
  extractMetaDescription,
  extractHeadings,
  extractPhone,
  extractEmail,
  extractAddress,
  extractServices,
  extractLocations,
  extractReviews,
  extractOpeningHours,
  extractRating,
  extractFoundedYear,
  extractSchemaTypes,
} from '@/lib/importer/parse';
import type { RawPageData } from '@/lib/importer/types';
import { extractGoogleBusiness, normalize } from '@/lib/pipeline/extract';
import { buildContext, MockAIProvider } from '@/lib/pipeline/ai';
import type { RawGBPData, RawWebData, RawBusinessData, GeneratedContent, PipelineResult, DesignBrief, PhotoBrief, ConfidenceReport, ReviewQueueItem, OutputFiles } from '@/lib/pipeline/types';
import type { BusinessContext } from '@/lib/pipeline/ai';
import {
  generateBusinessStory,
  generateSectionCopy,
  generateProofPoints,
  generateFAQ,
  generateCompetitiveAdvantages,
  generateServices,
  generateBenefits,
  generateStats,
  generateCTAStyle,
  generateUrgency,
  generateDesignBrief,
  generatePhotoBrief,
} from '@/lib/pipeline/generate';
import { scoreConfidence, createReviewQueue } from '@/lib/pipeline/score';
import { buildOutputs } from '@/lib/pipeline/output';
import type { StudioInput, StageId, StageEvent, ImportSummary } from './types';

// ─── Result shape ─────────────────────────────────────────────────────────────

export interface StudioResult {
  rawImport: RawPageData;
  rawData: RawBusinessData;
  context: BusinessContext;
  generated: GeneratedContent;
  designBrief: DesignBrief;
  photoBrief: PhotoBrief;
  confidenceReport: ConfidenceReport;
  reviewQueue: ReviewQueueItem[];
  outputs: OutputFiles;
  summary: ImportSummary;
}

// ─── Runner ───────────────────────────────────────────────────────────────────

/**
 * Execute each pipeline stage in order, reporting timing events between steps.
 * Throws on the first stage error (the caller should catch and send an error event).
 */
export async function runStudioPipeline(
  input: StudioInput,
  onStage: (event: StageEvent) => void,
): Promise<StudioResult> {
  const ai = new MockAIProvider();

  // ── Stage 1: Fetch ───────────────────────────────────────────────────────
  const fetchResult = await timed('fetch', () => fetchPage(input.websiteUrl), onStage);

  // ── Stage 2: Extract ─────────────────────────────────────────────────────
  const rawImport = await timed('extract', async () => {
    const { html, resolvedUrl } = fetchResult;
    const entities = extractSchemaOrg(html);
    const ratingData = extractRating(entities);

    return {
      url: input.websiteUrl,
      resolvedUrl,
      title: extractTitle(html),
      description: extractMetaDescription(html),
      headings: extractHeadings(html),
      phone: extractPhone(html, entities),
      email: extractEmail(html, entities),
      address: extractAddress(entities),
      services: extractServices(html, entities),
      locations: extractLocations(html, entities),
      reviews: extractReviews(entities),
      openingHours: extractOpeningHours(entities),
      rating: ratingData?.rating ?? null,
      reviewCount: ratingData?.reviewCount ?? null,
      foundedYear: extractFoundedYear(html, entities),
      schemaTypes: extractSchemaTypes(entities),
    } satisfies RawPageData;
  }, onStage);

  // ── Stage 3: Normalize ───────────────────────────────────────────────────
  const { rawData, context } = await timed('normalize', async () => {
    // GBP: use provided URL if available; fall back to empty (returns mock)
    let gbpData: RawGBPData = {};
    if (input.gbpUrl) {
      try {
        gbpData = await extractGoogleBusiness(input.gbpUrl);
      } catch {
        // Non-fatal: continue without GBP data
      }
    }

    const webData = adaptToRawWebData(rawImport);
    const serviceArea = rawImport.locations.slice(0, 5).join(', ') || rawImport.address?.city || 'Local';
    const rawData = normalize(gbpData, webData, serviceArea);

    // User-provided name always wins
    rawData.name = input.businessName;
    rawData.shortName = input.businessName
      .replace(/\s*(?:LLC|Inc\.?|Corp\.?|Co\.?|Ltd\.?),?\.?$/i, '')
      .trim();

    const context = buildContext(rawData);
    return { rawData, context };
  }, onStage);

  // ── Stage 4: Generate ────────────────────────────────────────────────────
  const { generated, designBrief, photoBrief } = await timed('generate', async () => {
    const [
      businessStory,
      sectionCopy,
      proofPoints,
      faq,
      competitiveAdvantages,
      services,
      urgency,
      ctaStyle,
    ] = await Promise.all([
      generateBusinessStory(rawData, context, ai),
      generateSectionCopy(rawData, context, ai),
      generateProofPoints(rawData, context, ai),
      generateFAQ(rawData, context, ai),
      generateCompetitiveAdvantages(rawData, context, ai),
      generateServices(rawData, context, ai),
      generateUrgency(rawData, context, ai),
      generateCTAStyle(rawData, context, ai),
    ]);

    const stats = generateStats(rawData);
    const benefits = await generateBenefits(competitiveAdvantages.value, context, ai);
    const tagline = await ai.generate(
      `Write a 6–10 word tagline for ${context.name}. Professional local landscaping tone. No clichés.`,
      context,
    );

    const [designBrief, photoBrief] = await Promise.all([
      generateDesignBrief(rawData, context, ai),
      Promise.resolve(generatePhotoBrief(rawData)),
    ]);

    const generated: GeneratedContent = {
      tagline: { value: tagline, score: 0.50, source: 'ai-generated', flagged: true },
      businessStory,
      sectionCopy,
      ctaStyle,
      proofPoints,
      faq,
      competitiveAdvantages,
      urgency,
      services,
      benefits,
      stats,
    };

    return { generated, designBrief, photoBrief };
  }, onStage);

  // ── Stage 5: Score ───────────────────────────────────────────────────────
  const { confidenceReport, reviewQueue } = await timed('score', async () => {
    const confidenceReport = scoreConfidence(generated);
    const reviewQueue = createReviewQueue(confidenceReport);
    return { confidenceReport, reviewQueue };
  }, onStage);

  // ── Stage 6: Artifacts ───────────────────────────────────────────────────
  const outputs = await timed('artifacts', async () => {
    const pipelineResult: PipelineResult = {
      input: {
        websiteUrl: input.websiteUrl,
        gbpUrl: input.gbpUrl,
        serviceArea: rawData.serviceArea ?? 'Local',
      },
      rawData,
      generated,
      designBrief,
      photoBrief,
      confidenceReport,
      reviewQueue,
    };
    return buildOutputs(pipelineResult);
  }, onStage);

  const summary: ImportSummary = {
    resolvedUrl: rawImport.resolvedUrl,
    title: rawImport.title,
    phone: rawImport.phone,
    email: rawImport.email,
    city: rawImport.address?.city ?? null,
    state: rawImport.address?.region ?? null,
    servicesFound: rawImport.services.length,
    locationsFound: rawImport.locations.length,
    reviewsFound: rawImport.reviews.length,
    schemaTypes: rawImport.schemaTypes,
    rating: rawImport.rating,
    reviewCount: rawImport.reviewCount,
    foundedYear: rawImport.foundedYear,
  };

  return {
    rawImport,
    rawData,
    context,
    generated,
    designBrief,
    photoBrief,
    confidenceReport,
    reviewQueue,
    outputs,
    summary,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Run `fn`, send running/done/error events, return the result. */
async function timed<T>(
  stage: StageId,
  fn: () => Promise<T>,
  onStage: (event: StageEvent) => void,
): Promise<T> {
  const t = Date.now();
  onStage({ stage, status: 'running' });
  try {
    const result = await fn();
    onStage({ stage, status: 'done', ms: Date.now() - t });
    return result;
  } catch (err) {
    onStage({
      stage,
      status: 'error',
      ms: Date.now() - t,
      error: err instanceof Error ? err.message : String(err),
    });
    throw err;
  }
}

/** Convert importer RawPageData to pipeline RawWebData. */
function adaptToRawWebData(raw: RawPageData): RawWebData {
  return {
    url: raw.resolvedUrl,
    title: raw.title ?? undefined,
    description: raw.description ?? undefined,
    // Homepage-only: meta description is the closest we have to "about" text
    about: raw.description ?? undefined,
    phone: raw.phone ?? undefined,
    email: raw.email ?? undefined,
    foundedYear: raw.foundedYear ?? undefined,
    services: raw.services.map((name) => ({
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    })),
    serviceTowns: raw.locations
      .map((l) => l.split(',')[0]?.trim() ?? l)
      .filter(Boolean),
    testimonials: raw.reviews.map((r) => ({
      quote: r.text,
      author: r.author,
      rating: r.rating,
    })),
  };
}
