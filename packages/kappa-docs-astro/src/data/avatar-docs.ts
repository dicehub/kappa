export const barrelCode = `import {
  Avatar,
  AvatarRoot,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarGroup,
  AvatarGroupCount,
} from "@dicehub/kappa";`;

export const granularCode = `import {
  Avatar,
  AvatarRoot,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarGroup,
  AvatarGroupCount,
} from "@dicehub/kappa/components/avatar";`;

export const previewCode = `<script setup>
import { Avatar } from "@dicehub/kappa/components/avatar";

const reviewers = [
  { name: "Lina Haddad", image: "/avatars/lina-haddad.webp", initials: "LH" },
  { name: "Samir Aziz", image: "/avatars/samir-aziz.webp", initials: "SA" },
];
</script>

<template>
  <article class="profile-card">
    <header>
      <Avatar.Root size="lg">
        <Avatar.Image src="/avatars/mei-chen.webp" alt="" />
        <Avatar.Fallback aria-hidden="true">MC</Avatar.Fallback>
        <Avatar.Badge role="img" aria-label="Online">
          <svg viewBox="0 0 12 12" aria-hidden="true"><path d="m3 6 2 2 4-4" /></svg>
        </Avatar.Badge>
      </Avatar.Root>
      <div><strong>Mei Chen</strong><span>Lead simulation engineer · Online</span></div>
    </header>

    <footer>
      <span id="review-team">Review team</span>
      <Avatar.Group role="group" aria-labelledby="review-team">
        <Avatar.Root v-for="reviewer in reviewers" :key="reviewer.name" size="sm">
          <Avatar.Image :src="reviewer.image" :alt="reviewer.name" />
          <Avatar.Fallback>
            <span aria-hidden="true">{{ reviewer.initials }}</span>
            <span class="visually-hidden">{{ reviewer.name }}</span>
          </Avatar.Fallback>
        </Avatar.Root>
        <Avatar.GroupCount>
          <span aria-hidden="true">+3</span>
          <span class="visually-hidden">3 additional reviewers</span>
        </Avatar.GroupCount>
      </Avatar.Group>
    </footer>
  </article>
</template>`;

export const usageCode = `<script setup>
import { Avatar } from "@dicehub/kappa/components/avatar";
</script>

<template>
  <Avatar.Root>
    <Avatar.Image src="/avatars/mei-chen.webp" alt="Mei Chen" />
    <Avatar.Fallback>
      <span aria-hidden="true">MC</span>
      <span class="visually-hidden">Mei Chen</span>
    </Avatar.Fallback>
  </Avatar.Root>
</template>`;

export const compositionCode = `<script setup>
import {
  AvatarRoot,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
} from "@dicehub/kappa/components/avatar";
</script>

<template>
  <AvatarRoot>
    <AvatarImage src="/avatars/lina-haddad.webp" alt="Lina Haddad" />
    <AvatarFallback>
      <span aria-hidden="true">LH</span>
      <span class="visually-hidden">Lina Haddad</span>
    </AvatarFallback>
    <AvatarBadge aria-hidden="true">
      <svg viewBox="0 0 12 12" aria-hidden="true"><path d="m3 6 2 2 4-4" /></svg>
    </AvatarBadge>
  </AvatarRoot>
</template>`;

export const fallbackCode = `<script setup>
import { ref } from "vue";
import { Avatar } from "@dicehub/kappa/components/avatar";

const source = ref("/avatars/missing.svg");
const imageStatus = ref("waiting for image event");

function handleStatusChange(details) {
  imageStatus.value = details.status;
}
</script>

<template>
  <Avatar.Root size="lg" @status-change="handleStatusChange">
    <Avatar.Image :src="source" alt="Mei Chen" />
    <Avatar.Fallback>
      <span aria-hidden="true">MC</span>
      <span class="visually-hidden">Mei Chen</span>
    </Avatar.Fallback>
  </Avatar.Root>
  <p>Image event: {{ imageStatus }}</p>
  <button type="button" @click="source = '/avatars/mei-chen.webp'">Load portrait</button>
</template>`;

