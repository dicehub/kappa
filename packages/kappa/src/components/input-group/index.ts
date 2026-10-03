import InputGroupRoot from "./InputGroup.vue";
import InputGroupAddon from "./InputGroupAddon.vue";
import InputGroupButton from "./InputGroupButton.vue";
import InputGroupInput from "./InputGroupInput.vue";
import InputGroupTextarea from "./InputGroupTextarea.vue";
import InputGroupText from "./InputGroupText.vue";

export const InputGroup = Object.assign(InputGroupRoot, {
  Root: InputGroupRoot,
  Addon: InputGroupAddon,
  Button: InputGroupButton,
  Input: InputGroupInput,
  Textarea: InputGroupTextarea,
  Text: InputGroupText,
});

export {
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupRoot,
  InputGroupText,
  InputGroupTextarea,
};

export {
  INPUT_GROUP_ADDON_ALIGNS,
  INPUT_GROUP_DEFAULT_ADDON_ALIGN,
  INPUT_GROUP_DEFAULT_SIZE,
  INPUT_GROUP_SIZES,
  isInputGroupAddonAlign,
  isInputGroupInvalid,
  isInputGroupSize,
  resolveInputGroupAriaBoolean,
  resolveInputGroupAddonAlign,
  resolveInputGroupSize,
  type InputGroupAddonAlign,
  type InputGroupAddonProps,
  type InputGroupAddonSlots,
  type InputGroupButtonProps,
  type InputGroupButtonSlots,
  type InputGroupContextValue,
  type InputGroupControlEmits,
  type InputGroupInputProps,
  type InputGroupModelValue,
  type InputGroupProps,
  type InputGroupRootProps,
  type InputGroupRootSlots,
  type InputGroupSize,
  type InputGroupSlots,
  type InputGroupTextProps,
  type InputGroupTextSlots,
  type InputGroupTextareaProps,
} from "./input-group";
