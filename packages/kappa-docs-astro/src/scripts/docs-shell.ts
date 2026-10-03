import type { TransitionBeforeSwapEvent } from "astro:transitions/client";

type ThemeMode = "dark" | "light";

const SIDEBAR_KEY = "kappa-docs-sidebar-open";
const SIDEBAR_SCROLL_KEY = "kappa-docs-sidebar-scroll";

const getApp = (root: ParentNode = document) => root.querySelector<HTMLElement>("[data-docs-app]");

const setUnavailable = (element: HTMLElement | null, unavailable: boolean) => {
  if (!element) return;
  element.toggleAttribute("inert", unavailable);
  element.setAttribute("aria-hidden", unavailable ? "true" : "false");
};

const readTheme = (): ThemeMode => {
  const stored = localStorage.getItem("theme");
  return stored === "dark" || stored === "light" ? stored : "light";
};

const applyTheme = (mode: ThemeMode, targetDocument: Document = document) => {
  const root = targetDocument.documentElement;
  root.setAttribute("data-mode", mode);
  root.setAttribute("data-kappa-theme", mode);
  root.style.colorScheme = mode;
  targetDocument.querySelectorAll<HTMLElement>("[data-theme-toggle]").forEach((toggle) => {
    toggle.setAttribute("aria-pressed", mode === "dark" ? "true" : "false");
  });
};

const setTheme = (mode: ThemeMode) => {
  localStorage.setItem("theme", mode);
  applyTheme(mode);
};

const setSidebarOpen = (open: boolean, persist = true) => {
  const app = getApp();
  if (!app) return;

  app.setAttribute("data-sidebar-open", open ? "true" : "false");
  setUnavailable(document.querySelector<HTMLElement>("#desktop-navigation"), !open);
  if (persist) localStorage.setItem(SIDEBAR_KEY, open ? "true" : "false");
  document.querySelectorAll<HTMLElement>("[data-sidebar-toggle]").forEach((toggle) => {
    toggle.setAttribute("aria-pressed", open ? "true" : "false");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Collapse navigation" : "Expand navigation");
  });
};

let mobileReturnFocus: HTMLElement | null = null;

