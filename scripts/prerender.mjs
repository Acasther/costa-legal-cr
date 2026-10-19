// Renders every page to static HTML in dist/ after `vite build` and `vite build --ssr`, then writes the sitemap.
import { readFile, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const ssrDir = path.join(root, 'dist-ssr');

const { render, PAGES, NOT_FOUND, canonicalUrl } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href);
const template = await readFile(path.join(dist, 'index.html'), 'utf8');

if (!template.includes('<!--app-head-->') || !template.includes('<!--app-html-->')) {
  throw new Error('dist/index.html is missing the <!--app-head--> or <!--app-html--> placeholder');
}

for (const page of [...PAGES, NOT_FOUND]) {
  const { html, head } = render(page);
  const output = template.replace('<!--app-head-->', () => head).replace('<!--app-html-->', () => html);
  await writeFile(path.join(dist, page.file), output);
  console.log(`prerendered ${page.path} -> dist/${page.file}`);
}

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGES.map((page) => `  <url><loc>${canonicalUrl(page)}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`;
await writeFile(path.join(dist, 'sitemap.xml'), sitemap);
console.log('wrote dist/sitemap.xml');

await rm(ssrDir, { recursive: true, force: true });
