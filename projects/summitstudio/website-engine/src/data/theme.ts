/**
 * Active-business theme resolver. Stable import path every component and
 * tailwind.config.ts uses ('@/data/theme') — it never holds brand values
 * itself. Picks one entry from src/data/businesses/registry.ts based on
 * NEXT_PUBLIC_ACTIVE_BUSINESS and re-exports that business's theme.
 *
 * To work on a specific business's brand identity, edit its file directly
 * under src/data/businesses/<slug>/theme.ts — not this file.
 */
import { BUSINESS_REGISTRY, getActiveBusinessSlug } from './businesses/registry';

export const THEME = BUSINESS_REGISTRY[getActiveBusinessSlug()].theme.THEME;
