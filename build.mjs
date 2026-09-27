import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = import.meta.dirname;
const output = resolve(root, 'dist');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const file of ['index.html', 'styles.css', 'app.js']) {
  await cp(resolve(root, file), resolve(output, file));
}
for (const directory of ['banners', 'images']) {
  await cp(resolve(root, 'assets/mujerbonita', directory), resolve(output, 'assets/mujerbonita', directory), { recursive: true });
}
await writeFile(resolve(output, '.nojekyll'), '');
console.log('GitHub Pages site built in dist/');
