import assert from "node:assert/strict";
import { test } from "node:test";
import { parseUnifiedDiff } from "@dicehub/kappa/components/diff-viewer";
import { createRoundedPath, createSplinePath } from "@dicehub/kappa/components/flow";
import { createToaster } from "@dicehub/kappa/components/toast/store";
import { filterDataGridRows, getDataGridColumnValue } from "@dicehub/kappa/components/data-grid";

test("public grid filtering combines queries and column predicates without changing supplied rows", () => {
  const rows = Object.freeze([
    Object.freeze({ id: "a", name: "Atlas", status: "Running", duration: 42 }),
    Object.freeze({ id: "b", name: "Beacon", status: "Ready", duration: 18 }),
    Object.freeze({ id: "c", name: "Cinder", status: "Ready", duration: 65 }),
  ]);
  const columns = [
    { id: "name", accessorKey: "name" }, { id: "status", accessorKey: "status" },
    { id: "duration", accessor: row => row.duration, filter: (value, _row, limit) => value <= limit },
  ];
  assert.equal(getDataGridColumnValue(columns[0], rows[0]), "Atlas");
  assert.equal(getDataGridColumnValue(columns[2], rows[0]), 42);
  const matches = (query, filters) => filterDataGridRows(rows, columns, query, filters);
  assert.deepEqual(matches(" BEA ", {}), [rows[1]]);
  assert.deepEqual(matches("", { status: "ready" }), [rows[1], rows[2]]);
  assert.deepEqual(matches("", { duration: 50 }), [rows[0], rows[1]]);
  assert.deepEqual(matches("", { duration: 20 }), [rows[1]]);
  assert.deepEqual(matches("atlas", { status: "ready" }), []);
  assert.deepEqual(matches("cinder", { unknown: true, status: "" }), [rows[2]]);
  const large = Object.freeze(Array.from({ length: 100_000 }, (_, index) =>
    Object.freeze({ id: String(index), name: `Record ${index}`, status: index % 2 ? "Running" : "Ready" })));
  assert.deepEqual(filterDataGridRows(large, columns.slice(0, 2), "record 9999", { status: "ready" }).map(row => row.id),
    ["99990", "99992", "99994", "99996", "99998"]);
});

const patch = body => `--- a/config.yaml\n+++ b/config.yaml\n${body}`;

test("a consumer parses multiple files, ranges, CRLF and Unicode without losing content", () => {
  const input = [
    patch("@@ -4,3 +4,3 @@ solver\n mode: steady\n-😀 100\n+😁 250\n enabled: true"),
    "--- /dev/null\n+++ b/new file.txt\t2026-10-10\n@@ -0,0 +1 @@\n+<img src=x onerror=alert(1)>\n\\ No newline at end of file\n",
  ].join("\n").replaceAll("\n", "\r\n");
  const result = parseUnifiedDiff(input);
  assert.equal(result.additions, 2);
  assert.equal(result.deletions, 1);
  assert.equal(result.files[1].newPath, "new file.txt");
  assert.equal(result.files[1].hunks[0].lines[0].text, "<img src=x onerror=alert(1)>");
  assert.equal(result.files[1].hunks[0].lines[0].noNewline, true);
  assert.deepEqual(result.files[0].hunks[0].lines.map(({ kind, oldLine, newLine }) => [kind, oldLine, newLine]), [
    ["context", 4, 4], ["removed", 5, undefined], ["added", undefined, 5], ["context", 6, 6],
  ]);
  const replacement = result.files[0].hunks[0].lines[1];
  assert.deepEqual(replacement.changed, [0, 5], "The changed range must include the complete emoji and changed digits.");
  assert.ok(!/[\uD800-\uDBFF]$/.test(replacement.text.slice(...replacement.changed)));
});

test("text patches retain Git creation/deletion metadata, multiple hunks and header-like content", () => {
  const createdAndDeleted = parseUnifiedDiff([
    "diff --git a/new.txt b/new.txt", "new file mode 100644", "index 0000000..123abcd",
    "--- /dev/null", "+++ b/new.txt", "@@ -0,0 +1 @@", "+hello",
    "diff --git a/old.txt b/old.txt", "deleted file mode 100644",
    "--- a/old.txt", "+++ /dev/null", "@@ -1 +0,0 @@", "-goodbye",
  ].join("\n"));
  assert.equal(createdAndDeleted.files.length, 2);
  assert.equal(createdAndDeleted.files[0].oldPath, "/dev/null");
  assert.equal(createdAndDeleted.files[1].newPath, "/dev/null");
  assert.equal(createdAndDeleted.additions, 1);
  assert.equal(createdAndDeleted.deletions, 1);
  const hunks = parseUnifiedDiff(patch("@@ -1 +1 @@\n-before\n+after\n@@ -9 +9 @@\n final").replaceAll("\n", "\r\n")).files[0].hunks;
  assert.equal(hunks.length, 2);
  assert.deepEqual([hunks[1].lines[0].oldLine, hunks[1].lines[0].newLine], [9, 9]);
  const file = parseUnifiedDiff("--- old file.txt\t2026-09-22\n+++ new file.txt\t2026-09-22\n@@ -1 +1 @@\n--- source\n+++ source").files[0];
  assert.deepEqual([file.oldPath, file.newPath], ["old file.txt", "new file.txt"]);
  assert.deepEqual(file.hunks[0].lines.map(line => line.text), ["-- source", "++ source"]);
});

