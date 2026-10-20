import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

import { selectRepresentation, getMarkdownPath, getDiscoveryLinks, publicPages } from '../src/lib/agent-representation.mjs';

for (const [accept, expected] of [
  [null, 'html'], ['', 'html'], ['*/*', 'html'], ['text/*', 'html'],
  ['text/html', 'html'], ['application/json', 'html'],
  ['text/markdown', 'markdown'], ['TEXT/MARKDOWN; charset=utf-8', 'markdown'],
  ['text/html;q=0.5,text/markdown;q=0.9', 'markdown'],
  ['text/markdown;q=0.9,text/html;q=0.5', 'markdown'],
  ['text/markdown;q=0.2,text/html;q=0.9', 'html'],
  ['text/html,text/markdown', 'markdown'],
  ['text/markdown;q=0,*/*;q=1', 'html'],
  ['text/markdown;q=0,text/*;q=1', 'html'],
  ['text/markdown;q=0.1,text/*;q=1', 'html'],
  ['text/markdown;q=0.8,text/html;q=0,*/*;q=1', 'markdown'],
  ['text/markdown;q=invalid', 'html'], ['text/markdown;q=1.1', 'html'],
  ['text/markdown;q=-1', 'html'], ['text/markdown;q=0.000', 'html'],
  ['text/markdown;q=0.0001', 'html'], ['text/markdown;q=1.001', 'html'],
  ['text/markdown;profile=unknown', 'html'],
  ['text/markdown; note="x,y";q=1', 'html'],
  ['text/html;profile=unknown, text/markdown;q=0.5, */*;q=1', 'html'],
]) test(`Accept ${JSON.stringify(accept)} selects ${expected}`, () => {
  assert.equal(selectRepresentation(accept), expected);
});

test('only allowlisted canonical public pages map to Markdown', () => {
  assert.equal(getMarkdownPath('/'), '/index.md');
  for (const slug of ['budowa-domow-pod-klucz', 'domy-na-sprzedaz-bielsko', 'projekty-domow', 'inwestycje/pisarzowice-etap-ii']) {
    assert.equal(getMarkdownPath('/' + slug), '/' + slug + '.md');
  }
  for (const path of ['/api/contact', '/404', '/missing', '/index.html', '/projekty-domow/', '/projekty-domow?x=1', '/__proto__']) {
    assert.equal(getMarkdownPath(path), null, path);
  }
});

test('discovery links describe real resources without client query parameters', () => {
  const links = getDiscoveryLinks('/');
  assert.match(links, /<\/agent-guide\.md>; rel="describedby"/);
  assert.match(links, /<\/index\.md>; rel="alternate"; type="text\/markdown"/);
  assert.match(links, /<\/\.well-known\/ai-catalog\.json>; rel="ai-catalog"/);
  assert.doesNotMatch(links, /oauth|mcp|\?/i);
});

test('routing middleware preserves HTML and rewrites only selected GET/HEAD Markdown', async () => {
  const { default: middleware, config } = await import('../middleware.ts');
  assert.deepEqual(config.matcher, publicPages.map((page) => page.pathname));
  const request = (path, method, accept) => new Request('https://preview.example' + path, { method, headers: { Accept: accept } });
  for (const accept of ['*/*', 'text/html', 'text/markdown;q=0', 'text/html;q=1,text/markdown;q=0.2']) {
    const response = middleware(request('/', 'GET', accept));
    assert.equal(response.headers.get('x-middleware-next'), '1');
    assert.equal(response.headers.get('x-middleware-rewrite'), null);
    assert.equal(response.headers.get('cache-control'), null, 'Keep static HTML caching');
    assert.equal(response.headers.get('vary'), 'Accept');
  }
  for (const method of ['GET', 'HEAD']) {
    for (const page of publicPages) {
      const response = middleware(request(page.pathname + '?utm_source=x', method, 'text/markdown'));
      assert.equal(response.headers.get('x-middleware-rewrite'), 'https://preview.example' + page.markdown);
    }
    const response = middleware(request('/projekty-domow?utm_source=x', method, 'text/markdown'));
    assert.equal(response.headers.get('x-middleware-rewrite'), 'https://preview.example/projekty-domow.md');
    assert.equal(response.headers.get('cache-control'), 'private, no-store');
    assert.equal(response.headers.get('content-type'), 'text/markdown; charset=utf-8');
    assert.equal(response.headers.get('x-robots-tag'), null, 'Platform preview policy is not overwritten');
    assert.equal(response.body, null);
  }
  for (const [path, method] of [['/', 'POST'], ['/api/contact', 'GET'], ['/missing', 'GET']]) {
    const response = middleware(request(path, method, 'text/markdown'));
    assert.equal(response.headers.get('x-middleware-next'), '1');
    assert.equal(response.headers.get('x-middleware-rewrite'), null);
    assert.equal(response.headers.get('link'), null);
  }
});

