export interface SafeJsonResult<T = any> {
  ok: boolean;
  isHtmlFallback: boolean;
  status: number;
  data: T | null;
  error: string | null;
}

/**
 * Safely fetches JSON from API or static asset endpoints without throwing
 * `Unexpected token '<', "<!DOCTYPE "... is not valid JSON` when a static
 * CDN/SPA host (e.g. Cloudflare Pages) rewrites unknown API routes to index.html.
 */
export async function fetchJsonSafe<T = any>(
  url: string,
  init?: RequestInit
): Promise<SafeJsonResult<T>> {
  try {
    const res = await fetch(url, init);
    const contentType = (res.headers.get('content-type') || '').toLowerCase();
    const text = await res.text();
    const trimmed = text.trimStart();

    if (trimmed.startsWith('<') || contentType.includes('text/html')) {
      return {
        ok: false,
        isHtmlFallback: true,
        status: res.status,
        data: null,
        error: `Endpoint ${url} returned HTML instead of JSON (static host SPA fallback)`
      };
    }

    if (!trimmed) {
      return {
        ok: false,
        isHtmlFallback: false,
        status: res.status,
        data: null,
        error: `Endpoint ${url} returned an empty response body`
      };
    }

    let parsed: any = null;
    try {
      parsed = JSON.parse(text);
    } catch (parseErr: any) {
      return {
        ok: false,
        isHtmlFallback: false,
        status: res.status,
        data: null,
        error: parseErr?.message || `Invalid JSON received from ${url}`
      };
    }

    if (!res.ok) {
      return {
        ok: false,
        isHtmlFallback: false,
        status: res.status,
        data: parsed as T,
        error: parsed?.message || parsed?.error || `HTTP ${res.status} from ${url}`
      };
    }

    return {
      ok: true,
      isHtmlFallback: false,
      status: res.status,
      data: parsed as T,
      error: null
    };
  } catch (err: any) {
    return {
      ok: false,
      isHtmlFallback: false,
      status: 0,
      data: null,
      error: err?.message || `Network failure reaching ${url}`
    };
  }
}