test("replacement emphasis contains complete characters and only changed text; unpaired lines stay plain", () => {
  const rows = body => parseUnifiedDiff(patch(body)).files[0].hunks[0].lines;
  const numeric = rows("@@ -4,3 +4,3 @@ solver\n mode: steady\n-limit: 100\n+limit: 250\n enabled: true");
  assert.deepEqual(numeric[1].changed, [7, 9]);
  assert.equal(numeric[1].text.slice(...numeric[1].changed), "10");
  assert.equal(numeric[2].text.slice(...numeric[2].changed), "25");
  const emoji = rows("@@ -1 +1 @@\n-😀 unchanged\n+😁 unchanged");
  assert.deepEqual(emoji[0].changed, [0, 2]);
  assert.equal(emoji[1].text.slice(...emoji[1].changed), "😁");
  assert.ok(rows("@@ -1,2 +1 @@\n-one\n-two\n+three").every(line => line.changed === undefined));
  assert.deepEqual(rows("@@ -1 +1 @@\n-old\n\\ No newline at end of file\n+new\n\\ No newline at end of file").map(line => line.noNewline), [true, true]);
});

test("an empty patch is a no-op; malformed or unsupported patches fail", () => {
  assert.deepEqual(parseUnifiedDiff(""), { files: [], additions: 0, deletions: 0 });
  for (const input of [
    "\n", "arbitrary text", "@@ -1 +1 @@\n-a\n+b", "--- a/file\n+++ b/file",
    patch("@@ -1,2 +1 @@\n-a\n+b"), patch("@@ -1 +1 @@\n-a\n+b\n+c"),
    patch("@@ -1 +1 @@\n?a"), patch("@@ -2 +2 @@\n same\n@@ -2 +2 @@\n same"),
    patch("@@ -0 +1 @@\n-a\n+b"), patch("@@ -9007199254740992 +1 @@\n-a\n+b"),
    patch("@@ -1 +1 @@\n\\ No newline at end of file\n-a\n+b"),
    patch("@@ -1 +1 @@\n-a\n+b\n\\ No newline at end of file\n\\ No newline at end of file"),
    patch("@@ -1,2 +1,2 @@\n same\n\\ No newline at end of file\n next"),
    patch("@@@ -1,1 -1,1 +1,1 @@@\n-a\n+b"),
    "diff --git a/a b/a\nBinary files a/a and b/a differ",
    "diff --git a/a b/a\nold mode 100644\nnew mode 100755",
  ]) assert.throws(() => parseUnifiedDiff(input), input);
});

test("Flow connectors preserve documented horizontal and vertical endpoints", () => {
  assert.equal(createRoundedPath({ x1: 0, y1: 10, x2: 72, y2: 10 }), "M 0 10 L 64 10");
  assert.equal(createSplinePath({ x1: 0, y1: 10, x2: 72, y2: 50 }), "M 0 10 C 32 10 32 50 64 50");
  assert.equal(createSplinePath({ x1: 0, y1: 0, x2: 56, y2: 72 }, { orientation: "vertical" }), "M 0 0 C 0 32 56 32 56 64");
  assert.equal(createRoundedPath({ x1: 0, y1: 0, x2: 56, y2: 71 }, { orientation: "vertical", single: true }),
    "M 0 0 L 0 31 Q 0 39 8 39 L 48 39 Q 56 39 56 47 L 56 63");
});

test("public toast stores are isolated, update stable identities and drain their queues", () => {
  const first = createToaster({ duration: Infinity });
  const second = createToaster({ duration: Infinity });
  try {
    for (let i = 1; i <= 6; i++) first.create({ id: String(i), title: String(i) });
    assert.deepEqual(first.getVisibleToasts().map(toast => toast.id), ["6", "5", "4", "3", "2", "1"]);
    assert.equal(second.getCount(), 0);
    assert.equal(first.update("2", { title: "Updated" }), "2");
    assert.equal(first.getVisibleToasts().find(toast => toast.id === "2").title, "Updated");
    const limited = createToaster({ max: 1, duration: Infinity });
    try {
      limited.create({ id: "job", title: "Preparing" });
      limited.create({ id: "next", title: "Next" });
      assert.equal(limited.getCount(), 1);
      limited.remove("job");
      assert.equal(limited.getVisibleToasts()[0].id, "next");
    } finally { limited.remove(); }
  } finally { first.remove(); second.remove(); }
});

test("toast promise completion retains results and errors on the same notification", async () => {
  const store = createToaster({ duration: Infinity });
  try {
    const success = store.promise(Promise.resolve("mesh.zip"), {
      loading: { title: "Uploading" }, success: value => ({ title: `${value} uploaded` }), error: { title: "Failed" },
    });
    assert.equal(await success.unwrap(), "mesh.zip");
    assert.equal(store.getVisibleToasts()[0].id, success.id);
    assert.equal(store.getVisibleToasts()[0].type, "success");
    store.remove();
    const failure = store.promise(Promise.reject(new Error("Unavailable")), {
      loading: { title: "Uploading" }, error: { title: "Upload failed" },
    });
    await assert.rejects(failure.unwrap(), /Unavailable/);
    assert.equal(store.getVisibleToasts()[0].id, failure.id);
    assert.equal(store.getVisibleToasts()[0].type, "error");
  } finally { store.remove(); }
});
