<script setup lang="ts">
import { nextTick, onMounted, ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import { Field } from "@dicehub/kappa/components/field";
import { ToggleGroup } from "@dicehub/kappa/components/toggle-group";
import { creditAmount } from "./paneled-workspace-compute";

const props = defineProps<{ action: "buy" | "redeem"; redeemed: boolean }>();
const emit = defineEmits<{ confirm: [cents: number]; cancel: [] }>();
const form = ref<HTMLFormElement>();
const amount = ref(["1000"]);
const code = ref("");
const error = ref("");
onMounted(() => { void nextTick(() => form.value?.querySelector<HTMLElement>("input, [data-part=item]")?.focus()); });
function submit() {
  if (props.action === "buy") { emit("confirm", Number(amount.value[0])); return; }
  if (props.redeemed) return;
  if (code.value.trim().toUpperCase() !== "DICEHUB-DEMO") {
    error.value = "Enter DICEHUB-DEMO to redeem the demo credit.";
    form.value?.querySelector("input")?.focus();
    return;
  }
  emit("confirm", 1000);
}
</script>

<template>
  <form ref="form" class="paneled-credits__form" :aria-label="action === 'buy' ? 'Buy credits' : 'Redeem credits'" @submit.prevent="submit">
    <template v-if="action === 'buy'">
      <span class="paneled-credits__form-title">Buy credits</span>
      <ToggleGroup.Root v-model="amount" :deselectable="false" size="sm" variant="outline" aria-label="Credit amount">
        <ToggleGroup.Item v-for="value in ['1000', '2500', '5000']" :key="value" :value="value">{{ creditAmount(Number(value)) }}</ToggleGroup.Item>
      </ToggleGroup.Root>
      <p class="paneled-credits__note">Demo credits only. No payment is taken.</p>
    </template>
    <Field.Root v-else :invalid="!!error" :disabled="redeemed">
      <Field.Label>Redeem code</Field.Label>
      <Field.Input v-model="code" size="sm" autocomplete="off" :spellcheck="false" @input="error = ''" />
      <Field.HelperText>{{ redeemed ? 'Demo credit already redeemed in this workspace.' : 'Use DICEHUB-DEMO for $10.00 in demo credits.' }}</Field.HelperText>
      <Field.ErrorText v-if="error">{{ error }}</Field.ErrorText>
    </Field.Root>
    <div class="paneled-credits__action-row">
      <Button type="submit" size="sm" full-width class="paneled-credits__buy" :disabled="action === 'redeem' && (redeemed || !code.trim())">{{ action === 'buy' ? 'Add demo credits' : 'Redeem' }}</Button>
      <Button variant="outline" size="sm" full-width @click="emit('cancel')">Cancel</Button>
    </div>
  </form>
</template>
