import { readdir, mkdir, copyFile, rm } from 'node:fs/promises';
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
console.log('TypeScript verified. Static application built in dist/');
