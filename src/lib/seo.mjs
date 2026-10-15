/**
 * Keep the configured origin even for protocol-relative or tracked paths.
 * @param {string} pathname
 * @param {URL | string} site
 */
export function getCanonicalUrl(pathname, site) {
  const canonical = new URL(site);
  canonical.pathname = pathname.split(/[?#]/, 1)[0].replace(/\/{2,}/g, '/').replace(/\/+$/, '') || '/';
  canonical.search = '';
  canonical.hash = '';
  return canonical.href;
}
