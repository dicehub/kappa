import { onMounted, ref } from "vue";

function useLayoutOption(name: string) {
  const value = ref(false);
  const key = `kappa-paneled-workspace-${name}`;
  onMounted(() => {
    try { value.value = localStorage.getItem(key) === "true"; } catch { /* Use the default without storage. */ }
  });
  function setValue(next: boolean) {
    value.value = next;
    try { localStorage.setItem(key, String(next)); } catch { /* Keep the in-memory choice. */ }
  }
  return [value, setValue] as const;
}

export function usePaneledWorkspaceLayout() {
  const [insetHeader, setStoredInsetHeader] = useLayoutOption("inset-header");
  const [centeredSearch, setCenteredSearch] = useLayoutOption("centered-search");
  const [smartResize, setSmartResize] = useLayoutOption("smart-resize");
  const [showSnapGuide, setShowSnapGuide] = useLayoutOption("snap-guide");
  const [sidebarSearch, setSidebarSearch] = useLayoutOption("sidebar-search");
  const [projectGuide, setProjectGuide] = useLayoutOption("project-guide");
  const [projectHeadingLink, setProjectHeadingLink] = useLayoutOption("project-heading-link");
  const [collapsibleProjects, setCollapsibleProjects] = useLayoutOption("collapsible-projects");
  const [projectsSection, setProjectsSection] = useLayoutOption("projects-section");
  const [compactShowMore, setCompactShowMore] = useLayoutOption("compact-show-more");
  const [pinnedSection, setPinnedSection] = useLayoutOption("pinned-section");
  return { smartResize, setSmartResize, showSnapGuide, setShowSnapGuide, insetHeader, setStoredInsetHeader, centeredSearch, setCenteredSearch, sidebarSearch, setSidebarSearch, projectGuide, setProjectGuide, projectHeadingLink, setProjectHeadingLink, collapsibleProjects, setCollapsibleProjects, projectsSection, setProjectsSection, compactShowMore, setCompactShowMore, pinnedSection, setPinnedSection };
}
