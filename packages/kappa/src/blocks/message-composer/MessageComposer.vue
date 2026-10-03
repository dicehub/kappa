<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from "vue";
import { Button } from "../../components/button";
import { InputArea } from "../../components/input-area";
import { FileUpload, useFileUpload, type FileUploadFileRejection } from "../../components/file-upload";
import MessageComposerAttachments from "./MessageComposerAttachments.vue";
import { MESSAGE_COMPOSER_LABELS, type MessageComposerProps, type MessageComposerEmits,
  type MessageComposerApi, type MessageComposerSlots } from "./message-composer";
import { isMessageComposerDraftValid, messageComposerKeyAction, messageComposerRejectionReason,
  resolveMessageComposerLimit } from "./message-composer-helpers";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<MessageComposerProps>(), {
  modelValue: undefined, defaultValue: "", files: undefined, defaultFiles: () => [],
  pending: false, disabled: false, sendOnEnter: true, allowAttachmentsOnly: true,
  allowAttachments: true, maxFiles: 5, maxFileSize: 10 * 1024 * 1024, maxLength: 4000,
});
const emit = defineEmits<MessageComposerEmits>();
defineSlots<MessageComposerSlots>();
const root = ref<HTMLDivElement>();
const localText = ref(props.defaultValue);
const localFiles = ref<File[]>([...props.defaultFiles]);
const rejections = ref<FileUploadFileRejection[]>([]);
const composing = ref(false);
const instanceId = useId();
const inputId = computed(() => props.id ?? `kappa-message-composer-${instanceId}`);
const labels = computed(() => ({ ...MESSAGE_COMPOSER_LABELS, ...props.labels }));
const text = computed(() => props.modelValue ?? localText.value);
const files = computed(() => props.files ?? localFiles.value);
const locked = computed(() => props.pending || props.disabled);
const maxLength = computed(() => resolveMessageComposerLimit(props.maxLength, 4000));
const maxFiles = computed(() => resolveMessageComposerLimit(props.maxFiles, 5));
const maxFileSize = computed(() => resolveMessageComposerLimit(props.maxFileSize, 10 * 1024 * 1024, 0));
const tooLong = computed(() => text.value.length > maxLength.value);
const invalidFiles = computed(() => files.value.length > maxFiles.value ||
  files.value.some(file => file.size > maxFileSize.value) || (!props.allowAttachments && files.value.length > 0));
const validation = computed(() => props.error || (tooLong.value ? labels.value.tooLong(maxLength.value) :
  invalidFiles.value ? labels.value.invalidFiles : ""));
const canSend = computed(() => !locked.value && isMessageComposerDraftValid({
  text: text.value, files: files.value, maxLength: maxLength.value, maxFiles: maxFiles.value,
  maxFileSize: maxFileSize.value, allowAttachmentsOnly: props.allowAttachmentsOnly, allowAttachments: props.allowAttachments,
}));
const descriptionIds = computed(() => [
  props.textareaProps?.["aria-describedby"], `${inputId.value}-hint`, `${inputId.value}-count`,
  validation.value ? `${inputId.value}-error` : undefined,
  rejections.value.length ? `${inputId.value}-file-errors` : undefined,
].filter(Boolean).join(" "));

function setText(value: string) {
  if (locked.value) return;
  localText.value = value; emit("update:modelValue", value);
}
function setFiles(value: File[]) {
  if (locked.value) return;
  localFiles.value = [...value]; emit("update:files", [...value]);
}
const upload = useFileUpload(computed(() => ({
  acceptedFiles: files.value, accept: props.accept, maxFiles: maxFiles.value, maxFileSize: maxFileSize.value,
  disabled: locked.value, allowDrop: props.allowAttachments, preventDocumentDrop: false,
  onFileAccept(details) { if (!locked.value) { rejections.value = []; setFiles(details.files); } },
  onFileReject(details) {
    if (locked.value) return;
    rejections.value = details.files;
    if (details.files.length) emit("fileReject", details);
  },
})));

