import { Button, Dialog, Slider, TableOfContents, useHighlight } from "@dicehub/kappa";
import { DialogRoot } from "@dicehub/kappa/components/dialog";
import { InlineCopyText } from "@dicehub/kappa";
import type { InlineCopyText as GranularInlineCopyText, InlineCopyTextProps } from "@dicehub/kappa/components/inline-copy-text";
import type { SelectProps } from "@dicehub/kappa/components/select";
import type { TableOfContentsRoot } from "@dicehub/kappa/components/table-of-contents";
import { NavigationMenu } from "@dicehub/kappa";
import type { NavigationMenuProps, NavigationMenuRootProviderProps } from "@dicehub/kappa/components/navigation-menu";
import { SettingsLayout, SettingsSection } from "@dicehub/kappa";
import type { SettingsLayout as GranularSettingsLayout, SettingsSectionProps } from "@dicehub/kappa/blocks/settings-layout";
import { SidebarLayout } from "@dicehub/kappa";
import type { SidebarLayout as GranularSidebarLayout, SidebarLayoutContentAlignment, SidebarLayoutProps } from "@dicehub/kappa/blocks/sidebar-layout";
import { WorkspaceSwitcher } from "@dicehub/kappa";
import type { WorkspaceSwitcher as GranularWorkspaceSwitcher, WorkspaceSwitcherAction, WorkspaceSwitcherProps } from "@dicehub/kappa/blocks/workspace-switcher";

const workspaceSwitcher: typeof GranularWorkspaceSwitcher = WorkspaceSwitcher;
const switcher: WorkspaceSwitcherProps = { modelValue: "engineering", items: [{ value: "engineering", name: "Engineering" }] };
const switcherAction: WorkspaceSwitcherAction = { value: "settings", label: "Settings" };
const switcherTrigger: InstanceType<typeof WorkspaceSwitcher>["$slots"]["trigger"] = ({ workspace }) => workspace?.name;
// @ts-expect-error Workspace selection must be supplied by the application.
const missingWorkspace: WorkspaceSwitcherProps = { items: [] };
// @ts-expect-error Workspace entries require a display name.
const unnamedWorkspace: WorkspaceSwitcherProps = { modelValue: "engineering", items: [{ value: "engineering" }] };
void [workspaceSwitcher, switcher, switcherAction, switcherTrigger, missingWorkspace, unnamedWorkspace];

const sidebarLayout: typeof GranularSidebarLayout = SidebarLayout;
const alignment: SidebarLayoutContentAlignment = "shell";
const centeredLayout: SidebarLayoutProps = { contentAlignment: alignment, mobileBreakpoint: 1200 };
const componentAlignment: InstanceType<typeof SidebarLayout>["$props"]["contentAlignment"] = "available";
// @ts-expect-error Content alignment accepts only available or shell.
const invalidAlignment: SidebarLayoutProps = { contentAlignment: "viewport" };
void [sidebarLayout, centeredLayout, componentAlignment, invalidAlignment];

const settingsLayout: typeof GranularSettingsLayout = SettingsLayout;
const settingsSection: typeof SettingsSection = SettingsLayout.Section;
const setting: SettingsSectionProps = { title: "Time zone", defaultOpen: true, headingLevel: 3 };
// @ts-expect-error Section headings require a title.
const untitledSetting: SettingsSectionProps = { defaultOpen: true };
// @ts-expect-error Section heading levels are limited to 2, 3, and 4.
const invalidSettingLevel: SettingsSectionProps = { title: "Time zone", headingLevel: 1 };
void [settingsLayout, settingsSection, setting, untitledSetting, invalidSettingLevel];

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
const inlineCopy: typeof GranularInlineCopyText = InlineCopyText;
const inlineCopyProps: InlineCopyTextProps = { value: "run_0842", size: "sm", truncate: true };
const inlineCopySlot: InstanceType<typeof InlineCopyText>["$slots"]["default"] = () => "Run 0842";
const navigationProps: NavigationMenuProps = { orientation: "vertical", size: "sm", defaultValue: "resources" };
// @ts-expect-error Navigation Menu panels always stay mounted.
const lazyNavigation: NavigationMenuProps = { lazyMount: true };
// @ts-expect-error Navigation Menu panels do not unmount on close.
const unmountedNavigation: NavigationMenuProps = { unmountOnExit: true };
// @ts-expect-error RootProvider does not expose lazy mounting.
type LazyProvider = NavigationMenuRootProviderProps["lazyMount"];
// @ts-expect-error RootProvider does not expose unmount-on-exit.
type UnmountedProvider = NavigationMenuRootProviderProps["unmountOnExit"];
// @ts-expect-error Generated Root props must also reject lazy mounting.
type LazyRootComponent = InstanceType<typeof NavigationMenu.Root>["$props"]["lazyMount"];
// @ts-expect-error Generated RootProvider props must also reject lazy mounting.
type LazyProviderComponent = InstanceType<typeof NavigationMenu.RootProvider>["$props"]["lazyMount"];

// @ts-expect-error A copy value is required, including when using custom display text.
const missingCopyValue: InlineCopyTextProps = {};
// @ts-expect-error Copy values must be strings.
const invalidCopyValue: InlineCopyTextProps = { value: 42 };
// @ts-expect-error Heading variants are not supported by an inline copy button.
const invalidCopyVariant: InlineCopyTextProps = { value: "run_0842", variant: "heading" };

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
void [inlineCopy, inlineCopyProps, inlineCopySlot, missingCopyValue, invalidCopyValue, invalidCopyVariant];
void [navigationProps, lazyNavigation, unmountedNavigation];