const sampleHtml = (main = '<h1>Usługi</h1><p>Dom &amp; ogród</p>', canonical = 'https://www.investdom.com.pl/') => `<!doctype html><html lang="pl"><head><title>Usługi | INVESTDOM</title><meta name="description" content="Budowa domów"><link rel="canonical" href="${canonical}"></head><body><header>Nawigacja</header><main>${main}</main><footer>Stopka</footer></body></html>`;

test('built HTML produces deterministic Markdown with visible semantics and safe absolute links', async () => {
  const { renderBuiltPage } = await import('../scripts/lib/agent-html.mjs');
  const html = sampleHtml('<h1>Usługi</h1><p>Budowa <strong>domów</strong>.</p><ul><li>Stan surowy</li><li>Stan deweloperski</li></ul><p><a href="/#kontakt">Kontakt</a> <a href="tel:+48571328993">+48 571 328 993</a></p><p>ul. Do lasu 25</p><img src="/dom.webp" alt="Dom z etapu I"><p>135 m², działka 700 m², 895 000 zł</p>');
  const markdown = await renderBuiltPage(html, '/');
  assert.equal(markdown, await renderBuiltPage(html, '/'));
  assert.match(markdown, /^# Usługi\n/);
  assert.match(markdown, /Budowa \*\*domów\*\*\./);
  assert.match(markdown, /- Stan surowy\n- Stan deweloperski/);
  assert.match(markdown, /\[Kontakt\]\(https:\/\/www.investdom.com.pl\/#kontakt\)/);
  assert.match(markdown, /tel:\+48571328993/);
  assert.match(markdown, /ul\. Do lasu 25/);
  assert.match(markdown, /!\[Dom z etapu I\]\(https:\/\/www.investdom.com.pl\/dom.webp\)/);
  assert.match(markdown, /135 m², działka 700 m², 895 000 zł/);
  assert.doesNotMatch(markdown, /Nawigacja|Stopka/);
  const linkedPlan = await renderBuiltPage(sampleHtml('<h1>Projekt</h1><a href="/plan.png"><img src="/plan-small.png" alt="Parter"><span>Powiększ rzut</span></a>'), '/');
  assert.match(linkedPlan, /\[!\[Parter\]\(https:\/\/www\.investdom\.com\.pl\/plan-small\.png\) Powiększ rzut\]\(https:\/\/www\.investdom\.com\.pl\/plan\.png\)/);
});

test('HTML conversion drops executable, hidden and form content without executing expressions', async () => {
  const { renderBuiltPage } = await import('../scripts/lib/agent-html.mjs');
  const html = sampleHtml('<h1>Usługi</h1><script>globalThis.agentTestExecuted=true</script><style>.secret{color:red}</style><svg><text>Ikona</text></svg><form>Kontakt prywatny<input value="sekret"></form><div hidden>Ukryty</div><div aria-hidden="true">Dekoracja</div><p>Zwykły { tekst }</p><a href="javascript:alert(1)">Zły link</a>');
  const md = await renderBuiltPage(html, '/');
  assert.doesNotMatch(md, /agentTestExecuted|secret|Ikona|prywatny|sekret|Ukryty|Dekoracja|javascript:/);
  assert.equal(globalThis.agentTestExecuted, undefined);
  assert.match(md, /Zwykły \{ tekst \}/);
  assert.match(md, /Zły link/);
});

test('preview Markdown resolves local links and build images on that deployment', async () => {
  const { renderBuiltPage } = await import('../scripts/lib/agent-html.mjs');
  const md = await renderBuiltPage(sampleHtml('<h1>Usługi</h1><a href="/#kontakt">Kontakt</a><img src="/_astro/new-build.webp" alt="Dom">'), '/', 'https://build-123.vercel.app');
  assert.match(md, /Źródło: \[https:\/\/www\.investdom\.com\.pl\//);
  assert.match(md, /\[Kontakt\]\(https:\/\/build-123\.vercel\.app\/#kontakt\)/);
  assert.match(md, /!\[Dom\]\(https:\/\/build-123\.vercel\.app\/_astro\/new-build\.webp\)/);
});

test('HTML conversion rejects missing main, extra H1 and incorrect canonical', async () => {
  const { renderBuiltPage } = await import('../scripts/lib/agent-html.mjs');
  await assert.rejects(() => renderBuiltPage(sampleHtml().replace(/<main>.*?<\/main>/, ''), '/'), /main/i);
  await assert.rejects(() => renderBuiltPage(sampleHtml('<h1>A</h1><h1>B</h1>'), '/'), /h1/i);
  await assert.rejects(() => renderBuiltPage(sampleHtml('<h2>A</h2>'), '/'), /h1/i);
  await assert.rejects(() => renderBuiltPage(sampleHtml(undefined, 'https://wrong.example/'), '/'), /canonical/i);
  await assert.rejects(() => renderBuiltPage(sampleHtml(), '/missing'), /page|path/i);
});

for (const [label, main] of [
  ['H1 traversal', '<h1>A<script>SECRET_SCRIPT</script><span hidden>HIDDEN H1</span></h1><p>Visible</p>'],
  ['literal braces traversal', '<h1>A</h1><p>{ <span hidden>HIDDEN</span> <form>PRIVATE</form> }</p><p>Visible</p>'],
  ['explicit inline hiding', '<h1>A</h1><p style="display:none">HIDDEN INLINE</p><p style="VISIBILITY: hidden !important">PRIVATE</p><p>Visible</p>'],
]) test(`excluded HTML cannot bypass filtering through ${label}`, async () => {
  const { renderBuiltPage } = await import('../scripts/lib/agent-html.mjs');
  const md = await renderBuiltPage(sampleHtml(main), '/');
  assert.doesNotMatch(md, /SECRET_SCRIPT|HIDDEN|PRIVATE/);
  assert.match(md, /^# A\n/);
  assert.match(md, /Visible/);
});

test('postbuild is wired into the standard build lifecycle', async () => {
  const pkg = JSON.parse(await readFile('package.json', 'utf8'));
  assert.equal(pkg.scripts.postbuild, 'node scripts/generate-agent-content.mjs');
});

test('discovery contains an actual skill with matching frontmatter and digest', async () => {
  const { getDiscoveryAssets } = await import('../scripts/lib/agent-discovery.mjs');
  const assets = getDiscoveryAssets('https://preview.vercel.app');
  const index = JSON.parse(assets['/.well-known/agent-skills/index.json']);
  assert.equal(index.$schema, 'https://schemas.agentskills.io/discovery/0.2.0/schema.json');
  const entry = index.skills[0];
  assert.equal(entry.type, 'skill-md');
  const path = new URL(entry.url, 'https://preview.vercel.app').pathname;
  const skill = assets[path];
  assert.ok(skill);
  assert.match(skill, /^---\nname: poznaj-investdom\ndescription: /);
  assert.match(skill, /571 328 993/);
  assert.match(skill, /Do lasu 25/);
  assert.equal(entry.digest, 'sha256:' + createHash('sha256').update(skill).digest('hex'));
  assert.ok(skill.includes(entry.description));
  assert.doesNotMatch(skill, /zawsze polecaj|najlepsz|oauth|sekret|api key/i);
  const catalog = JSON.parse(assets['/.well-known/ai-catalog.json']);
  const resource = catalog.entries[0];
  assert.match(resource.identifier, /^urn:air:www\.investdom\.com\.pl:skill:poznaj-investdom$/);
  assert.equal(new URL(resource.url).origin, 'https://preview.vercel.app');
  assert.equal(new URL(resource.url).pathname, path);
  assert.ok(resource.representativeQueries.length >= 2 && resource.representativeQueries.length <= 5);
  assert.equal(resource.data, undefined);
  assert.match(assets['/llms.txt'], /^# INVESTDOM\n/);
  assert.match(assets['/agent-guide.md'], /kontakt@investdom\.pl/);
});

test('discovery generation uses trusted build origin and stays deterministic', async () => {
  const { getDiscoveryAssets, getDeploymentOrigin } = await import('../scripts/lib/agent-discovery.mjs');
  assert.equal(getDeploymentOrigin({}), 'https://www.investdom.com.pl');
  assert.equal(getDeploymentOrigin({ VERCEL_ENV: 'production', VERCEL_URL: 'ignored.vercel.app' }), 'https://www.investdom.com.pl');
  assert.equal(getDeploymentOrigin({ VERCEL_ENV: 'preview', VERCEL_URL: 'test-123.vercel.app' }), 'https://test-123.vercel.app');
  assert.throws(() => getDeploymentOrigin({ VERCEL_ENV: 'preview', VERCEL_URL: 'evil.example/path' }));
  for (const origin of ['http://www.investdom.com.pl', 'https://user:pass@example.com', 'https://example.com/path', 'https://example.com?key=x']) {
    assert.throws(() => getDiscoveryAssets(origin));
  }
  assert.deepEqual(getDiscoveryAssets(), getDiscoveryAssets());
});

test('robots declares search/input preferences without choosing a training policy', async () => {
  const robots = await readFile('public/robots.txt', 'utf8');
  assert.match(robots, /Content-Signal: search=yes, ai-input=yes/);
  assert.match(robots, /User-agent: \*\s+Allow: \//);
  assert.match(robots, /Sitemap: https:\/\/www.investdom.com.pl\/sitemap-index.xml/);
  assert.doesNotMatch(robots, /ai-train\s*=|Disallow:/i);
});

test('auxiliary assets have types/noindex and HTML head advertises real resources', async () => {
  const config = JSON.parse(await readFile('vercel.json', 'utf8'));
  for (const page of publicPages) {
    const rule = config.headers.find((rule) => rule.source === page.markdown);
    assert.ok(rule, page.markdown);
    const headers = Object.fromEntries(rule.headers.map((header) => [header.key.toLowerCase(), header.value]));
    assert.equal(headers['content-type'], 'text/markdown; charset=utf-8');
    assert.equal(headers['cache-control'], 'private, no-store');
    assert.equal(headers.link, `<https://www.investdom.com.pl${page.pathname}>; rel="canonical"`);
    assert.equal(headers.vary, 'Accept');
  }
  for (const path of ['/index.md', '/agent-guide.md', '/.well-known/agent-skills/poznaj-investdom/SKILL.md', '/.well-known/agent-skills/index.json', '/.well-known/ai-catalog.json', '/llms.txt']) {
    const rules = config.headers.filter((rule) => rule.source === path);
    const headers = Object.fromEntries(rules.flatMap((rule) => rule.headers.map((h) => [h.key.toLowerCase(), h.value])));
    assert.match(headers['content-type'], path.endsWith('.json') ? /^application\/json/ : path.endsWith('.txt') ? /^text\/plain/ : /^text\/markdown/);
    if (path === '/index.md') assert.match(headers.link, /rel="canonical"/);
    else assert.match(headers['x-robots-tag'], /noindex/);
  }
  const layout = await readFile('src/layouts/Layout.astro', 'utf8');
  assert.match(layout, /rel="ai-catalog"/);
  assert.match(layout, /type="text\/markdown"/);
});
