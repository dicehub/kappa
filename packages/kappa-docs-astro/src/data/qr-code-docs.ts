export const barrelCode = `import { QrCode } from "@dicehub/kappa";`;

export const granularCode = `import { QrCode } from "@dicehub/kappa/components/qr-code";`;

export const previewCode = `<script setup lang="ts">
import { QrCode } from "@dicehub/kappa/components/qr-code";
</script>

<template>
  <QrCode.Root
    id="quick-link-code"
    default-value="https://example.com/start"
    :pixel-size="6"
  >
    <QrCode.Frame role="img" aria-label="QR code for the getting started guide">
      <QrCode.Pattern />
    </QrCode.Frame>
  </QrCode.Root>
</template>`;

export const usageCode = `<script setup lang="ts">
import { QrCode } from "@dicehub/kappa/components/qr-code";
</script>

<template>
  <figure class="qr-code-example">
    <QrCode.Root
      id="event-code"
      default-value="https://example.com/events/meetup"
      :pixel-size="5"
    >
      <QrCode.Frame role="img" aria-label="QR code for the event page">
        <QrCode.Pattern />
      </QrCode.Frame>
    </QrCode.Root>
    <figcaption>Scan to open the event page</figcaption>
  </figure>
</template>`;

export const controlledCode = `<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import { Input } from "@dicehub/kappa/components/input";
import { Label } from "@dicehub/kappa/components/label";
import { QrCode } from "@dicehub/kappa/components/qr-code";

const link = ref("https://example.com/guide");
</script>

<template>
  <Label for="qr-code-link">Destination</Label>
  <Input id="qr-code-link" v-model="link" />

  <QrCode.Root id="controlled-link-code" v-model="link" :pixel-size="4">
    <QrCode.Frame role="img" aria-label="QR code for the current destination">
      <QrCode.Pattern />
    </QrCode.Frame>
    <QrCode.Context v-slot="context">
      <Button
        size="sm"
        variant="outline"
        @click="context.setValue('https://example.com/support')"
      >
        Use support link
      </Button>
    </QrCode.Context>
  </QrCode.Root>
</template>`;

export const overlayCode = `<script setup lang="ts">
import { QrCode } from "@dicehub/kappa/components/qr-code";
</script>

<template>
  <QrCode.Root
    id="branded-link-code"
    default-value="https://example.com/account"
    :encoding="{ ecc: 'H' }"
    :pixel-size="6"
  >
    <QrCode.Frame role="img" aria-label="QR code for the account page">
      <QrCode.Pattern />
    </QrCode.Frame>
    <QrCode.Overlay aria-hidden="true">K</QrCode.Overlay>
  </QrCode.Root>
</template>`;

export const downloadCode = `<script setup lang="ts">
import { QrCode } from "@dicehub/kappa/components/qr-code";
</script>

<template>
  <QrCode.Root
    id="downloadable-link-code"
    default-value="https://example.com/contact"
    :pixel-size="6"
  >
    <QrCode.Frame role="img" aria-label="QR code for the contact page">
      <QrCode.Pattern />
    </QrCode.Frame>
    <QrCode.DownloadTrigger file-name="contact-link.png" mime-type="image/png">
      Download PNG
    </QrCode.DownloadTrigger>
  </QrCode.Root>
</template>`;

export const rootProps = [
  { name: "modelValue", type: "string", defaultValue: "—", description: "Controlled value encoded by the QR code. Use v-model for two-way binding." },
  { name: "defaultValue", type: "string", defaultValue: '""', description: "Initial value for uncontrolled use." },
  { name: "pixelSize", type: "number", defaultValue: "10", description: "Pixel size of each generated QR module." },
  { name: "encoding", type: "QrCodeGenerateOptions", defaultValue: "{ border: 4 }", description: "Generator options. Omitted border defaults to four clear modules; explicit values are preserved. Use ecc: 'H' for a small overlay." },
  { name: "id / ids", type: "string / object", defaultValue: "generated", description: "Stable machine and element identifiers." },
  { name: "asChild", type: "boolean", defaultValue: "false", description: "Merges root behavior and Kappa attributes onto one direct child." },
] as const;

export const downloadProps = [
  { name: "fileName", type: "string", defaultValue: "—", description: "Required file name for the generated image." },
  { name: "mimeType", type: '"image/png" | "image/jpeg" | "image/webp"', defaultValue: "—", description: "Required image format." },
  { name: "quality", type: "number", defaultValue: "browser default", description: "Optional JPEG or WebP image quality." },
  { name: "variant / size / icon", type: "ButtonVisualProps", defaultValue: "Button defaults", description: "Uses the shared Kappa Button visual contract." },
] as const;

export const parts = [
  { name: "QrCode.Root", element: "div", description: "Owns the encoded value and generated matrix." },
  { name: "QrCode.Frame", element: "svg", description: "Provides the square SVG canvas." },
  { name: "QrCode.Pattern", element: "path", description: "Renders the generated QR modules." },
  { name: "QrCode.Overlay", element: "div", description: "Centers a small mark above the pattern." },
  { name: "QrCode.DownloadTrigger", element: "button", description: "Downloads the current code as an image." },
  { name: "QrCode.Context", element: "renderless", description: "Exposes value, setValue, and data URL helpers." },
  { name: "QrCode.RootProvider", element: "div", description: "Provides an external useQrCode state machine." },
] as const;

export const events = [
  { name: "update:modelValue", payload: "string", description: "Emitted when context.setValue changes the encoded value." },
  { name: "valueChange", payload: "QrCodeValueChangeDetails", description: "Reports each value change." },
] as const;

export const exportsList = [
  { name: "QrCode", description: "Compound component and root alias." },
  { name: "QrCodeRoot and named parts", description: "Unaugmented component exports." },
  { name: "useQrCode / useQrCodeContext", description: "Ark UI QR code composables." },
  { name: "QrCode props, events, API, and generator types", description: "Public TypeScript contracts." },
] as const;
