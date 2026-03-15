import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_Cn2YmAwa.mjs';
import { manifest } from './manifest_DaA00XOa.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/about.astro.mjs');
const _page2 = () => import('./pages/admin.astro.mjs');
const _page3 = () => import('./pages/api/auth.astro.mjs');
const _page4 = () => import('./pages/api/officers.astro.mjs');
const _page5 = () => import('./pages/api/pages.astro.mjs');
const _page6 = () => import('./pages/api/photos.astro.mjs');
const _page7 = () => import('./pages/api/settings.astro.mjs');
const _page8 = () => import('./pages/api/sponsor-events.astro.mjs');
const _page9 = () => import('./pages/api/sponsors.astro.mjs');
const _page10 = () => import('./pages/api/tournaments.astro.mjs');
const _page11 = () => import('./pages/api/upload.astro.mjs');
const _page12 = () => import('./pages/donate.astro.mjs');
const _page13 = () => import('./pages/events.astro.mjs');
const _page14 = () => import('./pages/pca.astro.mjs');
const _page15 = () => import('./pages/sponsors.astro.mjs');
const _page16 = () => import('./pages/_page_.astro.mjs');
const _page17 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/about.astro", _page1],
    ["src/pages/admin.astro", _page2],
    ["src/pages/api/auth.ts", _page3],
    ["src/pages/api/officers.ts", _page4],
    ["src/pages/api/pages.ts", _page5],
    ["src/pages/api/photos.ts", _page6],
    ["src/pages/api/settings.ts", _page7],
    ["src/pages/api/sponsor-events.ts", _page8],
    ["src/pages/api/sponsors.ts", _page9],
    ["src/pages/api/tournaments.ts", _page10],
    ["src/pages/api/upload.ts", _page11],
    ["src/pages/donate.astro", _page12],
    ["src/pages/events.astro", _page13],
    ["src/pages/pca.astro", _page14],
    ["src/pages/sponsors.astro", _page15],
    ["src/pages/[page].astro", _page16],
    ["src/pages/index.astro", _page17]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "359c6553-0968-4795-a4a8-17f8a170c0fa",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
