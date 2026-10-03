<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import type { ToastPlacement, ToastType } from "@dicehub/kappa/components/toast";
import { clearToastDemos, selectToastDemo } from "./toast-demo-state";

const props = withDefaults(defineProps<{ variant?: string }>(), { variant: "preview" });
const types = ["success", "error", "warning", "info"] as const;
const placements: ToastPlacement[] = ["top-start", "top", "top-end", "bottom-start", "bottom", "bottom-end"];
const feedback = ref("");
const pending = ref(false);
let task: ReturnType<typeof Promise.withResolvers<string>> | undefined;
let jobId: string | undefined;
let stackSequence = 0;

function addNotification(count = 1) {
  const toaster = selectToastDemo("stack", { duration: Infinity });
  for (let index = 0; index < count; index += 1) {
    const number = ++stackSequence;
    toaster.create({
      title: `Notification ${number}`,
      description: number % 2 ? "Changes saved." : "The latest project settings are available to everyone in your workspace.",
      type: "info",
    });
  }
}

function showType(type: ToastType = "success") {
  const messages = {
    success: ["Changes saved", "Your project settings are up to date."],
    error: ["Upload failed", "Check your connection, then try again."],
    warning: ["Storage almost full", "Remove unused files to free up space."],
    info: ["Export ready", "Your project archive is ready to download."],
  };
  const [title, description] = messages[type as keyof typeof messages] ?? messages.info;
  selectToastDemo(props.variant).create({ type, title, description });
}

function showAction() {
  feedback.value = "Item removed";
  selectToastDemo("action").create({
    title: "Item removed", description: "You can undo this change.", duration: Infinity,
    action: { label: "Undo", onClick: () => { feedback.value = "Item restored"; } },
  });
}

function startUpload() {
  const toaster = selectToastDemo("promise");
  pending.value = true;
  task = Promise.withResolvers<string>();
  toaster.promise(task.promise, {
    loading: { title: "Uploading geometry", description: "Preparing the project files." },
    success: (file) => ({ title: "Upload complete", description: `${file} is ready.` }),
    error: { title: "Upload failed", description: "No files were changed. Try again." },
    finally: () => { pending.value = false; task = undefined; },
  });
}

function startJob() {
  jobId = selectToastDemo("update").create({ title: "Preparing export", type: "loading" });
  feedback.value = "Export in progress";
}

function finishJob() {
  if (!jobId) return;
  selectToastDemo("update").update(jobId, { title: "Export ready", description: "The same notification now shows the result.", type: "success" });
  feedback.value = "Export complete";
  jobId = undefined;
}

function showStack(queue: boolean) {
  const toaster = selectToastDemo(queue ? "queue" : "expanded", { overlap: false, max: queue ? 3 : Infinity, duration: Infinity });
  toaster.remove();
  for (let index = 1; index <= 4; index += 1) {
    toaster.create({ title: `Notification ${index}`, description: index === 4 && queue ? "This notification was queued." : "Hover or focus to pause notifications.", type: "info" });
  }
}

function showDuration(persistent: boolean) {
  selectToastDemo("duration").create({
    title: persistent ? "Review required" : "Link copied", type: "info",
    description: persistent ? "This message stays until you dismiss it." : "Closes after two seconds. Hover or focus to pause.",
    duration: persistent ? Infinity : 2000,
    onStatusChange: ({ status }) => { feedback.value = status; },
  });
}

function showPlacement(placement: ToastPlacement) {
  selectToastDemo(`placement-${placement}`, { placement }).create({ title: "Position preview", description: placement });
}

function showCustom() {
  selectToastDemo("custom", {}, "en-US", true).create({
    title: "Project shared", description: "The team can now access this project.", duration: Infinity,
    action: { label: "View project", onClick: () => { feedback.value = "Project opened"; } },
  });
}

onBeforeUnmount(() => { task?.reject(new Error("Example closed")); });
</script>

<template>
  <div class="toast-demo" :data-toast-demo="props.variant">
    <Button v-if="props.variant === 'preview'" variant="outline" @click="showType()">Save changes</Button>
    <template v-else-if="props.variant === 'types'">
      <Button v-for="type in types" :key="type" size="sm" variant="outline" @click="showType(type)">{{ type.charAt(0).toUpperCase() + type.slice(1) }}</Button>
    </template>
    <template v-else-if="props.variant === 'content'">
      <Button size="sm" variant="outline" @click="selectToastDemo('content').create({ title: 'Settings saved' })">Title only</Button>
      <Button size="sm" variant="outline" @click="selectToastDemo('content').create({ description: 'Your changes are now available to the team.' })">Description only</Button>
      <Button size="sm" variant="outline" @click="selectToastDemo('content').create({ title: 'Automatic notice', description: 'No close button. Escape still dismisses it.', closable: false })">Without close button</Button>
    </template>
    <template v-else-if="props.variant === 'action'"><Button variant="outline" @click="showAction">Remove item</Button><span data-toast-demo-result>{{ feedback }}</span></template>
    <template v-else-if="props.variant === 'promise'">
      <Button variant="outline" :disabled="pending" @click="startUpload">Start upload</Button>
      <Button size="sm" variant="outline" :disabled="!pending" @click="task?.resolve('geometry.step')">Finish upload</Button>
      <Button size="sm" variant="outline" :disabled="!pending" @click="task?.reject(new Error('Connection lost'))">Fail upload</Button>
    </template>
    <template v-else-if="props.variant === 'update'">
      <Button variant="outline" @click="startJob">Start export</Button>
      <Button size="sm" variant="outline" :disabled="feedback !== 'Export in progress'" @click="finishJob">Complete export</Button>
      <span data-toast-demo-result>{{ feedback }}</span>
    </template>
    <template v-else-if="props.variant === 'stack'">
      <Button variant="outline" @click="addNotification()">Add notification</Button>
      <Button size="sm" variant="outline" @click="addNotification(6)">Add six notifications</Button>
      <Button size="sm" variant="outline" @click="showStack(false)">Always expanded</Button>
      <Button size="sm" variant="outline" @click="showStack(true)">Queue overflow</Button>
      <Button size="sm" variant="ghost" @click="clearToastDemos">Clear all</Button>
    </template>
    <template v-else-if="props.variant === 'duration'">
      <Button variant="outline" @click="showDuration(false)">Two seconds</Button>
      <Button size="sm" variant="outline" @click="showDuration(true)">Persistent</Button>
      <span data-toast-demo-result>{{ feedback }}</span>
    </template>
    <template v-else-if="props.variant === 'placement'">
      <Button v-for="placement in placements" :key="placement" size="sm" variant="outline" @click="showPlacement(placement)">{{ placement }}</Button>
    </template>
    <Button v-else-if="props.variant === 'rtl'" variant="outline" @click="selectToastDemo('rtl', {}, 'ar').create({ title: 'تم الحفظ', description: 'تم تحديث إعدادات المشروع.', type: 'success' })">Right-to-left notification</Button>
    <template v-else-if="props.variant === 'custom'"><Button variant="outline" @click="showCustom">Custom content</Button><span data-toast-demo-result>{{ feedback }}</span></template>
  </div>
</template>

<style scoped>
.toast-demo { display: flex; min-width: 0; flex-wrap: wrap; align-items: center; justify-content: center; gap: 0.5rem; }
.toast-demo [data-toast-demo-result] { color: var(--kappa-subtle); font-size: 0.8125rem; }
</style>