export const sizesCode = `<script setup>
import { Avatar } from "@dicehub/kappa/components/avatar";
</script>

<template>
  <div role="group" aria-label="Yuki Tanaka avatar sizes">
    <Avatar.Root v-for="size in ['sm', 'default', 'lg']" :key="size" :size="size">
      <Avatar.Image src="/avatars/yuki-tanaka.webp" alt="" />
      <Avatar.Fallback aria-hidden="true">YT</Avatar.Fallback>
    </Avatar.Root>
  </div>
</template>`;

export const badgeCode = `<script setup>
import { Avatar } from "@dicehub/kappa/components/avatar";
</script>

<template>
  <div class="member">
    <Avatar.Root>
      <Avatar.Image src="/avatars/samir-aziz.webp" alt="" />
      <Avatar.Fallback aria-hidden="true">SA</Avatar.Fallback>
      <Avatar.Badge class="online" role="img" aria-label="Online">
        <svg viewBox="0 0 12 12" aria-hidden="true"><path d="m3 6 2 2 4-4" /></svg>
      </Avatar.Badge>
    </Avatar.Root>
    <div><strong>Samir Aziz</strong><span>Online</span></div>
  </div>
</template>`;

export const groupCode = `<script setup>
import { Avatar } from "@dicehub/kappa/components/avatar";

const reviewers = [
  { name: "Mei Chen", image: "/avatars/mei-chen.webp", initials: "MC" },
  { name: "Lina Haddad", image: "/avatars/lina-haddad.webp", initials: "LH" },
  { name: "Samir Aziz", image: "/avatars/samir-aziz.webp", initials: "SA" },
];
</script>

<template>
  <span id="review-team">Review team</span>
  <Avatar.Group role="group" aria-labelledby="review-team">
    <Avatar.Root v-for="reviewer in reviewers" :key="reviewer.name" size="sm">
      <Avatar.Image :src="reviewer.image" :alt="reviewer.name" />
      <Avatar.Fallback>
        <span aria-hidden="true">{{ reviewer.initials }}</span>
        <span class="visually-hidden">{{ reviewer.name }}</span>
      </Avatar.Fallback>
    </Avatar.Root>
    <Avatar.GroupCount>
      <span aria-hidden="true">+3</span>
      <span class="visually-hidden">3 additional reviewers</span>
    </Avatar.GroupCount>
  </Avatar.Group>
</template>`;

export const dropdownCode = `<script setup>
import { Menu } from "@ark-ui/vue/menu";
import { Avatar } from "@dicehub/kappa/components/avatar";
</script>

<template>
  <span id="account-options" class="visually-hidden">Account options</span>
  <Menu.Root>
    <Menu.Trigger as-child>
      <button type="button" aria-label="Open account menu for Lina Haddad">
        <Avatar.Root size="sm">
          <Avatar.Image src="/avatars/lina-haddad.webp" alt="" />
          <Avatar.Fallback aria-hidden="true">LH</Avatar.Fallback>
        </Avatar.Root>
        <span>Lina Haddad</span>
      </button>
    </Menu.Trigger>
    <Menu.Positioner>
      <Menu.Content aria-labelledby="account-options">
        <Menu.Item value="profile">Profile</Menu.Item>
        <Menu.Item value="sign-out">Sign out</Menu.Item>
      </Menu.Content>
    </Menu.Positioner>
  </Menu.Root>
</template>`;

export const rtlCode = `<script setup>
import { Avatar } from "@dicehub/kappa/components/avatar";
</script>

<template>
  <Avatar.Group dir="rtl" role="group" aria-labelledby="rtl-review-team">
    <span id="rtl-review-team" class="visually-hidden">فريق المراجعة</span>
    <Avatar.Root dir="rtl">
      <Avatar.Image src="/avatars/lina-haddad.webp" alt="لينا حداد" />
      <Avatar.Fallback>
        <span aria-hidden="true">لح</span>
        <span class="visually-hidden">لينا حداد</span>
      </Avatar.Fallback>
      <Avatar.Badge aria-hidden="true">
        <svg viewBox="0 0 12 12" aria-hidden="true"><path d="m3 6 2 2 4-4" /></svg>
      </Avatar.Badge>
    </Avatar.Root>
    <Avatar.Root dir="rtl">
      <Avatar.Image src="/avatars/samir-aziz.webp" alt="سمير عزيز" />
      <Avatar.Fallback>
        <span aria-hidden="true">سع</span>
        <span class="visually-hidden">سمير عزيز</span>
      </Avatar.Fallback>
    </Avatar.Root>
    <Avatar.GroupCount>
      <span aria-hidden="true">+٢</span>
      <span class="visually-hidden">مراجعان إضافيان</span>
    </Avatar.GroupCount>
  </Avatar.Group>
</template>`;

