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
import { company } from '../data/company.mjs';


/** @param {URL | string} site */
export function getBusinessSchema(site) {
  const url = getCanonicalUrl('/', site);
  return {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': `${url}#organization`,
    name: company.name,
    url,
    logo: new URL('/logo.png', site).href,
    image: new URL('/og-image.jpg', site).href,
    telephone: company.telephone,
    email: company.email,
    address: { '@type': 'PostalAddress', ...company.address },
    areaServed: company.citiesServed.map((name) => ({ '@type': 'City', name })),
  };
}

/** @param {URL | string} site */
export function getServiceSchema(site) {
  const url = getCanonicalUrl('/budowa-domow-pod-klucz', site);
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${url}#service`,
    name: 'Budowa domów pod klucz',
    serviceType: 'Budowa domów pod klucz',
    description: 'Budowa domów jednorodzinnych w Bielsku-Białej i okolicach: od fundamentów przez stan surowy i deweloperski po wykończenie pod klucz.',
    url,
    provider: { '@id': `${getCanonicalUrl('/', site)}#organization` },
    areaServed: company.citiesServed.map((name) => ({ '@type': 'City', name })),
  };
}

/** @param {Record<string, unknown>} value */
export function serializeJsonLd(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
