<script setup lang="ts">
import { Menu } from "@ark-ui/vue/menu";
import { ref } from "vue";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
  AvatarRoot,
  type AvatarStatusChangeDetails,
} from "@dicehub/kappa/components/avatar";

type DemoVariant =
  | "preview"
  | "usage"
  | "composition"
  | "fallback"
  | "sizes"
  | "badge"
  | "group"
  | "dropdown"
  | "rtl";

withDefaults(defineProps<{ variant?: DemoVariant }>(), { variant: "preview" });

const portraits = {
  mei: "/avatars/mei-chen.webp",
  lina: "/avatars/lina-haddad.webp",
  samir: "/avatars/samir-aziz.webp",
  yuki: "/avatars/yuki-tanaka.webp",
};
const brokenPortrait = "data:image/png;base64,bm90LWFuLWltYWdl";

const fallbackSrc = ref(brokenPortrait);
const imageStatus = ref("waiting for image event");

const setImageStatus = (details: AvatarStatusChangeDetails) => {
  imageStatus.value = details.status;
};

const toggleFallbackSource = () => {
  fallbackSrc.value = fallbackSrc.value === brokenPortrait ? portraits.mei : brokenPortrait;
  imageStatus.value = "waiting for image event";
};

</script>

<template>
  <div class="avatar-demo" :data-avatar-demo="variant">
    <div v-if="variant === 'preview'" class="avatar-demo__profile-card">
      <div class="avatar-demo__profile-heading">
        <Avatar.Root size="lg">
          <Avatar.Image :src="portraits.mei" alt="" />
          <Avatar.Fallback aria-hidden="true">MC</Avatar.Fallback>
          <Avatar.Badge class="avatar-demo__badge avatar-demo__badge--online" role="img" aria-label="Online">
            <svg viewBox="0 0 12 12" aria-hidden="true"><path d="m3 6 2 2 4-4" /></svg>
          </Avatar.Badge>
        </Avatar.Root>
        <div class="avatar-demo__review-copy">
          <strong>Mei Chen</strong>
          <span>Lead simulation engineer · Online</span>
        </div>
      </div>
      <div class="avatar-demo__review-row">
        <div class="avatar-demo__case-copy">
          <span class="avatar-demo__eyebrow">Case review</span>
          <strong>Wind tunnel · Run 042</strong>
        </div>
        <Avatar.Group role="group" aria-labelledby="avatar-preview-reviewers">
          <span id="avatar-preview-reviewers" class="docs-visually-hidden">Review team</span>
          <Avatar.Root size="sm">
            <Avatar.Image :src="portraits.lina" alt="Lina Haddad" />
            <Avatar.Fallback><span aria-hidden="true">LH</span><span class="docs-visually-hidden">Lina Haddad</span></Avatar.Fallback>
          </Avatar.Root>
          <Avatar.Root size="sm">
            <Avatar.Image :src="portraits.samir" alt="Samir Aziz" />
            <Avatar.Fallback><span aria-hidden="true">SA</span><span class="docs-visually-hidden">Samir Aziz</span></Avatar.Fallback>
          </Avatar.Root>
          <Avatar.GroupCount><span aria-hidden="true">+3</span><span class="docs-visually-hidden">3 additional reviewers</span></Avatar.GroupCount>
        </Avatar.Group>
      </div>
    </div>

    <Avatar.Root v-else-if="variant === 'usage'">
      <Avatar.Image :src="portraits.mei" alt="Mei Chen" />
      <Avatar.Fallback><span aria-hidden="true">MC</span><span class="docs-visually-hidden">Mei Chen</span></Avatar.Fallback>
    </Avatar.Root>

    <AvatarRoot v-else-if="variant === 'composition'">
      <AvatarImage :src="portraits.lina" alt="Lina Haddad" />
      <AvatarFallback><span aria-hidden="true">LH</span><span class="docs-visually-hidden">Lina Haddad</span></AvatarFallback>
      <AvatarBadge class="avatar-demo__badge avatar-demo__badge--online" aria-hidden="true">
        <svg viewBox="0 0 12 12" aria-hidden="true"><path d="m3 6 2 2 4-4" /></svg>
      </AvatarBadge>
    </AvatarRoot>

    <div v-else-if="variant === 'fallback'" class="avatar-demo__fallback-example">
      <Avatar.Root size="lg" @status-change="setImageStatus">
        <Avatar.Image :src="fallbackSrc" alt="Mei Chen" />
        <Avatar.Fallback><span aria-hidden="true">MC</span><span class="docs-visually-hidden">Mei Chen</span></Avatar.Fallback>
      </Avatar.Root>
      <div class="avatar-demo__fallback-copy">
        <strong>Image event: {{ imageStatus }}</strong>
        <span>Fallback remains visible while loading and after an error.</span>
        <button type="button" class="avatar-demo__control" @click="toggleFallbackSource">
          {{ fallbackSrc === brokenPortrait ? "Load portrait" : "Break portrait" }}
        </button>
      </div>
    </div>

    <div v-else-if="variant === 'sizes'" class="avatar-demo__sizes" role="group" aria-label="Yuki Tanaka avatar sizes">
      <div v-for="size in ['sm', 'default', 'lg'] as const" :key="size" class="avatar-demo__size-item">
        <Avatar.Root :size="size">
          <Avatar.Image :src="portraits.yuki" alt="" />
          <Avatar.Fallback aria-hidden="true">YT</Avatar.Fallback>
        </Avatar.Root>
        <code>{{ size }}</code>
      </div>
    </div>

    <div v-else-if="variant === 'badge'" class="avatar-demo__presence">
      <Avatar.Root>
        <Avatar.Image :src="portraits.samir" alt="" />
        <Avatar.Fallback aria-hidden="true">SA</Avatar.Fallback>
        <Avatar.Badge class="avatar-demo__badge avatar-demo__badge--online" role="img" aria-label="Online">
          <svg viewBox="0 0 12 12" aria-hidden="true"><path d="m3 6 2 2 4-4" /></svg>
        </Avatar.Badge>
      </Avatar.Root>
      <div><strong>Samir Aziz</strong><span>Online</span></div>
    </div>

    <div v-else-if="variant === 'group'" class="avatar-demo__group-example">
      <span id="avatar-review-team" class="avatar-demo__eyebrow">Review team</span>
      <AvatarGroup role="group" aria-labelledby="avatar-review-team">
        <AvatarRoot size="sm">
          <AvatarImage :src="portraits.mei" alt="Mei Chen" />
          <AvatarFallback><span aria-hidden="true">MC</span><span class="docs-visually-hidden">Mei Chen</span></AvatarFallback>
        </AvatarRoot>
        <AvatarRoot size="sm">
          <AvatarImage :src="portraits.lina" alt="Lina Haddad" />
          <AvatarFallback><span aria-hidden="true">LH</span><span class="docs-visually-hidden">Lina Haddad</span></AvatarFallback>
        </AvatarRoot>
        <AvatarRoot size="sm">
          <AvatarImage :src="portraits.samir" alt="Samir Aziz" />
          <AvatarFallback><span aria-hidden="true">SA</span><span class="docs-visually-hidden">Samir Aziz</span></AvatarFallback>
        </AvatarRoot>
        <AvatarGroupCount><span aria-hidden="true">+3</span><span class="docs-visually-hidden">3 additional reviewers</span></AvatarGroupCount>
      </AvatarGroup>
    </div>

    <div v-else-if="variant === 'dropdown'" class="avatar-demo__menu-example">
      <span id="avatar-account-options" class="docs-visually-hidden">Account options</span>
      <Menu.Root id="avatar-account-menu" :positioning="{ placement: 'bottom-start', gutter: 6 }">
        <Menu.Trigger as-child>
          <button
            type="button"
            class="avatar-demo__account-trigger"
            aria-label="Open account menu for Lina Haddad"
          >
            <Avatar.Root size="sm">
              <Avatar.Image :src="portraits.lina" alt="" />
              <Avatar.Fallback aria-hidden="true">LH</Avatar.Fallback>
            </Avatar.Root>
            <span><strong>Lina Haddad</strong><small>Workspace owner</small></span>
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg>
          </button>
        </Menu.Trigger>
        <Menu.Positioner class="avatar-demo__menu-positioner">
          <Menu.Content class="avatar-demo__menu" aria-labelledby="avatar-account-options">
            <Menu.Item class="avatar-demo__menu-item" value="profile">Profile</Menu.Item>
            <Menu.Item class="avatar-demo__menu-item" value="sign-out">Sign out</Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>
    </div>

    <div v-else dir="rtl" class="avatar-demo__rtl">
      <Avatar.Group role="group" aria-labelledby="avatar-rtl-team">
        <span id="avatar-rtl-team" class="docs-visually-hidden">فريق المراجعة</span>
        <Avatar.Root dir="rtl">
          <Avatar.Image :src="portraits.lina" alt="لينا حداد" />
          <Avatar.Fallback><span aria-hidden="true">لح</span><span class="docs-visually-hidden">لينا حداد</span></Avatar.Fallback>
          <Avatar.Badge class="avatar-demo__badge avatar-demo__badge--online" aria-hidden="true">
            <svg viewBox="0 0 12 12" aria-hidden="true"><path d="m3 6 2 2 4-4" /></svg>
          </Avatar.Badge>
        </Avatar.Root>
        <Avatar.Root dir="rtl">
          <Avatar.Image :src="brokenPortrait" alt="سمير عزيز" />
          <Avatar.Fallback><span aria-hidden="true">سع</span><span class="docs-visually-hidden">سمير عزيز</span></Avatar.Fallback>
        </Avatar.Root>
        <Avatar.GroupCount><span aria-hidden="true">+٢</span><span class="docs-visually-hidden">مراجعان إضافيان</span></Avatar.GroupCount>
      </Avatar.Group>
    </div>
  </div>
