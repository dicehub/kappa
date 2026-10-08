// Adapted from @zag-js/number-input 1.43.3 (MIT), copyright 2021 Chakra UI.
// The full notice is preserved in licenses/zag-number-input.LICENSE.
type CursorScope = { isActiveElement(element: Element | null): boolean };
type Selection = { start: number; end: number; value: string };

export function recordCursor(input: HTMLInputElement | null, scope: CursorScope): Selection | undefined {
  if (!input || !scope.isActiveElement(input)) return;
  try {
    const { selectionStart: start, selectionEnd: end, value } = input;
    if (start == null || end == null) return;
    return { start, end, value };
  } catch {
    return;
  }
}

export function restoreCursor(input: HTMLInputElement, selection: Selection | undefined, scope: CursorScope) {
  if (!scope.isActiveElement(input)) return;
  if (!selection) {
    input.setSelectionRange(input.value.length, input.value.length);
    return;
  }
  try {
    const { start, end, value: previousValue } = selection;
    const value = input.value;
    if (value === previousValue) {
      input.setSelectionRange(start, end);
      return;
    }
    const nextStart = getNextCursorPosition(previousValue, value, start);
    const nextEnd = start === end ? nextStart : getNextCursorPosition(previousValue, value, end);
    const clampedStart = Math.max(0, Math.min(nextStart, value.length));
    input.setSelectionRange(clampedStart, Math.max(clampedStart, Math.min(nextEnd, value.length)));
  } catch {
    input.setSelectionRange(input.value.length, input.value.length);
  }
}

function getNextCursorPosition(previous: string, value: string, position: number) {
  const before = previous.slice(0, position);
  const after = previous.slice(position);
  let prefix = 0;
  for (let index = 0; index < Math.min(before.length, value.length); index++) {
    if (before[index] !== value[index]) break;
    prefix = index + 1;
  }
  let suffix = 0;
  for (let index = 0; index < Math.min(after.length, value.length - prefix); index++) {
    if (after[after.length - 1 - index] !== value[value.length - 1 - index]) break;
    suffix = index + 1;
  }
  if (before.length > 0 && prefix >= before.length) return prefix;
  if (suffix >= after.length) return value.length - suffix;
  if (prefix > 0) return prefix;
  if (suffix > 0) return value.length - suffix;
  if (position === 0) return value.length;
  if (previous.length > 0) return Math.round(position / previous.length * value.length);
  return value.length;
}
