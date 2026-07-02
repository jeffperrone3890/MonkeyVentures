/**
 * POST /api/importer
 *
 * Import a business homepage and extract structured data.
 *
 * Request body:
 *   { "businessName": "Martinez Landscaping", "websiteUrl": "https://example.com" }
 *
 * Response (200):
 *   { "ok": true, "input": {...}, "raw": {...}, "context": {...}, "extractedAt": "..." }
 *
 * Response (4xx / 5xx):
 *   { "ok": false, "error": "..." }
 *
 * Usage from the terminal:
 *   curl -s -X POST http://localhost:3000/api/importer \
 *     -H "Content-Type: application/json" \
 *     -d '{"businessName":"Martinez Landscaping","websiteUrl":"https://example.com"}' \
 *     | jq .
 */

import { NextResponse } from 'next/server';
import { runImport } from '@/lib/importer';

interface ImportBody {
  businessName?: unknown;
  websiteUrl?: unknown;
}

export async function POST(request: Request) {
  // ── Parse body ──────────────────────────────────────────────────────────
  let body: ImportBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body.' }, { status: 400 });
  }

  // ── Validate ─────────────────────────────────────────────────────────────
  const businessName =
    typeof body.businessName === 'string' ? body.businessName.trim() : '';
  const websiteUrl =
    typeof body.websiteUrl === 'string' ? body.websiteUrl.trim() : '';

  if (!businessName) {
    return NextResponse.json(
      { ok: false, error: 'businessName is required.' },
      { status: 422 },
    );
  }
  if (!websiteUrl) {
    return NextResponse.json(
      { ok: false, error: 'websiteUrl is required.' },
      { status: 422 },
    );
  }

  // Validate URL format
  try {
    const parsed = new URL(websiteUrl);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      throw new Error('Protocol must be http or https');
    }
  } catch {
    return NextResponse.json(
      { ok: false, error: 'websiteUrl must be a valid http(s) URL.' },
      { status: 422 },
    );
  }

  // ── Run import ────────────────────────────────────────────────────────────
  try {
    const result = await runImport({ businessName, websiteUrl });
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Import failed.';
    console.error('[importer]', message, err);
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}
