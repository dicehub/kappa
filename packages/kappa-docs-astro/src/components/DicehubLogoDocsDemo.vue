<script setup lang="ts">
import { DicehubLogo, PoweredByDicehub, generateDicehubLogoSvg, type DicehubLogoVariant } from "@dicehub/kappa/components/dicehub-logo";
import { onBeforeUnmount, onMounted, ref } from "vue";

type DemoVariant =
  | "basic" | "usage" | "glyph" | "vertical" | "colors" | "glyph-colors" | "sizes" | "copy"
  | "powered-basic" | "powered-variants" | "powered-footer" | "home"
  | "preview";

withDefaults(defineProps<{ variant?: DemoVariant }>(), { variant: "basic" });

const assetMenuRoot = ref<HTMLDetailsElement | null>(null);
const copied = ref<string | null>(null);
const statusMessage = ref("");
let copiedTimeout: ReturnType<typeof setTimeout> | undefined;

const closeAssetMenu = (restoreFocus = false) => {
  const menu = assetMenuRoot.value;
  if (!menu) return;
  menu.open = false;
  if (restoreFocus) menu.querySelector<HTMLElement>("summary")?.focus();
};

const copyToClipboard = async (text: string, label: string) => {
  try {
    await navigator.clipboard.writeText(text);
    copied.value = label;
    statusMessage.value = `${label === "glyph" ? "Mark" : label === "vertical" ? "Vertical logo" : "Full logo"} SVG copied.`;

    if (copiedTimeout) clearTimeout(copiedTimeout);
    copiedTimeout = setTimeout(() => {
      copied.value = null;
      statusMessage.value = "";
    }, 2000);
  } catch {
    statusMessage.value = "Unable to copy the SVG.";
  } finally {
    closeAssetMenu(true);
  }
};

