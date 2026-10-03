import { componentNav, navGroups, primaryNav, type NavLink } from "../data/docs-nav.ts";

const normalizePath = (pathname: string) =>
  (pathname.split(/[?#]/, 1)[0] ?? "/").replace(/\/+$/, "") || "/";

const componentsLanding = primaryNav.find(
  (link) => normalizePath(link.href) === "/docs/components",
);
const blocksLanding = primaryNav.find((link) => normalizePath(link.href) === "/docs/blocks");

export const docsPageSequences: NavLink[][] = [
  primaryNav.filter((link) => !["/docs/components", "/docs/blocks"].includes(normalizePath(link.href))),
  ...(componentsLanding ? [[componentsLanding, ...componentNav.links]] : []),
  ...navGroups.filter((group) => group !== componentNav).map((group) =>
    group.label === "Blocks" && blocksLanding ? [blocksLanding, ...group.links] : group.links,
  ),
];

export function getAdjacentDocsPages(pathname: string): {
  next?: NavLink;
  previous?: NavLink;
} {
  const normalizedPath = normalizePath(pathname);
  const sequence = docsPageSequences.find((links) =>
    links.some((link) => normalizePath(link.href) === normalizedPath),
  );
  if (!sequence) return {};

  const currentIndex = sequence.findIndex(
    (link) => normalizePath(link.href) === normalizedPath,
  );

  return {
    previous: sequence[currentIndex - 1],
    next: sequence[currentIndex + 1],
  };
}
