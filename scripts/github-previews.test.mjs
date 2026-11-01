import assert from "node:assert/strict";
import { test } from "node:test";
import rehypeGitHubPreviews, {
  parsePullRequest,
} from "../src/utils/rehypeGitHubPreviews.ts";

const link = (href, value = "A contribution") => ({
  type: "element",
  tagName: "a",
  properties: { href },
  children: [{ type: "text", value }],
});
const block = (tagName, children) => ({
  type: "element",
  tagName,
  properties: { id: "original-heading" },
  children,
});
const root = children => ({ type: "root", children });
const url = "https://github.com/example/client/pull/7";

test("only GitHub pull-request URLs are eligible", () => {
  assert.equal(parsePullRequest(url + "#discussion").url, url);
  for (const href of [
    "https://github.com.evil.example/a/b/pull/7",
    "http://github.com/a/b/pull/7",
    "https://github.com/a/b/issues/7",
    "https://github.com/a/b/pull/7/files",
    "https://example.com/a/b/pull/7",
  ])
    assert.equal(parsePullRequest(href), undefined);
});

test("heading and standalone links become previews; inline links stay intact", async t => {
  let calls = 0;
  t.mock.method(globalThis, "fetch", async requested => {
    assert.equal(
      requested,
      "https://api.github.com/repos/example/client/pulls/7"
    );
    calls++;
    return new Response(
      JSON.stringify({
        title: "Keep <script> as text",
        body: "## Summary\n\nAvoid **duplicate work** with `verified` data.\n\n## Tests\nDetails.",
      })
    );
  });
  const inline = block("p", [{ type: "text", value: "See " }, link(url)]);
  const tree = root([
    block("h3", [link(url)]),
    block("p", [link(url)]),
    inline,
  ]);
  await rehypeGitHubPreviews()(tree);
  assert.equal(calls, 1, "repeated URLs share a metadata request");
  assert.equal(tree.children[0].tagName, "h3");
  assert.equal(tree.children[0].properties.id, "original-heading");
  assert.equal(tree.children[0].children[0].type, "text");
  assert.equal(
    tree.children.filter(node => node.tagName === "aside").length,
    2
  );
  const previewLink = tree.children[1].children[0];
  assert.equal(previewLink.properties.href, url);
  assert.equal(
    previewLink.children[1].children[0].value,
    "Keep <script> as text"
  );
  assert.equal(
    previewLink.children[2].children[0].value,
    "Avoid duplicate work with verified data."
  );
  assert.equal(tree.children.at(-1), inline);
  assert(!JSON.stringify(tree).includes('"tagName":"script"'));
});

test("API failure uses saved previews and leaves unknown PRs navigable", async t => {
  t.mock.method(globalThis, "fetch", async () => {
    throw new Error("offline");
  });
  const known = "https://github.com/sigp/lighthouse/pull/10288";
  const tree = root([block("p", [link(known)]), block("p", [link(url)])]);
  await rehypeGitHubPreviews()(tree);
  assert.equal(
    tree.children[0].children[0].children[1].children[0].value,
    "fix(network): reject conflicting finalized roots at the same epoch"
  );
  assert.equal(tree.children[1].children[0].properties.href, url);
  assert.equal(
    tree.children[1].children[0].children[1].children[0].value,
    "Pull request #7"
  );
});

test("rate limits and invalid responses also use the saved preview", async t => {
  const known = "https://github.com/sigp/lighthouse/pull/10288";
  for (const response of [
    new Response("rate limited", { status: 403 }),
    new Response(JSON.stringify({ title: null })),
  ]) {
    const mock = t.mock.method(globalThis, "fetch", async () => response);
    const tree = root([block("p", [link(known)])]);
    await rehypeGitHubPreviews()(tree);
    assert.equal(
      tree.children[0].children[0].children[1].children[0].value,
      "fix(network): reject conflicting finalized roots at the same epoch"
    );
    mock.mock.restore();
  }
});
