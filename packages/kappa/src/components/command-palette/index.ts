import CommandPaletteDialog from "./CommandPaletteDialog.vue";
import CommandPaletteEmpty from "./CommandPaletteEmpty.vue";
import CommandPaletteFooter from "./CommandPaletteFooter.vue";
import CommandPaletteGroup from "./CommandPaletteGroup.vue";
import CommandPaletteGroupLabel from "./CommandPaletteGroupLabel.vue";
import CommandPaletteHighlightedText from "./CommandPaletteHighlightedText.vue";
import CommandPaletteInput from "./CommandPaletteInput.vue";
import CommandPaletteItem from "./CommandPaletteItem.vue";
import CommandPaletteItems from "./CommandPaletteItems.vue";
import CommandPaletteList from "./CommandPaletteList.vue";
import CommandPaletteLoading from "./CommandPaletteLoading.vue";
import CommandPalettePanel from "./CommandPalettePanel.vue";
import CommandPaletteResultItem from "./CommandPaletteResultItem.vue";
import CommandPaletteResults from "./CommandPaletteResults.vue";
import CommandPaletteRoot from "./CommandPaletteRoot.vue";

export const CommandPalette = Object.assign(CommandPaletteRoot, {
  Dialog: CommandPaletteDialog,
  Empty: CommandPaletteEmpty,
  Footer: CommandPaletteFooter,
  Group: CommandPaletteGroup,
  GroupLabel: CommandPaletteGroupLabel,
  HighlightedText: CommandPaletteHighlightedText,
  Input: CommandPaletteInput,
  Item: CommandPaletteItem,
  Items: CommandPaletteItems,
  List: CommandPaletteList,
  Loading: CommandPaletteLoading,
  Panel: CommandPalettePanel,
  ResultItem: CommandPaletteResultItem,
  Results: CommandPaletteResults,
  Root: CommandPaletteRoot,
});

export {
  CommandPaletteDialog,
  CommandPaletteEmpty,
  CommandPaletteFooter,
  CommandPaletteGroup,
  CommandPaletteGroupLabel,
  CommandPaletteHighlightedText,
  CommandPaletteInput,
  CommandPaletteItem,
  CommandPaletteItems,
  CommandPaletteList,
  CommandPaletteLoading,
  CommandPalettePanel,
  CommandPaletteResultItem,
  CommandPaletteResults,
  CommandPaletteRoot,
};

export type {
  CommandPaletteArkHighlightDetails,
  CommandPaletteArkInputValueDetails,
  CommandPaletteArkSelectionDetails,
  CommandPaletteDialogProps,
  CommandPaletteEmits,
  CommandPaletteFilter,
  CommandPaletteHighlightDetails,
  CommandPaletteHighlightRange,
  CommandPaletteHighlightReason,
  CommandPaletteInputAttributes,
  CommandPaletteInputProps,
  CommandPaletteItemDisabled,
  CommandPaletteItemMapper,
  CommandPaletteItemProps,
  CommandPalettePanelEmits,
  CommandPalettePanelProps,
  CommandPaletteProps,
  CommandPaletteResultItemProps,
  CommandPaletteRootProps,
  CommandPaletteSelectOptions,
  CommandPaletteSelectableItems,
  CommandPaletteSlots,
} from "./command-palette";

export {
  createCommandPaletteSegments,
  getCommandPaletteItemValue,
  matchesCommandPaletteItem,
  stringifyCommandPaletteItem,
} from "./command-palette";
