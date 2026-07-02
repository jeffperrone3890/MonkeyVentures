'use client';

import { useState, useCallback, useRef } from 'react';
import type {
  StageId,
  StreamEvent,
  ImportSummary,
} from '@/lib/studio/types';
import { STAGE_ORDER, STAGE_LABELS, OUTPUT_TABS } from '@/lib/studio/types';
import type { OutputFiles } from '@/lib/pipeline/types';

// ─── Local types ──────────────────────────────────────────────────────────────

interface StageState {
  status: 'waiting' | 'running' | 'done' | 'error';
  ms?: number;
  error?: string;
}

type StagesState = Record<StageId, StageState>;
type RunStatus = 'idle' | 'running' | 'done' | 'error';

const INITIAL_STAGES: StagesState = {
  fetch:     { status: 'waiting' },
  extract:   { status: 'waiting' },
  normalize: { status: 'waiting' },
  generate:  { status: 'waiting' },
  score:     { status: 'waiting' },
  artifacts: { status: 'waiting' },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusIcon({ status }: { status: StageState['status'] }) {
  if (status === 'waiting') return <span className="text-neutral-600 w-4 inline-block">○</span>;
  if (status === 'running') return <span className="text-yellow-400 w-4 inline-block animate-pulse">◉</span>;
  if (status === 'done')    return <span className="text-green-400 w-4 inline-block">✓</span>;
  return                          <span className="text-red-400 w-4 inline-block">✗</span>;
}

function StageRow({ id, state }: { id: StageId; state: StageState }) {
  return (
    <div className="flex items-start gap-2 py-0.5">
      <StatusIcon status={state.status} />
      <span className={
        state.status === 'waiting'  ? 'text-neutral-500' :
        state.status === 'running'  ? 'text-yellow-300' :
        state.status === 'done'     ? 'text-neutral-200' :
        'text-red-300'
      }>
        {STAGE_LABELS[id]}
      </span>
      {state.ms !== undefined && state.status !== 'waiting' && (
        <span className="ml-auto text-neutral-500 tabular-nums">
          {state.ms.toLocaleString()}ms
        </span>
      )}
      {state.status === 'running' && state.ms === undefined && (
        <span className="ml-auto text-neutral-500">running…</span>
      )}
      {state.error && (
        <span className="block text-red-400 text-xs mt-0.5 col-span-full pl-6">
          {state.error}
        </span>
      )}
    </div>
  );
}

function SummaryBar({ summary }: { summary: ImportSummary }) {
  const parts = [
    summary.phone && `📞 ${summary.phone}`,
    summary.email && `✉ ${summary.email}`,
    (summary.city || summary.state) && [summary.city, summary.state].filter(Boolean).join(', '),
    summary.servicesFound > 0 && `${summary.servicesFound} services`,
    summary.locationsFound > 0 && `${summary.locationsFound} locations`,
    summary.reviewsFound > 0 && `${summary.reviewsFound} reviews`,
    summary.rating && `⭐ ${summary.rating}${summary.reviewCount ? ` (${summary.reviewCount})` : ''}`,
    summary.foundedYear && `est. ${summary.foundedYear}`,
  ].filter(Boolean);

  return (
    <div className="border-t border-neutral-800 px-4 py-2 text-xs text-neutral-400 flex flex-wrap gap-x-4 gap-y-0.5">
      <span className="text-neutral-600">{summary.resolvedUrl}</span>
      {parts.map((p, i) => <span key={i}>{p as string}</span>)}
      {summary.schemaTypes.length > 0 && (
        <span className="text-neutral-600">schema: {summary.schemaTypes.join(', ')}</span>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function StudioPage() {
  // Form
  const [businessName, setBusinessName] = useState('');
  const [websiteUrl, setWebsiteUrl]     = useState('');
  const [gbpUrl, setGbpUrl]             = useState('');

  // Pipeline state
  const [runStatus, setRunStatus]   = useState<RunStatus>('idle');
  const [stages, setStages]         = useState<StagesState>(INITIAL_STAGES);
  const [outputs, setOutputs]       = useState<OutputFiles | null>(null);
  const [summary, setSummary]       = useState<ImportSummary | null>(null);
  const [fatalError, setFatalError] = useState<string | null>(null);
  const [activeTab, setActiveTab]   = useState<keyof OutputFiles>('business.ts');

  // Timing
  const startTimeRef = useRef<number | null>(null);
  const [totalMs, setTotalMs] = useState<number | null>(null);

  const canRun = businessName.trim().length > 0 && websiteUrl.trim().length > 0;

  const handleGenerate = useCallback(async () => {
    if (!canRun || runStatus === 'running') return;

    // Reset
    setRunStatus('running');
    setOutputs(null);
    setSummary(null);
    setFatalError(null);
    setTotalMs(null);
    setStages(INITIAL_STAGES);
    startTimeRef.current = Date.now();

    try {
      const res = await fetch('/api/studio/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessName, websiteUrl, gbpUrl: gbpUrl || undefined }),
      });

      if (!res.ok || !res.body) {
        const text = await res.text().catch(() => '');
        throw new Error(`HTTP ${res.status}: ${text}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          let event: StreamEvent;
          try {
            event = JSON.parse(line.slice(6)) as StreamEvent;
          } catch {
            continue;
          }

          if (event.type === 'stage') {
            setStages((prev) => ({
              ...prev,
              [event.stage]: {
                status: event.status,
                ms:     event.ms,
                error:  event.error,
              },
            }));
          } else if (event.type === 'complete') {
            setOutputs(event.outputs);
            setSummary(event.summary);
            setTotalMs(startTimeRef.current ? Date.now() - startTimeRef.current : null);
            setRunStatus('done');
          } else if (event.type === 'error') {
            setFatalError(event.error);
            setTotalMs(startTimeRef.current ? Date.now() - startTimeRef.current : null);
            setRunStatus('error');
          }
        }
      }
    } catch (err) {
      setFatalError(err instanceof Error ? err.message : String(err));
      setTotalMs(startTimeRef.current ? Date.now() - startTimeRef.current : null);
      setRunStatus('error');
    }
  }, [businessName, websiteUrl, gbpUrl, canRun, runStatus]);

  const isRunning = runStatus === 'running';

  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-300 font-mono text-[13px] overflow-hidden">

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside className="w-64 flex-shrink-0 border-r border-neutral-800 flex flex-col">
        <div className="p-4 border-b border-neutral-800">
          <p className="text-neutral-500 text-[11px] uppercase tracking-widest">Summit Studio</p>
          <h1 className="text-white font-semibold mt-0.5">Pipeline Playground</h1>
        </div>

        <form
          className="flex-1 flex flex-col gap-4 p-4"
          onSubmit={(e) => { e.preventDefault(); void handleGenerate(); }}
        >
          <Field label="Business Name">
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Martinez Landscaping"
              disabled={isRunning}
              className={INPUT_CLS}
            />
          </Field>

          <Field label="Website URL">
            <input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://example.com"
              disabled={isRunning}
              className={INPUT_CLS}
            />
          </Field>

          <Field label="Google Maps URL" hint="optional">
            <input
              type="url"
              value={gbpUrl}
              onChange={(e) => setGbpUrl(e.target.value)}
              placeholder="https://maps.google.com/…"
              disabled={isRunning}
              className={INPUT_CLS}
            />
          </Field>

          <button
            type="submit"
            disabled={!canRun || isRunning}
            className={[
              'mt-auto w-full py-2 px-3 text-sm font-medium transition-colors',
              canRun && !isRunning
                ? 'bg-green-700 hover:bg-green-600 text-white cursor-pointer'
                : 'bg-neutral-800 text-neutral-500 cursor-not-allowed',
            ].join(' ')}
          >
            {isRunning ? 'Running…' : 'Generate'}
          </button>
        </form>
      </aside>

      {/* ── Main panel ──────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Progress */}
        <section className="border-b border-neutral-800 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-widest text-neutral-500">Pipeline</span>
            {totalMs !== null && (
              <span className="text-neutral-500 text-xs tabular-nums">
                {runStatus === 'error' ? '✗ failed' : `✓ ${totalMs.toLocaleString()}ms total`}
              </span>
            )}
            {runStatus === 'idle' && (
              <span className="text-neutral-600 text-xs">Enter inputs and click Generate</span>
            )}
          </div>

          <div className="space-y-0.5">
            {STAGE_ORDER.map((id) => (
              <StageRow key={id} id={id} state={stages[id]} />
            ))}
          </div>

          {fatalError && (
            <div className="mt-3 p-2 bg-red-950 border border-red-800 text-red-300 text-xs">
              {fatalError}
            </div>
          )}
        </section>

        {/* Summary bar */}
        {summary && <SummaryBar summary={summary} />}

        {/* Output tabs */}
        {outputs ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tab bar */}
            <div className="flex border-b border-neutral-800 bg-neutral-900">
              {OUTPUT_TABS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={[
                    'px-4 py-2 text-xs border-r border-neutral-800 transition-colors',
                    activeTab === key
                      ? 'bg-neutral-950 text-white border-b border-b-neutral-950'
                      : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800',
                  ].join(' ')}
                >
                  {label}
                </button>
              ))}

              {/* Copy button */}
              <CopyButton text={outputs[activeTab]} />
            </div>

            {/* Code output */}
            <pre className="flex-1 overflow-auto p-4 text-[12px] leading-relaxed text-neutral-300 whitespace-pre">
              {outputs[activeTab]}
            </pre>
          </div>
        ) : runStatus === 'idle' ? (
          <div className="flex-1 flex items-center justify-center text-neutral-600 text-xs">
            No output yet
          </div>
        ) : runStatus === 'error' && !outputs ? (
          <div className="flex-1 flex items-center justify-center text-neutral-600 text-xs">
            Pipeline failed — check stage errors above
          </div>
        ) : null}
      </main>
    </div>
  );
}

// ─── Utility components ───────────────────────────────────────────────────────

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-neutral-400 text-[11px] uppercase tracking-wider">
        {label}
        {hint && <span className="ml-1 text-neutral-600 normal-case">({hint})</span>}
      </label>
      {children}
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="ml-auto px-3 py-2 text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
    >
      {copied ? '✓ copied' : 'copy'}
    </button>
  );
}

const INPUT_CLS =
  'w-full bg-neutral-900 border border-neutral-700 text-neutral-200 px-2 py-1.5 text-[13px] placeholder-neutral-600 focus:outline-none focus:border-neutral-500 disabled:opacity-40';
