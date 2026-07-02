/**
 * POST /api/studio/run
 *
 * Runs the full automation pipeline and streams stage progress as
 * Server-Sent Events (SSE). The client reads with fetch() + ReadableStream.
 *
 * Events:
 *   data: {"type":"stage","stage":"fetch","status":"running"}
 *   data: {"type":"stage","stage":"fetch","status":"done","ms":1234}
 *   data: {"type":"complete","outputs":{...},"summary":{...}}
 *   data: {"type":"error","error":"..."}
 *
 * ⚠ Internal tool only — this endpoint makes outbound HTTP requests to
 *   whatever URL is provided. Never expose publicly.
 */

import type { StreamEvent, StudioInput } from '@/lib/studio/types';
import { runStudioPipeline } from '@/lib/studio/runner';

const enc = new TextEncoder();

function sseChunk(event: StreamEvent): Uint8Array {
  return enc.encode(`data: ${JSON.stringify(event)}\n\n`);
}

export async function POST(request: Request) {
  // ── Parse + validate input ───────────────────────────────────────────────
  let body: Partial<StudioInput>;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ ok: false, error: 'Invalid JSON body.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const businessName = typeof body.businessName === 'string' ? body.businessName.trim() : '';
  const websiteUrl = typeof body.websiteUrl === 'string' ? body.websiteUrl.trim() : '';
  const gbpUrl = typeof body.gbpUrl === 'string' ? body.gbpUrl.trim() || undefined : undefined;

  if (!businessName) {
    return new Response(
      JSON.stringify({ ok: false, error: 'businessName is required.' }),
      { status: 422, headers: { 'Content-Type': 'application/json' } },
    );
  }

  try {
    new URL(websiteUrl);
  } catch {
    return new Response(
      JSON.stringify({ ok: false, error: 'websiteUrl must be a valid http(s) URL.' }),
      { status: 422, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const input: StudioInput = { businessName, websiteUrl, gbpUrl };

  // ── SSE stream ────────────────────────────────────────────────────────────
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const result = await runStudioPipeline(input, (stageEvent) => {
          controller.enqueue(sseChunk({ type: 'stage', ...stageEvent }));
        });

        controller.enqueue(
          sseChunk({
            type: 'complete',
            outputs: result.outputs,
            summary: result.summary,
          }),
        );
      } catch (err) {
        const error = err instanceof Error ? err.message : String(err);
        controller.enqueue(sseChunk({ type: 'error', error }));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no', // disable nginx buffering in production
    },
  });
}
