import type { Element, ElementContent, Root } from "hast";
import snapshots from "../data/github-previews.json" with { type: "json" };

type Preview = { title: string; description: string };
const fallbackPreviews: Record<string, Preview> = snapshots;

export function parsePullRequest(href: string) {
  const match = href.match(
    /^https:\/\/github\.com\/([\w-]+)\/([\w.-]+)\/pull\/([1-9]\d*)\/?(?:[?#].*)?$/
  );
  if (!match) return;
  const [, owner, repo, number] = match;
  return {
    url: `https://github.com/${owner}/${repo}/pull/${number}`,
    repository: `${owner}/${repo}`,
    number,
  };
}

function text(value: string): ElementContent {
  return { type: "text", value };
}

function element(
  tagName: string,
  className: string,
  children: ElementContent[]
): Element {
  return {
    type: "element",
    tagName,
    properties: { className: [className] },
    children,
  };
}

function excerpt(body: string) {
  const paragraph = body
    .replace(/<!--[\s\S]*?-->/g, "")
    .split(/\n\s*\n/)
    .find(
      part =>
        part.trim() &&
        !/^(?:#|```|Related to|Fixes?\s+#|Closes?\s+#)/i.test(part.trim())
    );
  const plain = (paragraph ?? "")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]*>/g, "")
    .replace(/[`*_]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return plain.length > 240 ? `${plain.slice(0, 237).trimEnd()}…` : plain;
}

function card(
  pr: NonNullable<ReturnType<typeof parsePullRequest>>,
  data: Preview
) {
  const title = element("span", "github-preview-title", [text(data.title)]);
  const description = element("p", "github-preview-description", [
    text(data.description),
  ]);
  const repository = element("span", "github-preview-repository", [
    text(`${pr.repository} #${pr.number}`),
  ]);
  const icon: Element = {
    type: "element",
    tagName: "svg",
    properties: {
      viewBox: "0 0 24 24",
      width: 20,
      height: 20,
      fill: "currentColor",
      ariaHidden: "true",
    },
    children: [
      {
        type: "element",
        tagName: "path",
        properties: {
          d: "M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.86c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z",
        },
        children: [],
      },
    ],
  };
  const source = element("span", "github-preview-source", [
    icon,
    text("GitHub"),
  ]);
  const link = element("a", "github-preview-link", [
    source,
    title,
    ...(data.description ? [description] : []),
    repository,
  ]);
  link.properties.href = pr.url;
  return element("aside", "github-preview", [link]);
}

export default function rehypeGitHubPreviews() {
  const requests = new Map<string, Promise<Preview>>();

  function preview(pr: NonNullable<ReturnType<typeof parsePullRequest>>) {
    if (!requests.has(pr.url)) {
      requests.set(
        pr.url,
        (async () => {
          try {
            const headers: Record<string, string> = {
              Accept: "application/vnd.github+json",
            };
            if (process.env.GITHUB_TOKEN)
              headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
            const response = await fetch(
              `https://api.github.com/repos/${pr.repository}/pulls/${pr.number}`,
              { headers, signal: AbortSignal.timeout(4000), redirect: "error" }
            );
            if (!response.ok) throw new Error("GitHub metadata unavailable");
            const data = await response.json();
            if (typeof data.title !== "string" || !data.title.trim())
              throw new Error("Missing title");
            return {
              title: data.title,
              description: excerpt(
                typeof data.body === "string" ? data.body : ""
              ),
            };
          } catch {
            return (
              fallbackPreviews[pr.url] ?? {
                title: `Pull request #${pr.number}`,
                description: "",
              }
            );
          }
        })()
      );
    }
    return requests.get(pr.url)!;
  }

  async function transform(parent: Root | Element) {
    const children = await Promise.all(
      parent.children.map(async node => {
        if (node.type !== "element") return [node];
        if (/^(?:h[2-6]|p)$/.test(node.tagName)) {
          const content = node.children.filter(
            child => child.type !== "text" || child.value.trim()
          );
          const link =
            content.length === 1 &&
            content[0].type === "element" &&
            content[0].tagName === "a"
              ? content[0]
              : undefined;
          const pr =
            link && typeof link.properties.href === "string"
              ? parsePullRequest(link.properties.href)
              : undefined;
          if (pr && link) {
            const embed = card(pr, await preview(pr));
            if (node.tagName === "p") return [embed];
            node.children = link.children;
            return [node, embed];
          }
        }
        await transform(node);
        return [node];
      })
    );
    parent.children = children.flat() as ElementContent[];
  }

  return async (tree: Root) => {
    await transform(tree);
  };
}
