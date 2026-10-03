import type { FileBrowserItem, FileBrowserSort } from "./file-browser";

export function filterFileBrowserItems(items: readonly FileBrowserItem[], query: string, sort: FileBrowserSort, direction: "asc" | "desc", locale = "en"): FileBrowserItem[] {
  const term = query.trim().toLocaleLowerCase(locale);
  const collator = new Intl.Collator(locale, { numeric: true, sensitivity: "base" });
  const date = (item: FileBrowserItem) => Number.isFinite(Date.parse(item.modifiedAt ?? "")) ? Date.parse(item.modifiedAt!) : 0;
  return items.filter(item => item.name.toLocaleLowerCase(locale).includes(term)).sort((left, right) => {
    if (left.kind !== right.kind) return left.kind === "folder" ? -1 : 1;
    const order = sort === "size" ? (left.size ?? 0) - (right.size ?? 0) : sort === "modified" ? date(left) - date(right) : collator.compare(left.name, right.name);
    return (order || collator.compare(left.name, right.name) || left.id.localeCompare(right.id)) * (direction === "desc" ? -1 : 1);
  });
}

export function fileBrowserNameError(name: string, items: readonly FileBrowserItem[], exceptId?: string): "invalidName" | "duplicateName" | null {
  const value = name.trim();
  if (!value || value === "." || value === ".." || /[/\\\x00-\x1f\x7f]/.test(value)) return "invalidName";
  return items.some(item => item.id !== exceptId && item.name === value) ? "duplicateName" : null;
}

export function validateFileBrowserItems(items: readonly FileBrowserItem[]): FileBrowserItem[] {
  const ids = new Set<string>();
  for (const item of items) {
    if (!item || typeof item.id !== "string" || !item.id || ids.has(item.id) || typeof item.name !== "string" || !item.name || !["file", "folder"].includes(item.kind)) {
      throw new Error("Each file needs a unique ID, name, and file or folder kind.");
    }
    ids.add(item.id);
  }
  return [...items];
}

export function formatFileBrowserSize(size: number | undefined, locale = "en"): string {
  if (size === undefined || !Number.isFinite(size) || size < 0) return "—";
  const units = ["B", "kB", "MB", "GB", "TB"];
  const index = Math.min(Math.floor(Math.log10(Math.max(size, 1)) / 3), units.length - 1);
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: index ? 1 : 0 }).format(size / 1000 ** index)} ${units[index]}`;
}

export function formatFileBrowserDate(value: string | undefined, locale = "en"): string {
  if (!value || !Number.isFinite(Date.parse(value))) return "—";
  return new Intl.DateTimeFormat(locale, { year: "numeric", month: "short", day: "2-digit", timeZone: "UTC" }).format(new Date(value));
}
