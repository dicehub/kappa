import RadioRoot from "./Radio.vue";
import RadioContext from "./RadioContext.vue";
import RadioIndicator from "./RadioIndicator.vue";
import RadioItem from "./RadioItem.vue";
import RadioItemContext from "./RadioItemContext.vue";
import RadioItemControl from "./RadioItemControl.vue";
import RadioItemText from "./RadioItemText.vue";
import RadioLabel from "./RadioLabel.vue";
import RadioRootProvider from "./RadioRootProvider.vue";

export const Radio = Object.assign(RadioRoot, {
  Root: RadioRoot,
  RootProvider: RadioRootProvider,
  Label: RadioLabel,
  Indicator: RadioIndicator,
  Item: RadioItem,
  ItemControl: RadioItemControl,
  ItemText: RadioItemText,
  Context: RadioContext,
  ItemContext: RadioItemContext,
});

export {
  RadioContext,
  RadioIndicator,
  RadioItem,
  RadioItemContext,
  RadioItemControl,
  RadioItemText,
  RadioLabel,
  RadioRoot,
  RadioRootProvider,
};

export type {
  RadioApi,
  RadioContextSlots,
  RadioContextValue,
  RadioDirection,
  RadioEmits,
  RadioGroupValueChangeDetails,
  RadioIndicatorProps,
  RadioIndicatorSlots,
  RadioItemContextSlots,
  RadioItemContextValue,
  RadioItemControlProps,
  RadioItemControlSlots,
  RadioItemProps,
  RadioItemSlots,
  RadioItemTextProps,
  RadioItemTextSlots,
  RadioLabelProps,
  RadioLabelSlots,
  RadioPartSlots,
  RadioProps,
  RadioRootProps,
  RadioRootProviderProps,
  RadioRootProviderSlots,
  RadioRootSlots,
  RadioSlots,
  UseRadioGroupContext,
  UseRadioGroupItemContext,
  UseRadioGroupReturn,
} from "./radio";

export {
  radioGroupAnatomy,
  useRadioGroup,
  useRadioGroupContext,
  useRadioGroupItemContext,
  type UseRadioGroupProps,
} from "@ark-ui/vue/radio-group";
