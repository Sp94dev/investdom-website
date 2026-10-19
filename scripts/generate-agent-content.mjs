import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { publicPages } from '../src/lib/agent-representation.mjs';
import { renderBuiltPage } from './lib/agent-html.mjs';
import { getDiscoveryAssets, getDeploymentOrigin } from './lib/agent-discovery.mjs';

export async function generateAgentContent(root = resolve('.vercel/output/static')) {
  const deploymentOrigin = getDeploymentOrigin();
  // Read only the four allowlisted outputs of the just-completed Astro build.
  const pages = await Promise.all(publicPages.map(async (page) => ({
    ...page,
    markdownBody: await renderBuiltPage(await readFile(join(root, page.file), 'utf8'), page.pathname, deploymentOrigin),
  })));
  const assets = {
    ...getDiscoveryAssets(deploymentOrigin),
    ...Object.fromEntries(pages.map((page) => [page.markdown, page.markdownBody])),
  };
  for (const [path, body] of Object.entries(assets)) {
    const target = join(root, path.slice(1));
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, body, 'utf8');
  }
  return pages;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '../.vercel/output/static');
  const pages = await generateAgentContent(root);
  console.log(`Generated ${pages.length} Markdown representations from prerendered HTML.`);
}
