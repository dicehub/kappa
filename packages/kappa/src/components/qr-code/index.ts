import QrCodeRoot from "./QrCodeRoot.vue";
import QrCodeContext from "./QrCodeContext.vue";
import QrCodeDownloadTrigger from "./QrCodeDownloadTrigger.vue";
import QrCodeFrame from "./QrCodeFrame.vue";
import QrCodeOverlay from "./QrCodeOverlay.vue";
import QrCodePattern from "./QrCodePattern.vue";
import QrCodeRootProvider from "./QrCodeRootProvider.vue";

export const QrCode = Object.assign(QrCodeRoot, {
  Root: QrCodeRoot,
  RootProvider: QrCodeRootProvider,
  Frame: QrCodeFrame,
  Pattern: QrCodePattern,
  Overlay: QrCodeOverlay,
  DownloadTrigger: QrCodeDownloadTrigger,
  Context: QrCodeContext,
});

export {
  QrCodeContext,
  QrCodeDownloadTrigger,
  QrCodeFrame,
  QrCodeOverlay,
  QrCodePattern,
  QrCodeRoot,
  QrCodeRootProvider,
};

export type {
  QrCodeApi,
  QrCodeContextSlots,
  QrCodeContextValue,
  QrCodeDownloadTriggerProps,
  QrCodeFrameProps,
  QrCodeFrameSlots,
  QrCodeGenerateOptions,
  QrCodeGenerateResult,
  QrCodePartProps,
  QrCodePartSlots,
  QrCodeRootEmits,
  QrCodeRootProps,
  QrCodeRootProviderProps,
  QrCodeRootProviderSlots,
  QrCodeRootSlots,
  QrCodeValueChangeDetails,
  UseQrCodeContext,
  UseQrCodeReturn,
} from "./qr-code";

export { useQrCode } from "./use-qr-code";

export {
  qrCodeAnatomy,
  useQrCodeContext,
  type UseQrCodeProps,
} from "@ark-ui/vue/qr-code";
