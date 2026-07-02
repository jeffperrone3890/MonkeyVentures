/**
 * Pipeline orchestrator.
 *
 * runPipeline() is the single entry point for the agency production workflow.
 * Feed it a PipelineInput and an AIProvider; get back a PipelineResult with
 * all generated content and five output artifact strings ready to write.
 *
 * Usage:
 *   const ai = new MockAIProvider(); // or AnthropicProvider in production
 *   const result = await runPipeline(input, ai);
 *   const outputs = buildOutputs(result);
 *   await writeOutputs(outputs, 'client-slug');
 */

import { extractGoogleBusiness, extractWebsiteContent, normalize } from './extract';
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
} from './generate';
import { scoreConfidence, createReviewQueue } from './score';
import { buildContext } from './ai';
import type { AIProvider } from './ai';
import type { PipelineInput, PipelineResult, GeneratedContent } from './types';

export { buildOutputs, writeOutputs } from './output';
export { MockAIProvider, buildContext } from './ai';
export type { AIProvider, BusinessContext } from './ai';
export type { PipelineInput, PipelineResult, OutputFiles } from './types';

// ─── Orchestrator ─────────────────────────────────────────────────────────────

/**
 * Run the full pipeline for a single business.
 *
 * Extraction runs in parallel (GBP + website are independent HTTP calls).
 * Content generation runs in parallel where possible.
 * Scoring and review queue derive from the generated output (sequential).
 */
export async function runPipeline(
  input: PipelineInput,
  ai: AIProvider,
): Promise<PipelineResult> {
  // ── Step 1: Extract ──────────────────────────────────────────────────────
  const [gbpData, webData] = await Promise.all([
    input.gbpUrl || input.gbpPlaceId
      ? extractGoogleBusiness(input.gbpUrl ?? input.gbpPlaceId ?? '')
      : Promise.resolve({}),
    extractWebsiteContent(input.websiteUrl),
  ]);

  // ── Step 2: Normalize ────────────────────────────────────────────────────
  const rawData = normalize(gbpData, webData, input.serviceArea);

  // ── Step 3: Build AI context ─────────────────────────────────────────────
  const context = buildContext(rawData);

  // ── Step 4: Generate content (parallel where independent) ────────────────
  const [
    businessStory,
    sectionCopy,
    proofPoints,
    faq,
    competitiveAdvantages,
    services,
    urgency,
    ctaStyle,
    stats,
  ] = await Promise.all([
    generateBusinessStory(rawData, context, ai),
    generateSectionCopy(rawData, context, ai),
    generateProofPoints(rawData, context, ai),
    generateFAQ(rawData, context, ai),
    generateCompetitiveAdvantages(rawData, context, ai),
    generateServices(rawData, context, ai),
    generateUrgency(rawData, context, ai),
    generateCTAStyle(rawData, context, ai),
    Promise.resolve(generateStats(rawData)),
  ]);

  // Benefits depend on competitiveAdvantages — run after
  const benefits = await generateBenefits(competitiveAdvantages.value, context, ai);

  // Tagline uses the same AI call pattern as other generators
  const tagline = await ai.generate(
    `Write a 6–10 word tagline for ${context.name}. Professional local landscaping tone. No clichés like "your vision, our passion."`,
    context,
  );

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

  // ── Step 5: Design brief + photo brief ───────────────────────────────────
  const [designBrief, photoBrief] = await Promise.all([
    generateDesignBrief(rawData, context, ai),
    Promise.resolve(generatePhotoBrief(rawData)),
  ]);

  // ── Step 6: Confidence scoring ───────────────────────────────────────────
  const confidenceReport = scoreConfidence(generated);
  const reviewQueue = createReviewQueue(confidenceReport);

  return {
    input,
    rawData,
    generated,
    designBrief,
    photoBrief,
    confidenceReport,
    reviewQueue,
  };
}
