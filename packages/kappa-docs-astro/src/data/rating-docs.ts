export const barrelCode = `import { Rating } from "@dicehub/kappa";`;

export const granularCode = `import { Rating } from "@dicehub/kappa/components/rating";`;

export const usageCode = `<script setup>
import { ref } from "vue";
import { Rating } from "@dicehub/kappa/components/rating";

const rating = ref(3);
</script>

<template>
  <Rating.Root v-model="rating" name="result-quality">
    <Rating.Label>Result quality</Rating.Label>
    <Rating.Control />
  </Rating.Root>
</template>`;

export const compositionCode = `<Rating.Root>
  <Rating.Label />
  <Rating.Control>
    <!-- Rating.Item parts render automatically. -->
  </Rating.Control>
  <Rating.Context />
</Rating.Root>`;

export const sizesCode = `<Rating.Root :default-value="3" size="sm" read-only>
  <Rating.Label>Small</Rating.Label>
  <Rating.Control />
</Rating.Root>

<Rating.Root :default-value="3" size="base" read-only>
  <Rating.Label>Base</Rating.Label>
  <Rating.Control />
</Rating.Root>

<Rating.Root :default-value="3" size="lg" read-only>
  <Rating.Label>Large</Rating.Label>
  <Rating.Control />
</Rating.Root>`;

export const halfCode = `<script setup>
import { ref } from "vue";
import { Rating } from "@dicehub/kappa/components/rating";

const rating = ref(3.5);
</script>

<template>
  <Rating.Root v-model="rating" allow-half name="solver-rating">
    <Rating.Label>Solver rating</Rating.Label>
    <Rating.Control />
  </Rating.Root>
</template>`;

export const controlledCode = `<script setup>
import { ref } from "vue";
import { Rating } from "@dicehub/kappa/components/rating";

const rating = ref(2);
</script>

<template>
  <Rating.Root v-model="rating" name="review-rating">
    <Rating.Label>Review rating</Rating.Label>
    <Rating.Control />
  </Rating.Root>
  <output>{{ rating }} of 5</output>
</template>`;

export const customCode = `<script setup>
import { Rating } from "@dicehub/kappa/components/rating";
import { Hexagon } from "@lucide/vue";
</script>

<template>
  <Rating.Root :default-value="4" name="confidence">
    <Rating.Label>Result confidence</Rating.Label>
    <Rating.Control v-slot="{ items }">
      <Rating.Item v-for="item in items" :key="item" :index="item">
        <Hexagon aria-hidden="true" />
      </Rating.Item>
    </Rating.Control>
  </Rating.Root>
</template>`;

export const statesCode = `<Rating.Root :default-value="3" disabled>
  <Rating.Label>Disabled</Rating.Label>
  <Rating.Control />
</Rating.Root>

<Rating.Root :default-value="4" read-only>
  <Rating.Label>Read-only</Rating.Label>
  <Rating.Control />
</Rating.Root>

<Rating.Root invalid required name="required-rating" aria-describedby="rating-error">
  <Rating.Label>Required rating</Rating.Label>
  <Rating.Control />
</Rating.Root>
<p id="rating-error">Select a rating.</p>`;

export const examples = [
  { id: "sizes", title: "Sizes", description: "Use small, base, or large geometry without changing rating behavior.", variant: "sizes", code: sizesCode },
  { id: "half-values", title: "Half Values", description: "Enable half-step selection when whole values are not precise enough.", variant: "half", code: halfCode },
  { id: "controlled", title: "Controlled", description: "Use v-model when application state owns the selected value.", variant: "controlled", code: controlledCode },
  { id: "custom-icons", title: "Custom Icons", description: "Replace the default star by rendering explicit Item parts from the Control slot.", variant: "custom", code: customCode },
  { id: "states", title: "States", description: "Disabled, read-only, and invalid states remain visually distinct.", variant: "states", code: statesCode },
] as const;

export const rootProps = [
  { name: "modelValue", type: "number", defaultValue: "—", description: "Controlled rating value; supports v-model." },
  { name: "defaultValue", type: "number", defaultValue: "0", description: "Initial value for uncontrolled use." },
  { name: "count", type: "number", defaultValue: "5", description: "Total number of rating items." },
  { name: "allowHalf", type: "boolean", defaultValue: "false", description: "Allows half-step values." },
  { name: "size", type: '"sm" | "base" | "lg"', defaultValue: '"base"', description: "Controls item and icon geometry." },
  { name: "disabled", type: "boolean", defaultValue: "false", description: "Prevents interaction and form changes." },
  { name: "readOnly", type: "boolean", defaultValue: "false", description: "Preserves the value without allowing changes." },
  { name: "invalid", type: "boolean", defaultValue: "false", description: "Applies invalid styling and aria-invalid." },
  { name: "name / form / required", type: "form props", defaultValue: "—", description: "Connects the generated hidden input to native forms." },
] as const;

export const parts = [
  { name: "Root / RootProvider", element: "div", description: "Owns rating value, hover, form, and direction state." },
  { name: "Label", element: "label", description: "Visible accessible label for the rating." },
  { name: "Control", element: "div", description: "Renders all default items or exposes the item list through its slot." },
  { name: "Item", element: "span", description: "One selectable value. It renders Kappa's star unless replaced by a slot." },
  { name: "Context / ItemContext", element: "none", description: "Exposes root or item state to custom compositions." },
] as const;

export const events = [
  { name: "update:modelValue", payload: "number", description: "The controlled value changed." },
  { name: "valueChange", payload: "RatingValueChangeDetails", description: "A rating value was selected." },
  { name: "hoverChange", payload: "RatingHoverChangeDetails", description: "The preview value under the pointer changed." },
] as const;

export const exportsList = [
  { name: "Rating / RatingRoot", description: "Compound root and named root export." },
  { name: "RatingLabel / Control / Item", description: "Named exports for the visible rating parts." },
  { name: "RatingProps / Rating*Props", description: "Public root and part contracts." },
  { name: "RATING_SIZES / RATING_DEFAULT_SIZE", description: "Supported sizes and default size." },
  { name: "useRating / useRatingContext / useRatingItemContext", description: "Ark UI hooks under Kappa Rating names." },
  { name: "ratingAnatomy", description: "Ark UI rating-group anatomy under the Kappa name." },
] as const;
