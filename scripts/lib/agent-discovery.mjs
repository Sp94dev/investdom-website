import { createHash } from 'node:crypto';
import { company } from '../../src/data/company.mjs';
import { publicPages } from '../../src/lib/agent-representation.mjs';

const productionOrigin = 'https://www.investdom.com.pl';
const skillPath = '/.well-known/agent-skills/poznaj-investdom/SKILL.md';
const description = 'Odczytywanie publicznych informacji o budowie domów, inwestycjach i kontakcie z INVESTDOM.';

export function getDeploymentOrigin(env = process.env) {
  if (env.VERCEL_ENV !== 'preview') return productionOrigin;
  if (!/^[a-z0-9][a-z0-9.-]*\.vercel\.app$/i.test(env.VERCEL_URL ?? '')) throw new Error('Missing or invalid Vercel preview hostname');
  return `https://${env.VERCEL_URL}`;
}

export function getDiscoveryAssets(origin = productionOrigin) {
  const parsed = new URL(origin);
  if (parsed.protocol !== 'https:' || parsed.username || parsed.password || parsed.pathname !== '/' || parsed.search || parsed.hash) {
    throw new Error('Discovery origin must be a clean HTTPS origin');
  }
  origin = parsed.origin;
  const url = (path) => new URL(path, origin).href;
  const address = `${company.address.streetAddress}, ${company.address.postalCode} ${company.address.addressLocality}`;
  const sources = publicPages.map((page) => `- [${page.pathname === '/' ? 'Strona główna' : page.pathname.slice(1)}](${new URL(page.pathname, productionOrigin)}) — [Markdown](${url(page.markdown)}).`).join('\n');
  const guide = `# INVESTDOM — informacje dla agentów\n\nFirma buduje domy jednorodzinne w Bielsku-Białej i okolicach. Nie świadczy usług remontowych.\n\n## Źródła informacji\n\n${sources}\n\n## Kontakt\n\n- Telefon: [${company.telephoneDisplay}](tel:${company.telephone})\n- Email publikowany na stronie: [${company.email}](mailto:${company.email})\n- Adres: ${address}\n- [Profil firmy przekazany przez właściciela](${company.googleBusinessProfile})\n\n## Odczytywanie oferty\n\nCzytaj bieżącą stronę i odróżniaj etap inwestycji od etapu przedstawionego na zdjęciu. Szczegóły ceny, dostępność, zakres i termin potwierdza firma. Nie wyliczaj ani nie obiecuj wiążącej wyceny.\n\nPrzy odpowiedzi podaj źródłowy adres strony. Kontakt z firmą i przesłanie danych wymagają decyzji użytkownika; ten przewodnik niczego nie wysyła i nie udziela takiej zgody.\n`;
  const skill = `---\nname: poznaj-investdom\ndescription: ${JSON.stringify(description)}\n---\n\n${guide}`;
  const index = {
    $schema: 'https://schemas.agentskills.io/discovery/0.2.0/schema.json',
    skills: [{ name: 'poznaj-investdom', description, type: 'skill-md', url: url(skillPath), digest: `sha256:${createHash('sha256').update(skill).digest('hex')}` }],
  };
  const catalog = {
    specVersion: '1.0',
    entries: [{
      identifier: 'urn:air:www.investdom.com.pl:skill:poznaj-investdom',
      displayName: 'INVESTDOM — publiczne informacje i kontakt',
      type: 'text/markdown; profile="urn:air:agent-skills"',
      url: url(skillPath),
      representativeQueries: ['Jak skontaktować się z INVESTDOM?', 'Gdzie znaleźć informacje o budowie domu przez INVESTDOM?', 'Gdzie sprawdzić aktualną ofertę inwestycji INVESTDOM?'],
    }],
  };
  const llms = `# INVESTDOM\n\n> Publiczne informacje o budowie domów jednorodzinnych w Bielsku-Białej i okolicach.\n\n## Strony\n\n${sources}\n\n## Kontakt i odczytywanie informacji\n\n- [Przewodnik](${url('/agent-guide.md')})\n- [Źródłowa sekcja kontaktu](${productionOrigin}/#kontakt)\n`;
  return {
    '/agent-guide.md': guide,
    '/llms.txt': llms,
    [skillPath]: skill,
    '/.well-known/agent-skills/index.json': JSON.stringify(index, null, 2) + '\n',
    '/.well-known/ai-catalog.json': JSON.stringify(catalog, null, 2) + '\n',
  };
}
