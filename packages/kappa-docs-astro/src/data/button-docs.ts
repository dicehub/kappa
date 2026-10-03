export const barrelCode = `import { Button, LinkButton } from "@dicehub/kappa";`;

export const granularCode = `import { Button, LinkButton } from "@dicehub/kappa/components/button";`;

export const lucideInstallCode = `pnpm add @lucide/vue`;

export const previewCode = `<script setup>
import { ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";

const message = ref("No action yet");
</script>

<template>
  <section class="run-panel">
    <div><span>Rotor study · Run 042</span><strong>Ready to submit</strong></div>
    <div class="actions">
      <Button @click="message = 'Draft saved'">Save draft</Button>
      <Button variant="primary" @click="message = 'Run submitted'">Run simulation</Button>
    </div>
    <output role="status" aria-live="polite">{{ message }}</output>
  </section>
</template>`;

export const usageCode = `<script setup>
import { Button } from "@dicehub/kappa/components/button";

function saveCase() {
  // Persist the current case.
}
</script>

<template>
  <Button variant="primary" @click="saveCase">Save case</Button>
</template>`;

export const basicCode = `<script setup>
import { Button } from "@dicehub/kappa/components/button";
</script>

<template>
  <Button>Save draft</Button>
</template>`;

const createVariantCode = (variant: string, label: string) => `<script setup>
import { Button } from "@dicehub/kappa/components/button";
</script>

<template>
  <Button variant="${variant}">${label}</Button>
</template>`;

export const variantExamples = [
  { name: "primary", title: "Primary", purpose: "Highest-emphasis action in the local context." },
  { name: "secondary", title: "Secondary", purpose: "Quiet default action for dense workflows." },
  { name: "outline", title: "Outline", purpose: "Neutral action on the surrounding surface." },
  { name: "ghost", title: "Ghost", purpose: "Lowest-emphasis toolbar or contextual action." },
  { name: "destructive", title: "Destructive", purpose: "Primary irreversible or dangerous action." },
  { name: "secondary-destructive", title: "Secondary Destructive", purpose: "Quiet destructive action with red text." },
  { name: "destructive-outline", title: "Destructive Outline", purpose: "Outlined destructive compatibility treatment." },
  { name: "success", title: "Success", purpose: "Explicit approval or successful transition." },
  { name: "warning", title: "Warning", purpose: "Action that needs caution before continuing." },
  { name: "link", title: "Link", purpose: "Inline action styling; use LinkButton when it navigates." },
].map((example) => ({ ...example, code: createVariantCode(example.name, example.title) }));

export const sizesCode = `<script setup>
import { Button } from "@dicehub/kappa/components/button";
</script>

<template>
  <Button size="xs">Extra small</Button>
  <Button size="sm">Small</Button>
  <Button size="base">Base</Button>
  <Button size="lg">Large</Button>
</template>`;

export const iconsCode = `<script setup>
import { ArrowRight, Plus } from "@lucide/vue";
import { Button } from "@dicehub/kappa/components/button";
</script>

<template>
  <Button :icon="Plus">New case</Button>
  <Button :icon="ArrowRight" icon-position="inline-end" variant="outline">Export</Button>
</template>`;

export const iconOnlyCode = `<script setup>
import { Plus, RefreshCw } from "@lucide/vue";
import { Button } from "@dicehub/kappa/components/button";
</script>

<template>
  <Button :icon="Plus" shape="square" aria-label="Add case" />
  <Button :icon="RefreshCw" shape="circle" variant="ghost" aria-label="Refresh runs" />
</template>`;

export const loadingCode = `<script setup>
import { Button } from "@dicehub/kappa/components/button";
</script>

<template>
  <Button loading>Saving case</Button>
  <Button variant="primary" loading>Submitting run</Button>
</template>`;

export const disabledCode = `<script setup>
import { Button, LinkButton } from "@dicehub/kappa/components/button";
</script>

<template>
  <Button disabled>Save case</Button>
  <LinkButton href="/runs/042" disabled>Open run</LinkButton>
</template>`;

export const fullWidthCode = `<script setup>
import { Button } from "@dicehub/kappa/components/button";
</script>

<template>
  <Button full-width variant="primary">Create project</Button>
</template>`;

export const linksCode = `<script setup>
import { RouterLink } from "vue-router";
import { LinkButton } from "@dicehub/kappa/components/button";
</script>

<template>
  <LinkButton href="/runs">View runs</LinkButton>
  <LinkButton href="https://dicehub.com" external>dicehub website</LinkButton>
  <LinkButton as-child disabled>
    <RouterLink to="/unavailable">Unavailable run</RouterLink>
  </LinkButton>
  <LinkButton as-child>
    <RouterLink to="/projects">Open projects</RouterLink>
  </LinkButton>
</template>`;

