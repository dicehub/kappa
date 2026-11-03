import { onBeforeUnmount, onMounted, ref } from "vue";

type ThemePreference = "light" | "dark" | "system";
const isTheme = (value: unknown): value is ThemePreference => value === "light" || value === "dark" || value === "system";

export function usePaneledTheme() {
  const theme = ref<ThemePreference>("light");
  let media: MediaQueryList | undefined;
  let observer: MutationObserver | undefined;
  const resolvedMode = () => theme.value === "system" ? media?.matches ? "dark" : "light" : theme.value;
  function readPreference(): ThemePreference {
    try {
      const stored = localStorage.getItem("theme");
      if (isTheme(stored)) return stored;
    } catch { /* Theme selection remains available without storage. */ }
    return document.documentElement.dataset.kappaTheme === "dark" ? "dark" : "light";
  }
  function applyTheme() {
    const mode = resolvedMode();
    const root = document.documentElement;
    root.dataset.kappaTheme = mode;
    root.dataset.mode = mode;
    root.style.colorScheme = mode;
    document.querySelectorAll("[data-theme-toggle]").forEach(toggle => toggle.setAttribute("aria-pressed", String(mode === "dark")));
  }
  function setTheme(value: string) {
    if (!isTheme(value)) return;
    theme.value = value;
    try { localStorage.setItem("theme", value); } catch { /* Keep the in-memory selection. */ }
    applyTheme();
  }
  function systemChanged() { if (theme.value === "system") applyTheme(); }
  function storageChanged(event: StorageEvent) {
    if (event.key !== "theme" && event.key !== null) return;
    theme.value = isTheme(event.newValue) ? event.newValue : "light";
    applyTheme();
  }
  onMounted(() => {
    media = window.matchMedia("(prefers-color-scheme: dark)");
    theme.value = readPreference();
    applyTheme();
    media.addEventListener("change", systemChanged);
    window.addEventListener("storage", storageChanged);
    // Keep the selection in sync with the surrounding documentation's theme toggle.
    observer = new MutationObserver(() => {
      if (document.documentElement.dataset.kappaTheme !== resolvedMode()) theme.value = readPreference();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-kappa-theme"] });
  });
  onBeforeUnmount(() => {
    media?.removeEventListener("change", systemChanged);
    window.removeEventListener("storage", storageChanged);
    observer?.disconnect();
  });
  return { theme, setTheme };
}