</template>

<style scoped>
.avatar-demo {
  display: grid;
  width: min(100%, 32rem);
  min-width: 0;
  min-height: 10rem;
  place-items: center;
  color: var(--docs-default);
  font-family: var(--docs-font-sans, "Geist", sans-serif);
}

.avatar-demo__profile-card {
  display: grid;
  width: min(100%, 27rem);
  overflow: hidden;
  border: 1px solid var(--docs-line);
  border-radius: 0.75rem;
  background: var(--docs-base);
}

.avatar-demo__profile-heading,
.avatar-demo__review-row,
.avatar-demo__fallback-example,
.avatar-demo__presence {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 0.9rem;
}

.avatar-demo__profile-heading { padding: 1.4rem; }
.avatar-demo__review-row {
  justify-content: space-between;
  border-block-start: 1px solid var(--docs-line);
  padding: 0.9rem 1.4rem;
}

.avatar-demo__review-copy,
.avatar-demo__case-copy,
.avatar-demo__presence > div,
.avatar-demo__fallback-copy,
.avatar-demo__account-trigger > span {
  display: grid;
  min-width: 0;
  gap: 0.15rem;
}

.avatar-demo__profile-heading span,
.avatar-demo__presence span,
.avatar-demo__fallback-copy span,
.avatar-demo__account-trigger small {
  color: var(--docs-subtle);
  font-size: 0.75rem;
}

