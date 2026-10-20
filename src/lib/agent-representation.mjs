// Shared by Routing Middleware, generated assets and the HTML layout.
export const publicPages = Object.freeze([
  { pathname: '/', markdown: '/index.md', file: 'index.html' },
  { pathname: '/budowa-domow-pod-klucz', markdown: '/budowa-domow-pod-klucz.md', file: 'budowa-domow-pod-klucz/index.html' },
  { pathname: '/domy-na-sprzedaz-bielsko', markdown: '/domy-na-sprzedaz-bielsko.md', file: 'domy-na-sprzedaz-bielsko/index.html' },
  { pathname: '/projekty-domow', markdown: '/projekty-domow.md', file: 'projekty-domow/index.html' },
  { pathname: '/inwestycje/pisarzowice-etap-ii', markdown: '/inwestycje/pisarzowice-etap-ii.md', file: 'inwestycje/pisarzowice-etap-ii/index.html' },
]);

export function getMarkdownPath(pathname) {
  return publicPages.find((page) => page.pathname === pathname)?.markdown ?? null;
}

export function getDiscoveryLinks(pathname) {
  const markdown = getMarkdownPath(pathname);
  if (!markdown) return null;
  return [
    `<${new URL(pathname, 'https://www.investdom.com.pl').href}>; rel="canonical"`,
    '</agent-guide.md>; rel="describedby"; type="text/markdown"',
    `<${markdown}>; rel="alternate"; type="text/markdown"`,
    '</.well-known/ai-catalog.json>; rel="ai-catalog"; type="application/json"',
  ].join(', ');
}

// Respect quoted separators; these can occur in media parameters.
function splitHeader(value, separator) {
  const parts = [];
  let start = 0;
  let quoted = false;
  let escaped = false;
  for (let i = 0; i < value.length; i++) {
    const char = value[i];
    if (escaped) { escaped = false; continue; }
    if (quoted && char === '\\') { escaped = true; continue; }
    if (char === '"') quoted = !quoted;
    if (char === separator && !quoted) { parts.push(value.slice(start, i)); start = i + 1; }
  }
  parts.push(value.slice(start));
  return parts;
}

export function selectRepresentation(accept) {
  if (typeof accept !== 'string' || accept.length > 8192) return 'html';
  const ranges = splitHeader(accept, ',').map((part) => {
    const [media, ...parameters] = splitHeader(part, ';').map((s) => s.trim().toLowerCase());
    let quality = 1;
    let valid = true;
    let matches = true;
    let qualitySeen = false;
    for (const parameter of parameters) {
      const [key, ...rest] = parameter.split('=');
      const value = rest.join('=').trim();
      if (key.trim() === 'q') {
        if (qualitySeen || !/^(?:0(?:\.\d{0,3})?|1(?:\.0{0,3})?)$/.test(value)) valid = false;
        qualitySeen = true;
        quality = Number(value);
      } else if (!qualitySeen && !(key.trim() === 'charset' && /^(?:utf-8|"utf-8")$/.test(value))) {
        matches = false; // Unsupported parameters do not exclude an offered representation.
      }
    }
    return { media, matches, quality: valid ? quality : 0 };
  }).filter((range) => range.matches);
  function qualityFor(media) {
    let bestSpecificity = -1;
    let quality = 0;
    for (const range of ranges) {
      const specificity = range.media === media ? 2 : range.media === 'text/*' ? 1 : range.media === '*/*' ? 0 : -1;
      if (specificity > bestSpecificity) { bestSpecificity = specificity; quality = range.quality; }
      else if (specificity >= 0 && specificity === bestSpecificity) quality = Math.min(quality, range.quality);
    }
    return quality;
  }
  // Wildcards by themselves keep the normal HTML page. Ambiguous duplicate
  // media ranges are resolved conservatively using their lowest quality.
  const markdown = qualityFor('text/markdown');
  return ranges.some((range) => range.media === 'text/markdown') && markdown > 0 && markdown >= qualityFor('text/html')
    ? 'markdown' : 'html';
}
