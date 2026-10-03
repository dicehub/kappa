import { nextTick, onScopeDispose, watchEffect, type Ref } from "vue";
import type { SidebarContext } from "./sidebar-context";

/** Keep the rail open while focus or the pointer is in it or an ARIA-owned popup. */
export function useSidebarPeek(nav: Ref<HTMLElement | undefined>, sidebar: SidebarContext) {
  watchEffect((onCleanup) => {
    const root = nav.value;
    if (!root || !sidebar.peekable.value || sidebar.isMobile.value) return;
    const doc = root.ownerDocument;
    let pointerInside = false;
    let dismissed = false;
    function contains(target: EventTarget | null): boolean {
      if (!(target instanceof Node)) return false;
      if (root!.contains(target)) return true;
      return Array.from(root!.querySelectorAll('[aria-controls][aria-expanded="true"]')).some(trigger =>
        trigger.getAttribute("aria-controls")?.split(/\s+/).some(id => doc.getElementById(id)?.contains(target)),
      );
    }
    function update() {
      const active = pointerInside || contains(doc.activeElement);
      if (!active) dismissed = false;
      sidebar.setPeekInteraction(active && !dismissed);
    }
    function onPointerOver(event: PointerEvent) {
      if (event.pointerType === "touch") return;
      pointerInside = contains(event.target);
      update();
    }
    function onPointerOut(event: PointerEvent) {
      if (event.pointerType === "touch") return;
      pointerInside = contains(event.relatedTarget);
      update();
    }
    function onFocus() { update(); }
    function onBlur() { pointerInside = false; sidebar.setPeekInteraction(false); }
    async function onKeydown(event: KeyboardEvent) {
      if (event.key !== "Escape" || event.defaultPrevented || !sidebar.isPeeking.value) return;
      const layer = event.target instanceof Element ? event.target.closest('[role="dialog"], [role="alertdialog"], [role="menu"], [role="listbox"]') : null;
      if (layer && !root!.contains(layer)) return;
      // A nested popup owns its first Escape. Hover-only peeks can be dismissed
      // even while focus remains in the page behind the rail.
      if (root!.querySelector('[aria-haspopup][aria-expanded="true"]')) return;
      const active = doc.activeElement;
      const section = active instanceof Element && root!.contains(active) ? active.closest('[data-slot="sidebar-collapsible"]') : null;
      dismissed = true;
      sidebar.setPeekInteraction(false);
      event.preventDefault();
      await nextTick();
      // Nested links become hidden; leave their focus on the visible disclosure.
      section?.querySelector<HTMLElement>('[data-scope="collapsible"][data-part="trigger"]')?.focus({ preventScroll: true });
    }
    doc.addEventListener("pointerover", onPointerOver);
    doc.addEventListener("pointerout", onPointerOut);
    doc.addEventListener("focusin", onFocus);
    doc.addEventListener("keydown", onKeydown);
    doc.defaultView?.addEventListener("blur", onBlur);
    update();
    onCleanup(() => {
      doc.removeEventListener("pointerover", onPointerOver);
      doc.removeEventListener("pointerout", onPointerOut);
      doc.removeEventListener("focusin", onFocus);
      doc.removeEventListener("keydown", onKeydown);
      doc.defaultView?.removeEventListener("blur", onBlur);
      sidebar.setPeekInteraction(false);
    });
  });
  onScopeDispose(() => sidebar.setPeekInteraction(false));
}
