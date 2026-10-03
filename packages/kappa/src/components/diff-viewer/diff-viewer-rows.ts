import type { DiffLine } from "./diff-viewer";

export interface SplitDiffRow {
  before?: DiffLine;
  after?: DiffLine;
}

export function createSplitDiffRows(lines: DiffLine[]): SplitDiffRow[] {
  const rows: SplitDiffRow[] = [];
  for (let index = 0; index < lines.length;) {
    const line = lines[index];
    if (line.kind === "context") {
      rows.push({ before: line, after: line });
      index++;
      continue;
    }
    const removed: DiffLine[] = [];
    const added: DiffLine[] = [];
    while (lines[index]?.kind === "removed") removed.push(lines[index++]);
    while (lines[index]?.kind === "added") added.push(lines[index++]);
    for (let offset = 0; offset < Math.max(removed.length, added.length); offset++) {
      rows.push({ before: removed[offset], after: added[offset] });
    }
  }
  return rows;
}
