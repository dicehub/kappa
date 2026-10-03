import { expect, type Locator, type Page, test } from "@playwright/test";

const demo = (page: Page, variant: string) =>
  page.locator(`[data-file-upload-demo="${variant}"]`);
const hiddenInput = (container: Locator) =>
  container.locator('[data-slot="file-upload-hidden-input"]');

const sampleFile = (name: string, mimeType = "model/stl") => ({
  name,
  mimeType,
  buffer: Buffer.from("solid kappa\nendsolid kappa"),
});

test.describe("File Upload documentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/docs/components/file-upload");
    const islands = page
      .locator("[data-file-upload-demo]")
      .locator("xpath=ancestor::astro-island");
    await expect(islands).toHaveCount(5);
    for (let index = 0; index < 5; index += 1) {
      await expect(islands.nth(index)).not.toHaveAttribute("ssr", "");
    }
  });

  test("renders the public API, examples, Ark link, and Markdown", async ({ page, request }) => {
    await expect(page.getByRole("heading", { level: 1, name: "File Upload" })).toBeVisible();
    await expect(page.getByText("Planned documentation")).toHaveCount(0);
    await expect(page.locator("#examples .docs-component-example")).toHaveCount(3);
    await expect(demo(page, "preview").locator('[data-slot="file-upload-item"]')).toHaveCount(2);
    await expect(demo(page, "states").locator('[data-slot="file-upload"][data-disabled]')).toHaveCount(1);
    await expect(demo(page, "states").locator('[data-slot="file-upload-dropzone"][data-invalid]')).toHaveCount(1);

    const primitive = page.getByRole("link", { name: "View Ark UI documentation" });
    await expect(primitive).toHaveAttribute("href", "https://ark-ui.com/docs/components/file-upload");
    await expect(primitive).toHaveAttribute("target", "_blank");

    const snippets = page.locator("pre[data-language]");
    await expect(snippets.first()).toContainText(
      'from "@dicehub/kappa/components/file-upload"',
    );
    await expect(snippets.filter({ hasText: "../../../kappa/src" })).toHaveCount(0);

    const response = await request.get("/docs/components/file-upload.md");
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain("# File Upload");
    expect(markdown).toContain("## [Accessibility](#accessibility)");
    expect(markdown).toContain("FileUpload.Root");
    expect(markdown).not.toContain("View Code");
    expect(markdown).not.toContain("On this page");
  });

  test("selects, lists, and removes files", async ({ page }) => {
    const usage = demo(page, "usage");
    await hiddenInput(usage).setInputFiles([
      sampleFile("rotor.stl"),
      sampleFile("housing.step", "model/step"),
    ]);

    const items = usage.locator('[data-slot="file-upload-item"]');
    await expect(items).toHaveCount(2);
    await expect(usage.locator('[data-slot="file-upload-item-name"]')).toHaveText([
      "rotor.stl",
      "housing.step",
    ]);
    await expect(usage.locator('[data-slot="file-upload-item-size-text"]')).toHaveCount(2);

    await usage.getByRole("button", { name: "Remove rotor.stl" }).click();
    await expect(items).toHaveCount(1);
    await expect(usage.locator('[data-slot="file-upload-item-name"]')).toHaveText([
      "housing.step",
    ]);
  });

  test("accepts a file dropped on the drop zone", async ({ page }) => {
    const usage = demo(page, "usage");
    const dropzone = usage.locator('[data-slot="file-upload-dropzone"]');
    const dispatchFileDrag = (type: "dragover" | "drop") =>
      dropzone.evaluate((element, eventType) => {
        const file = new File(["FoamFile"], "controlDict", { type: "text/plain" });
        const dataTransfer = {
          dropEffect: "none",
          files: [file],
          items: [
            {
              getAsEntry: () => ({ isDirectory: false, isFile: true }),
              getAsFile: () => file,
              kind: "file",
              type: file.type,
            },
          ],
          types: ["Files"],
        };
        const event = new Event(eventType, { bubbles: true, cancelable: true });
        Object.defineProperty(event, "dataTransfer", { value: dataTransfer });
        element.dispatchEvent(event);
      }, type);

    await dispatchFileDrag("dragover");
    await expect(dropzone).toHaveAttribute("data-dragging", "");
    await dispatchFileDrag("drop");
    await expect(usage.locator('[data-slot="file-upload-item-name"]')).toHaveText("controlDict");
  });

  test("shows rejected files and explains the constraints", async ({ page }) => {
    const validation = demo(page, "validation");
    await hiddenInput(validation).setInputFiles(
      sampleFile("notes.txt", "text/plain"),
    );

    await expect(
      validation.locator('[data-slot="file-upload-item"][data-type="rejected"]'),
    ).toHaveCount(1);
    await expect(validation.locator('[data-slot="file-upload-item-name"]')).toHaveText(
      "notes.txt",
    );
    await expect(validation.getByText("1 file was rejected.", { exact: false })).toBeVisible();
  });

  test("uploads files in a modal and reports progress", async ({ page }) => {
    await demo(page, "modal").getByRole("button", { name: "Upload files" }).click();
    const dialog = page.getByRole("dialog", { name: "Upload project files" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText("Maximum five files and 250 MB per file")).toBeVisible();

    await hiddenInput(dialog).setInputFiles(sampleFile("volume-mesh.msh", "application/octet-stream"));
    await expect(dialog.locator('[data-slot="file-upload-item-name"]')).toHaveText(
      "volume-mesh.msh",
    );
    await dialog.getByRole("button", { name: "Upload file" }).click();

    const progress = dialog.getByRole("progressbar");
    await expect(progress).toBeVisible();
    await expect(progress).toHaveAttribute("aria-valuenow", /(?:[1-9]|[1-9][0-9]|100)/);
    await expect(dialog.getByRole("button", { name: "Cancel" })).toBeDisabled();
    await expect(dialog.getByRole("button", { name: "Close dialog" })).toHaveCount(0);
    await expect(dialog.getByText("Upload complete. All files are ready.")).toBeVisible();
    await expect(progress).toHaveAttribute("aria-valuenow", "100");

    await dialog.getByRole("button", { name: "Done" }).click();
    await expect(dialog).toBeHidden();
  });
});
