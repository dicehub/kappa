<script setup lang="ts">
import { computed, ref } from "vue";
import { NavigationMenu } from "@dicehub/kappa/components/navigation-menu";
import { DirectionProvider } from "@dicehub/kappa/components/direction-provider";
import { Button } from "@dicehub/kappa/components/button";

const props = withDefaults(defineProps<{
  variant?: "preview" | "compact" | "controlled" | "vertical" | "rtl" | "links";
  standalone?: boolean;
}>(), { variant: "preview", standalone: false });
const open = ref("");
const selected = ref("Overview");
const changeCount = ref(0);
const isRtl = computed(() => props.variant === "rtl");
const products = [
  { name: "Projects", description: "Keep your work in one place.", icon: "M3 5h4l2 2h12v13H3Z M3 5V3h6l2 2h10v2" },
  { name: "Automation", description: "Make recurring tasks run themselves.", icon: "m13 2-9 12h7l-1 8 10-12h-7Z" },
  { name: "Reports", description: "Understand what changed over time.", icon: "M4 3v17h17 M8 15v-4 M13 15V6 M18 15v-7" },
  { name: "Integrations", description: "Connect the tools you already use.", icon: "M8 3v5 M16 3v5 M6 8h12v4a6 6 0 0 1-12 0Z M12 18v4" },
];
const resources = [
  { name: "Documentation", description: "A practical guide to every feature." },
  { name: "Changelog", description: "The latest releases and improvements." },
  { name: "Support", description: "Find an answer or ask for help." },
];
const select = (name: string) => { selected.value = name; };
</script>

<template>
  <DirectionProvider :locale="isRtl ? 'ar' : 'en-US'">
    <section class="navigation-menu-demo" :class="{ 'navigation-menu-demo--standalone': standalone }"
      :data-navigation-menu-demo="variant" :dir="isRtl ? 'rtl' : 'ltr'">
      <header class="navigation-menu-demo__header">
        <NavigationMenu.Root v-if="variant === 'links'" aria-label="Workspace pages" size="sm">
          <NavigationMenu.List>
            <NavigationMenu.Item v-for="name in ['Overview', 'Projects', 'Settings']" :key="name" :value="name">
              <NavigationMenu.Link :href="`#${name.toLowerCase()}`" :current="selected === name" @click.prevent="select(name)">{{ name }}</NavigationMenu.Link>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu.Root>
        <NavigationMenu.Root v-else v-bind="variant === 'controlled' ? { value: open } : {}"
          :default-value="variant === 'preview' ? 'platform' : undefined"
          :size="variant === 'compact' ? 'sm' : 'md'"
          :disable-hover-trigger="variant === 'controlled'" :disable-pointer-leave-close="variant === 'controlled'"
          :orientation="variant === 'vertical' ? 'vertical' : 'horizontal'"
          :aria-label="isRtl ? 'التنقل الرئيسي' : 'Main navigation'" :data-change-count="changeCount"
          @update:value="open = $event" @value-change="changeCount++">
          <NavigationMenu.List>
            <NavigationMenu.Item value="platform">
              <NavigationMenu.Trigger>{{ isRtl ? 'المنصة' : 'Platform' }}</NavigationMenu.Trigger>
              <NavigationMenu.Content :class="{ 'navigation-menu-demo__compact-panel': variant === 'compact' || variant === 'vertical' }">
                <p v-if="variant !== 'compact'" class="navigation-menu-demo__group-label">{{ isRtl ? 'أدوات للعمل اليومي' : 'Tools for your daily work' }}</p>
                <div class="navigation-menu-demo__grid">
                  <NavigationMenu.Link v-for="(item, index) in products" :key="item.name" :href="`#${item.name.toLowerCase()}`"
                    @click.prevent="select(item.name)">
                    <span v-if="variant !== 'compact'" class="navigation-menu-demo__icon"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path :d="item.icon" /></svg></span>
                    <span class="navigation-menu-demo__link-copy"><strong>{{ isRtl ? ['المشاريع', 'الأتمتة', 'التقارير', 'التكاملات'][index] : item.name }}</strong><span v-if="variant !== 'compact'">{{ isRtl ? ['كل أعمالك في مكان واحد.', 'تنفيذ المهام المتكررة تلقائيًا.', 'فهم التغييرات بمرور الوقت.', 'ربط الأدوات التي تستخدمها.'][index] : item.description }}</span></span>
                  </NavigationMenu.Link>
                </div>
                <NavigationMenu.Link v-if="variant !== 'compact'" class="navigation-menu-demo__panel-footer" href="#overview" @click.prevent="select('Overview')">
                  {{ isRtl ? 'استكشف المنصة' : 'Explore the platform' }}<span aria-hidden="true">{{ isRtl ? '←' : '→' }}</span>
                </NavigationMenu.Link>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
            <NavigationMenu.Item value="resources">
              <NavigationMenu.Trigger>{{ isRtl ? 'المصادر' : 'Resources' }}</NavigationMenu.Trigger>
              <NavigationMenu.Content class="navigation-menu-demo__resources">
                <NavigationMenu.Link v-for="(item, index) in resources" :key="item.name" :href="`#${item.name.toLowerCase()}`" @click.prevent="select(item.name)">
                  <span class="navigation-menu-demo__link-copy"><strong>{{ isRtl ? ['الوثائق', 'سجل التغييرات', 'الدعم'][index] : item.name }}</strong><span v-if="variant !== 'compact'">{{ isRtl ? 'معلومات ومساعدة لاستخدام المنصة.' : item.description }}</span></span>
                </NavigationMenu.Link>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
            <NavigationMenu.Item v-if="variant === 'controlled'" value="admin" disabled>
              <NavigationMenu.Trigger>Admin</NavigationMenu.Trigger>
            </NavigationMenu.Item>
            <NavigationMenu.Item v-else value="pricing">
              <NavigationMenu.Link href="#pricing" :current="selected === 'Pricing'" @click.prevent="select('Pricing')">{{ isRtl ? 'الأسعار' : 'Pricing' }}</NavigationMenu.Link>
            </NavigationMenu.Item>
          </NavigationMenu.List>
          <NavigationMenu.ViewportPositioner align="start"><NavigationMenu.Viewport /></NavigationMenu.ViewportPositioner>
        </NavigationMenu.Root>
      </header>
      <div class="navigation-menu-demo__body">
        <template v-if="variant === 'preview'">
          <span class="navigation-menu-demo__eyebrow">Your workspace</span>
          <h2>Room for your next idea.</h2>
          <p>Projects, people, and the tools to get things done.</p>
        </template>
        <template v-else-if="variant === 'controlled'">
          <p>Click to open a panel. Admin is unavailable.</p>
          <div class="navigation-menu-demo__controls">
            <Button size="sm" variant="outline" @click="open = 'resources'">Open resources</Button>
            <Button size="sm" variant="outline" @click="open = ''">Close panel</Button>
          </div>
          <output data-open-value>Open panel: {{ open || 'none' }}</output>
        </template>
        <template v-else-if="variant === 'vertical'"><span class="navigation-menu-demo__eyebrow">Workspace navigation</span><p>Panels open beside the navigation.</p></template>
        <output class="navigation-menu-demo__selection" aria-live="polite">{{ isRtl ? 'الصفحة المحددة:' : 'Selected page:' }} {{ selected }}</output>
      </div>
    </section>
  </DirectionProvider>
</template>

<style src="./navigation-menu-docs-demo.css"></style>
