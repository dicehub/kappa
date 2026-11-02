<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { ChevronDown, ReceiptText } from "@lucide/vue";
import { Button, ToolbarButton } from "@dicehub/kappa/components/button";
import { Badge } from "@dicehub/kappa/components/badge";
import { MatrixLoader } from "@dicehub/kappa/components/matrix-loader";
import { Popover } from "@dicehub/kappa/components/popover";
import { Progress } from "@dicehub/kappa/components/progress";
import PaneledWorkspaceCreditActions from "./PaneledWorkspaceCreditActions.vue";
import { creditAmount, currentUsage, type WorkspaceCompute } from "./paneled-workspace-compute";

const props = defineProps<{ namespace: string; compute: WorkspaceCompute; loading: boolean }>();
const emit = defineEmits<{ navigate: [page: string]; addCredits: [cents: number] }>();
const open = ref(false);
const surface = ref<HTMLElement>();
const action = ref<"buy" | "redeem" | undefined>();
const redeemed = ref(new Set<string>());
const confirmation = ref("");
const usage = computed(() => currentUsage(props.compute.runs));
const usageLabel = computed(() => usage.value ? `${creditAmount(usage.value)} per hour` : "No active usage");
const runwayHours = computed(() => usage.value ? props.compute.balanceCents / usage.value : Infinity);
const runwayPercent = computed(() => props.compute.balanceCents <= 0 ? 0 : Math.min(100, runwayHours.value / (30 * 24) * 100));
const runwayText = computed(() => {
  if (props.compute.balanceCents <= 0) return "Add credits when you are ready to run.";
  if (!usage.value) return "Your balance is ready when you are.";
  if (runwayHours.value < 1) return `About ${Math.max(1, Math.round(runwayHours.value * 60))} min at current usage.`;
  if (runwayHours.value < 24) return `About ${Math.floor(runwayHours.value)} hours at current usage.`;
  return `About ${Math.floor(runwayHours.value / 24)} days at current usage.`;
});
watch(() => props.namespace, () => { open.value = false; });
watch(open, value => { if (!value) { action.value = undefined; confirmation.value = ""; } });
function showBilling() { open.value = false; emit("navigate", "Billing"); }
function chooseAction(value: "buy" | "redeem") { confirmation.value = ""; action.value = value; }
async function back() {
  const previous = action.value;
  action.value = undefined;
  await nextTick();
  surface.value?.querySelector<HTMLButtonElement>(`[data-credit-action="${previous}"]`)?.focus();
}
function addCredits(cents: number) {
  if (action.value === "redeem") redeemed.value.add(props.namespace);
  emit("addCredits", cents);
  confirmation.value = `Added ${creditAmount(cents)} in demo credits.`;
  void back();
}
</script>

<template>
  <Popover.Root v-model:open="open" :positioning="{ placement: 'bottom-end', strategy: 'fixed', gutter: 6, overflowPadding: 8 }">
    <Popover.Trigger as-child>
      <ToolbarButton class="paneled-credits__trigger" data-nav-credits :disabled="loading" :aria-busy="loading || undefined"
        :aria-label="loading ? 'Loading credits' : `Credits: ${creditAmount(compute.balanceCents)}, ${usageLabel}`" tooltip="Credits and compute usage">
        <span class="paneled-credits__label">Credits:</span>
        <span class="paneled-credits__value" :data-credit-balance-state="loading ? 'loading' : 'ready'">
          <MatrixLoader v-if="loading" decorative :size="14" :duration="1800" />
          <template v-else>{{ creditAmount(compute.balanceCents) }}</template>
        </span>
        <ChevronDown class="paneled-credits__chevron" :size="16" aria-hidden="true" />
      </ToolbarButton>
    </Popover.Trigger>
    <Popover.Content class="paneled-credits__popover" data-credit-popover-surface>
      <div ref="surface" class="paneled-credits__surface">
        <div class="paneled-credits__summary" data-credit-balance-summary>
          <Popover.Title class="paneled-credits__title">Available credits</Popover.Title>
          <Popover.Description class="paneled-credits__sr-only">{{ namespace }} · USD</Popover.Description>
          <div class="paneled-credits__balance-row">
            <strong>{{ creditAmount(compute.balanceCents) }}</strong>
            <Badge variant="neutral" class="paneled-credits__usage-badge">{{ usage ? `${creditAmount(usage)} / h` : 'No active usage' }}</Badge>
          </div>
          <Progress.Root :model-value="runwayPercent" class="paneled-credits__runway">
            <Progress.Track aria-label="Credit balance toward 30 days at current usage" :aria-valuetext="runwayText"><Progress.Range /></Progress.Track>
          </Progress.Root>
          <p class="paneled-credits__note" aria-live="polite">{{ confirmation || runwayText }}</p>
        </div>
        <div class="paneled-credits__actions" role="group" aria-label="Credit actions">
          <PaneledWorkspaceCreditActions v-if="action" :action="action" :redeemed="redeemed.has(namespace)" @confirm="addCredits" @cancel="back" />
          <div v-else class="paneled-credits__action-row">
            <Button size="sm" full-width class="paneled-credits__buy" data-credit-action="buy" @click="chooseAction('buy')">Buy credits</Button>
            <Button variant="outline" size="sm" full-width data-credit-action="redeem" @click="chooseAction('redeem')">Redeem credits</Button>
          </div>
          <Button variant="outline" size="sm" :icon="ReceiptText" full-width @click="showBilling">Go to billing</Button>
        </div>
      </div>
    </Popover.Content>
  </Popover.Root>
</template>

<style src="./paneled-workspace-compute.css"></style>