export const formCode = `<script setup>
import { ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";

const message = ref("Ready");
</script>

<template>
  <form aria-label="Case action form" @submit.prevent="message = 'Submitted'" @reset="message = 'Reset'">
    <input name="case" value="Rotor study" />
    <Button type="submit">Submit</Button>
    <Button type="reset" variant="ghost">Reset</Button>
  <output role="status" aria-live="polite">{{ message }}</output>
  </form>
</template>`;

export const rtlCode = `<script setup>
import { ArrowLeft, Plus } from "@lucide/vue";
import { Button } from "@dicehub/kappa/components/button";
</script>

<template>
  <div dir="rtl">
    <Button :icon="Plus">حالة جديدة</Button>
    <Button :icon="ArrowLeft" icon-position="inline-end" variant="outline">تصدير</Button>
  </div>
</template>`;

export const buttonProps = [
  { name: "variant", type: "ButtonVariant", defaultValue: '"secondary"', description: "Visual and semantic treatment." },
  { name: "size", type: '"xs" | "sm" | "base" | "lg"', defaultValue: '"base"', description: "Control height, spacing, and icon scale." },
  { name: "shape", type: '"base" | "square" | "circle"', defaultValue: '"base"', description: "Standard text control or icon-only geometry." },
  { name: "type", type: '"button" | "submit" | "reset"', defaultValue: '"button"', description: "Native button behavior, including form submission and reset." },
  { name: "loading", type: "boolean", defaultValue: "false", description: "Shows a spinner, sets aria-busy, and prevents activation." },
  { name: "disabled", type: "boolean", defaultValue: "false", description: "Disables native activation and focus." },
  { name: "fullWidth", type: "boolean", defaultValue: "false", description: "Fills the available inline size." },
  { name: "icon", type: "Component", defaultValue: "—", description: "Decorative icon rendered beside the label." },
  { name: "iconProps", type: "Record<string, unknown>", defaultValue: "—", description: "Attributes forwarded to the icon component." },
  { name: "iconPosition", type: '"inline-start" | "inline-end"', defaultValue: '"inline-start"', description: "Logical icon placement that follows text direction." },
  { name: "title", type: "string | number", defaultValue: "—", description: "Native advisory text; not a replacement for an accessible name." },
] as const;

export const linkButtonProps = [
  { name: "href", type: "string | undefined", defaultValue: "—", description: "Native anchor destination; omit only when asChild supplies navigation." },
  { name: "external", type: "boolean", defaultValue: "false", description: "Opens in a new tab with a safe rel value." },
  { name: "disabled", type: "boolean", defaultValue: "false", description: "Renders a disabled native button so navigation and activation are unavailable." },
  { name: "asChild", type: "boolean", defaultValue: "false", description: "Merges styling and attributes onto one child link, such as RouterLink." },
  { name: "icon", type: "Component", defaultValue: "—", description: "Decorates native links. With asChild, render the icon inside the child instead." },
  { name: "iconProps", type: "Record<string, unknown>", defaultValue: "—", description: "Attributes forwarded to the native-link icon component." },
  { name: "iconPosition", type: '"inline-start" | "inline-end"', defaultValue: '"inline-start"', description: "Logical native-link icon placement." },
  { name: "title", type: "string | number", defaultValue: "—", description: "Native advisory text; not a replacement for an accessible name." },
  { name: "variant / size / shape / fullWidth", type: "Button styling props", defaultValue: "shared defaults", description: "Shares Button geometry and visual variants." },
] as const;

export const variants = variantExamples.map(({ name, purpose }) => ({ name, purpose }));

export const exportsList = [
  { name: "Button", description: "Native action button with complete visual and async states." },
  { name: "LinkButton", description: "Anchor and router-link composition with Button styling." },
  { name: "BUTTON_VARIANTS / BUTTON_SIZES / BUTTON_SHAPES", description: "Readonly visual option lists." },
  { name: "BUTTON_ICON_POSITIONS / BUTTON_TYPES", description: "Readonly logical icon-position and native-type lists." },
  { name: "BUTTON_DEFAULT_*", description: "Public variant, size, shape, icon-position, and type defaults." },
  { name: "isButton*", description: "Runtime guards for every public option union." },
  { name: "resolveButton*", description: "Runtime default resolvers for every public option union." },
  { name: "ButtonProps / ButtonSlots / LinkButtonProps / LinkButtonSlots", description: "Public Vue contracts." },
  { name: "ButtonVisualProps", description: "Visual props shared by Button and LinkButton." },
  { name: "ButtonVariant / ButtonSize / ButtonShape / ButtonIconPosition / ButtonType", description: "Public option unions." },
] as const;
