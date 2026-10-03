<script setup lang="ts">
import { AspectRatio } from "@dicehub/kappa/components/aspect-ratio";

type DemoVariant = "preview" | "usage" | "square" | "portrait" | "custom";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});
</script>

<template>
  <div class="aspect-ratio-demo" :data-aspect-ratio-demo="props.variant">
    <AspectRatio v-if="props.variant === 'preview'" :ratio="16 / 9" class="ratio-box">
      <img
        src="/illustrations/aspect-ratio-astronaut.webp"
        alt="Astronaut helmet with a reflective visor"
        class="ratio-box__image"
      />
    </AspectRatio>

    <AspectRatio v-else-if="props.variant === 'usage'" :ratio="4 / 3" class="ratio-box">
      <img
        src="/illustrations/aspect-ratio-astronaut.webp"
        alt="Astronaut helmet with a reflective visor"
        class="ratio-box__image"
      />
    </AspectRatio>

    <AspectRatio v-else-if="props.variant === 'square'" :ratio="1 / 1" class="ratio-box ratio-box--square">
      <img
        src="/illustrations/aspect-ratio-astronaut.webp"
        alt="Astronaut helmet with a reflective visor"
        class="ratio-box__image"
      />
    </AspectRatio>

    <AspectRatio v-else-if="props.variant === 'portrait'" :ratio="9 / 16" class="ratio-box ratio-box--portrait">
      <img
        src="/illustrations/aspect-ratio-astronaut.webp"
        alt="Astronaut helmet with a reflective visor"
        class="ratio-box__image"
      />
    </AspectRatio>

    <AspectRatio v-else :ratio="3 / 2" class="ratio-box">
      <img
        src="/illustrations/aspect-ratio-astronaut.webp"
        alt="Astronaut helmet with a reflective visor"
        class="ratio-box__image"
      />
    </AspectRatio>
  </div>
</template>

<style scoped>
.aspect-ratio-demo {
  display: flex;
  inline-size: 100%;
  min-inline-size: 0;
  min-block-size: 12rem;
  align-items: center;
  justify-content: center;
  color: var(--kappa-default, #17191f);
  font-family: var(--kappa-font-sans, inherit);
}

.ratio-box {
  inline-size: min(100%, 34rem);
  overflow: hidden;
  border: 1px solid var(--kappa-line, #e3e6eb);
  border-radius: 0.75rem;
  background: var(--kappa-tint, #f4f6f9);
}

.ratio-box--square {
  max-inline-size: 16rem;
}

.ratio-box--portrait {
  max-inline-size: 12rem;
}

.ratio-box__image {
  display: block;
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}

@media (max-width: 30rem) {
  .aspect-ratio-demo {
    min-block-size: 10rem;
  }
}

@media (forced-colors: active) {
  .ratio-box {
    border-color: CanvasText;
  }
}
</style>
