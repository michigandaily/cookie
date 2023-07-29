import { resolve, parse, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vite';
import nunjucks from '@michigandaily/vite-plugin-transform-nunjucks';
import dsv from '@michigandaily/rollup-plugin-dsv';

import { entries, deployment } from './sink.config.json';

const __dirname = dirname(fileURLToPath(import.meta.url));

const graphics = Object.assign(
	...Object.keys(entries)
		.map((entry) => parse(entry))
		.map(({ name, base }) => ({
			[name]: resolve(__dirname, `src/graphic/${base}`)
		}))
);

// https://vitejs.dev/config/
export default defineConfig({
	base: deployment.key.length === 0 ? '/' : `/${deployment.key}/`,
	plugins: [nunjucks(), dsv({ include: ['**.csv', '**.tsv', '**.dsv'] })],
	root: resolve(__dirname, 'src'),
	build: {
		outDir: resolve(__dirname, 'dist'),
		emptyOutDir: true,
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'src/index.html'),
				...graphics
			}
		}
	}
});
