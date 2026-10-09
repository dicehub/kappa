import type { Page, TestInfo } from "@playwright/test";

type TooltipEvent = Record<string, string | number | boolean | null>;

declare global {
  interface Window {
    __kappaTooltipEvents?: TooltipEvent[];
  }
}

export async function recordTooltipEvents(page: Page) {
  await page.addInitScript(() => {
    const events: TooltipEvent[] = [];
    window.__kappaTooltipEvents = events;
    const record = (type: string, target: EventTarget | null, key: string | null = null) => {
      const element = target instanceof Element ? target : null;
      const active = document.activeElement;
      const trigger = document.getElementById("tooltip:tooltip-demo-disabled:trigger");
      const content = document.getElementById("tooltip:tooltip-demo-disabled:content");
      events.push({
        time: performance.now(), type, key,
        target: element?.id || element?.tagName || null,
        active: active?.id || active?.tagName || null,
        scrollX, scrollY,
        triggerTop: trigger?.getBoundingClientRect().top ?? null,
        triggerState: trigger?.getAttribute("data-state") ?? null,
        contentState: content?.getAttribute("data-state") ?? null,
        focusVisible: trigger?.matches(":focus-visible") ?? null,
        pageFocused: document.hasFocus(),
      });
      if (events.length > 200) events.shift();
    };
    for (const type of ["focusin", "focusout", "keydown", "keyup", "scroll", "scrollend"]) {
      document.addEventListener(type, event => {
        record(type, event.target, event instanceof KeyboardEvent ? event.key : null);
      }, { capture: true, passive: true });
    }
    new MutationObserver(mutations => {
      for (const mutation of mutations) {
        const element = mutation.target;
        if (element instanceof Element && element.id.startsWith("tooltip:tooltip-demo-disabled:")) {
          record("state-change", element);
        }
      }
    }).observe(document, {
      subtree: true, attributes: true, attributeFilter: ["data-state", "hidden"],
    });
  });
}

export async function attachTooltipEvents(page: Page, info: TestInfo) {
  if (info.status === info.expectedStatus) return;
  let payload: { events: TooltipEvent[]; captureError?: string };
  try {
    payload = { events: await page.evaluate(() => window.__kappaTooltipEvents ?? []) };
  } catch (error) {
    payload = { events: [], captureError: error instanceof Error ? error.message : String(error) };
  }
  await info.attach("tooltip-focus-events", {
    body: JSON.stringify(payload, null, 2), contentType: "application/json",
  });
}
