<script setup lang="ts">
import { computed, ref } from "vue";
import { Checkbox, useCheckbox, type CheckboxCheckedState } from "@dicehub/kappa/components/checkbox";
import { Checkbox as ArkCheckbox } from "@ark-ui/vue/checkbox";
const events = ref<string[]>([]), entries = ref(""), accepted = ref<CheckboxCheckedState>(false);
const acceptedGroup = ref<string[]>([]), acceptedProvider = ref<CheckboxCheckedState>(false);
const record = (name: string, value: unknown) => events.value.push(`${name}:${JSON.stringify(value)}`);
const provider = useCheckbox({ checked: false, name: "provider", value: "provider", onCheckedChange: details => record("provider", details.checked) });
const updatingProvider = useCheckbox(computed(() => ({ checked: acceptedProvider.value, name: "accepted-provider", value: "accepted-provider", onCheckedChange: (details: { checked: CheckboxCheckedState }) => { acceptedProvider.value = details.checked; } })));
const states: CheckboxCheckedState[] = [false, true, "indeterminate"];
function inspectForm(event: Event) {
  const form = (event.currentTarget as HTMLButtonElement).form!;
  entries.value = JSON.stringify([...new FormData(form)]);
}
</script>

<template>
  <main>
    <h1>Checkbox consumer</h1>
    <form>
      <Checkbox.Root v-for="state in states" :key="String(state)" :checked="state" :name="`state-${state}`" :value="String(state)"
        @update:checked="record(String(state), $event)">
        <Checkbox.Control /><Checkbox.Label>Rejected {{ state }}</Checkbox.Label>
      </Checkbox.Root>
      <Checkbox.RootProvider :value="provider"><Checkbox.Control /><Checkbox.Label>Rejected provider</Checkbox.Label></Checkbox.RootProvider>
      <Checkbox.Group :model-value="[]" name="group" @update:model-value="record('group', $event)">
        <Checkbox.Root value="group-value"><Checkbox.Control /><Checkbox.Label>Rejected group</Checkbox.Label></Checkbox.Root>
      </Checkbox.Group>
      <Checkbox.Root v-model:checked="accepted" name="accepted" value="accepted"><Checkbox.Control /><Checkbox.Label>Accepted change</Checkbox.Label></Checkbox.Root>
      <Checkbox.RootProvider :value="updatingProvider"><Checkbox.Control /><Checkbox.Label>Accepted provider</Checkbox.Label></Checkbox.RootProvider>
      <Checkbox.Group v-model="acceptedGroup" name="accepted-group">
        <Checkbox.Root value="accepted-group-value"><Checkbox.Control /><Checkbox.Label>Accepted group</Checkbox.Label></Checkbox.Root>
      </Checkbox.Group>
      <ArkCheckbox.Root :checked="false" name="ark" value="ark"><ArkCheckbox.Control /><ArkCheckbox.Label>Ark rejected</ArkCheckbox.Label><ArkCheckbox.HiddenInput /></ArkCheckbox.Root>
      <button type="button" @click="inspectForm">Read form</button>
    </form>
    <output aria-label="Public events">{{ events.join('\n') }}</output>
    <output aria-label="Form entries">{{ entries }}</output>
    <output aria-label="Accepted value">{{ accepted }}</output>
  </main>
</template>
