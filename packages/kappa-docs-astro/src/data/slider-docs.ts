export const barrelCode = `import { Slider } from "@dicehub/kappa";`;

export const granularCode = `import { Slider } from "@dicehub/kappa/components/slider";`;

export const previewCode = `<script setup>
import { Slider } from "@dicehub/kappa/components/slider";
</script>

<template>
  <Slider.Root :default-value="[64]" :aria-label="['Mix level']">
    <Slider.Label>Mix level</Slider.Label>
    <Slider.ValueText />
    <Slider.Control>
      <Slider.Track>
        <Slider.Range />
      </Slider.Track>
      <Slider.Thumb :index="0">
        <Slider.HiddenInput />
      </Slider.Thumb>
    </Slider.Control>
  </Slider.Root>
</template>`;

export const usageCode = `<script setup>
import { Slider } from "@dicehub/kappa/components/slider";
</script>

<template>
  <Slider.Root :default-value="[42]" :max="100" :step="1" :aria-label="['Opacity']">
    <Slider.Label>Opacity</Slider.Label>
    <Slider.ValueText />
    <Slider.Control>
      <Slider.Track><Slider.Range /></Slider.Track>
      <Slider.Thumb :index="0"><Slider.HiddenInput /></Slider.Thumb>
    </Slider.Control>
  </Slider.Root>
</template>`;

export const rangeCode = `<script setup>
import { Slider } from "@dicehub/kappa/components/slider";
</script>

<template>
  <Slider.Root :default-value="[22, 78]" :min="0" :max="100" :aria-label="['Visible range']">
    <Slider.Label>Visible range</Slider.Label>
    <Slider.ValueText />
    <Slider.Control>
      <Slider.Track><Slider.Range /></Slider.Track>
      <Slider.Thumb :index="0"><Slider.HiddenInput /></Slider.Thumb>
      <Slider.Thumb :index="1"><Slider.HiddenInput /></Slider.Thumb>
    </Slider.Control>
  </Slider.Root>
</template>`;

export const marksCode = `<script setup>
import { Slider } from "@dicehub/kappa/components/slider";
</script>

<template>
  <Slider.Root :default-value="[50]" :aria-label="['CPU limit']">
    <Slider.Label>CPU limit</Slider.Label>
    <Slider.ValueText />
    <Slider.Control>
      <Slider.Track><Slider.Range /></Slider.Track>
      <Slider.Thumb :index="0"><Slider.HiddenInput /></Slider.Thumb>
    </Slider.Control>
    <Slider.MarkerGroup>
      <Slider.Marker :value="0">0%</Slider.Marker>
      <Slider.Marker :value="50">50%</Slider.Marker>
      <Slider.Marker :value="100">100%</Slider.Marker>
    </Slider.MarkerGroup>
  </Slider.Root>
</template>`;

export const verticalCode = `<script setup>
import { Slider } from "@dicehub/kappa/components/slider";
</script>

<template>
  <Slider.Root
    orientation="vertical"
    :default-value="[68]"
    :aria-label="['Temperature']"
  >
    <Slider.Label>Temperature</Slider.Label>
    <Slider.ValueText />
    <Slider.Control>
      <Slider.Track><Slider.Range /></Slider.Track>
      <Slider.Thumb :index="0"><Slider.HiddenInput /></Slider.Thumb>
    </Slider.Control>
  </Slider.Root>
</template>`;

export const sizesCode = `<script setup>
import { Slider } from "@dicehub/kappa/components/slider";
</script>

<template>
  <Slider.Root size="sm" :default-value="[24]" :aria-label="['Small']">
    <Slider.Label>Small</Slider.Label>
    <Slider.ValueText />
    <Slider.Control>
      <Slider.Track><Slider.Range /></Slider.Track>
      <Slider.Thumb :index="0"><Slider.HiddenInput /></Slider.Thumb>
    </Slider.Control>
  </Slider.Root>
  <Slider.Root size="lg" :default-value="[72]" :aria-label="['Large']">
    <Slider.Label>Large</Slider.Label>
    <Slider.ValueText />
    <Slider.Control>
      <Slider.Track><Slider.Range /></Slider.Track>
      <Slider.Thumb :index="0"><Slider.HiddenInput /></Slider.Thumb>
    </Slider.Control>
  </Slider.Root>
</template>`;

