import { cp, mkdir, readdir, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";

export async function saveArtifacts(root, scratch, full, result) {
  const report = join(root, "test-results/blackbox", basename(scratch));
  await mkdir(report, { recursive: true });
  for (const name of await readdir(scratch)) {
    if (/\.(?:log|json|yaml)$/.test(name)) await cp(join(scratch, name), join(report, name));
  }
  if (full) {
    try { await cp(join(full, "test-results"), join(report, "browser"), { recursive: true }); }
    catch (error) { if (error.code !== "ENOENT") throw error; }
  }
  await writeFile(join(report, "result.json"), JSON.stringify(result, null, 2));
  console.log(`Saved test reports: ${report}`);
}