const setMobileOpen = (
  open: boolean,
  options: { focusDrawer?: boolean; restoreFocus?: boolean } = {},
) => {
  const app = getApp();
  if (!app) return;

  const { focusDrawer = true, restoreFocus = true } = options;
  const wasOpen = app.getAttribute("data-mobile-sidebar-open") === "true";
  const mobileNavigation = document.querySelector<HTMLElement>("#mobile-navigation");
  const mobileHeader = document.querySelector<HTMLElement>(".docs-mobile-header");
  const mainShell = document.querySelector<HTMLElement>(".docs-main-shell");
  const skipLink = document.querySelector<HTMLElement>(".docs-skip-link");

  if (open && !wasOpen) {
    mobileReturnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  }

  app.setAttribute("data-mobile-sidebar-open", open ? "true" : "false");
  setUnavailable(mobileNavigation, !open);
  setUnavailable(mobileHeader, open);
  setUnavailable(mainShell, open);
  setUnavailable(skipLink, open);
  document.body.style.overflow = open ? "hidden" : "";
  document.querySelectorAll<HTMLElement>("[data-mobile-sidebar-toggle]").forEach((toggle) => {
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  if (open && focusDrawer) {
    requestAnimationFrame(() => {
      mobileNavigation?.querySelector<HTMLElement>("[data-mobile-sidebar-close]")?.focus();
    });
  }

  const returnFocus = mobileReturnFocus;
  if (!open && wasOpen && restoreFocus && returnFocus?.isConnected) {
    requestAnimationFrame(() => returnFocus.focus());
  }
  if (!open) mobileReturnFocus = null;
};

const normalizePath = (path: string) => (path === "/" ? path : path.replace(/\/+$/, ""));

const isCurrentPath = (href: string, pathname: string) => {
  const normalizedHref = normalizePath(href);
  const normalizedPath = normalizePath(pathname);
  if (normalizedHref === "/docs") return normalizedPath === "/docs" || normalizedPath === "/";
  return normalizedPath === normalizedHref || normalizedPath.startsWith(`${normalizedHref}/`);
};

const syncActiveNavigation = () => {
  const links = [...document.querySelectorAll<HTMLAnchorElement>("[data-docs-nav-link]")];
  const normalizedPath = normalizePath(window.location.pathname);
  const activeHref =
    normalizedPath === "/"
      ? "/docs"
      : [...new Set(links.map((link) => normalizePath(new URL(link.href).pathname)))]
          .filter((href) => isCurrentPath(href, normalizedPath))
          .sort((first, second) => second.length - first.length)[0];

  links.forEach((link) => {
    const current = normalizePath(new URL(link.href).pathname) === activeHref;
    link.classList.toggle("is-active", current);
    if (current) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
};

const syncHeaderScrolled = () => {
  getApp()?.setAttribute("data-header-scrolled", window.scrollY > 72 ? "true" : "false");
};

const readSidebarScroll = (): Record<string, number> => {
  try {
    return JSON.parse(sessionStorage.getItem(SIDEBAR_SCROLL_KEY) ?? "{}");
  } catch {
    return {};
  }
};

const captureSidebarScroll = () => {
  const positions = readSidebarScroll();
  document.querySelectorAll<HTMLElement>("[data-sidebar-scroll]").forEach((element) => {
    positions[element.dataset.sidebarScroll ?? "default"] = element.scrollTop;
  });
  sessionStorage.setItem(SIDEBAR_SCROLL_KEY, JSON.stringify(positions));
};

const restoreSidebarScroll = () => {
  const positions = readSidebarScroll();
  document.querySelectorAll<HTMLElement>("[data-sidebar-scroll]").forEach((element) => {
    const position = positions[element.dataset.sidebarScroll ?? "default"];
    if (typeof position === "number") element.scrollTop = position;
  });
};

const initializePage = () => {
  applyTheme(readTheme());
  const storedSidebar = localStorage.getItem(SIDEBAR_KEY);
  setSidebarOpen(storedSidebar === null ? true : storedSidebar === "true", false);
  setMobileOpen(false, { restoreFocus: false });
  syncActiveNavigation();
  syncHeaderScrolled();
  requestAnimationFrame(() => {
    restoreSidebarScroll();
    getApp()?.setAttribute("data-shell-ready", "true");
  });
};

const handleClick = (event: MouseEvent) => {
  const target = event.target instanceof Element ? event.target : null;
  if (!target) return;

  if (target.closest("[data-theme-toggle]")) {
    setTheme(document.documentElement.getAttribute("data-mode") === "dark" ? "light" : "dark");
    return;
  }

  if (target.closest("[data-sidebar-toggle]")) {
    setSidebarOpen(getApp()?.getAttribute("data-sidebar-open") !== "true");
    return;
  }

  if (target.closest("[data-mobile-sidebar-toggle]")) {
    setMobileOpen(getApp()?.getAttribute("data-mobile-sidebar-open") !== "true");
    return;
  }

  if (target.closest("[data-mobile-sidebar-close]")) {
    setMobileOpen(false);
    return;
  }

  if (target.closest(".docs-sidebar-panel--mobile a")) {
    setMobileOpen(false, { restoreFocus: false });
  }
};

const handleBeforeSwap = (event: TransitionBeforeSwapEvent) => {
  setMobileOpen(false, { restoreFocus: false });
  captureSidebarScroll();
  event.newDocument.documentElement.dataset.docsJs = "true";
  applyTheme(readTheme(), event.newDocument);

  const currentApp = getApp();
  const nextApp = getApp(event.newDocument);
  if (!nextApp) return;

  nextApp.setAttribute("data-sidebar-open", currentApp?.getAttribute("data-sidebar-open") === "false" ? "false" : "true");
  nextApp.setAttribute("data-mobile-sidebar-open", "false");
  nextApp.setAttribute("data-shell-ready", "false");
  event.newDocument.body.style.overflow = "";
};

let scrollTicking = false;
window.addEventListener("scroll", () => {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(() => {
    syncHeaderScrolled();
    scrollTicking = false;
  });
}, { passive: true });

window.addEventListener("resize", () => {
  if (window.innerWidth >= 1024) setMobileOpen(false, { restoreFocus: false });
});

document.addEventListener("click", handleClick);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && getApp()?.getAttribute("data-mobile-sidebar-open") === "true") {
    setMobileOpen(false);
  }
});
document.addEventListener("scroll", (event) => {
  if (event.target instanceof HTMLElement && event.target.matches("[data-sidebar-scroll]")) {
    captureSidebarScroll();
  }
}, true);
document.addEventListener("astro:before-swap", handleBeforeSwap);
document.addEventListener("astro:after-swap", restoreSidebarScroll);
document.addEventListener("astro:page-load", initializePage);

initializePage();
