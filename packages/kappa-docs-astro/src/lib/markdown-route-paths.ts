const docsMarkdownRoot = "/docs.md";
const docsMarkdownPrefix = "/docs/";
const changelogMarkdownPath = "/docs/changelog.md";

export function markdownPathToHtmlPath(pathname: string): string | undefined {
  if (!pathname.endsWith(".md")) return undefined;
  if (pathname === docsMarkdownRoot) return "/docs/";
  if (!pathname.startsWith(docsMarkdownPrefix)) return undefined;
  if (pathname === changelogMarkdownPath) return "/docs/changelog/all/";

  return `${pathname.slice(0, -3).replace(/\/+$/, "")}/`;
}

export function htmlPathToMarkdownPath(pathname: string): string | undefined {
  const normalizedPath = `/${pathname.replace(/^\/+|\/+$/g, "")}/`;

  if (normalizedPath === "/docs/") return docsMarkdownRoot;
  if (!normalizedPath.startsWith(docsMarkdownPrefix)) return undefined;
  if (normalizedPath === "/docs/changelog/all/") return changelogMarkdownPath;

  return `${normalizedPath.slice(0, -1)}.md`;
}
