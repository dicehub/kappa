export const barrelCode = `import { Toast, Toaster, createToaster } from "@dicehub/kappa";`;
export const granularCode = `import { Toast, Toaster, createToaster } from "@dicehub/kappa/components/toast";`;

function example(script: string, controls: string, options = "", extraImports = "") {
  return `<script setup>
import { Button } from "@dicehub/kappa/components/button";
import { Toaster, createToaster } from "@dicehub/kappa/components/toast";
${extraImports ? `${extraImports}\n` : ""}
const toaster = createToaster(${options});
${script ? `\n${script}\n` : ""}</script>

<template>
  ${controls}
  <Toaster :toaster="toaster" />
</template>`;
}

export const previewCode = example("", `<Button variant="outline" @click="toaster.success({
    title: 'Changes saved',
    description: 'Your project settings are up to date.',
  })">Save changes</Button>`);

export const customCode = `<script setup>
import { Button } from "@dicehub/kappa/components/button";
import { Toast, Toaster, createToaster } from "@dicehub/kappa/components/toast";

const toaster = createToaster();
function shareProject() {
  toaster.create({
    title: "Project shared",
    description: "The team can now access this project.",
    action: { label: "View project", onClick: () => console.log("Open project") },
  });
}
</script>

<template>
  <Button @click="shareProject">Share project</Button>
  <Toaster v-slot="toast" :toaster="toaster">
    <Toast.Root>
      <Toast.Title>{{ toast.title }}</Toast.Title>
      <Toast.Description>{{ toast.description }}</Toast.Description>
      <Toast.ActionTrigger as-child>
        <Button size="xs" variant="outline">{{ toast.action.label }}</Button>
      </Toast.ActionTrigger>
      <Toast.CloseTrigger />
    </Toast.Root>
  </Toaster>
</template>`;

export const examples = [
  {
    id: "types", title: "Types", variant: "types",
    description: "Success, error, warning, and information messages share a quiet surface. The icon identifies the status without relying on color alone.",
    code: example(`const types = ["success", "error", "warning", "info"];`, `<Button v-for="type in types" :key="type" variant="outline"
    @click="toaster.create({ type, title: type, description: 'Notification details.' })">
    {{ type }}
  </Button>`),
  },
  {
    id: "content", title: "Title and Description", variant: "content",
    description: "Use a title, a description, or both. Set closable to false to hide the default close button; Escape still dismisses a focused notification.",
    code: example("", `<Button @click="toaster.create({ title: 'Settings saved' })">Title only</Button>
  <Button @click="toaster.create({ description: 'Your changes are available to the team.' })">Description only</Button>
  <Button @click="toaster.create({ title: 'Automatic notice', closable: false })">Without close button</Button>`),
  },
  {
    id: "action", title: "Action", variant: "action",
    description: "Offer one short action. This persistent notification lets the user undo a local change. The action callback runs before Ark dismisses the toast.",
    code: example(`const removed = ref(false);
function removeItem() {
  removed.value = true;
  toaster.create({
    title: "Item removed",
    description: "You can undo this change.",
    duration: Infinity,
    action: { label: "Undo", onClick: () => { removed.value = false; } },
  });
}`, `<Button @click="removeItem">Remove item</Button>
  <span>{{ removed ? 'Item removed' : 'Item available' }}</span>`, "", `import { ref } from "vue";`),
  },
  {
    id: "promise", title: "Promise", variant: "promise",
    description: "One notification follows an operation from loading to success or error. Use Finish upload or Fail upload to resolve this local example; it sends no files.",
    code: example(`let task;
function startUpload() {
  task = Promise.withResolvers();
  toaster.promise(task.promise, {
    loading: { title: "Uploading geometry" },
    success: (file) => ({ title: "Upload complete", description: file + " is ready." }),
    error: { title: "Upload failed", description: "No files were changed. Try again." },
  });
}`, `<Button @click="startUpload">Start upload</Button>
  <Button @click="task?.resolve('geometry.step')">Finish upload</Button>
  <Button @click="task?.reject(new Error('Connection lost'))">Fail upload</Button>`),
  },
  {
    id: "update", title: "Update in Place", variant: "update",
    description: "Keep the ID returned by create to update the existing notification. Changing loading to success starts the normal dismissal timer.",
    code: example(`let id;
function startExport() {
  id = toaster.create({ title: "Preparing export", type: "loading" });
}
function completeExport() {
  if (id) toaster.update(id, { title: "Export ready", type: "success", duration: 5000 });
}`, `<Button @click="startExport">Start export</Button>
  <Button @click="completeExport">Complete export</Button>`),
  },
  {
    id: "stack", title: "Stack and Queue", variant: "stack",
    description: "The newest three notifications form a compact stack that expands on hover or focus. Add messages one at a time or in a burst. Older messages remain mounted but hidden and inert until space is available or their timers expire. Always expanded uses overlap: false. Queue overflow explicitly sets max: 3 instead of delaying new messages by default.",
    code: example(`let number = 0;
function addNotifications(count = 1) {
  for (let index = 0; index < count; index++) {
    toaster.create({ title: "Notification " + ++number });
  }
}`, `<Button @click="addNotifications()">Add notification</Button>
  <Button @click="addNotifications(6)">Add six notifications</Button>
  <Button @click="toaster.remove()">Clear all</Button>`, `{ duration: Infinity }`),
  },
  {
    id: "duration", title: "Duration and Pause", variant: "duration",
    description: "The default duration is five seconds. Hovering or focusing the group pauses timers. Leaving the browser tab also pauses them. Infinity keeps a notification open until dismissed.",
    code: example("", `<Button @click="toaster.create({ title: 'Link copied', duration: 2000 })">Two seconds</Button>
  <Button @click="toaster.create({ title: 'Review required', duration: Infinity })">Persistent</Button>`),
  },
  {
    id: "placement", title: "Placement", variant: "placement",
    description: "Choose one of six placements when creating the store. Mount each store once, with at most one Toaster per placement in a document. This page replaces the active example when you select a new placement.",
    code: example("", `<Button @click="toaster.info({ title: 'Position preview' })">Show notification</Button>`, `{ placement: "top-end", offsets: "1rem" }`),
  },
  {
    id: "rtl", title: "Right-to-left", variant: "rtl",
    description: "DirectionProvider supplies the locale to Ark UI. Logical placement and the content order follow the reading direction.",
    code: `<script setup>
import { DirectionProvider } from "@dicehub/kappa/components/direction-provider";
import { Button } from "@dicehub/kappa/components/button";
import { Toaster, createToaster } from "@dicehub/kappa/components/toast";
const toaster = createToaster({ placement: "bottom-end" });
</script>

<template>
  <DirectionProvider locale="ar">
    <Button @click="toaster.success({ title: 'تم الحفظ', description: 'تم تحديث إعدادات المشروع.' })">Show notification</Button>
    <Toaster :toaster="toaster" />
  </DirectionProvider>
</template>`,
  },
  {
    id: "custom", title: "Custom Composition", variant: "custom",
    description: "The default slot receives the toast options. Use the named parts to keep primitive semantics, and compose an existing Kappa Button through as-child. Toast.Context exposes the live notification state.",
    code: customCode,
  },
] as const;

