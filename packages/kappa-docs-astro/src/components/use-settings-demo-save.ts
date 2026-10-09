import { onBeforeUnmount, ref } from "vue";

export type SettingsDemoSaveState = "idle" | "saving" | "saved";

export function useSettingsDemoSave() {
  const state = ref<SettingsDemoSaveState>("idle");
  let saveTimer: ReturnType<typeof setTimeout> | undefined;
  let statusTimer: ReturnType<typeof setTimeout> | undefined;

  function save(onSaved?: () => void) {
    clearTimeout(saveTimer);
    clearTimeout(statusTimer);
    state.value = "saving";
    saveTimer = setTimeout(() => {
      onSaved?.();
      state.value = "saved";
      statusTimer = setTimeout(() => { state.value = "idle"; }, 2000);
    }, 350);
  }

  onBeforeUnmount(() => {
    clearTimeout(saveTimer);
    clearTimeout(statusTimer);
  });
  return { state, save };
}
