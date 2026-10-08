// Adapted from @zag-js/number-input 1.43.3 (MIT), copyright 2021 Chakra UI.
// The full notice is preserved in licenses/zag-number-input.LICENSE.
import { setElementValue } from "@zag-js/dom-query";
import { machine } from "@zag-js/number-input";
import { nextTick } from "vue";
import { recordCursor, restoreCursor } from "./number-input-cursor.ts";

export function createNumberInputMachine(): { machine: typeof machine; dispose: () => void } {
  const implementations = machine.implementations;
  const actions = implementations?.actions;
  if (!actions?.syncInputElement) throw new Error("Review the Number Input synchronization repair after upgrading Zag.");
  let revision = 0;
  let disposed = false;
  const stableMachine: typeof machine = {
    ...machine,
    implementations: {
      ...implementations,
      actions: {
        ...actions,
        syncInputElement({ context, event, computed, scope }) {
          const current = ++revision;
          const inputId = scope.ids?.input ?? `number-input:${scope.id}:input`;
          const input = scope.getById<HTMLInputElement>(inputId);
          if (!input) return;
          const selection = event.selection ?? recordCursor(input, scope);
          const rawValue = event.type.endsWith("CHANGE");
          // The second tick follows a render queued later by a parent callback in this event.
          // Both ticks finish before the next native input task can change the selection.
          void nextTick(() => nextTick(() => {
            if (disposed || current !== revision || !input.isConnected || scope.getById(inputId) !== input) return;
            const value = rawValue ? context.get("value") : computed("formattedValue");
            setElementValue(input, value);
            restoreCursor(input, selection, scope);
          }));
        },
      },
    },
  };
  return { machine: stableMachine, dispose: () => { disposed = true; revision++; } };
}