const downloadBrandAsset = (variant: DicehubLogoVariant = "full") => {
  const blob = new Blob([generateDicehubLogoSvg({ variant })], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = variant === "vertical" ? "dicehub-logo-vertical.svg" : "dicehub-logo.svg";
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
  statusMessage.value = variant === "vertical" ? "Vertical dicehub logo SVG downloaded." : "dicehub logo SVG downloaded.";
  closeAssetMenu(true);
};

const handleDocumentPointerDown = (event: PointerEvent) => {
  if (
    assetMenuRoot.value?.open &&
    event.target instanceof Node &&
    !assetMenuRoot.value?.contains(event.target)
  ) {
    closeAssetMenu();
  }
};

onMounted(() => document.addEventListener("pointerdown", handleDocumentPointerDown));
onBeforeUnmount(() => {
  document.removeEventListener("pointerdown", handleDocumentPointerDown);
  if (copiedTimeout) clearTimeout(copiedTimeout);
});
</script>

<template>
  <div
    class="dicehub-logo-demo"
    :class="`dicehub-logo-demo--${variant}`"
    :data-logo-demo="variant"
  >
    <div v-if="variant === 'home'" class="dicehub-logo-demo__brand-plate">
      <DicehubLogo class="dicehub-logo-demo__home" title="dicehub logo" />
    </div>

    <DicehubLogo
      v-else-if="variant === 'basic' || variant === 'preview'"
      class="dicehub-logo-demo__full"
    />

    <DicehubLogo
      v-else-if="variant === 'usage'"
      class="dicehub-logo-demo__usage"
      title="Primary dicehub logo"
      data-testid="logo-attribute-forwarding"
    />

    <DicehubLogo
      v-else-if="variant === 'glyph'"
      class="dicehub-logo-demo__glyph"
      variant="glyph"
      title="dicehub glyph"
    />

    <div v-else-if="variant === 'vertical'" class="dicehub-logo-demo__row dicehub-logo-demo__row--loose">
      <DicehubLogo variant="vertical" class="dicehub-logo-demo__vertical" title="Vertical dicehub logo" />
      <div class="dicehub-logo-demo__surface dicehub-logo-demo__surface--light">
        <DicehubLogo variant="vertical" color="black" class="dicehub-logo-demo__vertical" title="Black vertical dicehub logo" />
      </div>
      <div class="dicehub-logo-demo__surface dicehub-logo-demo__surface--dark">
        <DicehubLogo variant="vertical" color="white" class="dicehub-logo-demo__vertical" title="White vertical dicehub logo" />
      </div>
    </div>

    <div
      v-else-if="variant === 'colors'"
      class="dicehub-logo-demo__row dicehub-logo-demo__row--loose"
    >
      <DicehubLogo class="dicehub-logo-demo__variant" color="color" title="Color dicehub logo" />
      <div class="dicehub-logo-demo__surface dicehub-logo-demo__surface--light">
        <DicehubLogo class="dicehub-logo-demo__variant" color="black" title="Black dicehub logo" />
      </div>
      <div class="dicehub-logo-demo__surface dicehub-logo-demo__surface--dark">
        <DicehubLogo class="dicehub-logo-demo__variant" color="white" title="White dicehub logo" />
      </div>
    </div>

    <div
      v-else-if="variant === 'glyph-colors'"
      class="dicehub-logo-demo__row dicehub-logo-demo__row--loose"
    >
      <DicehubLogo
        class="dicehub-logo-demo__glyph-small"
        variant="glyph"
        color="color"
        title="Color dicehub glyph"
      />
      <div class="dicehub-logo-demo__surface dicehub-logo-demo__surface--light">
        <DicehubLogo
          class="dicehub-logo-demo__glyph-small"
          variant="glyph"
          color="black"
          title="Black dicehub glyph"
        />
      </div>
      <div class="dicehub-logo-demo__surface dicehub-logo-demo__surface--dark">
        <DicehubLogo
          class="dicehub-logo-demo__glyph-small"
          variant="glyph"
          color="white"
          title="White dicehub glyph"
        />
      </div>
    </div>

    <div
      v-else-if="variant === 'sizes'"
      class="dicehub-logo-demo__row dicehub-logo-demo__row--bottom"
    >
      <DicehubLogo class="dicehub-logo-demo__size-sm" title="Small dicehub logo" />
      <DicehubLogo class="dicehub-logo-demo__size-md" title="Medium dicehub logo" />
      <DicehubLogo class="dicehub-logo-demo__size-lg" title="Large dicehub logo" />
    </div>

    <div v-else-if="variant === 'copy'" class="dicehub-logo-demo__copy">
      <details
        ref="assetMenuRoot"
        class="dicehub-logo-demo__asset-menu"
        @keydown.esc.stop.prevent="closeAssetMenu(true)"
      >
        <summary class="dicehub-logo-demo__asset-button">
          <DicehubLogo
            class="dicehub-logo-demo__asset-mark"
            color="white"
            title="dicehub"
          />
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="m4 6 4 4 4-4" />
          </svg>
        </summary>

        <div class="dicehub-logo-demo__menu" role="group" aria-label="Brand assets">
          <button
            type="button"
            @click="copyToClipboard(generateDicehubLogoSvg({ variant: 'glyph' }), 'glyph')"
          >
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3h10v10H3z" /></svg>
            <span>{{ copied === "glyph" ? "Copied!" : "Copy mark as SVG" }}</span>
          </button>
          <button
            type="button"
            @click="copyToClipboard(generateDicehubLogoSvg({ variant: 'full' }), 'full')"
          >
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3-4 5 4 5m4-10 4 5-4 5" /></svg>
            <span>{{ copied === "full" ? "Copied!" : "Copy full logo as SVG" }}</span>
          </button>
          <button type="button" @click="copyToClipboard(generateDicehubLogoSvg({ variant: 'vertical' }), 'vertical')">
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2h8v12H4z" /></svg>
            <span>{{ copied === "vertical" ? "Copied!" : "Copy vertical logo as SVG" }}</span>
          </button>
          <button type="button" @click="downloadBrandAsset()">
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2v8m-3-3 3 3 3-3M3 13h10" /></svg>
            <span>Download brand assets</span>
          </button>
          <button type="button" @click="downloadBrandAsset('vertical')">
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2v8m-3-3 3 3 3-3M3 13h10" /></svg>
            <span>Download vertical logo</span>
          </button>
          <div class="dicehub-logo-demo__menu-separator" role="separator"></div>
          <a
            href="https://dicehub.com"
            target="_blank"
            rel="noopener noreferrer"
            @click="closeAssetMenu()"
          >
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3h7v7M13 3 7 9M3 6v7h7" /></svg>
            <span>Visit brand guidelines</span>
          </a>
        </div>
      </details>
      <span>Click to open the brand assets menu</span>
      <span class="dicehub-logo-demo__status" aria-live="polite">{{ statusMessage }}</span>
    </div>

    <PoweredByDicehub v-else-if="variant === 'powered-basic'" />

    <div v-else-if="variant === 'powered-variants'" class="dicehub-logo-demo__row">
      <PoweredByDicehub />
      <PoweredByDicehub color="black" />
      <div class="dicehub-logo-demo__surface dicehub-logo-demo__surface--dark">
        <PoweredByDicehub color="white" />
      </div>
    </div>

    <footer v-else class="dicehub-logo-demo__footer">
      <span>© 2026 Your Company. All rights reserved.</span>
      <PoweredByDicehub />
    </footer>
  </div>
</template>

<style scoped src="./dicehub-logo-demo.css"></style>
