import { shallowRef } from "vue";
import { createToaster, type CreateToasterProps, type CreateToasterReturn } from "@dicehub/kappa/components/toast/store";

interface DemoState {
  key: number;
  name: string;
  toaster: CreateToasterReturn;
  locale: string;
  custom: boolean;
}

// Browser event handlers alone create stores. SSR never creates notifications.
// One host serves all examples, so placement-based Ark region IDs stay unique.
export const toastDemoState = shallowRef<DemoState>();
let sequence = 0;

export function selectToastDemo(name: string, options: CreateToasterProps = {}, locale = "en-US", custom = false) {
  if (typeof window === "undefined") throw new Error("Toast demos run in the browser only.");
  if (toastDemoState.value?.name !== name) {
    toastDemoState.value?.toaster.remove();
    toastDemoState.value = { key: ++sequence, name, toaster: createToaster(options), locale, custom };
  }
  return toastDemoState.value!.toaster;
}

export function clearToastDemos() {
  toastDemoState.value?.toaster.remove();
  toastDemoState.value = undefined;
}
