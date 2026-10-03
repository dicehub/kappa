import type { DiffDocument, DiffFile, DiffHunk, DiffLine } from "./diff-viewer";

const hunkPattern = /^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@(?: .*)?$/;
const metadataPattern = /^(?:index [\da-f]+\.\.[\da-f]+(?: \d+)?|(?:old mode|new mode|deleted file mode|new file mode) \d+|(?:similarity|dissimilarity) index \d+%|(?:rename|copy) (?:from|to) .+)$/;

function filePath(header: string): string {
  const path = header.slice(4).split("\t")[0];
  if (!path) throw new Error("Missing file path.");
  return path.replace(/^[ab]\//, "");
}

/** Parse complete unified/Git text patches. Throws for malformed or unsupported input. */
export function parseUnifiedDiff(patch: string): DiffDocument {
  const result: DiffDocument = { files: [], additions: 0, deletions: 0 };
  if (patch === "") return result;
  const lines = patch.split("\n").map((line) => line.endsWith("\r") ? line.slice(0, -1) : line);
  if (lines.at(-1) === "") lines.pop();
  let index = 0;
  const fail = (message: string): never => { throw new Error(`${message} (patch line ${index + 1}).`); };

  while (index < lines.length) {
    if (lines[index].startsWith("diff --git ")) {
      index++;
      while (index < lines.length && metadataPattern.test(lines[index])) index++;
    }
    if (!lines[index]?.startsWith("--- ") || !lines[index + 1]?.startsWith("+++ ")) {
      fail("Expected unified file headers");
    }
    const file: DiffFile = {
      oldPath: filePath(lines[index]), newPath: filePath(lines[index + 1]),
      additions: 0, deletions: 0, hunks: [],
    };
    index += 2;
    let previousOldEnd = 0;
    let previousNewEnd = 0;
    let oldFileEnded = false;
    let newFileEnded = false;

    while (index < lines.length && lines[index].startsWith("@@")) {
      const match = hunkPattern.exec(lines[index]);
      if (!match) fail("Invalid hunk header");
      const hunk: DiffHunk = {
        header: lines[index], oldStart: Number(match![1]), oldCount: Number(match![2] ?? 1),
        newStart: Number(match![3]), newCount: Number(match![4] ?? 1), lines: [],
      };
      const ranges = [[hunk.oldStart, hunk.oldCount], [hunk.newStart, hunk.newCount]];
      if (ranges.some(([start, count]) => !Number.isSafeInteger(start + count) || (count > 0 && start === 0))) {
        fail("Invalid hunk range");
      }
      // Zero-length ranges identify the line before an insertion/deletion.
      const oldOffset = hunk.oldStart + (hunk.oldCount === 0 ? 1 : 0);
      const newOffset = hunk.newStart + (hunk.newCount === 0 ? 1 : 0);
      if (oldOffset < previousOldEnd || newOffset < previousNewEnd) fail("Overlapping hunk ranges");
      previousOldEnd = oldOffset + hunk.oldCount;
      previousNewEnd = newOffset + hunk.newCount;
      let oldRemaining = hunk.oldCount;
      let newRemaining = hunk.newCount;
      let oldLine = hunk.oldStart;
      let newLine = hunk.newStart;
      index++;

      while (oldRemaining > 0 || newRemaining > 0 || lines[index] === "\\ No newline at end of file") {
        const line = lines[index];
        if (line === "\\ No newline at end of file") {
          const previous = hunk.lines.at(-1);
          if (!previous || previous.noNewline) fail("Unexpected no-newline marker");
          previous!.noNewline = true;
          if (previous!.kind !== "added") oldFileEnded = true;
          if (previous!.kind !== "removed") newFileEnded = true;
          index++;
          continue;
        }
        if (line === undefined || ![" ", "+", "-"].includes(line[0])) fail("Incomplete hunk");
        const marker = line[0];
        if ((marker !== "+" && oldFileEnded) || (marker !== "-" && newFileEnded)) {
          fail("Content follows the end-of-file marker");
        }
        const row: DiffLine = { kind: marker === "+" ? "added" : marker === "-" ? "removed" : "context", text: line.slice(1) };
        if (marker !== "+") { row.oldLine = oldLine++; oldRemaining--; }
        if (marker !== "-") { row.newLine = newLine++; newRemaining--; }
        if (oldRemaining < 0 || newRemaining < 0) fail("Hunk line count does not match its header");
        if (marker === "+") file.additions++;
        if (marker === "-") file.deletions++;
        hunk.lines.push(row);
        index++;
      }
      emphasizeReplacements(hunk.lines);
      file.hunks.push(hunk);
    }
    if (!file.hunks.length) fail("Expected a text hunk; metadata-only and binary patches are unsupported");
    result.files.push(file);
    result.additions += file.additions;
    result.deletions += file.deletions;
  }
  return result;
}

function emphasizeReplacements(lines: DiffLine[]): void {
  for (let index = 0; index < lines.length; index++) {
    if (lines[index].kind !== "removed") continue;
    const removed: DiffLine[] = [];
    const added: DiffLine[] = [];
    while (lines[index]?.kind === "removed") removed.push(lines[index++]);
    while (lines[index]?.kind === "added") added.push(lines[index++]);
    index--;
    if (removed.length !== added.length) continue;
    removed.forEach((before, offset) => {
      const after = added[offset];
      // Work on code points so emphasis never splits a surrogate pair.
      const left = Array.from(before.text);
      const right = Array.from(after.text);
      let start = 0;
      let end = 0;
      const common = Math.min(left.length, right.length);
      while (start < common && left[start] === right[start]) start++;
      while (end < common - start && left.at(-1 - end) === right.at(-1 - end)) end++;
      for (const [row, chars] of [[before, left], [after, right]] as const) {
        const from = chars.slice(0, start).join("").length;
        const to = row.text.length - (end ? chars.slice(-end).join("").length : 0);
        if (from < to) row.changed = [from, to];
      }
    });
  }
}
