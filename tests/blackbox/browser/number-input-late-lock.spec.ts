import { test, expect, visitConsumer } from "./fixtures";

test("releases late native pointer lock while the disabled field stays mounted", async ({ page }, info) => {
  await visitConsumer(page, "/test-consumer/number-input");
  const field = page.getByRole("spinbutton", { name: "Scrub value", exact: true });
  const surface = field.locator("..");
  await surface.evaluate(element => {
    const input = element.querySelector("input")!;
    const disable = [...document.querySelectorAll("button")].find(button => button.textContent === "Disable scrubbing")!;
    const events: unknown[] = [];
    Object.assign(window, { kappaLockProbe: events });
    const record = (kind: string, trusted?: boolean) => events.push({
      kind, trusted, disabled: input.disabled, dragging: element.hasAttribute("data-dragging"),
      lock: document.pointerLockElement === null ? "none" : document.pointerLockElement === element ? "target" : "other",
      connected: element.isConnected,
    });
    record("initial");
    document.addEventListener("pointerlockchange", event => record("lock", event.isTrusted), true);
    document.addEventListener("pointerlockerror", () => record("lock error"));
    document.addEventListener("visibilitychange", () => { if (document.hidden) record("hidden"); });
    window.addEventListener("blur", event => { if (event.target === window) record("window blur"); });
    const observer = new MutationObserver(() => {
      if (element.hasAttribute("data-dragging") && !input.disabled) {
        record("disable requested");
        disable.click();
      } else if (input.disabled && !element.hasAttribute("data-dragging")) {
        record("disabled");
      }
    });
    observer.observe(element, { subtree: true, attributes: true, attributeFilter: ["data-dragging", "disabled"] });
    new MutationObserver(records => {
      for (const mutation of records) for (const removed of mutation.removedNodes) {
        if (removed === element || removed.contains(element)) record("detached");
      }
    }).observe(document.body, { subtree: true, childList: true });
  });
  const box = (await surface.boundingBox())!;
  const x = box.x + box.width / 2, y = box.y + box.height / 2;
  try {
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + 15, y);
    await expect(field).toBeDisabled();
    await expect.poll(() => page.evaluate(() => {
      const events = (window as unknown as { kappaLockProbe: { kind: string; trusted: boolean; disabled: boolean; dragging: boolean; lock: string; connected: boolean }[] }).kappaLockProbe;
      const disabled = events.findIndex(event => event.kind === "disabled" && event.lock === "none");
      const changes = events.filter((event, index) => index > disabled && event.kind === "lock" && event.trusted);
      return events[0]?.lock === "none" && disabled >= 0 && changes.length === 2 &&
        changes.every(event => event.lock === "none" && event.disabled && !event.dragging && event.connected) &&
        !events.some(event => ["lock error", "hidden", "window blur", "detached"].includes(event.kind)) && document.pointerLockElement === null;
    })).toBe(true);
    await expect(field).toHaveValue("12.5");
  } finally {
    await info.attach("trusted-pointer-lock-sequence", { contentType: "application/json", body: JSON.stringify({
      events: await page.evaluate(() => (window as unknown as { kappaLockProbe: unknown[] }).kappaLockProbe),
      final: await surface.evaluate(element => ({
        lock: document.pointerLockElement === null ? "none" : document.pointerLockElement === element ? "target" : "other",
        connected: element.isConnected, disabled: element.querySelector("input")!.disabled,
        dragging: element.hasAttribute("data-dragging"), visibility: document.visibilityState,
      })),
    }, null, 2) });
    await page.mouse.up();
  }
});
