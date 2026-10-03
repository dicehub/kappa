import type {
  FieldsetErrorTextProps as ArkFieldsetErrorTextProps,
  FieldsetHelperTextProps as ArkFieldsetHelperTextProps,
  FieldsetLegendProps as ArkFieldsetLegendProps,
  FieldsetRootProps as ArkFieldsetRootProps,
  FieldsetRootProviderProps as ArkFieldsetRootProviderProps,
  UseFieldsetContext,
  UseFieldsetReturn,
} from "@ark-ui/vue/fieldset";
import type { UnwrapRef, VNodeChild } from "vue";

export const FIELDSET_ORIENTATIONS = ["vertical", "horizontal"] as const;
export const FIELDSET_DEFAULT_ORIENTATION = "vertical" satisfies FieldsetOrientation;

export type FieldsetOrientation = (typeof FIELDSET_ORIENTATIONS)[number];
export type FieldsetApi = UnwrapRef<UseFieldsetReturn>;
export type FieldsetContextValue = UnwrapRef<UseFieldsetContext>;

export interface FieldsetProps {
  asChild?: ArkFieldsetRootProps["asChild"];
  disabled?: ArkFieldsetRootProps["disabled"];
  id?: ArkFieldsetRootProps["id"];
  invalid?: ArkFieldsetRootProps["invalid"];
  /** Controls whether direct fieldset children stack or flow into columns. */
  orientation?: FieldsetOrientation;
}

export type FieldsetRootProps = FieldsetProps;

export interface FieldsetRootProviderProps {
  value: FieldsetApi;
  asChild?: ArkFieldsetRootProviderProps["asChild"];
  orientation?: FieldsetOrientation;
}

export type FieldsetLegendProps = ArkFieldsetLegendProps;
export type FieldsetHelperTextProps = ArkFieldsetHelperTextProps;
export type FieldsetErrorTextProps = ArkFieldsetErrorTextProps;

export interface FieldsetPartSlots {
  default?: () => VNodeChild;
}

export type FieldsetSlots = FieldsetPartSlots;
export type FieldsetRootSlots = FieldsetSlots;
export type FieldsetRootProviderSlots = FieldsetSlots;
export type FieldsetLegendSlots = FieldsetPartSlots;
export type FieldsetHelperTextSlots = FieldsetPartSlots;
export type FieldsetErrorTextSlots = FieldsetPartSlots;

export interface FieldsetContextSlots {
  default?: (context: FieldsetContextValue) => VNodeChild;
}

const includes = <Value extends string>(
  values: readonly Value[],
  value: unknown,
): value is Value => typeof value === "string" && values.includes(value as Value);

export const isFieldsetOrientation = (value: unknown): value is FieldsetOrientation =>
  includes(FIELDSET_ORIENTATIONS, value);

export const resolveFieldsetOrientation = (value: unknown): FieldsetOrientation =>
  isFieldsetOrientation(value) ? value : FIELDSET_DEFAULT_ORIENTATION;
