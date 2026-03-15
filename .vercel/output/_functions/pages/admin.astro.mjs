import { e as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_QXGJpzTU.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_1PoMl0sa.mjs';
export { renderers } from '../renderers.mjs';

const $$Admin = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Admin Login" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div style="min-height:40vh;"></div> ` })} ${renderScript($$result, "/home/runner/workspace/src/pages/admin.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/runner/workspace/src/pages/admin.astro", void 0);

const $$file = "/home/runner/workspace/src/pages/admin.astro";
const $$url = "/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Admin,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
