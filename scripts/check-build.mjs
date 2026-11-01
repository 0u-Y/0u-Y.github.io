import assert from "node:assert/strict";
import { readFile, readdir, access } from "node:fs/promises";
import { resolve, extname } from "node:path";

const root = resolve("dist");
const site = "https://ericyang.dev";
const read = path => readFile(resolve(root, path), "utf8");
const files = (await readdir(root, { recursive: true })).filter(path =>
  path.endsWith(".html")
);
const toFile = path =>
  extname(path) ? path.slice(1) : `${path.slice(1)}index.html`;
const sitemap = await read("sitemap-0.xml");
const postFiles = files.filter(path => path.includes("posts/"));
const pullRequests = html =>
  [...html.matchAll(/href="(https:\/\/github\.com\/[^\"]+\/pull\/\d+)"/g)].map(
    match => match[1]
  );

for (const file of files) {
  const html = await read(file);
  const lang = file.startsWith("ko/") ? "ko" : "en";
  const prefix = lang === "ko" ? "/ko" : "";
  const path =
    file === "404.html" ? "/404.html" : `/${file.replace(/index\.html$/, "")}`;
  assert(
    html.includes(`<html lang="${lang}"`),
    `${file}: wrong document language`
  );
  const nav = html.match(/<nav\b[^>]*>([\s\S]*?)<\/nav>/)?.[1];
  assert(nav, `${file}: navigation missing`);
  assert.deepEqual(
    [...nav.matchAll(/href="([^"]+)"/g)].map(match => match[1]),
    [
      `${prefix}/`,
      `${prefix}/research/`,
      `${prefix}/open-source/`,
      `${prefix}/about/`,
    ],
    `${file}: navigation must stay in the selected language`
  );
  assert.deepEqual(
    [...nav.matchAll(/<a\b[^>]*>([^<]+)<\/a>/g)].map(match => match[1].trim()),
    ["Home", "Research", "Open Source", "About"],
    `${file}: menu names must remain English`
  );
  assert(html.includes('id="main"'), `${file}: skip-link target missing`);
  if (file !== "404.html") {
    assert(
      html.includes(`rel="canonical" href="${site}${path}"`),
      `${file}: incorrect canonical URL`
    );
  }
  for (const [, href] of html.matchAll(/href="(\/[^"#]*)"/g)) {
    await access(resolve(root, toFile(href)));
  }

  const switcher = html.match(
    /<div class="language-switch"[^>]*>([\s\S]*?)<\/div>/
  )?.[1];
  assert(switcher, `${file}: language switch missing`);
  assert.match(switcher, new RegExp(`href="${path}"[^>]*aria-current="page"`));
  const counterpart = lang === "ko" ? path.slice(3) : `/ko${path}`;
  if (files.includes(toFile(counterpart))) {
    assert(
      switcher.includes(`href="${counterpart}"`),
      `${file}: switch must link to the same page`
    );
    const otherLanguage = lang === "ko" ? "en" : "ko";
    assert(
      html.includes(`hreflang="${otherLanguage}" href="${site}${counterpart}"`),
      `${file}: alternate-language metadata missing`
    );
  } else {
    assert(
      switcher.includes('aria-disabled="true"'),
      `${file}: unavailable translation must be disabled`
    );
  }

  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? "";
  for (const [, href] of main.matchAll(/href="((?:\/ko)?\/posts\/[^"#]+)"/g)) {
    assert.equal(
      href.startsWith("/ko/"),
      lang === "ko",
      `${file}: mixed-language post list`
    );
  }
  if (file !== "404.html")
    assert(
      sitemap.includes(`<loc>${site}${path}</loc>`),
      `${file}: sitemap entry missing`
    );

  assert(
    !/<link\b[^>]*\brel="stylesheet"/.test(html),
    `${file}: cached HTML must not depend on replaceable CSS files`
  );
  const styles = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)]
    .map(match => match[1])
    .join("\n");
  assert(
    styles.includes(".site-header"),
    `${file}: site styles must be inline`
  );
}

for (const file of postFiles) {
  const html = await read(file);
  const categoryUrl = html.match(/class="back-link" href="([^"]+)"/)?.[1];
  assert(categoryUrl, `${file}: category link missing`);
  const category = await read(toFile(categoryUrl));
  const postUrl = `/${file.replace(/index\.html$/, "")}`;
  assert(
    category.includes(`href="${postUrl}"`),
    `${file}: missing from category`
  );
  const otherCategory = categoryUrl.endsWith("/research/")
    ? categoryUrl.replace(/research\/$/, "open-source/")
    : categoryUrl.replace(/open-source\/$/, "research/");
  assert(
    !(await read(toFile(otherCategory))).includes(`href="${postUrl}"`),
    `${file}: listed in wrong category`
  );
  if (!file.startsWith("ko/") && files.includes(`ko/${file}`)) {
    assert.deepEqual(
      pullRequests(await read(`ko/${file}`)),
      pullRequests(html),
      `${file}: translation must preserve PR links and their order`
    );
  }
}
assert((await read("sitemap-index.xml")).includes("sitemap"));
console.log(
  `Build checks passed: ${files.length} pages, ${postFiles.length} post versions, language switching, internal links and inline CSS.`
);
