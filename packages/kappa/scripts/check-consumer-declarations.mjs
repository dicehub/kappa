import ts from "typescript";
import { resolve } from "node:path";

const arkSlotFiles = [
  "color-picker/color-picker-channel-slider-value-text.vue.d.ts",
  "color-picker/color-picker-value-text.vue.d.ts",
  "file-upload/file-upload-item-name.vue.d.ts",
  "file-upload/file-upload-item-size-text.vue.d.ts",
  "listbox/listbox-value-text.vue.d.ts",
  "progress/progress-value-text.vue.d.ts",
  "select/select-value-text.vue.d.ts",
  "slider/slider-dragging-indicator.vue.d.ts",
  "slider/slider-value-text.vue.d.ts",
];

// Ark UI 5.39.2 ships these defects. Keep this list narrow; any other upstream
// diagnostic fails validation, just like a Kappa or consumer diagnostic.
export const isKnownArkDeclarationError = (diagnostic) => {
  const file = diagnostic.file?.fileName.replaceAll("\\", "/") ?? "";
  const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
  if (!file.includes("/@ark-ui/vue/dist/components/")) return false;
  return (diagnostic.code === 2304 && message === "Cannot find name '__VLS_Slots'." && arkSlotFiles.some((suffix) => file.endsWith(`/${suffix}`)))
    || (diagnostic.code === 2300 && file.endsWith("/highlight/use-highlight.d.ts") && message === "Duplicate identifier 'HighlightChunk'.");
};

export const checkConsumerDeclarations = (consumerRoot) => {
  const configPath = resolve(consumerRoot, "tsconfig.json");
  const config = ts.readConfigFile(configPath, ts.sys.readFile);
  if (config.error) throw new Error(ts.flattenDiagnosticMessageText(config.error.messageText, "\n"));
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, consumerRoot);
  const program = ts.createProgram(parsed.fileNames, { ...parsed.options, skipLibCheck: false });
  const diagnostics = [...parsed.errors, ...ts.getPreEmitDiagnostics(program)];
  const errors = diagnostics.filter((diagnostic) => !isKnownArkDeclarationError(diagnostic));
  if (errors.length) {
    throw new Error(ts.formatDiagnosticsWithColorAndContext(errors, {
      getCanonicalFileName: (file) => file,
      getCurrentDirectory: () => consumerRoot,
      getNewLine: () => "\n",
    }));
  }
  if (diagnostics.length) {
    console.warn(`Ark UI reports ${diagnostics.length} known upstream declaration errors. Consumers currently need skipLibCheck: true. Kappa declarations passed the strict check.`);
  }
};
