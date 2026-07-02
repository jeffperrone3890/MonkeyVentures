import type { OutputFiles } from '@/lib/pipeline/types';

export type StageId = 'fetch' | 'extract' | 'normalize' | 'generate' | 'score' | 'artifacts';

export const STAGE_ORDER: StageId[] = [
  'fetch',
  'extract',
  'normalize',
  'generate',
  'score',
  'artifacts',
];

export const STAGE_LABELS: Record<StageId, string> = {
  fetch:     'Website import',
  extract:   'Extraction',
  normalize: 'Normalization',
  generate:  'AI generation',
  score:     'Confidence scoring',
  artifacts: 'Artifact creation',
};

export interface StudioInput {
  businessName: string;
  websiteUrl: string;
  gbpUrl?: string;
}

export interface StageEvent {
  stage: StageId;
  status: 'running' | 'done' | 'error';
  ms?: number;
  error?: string;
}

/** Sent over SSE after all stages complete. */
export interface ImportSummary {
  resolvedUrl: string;
  title: string | null;
  phone: string | null;
  email: string | null;
  city: string | null;
  state: string | null;
  servicesFound: number;
  locationsFound: number;
  reviewsFound: number;
  schemaTypes: string[];
  rating: number | null;
  reviewCount: number | null;
  foundedYear: number | null;
}

export type StreamEvent =
  | ({ type: 'stage' } & StageEvent)
  | { type: 'complete'; outputs: OutputFiles; summary: ImportSummary }
  | { type: 'error'; error: string };

/** Tab definitions — keyed to OutputFiles. */
export const OUTPUT_TABS: Array<{ key: keyof OutputFiles; label: string }> = [
  { key: 'business.ts',        label: 'business.ts' },
  { key: '_review_queue.md',   label: 'Review Queue' },
  { key: '_confidence.json',   label: 'Confidence JSON' },
  { key: '_design_brief.md',   label: 'Design Brief' },
  { key: '_photo_brief.md',    label: 'Photo Brief' },
];
