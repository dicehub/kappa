import { randomUUID } from "node:crypto";
import { test as base, expect, type Page } from "./network";

type Service = {
  id: string;
  url: string;
  control: (data: unknown) => Promise<void>;
  state: () => Promise<{ requests: { key: string }[]; mutations: unknown[]; aborted: string[]; pending: string[]; files: Record<string, unknown[]> }>;
};
export const test = base.extend<{ service: Service }>({
  service: async ({ request }, use) => {
    const url = process.env.KAPPA_BLACKBOX_SERVICE!;
    const response = await request.post(`${url}/cases`, { data: {} });
    expect(response.ok()).toBeTruthy();
    const { id } = await response.json();
    await use({
      id, url,
      control: async data => { expect((await request.post(`${url}/cases/${id}/control`, { data })).ok()).toBeTruthy(); },
      state: async () => (await request.get(`${url}/cases/${id}/state`)).json(),
    });
    await request.post(`${url}/cases/${id}/control`, { data: { release: ["load:root", "load:docs", "create:root", "rename:root", "action:root"] } });
  },
});
export { expect };
export async function visitConsumer(page: Page, path: string) {
  await page.goto(path);
  await expect(page.locator("astro-island[ssr]")).toHaveCount(0);
}
export const caseUrl = (path: string, service: Service, parameters = "") => `${path}?api=${encodeURIComponent(service.url)}&case=${service.id}&${parameters}&run=${randomUUID()}`;
