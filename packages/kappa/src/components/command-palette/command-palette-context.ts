import type { ListCollection } from "@ark-ui/vue/combobox";
import { inject, provide, type ComputedRef } from "vue";
import type {
  CommandPaletteHighlightReason,
  CommandPaletteSelectOptions,
} from "./command-palette";

export type CommandPaletteContext = {
  close: () => void;
  collection: ComputedRef<ListCollection<unknown>>;
  inputValue: ComputedRef<string>;
  items: ComputedRef<unknown[]>;
  noteHighlightReason: (reason: CommandPaletteHighlightReason) => void;
  open: ComputedRef<boolean>;
  selectHighlightedItem: (options: CommandPaletteSelectOptions) => void;
  selectItem: (item: unknown, options: CommandPaletteSelectOptions) => void;
  selectableItems: ComputedRef<unknown[]>;
  stringifyItem: (item: unknown) => string;
};

const contextKey = Symbol("kappa-command-palette");
const groupContextKey = Symbol("kappa-command-palette-group");

export const provideCommandPaletteContext = (context: CommandPaletteContext) => {
  provide(contextKey, context);
};

export const useCommandPaletteContext = (component = "CommandPalette") => {
  const context = inject<CommandPaletteContext | null>(contextKey, null);
  if (!context) throw new Error(`${component} must be used inside CommandPalette.Root or CommandPalette.Panel.`);
  return context;
};

export const provideCommandPaletteGroupContext = (items: ComputedRef<unknown[]>) => {
  provide(groupContextKey, items);
};

export const useCommandPaletteGroupContext = () =>
  inject<ComputedRef<unknown[]> | null>(groupContextKey, null);
