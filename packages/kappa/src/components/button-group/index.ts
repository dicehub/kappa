import ButtonGroupRoot from "./ButtonGroup.vue";
import ButtonGroupSeparator from "./ButtonGroupSeparator.vue";
import ButtonGroupText from "./ButtonGroupText.vue";

export const ButtonGroup = Object.assign(ButtonGroupRoot, {
  Root: ButtonGroupRoot,
  Separator: ButtonGroupSeparator,
  Text: ButtonGroupText,
});

export { ButtonGroupRoot, ButtonGroupSeparator, ButtonGroupText };

export {
  BUTTON_GROUP_DEFAULT_ORIENTATION,
  BUTTON_GROUP_ORIENTATIONS,
  BUTTON_GROUP_SEPARATOR_DEFAULT_ORIENTATION,
  isButtonGroupOrientation,
  resolveButtonGroupOrientation,
  resolveButtonGroupSeparatorOrientation,
  type ButtonGroupOrientation,
  type ButtonGroupProps,
  type ButtonGroupRootProps,
  type ButtonGroupRootSlots,
  type ButtonGroupSeparatorProps,
  type ButtonGroupSlots,
  type ButtonGroupTextProps,
  type ButtonGroupTextSlots,
} from "./button-group";
