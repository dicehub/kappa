import SwitchRoot from "./Switch.vue";
import SwitchContext from "./SwitchContext.vue";
import SwitchControl from "./SwitchControl.vue";
import SwitchLabel from "./SwitchLabel.vue";
import SwitchRootProvider from "./SwitchRootProvider.vue";
import SwitchThumb from "./SwitchThumb.vue";

export const Switch = Object.assign(SwitchRoot, {
  Root: SwitchRoot,
  RootProvider: SwitchRootProvider,
  Control: SwitchControl,
  Thumb: SwitchThumb,
  Label: SwitchLabel,
  Context: SwitchContext,
});

export {
  SwitchContext,
  SwitchControl,
  SwitchLabel,
  SwitchRoot,
  SwitchRootProvider,
  SwitchThumb,
};

export {
  SWITCH_DEFAULT_SIZE,
  SWITCH_SIZES,
  isSwitchSize,
  resolveSwitchSize,
  type SwitchApi,
  type SwitchCheckedChangeDetails,
  type SwitchContextSlots,
  type SwitchContextValue,
  type SwitchControlProps,
  type SwitchControlSlots,
  type SwitchDirection,
  type SwitchEmits,
  type SwitchLabelProps,
  type SwitchLabelSlots,
  type SwitchPartSlots,
  type SwitchProps,
  type SwitchRootProps,
  type SwitchRootProviderProps,
  type SwitchRootProviderSlots,
  type SwitchRootSlots,
  type SwitchSize,
  type SwitchSlots,
  type SwitchThumbProps,
  type SwitchThumbSlots,
  type UseSwitchContext,
  type UseSwitchReturn,
} from "./switch";

export {
  switchAnatomy,
  useSwitch,
  useSwitchContext,
  type UseSwitchProps,
} from "@ark-ui/vue/switch";
