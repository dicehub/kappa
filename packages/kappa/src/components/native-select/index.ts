import NativeSelectRoot from "./NativeSelect.vue";
import NativeSelectOptGroup from "./NativeSelectOptGroup.vue";
import NativeSelectOption from "./NativeSelectOption.vue";

export const NativeSelect = Object.assign(NativeSelectRoot, {
  Root: NativeSelectRoot,
  Option: NativeSelectOption,
  OptGroup: NativeSelectOptGroup,
});

export {
  NativeSelectOptGroup,
  NativeSelectOption,
  NativeSelectRoot,
};

export {
  NATIVE_SELECT_DEFAULT_SIZE,
  NATIVE_SELECT_SIZES,
  isNativeSelectSize,
  resolveNativeSelectSize,
  type NativeSelectEmits,
  type NativeSelectModelValue,
  type NativeSelectOptGroupProps,
  type NativeSelectOptGroupSlots,
  type NativeSelectOptionProps,
  type NativeSelectOptionSlots,
  type NativeSelectProps,
  type NativeSelectSize,
  type NativeSelectSlots,
  type NativeSelectValue,
} from "./native-select";
