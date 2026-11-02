// Stamps an issue number into every live post that lacks one, so its "Vol. · No." never changes.
// Run by .github/workflows/number-posts.yml; matches getSerials() in src/utils/posts.ts:
// the next free number in the post's volume (year), oldest unnumbered post first.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';

const dir = 'src/content/posts';
const volumeOf = (date) => new Date(date).getUTCFullYear() - 2026 + 1;

const posts = readdirSync(dir)
  .filter((f) => f.endsWith('.mdoc'))
  .map((file) => {
    const path = join(dir, file);
    const text = readFileSync(path, 'utf8');
    const data = parse(text.match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]);
    return { id: file.replace(/\.mdoc$/, ''), path, text, data };
  })
  .filter((p) => !p.data.draft)
  .sort((a, b) => new Date(a.data.publishedDate) - new Date(b.data.publishedDate) || a.id.localeCompare(b.id));

const highest = new Map();
for (const p of posts) {
  if (!p.data.issue) continue;
  const v = volumeOf(p.data.publishedDate);
  highest.set(v, Math.max(highest.get(v) ?? 0, p.data.issue));
}

for (const p of posts) {
  if (p.data.issue) continue;
  const v = volumeOf(p.data.publishedDate);
  const issue = (highest.get(v) ?? 0) + 1;
  highest.set(v, issue);
  writeFileSync(p.path, p.text.replace(/^(publishedDate:.*)$/m, `$1\nissue: ${issue}`));
  console.log(`${p.id}: Vol. ${v} · No. ${issue}`);
}