export const controlledCode = `<script setup>
import { ref } from "vue";
import { Slider } from "@dicehub/kappa/components/slider";

const value = ref([36]);
</script>

<template>
  <Slider.Root v-model="value" :aria-label="['Solver progress']">
    <Slider.Label>Solver progress</Slider.Label>
    <Slider.ValueText />
    <Slider.Control>
      <Slider.Track><Slider.Range /></Slider.Track>
      <Slider.Thumb :index="0"><Slider.HiddenInput /></Slider.Thumb>
    </Slider.Control>
  </Slider.Root>
  <output aria-live="polite">{{ value[0] }}%</output>
</template>`;

export const statesCode = `<script setup>
import { Slider } from "@dicehub/kappa/components/slider";
</script>

<template>
  <Slider.Root disabled :default-value="[30]" :aria-label="['Disabled']">
    <Slider.Label>Disabled</Slider.Label>
    <Slider.ValueText />
    <Slider.Control>
      <Slider.Track><Slider.Range /></Slider.Track>
      <Slider.Thumb :index="0"><Slider.HiddenInput /></Slider.Thumb>
    </Slider.Control>
  </Slider.Root>

  <Slider.Root read-only invalid :default-value="[70]" :aria-label="['Read only']">
    <Slider.Label>Read only</Slider.Label>
    <Slider.ValueText />
    <Slider.Control>
      <Slider.Track><Slider.Range /></Slider.Track>
      <Slider.Thumb :index="0"><Slider.HiddenInput /></Slider.Thumb>
    </Slider.Control>
  </Slider.Root>
</template>`;

export const originCode = `<Slider.Root :default-value="[64]" origin="center" :aria-label="['Offset']">
  <Slider.Label>Offset</Slider.Label>
  <Slider.ValueText />
  <Slider.Control>
    <Slider.Track><Slider.Range /></Slider.Track>
    <Slider.Thumb :index="0"><Slider.HiddenInput /></Slider.Thumb>
  </Slider.Control>
</Slider.Root>`;

export const rootProviderCode = `<script setup>
import { Slider, useSlider } from "@dicehub/kappa/components/slider";

const api = useSlider({ defaultValue: [48] });
</script>

<template>
  <Slider.RootProvider :value="api">
    <!-- Compose Slider.Label, Control, Track, Range, Thumb, and HiddenInput. -->
  </Slider.RootProvider>
</template>`;

export const rootProps = [
  { name: "defaultValue / modelValue", type: "number[]", defaultValue: "[0] / —", description: "Initial or controlled thumb values." },
  { name: "min / max / step", type: "number", defaultValue: "0 / 100 / 1", description: "Numeric range and keyboard granularity." },
  { name: "orientation", type: '"horizontal" | "vertical"', defaultValue: '"horizontal"', description: "Sets the track axis and keyboard axis." },
  { name: "origin", type: '"start" | "center"', defaultValue: '"start"', description: "Sets the fill origin for a single thumb." },
  { name: "disabled / readOnly / invalid", type: "boolean", defaultValue: "false", description: "Complete state flags owned by the Ark machine." },
  { name: "aria-label / aria-labelledby", type: "string[]", defaultValue: "—", description: "Optional per-thumb accessible names. Slider.Label is preferred for visible labels." },
  { name: "largeStep", type: "number", defaultValue: "10 × step", description: "Increment used by Page keys and Shift + Arrow keys." },
  { name: "minStepsBetweenThumbs", type: "number", defaultValue: "0", description: "Minimum step gap between multiple thumbs." },
  { name: "thumbAlignment", type: '"center" | "contain"', defaultValue: '"contain"', description: "Controls whether thumbs extend beyond the track ends." },
  { name: "thumbCollisionBehavior", type: '"none" | "push" | "swap"', defaultValue: '"none"', description: "Controls multiple-thumb collision behavior." },
  { name: "name / form", type: "string", defaultValue: "—", description: "Associates hidden inputs with a native form." },
  { name: "getAriaValueText", type: "(details) => string", defaultValue: "—", description: "Formats each thumb's accessible value text." },
  { name: "dir / id / ids / asChild / thumbSize", type: "Ark UI types", defaultValue: "Ark defaults", description: "Direction, machine IDs, composition, and measured thumb sizing." },
  { name: "size", type: '"sm" | "base" | "lg"', defaultValue: '"base"', description: "Selects Kappa control geometry. It does not change values or behavior." },
] as const;