export const rootProps = [
  { name: "size", type: '"sm" | "default" | "lg"', defaultValue: '"default"', description: "Sets the avatar diameter and the scale of its composed parts." },
  { name: "dir", type: '"ltr" | "rtl"', defaultValue: "inherited Ark locale (ltr by default)", description: "Sets Ark UI direction for the root, image, and fallback." },
  { name: "asChild", type: "boolean", defaultValue: "false", description: "Merges the root behavior and attributes onto its single child." },
  { name: "id", type: "string", defaultValue: "generated", description: "Sets the Ark UI machine identifier." },
  { name: "ids", type: "Partial<{ root: string; image: string; fallback: string }>", defaultValue: "generated", description: "Overrides the generated part identifiers for composition." },
] as const;

export const rootEvents = [
  { name: "@status-change", type: '{ status: "loaded" | "error" }', description: "Reports image loading success or failure. It does not describe user presence." },
] as const;

export const primitiveParts = [
  { name: "Avatar.Image", element: "img", description: "Ark image part; forwards native image attributes and supports asChild." },
  { name: "Avatar.Fallback", element: "span", description: "Visible while the image loads and after an error; supports asChild." },
  { name: "Avatar.Badge", element: "span", description: "Attribute-transparent overlay slot for presence or another concise marker." },
  { name: "Avatar.Group", element: "div", description: "Attribute-transparent overlapping collection; neutral until the consumer adds semantics." },
  { name: "Avatar.GroupCount", element: "div", description: "Count surface with consumer-provided content and contextual accessible text." },
] as const;

export const exportsList = [
  { name: "Avatar", description: "Compound API exposing Root, Image, Fallback, Badge, Group, and GroupCount." },
  { name: "AvatarRoot", description: "Named root export with Ark image-status behavior." },
  { name: "AvatarImage", description: "Named image part export." },
  { name: "AvatarFallback", description: "Named fallback part export." },
  { name: "AvatarBadge", description: "Named badge overlay export." },
  { name: "AvatarGroup", description: "Named overlapping group export." },
  { name: "AvatarGroupCount", description: "Named additional-member count export." },
  { name: "AVATAR_SIZES / AVATAR_DEFAULT_SIZE", description: "Readonly supported sizes and the default-size constant." },
  { name: "isAvatarSize / resolveAvatarSize", description: "Runtime validation and default resolution for size input." },
  { name: "AvatarProps / AvatarRootProps / AvatarEmits", description: "Public root prop and event contracts." },
  { name: "AvatarSlots / AvatarRootSlots", description: "Root default-slot contracts." },
  { name: "AvatarImageProps / AvatarImageSlots", description: "Ark and native image prop and slot contracts." },
  { name: "AvatarFallbackProps / AvatarFallbackSlots", description: "Ark and native fallback prop and slot contracts." },
  { name: "AvatarBadgeProps / AvatarBadgeSlots", description: "Native badge attribute and slot contracts." },
  { name: "AvatarGroupProps / AvatarGroupSlots", description: "Native group attribute and slot contracts." },
  { name: "AvatarGroupCountProps / AvatarGroupCountSlots", description: "Native count attribute and slot contracts." },
  { name: "AvatarStatusChangeDetails", description: "Image load-result details: loaded or error." },
  { name: "AvatarSize", description: "Supported root-size union." },
  { name: "AvatarDirection", description: "Supported root-direction union." },
] as const;
