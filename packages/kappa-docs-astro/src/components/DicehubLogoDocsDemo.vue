<script setup lang="ts">
import { DicehubLogo, PoweredByDicehub, generateDicehubLogoSvg } from "@dicehub/kappa/components/dicehub-logo";
import { onBeforeUnmount, onMounted, ref } from "vue";

type DemoVariant =
  | "basic" | "usage" | "glyph" | "colors" | "glyph-colors" | "sizes" | "copy"
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
    statusMessage.value = `${label === "glyph" ? "Mark" : "Full logo"} SVG copied.`;

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

const downloadBrandAsset = () => {
  const blob = new Blob([generateDicehubLogoSvg()], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "dicehub-logo.svg";
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
  statusMessage.value = "dicehub logo SVG downloaded.";
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
            variant="glyph"
            color="white"
            title="dicehub glyph"
            aria-hidden="true"
          />
          <span>Logo</span>
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
          <button type="button" @click="downloadBrandAsset">
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2v8m-3-3 3 3 3-3M3 13h10" /></svg>
            <span>Download brand assets</span>
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

<style scoped>
.dicehub-logo-demo {
  display: flex;
  width: 100%;
  min-height: 7rem;
  align-items: center;
  justify-content: center;
  color: var(--docs-default);
}

.dicehub-logo-demo--colors,
.dicehub-logo-demo--glyph-colors,
.dicehub-logo-demo--sizes,
.dicehub-logo-demo--copy,
.dicehub-logo-demo--powered-variants,
.dicehub-logo-demo--powered-footer {
  min-height: 9rem;
}

.dicehub-logo-demo--home {
  min-height: 0;
}

.dicehub-logo-demo__brand-plate {
  display: flex;
  width: min(100%, 15rem);
  min-height: 8rem;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.75rem;
  background: #ffffff;
  box-shadow: 0 1rem 2.5rem rgba(15, 23, 42, 0.08);
}

.dicehub-logo-demo__home,
.dicehub-logo-demo__size-lg {
  width: 11rem;
}

.dicehub-logo-demo__full {
  width: min(100%, 18rem);
}

.dicehub-logo-demo__usage {
  width: 9rem;
}

.dicehub-logo-demo__glyph {
  width: 6rem;
}

.dicehub-logo-demo__row {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.dicehub-logo-demo__row--loose {
  gap: 2rem;
}

.dicehub-logo-demo__row--bottom {
  align-items: flex-end;
  gap: 1.5rem;
}

.dicehub-logo-demo__surface {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  border-radius: 0.5rem;
}

.dicehub-logo-demo__surface--light {
  background: #ffffff;
}

.dicehub-logo-demo__surface--dark {
  background: #000000;
}

.dicehub-logo-demo__variant,
.dicehub-logo-demo__size-md {
  width: 7rem;
}

.dicehub-logo-demo__glyph-small {
  width: 3rem;
}

.dicehub-logo-demo__size-sm {
  width: 5rem;
}

.dicehub-logo-demo__copy {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: var(--docs-subtle);
  font-size: 0.875rem;
}

.dicehub-logo-demo__asset-menu {
  position: relative;
}

.dicehub-logo-demo__asset-button {
  display: inline-flex;
  min-height: 2.5rem;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  border: 1px solid #000000;
  border-radius: 0.5rem;
  background: #000000;
  color: #ffffff;
  font: inherit;
  font-weight: 600;
  list-style: none;
  user-select: none;
  cursor: pointer;
  transition: background-color 120ms ease, transform 120ms ease;
}

.dicehub-logo-demo__asset-button::-webkit-details-marker {
  display: none;
}

.dicehub-logo-demo__asset-button:hover {
  background: #262626;
  transform: translateY(-1px);
}

.dicehub-logo-demo__asset-button:focus-visible,
.dicehub-logo-demo__menu :is(button, a):focus-visible {
  outline: 2px solid var(--docs-brand);
  outline-offset: 2px;
}

.dicehub-logo-demo__asset-button > svg:last-child {
  width: 0.875rem;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.75;
  transition: transform 120ms ease;
}

.dicehub-logo-demo__asset-menu[open] .dicehub-logo-demo__asset-button > svg:last-child {
  transform: rotate(180deg);
}

.dicehub-logo-demo__asset-mark {
  width: 1.5rem;
}

.dicehub-logo-demo__menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  z-index: 20;
  display: grid;
  width: min(19rem, calc(100vw - 3rem));
  padding: 0.375rem;
  border: 1px solid var(--docs-border);
  border-radius: 0.625rem;
  background: var(--docs-base);
  box-shadow: 0 1rem 2.5rem rgba(15, 23, 42, 0.16);
}

.dicehub-logo-demo__menu :is(button, a) {
  display: grid;
  min-height: 2.25rem;
  grid-template-columns: 1rem minmax(0, 1fr);
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 0.625rem;
  border: 0;
  border-radius: 0.375rem;
  background: transparent;
  color: var(--docs-default);
  font: inherit;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
}

.dicehub-logo-demo__menu :is(button, a):hover,
.dicehub-logo-demo__menu :is(button, a):focus-visible {
  background: var(--docs-tint);
}

.dicehub-logo-demo__menu svg {
  width: 1rem;
  height: 1rem;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.5;
}

.dicehub-logo-demo__menu-separator {
  height: 1px;
  margin: 0.25rem -0.375rem;
  background: var(--docs-border);
}

.dicehub-logo-demo__status {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
}

.dicehub-logo-demo__footer {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border: 1px solid var(--docs-border);
  border-radius: 0.5rem;
  background: var(--docs-control);
  color: var(--docs-subtle);
  font-size: 0.875rem;
}

@media (max-width: 640px) {
  .dicehub-logo-demo__footer {
    align-items: flex-start;
    flex-direction: column;
  }

  .dicehub-logo-demo__row--loose {
    gap: 1rem;
  }
}

@media (max-width: 420px) {
  .dicehub-logo-demo__copy {
    align-items: flex-start;
    flex-direction: column;
  }

  .dicehub-logo-demo__menu {
    left: 50%;
    transform: translateX(-25%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .dicehub-logo-demo__asset-button,
  .dicehub-logo-demo__asset-button > svg:last-child {
    transition: none;
  }
}
</style>
