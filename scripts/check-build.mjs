import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve("dist");
const read = path => readFile(resolve(root, path), "utf8");
const pages = [
  "index.html",
  "research/index.html",
  "open-source/index.html",
  "about/index.html",
];
for (const page of pages) {
  const html = await read(page);
  const nav = html.match(/<nav\b[^>]*>([\s\S]*?)<\/nav>/)?.[1];
  assert(nav, `${page}: navigation missing`);
  assert.deepEqual(
    [...nav.matchAll(/href="([^"]+)"/g)].map(match => match[1]),
    ["/", "/research/", "/open-source/", "/about/"]
  );
  assert(html.includes('id="main"'), `${page}: skip-link target missing`);
  for (const [, href] of html.matchAll(/href="(\/[^"#]*)"/g)) {
    if (href.includes(".")) continue;
    await read(
      `${href.replace(/^\//, "").replace(/\/$/, "")}${href === "/" ? "" : "/"}index.html`
    );
  }
}
const research = await read("research/index.html");
const openSource = await read("open-source/index.html");
const postEntries = await readdir(resolve(root, "posts"), {
  recursive: true,
}).catch(() => []);
const slugs = postEntries
  .filter(path => path.endsWith("/index.html"))
  .map(path => path.slice(0, -"/index.html".length));
for (const slug of slugs) {
  const html = await read(`posts/${slug}/index.html`);
  const category = html.includes('href="/research/">Back to Research')
    ? research
    : openSource;
  const otherCategory = category === research ? openSource : research;
  assert(
    category.includes(`/posts/${slug}/`),
    `${slug}: missing from category`
  );
  assert(
    !otherCategory.includes(`/posts/${slug}/`),
    `${slug}: listed in wrong category`
  );
}
assert((await read("sitemap-index.xml")).includes("sitemap"));
for (const page of [
  ...pages,
  "404.html",
  ...slugs.map(slug => `posts/${slug}/index.html`),
]) {
  const html = await read(page);
  assert(
    !/<link\b[^>]*\brel="stylesheet"/.test(html),
    `${page}: cached HTML must not depend on replaceable CSS files`
  );
  const styles = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)]
    .map(match => match[1])
    .join("\n");
  assert(
    styles.includes(".site-header"),
    `${page}: site styles must be inline`
  );
}
console.log(
  `Build checks passed: 4 primary pages, ${slugs.length} posts and sitemap.`
);
