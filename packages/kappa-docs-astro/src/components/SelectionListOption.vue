<script setup lang="ts">
import { SelectionList } from "@dicehub/kappa/components/selection-list";

export type SelectionListDemoItem = {
  description?: string;
  disabled?: boolean;
  group?: string;
  icon?: "compute" | "file" | "mesh" | "surface";
  label: string;
  meta?: string;
  value: string;
};

defineProps<{ item: SelectionListDemoItem }>();
</script>

<template>
  <SelectionList.Item :item="item">
    <SelectionList.ItemMedia v-if="item.icon" aria-hidden="true">
      <svg v-if="item.icon === 'compute'" viewBox="0 0 20 20">
        <rect x="4" y="4" width="12" height="12" rx="2" />
        <path d="M7 1.5v2.5M10 1.5v2.5M13 1.5v2.5M7 16v2.5M10 16v2.5M13 16v2.5M1.5 7H4M1.5 10H4M1.5 13H4M16 7h2.5M16 10h2.5M16 13h2.5M8 8h4v4H8z" />
      </svg>
      <svg v-else-if="item.icon === 'mesh'" viewBox="0 0 20 20">
        <path d="m10 2 7 4v8l-7 4-7-4V6l7-4Z" />
        <path d="m3 6 7 4 7-4M10 10v8" />
      </svg>
      <svg v-else-if="item.icon === 'surface'" viewBox="0 0 20 20">
        <path d="M2.5 14.5 7 5l4 7 2.5-4 4 6.5h-15Z" />
        <path d="M5 11h10" />
      </svg>
      <svg v-else viewBox="0 0 20 20">
        <path d="M4 2.5h8l4 4v11H4zM12 2.5v4h4" />
        <path d="M7 11h6M7 14h4" />
      </svg>
    </SelectionList.ItemMedia>
    <SelectionList.ItemContent>
      <SelectionList.ItemText>{{ item.label }}</SelectionList.ItemText>
      <SelectionList.ItemDescription v-if="item.description">
        {{ item.description }}
      </SelectionList.ItemDescription>
    </SelectionList.ItemContent>
    <SelectionList.ItemMeta v-if="item.meta">{{ item.meta }}</SelectionList.ItemMeta>
    <SelectionList.ItemIndicator />
  </SelectionList.Item>
</template>
