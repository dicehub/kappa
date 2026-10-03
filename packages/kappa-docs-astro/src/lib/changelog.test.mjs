import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getChangelogPageHref,
  getChangelogStaticPaths,
  parseChangelog,
} from "./changelog.js";

const CHANGELOG = `# @dicehub/kappa

## 1.2.3-next.4+build.8

### Minor Changes

- abcdef012345: Add **safe** Markdown with \`code\`, [a link](https://dicehub.com?a=1&b=2), and <script>alert(1)</script>.
  This continuation stays in the same entry.

  - A nested list item
  - Another item

  \`\`\`
  <unsafe />
  \`\`\`

### Patch Changes

- 1234567: Fix a regression.

## 1.2.2

### Major Changes

- ffffffff: Breaking update.`;

describe("changelog", () => {
  it("parses versions, prereleases, sections, and multiline Markdown", () => {
    const versions = parseChangelog(CHANGELOG);
    assert.equal(versions.length, 2);
    assert.equal(versions[0].version, "1.2.3-next.4+build.8");
    assert.equal(versions[0].id, "v1-2-3-next-4-build-8");
    assert.equal(versions[0].bump, "minor");
    assert.equal(versions[0].sections[0].entries[0].text.includes("This continuation"), true);
    assert.match(versions[0].sections[0].entries[0].html, /<strong>safe<\/strong>/);
    assert.match(versions[0].sections[0].entries[0].html, /<code>code<\/code>/);
    assert.match(versions[0].sections[0].entries[0].html, /<ul><li>A nested list item<\/li>/);
    assert.equal(versions[1].bump, "major");
  });

  it("escapes changelog HTML before callers use it with set:html", () => {
    const [version] = parseChangelog(CHANGELOG);
    const html = version.sections[0].entries[0].html;
    assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
    assert.match(html, /<pre><code>&lt;unsafe \/&gt;<\/code><\/pre>/);
    assert.doesNotMatch(html, /<script>|<unsafe/);
    assert.match(html, /href="https:\/\/dicehub\.com\?a=1&amp;b=2"/);
  });

  it("keeps entries without commit hashes separate from hashed entries", () => {
    const [version] = parseChangelog(`# @dicehub/kappa

## 0.4.0

### Minor Changes

- Initial code snapshot.
  Includes components and application blocks.

### Patch Changes

- Use \`skipLibCheck: true\` with the current Ark UI version.
- abcdef0: Keep an existing commit reference.
- Include the MIT license and third-party notices.
`);
    assert.equal(version.version, "0.4.0");
    assert.deepEqual(version.sections[0].entries.map(({ hash, text }) => ({ hash, text })), [
      { hash: "", text: "Initial code snapshot.\n  Includes components and application blocks." },
    ]);
    assert.deepEqual(version.sections[1].entries.map(({ hash }) => hash), ["", "abcdef0", ""]);
    assert.match(version.sections[1].entries[0].html, /<code>skipLibCheck: true<\/code>/);
    assert.equal(version.sections[1].entries[1].text, "Keep an existing commit reference.");
  });

  it("creates page props and pagination URLs", () => {
    const versions = parseChangelog(CHANGELOG);
    const paths = getChangelogStaticPaths({ perPage: 1, versions });
    assert.equal(paths.length, 3);
    assert.equal(paths[0].params.page, undefined);
    assert.equal(paths[1].params.page, "2");
    assert.equal(paths[1].props.versions[0].version, "1.2.2");
    assert.equal(paths.at(-1).params.page, "all");
    assert.equal(getChangelogPageHref(1), "/docs/changelog/");
    assert.equal(getChangelogPageHref(2), "/docs/changelog/2/");
  });
});