function focus() { root.value?.querySelector("textarea")?.focus(); }
function send() {
  if (!canSend.value || composing.value) return;
  emit("send", { text: text.value, files: [...files.value] });
}
function onKeydown(event: KeyboardEvent) {
  const action = messageComposerKeyAction(event, props.sendOnEnter, composing.value);
  if (action === "native") return;
  event.preventDefault();
  if (action === "send") send();
}
function paste(event: ClipboardEvent) {
  if (locked.value || !props.allowAttachments) return;
  if (upload.value.setClipboardFiles(event.clipboardData)) {
    // A mixed clipboard can hold both files and text. Preserve native text insertion.
    if (!event.clipboardData?.getData("text/plain")) event.preventDefault();
  }
}
function guardDrop(event: DragEvent) {
  const containsFiles = Array.from(event.dataTransfer?.types ?? []).includes("Files");
  if (!containsFiles) { event.stopPropagation(); return; }
  if (locked.value || !props.allowAttachments) { event.preventDefault(); event.stopPropagation(); }
}
function remove(file: File) {
  if (locked.value) return;
  upload.value.deleteFile(file);
  nextTick(focus);
}
function clear() {
  if (locked.value) return;
  setText(""); setFiles([]); rejections.value = []; upload.value.clearRejectedFiles();
}
watch(() => props.pending, (pending, previous) => {
  const element = root.value;
  const document = element?.ownerDocument;
  // Capture ownership before Vue removes the pending action.
  const ownedFocus = element?.contains(document?.activeElement ?? null);
  if (!previous || pending || props.disabled || !ownedFocus) return;
  nextTick(() => {
    if (document?.activeElement === document?.body || element?.contains(document?.activeElement ?? null)) focus();
  });
});
defineExpose<MessageComposerApi>({ focus, clear, send });
</script>

<template>
  <div ref="root" v-bind="$attrs" class="kappa-message-composer" data-slot="message-composer"
    :data-disabled="disabled ? '' : undefined" :data-pending="pending ? '' : undefined" :aria-busy="pending || undefined">
    <FileUpload.RootProvider :value="upload" class="kappa-message-composer__upload">
      <label :for="inputId" class="kappa-message-composer__label">{{ labels.label }}</label>
      <div v-if="$slots.context" class="kappa-message-composer__context"><slot name="context" /></div>
      <FileUpload.Dropzone disable-click role="group" :aria-label="labels.label" :aria-disabled="disabled || undefined" class="kappa-message-composer__surface"
        :data-invalid="validation ? '' : undefined" @drop.capture="guardDrop" @dragover.capture="guardDrop">
        <InputArea v-bind="textareaProps" :id="inputId" :model-value="text" autoresize :rows="3"
          :placeholder="labels.placeholder" :disabled="disabled" :readonly="pending" :invalid="Boolean(validation)"
          :aria-describedby="descriptionIds" class="kappa-message-composer__input"
          @update:model-value="setText" @keydown="onKeydown" @paste="paste"
          @compositionstart="composing = true" @compositionend="composing = false" />
        <MessageComposerAttachments v-if="files.length" :files="files" :disabled="locked" :labels="labels"
          :format-size="upload.getFileSize" @remove="remove" />
        <div class="kappa-message-composer__toolbar">
          <FileUpload.Trigger v-if="allowAttachments" as-child>
            <Button size="sm" variant="ghost" :disabled="locked">
              <svg class="kappa-message-composer__icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m7.5 10.5 5-5a2.12 2.12 0 0 1 3 3l-7 7a3.54 3.54 0 0 1-5-5l7-7a4.95 4.95 0 0 1 7 7l-7 7" /></svg>
              {{ labels.attach }}
            </Button>
          </FileUpload.Trigger>
          <span :id="`${inputId}-count`" class="kappa-message-composer__count" :data-invalid="tooLong ? '' : undefined">
            <span class="kappa-message-composer__sr-only">{{ labels.characters }}: </span>{{ text.length }} / {{ maxLength }}
          </span>
          <Button v-if="pending" size="sm" variant="secondary" :disabled="disabled" @click="emit('cancel')">{{ labels.cancel }}</Button>
          <Button v-else size="sm" variant="primary" :disabled="!canSend" @click="send">{{ labels.send }}<svg class="kappa-message-composer__icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 15V5m-4 4 4-4 4 4" /></svg></Button>
        </div>
        <span v-if="upload.dragging && !locked" class="kappa-message-composer__drop" aria-hidden="true">{{ labels.drop }}</span>
      </FileUpload.Dropzone>
      <FileUpload.HiddenInput v-if="allowAttachments" :aria-label="labels.attach" />
    </FileUpload.RootProvider>
    <div class="kappa-message-composer__support">
      <p :id="`${inputId}-hint`" class="kappa-message-composer__hint"><slot name="hint">{{ sendOnEnter ? labels.hint : labels.buttonHint }}</slot></p>
      <p v-if="pending" class="kappa-message-composer__pending" role="status">{{ labels.sending }}</p>
    </div>
    <p v-if="validation" :id="`${inputId}-error`" class="kappa-message-composer__error" role="alert">{{ validation }}</p>
    <div v-if="rejections.length" :id="`${inputId}-file-errors`" class="kappa-message-composer__errors" role="alert">
      <ul><li v-for="(rejection, index) in rejections" :key="index">{{ labels.rejectedFile(rejection.file, rejection.errors.map(messageComposerRejectionReason)) }}</li></ul>
      <Button size="xs" variant="ghost" :disabled="locked" @click="rejections = []; upload.clearRejectedFiles()">{{ labels.dismissErrors }}</Button>
    </div>
  </div>
</template>

<style src="./message-composer.css"></style>
