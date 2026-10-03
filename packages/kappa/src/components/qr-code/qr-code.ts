import type {
  QrCodeDownloadTriggerProps as ArkQrCodeDownloadTriggerProps,
  QrCodeGenerateOptions,
  QrCodeGenerateResult,
  QrCodeRootEmits as ArkQrCodeRootEmits,
  QrCodeRootProps as ArkQrCodeRootProps,
  UseQrCodeContext,
  UseQrCodeReturn,
} from "@ark-ui/vue/qr-code";
import type { UnwrapRef, VNodeChild } from "vue";
import type { ButtonVisualProps } from "../button";

// The quiet zone is encoded into the matrix so it survives image export and scaling.
export const resolveQrCodeEncoding = (encoding?: QrCodeGenerateOptions): QrCodeGenerateOptions => ({
  ...encoding,
  border: encoding?.border ?? 4,
});

export type QrCodeApi = UnwrapRef<UseQrCodeReturn>;
export type QrCodeContextValue = UnwrapRef<UseQrCodeContext>;
export type QrCodeValueChangeDetails = ArkQrCodeRootEmits["valueChange"][0];

export interface QrCodeRootProps {
  asChild?: boolean;
  defaultValue?: string;
  encoding?: QrCodeGenerateOptions;
  id?: string;
  ids?: ArkQrCodeRootProps["ids"];
  modelValue?: string;
  pixelSize?: number;
}

export type QrCodeRootEmits = {
  valueChange: ArkQrCodeRootEmits["valueChange"];
  "update:modelValue": ArkQrCodeRootEmits["update:modelValue"];
};

export interface QrCodeRootSlots {
  default?: () => VNodeChild;
}

export interface QrCodeRootProviderProps {
  value: QrCodeApi;
  asChild?: boolean;
}

export interface QrCodeRootProviderSlots {
  default?: () => VNodeChild;
}

export interface QrCodePartProps {
  asChild?: boolean;
}

export type QrCodeFrameProps = QrCodePartProps;
export type QrCodePartSlots = { default?: () => VNodeChild };
export type QrCodeFrameSlots = QrCodePartSlots;

export interface QrCodeDownloadTriggerProps extends ButtonVisualProps {
  asChild?: boolean;
  disabled?: boolean;
  fileName: string;
  mimeType: ArkQrCodeDownloadTriggerProps["mimeType"];
  quality?: number;
}

export interface QrCodeContextSlots {
  default?: (context: QrCodeContextValue) => VNodeChild;
}

export type {
  QrCodeGenerateOptions,
  QrCodeGenerateResult,
  UseQrCodeContext,
  UseQrCodeReturn,
} from "@ark-ui/vue/qr-code";