.avatar-demo__eyebrow {
  color: var(--docs-subtle);
  font-size: 0.65rem;
  font-weight: 650;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.avatar-demo__badge--online { background: var(--kappa-success-text, #147a58); }
.avatar-demo__badge svg { fill: none; stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2; }

.avatar-demo__fallback-example { width: min(100%, 25rem); }
.avatar-demo__fallback-copy { flex: 1; }

.avatar-demo__control,
.avatar-demo__account-trigger,
.avatar-demo__menu button {
  border: 1px solid var(--docs-line);
  color: inherit;
  font: inherit;
}

.avatar-demo__control {
  width: fit-content;
  margin-block-start: 0.4rem;
  border-radius: 0.35rem;
  background: var(--docs-base);
  padding: 0.42rem 0.7rem;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 600;
}

.avatar-demo__sizes {
  display: flex;
  align-items: end;
  justify-content: center;
  gap: clamp(1rem, 6vw, 2.4rem);
}

.avatar-demo__size-item { display: grid; place-items: center; gap: 0.6rem; }
.avatar-demo__size-item code { color: var(--docs-subtle); font-size: 0.7rem; }
.avatar-demo__group-example { display: grid; gap: 0.7rem; }
.avatar-demo__rtl { width: fit-content; }
.avatar-demo__menu-example { position: relative; width: min(100%, 17rem); }

.avatar-demo__account-trigger {
  display: grid;
  width: 100%;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.7rem;
  border-radius: 0.55rem;
  background: var(--docs-base);
  padding: 0.55rem 0.65rem;
  text-align: start;
  cursor: pointer;
}

.avatar-demo__account-trigger svg {
  width: 1rem;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.5;
}

.avatar-demo__menu-positioner { z-index: 2; }

.avatar-demo__menu {
  z-index: 2;
  display: grid;
  width: var(--reference-width);
  gap: 0.2rem;
  border: 1px solid var(--docs-line);
  border-radius: 0.55rem;
  background: var(--docs-base);
  padding: 0.3rem;
}

.avatar-demo__menu[hidden] { display: none; }

.avatar-demo__menu-item {
  border-color: transparent;
  border-radius: 0.35rem;
  background: transparent;
  padding: 0.45rem 0.55rem;
  text-align: start;
  cursor: pointer;
  outline: none;
}

.avatar-demo__menu-item[data-highlighted] { background: var(--docs-tint); }

.avatar-demo button:focus-visible { outline: 2px solid var(--kappa-focus, currentColor); outline-offset: 2px; }

@media (max-width: 520px) {
  .avatar-demo { min-height: 12rem; }
  .avatar-demo__profile-heading { padding: 1rem; }
  .avatar-demo__review-row { align-items: start; padding: 0.8rem 1rem; }
  .avatar-demo__fallback-example { align-items: start; }
}
</style>
