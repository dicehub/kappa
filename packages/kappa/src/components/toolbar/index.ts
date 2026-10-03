import ToolbarRoot from "./Toolbar.vue";
import ToolbarButton from "./ToolbarButton.vue";
import ToolbarInput from "./ToolbarInput.vue";
import ToolbarInputGroup from "./ToolbarInputGroup.vue";
import ToolbarLink from "./ToolbarLink.vue";
import ToolbarSeparator from "./ToolbarSeparator.vue";

export const Toolbar = Object.assign(ToolbarRoot, {
  Root: ToolbarRoot,
  Button: ToolbarButton,
  Link: ToolbarLink,
  Input: ToolbarInput,
  InputGroup: ToolbarInputGroup,
  Separator: ToolbarSeparator,
});

export {
  ToolbarButton,
  ToolbarInput,
  ToolbarInputGroup,
  ToolbarLink,
  ToolbarRoot,
  ToolbarSeparator,
};

export type {
  ToolbarButtonProps,
  ToolbarButtonSlots,
  ToolbarInputGroupProps,
  ToolbarInputGroupSlots,
  ToolbarInputEmits,
  ToolbarInputProps,
  ToolbarInputSlots,
  ToolbarLinkProps,
  ToolbarLinkSlots,
  ToolbarOrientation,
  ToolbarProps,
  ToolbarRootProps,
  ToolbarSeparatorProps,
  ToolbarSeparatorSlots,
  ToolbarSize,
  ToolbarSlots,
} from "./toolbar";

export {
  TOOLBAR_DEFAULT_LOOP_FOCUS,
  TOOLBAR_DEFAULT_ORIENTATION,
  TOOLBAR_DEFAULT_SIZE,
  TOOLBAR_ORIENTATIONS,
  TOOLBAR_SIZES,
  isToolbarOrientation,
  isToolbarSize,
  resolveToolbarOrientation,
  resolveToolbarSize,
} from "./toolbar";
