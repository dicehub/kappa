import { readFileSync } from "node:fs";

const requiredEnvironment = [
  "CI_API_V4_URL",
  "CI_PROJECT_ID",
  "CI_JOB_TOKEN",
  "CI_COMMIT_TAG",
  "PACKAGE_VERSION",
];

for (const name of requiredEnvironment) {
  if (!process.env[name]) throw new Error(`${name} is required.`);
}

const expectedTag = `@dicehub/kappa@${process.env.PACKAGE_VERSION}`;
if (process.env.CI_COMMIT_TAG !== expectedTag) {
  throw new Error(`Expected tag ${expectedTag}, received ${process.env.CI_COMMIT_TAG}.`);
}

const description = readFileSync(process.argv[2] ?? "release-notes.md", "utf8");
const endpoint = `${process.env.CI_API_V4_URL}/projects/${process.env.CI_PROJECT_ID}/releases`;
const headers = {
  "Content-Type": "application/json",
  "JOB-TOKEN": process.env.CI_JOB_TOKEN,
};
const payload = {
  description,
  name: expectedTag,
  tag_name: expectedTag,
};

const create = await fetch(endpoint, {
  method: "POST",
  headers,
  body: JSON.stringify(payload),
});

if (create.ok) {
  console.log(`Created GitLab release ${expectedTag}.`);
} else if (create.status === 409) {
  const update = await fetch(`${endpoint}/${encodeURIComponent(expectedTag)}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ description, name: expectedTag }),
  });
  if (!update.ok) throw new Error(`Cannot update release: ${update.status} ${await update.text()}`);
  console.log(`Updated GitLab release ${expectedTag}.`);
} else {
  throw new Error(`Cannot create release: ${create.status} ${await create.text()}`);
}
