import assert from "node:assert/strict";
import { test } from "node:test";
import { parseUnifiedDiff } from "./parse-unified-diff.ts";
import { createSplitDiffRows } from "./diff-viewer-rows.ts";

const patch = (hunk) => `--- a/config.yaml\n+++ b/config.yaml\n${hunk}`;

test("parses ranges, counts, function headings, and paired inline emphasis", () => {
  const parsed = parseUnifiedDiff(patch("@@ -4,3 +4,3 @@ solver\n mode: steady\n-limit: 100\n+limit: 250\n enabled: true\n"));
  assert.equal(parsed.additions, 1);
  assert.equal(parsed.deletions, 1);
  assert.equal(parsed.files[0].newPath, "config.yaml");
  const rows = parsed.files[0].hunks[0].lines;
  assert.deepEqual(rows.map(({ oldLine, newLine }) => [oldLine, newLine]), [[4, 4], [5, undefined], [undefined, 5], [6, 6]]);
  assert.deepEqual(rows[1].changed, [7, 9]);
  assert.equal(rows[1].text.slice(...rows[1].changed), "10");
  assert.equal(rows[2].text.slice(...rows[2].changed), "25");
});

test("handles omitted counts, CRLF, multiple hunks, and no final newline", () => {
  const parsed = parseUnifiedDiff(patch("@@ -1 +1 @@\n-before\n+after\n@@ -9 +9 @@\n final").replaceAll("\n", "\r\n"));
  assert.equal(parsed.files[0].hunks.length, 2);
  assert.equal(parsed.files[0].hunks[1].lines[0].oldLine, 9);
});

test("accepts Git text metadata and multiple files including creation/deletion", () => {
  const parsed = parseUnifiedDiff("diff --git a/new.txt b/new.txt\nnew file mode 100644\nindex 0000000..123abcd\n--- /dev/null\n+++ b/new.txt\n@@ -0,0 +1 @@\n+hello\ndiff --git a/old.txt b/old.txt\ndeleted file mode 100644\n--- a/old.txt\n+++ /dev/null\n@@ -1 +0,0 @@\n-goodbye\n");
  assert.equal(parsed.files.length, 2);
  assert.equal(parsed.files[0].oldPath, "/dev/null");
  assert.equal(parsed.files[1].newPath, "/dev/null");
  assert.equal(parsed.additions, 1);
  assert.equal(parsed.deletions, 1);
});

test("preserves tab-separated header paths and file content resembling headers", () => {
  const parsed = parseUnifiedDiff("--- old file.txt\t2026-09-22\n+++ new file.txt\t2026-09-22\n@@ -1 +1 @@\n--- source\n+++ source\n");
  assert.equal(parsed.files[0].oldPath, "old file.txt");
  assert.equal(parsed.files[0].newPath, "new file.txt");
  assert.equal(parsed.files[0].hunks[0].lines[0].text, "-- source");
});

test("keeps no-newline markers attached to replacement lines", () => {
  const parsed = parseUnifiedDiff(patch("@@ -1 +1 @@\n-old\n\\ No newline at end of file\n+new\n\\ No newline at end of file\n"));
  assert.deepEqual(parsed.files[0].hunks[0].lines.map((line) => line.noNewline), [true, true]);
  assert.equal(parsed.additions, 1);
});

test("does not split surrogate pairs during inline emphasis", () => {
  const rows = parseUnifiedDiff(patch("@@ -1 +1 @@\n-😀 unchanged\n+😁 unchanged")).files[0].hunks[0].lines;
  assert.deepEqual(rows[0].changed, [0, 2]);
  assert.equal(rows[1].text.slice(...rows[1].changed), "😁");
});

test("leaves unmatched replacements without misleading inline emphasis", () => {
  const rows = parseUnifiedDiff(patch("@@ -1,2 +1 @@\n-one\n-two\n+three")).files[0].hunks[0].lines;
  assert.ok(rows.every((line) => line.changed === undefined));
  const split = createSplitDiffRows(rows);
  assert.equal(split.length, 2);
  assert.equal(split[0].before.text, "one");
  assert.equal(split[0].after.text, "three");
  assert.equal(split[1].before.text, "two");
  assert.equal(split[1].after, undefined);
});

test("split layout preserves context and addition-only blocks", () => {
  const rows = parseUnifiedDiff(patch("@@ -1 +1,2 @@\n+new\n kept")).files[0].hunks[0].lines;
  assert.deepEqual(createSplitDiffRows(rows), [{ before: undefined, after: rows[0] }, { before: rows[1], after: rows[1] }]);
});

test("empty text is the only header-free no-op", () => {
  assert.deepEqual(parseUnifiedDiff(""), { files: [], additions: 0, deletions: 0 });
  assert.throws(() => parseUnifiedDiff("\n"));
  assert.throws(() => parseUnifiedDiff("arbitrary text"));
});

for (const [name, text] of [
  ["missing file header", "@@ -1 +1 @@\n-a\n+b"],
  ["missing hunk", "--- a/file\n+++ b/file"],
  ["truncated hunk", patch("@@ -1,2 +1 @@\n-a\n+b")],
  ["surplus line", patch("@@ -1 +1 @@\n-a\n+b\n+c")],
  ["invalid marker", patch("@@ -1 +1 @@\n?a")],
  ["overlapping ranges", patch("@@ -2 +2 @@\n same\n@@ -2 +2 @@\n same")],
  ["zero line with content", patch("@@ -0 +1 @@\n-a\n+b")],
  ["unsafe integer", patch("@@ -9007199254740992 +1 @@\n-a\n+b")],
  ["orphan note", patch("@@ -1 +1 @@\n\\ No newline at end of file\n-a\n+b")],
  ["duplicate note", patch("@@ -1 +1 @@\n-a\n+b\n\\ No newline at end of file\n\\ No newline at end of file")],
  ["content after end of file", patch("@@ -1,2 +1,2 @@\n same\n\\ No newline at end of file\n next")],
  ["combined diff", patch("@@@ -1,1 -1,1 +1,1 @@@\n-a\n+b")],
  ["binary patch", "diff --git a/a b/a\nBinary files a/a and b/a differ"],
  ["metadata only", "diff --git a/a b/a\nold mode 100644\nnew mode 100755"],
]) {
  test(`rejects ${name}`, () => assert.throws(() => parseUnifiedDiff(text)));
}

test("preserves untrusted source as literal text", () => {
  const line = '<img src=x onerror="alert(1)">';
  const parsed = parseUnifiedDiff(patch(`@@ -0,0 +1 @@\n+${line}`));
  assert.equal(parsed.files[0].hunks[0].lines[0].text, line);
});
