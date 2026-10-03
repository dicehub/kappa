import TurndownService from "turndown";
// @ts-expect-error turndown-plugin-gfm does not publish type declarations
import { gfm } from "turndown-plugin-gfm";

/**
 * Islands are dropped from Markdown. An island that contains this marker keeps
 * its server-rendered content instead, which is how the Colors token reference
 * ships its complete table to `/docs/colors.md` while demos stay excluded.
 */
const MARKDOWN_KEEP_ATTRIBUTE = "data-markdown-keep";

const elementOf = (node: Node): Element | null => (node.nodeType === 1 ? (node as Element) : null);

export function createTurndownService(): TurndownService {
  const turndown = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    bulletListMarker: "-",
  });

  turndown.use(gfm);

  turndown.addRule("astroCodeBlock", {
    filter: (node) => node.nodeName === "PRE" && node.hasAttribute("data-language"),
    replacement: (_content, node, options) => {
      const fence = options.fence ?? "```";
      const language = node.getAttribute("data-language") ?? "";
      const code = (node.textContent ?? "").replace(/\n$/, "");
      return `\n\n${fence}${language}\n${code}\n${fence}\n\n`;
    },
  });

  turndown.addRule("escapedGfmTableCell", {
    filter: ["th", "td"],
    replacement: (content, node) => {
      const isFirstCell = node.parentElement?.firstElementChild === node;
      const escapedContent = content.trim().replaceAll("|", "\\|");
      return `${isFirstCell ? "| " : " "}${escapedContent} |`;
    },
  });

  /*
   * Rules match before `remove` filters, so the copy-ignore opt-out and the
   * reference island privilege are enforced as rules. Plain `remove` filters
   * never run for elements that a standard rule already matched.
   */
  turndown.addRule("markdownExcluded", {
    filter: (node) => elementOf(node)?.hasAttribute("data-copy-ignore") === true,
    replacement: () => "",
  });

  turndown.addRule("markdownKeptIsland", {
    filter: (node) =>
      node.nodeName === "ASTRO-ISLAND" &&
      elementOf(node)?.querySelector(`[${MARKDOWN_KEEP_ATTRIBUTE}]`) != null,
    replacement: (content) => content,
  });

  turndown.remove(["script", "style"]);

  turndown.remove((node) => {
    const tag = node.nodeName.toLowerCase();
    return tag === "astro-island" || tag === "astro-slot";
  });

  turndown.remove((node) => ["footer", "aside"].includes(node.nodeName.toLowerCase()));

  return turndown;
}

/** GFM table rows must stay on one line, including cells rendered from MDX blocks. */
export function normalizeTableWhitespace(html: string): string {
  return html.replace(/<table\b[\s\S]*?<\/table>/gi, (table) =>
    table
      .replace(/<\/?(?:p|div)\b[^>]*>/gi, " ")
      .replace(/\s+/g, " ")
      .replace(/\s*(<\/?(?:table|thead|tbody|tr)\b[^>]*>)\s*/gi, "$1")
      .replace(/(<(?:td|th)\b[^>]*>)\s+/gi, "$1")
      .replace(/\s+(<\/(?:td|th)>)/gi, "$1"),
  );
}

/** Convert the content of a rendered Kappa docs page into Markdown. */
export function htmlToMarkdown(html: string): string {
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  const content = mainMatch ? mainMatch[1] : html;

  return createTurndownService()
    .turndown(normalizeTableWhitespace(content))
    .replace(/[ \t]+$/gm, "")
    .trim();
}