export const toasterProps = [
  ["toaster", "CreateToasterReturn", "Required", "Store from createToaster. Keep its identity stable; remount the host if replacing it."],
  ["limit", "number", "3", "Maximum displayed notifications, newest first. Older notifications stay managed but hidden and inert. Infinity displays all."],
  ["teleport", "boolean", "true", "Move the region to its target after mount. Set false for an explicit local environment."],
  ["teleportTo", "string | HTMLElement", '"body"', "Teleport target. It must exist when the host mounts."],
  ["closeLabel", "string", '"Dismiss notification"', "Accessible label for the default close control."],
  ["default slot", "(toast: ToastOptions) => VNodeChild", "Kappa content", "Replace the entire notification, inside the per-toast context."],
];

export const storeProps = [
  ["placement", "ToastPlacement", '"bottom-end"', "Logical placement for the group."],
  ["max", "number", "Infinity", "Optional Ark queue cap. Set a finite value to queue new messages after this many are mounted. Toaster.limit controls the visible stack separately."],
  ["gap", "number", "8", "Gap between notifications in pixels."],
  ["duration", "number", "5000", "Default duration in milliseconds. Loading notifications persist."],
  ["overlap", "boolean", "true", "Use a compact stack; hover and focus expand it. Set false to keep notifications expanded."],
  ["offsets", "string | edge object", '"1rem"', "Distance from each viewport edge, including safe-area handling."],
  ["removeDelay", "number", "200", "Delay before removal, allowing the exit transition to finish."],
  ["pauseOnPageIdle", "boolean", "true", "Pause timers while the browser tab is hidden."],
  ["hotkey", "string[]", '["altKey", "KeyT"]', "Shortcut for moving focus to the notification group."],
];

export const optionProps = [
  ["title / description", "VNodeChild", "—", "Notification content. The default renderer preserves strings and Vue VNodes; it never parses HTML."],
  ["type", "ToastType", '"info"', "Use success, error, warning, info, or loading."],
  ["id", "string", "Generated", "Stable ID for updates. Keep IDs unique across stores."],
  ["duration", "number", "Store default", "Per-notification duration; Infinity persists until dismissal."],
  ["closable", "boolean", "Shown by default", "The Kappa default renderer hides its close button only when false."],
  ["action", "ToastActionOptions", "—", "A label and onClick callback. The action dismisses the notification."],
  ["onStatusChange", "(details) => void", "—", "Receives visible, dismissing, and unmounted status changes."],
  ["priority / meta", "number / object", "Ark defaults", "Priority affects queued messages; meta stores application data."],
];

export const methods = [
  ["create(options)", "Create a message and return its ID."],
  ["success / error / warning / info / loading", "Create a message with the corresponding type."],
  ["update(id, options)", "Update a notification in place."],
  ["promise(operation, options, shared?)", "Track promise states. Returns an ID and unwrap() to access the result."],
  ["dismiss(id?)", "Dismiss visible notifications with an exit transition. The queue can then reveal more."],
  ["remove(id?)", "Remove immediately. Without an ID, clear both visible and queued notifications."],
  ["pause(id?) / resume(id?)", "Control automatic dismissal timers."],
  ["expand() / collapse()", "Control an overlapping stack."],
  ["getCount() / getVisibleToasts()", "Read Ark's mounted notifications, including older items hidden by Toaster.limit; queued items are excluded."],
  ["isVisible(id) / isDismissed(id) / subscribe(callback)", "Observe the existing Ark store."],
];
