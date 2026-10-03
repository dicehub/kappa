import type {
  AccordionFocusChangeDetails,
  AccordionItemProps as ArkAccordionItemProps,
  AccordionRootProps as ArkAccordionRootProps,
  AccordionValueChangeDetails,
} from "@ark-ui/vue/accordion";
import type { VNodeChild } from "vue";

export type AccordionOrientation = NonNullable<ArkAccordionRootProps["orientation"]>;
export type AccordionDirection = "ltr" | "rtl";

export interface AccordionProps {
  asChild?: ArkAccordionRootProps["asChild"];
  collapsible?: ArkAccordionRootProps["collapsible"];
  defaultValue?: ArkAccordionRootProps["defaultValue"];
  dir?: AccordionDirection;
  disabled?: ArkAccordionRootProps["disabled"];
  id?: ArkAccordionRootProps["id"];
  ids?: ArkAccordionRootProps["ids"];
  lazyMount?: ArkAccordionRootProps["lazyMount"];
  modelValue?: ArkAccordionRootProps["modelValue"];
  multiple?: ArkAccordionRootProps["multiple"];
  orientation?: ArkAccordionRootProps["orientation"];
  unmountOnExit?: ArkAccordionRootProps["unmountOnExit"];
}

export type AccordionRootProps = AccordionProps;

export type AccordionEmits = {
  focusChange: [details: AccordionFocusChangeDetails];
  valueChange: [details: AccordionValueChangeDetails];
  "update:modelValue": [value: string[]];
};

export interface AccordionSlots {
  default?: () => VNodeChild;
}

export interface AccordionItemProps {
  value: ArkAccordionItemProps["value"];
  disabled?: ArkAccordionItemProps["disabled"];
  asChild?: ArkAccordionItemProps["asChild"];
}

export interface AccordionItemSlots {
  default?: () => VNodeChild;
}

export interface AccordionTriggerSlots {
  default?: () => VNodeChild;
  indicator?: () => VNodeChild;
}

export interface AccordionContentSlots {
  default?: () => VNodeChild;
}

export interface AccordionIndicatorSlots {
  default?: () => VNodeChild;
}
