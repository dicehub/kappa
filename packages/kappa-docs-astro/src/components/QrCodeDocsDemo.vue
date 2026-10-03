<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import { Input } from "@dicehub/kappa/components/input";
import { Label } from "@dicehub/kappa/components/label";
import { QrCode } from "@dicehub/kappa/components/qr-code";

type DemoVariant = "preview" | "usage" | "controlled" | "overlay" | "download";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const link = ref("https://example.com/guide");
</script>

<template>
  <div class="qr-code-demo" :data-qr-code-demo="props.variant">
    <QrCode.Root
      v-if="props.variant === 'preview'"
      id="quick-link-code"
      default-value="https://example.com/start"
      :pixel-size="6"
    >
      <QrCode.Frame role="img" aria-label="QR code for the getting started guide">
        <QrCode.Pattern />
      </QrCode.Frame>
    </QrCode.Root>

    <figure v-else-if="props.variant === 'usage'" class="qr-code-example">
      <QrCode.Root id="event-code" default-value="https://example.com/events/meetup" :pixel-size="5">
        <QrCode.Frame role="img" aria-label="QR code for the event page">
          <QrCode.Pattern />
        </QrCode.Frame>
      </QrCode.Root>
      <figcaption>Scan to open the event page</figcaption>
    </figure>

    <div v-else-if="props.variant === 'controlled'" class="qr-code-controlled">
      <div class="qr-code-controlled__field">
        <Label for="qr-code-link">Destination</Label>
        <Input id="qr-code-link" v-model="link" />
      </div>
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
    </div>

    <QrCode.Root
      v-else-if="props.variant === 'overlay'"
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

    <QrCode.Root
      v-else
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
  </div>
</template>

<style scoped>
.qr-code-demo {
  display: grid;
  inline-size: min(100%, 34rem);
  min-inline-size: 0;
  min-block-size: 15rem;
  place-items: center;
  color: var(--kappa-default, #17191f);
  font-family: var(--kappa-font-sans, inherit);
}

.qr-code-example {
  display: grid;
  justify-items: center;
  gap: 0.625rem;
  margin: 0;
}

.qr-code-example figcaption {
  color: var(--kappa-subtle, #6c7480);
  font-size: 0.75rem;
}

.qr-code-controlled {
  display: grid;
  inline-size: min(100%, 32rem);
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 1.5rem;
}

.qr-code-controlled__field {
  display: grid;
  min-inline-size: 0;
  gap: 0.375rem;
}

@media (max-width: 32rem) {
  .qr-code-controlled {
    grid-template-columns: minmax(0, 1fr);
    justify-items: center;
  }

  .qr-code-controlled__field {
    inline-size: 100%;
  }
}
</style>
