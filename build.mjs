import { readdir, mkdir, copyFile, rm, writeFile } from 'node:fs/promises';
import { join, relative, dirname } from 'node:path';
import { execFileSync } from 'node:child_process';
await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
execFileSync(process.execPath, ['node_modules/typescript/bin/tsc', '--project', 'tsconfig.json'], { stdio: 'inherit' });
async function walk(dir) {
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const source = join(dir, item.name);
    if (item.isDirectory()) { await walk(source); continue; }
    if (item.name.endsWith('.ts')) continue;
    const destination = join('dist', relative('src', source));
    await mkdir(dirname(destination), { recursive: true });
    await copyFile(source, destination);
  }
}
await walk('src');
const { lessonVisuals, visualSvg } = await import('./dist/learning-figures.js');
const { moduleVisuals } = await import('./dist/module-art.js');
for (const [kind, visuals] of [['lesson', lessonVisuals], ['module', moduleVisuals]]) {
  const directory = join('dist', 'figures', kind);
  await mkdir(directory, { recursive: true });
  for (const [id, visual] of Object.entries(visuals)) {
    if (!/^[a-z0-9-]+$/.test(id)) throw new Error(`Invalid figure id: ${id}`);
    await writeFile(join(directory, `${id}.svg`), visualSvg(visual));
  }
}
console.log('TypeScript verified. Static application built in dist/');
