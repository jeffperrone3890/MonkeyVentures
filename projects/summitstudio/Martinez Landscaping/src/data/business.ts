/**
 * Active-business resolver. This file is the stable import path every
 * component uses ('@/data/business') — it never holds content itself.
 * It picks one entry from src/data/businesses/registry.ts based on
 * NEXT_PUBLIC_ACTIVE_BUSINESS and re-exports that business's data.
 *
 * To work on a specific business's content, edit its file directly under
 * src/data/businesses/<slug>/business.ts — not this file.
 */
import type { LucideIcon } from 'lucide-react';
import { BUSINESS_REGISTRY, getActiveBusinessSlug } from './businesses/registry';

const active = BUSINESS_REGISTRY[getActiveBusinessSlug()].business;

export const BUSINESS = active.BUSINESS;
export const SEO_KEYWORDS = active.SEO_KEYWORDS;
export const SERVICES = active.SERVICES;
export const BENEFITS = active.BENEFITS;
export const STATS = active.STATS;
export const TESTIMONIALS = active.TESTIMONIALS;
export const GALLERY = active.GALLERY;
export const SERVICE_TOWNS = active.SERVICE_TOWNS;
export const PROCESS = active.PROCESS;
export type { LucideIcon };
