export const barrelCode = `import {
  ButtonGroup,
  ButtonGroupRoot,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@dicehub/kappa";`;

export const granularCode = `import {
  ButtonGroup,
  ButtonGroupRoot,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@dicehub/kappa/components/button-group";`;

export const previewCode = `<script setup>
import { ArrowLeft } from "@lucide/vue";
import { Button } from "@dicehub/kappa/components/button";
import { ButtonGroup } from "@dicehub/kappa/components/button-group";
</script>

<template>
  <ButtonGroup aria-label="Run actions">
    <ButtonGroup.Root aria-label="Run navigation">
      <Button :icon="ArrowLeft" shape="square" variant="outline" aria-label="Back to runs" />
    </ButtonGroup.Root>
    <ButtonGroup.Root aria-label="Run preparation">
      <Button variant="outline">Save</Button>
      <Button variant="outline">Validate</Button>
    </ButtonGroup.Root>
    <ButtonGroup.Root aria-label="Run output">
      <Button variant="outline">Run</Button>
      <Button variant="outline">Export</Button>
    </ButtonGroup.Root>
  </ButtonGroup>
</template>`;

export const usageCode = `<script setup>
import { Button } from "@dicehub/kappa/components/button";
import { ButtonGroup } from "@dicehub/kappa/components/button-group";
</script>

<template>
  <ButtonGroup aria-label="Case actions">
    <Button variant="outline">Save</Button>
    <Button variant="outline">Duplicate</Button>
    <Button variant="outline">Archive</Button>
  </ButtonGroup>
</template>`;

export const basicCode = `<script setup>
import { Button } from "@dicehub/kappa/components/button";
import { ButtonGroup } from "@dicehub/kappa/components/button-group";
</script>

<template>
  <ButtonGroup aria-label="Result actions">
    <Button variant="outline">Open</Button>
    <Button variant="outline">Compare</Button>
    <Button variant="outline">Export</Button>
  </ButtonGroup>
</template>`;

export const orientationCode = `<script setup>
import { Minus, Plus } from "@lucide/vue";
import { Button } from "@dicehub/kappa/components/button";
import { ButtonGroup } from "@dicehub/kappa/components/button-group";
</script>

<template>
  <ButtonGroup aria-label="Horizontal zoom controls">
    <Button :icon="Minus" shape="square" variant="outline" aria-label="Zoom out" />
    <Button :icon="Plus" shape="square" variant="outline" aria-label="Zoom in" />
  </ButtonGroup>

  <ButtonGroup orientation="vertical" aria-label="Vertical zoom controls">
    <Button :icon="Plus" shape="square" variant="outline" aria-label="Increase scale" />
    <Button :icon="Minus" shape="square" variant="outline" aria-label="Decrease scale" />
  </ButtonGroup>
</template>`;

export const sizesCode = `<script setup>
import { Button } from "@dicehub/kappa/components/button";
import { ButtonGroup } from "@dicehub/kappa/components/button-group";
</script>

<template>
  <ButtonGroup v-for="size in ['xs', 'sm', 'base', 'lg']" :key="size" :aria-label="size + ' actions'">
    <Button :size="size" variant="outline">Mesh</Button>
    <Button :size="size" variant="outline">Solve</Button>
    <Button :size="size" variant="outline">Review</Button>
  </ButtonGroup>
</template>`;

export const nestedCode = `<script setup>
import { Redo2, Undo2 } from "@lucide/vue";
import { Button } from "@dicehub/kappa/components/button";
import { ButtonGroup } from "@dicehub/kappa/components/button-group";
</script>

<template>
  <ButtonGroup aria-label="Editor actions">
    <ButtonGroup.Root aria-label="History actions">
      <Button :icon="Undo2" shape="square" variant="outline" aria-label="Undo" />
      <Button :icon="Redo2" shape="square" variant="outline" aria-label="Redo" />
    </ButtonGroup.Root>
    <ButtonGroup.Root aria-label="Editor state actions">
      <Button variant="outline">Apply</Button>
      <Button variant="outline">Reset</Button>
    </ButtonGroup.Root>
  </ButtonGroup>
</template>`;

export const separatorCode = `<script setup>
import { Button } from "@dicehub/kappa/components/button";
import { ButtonGroup } from "@dicehub/kappa/components/button-group";
</script>

<template>
  <ButtonGroup aria-label="Clipboard actions">
    <Button variant="ghost">Copy</Button>
    <ButtonGroup.Separator />
    <Button variant="ghost">Paste</Button>
  </ButtonGroup>

  <ButtonGroup orientation="vertical" aria-label="Case lifecycle">
    <Button variant="ghost">Prepare</Button>
    <ButtonGroup.Separator orientation="horizontal" />
    <Button variant="ghost">Run</Button>
  </ButtonGroup>
</template>`;

