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
  const [projectGuide, setProjectGuide] = useLayoutOption("project-guide");
  const [projectHeadingLink, setProjectHeadingLink] = useLayoutOption("project-heading-link");
  return { insetHeader, setStoredInsetHeader, projectGuide, setProjectGuide, projectHeadingLink, setProjectHeadingLink };
}
