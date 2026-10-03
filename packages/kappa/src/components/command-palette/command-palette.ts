import type {
  ComboboxHighlightChangeDetails,
  ComboboxInputValueChangeDetails,
  ComboboxSelectionDetails,
  ListCollection,
} from "@ark-ui/vue/combobox";
import type { DialogRootProps } from "@ark-ui/vue/dialog";
import type { HTMLAttributes, VNodeChild } from "vue";

export type CommandPaletteHighlightRange = [number, number];
export type CommandPaletteHighlightReason = "keyboard" | "pointer" | "reset";

export type CommandPaletteSelectOptions = {
  event?: Event;
  newTab: boolean;
};

export type CommandPaletteHighlightDetails = {
  event?: Event;
  index: number;
  reason: CommandPaletteHighlightReason;
};

export type CommandPaletteItemMapper<T = unknown> = (item: T) => string;
export type CommandPaletteItemDisabled<T = unknown> = (item: T) => boolean;
export type CommandPaletteFilter<T = unknown> = false | ((item: T, query: string) => boolean);
export type CommandPaletteSelectableItems<T = unknown> = (items: T[]) => T[];

export interface CommandPaletteProps<T = unknown> {
  ariaLabel?: string;
  closeOnEscape?: DialogRootProps["closeOnEscape"];
  closeOnInteractOutside?: DialogRootProps["closeOnInteractOutside"];
  defaultOpen?: DialogRootProps["defaultOpen"];
  defaultValue?: string;
  filter?: CommandPaletteFilter<T>;
  getSelectableItems?: CommandPaletteSelectableItems<T>;
  isItemDisabled?: CommandPaletteItemDisabled<T>;
  itemToStringValue?: CommandPaletteItemMapper<T>;
  itemToValue?: CommandPaletteItemMapper<T>;
  items?: T[];
  lazyMount?: boolean;
  modal?: DialogRootProps["modal"];
  open?: DialogRootProps["open"];
  preventScroll?: DialogRootProps["preventScroll"];
  restoreFocus?: DialogRootProps["restoreFocus"];
  trapFocus?: DialogRootProps["trapFocus"];
  unmountOnExit?: boolean;
  value?: string;
}

export type CommandPaletteRootProps<T = unknown> = CommandPaletteProps<T>;
export type CommandPalettePanelProps<T = unknown> = Pick<
  CommandPaletteProps<T>,
  | "defaultValue"
  | "filter"
  | "getSelectableItems"
  | "isItemDisabled"
  | "itemToStringValue"
  | "itemToValue"
  | "items"
  | "open"
  | "value"
>;

export type CommandPaletteDialogProps = Pick<
  CommandPaletteProps,
  | "ariaLabel"
  | "closeOnEscape"
  | "closeOnInteractOutside"
  | "lazyMount"
  | "modal"
  | "open"
  | "preventScroll"
  | "restoreFocus"
  | "trapFocus"
  | "unmountOnExit"
>;

export type CommandPaletteEmits<T = unknown> = {
  close: [];
  itemHighlighted: [item: T | undefined, details: CommandPaletteHighlightDetails];
  openChange: [open: boolean];
  select: [item: T, options: CommandPaletteSelectOptions];
  "update:open": [open: boolean];
  "update:value": [value: string];
  valueChange: [value: string];
};

export type CommandPalettePanelEmits<T = unknown> = Pick<
  CommandPaletteEmits<T>,
  "close" | "itemHighlighted" | "select" | "update:value" | "valueChange"
>;

export interface CommandPaletteSlots<T = unknown> {
  default?: (props: {
    collection: ListCollection<T>;
    items: T[];
    selectableItems: T[];
    value: string;
  }) => VNodeChild;
}

export interface CommandPaletteInputProps {
  ariaLabel?: string;
  autoFocus?: boolean;
  placeholder?: string;
}

export type CommandPaletteInputAttributes = HTMLAttributes & {
  "aria-describedby"?: string;
  "aria-label"?: string;
};

export interface CommandPaletteItemProps<T = unknown> {
  disabled?: boolean;
  value: T;
}

export interface CommandPaletteResultItemProps<T = unknown>
  extends CommandPaletteItemProps<T> {
  breadcrumbHighlights?: CommandPaletteHighlightRange[][];
  breadcrumbs?: string[];
  description?: string;
  external?: boolean;
  nonInteractive?: boolean;
  showArrow?: boolean;
  title: string;
  titleHighlights?: CommandPaletteHighlightRange[];
}

export type CommandPaletteArkHighlightDetails<T = unknown> = ComboboxHighlightChangeDetails<T>;
export type CommandPaletteArkInputValueDetails = ComboboxInputValueChangeDetails;
export type CommandPaletteArkSelectionDetails = ComboboxSelectionDetails;

export const isCommandPaletteRecord = (item: unknown): item is Record<string, unknown> =>
  typeof item === "object" && item !== null && !Array.isArray(item);

export const stringifyCommandPaletteItem = <T>(
  item: T,
  mapper?: CommandPaletteItemMapper<T>,
) => {
  if (mapper) return mapper(item);
  if (typeof item === "string" || typeof item === "number" || typeof item === "boolean") {
    return String(item);
  }
  if (isCommandPaletteRecord(item)) {
    for (const key of ["title", "label", "name", "value"] as const) {
      if (item[key] != null) return String(item[key]);
    }
  }
  return String(item ?? "");
};

export const getCommandPaletteItemValue = <T>(
  item: T,
  mapper?: CommandPaletteItemMapper<T>,
  stringMapper?: CommandPaletteItemMapper<T>,
) => {
  if (mapper) return mapper(item);
  if (isCommandPaletteRecord(item)) {
    for (const key of ["id", "value", "title", "label", "name"] as const) {
      if (item[key] != null) return String(item[key]);
    }
  }
  return stringifyCommandPaletteItem(item, stringMapper);
};

export const matchesCommandPaletteItem = <T>({
  filter,
  item,
  itemToStringValue,
  query,
}: {
  filter?: CommandPaletteFilter<T>;
  item: T;
  itemToStringValue?: CommandPaletteItemMapper<T>;
  query: string;
}) => {
  const normalizedQuery = query.trim();
  if (!normalizedQuery || filter === false) return true;
  if (typeof filter === "function") return filter(item, normalizedQuery);
  return stringifyCommandPaletteItem(item, itemToStringValue)
    .toLocaleLowerCase()
    .includes(normalizedQuery.toLocaleLowerCase());
};

export const createCommandPaletteSegments = (
  text: string,
  highlights?: CommandPaletteHighlightRange[],
) => {
  if (!highlights?.length || !text.length) return [{ highlighted: false, text }];

  const ranges = highlights
    .map(
      ([start, end]) =>
        [Math.max(0, start), Math.min(text.length - 1, end)] as CommandPaletteHighlightRange,
    )
    .filter(([start, end]) => start <= end)
    .sort((first, second) => first[0] - second[0]);
  const merged: CommandPaletteHighlightRange[] = [];

  for (const range of ranges) {
    const previous = merged.at(-1);
    if (previous && range[0] <= previous[1] + 1) previous[1] = Math.max(previous[1], range[1]);
    else merged.push([...range]);
  }

  const segments: Array<{ highlighted: boolean; text: string }> = [];
  let cursor = 0;
  for (const [start, end] of merged) {
    if (start > cursor) segments.push({ highlighted: false, text: text.slice(cursor, start) });
    segments.push({ highlighted: true, text: text.slice(start, end + 1) });
    cursor = end + 1;
  }
  if (cursor < text.length) segments.push({ highlighted: false, text: text.slice(cursor) });
  return segments;
};