export const splitCode = `<script setup>
import { Copy } from "@lucide/vue";
import { Button } from "@dicehub/kappa/components/button";
import { ButtonGroup } from "@dicehub/kappa/components/button-group";
</script>

<template>
  <ButtonGroup aria-label="Run case">
    <Button variant="primary">Run case</Button>
    <ButtonGroup.Separator />
    <Button
      :icon="Copy"
      shape="square"
      variant="primary"
      aria-label="Duplicate case and run"
    />
  </ButtonGroup>
</template>`;

export const textCode = `<script setup>
import { Gauge } from "@lucide/vue";
import { Button } from "@dicehub/kappa/components/button";
import { ButtonGroup } from "@dicehub/kappa/components/button-group";
</script>

<template>
  <ButtonGroup aria-label="Time step limit">
    <ButtonGroup.Text>Delta t</ButtonGroup.Text>
    <Button variant="outline">0.002 s</Button>
  </ButtonGroup>

  <ButtonGroup aria-label="Courant limit">
    <ButtonGroup.Text as-child>
      <strong><Gauge aria-hidden="true" /> Courant</strong>
    </ButtonGroup.Text>
    <Button variant="outline">0.8</Button>
  </ButtonGroup>
</template>`;

export const linksCode = `<script setup>
import { Button, LinkButton } from "@dicehub/kappa/components/button";
import { ButtonGroup } from "@dicehub/kappa/components/button-group";
</script>

<template>
  <ButtonGroup aria-label="Run navigation">
    <LinkButton href="/runs/042" variant="outline">Summary</LinkButton>
    <LinkButton href="/runs/042/fields" variant="outline">Fields</LinkButton>
    <Button variant="outline">Refresh</Button>
  </ButtonGroup>
</template>`;

export const rtlCode = `<script setup>
import { ArrowRight, Plus } from "@lucide/vue";
import { Button } from "@dicehub/kappa/components/button";
import { ButtonGroup } from "@dicehub/kappa/components/button-group";
</script>

<template>
  <div dir="rtl">
    <ButtonGroup aria-label="إجراءات الحالة">
      <Button :icon="ArrowRight" shape="square" variant="outline" aria-label="العودة" />
      <Button :icon="Plus" variant="outline">حالة جديدة</Button>
      <Button variant="outline">تصدير</Button>
    </ButtonGroup>
  </div>
</template>`;

export const rootProps = [
  {
    name: "orientation",
    type: '"horizontal" | "vertical"',
    defaultValue: '"horizontal"',
    description: "Sets the visual axis. It does not add arrow-key navigation.",
  },
] as const;

export const textProps = [
  {
    name: "asChild",
    type: "boolean",
    defaultValue: "false",
    description: "Merges text styling and attributes onto one semantic child.",
  },
] as const;

export const separatorProps = [
  {
    name: "orientation",
    type: '"horizontal" | "vertical"',
    defaultValue: '"vertical"',
    description: "Sets the separator axis. Use horizontal inside a vertical group.",
  },
] as const;

export const exportsList = [
  { name: "ButtonGroup", description: "Root component with Root, Text, and Separator compound parts." },
  { name: "ButtonGroupRoot", description: "Unaugmented semantic group component." },
  { name: "ButtonGroupText", description: "Static text or an asChild semantic element inside the group." },
  { name: "ButtonGroupSeparator", description: "Accessible visual separator between controls." },
  { name: "BUTTON_GROUP_ORIENTATIONS", description: "Readonly horizontal and vertical option list." },
  { name: "BUTTON_GROUP_DEFAULT_ORIENTATION", description: "Public horizontal root default." },
  { name: "BUTTON_GROUP_SEPARATOR_DEFAULT_ORIENTATION", description: "Public vertical separator default." },
  { name: "isButtonGroupOrientation", description: "Runtime orientation guard." },
  { name: "resolveButtonGroupOrientation", description: "Runtime orientation resolver with a safe fallback." },
  { name: "resolveButtonGroupSeparatorOrientation", description: "Resolves an explicit separator axis with a vertical fallback." },
  { name: "ButtonGroup*Props / ButtonGroup*Slots", description: "Public Vue part contracts." },
  { name: "ButtonGroupOrientation", description: "Public orientation union." },
] as const;
