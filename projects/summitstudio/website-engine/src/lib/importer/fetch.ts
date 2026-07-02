const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';

const TIMEOUT_MS = 12_000;

export interface FetchedPage {
  html: string;
  resolvedUrl: string;
}

/**
 * Download a webpage and return its HTML.
 *
 * Uses a real browser User-Agent to avoid most bot-detection blocks.
 * Times out after 12 seconds. Rejects non-HTML responses.
 */
export async function fetchPage(url: string): Promise<FetchedPage> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      cache: 'no-store',
      headers: {
        'User-Agent': UA,
        Accept: 'text/html,application/xhtml+xml,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
  } catch (err) {
    if ((err as Error).name === 'AbortError') {
      throw new Error(`Timed out fetching ${url} after ${TIMEOUT_MS / 1000}s`);
    }
    throw new Error(`Network error fetching ${url}: ${(err as Error).message}`);
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText} fetching ${url}`);
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('text/html') && !contentType.includes('application/xhtml')) {
    throw new Error(`Expected HTML, got "${contentType}" from ${url}`);
  }

  const html = await response.text();
  return { html, resolvedUrl: response.url };
}
