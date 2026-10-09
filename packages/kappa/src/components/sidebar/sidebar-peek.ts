import { nextTick, onScopeDispose, watch, watchEffect, type Ref } from "vue";
import type { SidebarContext } from "./sidebar-context";

/** Keep temporary navigation open across its trigger, gap, and owned popups. */
export function useSidebarPeek(nav: Ref<HTMLElement | undefined>, sidebar: SidebarContext) {
  watchEffect((onCleanup) => {
    const root = nav.value;
    if (!root || !sidebar.peekable.value || sidebar.isMobile.value || sidebar.collapsible.value === "none") return;
    const doc = root.ownerDocument;
    const offcanvas = sidebar.collapsible.value === "offcanvas";
    let pointerInside = false;
    let pointerTarget: EventTarget | null = null;
    let dismissed = false;
    let suspended = false;
    let disposed = false;
    let focusFrame: number | undefined;
    function contains(target: EventTarget | null): boolean {
      if (!(target instanceof Node)) return false;
      const visited = new Set<Element>();
      const areas: Element[] = [root!];
      while (areas.length) {
        const area = areas.pop()!;
        if (visited.has(area)) continue;
        visited.add(area);
        if (area.contains(target)) return true;
        for (const trigger of area.querySelectorAll('[aria-controls][aria-expanded="true"]')) {
          for (const id of trigger.getAttribute("aria-controls")!.split(/\s+/)) {
            const popup = doc.getElementById(id);
            if (popup) areas.push(popup);
          }
        }
      }
      return false;
    }
    function containsPointer(target: EventTarget | null) {
      if (contains(target)) return true;
      if (!offcanvas || !(target instanceof Element)) return false;
      const trigger = target.closest('[data-slot="sidebar-trigger"][data-peek]:not(:disabled):not([aria-disabled="true"]):not([data-disabled])');
      return trigger?.getAttribute("aria-controls") === sidebar.navId.value;
    }
    function update() {
      if (disposed) return;
      const popupOpen = root!.querySelector('[aria-haspopup]:not([aria-haspopup="false"])[aria-controls][aria-expanded="true"]') !== null;
      const active = pointerInside || contains(doc.activeElement) || popupOpen;
      if (!active) dismissed = false;
      sidebar.setPeekInteraction(active && !dismissed && !suspended);
    }
    function onPointerOver(event: PointerEvent) {
      if (event.pointerType === "touch") return;
      suspended = false;
      pointerTarget = event.target;
      pointerInside = containsPointer(pointerTarget);
      if (focusFrame === undefined) update();
    }
    function onPointerOut(event: PointerEvent) {
      if (event.pointerType === "touch") return;
      pointerTarget = event.relatedTarget;
      pointerInside = containsPointer(pointerTarget);
      if (focusFrame === undefined) update();
    }
    function onFocus() {
      if (!doc.hasFocus()) return;
      suspended = false;
      update();
    }
    function onFocusOut() {
      // Popup effects settle on a frame, then return focus after deactivation.
      if (focusFrame !== undefined) doc.defaultView?.cancelAnimationFrame(focusFrame);
      focusFrame = doc.defaultView?.requestAnimationFrame(() => {
        focusFrame = doc.defaultView?.requestAnimationFrame(() => { focusFrame = undefined; update(); });
      });
    }
    function onBlur() {
      suspended = true;
      if (focusFrame !== undefined) doc.defaultView?.cancelAnimationFrame(focusFrame);
      focusFrame = undefined;
      pointerTarget = null;
      pointerInside = false;
      sidebar.setPeekInteraction(false);
    }
    async function onKeydown(event: KeyboardEvent) {
      if (event.key !== "Escape" || event.defaultPrevented || !sidebar.isPeeking.value) return;
      const layer = event.target instanceof Element ? event.target.closest('[role="dialog"], [role="alertdialog"], [role="menu"], [role="listbox"]') : null;
      if (layer && !root!.contains(layer)) return;
      // A nested popup owns its first Escape. Hover-only peeks can be dismissed
      // even while focus remains in the page behind the rail.
      if (root!.querySelector('[aria-haspopup]:not([aria-haspopup="false"])[aria-expanded="true"]')) return;
      const active = doc.activeElement;
      const hadFocus = contains(active);
      const section = active instanceof Element && root!.contains(active) ? active.closest('[data-slot="sidebar-collapsible"]') : null;
      dismissed = true;
      sidebar.setPeekInteraction(false);
      event.preventDefault();
      await nextTick();
      // Nested links become hidden; leave their focus on the visible disclosure.
      if (offcanvas && hadFocus) sidebar.focusTrigger();
      else section?.querySelector<HTMLElement>('[data-scope="collapsible"][data-part="trigger"]')?.focus({ preventScroll: true });
    }
    const stopOpen = watch(sidebar.open, (open, previous) => {
      if (!open && previous) { dismissed = true; sidebar.setPeekInteraction(false); }
      else if (open) dismissed = false;
    }, { flush: "sync" });
    // A trigger can be disabled or lose its peek prop without pointer movement.
    const triggers = new MutationObserver((changes) => {
      pointerInside = containsPointer(pointerTarget);
      if (changes.some(change => change.attributeName === "aria-expanded" && contains(change.target))) {
        onFocusOut();
      } else if (focusFrame === undefined) update();
    });
    if (offcanvas) triggers.observe(doc.documentElement, { subtree: true, attributes: true,
      attributeFilter: ["data-peek", "disabled", "aria-disabled", "data-disabled", "aria-expanded"] });
    doc.addEventListener("pointerover", onPointerOver);
    doc.addEventListener("pointerout", onPointerOut);
    doc.addEventListener("focusin", onFocus);
    doc.addEventListener("focusout", onFocusOut);
    doc.addEventListener("keydown", onKeydown);
    doc.defaultView?.addEventListener("blur", onBlur);
    doc.defaultView?.addEventListener("focus", onFocus);
    update();
    onCleanup(() => {
      disposed = true;
      if (focusFrame !== undefined) doc.defaultView?.cancelAnimationFrame(focusFrame);
      doc.removeEventListener("pointerover", onPointerOver);
      doc.removeEventListener("pointerout", onPointerOut);
      doc.removeEventListener("focusin", onFocus);
      doc.removeEventListener("focusout", onFocusOut);
      doc.removeEventListener("keydown", onKeydown);
      doc.defaultView?.removeEventListener("blur", onBlur);
      doc.defaultView?.removeEventListener("focus", onFocus);
      stopOpen();
      triggers.disconnect();
      sidebar.setPeekInteraction(false);
    });
  });
  onScopeDispose(() => sidebar.setPeekInteraction(false));
}