export const parts = [
  { name: "Root", element: "div", description: "Owns values, range, state, and slider semantics." },
  { name: "RootProvider", element: "div", description: "Provides an externally created Ark slider machine." },
  { name: "Label", element: "label", description: "Visible accessible label for the thumb inputs." },
  { name: "ValueText", element: "span", description: "Current value text, or a custom slot." },
  { name: "Control", element: "div", description: "Pointer interaction surface and positioning context." },
  { name: "Track / Range", element: "div", description: "Track background and resolved active range." },
  { name: "Thumb", element: "div", description: "Focusable slider thumb. Add one HiddenInput per thumb." },
  { name: "HiddenInput", element: "input", description: "Native form value associated with its thumb." },
  { name: "MarkerGroup / Marker", element: "div / span", description: "Non-interactive scale marks positioned by value." },
  { name: "DraggingIndicator", element: "span", description: "Optional visual value shown while its thumb is dragged." },
  { name: "Context", element: "renderless", description: "Exposes the Ark slider API to a slot." },
] as const;

export const events = [
  { name: "update:modelValue", payload: "number[]", description: "Updates v-model after a value change." },
  { name: "valueChange", payload: "SliderValueChangeDetails", description: "Reports each value change." },
  { name: "valueChangeEnd", payload: "SliderValueChangeDetails", description: "Reports the end of a pointer or keyboard interaction." },
  { name: "focusChange", payload: "SliderFocusChangeDetails", description: "Reports the focused thumb index." },
] as const;

export const slots = [
  { name: "Root.default", description: "Slider parts in the Ark anatomy order." },
  { name: "Label / ValueText / Control / Track / Range", description: "Visible content for each styled part." },
  { name: "Thumb.default", description: "HiddenInput and optional DraggingIndicator content." },
  { name: "MarkerGroup.default / Marker.default", description: "Scale marks and optional labels." },
  { name: "Context.default", description: "Receives the renderless slider API." },
] as const;

export const dataAttributes = [
  { name: "data-slot", value: '"slider" and part names', description: "Identifies Kappa root and parts." },
  { name: "data-scope / data-part", value: '"slider" / Ark part', description: "Ark UI anatomy markers." },
  { name: "data-orientation", value: '"horizontal" | "vertical"', description: "Exposes the active axis on root and parts." },
  { name: "data-disabled / data-invalid / data-dragging / data-focus", value: "present", description: "Exposes Ark interaction and validation states." },
  { name: "data-readonly", value: "present", description: "Kappa marker for the read-only root state." },
  { name: "data-size", value: '"sm" | "base" | "lg"', description: "Exposes the resolved Kappa geometry option." },
  { name: "data-index / data-state / data-value", value: "part-specific", description: "Exposes thumb and marker identity and marker position state." },
] as const;

export const exportsList = [
  { name: "Slider", description: "Compound Ark-backed range control." },
  { name: "SliderRoot / RootProvider / Label / ValueText / Control", description: "Named root and interaction parts." },
  { name: "SliderTrack / Range / Thumb / HiddenInput", description: "Track, fill, thumb, and native form parts." },
  { name: "SliderMarkerGroup / Marker / DraggingIndicator / Context", description: "Scale, drag feedback, and renderless parts." },
  { name: "SliderProps / *Props / SliderEmits / *Slots", description: "Public Vue props, events, and slot contracts." },
  { name: "SliderSize / SLIDER_* / isSliderSize / resolveSliderSize", description: "Kappa geometry options and safe resolvers." },
  { name: "useSlider / useSliderContext / sliderAnatomy", description: "Ark UI composition exports." },
] as const;

export const keyboardRows = [
  { key: "Arrow keys", description: "Increment or decrement the focused thumb along its orientation axis." },
  { key: "PageUp / PageDown", description: "Change the value by largeStep." },
  { key: "Shift + Arrow keys", description: "Change the value by largeStep." },
  { key: "Home / End", description: "Set the focused thumb to its minimum or maximum." },
] as const;
