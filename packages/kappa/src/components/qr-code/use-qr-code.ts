import { useQrCode as useArkQrCode } from "@ark-ui/vue/qr-code";
import { computed, unref } from "vue";
import { resolveQrCodeEncoding } from "./qr-code";

/** Keep Ark state and events, with Kappa's four-module quiet-zone default. */
export const useQrCode: typeof useArkQrCode = (props, emit) =>
  useArkQrCode(computed(() => {
    const options = unref(props);
    return { ...options, encoding: resolveQrCodeEncoding(options?.encoding) };
  }), emit);
