import { onMounted, ref } from "vue";
import { workspaceLinks } from "./paneled-workspace-navigation";

export const pinnableWorkspacePages = [
  ...["Dashboard", "Recents", "Activities", "Simulation runs", "All projects"].map(page => ({ page, label: page })),
  ...workspaceLinks.map(({ page, label }) => ({ page, label })),
];

export function usePaneledWorkspacePins() {
  const pinnedPages = ref(["Simulation runs", "All projects", "Explore"]);
  const storageKey = "kappa-paneled-workspace-pinned-pages";
  const sanitize = (pages: unknown[]) => [...new Set(pages.filter((page): page is string =>
    typeof page === "string" && pinnableWorkspacePages.some(item => item.page === page)))];
  onMounted(() => {
    try {
      const stored: unknown = JSON.parse(localStorage.getItem(storageKey) ?? "null");
      if (Array.isArray(stored)) pinnedPages.value = sanitize(stored);
    } catch { /* Keep defaults when storage is unavailable or invalid. */ }
  });
  function setPinnedPages(pages: string[]) {
    pinnedPages.value = sanitize(pages);
    try { localStorage.setItem(storageKey, JSON.stringify(pinnedPages.value)); } catch { /* Keep the local choice. */ }
  }
  return { pinnedPages, setPinnedPages };
}
