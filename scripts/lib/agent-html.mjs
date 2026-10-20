import { parse } from '@astrojs/compiler';
import { getMarkdownPath } from '../../src/lib/agent-representation.mjs';

const origin = 'https://www.investdom.com.pl';
const omitted = new Set(['script', 'style', 'svg', 'form', 'input', 'button', 'select', 'textarea', 'template', 'nav']);
const blocks = new Set(['div', 'section', 'article', 'aside', 'address', 'dl', 'dt', 'dd', 'figure', 'figcaption']);

function attributes(node) {
  return Object.fromEntries((node.attributes ?? []).map((attribute) => [attribute.name.toLowerCase(), attribute.value ?? '']));
}

function findAll(node, name) {
  return [...(node.name?.toLowerCase() === name ? [node] : []), ...(node.children ?? []).flatMap((child) => findAll(child, name))];
}

function excluded(node) {
  const attrs = attributes(node);
  return omitted.has(node.name?.toLowerCase()) || Object.hasOwn(attrs, 'hidden') ||
    attrs['aria-hidden'] === 'true' || attrs.class?.split(/\s+/).includes('hidden') ||
    /(?:^|;)\s*(?:display\s*:\s*none|visibility\s*:\s*(?:hidden|collapse))\s*(?:!important\s*)?(?:;|$)/i.test(attrs.style ?? '');
}

function text(node) {
  if (excluded(node)) return '';
  if (node.type === 'text') return node.value;
  if (node.type === 'expression') return `{${(node.children ?? []).map(text).join('')}}`;
  return (node.children ?? []).map(text).join('');
}

function escapeText(value) {
  return value.replace(/\s+/g, ' ').replace(/([\\`*_[\]])/g, '\\$1');
}

function safeUrl(value, canonical) {
  if (!value) return null;
  try {
    const url = new URL(value.replaceAll('&amp;', '&'), canonical);
    return ['https:', 'http:', 'mailto:', 'tel:'].includes(url.protocol) ? url.href.replace(/[()]/g, (c) => c === '(' ? '%28' : '%29') : null;
  } catch { return null; }
}

function render(node, canonical) {
  if (excluded(node)) return '';
  if (node.type === 'text' || node.type === 'expression') return escapeText(text(node));
  if (node.type === 'comment' || node.type === 'doctype') return '';
  const name = node.name?.toLowerCase();
  const attrs = attributes(node);
  if (name === 'h1' || name === 'source') return '';
  const content = (node.children ?? []).map((child) => render(child, canonical)).join('');
  if (/^h[2-6]$/.test(name)) return `\n\n${'#'.repeat(Number(name[1]))} ${content.trim()}\n\n`;
  if (name === 'p' || blocks.has(name)) return `\n\n${content.trim()}\n\n`;
  if (name === 'br') return '\n';
  if (name === 'strong' || name === 'b') return `**${content}**`;
  if (name === 'em' || name === 'i') return `*${content}*`;
  if (name === 'summary') return `\n\n**${content.trim()}**\n\n`;
  if (name === 'li') return `\n- ${content.trim().replace(/\n+/g, ' ')}`;
  if (name === 'ul' || name === 'ol') return `\n\n${content.trim()}\n\n`;
  if (name === 'a') {
    const href = safeUrl(attrs.href, canonical);
    // Link labels are inline Markdown, including linked images with a caption.
    // Block spacing from an image must not split the label into paragraphs.
    const label = content.trim().replace(/\s+/g, ' ');
    return href && label ? `[${label}](${href})` : content;
  }
  if (name === 'img') {
    const src = safeUrl(attrs.src, canonical);
    return src && attrs.alt ? `\n\n![${escapeText(attrs.alt)}](${src})\n\n` : '';
  }
  return content;
}

export async function renderBuiltPage(html, pathname, deploymentOrigin = origin) {
  if (!getMarkdownPath(pathname)) throw new Error(`Unknown public page path: ${pathname}`);
  const { ast } = await parse(html);
  const canonical = new URL(pathname, origin).href;
  const canonicals = findAll(ast, 'link').map(attributes).filter((a) => a.rel === 'canonical');
  if (canonicals.length !== 1 || canonicals[0].href !== canonical) throw new Error(`Invalid canonical for ${pathname}`);
  const mains = findAll(ast, 'main');
  if (mains.length !== 1) throw new Error(`Expected one main for ${pathname}`);
  const headings = findAll(mains[0], 'h1');
  if (headings.length !== 1) throw new Error(`Expected one H1 for ${pathname}`);
  const heading = escapeText(text(headings[0]).trim());
  // Local images and links belong to this build; the cited canonical stays production.
  const body = render(mains[0], new URL(pathname, deploymentOrigin).href).replace(/[ \t]+\n/g, '\n').replace(/\n[ \t]+/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  return `# ${heading}\n\nŹródło: [${canonical}](${canonical})\n\n${body}\n`;
}
