import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { publicPages } from '../src/lib/agent-representation.mjs';

export const paths = publicPages.map((page) => page.pathname);

function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)]
    .map(([, name, double, single]) => [name.toLowerCase(), double ?? single]));
}

export function parsePage(html) {
  const head = html.split('</head>')[0];
  const meta = [...head.matchAll(/<meta\b[^>]*>/gi)].map(([tag]) => attributes(tag));
  const link = [...head.matchAll(/<link\b[^>]*>/gi)].map(([tag]) => attributes(tag));
  return {
    html,
    title: head.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1],
    description: meta.find((tag) => tag.name === 'description')?.content,
    canonical: link.filter((tag) => tag.rel === 'canonical').map((tag) => tag.href),
    meta: Object.fromEntries(meta.map((tag) => [tag.name ?? tag.property, tag.content])),
    headings: [...html.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map(([, level, text]) => ({ level: Number(level), text: text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() })),
    images: [...html.matchAll(/<img\b[^>]*>/gi)].map(([tag]) => attributes(tag)),
    schemas: [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].map(([, json]) => JSON.parse(json)),
  };
}

export async function loadPages(base) {
  return Promise.all(paths.map(async (path) => {
    const response = await fetch(new URL(path, base), { redirect: 'manual' });
    assert.equal(response.status, 200, path);
    return { path, ...parsePage(await response.text()) };
  }));
}

export function checkMetadata(pages, origin = 'https://www.investdom.com.pl') {
  assert.equal(new Set(pages.map((page) => page.title)).size, pages.length, 'Titles must be unique');
  assert.equal(new Set(pages.map((page) => page.description)).size, pages.length, 'Descriptions must be unique');
  for (const page of pages) {
    assert.ok(page.title?.trim() && page.description?.trim(), page.path);
    assert.deepEqual(page.canonical, [origin + page.path], page.path);
    assert.equal(page.meta['og:url'], origin + page.path);
    assert.equal(page.meta['twitter:url'], origin + page.path);
    assert.equal(page.headings.filter((heading) => heading.level === 1).length, 1, page.path);
    assert.equal([...page.html.matchAll(/<main\b/g)].length, 1, page.path);
    assert.equal(page.meta['og:title'], page.title);
    assert.equal(page.meta['og:description'], page.description);
    assert.equal(page.meta['twitter:card'], 'summary_large_image');
    assert.equal(page.meta['twitter:title'], page.title);
    assert.ok(page.meta.robots?.includes('index, follow'));
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (!process.argv[2]) throw new Error('Usage: node scripts/check-seo.mjs <base-url> [canonical-origin]');
  const pages = await loadPages(process.argv[2]);
  checkMetadata(pages, process.argv[3]);
  console.log(`SEO HTML checks passed for ${pages.length} pages.`);
}
