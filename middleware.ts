import { next, rewrite } from '@vercel/functions';
import { getDiscoveryLinks, getMarkdownPath, selectRepresentation } from './src/lib/agent-representation.mjs';

// Vercel Routing Middleware, outside src/: runs before the static-file cache.
// Keep a literal matcher so Vercel can analyze it without executing imports.
export const config = {
  matcher: ['/', '/budowa-domow-pod-klucz', '/domy-na-sprzedaz-bielsko', '/projekty-domow'],
};

export default function middleware(request: Request) {
  const url = new URL(request.url);
  const markdown = getMarkdownPath(url.pathname);
  if (!markdown || !['GET', 'HEAD'].includes(request.method)) return next();
  const headers = new Headers({ Vary: 'Accept', Link: getDiscoveryLinks(url.pathname)! });
  if (selectRepresentation(request.headers.get('accept')) === 'markdown') {
    const target = new URL(markdown, url.origin);
    headers.set('Content-Type', 'text/markdown; charset=utf-8');
    headers.set('Cache-Control', 'private, no-store');
    return rewrite(target, { headers });
  }
  return next({ headers });
}
