import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile, access } from 'node:fs/promises';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { publicPages } from '../src/lib/agent-representation.mjs';
import { company } from '../src/data/company.mjs';
import { generateAgentContent } from '../scripts/generate-agent-content.mjs';

const root = '.vercel/output/static';
const read = (path) => readFile(join(root, path.replace(/^\//, '')), 'utf8');

test('every generated page exists, has its canonical source and only real local images', async () => {
  for (const page of publicPages) {
    const md = await read(page.markdown);
    assert.match(md, /^# /);
    assert.ok(md.includes(new URL(page.pathname, 'https://www.investdom.com.pl').href));
    assert.doesNotMatch(md, /<script|<form|gtag\(|dataLayer|aria-hidden/i);
    for (const [, url] of md.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)) {
      await access(join(root, new URL(url).pathname));
    }
  }
  const home = await read('/index.md');
  assert.ok(home.includes(company.telephoneDisplay));
  assert.ok(home.includes(company.address.streetAddress));
  assert.match(home, /895 000 zł/);
  assert.match(home, /135 m²/);
  assert.match(home, /700 m²/);
});

test('built discovery resolves to the exact skill bytes and one truthful resource', async () => {
  const index = JSON.parse(await read('/.well-known/agent-skills/index.json'));
  assert.equal(index.skills.length, 1);
  const entry = index.skills[0];
  const skill = await read(new URL(entry.url).pathname);
  assert.equal(entry.digest, 'sha256:' + createHash('sha256').update(skill).digest('hex'));
  const catalog = JSON.parse(await read('/.well-known/ai-catalog.json'));
  assert.equal(catalog.entries.length, 1);
  assert.equal(catalog.entries[0].url, entry.url);
  assert.ok(catalog.entries[0].representativeQueries.length >= 2);
  const guide = await read('/agent-guide.md');
  assert.ok(guide.includes(company.telephoneDisplay));
  assert.ok(guide.includes(company.email));
  assert.ok(guide.includes(company.googleBusinessProfile));
});

test('regeneration is deterministic and does not modify public HTML or sitemap', async () => {
  const paths = [...publicPages.map((p) => '/' + p.file), ...publicPages.map((p) => p.markdown), '/sitemap-0.xml', '/llms.txt', '/agent-guide.md', '/.well-known/agent-skills/index.json', '/.well-known/agent-skills/poznaj-investdom/SKILL.md', '/.well-known/ai-catalog.json'];
  const before = await Promise.all(paths.map(read));
  await generateAgentContent(root);
  const after = await Promise.all(paths.map(read));
  assert.deepEqual(before, after);
  assert.equal([...(await read('/sitemap-0.xml')).matchAll(/<loc>/g)].length, publicPages.length);
});
