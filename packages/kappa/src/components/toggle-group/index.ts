import ToggleGroupRoot from "./ToggleGroup.vue";
import ToggleGroupContext from "./ToggleGroupContext.vue";
import ToggleGroupItem from "./ToggleGroupItem.vue";
import ToggleGroupRootProvider from "./ToggleGroupRootProvider.vue";

export const ToggleGroup = Object.assign(ToggleGroupRoot, {
  Root: ToggleGroupRoot,
  RootProvider: ToggleGroupRootProvider,
  Item: ToggleGroupItem,
  Context: ToggleGroupContext,
});

export {
  ToggleGroupContext,
  ToggleGroupItem,
  ToggleGroupRoot,
  ToggleGroupRootProvider,
};

export type {
  ToggleGroupApi,
  ToggleGroupContextProps,
  ToggleGroupContextSlots,
  ToggleGroupContextValue,
  ToggleGroupEmits,
  ToggleGroupItemProps,
  ToggleGroupItemSlots,
  ToggleGroupProps,
  ToggleGroupRootProps,
  ToggleGroupRootProviderProps,
  ToggleGroupRootProviderSlots,
  ToggleGroupRootSlots,
  ToggleGroupSize,
  ToggleGroupSlots,
  ToggleGroupSpacing,
  ToggleGroupValueChangeDetails,
  ToggleGroupVariant,
  UseToggleGroupContext,
  UseToggleGroupReturn,
} from "./toggle-group";

export {
  TOGGLE_GROUP_DEFAULT_SIZE,
  TOGGLE_GROUP_DEFAULT_SPACING,
  TOGGLE_GROUP_DEFAULT_VARIANT,
  TOGGLE_GROUP_SIZES,
  TOGGLE_GROUP_SPACINGS,
  TOGGLE_GROUP_VARIANTS,
  isToggleGroupSize,
  isToggleGroupSpacing,
  isToggleGroupVariant,
  resolveToggleGroupSize,
  resolveToggleGroupSpacing,
  resolveToggleGroupVariant,
} from "./toggle-group";

export {
  toggleGroupAnatomy,
  useToggleGroup,
  useToggleGroupContext,
  type UseToggleGroupProps,
} from "@ark-ui/vue/toggle-group";
