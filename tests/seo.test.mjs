import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { checkMetadata, loadPages, parsePage, paths } from '../scripts/check-seo.mjs';

let server;
let base;
let pages;
let scratch;
let log = '';

before(async () => {
  scratch = await mkdtemp(join(tmpdir(), 'investdom-seo-'));
  const socket = createServer();
  await new Promise((resolve) => socket.listen(0, '127.0.0.1', resolve));
  const port = socket.address().port;
  await new Promise((resolve) => socket.close(resolve));
  base = `http://127.0.0.1:${port}`;
  server = spawn(process.execPath, ['node_modules/astro/astro.js', 'dev', '--host', '127.0.0.1', '--port', String(port)], {
    env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1', XDG_CONFIG_HOME: scratch },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  server.stdout.on('data', (chunk) => { log += chunk; });
  server.stderr.on('data', (chunk) => { log += chunk; });
  const started = Date.now();
  for (;;) {
    try { if ((await fetch(base, { signal: AbortSignal.timeout(2000) })).status === 200) break; } catch {}
    if (server.exitCode !== null || Date.now() - started > 45000) throw new Error(log);
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  pages = await loadPages(base);
});

after(async () => {
  if (server && server.exitCode === null) {
    const stopped = new Promise((resolve) => server.once('exit', resolve));
    server.kill('SIGTERM');
    await stopped;
  }
  if (scratch) await rm(scratch, { recursive: true, force: true });
});

test('SSR exposes unique metadata and a single canonical on the final production host', () => {
  checkMetadata(pages);
});

test('tracking parameters cannot enter the canonical URL', async () => {
  const response = await fetch(`${base}/projekty-domow?utm_source=test`);
  assert.deepEqual(parsePage(await response.text()).canonical, ['https://www.investdom.com.pl/projekty-domow']);
});

test('production routing permanently normalizes slashes and preserves HTTP methods', async () => {
  const config = JSON.parse(await readFile('.vercel/output/config.json', 'utf8'));
  for (const path of paths.slice(1)) {
    const rule = config.routes.find((route) => route.status === 308 && new RegExp(route.src).test(`${path}/`));
    assert.ok(rule, `No permanent method-preserving redirect for ${path}/`);
    assert.equal(`${path}/`.replace(new RegExp(rule.src), rule.headers.Location), path);
    assert.equal(rule.methods, undefined, 'Redirect must apply to POST as well as GET');
    assert.ok(!rule.headers.Location.includes('?'), 'Do not replace tracking parameters');
  }
});

test('unknown pages remain HTTP 404 and never become indexable content', async () => {
  for (const path of ['/seo-test-missing', '/404']) {
    const response = await fetch(base + path);
    assert.equal(response.status, 404, path);
    assert.deepEqual(parsePage(await response.text()).canonical, []);
  }
});

test('built sitemap contains only the four canonical, indexable URLs', async () => {
  const index = await readFile('dist/client/sitemap-index.xml', 'utf8');
  assert.match(index, /<loc>https:\/\/www\.investdom\.com\.pl\/sitemap-0\.xml<\/loc>/);
  const sitemap = await readFile('dist/client/sitemap-0.xml', 'utf8');
  assert.deepEqual([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(([, url]) => new URL(url).href).sort(), [
    'https://www.investdom.com.pl/',
    'https://www.investdom.com.pl/budowa-domow-pod-klucz',
    'https://www.investdom.com.pl/domy-na-sprzedaz-bielsko',
    'https://www.investdom.com.pl/projekty-domow',
  ]);
});
