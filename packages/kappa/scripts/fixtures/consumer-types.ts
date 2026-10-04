import { Button, Dialog, Slider, TableOfContents, useHighlight } from "@dicehub/kappa";
import { DialogRoot } from "@dicehub/kappa/components/dialog";
import type { SelectProps } from "@dicehub/kappa/components/select";
import type { TableOfContentsRoot } from "@dicehub/kappa/components/table-of-contents";

type ButtonProps = InstanceType<typeof Button>["$props"];
type DialogProps = InstanceType<typeof Dialog.Root>["$props"];
type TocProps = InstanceType<typeof TableOfContents.Root>["$props"];
type SliderSlots = InstanceType<typeof Slider.ValueText>["$slots"];

const dialogRoot: typeof DialogRoot = Dialog.Root;
const dialog: typeof Dialog.Root = DialogRoot;
const tocRoot: typeof TableOfContentsRoot = TableOfContents.Root;
const size: ButtonProps["size"] = "sm";
const open: DialogProps["open"] = true;
const disabled: SelectProps["disabled"] = false;
const activeIds: TocProps["activeIds"] = ["installation"];
const slot: SliderSlots["default"] = () => "42";
const chunks = useHighlight({ text: "Kappa", query: "Kap" });
const match: boolean | undefined = chunks.value[0]?.match;

// @ts-expect-error Button sizes must be strings.
const invalidSize: ButtonProps["size"] = 42;
// @ts-expect-error Controlled open state must be boolean.
const invalidOpen: DialogProps["open"] = "open";
// @ts-expect-error Disabled state must be boolean.
const invalidDisabled: SelectProps["disabled"] = "disabled";
// @ts-expect-error TOC active identifiers must be strings.
const invalidIds: TocProps["activeIds"] = [42];
// @ts-expect-error The default slot provides no scoped arguments.
const invalidSlot: SliderSlots["default"] = (props: { value: number }) => props.value;

void [dialogRoot, dialog, tocRoot, size, open, disabled, activeIds, slot, match];
void [invalidSize, invalidOpen, invalidDisabled, invalidIds, invalidSlot];
