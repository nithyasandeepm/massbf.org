import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_QXGJpzTU.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_1PoMl0sa.mjs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$page = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$page;
  const { page } = Astro2.params;
  let pages = [];
  try {
    pages = JSON.parse(await readFile(join(process.cwd(), "src/data/pages.json"), "utf-8"));
  } catch {
  }
  const customPage = pages.find((p) => p.slug === page);
  if (!customPage) return Astro2.redirect("/");
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": customPage.label }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<section style="background:linear-gradient(135deg,#1B3A8F 0%,#122970 100%);padding:3rem 1.5rem 2.5rem;color:white;"> <div style="max-width:1200px;margin:0 auto;"> <h1 style="font-size:2.2rem;font-weight:800;margin:0;">${customPage.label}</h1> </div> </section>  <section style="padding:3.5rem 1.5rem;"> <div style="max-width:900px;margin:0 auto;"> ${customPage.content ? customPage.content.split(/\n{2,}/).map((para) => renderTemplate`<p style="font-size:1rem;color:#374151;line-height:1.8;margin:0 0 1.25rem;">${para.trim()}</p>`) : renderTemplate`<p style="font-size:1rem;color:#94A3B8;font-style:italic;">No content yet.</p>`} </div> </section> ` })}`;
}, "/home/runner/workspace/src/pages/[page].astro", void 0);

const $$file = "/home/runner/workspace/src/pages/[page].astro";
const $$url = "/[page]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$page,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
