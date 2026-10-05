import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { createComponentRegistry } from "../../scripts/component-registry/discovery.mjs";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const registry = createComponentRegistry({
  packageName: "@dicehub/kappa",
  packageRoot,
  packageVersion: "test",
});

const accordionComponentNames = [
  "Accordion",
  "AccordionContent",
  "AccordionIndicator",
  "AccordionItem",
  "AccordionRoot",
  "AccordionTrigger",
];
const activityFeedComponentNames = [
  "ActivityFeed",
  "ActivityFeedActions",
  "ActivityFeedContent",
  "ActivityFeedDescription",
  "ActivityFeedGroup",
  "ActivityFeedGroupLabel",
  "ActivityFeedHeader",
  "ActivityFeedItem",
  "ActivityFeedList",
  "ActivityFeedMarker",
  "ActivityFeedRoot",
  "ActivityFeedTime",
  "ActivityFeedTitle",
];
const aspectRatioComponentNames = ["AspectRatio"];

const attachmentComponentNames = [
  "Attachment",
  "AttachmentAction",
  "AttachmentActions",
  "AttachmentContent",
  "AttachmentDescription",
  "AttachmentGroup",
  "AttachmentMedia",
  "AttachmentRoot",
  "AttachmentTitle",
  "AttachmentTrigger",
];

const autocompleteComponentNames = [
  "Autocomplete",
  "AutocompleteContent",
  "AutocompleteEmpty",
  "AutocompleteGroup",
  "AutocompleteGroupLabel",
  "AutocompleteInputGroup",
  "AutocompleteItem",
  "AutocompleteItemIndicator",
  "AutocompleteItemText",
  "AutocompleteLabel",
  "AutocompleteList",
  "AutocompleteRoot",
  "AutocompleteSeparator",
];

const avatarComponentNames = [
  "Avatar",
  "AvatarBadge",
  "AvatarFallback",
  "AvatarGroup",
  "AvatarGroupCount",
  "AvatarImage",
  "AvatarRoot",
];

const bannerComponentNames = ["Banner", "BannerAction", "BannerRoot"];
const breadcrumbsComponentNames = [
  "Breadcrumbs",
  "BreadcrumbsCurrent",
  "BreadcrumbsEllipsis",
  "BreadcrumbsItem",
  "BreadcrumbsLink",
  "BreadcrumbsList",
  "BreadcrumbsPage",
  "BreadcrumbsRoot",
  "BreadcrumbsSeparator",
];
const buttonComponentNames = ["Button", "LinkButton"];
const buttonGroupComponentNames = [
  "ButtonGroup",
  "ButtonGroupRoot",
  "ButtonGroupSeparator",
  "ButtonGroupText",
];
const cardComponentNames = [
  "Card",
  "CardAction",
  "CardContent",
  "CardDescription",
  "CardFooter",
  "CardHeader",
  "CardPrimary",
  "CardRoot",
  "CardSecondary",
  "CardTitle",
];
const checkboxComponentNames = [
  "Checkbox",
  "CheckboxContext",
  "CheckboxControl",
  "CheckboxGroup",
  "CheckboxIndicator",
  "CheckboxLabel",
  "CheckboxRoot",
  "CheckboxRootProvider",
];
const chartComponentNames = ["Chart"];
const clientOnlyComponentNames = ["ClientOnly"];
const clipboardTextComponentNames = [
  "ClipboardText",
  "ClipboardTextContext",
  "ClipboardTextControl",
  "ClipboardTextIndicator",
  "ClipboardTextInput",
  "ClipboardTextLabel",
  "ClipboardTextRoot",
  "ClipboardTextRootProvider",
  "ClipboardTextTrigger",
  "ClipboardTextValueText",
];
const codeHighlightedComponentNames = ["CodeHighlighted", "CodeHighlightedRoot", "ShikiProvider"];
const collapsibleComponentNames = [
  "Collapsible",
  "CollapsibleContent",
  "CollapsibleContext",
  "CollapsibleIndicator",
  "CollapsibleRoot",
  "CollapsibleRootProvider",
  "CollapsibleTrigger",
];
const collapsibleSectionComponentNames = [
  "CollapsibleSection",
  "CollapsibleSectionActions",
  "CollapsibleSectionContent",
  "CollapsibleSectionHeader",
  "CollapsibleSectionIndicator",
  "CollapsibleSectionRoot",
  "CollapsibleSectionTrigger",
];
const colorPickerComponentNames = [
  "ColorPicker",
  "ColorPickerArea",
  "ColorPickerAreaBackground",
  "ColorPickerAreaThumb",
  "ColorPickerChannelInput",
  "ColorPickerChannelSlider",
  "ColorPickerChannelSliderLabel",
  "ColorPickerChannelSliderThumb",
  "ColorPickerChannelSliderTrack",
  "ColorPickerChannelSliderValueText",
  "ColorPickerContent",
  "ColorPickerContext",
  "ColorPickerControl",
  "ColorPickerEyeDropperTrigger",
  "ColorPickerFormatSelect",
  "ColorPickerFormatTrigger",
  "ColorPickerHiddenInput",
  "ColorPickerLabel",
  "ColorPickerRoot",
  "ColorPickerRootProvider",
  "ColorPickerSwatch",
  "ColorPickerSwatchGroup",
  "ColorPickerSwatchIndicator",
  "ColorPickerSwatchTrigger",
  "ColorPickerTransparencyGrid",
  "ColorPickerTrigger",
  "ColorPickerValueSwatch",
  "ColorPickerValueText",
  "ColorPickerView",
];
const comboboxComponentNames = [
  "Combobox",
  "ComboboxChip",
  "ComboboxClearTrigger",
  "ComboboxContent",
  "ComboboxContext",
  "ComboboxControl",
  "ComboboxEmpty",
  "ComboboxGroup",
  "ComboboxGroupLabel",
  "ComboboxInput",
  "ComboboxItem",
  "ComboboxItemIndicator",
  "ComboboxItemText",
  "ComboboxLabel",
  "ComboboxList",
  "ComboboxRoot",
  "ComboboxSeparator",
  "ComboboxTrigger",
  "ComboboxTriggerInput",
  "ComboboxTriggerMultipleWithInput",
  "ComboboxTriggerValue",
  "ComboboxValue",
];
const commandPaletteComponentNames = [
  "CommandPalette",
  "CommandPaletteDialog",
  "CommandPaletteEmpty",
  "CommandPaletteFooter",
  "CommandPaletteGroup",
  "CommandPaletteGroupLabel",
  "CommandPaletteHighlightedText",
  "CommandPaletteInput",
  "CommandPaletteItem",
  "CommandPaletteItems",
  "CommandPaletteList",
  "CommandPaletteLoading",
  "CommandPalettePanel",
  "CommandPaletteResultItem",
  "CommandPaletteResults",
  "CommandPaletteRoot",
];
const contextMenuComponentNames = [
  "ContextMenu",
  "ContextMenuArrow",
  "ContextMenuCheckboxItem",
  "ContextMenuContent",
  "ContextMenuContext",
  "ContextMenuGroup",
  "ContextMenuGroupLabel",
  "ContextMenuItem",
  "ContextMenuItemContext",
  "ContextMenuItemIndicator",
  "ContextMenuItemText",
  "ContextMenuLabel",
  "ContextMenuLinkItem",
  "ContextMenuRadioGroup",
  "ContextMenuRadioItem",
  "ContextMenuRadioItemIndicator",
  "ContextMenuRoot",
  "ContextMenuRootProvider",
  "ContextMenuSeparator",
  "ContextMenuShortcut",
  "ContextMenuSub",
  "ContextMenuSubContent",
  "ContextMenuSubTrigger",
  "ContextMenuTrigger",
];
const dataGridComponentNames = [
  "DataGrid",
  "DataGridColumnVisibility",
  "DataGridContext",
  "DataGridPagination",
  "DataGridRoot",
];
const datePickerComponentNames = [
  "DatePicker",
  "DatePickerCalendar",
  "DatePickerClearTrigger",
  "DatePickerContent",
  "DatePickerContext",
  "DatePickerControl",
  "DatePickerInput",
  "DatePickerLabel",
  "DatePickerMonthSelect",
  "DatePickerNextTrigger",
  "DatePickerPresetTrigger",
  "DatePickerPrevTrigger",
  "DatePickerRangeText",
  "DatePickerRoot",
  "DatePickerRootProvider",
  "DatePickerTable",
  "DatePickerTableBody",
  "DatePickerTableCell",
  "DatePickerTableCellTrigger",
  "DatePickerTableHead",
  "DatePickerTableHeader",
  "DatePickerTableRow",
  "DatePickerTrigger",
  "DatePickerValueText",
  "DatePickerView",
  "DatePickerViewControl",
  "DatePickerViewTrigger",
  "DatePickerWeekNumberCell",
  "DatePickerWeekNumberHeaderCell",
  "DatePickerYearSelect",
];
const dialogComponentNames = [
  "Dialog",
  "DialogBackdrop",
  "DialogClose",
  "DialogCloseTrigger",
  "DialogContent",
  "DialogContext",
  "DialogDescription",
  "DialogFooter",
  "DialogHeader",
  "DialogPositioner",
  "DialogRoot",
  "DialogRootProvider",
  "DialogTitle",
  "DialogTrigger",
];
const dialogLayoutComponentNames = [
  "DialogLayout",
  "DialogLayoutActions",
  "DialogLayoutActionsRoot",
  "DialogLayoutAlert",
  "DialogLayoutBody",
  "DialogLayoutClose",
  "DialogLayoutContent",
  "DialogLayoutDescription",
  "DialogLayoutHeader",
  "DialogLayoutPrimaryAction",
  "DialogLayoutRoot",
  "DialogLayoutTitle",
  "DialogLayoutTrigger",
];
const drawerComponentNames = [
  "Drawer",
  "DrawerBackdrop",
  "DrawerClose",
  "DrawerCloseTrigger",
  "DrawerContent",
  "DrawerContext",
  "DrawerDescription",
  "DrawerFooter",
  "DrawerGrabber",
  "DrawerGrabberIndicator",
  "DrawerHeader",
  "DrawerIndent",
  "DrawerIndentBackground",
  "DrawerPositioner",
  "DrawerRoot",
  "DrawerRootProvider",
  "DrawerStack",
  "DrawerSwipeArea",
  "DrawerTitle",
  "DrawerTrigger",
];
const dropdownComponentNames = [
  "Dropdown",
  "DropdownArrow",
  "DropdownCheckboxItem",
  "DropdownContent",
  "DropdownContext",
  "DropdownContextTrigger",
  "DropdownGroup",
  "DropdownGroupLabel",
  "DropdownIndicator",
  "DropdownItem",
  "DropdownItemContext",
  "DropdownItemIndicator",
  "DropdownItemText",
  "DropdownLabel",
  "DropdownLinkItem",
  "DropdownRadioGroup",
  "DropdownRadioItem",
  "DropdownRadioItemIndicator",
  "DropdownRoot",
  "DropdownRootProvider",
  "DropdownSeparator",
  "DropdownShortcut",
  "DropdownSub",
  "DropdownSubContent",
  "DropdownSubTrigger",
  "DropdownTrigger",
];
const editableComponentNames = [
  "Editable",
  "EditableArea",
  "EditableCancelTrigger",
  "EditableContext",
  "EditableControl",
  "EditableEditTrigger",
  "EditableInput",
  "EditableLabel",
  "EditablePreview",
  "EditableRoot",
  "EditableRootProvider",
  "EditableSubmitTrigger",
];
const emptyComponentNames = [
  "Empty",
  "EmptyContent",
  "EmptyDescription",
  "EmptyHeader",
  "EmptyMedia",
  "EmptyRoot",
  "EmptyTitle",
];
const expandableTextComponentNames = ["ExpandableText"];
const fieldComponentNames = [
  "Field",
  "FieldContext",
  "FieldErrorText",
  "FieldHelperText",
  "FieldInput",
  "FieldItem",
  "FieldLabel",
  "FieldRequiredIndicator",
  "FieldRoot",
  "FieldRootProvider",
  "FieldSelect",
  "FieldTextarea",
];
const fileUploadComponentNames = [
  "FileUpload",
  "FileUploadClearTrigger",
  "FileUploadContext",
  "FileUploadDropzone",
  "FileUploadHiddenInput",
  "FileUploadItem",
  "FileUploadItemDeleteTrigger",
  "FileUploadItemGroup",
  "FileUploadItemName",
  "FileUploadItemPreview",
  "FileUploadItemPreviewImage",
  "FileUploadItemSizeText",
  "FileUploadLabel",
  "FileUploadRoot",
  "FileUploadRootProvider",
  "FileUploadTrigger",
];
const fieldsetComponentNames = [
  "Fieldset",
  "FieldsetContext",
  "FieldsetErrorText",
  "FieldsetHelperText",
  "FieldsetLegend",
  "FieldsetRoot",
  "FieldsetRootProvider",
];
const floatingPanelComponentNames = [
  "FloatingPanel",
  "FloatingPanelBody",
  "FloatingPanelClose",
  "FloatingPanelCloseTrigger",
  "FloatingPanelContent",
  "FloatingPanelContext",
  "FloatingPanelControl",
  "FloatingPanelDragTrigger",
  "FloatingPanelHeader",
  "FloatingPanelPositioner",
  "FloatingPanelResizeTrigger",
  "FloatingPanelRoot",
  "FloatingPanelRootProvider",
  "FloatingPanelStageTrigger",
  "FloatingPanelTitle",
  "FloatingPanelTrigger",
];
const flowComponentNames = [
  "Flow",
  "FlowAnchor",
  "FlowList",
  "FlowNode",
  "FlowParallel",
  "FlowRoot",
];
const formatComponentNames = [
  "Format",
  "FormatByte",
  "FormatNumber",
  "FormatRelativeTime",
  "FormatRoot",
  "FormatTime",
];
const gridComponentNames = ["Grid", "GridItem", "GridRoot"];
const highlightComponentNames = ["Highlight"];
const hoverCardComponentNames = [
  "HoverCard",
  "HoverCardArrow",
  "HoverCardArrowTip",
  "HoverCardContent",
  "HoverCardContext",
  "HoverCardPositioner",
  "HoverCardRoot",
  "HoverCardRootProvider",
  "HoverCardTrigger",
];
const inlineCopyTextComponentNames = ["InlineCopyText"];
const inputComponentNames = ["Input"];
const inputAreaComponentNames = ["InputArea"];
const inputGroupComponentNames = [
  "InputGroup",
  "InputGroupAddon",
  "InputGroupButton",
  "InputGroupInput",
  "InputGroupRoot",
  "InputGroupText",
  "InputGroupTextarea",
];
const inputOtpComponentNames = [
  "InputOtp",
  "InputOtpContext",
  "InputOtpControl",
  "InputOtpHiddenInput",
  "InputOtpInput",
  "InputOtpLabel",
  "InputOtpRoot",
  "InputOtpRootProvider",
];
const itemComponentNames = [
  "Item",
  "ItemActions",
  "ItemContent",
  "ItemDescription",
  "ItemFooter",
  "ItemGroup",
  "ItemHeader",
  "ItemMedia",
  "ItemRoot",
  "ItemSeparator",
  "ItemTitle",
];
const kbdComponentNames = ["Kbd", "KbdGroup"];
const labelComponentNames = ["Label"];
const layerCardComponentNames = [
  "LayerCard",
  "LayerCardPrimary",
  "LayerCardRoot",
  "LayerCardSecondary",
];
const linkComponentNames = ["Link", "LinkExternalIcon", "LinkRoot"];
const loaderComponentNames = ["Loader"];
const mapViewComponentNames = ["MapView"];
const matrixLoaderComponentNames = ["MatrixLoader"];
const menuBarComponentNames = [
  "MenuBar",
  "MenuBarContent",
  "MenuBarMenu",
  "MenuBarRoot",
  "MenuBarSubTrigger",
  "MenuBarTrigger",
];
const meterComponentNames = ["Meter"];
const nativeSelectComponentNames = [
  "NativeSelect",
  "NativeSelectOptGroup",
  "NativeSelectOption",
  "NativeSelectRoot",
];
const navigationMenuComponentNames = [
  "NavigationMenu",
  "NavigationMenuArrow",
  "NavigationMenuContent",
  "NavigationMenuContext",
  "NavigationMenuIndicator",
  "NavigationMenuItem",
  "NavigationMenuItemIndicator",
  "NavigationMenuLink",
  "NavigationMenuList",
  "NavigationMenuRoot",
  "NavigationMenuRootProvider",
  "NavigationMenuTrigger",
  "NavigationMenuViewport",
  "NavigationMenuViewportPositioner",
];
const paginationComponentNames = [
  "Pagination",
  "PaginationContext",
  "PaginationControls",
  "PaginationEllipsis",
  "PaginationFirstTrigger",
  "PaginationItem",
  "PaginationLastTrigger",
  "PaginationNextTrigger",
  "PaginationPrevTrigger",
  "PaginationRoot",
  "PaginationRootProvider",
];
const progressComponentNames = [
  "Progress",
  "ProgressContext",
  "ProgressLabel",
  "ProgressRange",
  "ProgressRoot",
  "ProgressRootProvider",
  "ProgressTrack",
  "ProgressValueText",
  "ProgressView",
];
const progressCircleComponentNames = [
  "ProgressCircle",
  "ProgressCircleContext",
  "ProgressCircleGraphic",
  "ProgressCircleLabel",
  "ProgressCircleRange",
  "ProgressCircleRoot",
  "ProgressCircleRootProvider",
  "ProgressCircleTrack",
  "ProgressCircleValueText",
  "ProgressCircleView",
];
const radioComponentNames = [
  "Radio",
  "RadioContext",
  "RadioIndicator",
  "RadioItem",
  "RadioItemContext",
  "RadioItemControl",
  "RadioItemText",
  "RadioLabel",
  "RadioRoot",
  "RadioRootProvider",
];
const ratingComponentNames = [
  "Rating",
  "RatingContext",
  "RatingControl",
  "RatingItem",
  "RatingItemContext",
  "RatingLabel",
  "RatingRoot",
  "RatingRootProvider",
];
const resizableComponentNames = [
  "Resizable",
  "ResizableContext",
  "ResizableHandle",
  "ResizablePanel",
  "ResizableResizeTrigger",
  "ResizableResizeTriggerIndicator",
  "ResizableRoot",
  "ResizableRootProvider",
];
const scrollAreaComponentNames = [
  "ScrollArea",
  "ScrollAreaContent",
  "ScrollAreaContext",
  "ScrollAreaCorner",
  "ScrollAreaRoot",
  "ScrollAreaRootProvider",
  "ScrollAreaScrollbar",
  "ScrollAreaThumb",
  "ScrollAreaViewport",
];
const selectComponentNames = [
  "Select",
  "SelectClearTrigger",
  "SelectContent",
  "SelectContext",
  "SelectControl",
  "SelectGroup",
  "SelectGroupLabel",
  "SelectHiddenSelect",
  "SelectIndicator",
  "SelectItem",
  "SelectItemContext",
  "SelectItemIndicator",
  "SelectItemText",
  "SelectLabel",
  "SelectList",
  "SelectOption",
  "SelectPositioner",
  "SelectRoot",
  "SelectRootProvider",
  "SelectSeparator",
  "SelectTrigger",
  "SelectValueText",
];
const selectionListComponentNames = [
  "SelectionList",
  "SelectionListContent",
  "SelectionListContext",
  "SelectionListEmpty",
  "SelectionListInput",
  "SelectionListItem",
  "SelectionListItemContent",
  "SelectionListItemContext",
  "SelectionListItemDescription",
  "SelectionListItemGroup",
  "SelectionListItemGroupLabel",
  "SelectionListItemIndicator",
  "SelectionListItemMedia",
  "SelectionListItemMeta",
  "SelectionListItemText",
  "SelectionListLabel",
  "SelectionListRoot",
  "SelectionListRootProvider",
  "SelectionListValueText",
];
const sensitiveInputComponentNames = ["SensitiveInput"];
const separatorComponentNames = ["Separator"];
const sidebarComponentNames = [
  "Sidebar", "SidebarClose", "SidebarCollapsible", "SidebarCollapsibleContent",
  "SidebarCollapsibleTrigger", "SidebarContent", "SidebarContext", "SidebarFooter",
  "SidebarGroup", "SidebarGroupLabel", "SidebarHeader", "SidebarLoading", "SidebarMenu",
  "SidebarMenuBadge", "SidebarMenuButton", "SidebarMenuChevron", "SidebarMenuItem",
  "SidebarMenuLabel", "SidebarMenuSub", "SidebarMenuSubItem", "SidebarProvider",
  "SidebarResizeHandle", "SidebarRoot", "SidebarSeparator", "SidebarSlidingView", "SidebarSlidingViews", "SidebarTrigger",
];
const skeletonLineComponentNames = ["SkeletonLine"];
const sliderComponentNames = [
  "Slider",
  "SliderContext",
  "SliderControl",
  "SliderDraggingIndicator",
  "SliderHiddenInput",
  "SliderLabel",
  "SliderMarker",
  "SliderMarkerGroup",
  "SliderRange",
  "SliderRoot",
  "SliderRootProvider",
  "SliderThumb",
  "SliderTrack",
  "SliderValueText",
];
const stepsComponentNames = [
  "Steps",
  "StepsCompletedContent",
  "StepsContent",
  "StepsContext",
  "StepsIndicator",
  "StepsItem",
  "StepsItemContext",
  "StepsList",
  "StepsNextTrigger",
  "StepsPrevTrigger",
  "StepsProgress",
  "StepsRoot",
  "StepsRootProvider",
  "StepsSeparator",
  "StepsTrigger",
];
const switchComponentNames = [
  "Switch",
  "SwitchContext",
  "SwitchControl",
  "SwitchLabel",
  "SwitchRoot",
  "SwitchRootProvider",
  "SwitchThumb",
];
const tableComponentNames = [
  "Table",
  "TableBody",
  "TableCaption",
  "TableCell",
  "TableCheckCell",
  "TableCheckHead",
  "TableFooter",
  "TableHead",
  "TableHeader",
  "TableResizeHandle",
  "TableRoot",
  "TableRow",
];
const tableOfContentsComponentNames = [
  "TableOfContents",
  "TableOfContentsContent",
  "TableOfContentsContext",
  "TableOfContentsIndicator",
  "TableOfContentsItem",
  "TableOfContentsLink",
  "TableOfContentsList",
  "TableOfContentsNav",
  "TableOfContentsRoot",
  "TableOfContentsRootProvider",
  "TableOfContentsTitle",
];
const tabsComponentNames = [
  "Tabs",
  "TabsContent",
  "TabsContext",
  "TabsIndicator",
  "TabsList",
  "TabsRoot",
  "TabsRootProvider",
  "TabsTrigger",
];
const tagInputComponentNames = [
  "TagInput",
  "TagInputClearTrigger",
  "TagInputContext",
  "TagInputControl",
  "TagInputHiddenInput",
  "TagInputInput",
  "TagInputItem",
  "TagInputItemContext",
  "TagInputItemDeleteTrigger",
  "TagInputItemInput",
  "TagInputItemPreview",
  "TagInputItemText",
  "TagInputLabel",
  "TagInputRoot",
  "TagInputRootProvider",
];
const textComponentNames = ["Text"];
const toggleComponentNames = ["Toggle"];
const toggleGroupComponentNames = [
  "ToggleGroup",
  "ToggleGroupContext",
  "ToggleGroupItem",
  "ToggleGroupRoot",
  "ToggleGroupRootProvider",
];
const toolbarComponentNames = [
  "Toolbar",
  "ToolbarButton",
  "ToolbarInput",
  "ToolbarInputGroup",
  "ToolbarLink",
  "ToolbarRoot",
  "ToolbarSeparator",
];
const tooltipComponentNames = [
  "Tooltip",
  "TooltipArrow",
  "TooltipArrowTip",
  "TooltipContent",
  "TooltipContext",
  "TooltipRoot",
  "TooltipRootProvider",
  "TooltipTrigger",
];

const treeViewComponentNames = [
  "TreeView",
  "TreeViewBranch",
  "TreeViewBranchContent",
  "TreeViewBranchControl",
  "TreeViewBranchIndentGuide",
  "TreeViewBranchIndicator",
  "TreeViewBranchText",
  "TreeViewBranchTrigger",
  "TreeViewContext",
  "TreeViewItem",
  "TreeViewItemIndicator",
  "TreeViewItemText",
  "TreeViewLabel",
  "TreeViewNodeCheckbox",
  "TreeViewNodeCheckboxIndicator",
  "TreeViewNodeContext",
  "TreeViewNodeProvider",
  "TreeViewNodeRenameInput",
  "TreeViewRoot",
  "TreeViewRootProvider",
  "TreeViewTree",
];
const virtualTreeComponentNames = ["VirtualTree"];
const xyPlotComponentNames = ["XYPlot"];
const timeseriesChartComponentNames = ["TimeseriesChart"];

const timerComponentNames = [
  "Timer",
  "TimerActionTrigger",
  "TimerArea",
  "TimerContext",
  "TimerControl",
  "TimerItem",
  "TimerRoot",
  "TimerRootProvider",
  "TimerSeparator",
];

const toastComponentNames = [
  "Toast", "ToastActionTrigger", "ToastCloseTrigger", "ToastContext", "ToastDescription",
  "Toaster", "ToastIndicator", "ToastRoot", "ToastTitle",
];
const numberInputComponentNames = [
  "NumberInput",
  "NumberInputContext",
  "NumberInputControl",
  "NumberInputDecrementTrigger",
  "NumberInputIncrementTrigger",
  "NumberInputInput",
  "NumberInputLabel",
  "NumberInputRoot",
  "NumberInputRootProvider",
  "NumberInputScrubbableInput",
  "NumberInputScrubber",
  "NumberInputUnit",
  "NumberInputValueText",
];
const popoverComponentNames = [
  "Popover",
  "PopoverAnchor",
  "PopoverArrow",
  "PopoverArrowTip",
  "PopoverClose",
  "PopoverCloseTrigger",
  "PopoverContent",
  "PopoverContext",
  "PopoverDescription",
  "PopoverIndicator",
  "PopoverPositioner",
  "PopoverRoot",
  "PopoverRootProvider",
  "PopoverTitle",
  "PopoverTrigger",
];
const presenceComponentNames = ["Presence"];
const qrCodeComponentNames = [
  "QrCode",
  "QrCodeContext",
  "QrCodeDownloadTrigger",
  "QrCodeFrame",
  "QrCodeOverlay",
  "QrCodePattern",
  "QrCodeRoot",
  "QrCodeRootProvider",
];
const componentNames = [
  ...accordionComponentNames,
  ...activityFeedComponentNames,
  ...aspectRatioComponentNames,
  ...attachmentComponentNames,
  ...autocompleteComponentNames,
  ...avatarComponentNames,
  "Badge",
  ...bannerComponentNames,
  ...breadcrumbsComponentNames,
  "Button",
  ...buttonGroupComponentNames,
  ...cardComponentNames,
  ...checkboxComponentNames,
  ...chartComponentNames,
  ...clientOnlyComponentNames,
  ...clipboardTextComponentNames,
  "CodeHighlighted",
  "CodeHighlightedRoot",
  ...collapsibleComponentNames,
  ...collapsibleSectionComponentNames,
  ...colorPickerComponentNames,
  ...comboboxComponentNames,
  ...commandPaletteComponentNames,
  ...contextMenuComponentNames,
  ...dataGridComponentNames,
  ...datePickerComponentNames,
  ...dialogComponentNames,
  ...dialogLayoutComponentNames,
  "DiffViewer",
  "DiffViewerRoot",
  "DicehubLogo",
  "DirectionProvider",
  "DownloadTrigger",
  ...drawerComponentNames,
  ...dropdownComponentNames,
  ...editableComponentNames,
  ...emptyComponentNames,
  ...expandableTextComponentNames,
  ...fieldComponentNames.slice(0, -1),
  ...fieldsetComponentNames,
  "FieldTextarea",
  ...fileUploadComponentNames,
  ...floatingPanelComponentNames,
  ...flowComponentNames,
  ...formatComponentNames,
  ...gridComponentNames,
  ...highlightComponentNames,
  ...hoverCardComponentNames,
  ...inlineCopyTextComponentNames,
  ...inputComponentNames,
  ...inputAreaComponentNames,
  ...inputGroupComponentNames,
  ...inputOtpComponentNames,
  ...itemComponentNames,
  ...kbdComponentNames,
  ...labelComponentNames,
  ...layerCardComponentNames,
  "Link",
  "LinkButton",
  "LinkExternalIcon",
  "LinkRoot",
  ...loaderComponentNames,
  ...mapViewComponentNames,
  ...matrixLoaderComponentNames,
  ...menuBarComponentNames,
  ...meterComponentNames,
  ...nativeSelectComponentNames,
  ...navigationMenuComponentNames,
  ...numberInputComponentNames,
  ...paginationComponentNames,
  ...popoverComponentNames,
  "PoweredByDicehub",
  ...presenceComponentNames,
  "Progress",
  ...progressCircleComponentNames,
  ...progressComponentNames.slice(1),
  ...qrCodeComponentNames,
  ...radioComponentNames,
  ...ratingComponentNames,
  ...resizableComponentNames,
  ...scrollAreaComponentNames,
  ...selectComponentNames,
  ...selectionListComponentNames,
  ...sensitiveInputComponentNames,
  ...separatorComponentNames,
  "ShikiProvider",
  ...sidebarComponentNames,
  ...skeletonLineComponentNames,
  ...sliderComponentNames,
  ...stepsComponentNames,
  ...switchComponentNames,
  ...tableComponentNames.slice(0, 9),
  ...tableOfContentsComponentNames,
  ...tableComponentNames.slice(9),
  ...tabsComponentNames,
  ...tagInputComponentNames,
  ...textComponentNames,
  ...timerComponentNames,
  ...timeseriesChartComponentNames,
  ...toastComponentNames,
  ...toggleComponentNames,
  ...toggleGroupComponentNames,
  ...toolbarComponentNames,
  ...treeViewComponentNames,
  ...tooltipComponentNames,
  ...virtualTreeComponentNames,
  ...xyPlotComponentNames,
].sort((left, right) => left.localeCompare(right));

test("discovers the public attachment compound component", () => {
  assert.deepEqual(registry.components.Attachment, {
    name: "Attachment",
    type: "component",
    group: "attachment",
    importPath: "@dicehub/kappa/components/attachment",
    sourceFile: "components/attachment/Attachment.vue",
    description: "Attachment component exported by the Attachment module.",
    parts: [
      "Root",
      "Media",
      "Content",
      "Title",
      "Description",
      "Actions",
      "Action",
      "Trigger",
      "Group",
    ],
  });
  assert.deepEqual(registry.components.AttachmentTrigger, {
    name: "AttachmentTrigger",
    type: "component",
    group: "attachment",
    importPath: "@dicehub/kappa/components/attachment",
    sourceFile: "components/attachment/AttachmentTrigger.vue",
    description: "AttachmentTrigger component exported by the Attachment module.",
  });
});

test("discovers the public floating panel compound component", () => {
  assert.deepEqual(registry.components.FloatingPanel, {
    name: "FloatingPanel",
    type: "component",
    group: "floating-panel",
    importPath: "@dicehub/kappa/components/floating-panel",
    sourceFile: "components/floating-panel/FloatingPanel.vue",
    description: "FloatingPanel component exported by the Floating Panel module.",
    parts: [
      "Root",
      "RootProvider",
      "Trigger",
      "Positioner",
      "Content",
      "DragTrigger",
      "Header",
      "Title",
      "Control",
      "StageTrigger",
      "Close",
      "CloseTrigger",
      "Body",
      "ResizeTrigger",
      "Context",
    ],
  });
});

test("discovers the public accordion compound component", () => {
  assert.deepEqual(registry.components.Accordion, {
    name: "Accordion",
    type: "component",
    group: "accordion",
    importPath: "@dicehub/kappa/components/accordion",
    sourceFile: "components/accordion/Accordion.vue",
    description: "Accordion component exported by the Accordion module.",
    parts: ["Root", "Item", "Trigger", "Content", "Indicator"],
  });
  assert.deepEqual(registry.components.AccordionTrigger, {
    name: "AccordionTrigger",
    type: "component",
    group: "accordion",
    importPath: "@dicehub/kappa/components/accordion",
    sourceFile: "components/accordion/AccordionTrigger.vue",
    description: "AccordionTrigger component exported by the Accordion module.",
  });
});

test("discovers the public autocomplete compound component", () => {
  assert.deepEqual(registry.components.Autocomplete, {
    name: "Autocomplete",
    type: "component",
    group: "autocomplete",
    importPath: "@dicehub/kappa/components/autocomplete",
    sourceFile: "components/autocomplete/Autocomplete.vue",
    description: "Autocomplete component exported by the Autocomplete module.",
    parts: [
      "Content",
      "Empty",
      "Group",
      "GroupLabel",
      "InputGroup",
      "Item",
      "ItemIndicator",
      "ItemText",
      "Label",
      "List",
      "Root",
      "Separator",
    ],
  });
  assert.deepEqual(registry.components.AutocompleteRoot, {
    name: "AutocompleteRoot",
    type: "component",
    group: "autocomplete",
    importPath: "@dicehub/kappa/components/autocomplete",
    sourceFile: "components/autocomplete/Autocomplete.vue",
    description: "AutocompleteRoot component exported by the Autocomplete module.",
  });
});

test("discovers the public badge component", () => {
  assert.deepEqual(registry.components.Badge, {
    name: "Badge",
    type: "component",
    group: "badge",
    importPath: "@dicehub/kappa/components/badge",
    sourceFile: "components/badge/Badge.vue",
    description: "Badge component exported by the Badge module.",
  });
});

test("discovers the isolated chart components", () => {
  assert.deepEqual(registry.components.Chart, {
    name: "Chart",
    type: "component",
    group: "chart",
    importPath: "@dicehub/kappa/components/chart",
    sourceFile: "components/chart/Chart.vue",
    description: "Chart component exported by the Chart module.",
  });
  assert.deepEqual(registry.components.XYPlot, {
    name: "XYPlot",
    type: "component",
    group: "xy-plot",
    importPath: "@dicehub/kappa/components/xy-plot",
    sourceFile: "components/xy-plot/XYPlot.vue",
    description: "XYPlot component exported by the Xy Plot module.",
  });
  assert.deepEqual(registry.components.TimeseriesChart, {
    name: "TimeseriesChart",
    type: "component",
    group: "timeseries-chart",
    importPath: "@dicehub/kappa/components/timeseries-chart",
    sourceFile: "components/timeseries-chart/TimeseriesChart.vue",
    description: "TimeseriesChart component exported by the Timeseries Chart module.",
  });
});

test("discovers the public avatar compound component", () => {
  assert.deepEqual(registry.components.Avatar, {
    name: "Avatar",
    type: "component",
    group: "avatar",
    importPath: "@dicehub/kappa/components/avatar",
    sourceFile: "components/avatar/Avatar.vue",
    description: "Avatar component exported by the Avatar module.",
    parts: ["Root", "Image", "Fallback", "Badge", "Group", "GroupCount"],
  });
  assert.deepEqual(registry.components.AvatarImage, {
    name: "AvatarImage",
    type: "component",
    group: "avatar",
    importPath: "@dicehub/kappa/components/avatar",
    sourceFile: "components/avatar/AvatarImage.vue",
    description: "AvatarImage component exported by the Avatar module.",
  });
});

test("discovers the public banner compound component", () => {
  assert.deepEqual(registry.components.Banner, {
    name: "Banner",
    type: "component",
    group: "banner",
    importPath: "@dicehub/kappa/components/banner",
    sourceFile: "components/banner/Banner.vue",
    description: "Banner component exported by the Banner module.",
    parts: ["Action"],
  });
  assert.deepEqual(registry.components.BannerAction, {
    name: "BannerAction",
    type: "component",
    group: "banner",
    importPath: "@dicehub/kappa/components/banner",
    sourceFile: "components/banner/BannerAction.vue",
    description: "BannerAction component exported by the Banner module.",
  });
  assert.deepEqual(registry.components.BannerRoot, {
    name: "BannerRoot",
    type: "component",
    group: "banner",
    importPath: "@dicehub/kappa/components/banner",
    sourceFile: "components/banner/Banner.vue",
    description: "BannerRoot component exported by the Banner module.",
  });
});

test("discovers the public breadcrumbs compound component", () => {
  assert.deepEqual(registry.components.Breadcrumbs, {
    name: "Breadcrumbs",
    type: "component",
    group: "breadcrumbs",
    importPath: "@dicehub/kappa/components/breadcrumbs",
    sourceFile: "components/breadcrumbs/Breadcrumbs.vue",
    description: "Breadcrumbs component exported by the Breadcrumbs module.",
    parts: ["Root", "List", "Item", "Link", "Page", "Current", "Separator", "Ellipsis"],
  });
  assert.deepEqual(registry.components.BreadcrumbsPage, {
    name: "BreadcrumbsPage",
    type: "component",
    group: "breadcrumbs",
    importPath: "@dicehub/kappa/components/breadcrumbs",
    sourceFile: "components/breadcrumbs/BreadcrumbsPage.vue",
    description: "BreadcrumbsPage component exported by the Breadcrumbs module.",
  });
  assert.deepEqual(registry.components.BreadcrumbsCurrent, {
    name: "BreadcrumbsCurrent",
    type: "component",
    group: "breadcrumbs",
    importPath: "@dicehub/kappa/components/breadcrumbs",
    sourceFile: "components/breadcrumbs/BreadcrumbsPage.vue",
    description: "BreadcrumbsCurrent component exported by the Breadcrumbs module.",
  });
});

test("discovers the public button components", () => {
  assert.deepEqual(registry.components.Button, {
    name: "Button",
    type: "component",
    group: "button",
    importPath: "@dicehub/kappa/components/button",
    sourceFile: "components/button/Button.vue",
    description: "Button component exported by the Button module.",
  });
  assert.deepEqual(registry.components.LinkButton, {
    name: "LinkButton",
    type: "component",
    group: "button",
    importPath: "@dicehub/kappa/components/button",
    sourceFile: "components/button/LinkButton.vue",
    description: "LinkButton component exported by the Button module.",
  });
});

test("discovers the public button group compound component", () => {
  assert.deepEqual(registry.components.ButtonGroup, {
    name: "ButtonGroup",
    type: "component",
    group: "button-group",
    importPath: "@dicehub/kappa/components/button-group",
    sourceFile: "components/button-group/ButtonGroup.vue",
    description: "ButtonGroup component exported by the Button Group module.",
    parts: ["Root", "Separator", "Text"],
  });
  assert.deepEqual(registry.components.ButtonGroupSeparator, {
    name: "ButtonGroupSeparator",
    type: "component",
    group: "button-group",
    importPath: "@dicehub/kappa/components/button-group",
    sourceFile: "components/button-group/ButtonGroupSeparator.vue",
    description:
      "ButtonGroupSeparator component exported by the Button Group module.",
  });
});

test("discovers the public checkbox compound component", () => {
  assert.deepEqual(registry.components.Checkbox, {
    name: "Checkbox",
    type: "component",
    group: "checkbox",
    importPath: "@dicehub/kappa/components/checkbox",
    sourceFile: "components/checkbox/Checkbox.vue",
    description: "Checkbox component exported by the Checkbox module.",
    parts: [
      "Root",
      "RootProvider",
      "Group",
      "Control",
      "Indicator",
      "Label",
      "Context",
    ],
  });
  assert.deepEqual(registry.components.CheckboxGroup, {
    name: "CheckboxGroup",
    type: "component",
    group: "checkbox",
    importPath: "@dicehub/kappa/components/checkbox",
    sourceFile: "components/checkbox/CheckboxGroup.vue",
    description: "CheckboxGroup component exported by the Checkbox module.",
  });
});

test("discovers the public clipboard text compound component", () => {
  assert.deepEqual(registry.components.ClipboardText, {
    name: "ClipboardText",
    type: "component",
    group: "clipboard-text",
    importPath: "@dicehub/kappa/components/clipboard-text",
    sourceFile: "components/clipboard-text/ClipboardText.vue",
    description: "ClipboardText component exported by the Clipboard Text module.",
    parts: [
      "Root",
      "RootProvider",
      "Label",
      "Control",
      "Input",
      "Trigger",
      "Indicator",
      "ValueText",
      "Context",
    ],
  });
  assert.deepEqual(registry.components.ClipboardTextTrigger, {
    name: "ClipboardTextTrigger",
    type: "component",
    group: "clipboard-text",
    importPath: "@dicehub/kappa/components/clipboard-text",
    sourceFile: "components/clipboard-text/ClipboardTextTrigger.vue",
    description: "ClipboardTextTrigger component exported by the Clipboard Text module.",
  });
});

test("discovers the public code highlighted component and provider", () => {
  assert.deepEqual(registry.components.CodeHighlighted, {
    name: "CodeHighlighted",
    type: "component",
    group: "code-highlighted",
    importPath: "@dicehub/kappa/components/code-highlighted",
    sourceFile: "components/code-highlighted/CodeHighlighted.vue",
    description: "CodeHighlighted component exported by the Code Highlighted module.",
    parts: ["Root", "Provider"],
  });
  assert.deepEqual(registry.components.ShikiProvider, {
    name: "ShikiProvider",
    type: "component",
    group: "code-highlighted",
    importPath: "@dicehub/kappa/components/code-highlighted",
    sourceFile: "components/code-highlighted/ShikiProvider.vue",
    description: "ShikiProvider component exported by the Code Highlighted module.",
  });
});

test("discovers the public collapsible compound component", () => {
  assert.deepEqual(registry.components.Collapsible, {
    name: "Collapsible",
    type: "component",
    group: "collapsible",
    importPath: "@dicehub/kappa/components/collapsible",
    sourceFile: "components/collapsible/Collapsible.vue",
    description: "Collapsible component exported by the Collapsible module.",
    parts: ["Root", "RootProvider", "Trigger", "Content", "Indicator", "Context"],
  });
  assert.deepEqual(registry.components.CollapsibleTrigger, {
    name: "CollapsibleTrigger",
    type: "component",
    group: "collapsible",
    importPath: "@dicehub/kappa/components/collapsible",
    sourceFile: "components/collapsible/CollapsibleTrigger.vue",
    description: "CollapsibleTrigger component exported by the Collapsible module.",
  });
});

test("discovers the public collapsible section compound component", () => {
  assert.deepEqual(registry.components.CollapsibleSection, {
    name: "CollapsibleSection",
    type: "component",
    group: "collapsible-section",
    importPath: "@dicehub/kappa/components/collapsible-section",
    sourceFile: "components/collapsible-section/CollapsibleSection.vue",
    description: "CollapsibleSection component exported by the Collapsible Section module.",
    parts: ["Root", "Header", "Trigger", "Indicator", "Actions", "Content"],
  });
  assert.deepEqual(registry.components.CollapsibleSectionActions, {
    name: "CollapsibleSectionActions",
    type: "component",
    group: "collapsible-section",
    importPath: "@dicehub/kappa/components/collapsible-section",
    sourceFile: "components/collapsible-section/CollapsibleSectionActions.vue",
    description:
      "CollapsibleSectionActions component exported by the Collapsible Section module.",
  });
});

test("discovers the public combobox compound component", () => {
  assert.deepEqual(registry.components.Combobox, {
    name: "Combobox",
    type: "component",
    group: "combobox",
    importPath: "@dicehub/kappa/components/combobox",
    sourceFile: "components/combobox/Combobox.vue",
    description: "Combobox component exported by the Combobox module.",
    parts: [
      "Root",
      "Chip",
      "ClearTrigger",
      "Content",
      "Context",
      "Control",
      "Empty",
      "Group",
      "GroupLabel",
      "Input",
      "Item",
      "ItemIndicator",
      "ItemText",
      "Label",
      "List",
      "Separator",
      "Trigger",
      "TriggerInput",
      "TriggerMultipleWithInput",
      "TriggerValue",
      "Value",
    ],
  });
  assert.deepEqual(registry.components.ComboboxTriggerValue, {
    name: "ComboboxTriggerValue",
    type: "component",
    group: "combobox",
    importPath: "@dicehub/kappa/components/combobox",
    sourceFile: "components/combobox/ComboboxTriggerValue.vue",
    description: "ComboboxTriggerValue component exported by the Combobox module.",
  });
});

test("discovers the public command palette compound component", () => {
  assert.deepEqual(registry.components.CommandPalette, {
    name: "CommandPalette",
    type: "component",
    group: "command-palette",
    importPath: "@dicehub/kappa/components/command-palette",
    sourceFile: "components/command-palette/CommandPaletteRoot.vue",
    description: "CommandPalette component exported by the Command Palette module.",
    parts: [
      "Dialog",
      "Empty",
      "Footer",
      "Group",
      "GroupLabel",
      "HighlightedText",
      "Input",
      "Item",
      "Items",
      "List",
      "Loading",
      "Panel",
      "ResultItem",
      "Results",
      "Root",
    ],
  });
  assert.deepEqual(registry.components.CommandPaletteInput, {
    name: "CommandPaletteInput",
    type: "component",
    group: "command-palette",
    importPath: "@dicehub/kappa/components/command-palette",
    sourceFile: "components/command-palette/CommandPaletteInput.vue",
    description: "CommandPaletteInput component exported by the Command Palette module.",
  });
});

test("discovers the public date picker compound component", () => {
  assert.deepEqual(registry.components.DatePicker, {
    name: "DatePicker",
    type: "component",
    group: "date-picker",
    importPath: "@dicehub/kappa/components/date-picker",
    sourceFile: "components/date-picker/DatePicker.vue",
    description: "DatePicker component exported by the Date Picker module.",
    parts: [
      "Root",
      "RootProvider",
      "Label",
      "Control",
      "Input",
      "Trigger",
      "ClearTrigger",
      "Content",
      "Calendar",
      "View",
      "ViewControl",
      "ViewTrigger",
      "PrevTrigger",
      "NextTrigger",
      "Table",
      "TableHead",
      "TableHeader",
      "TableBody",
      "TableRow",
      "TableCell",
      "TableCellTrigger",
      "WeekNumberCell",
      "WeekNumberHeaderCell",
      "ValueText",
      "RangeText",
      "PresetTrigger",
      "MonthSelect",
      "YearSelect",
      "Context",
    ],
  });
  assert.deepEqual(registry.components.DatePickerCalendar, {
    name: "DatePickerCalendar",
    type: "component",
    group: "date-picker",
    importPath: "@dicehub/kappa/components/date-picker",
    sourceFile: "components/date-picker/DatePickerCalendar.vue",
    description: "DatePickerCalendar component exported by the Date Picker module.",
  });
});

test("discovers the public dialog compound component", () => {
  assert.deepEqual(registry.components.Dialog, {
    name: "Dialog",
    type: "component",
    group: "dialog",
    importPath: "@dicehub/kappa/components/dialog",
    sourceFile: "components/dialog/Dialog.vue",
    description: "Dialog component exported by the Dialog module.",
    parts: [
      "Root",
      "RootProvider",
      "Trigger",
      "Backdrop",
      "Positioner",
      "Content",
      "Header",
      "Title",
      "Description",
      "Footer",
      "Close",
      "CloseTrigger",
      "Context",
    ],
  });
  assert.deepEqual(registry.components.DialogContent, {
    name: "DialogContent",
    type: "component",
    group: "dialog",
    importPath: "@dicehub/kappa/components/dialog",
    sourceFile: "components/dialog/DialogContent.vue",
    description: "DialogContent component exported by the Dialog module.",
  });
});

test("discovers the public dialog layout compound component", () => {
  assert.deepEqual(registry.components.DialogLayout, {
    name: "DialogLayout",
    type: "component",
    group: "dialog-layout",
    importPath: "@dicehub/kappa/components/dialog-layout",
    sourceFile: "components/dialog/Dialog.vue",
    description: "DialogLayout component exported by the Dialog Layout module.",
    parts: [
      "Root",
      "Alert",
      "Trigger",
      "Content",
      "Header",
      "Title",
      "Description",
      "Body",
      "Actions",
      "PrimaryAction",
      "Close",
    ],
  });
  assert.deepEqual(registry.components.DialogLayoutActions, {
    name: "DialogLayoutActions",
    type: "component",
    group: "dialog-layout",
    importPath: "@dicehub/kappa/components/dialog-layout",
    sourceFile: "components/dialog-layout/DialogLayoutActions.vue",
    description: "DialogLayoutActions component exported by the Dialog Layout module.",
    parts: ["Primary"],
  });
});

test("discovers the public drawer compound component", () => {
  assert.deepEqual(registry.components.Drawer, {
    name: "Drawer",
    type: "component",
    group: "drawer",
    importPath: "@dicehub/kappa/components/drawer",
    sourceFile: "components/drawer/Drawer.vue",
    description: "Drawer component exported by the Drawer module.",
    parts: [
      "Root",
      "RootProvider",
      "Stack",
      "Trigger",
      "SwipeArea",
      "Backdrop",
      "Positioner",
      "Content",
      "Grabber",
      "GrabberIndicator",
      "Header",
      "Title",
      "Description",
      "Footer",
      "Close",
      "CloseTrigger",
      "Context",
      "Indent",
      "IndentBackground",
    ],
  });
  assert.deepEqual(registry.components.DrawerGrabber, {
    name: "DrawerGrabber",
    type: "component",
    group: "drawer",
    importPath: "@dicehub/kappa/components/drawer",
    sourceFile: "components/drawer/DrawerGrabber.vue",
    description: "DrawerGrabber component exported by the Drawer module.",
  });
});

test("discovers the public dropdown compound component", () => {
  assert.deepEqual(registry.components.Dropdown, {
    name: "Dropdown",
    type: "component",
    group: "dropdown",
    importPath: "@dicehub/kappa/components/dropdown",
    sourceFile: "components/dropdown/Dropdown.vue",
    description: "Dropdown component exported by the Dropdown module.",
    parts: [
      "Root",
      "RootProvider",
      "Trigger",
      "Indicator",
      "ContextTrigger",
      "Content",
      "Arrow",
      "Item",
      "LinkItem",
      "CheckboxItem",
      "RadioGroup",
      "RadioItem",
      "RadioItemIndicator",
      "Group",
      "Label",
      "GroupLabel",
      "Separator",
      "Shortcut",
      "Sub",
      "SubTrigger",
      "SubContent",
      "ItemIndicator",
      "ItemText",
      "Context",
      "ItemContext",
    ],
  });
  assert.deepEqual(registry.components.DropdownLinkItem, {
    name: "DropdownLinkItem",
    type: "component",
    group: "dropdown",
    importPath: "@dicehub/kappa/components/dropdown",
    sourceFile: "components/dropdown/DropdownLinkItem.vue",
    description: "DropdownLinkItem component exported by the Dropdown module.",
  });
});

test("discovers the public editable compound component", () => {
  assert.deepEqual(registry.components.Editable, {
    name: "Editable",
    type: "component",
    group: "editable",
    importPath: "@dicehub/kappa/components/editable",
    sourceFile: "components/editable/Editable.vue",
    description: "Editable component exported by the Editable module.",
    parts: [
      "Root",
      "RootProvider",
      "Area",
      "Label",
      "Preview",
      "Input",
      "Control",
      "EditTrigger",
      "SubmitTrigger",
      "CancelTrigger",
      "Context",
    ],
  });
  assert.deepEqual(registry.components.EditableInput, {
    name: "EditableInput",
    type: "component",
    group: "editable",
    importPath: "@dicehub/kappa/components/editable",
    sourceFile: "components/editable/EditableInput.vue",
    description: "EditableInput component exported by the Editable module.",
  });
});

test("discovers the public empty compound component", () => {
  assert.deepEqual(registry.components.Empty, {
    name: "Empty",
    type: "component",
    group: "empty",
    importPath: "@dicehub/kappa/components/empty",
    sourceFile: "components/empty/Empty.vue",
    description: "Empty component exported by the Empty module.",
    parts: ["Root", "Header", "Media", "Title", "Description", "Content"],
  });
  assert.deepEqual(registry.components.EmptyTitle, {
    name: "EmptyTitle",
    type: "component",
    group: "empty",
    importPath: "@dicehub/kappa/components/empty",
    sourceFile: "components/empty/EmptyTitle.vue",
    description: "EmptyTitle component exported by the Empty module.",
  });
});

test("discovers the public field compound component", () => {
  assert.deepEqual(registry.components.Field, {
    name: "Field",
    type: "component",
    group: "field",
    importPath: "@dicehub/kappa/components/field",
    sourceFile: "components/field/Field.vue",
    description: "Field component exported by the Field module.",
    parts: [
      "Root",
      "RootProvider",
      "Label",
      "Input",
      "Textarea",
      "Select",
      "HelperText",
      "ErrorText",
      "RequiredIndicator",
      "Item",
      "Context",
    ],
  });
  assert.deepEqual(registry.components.FieldErrorText, {
    name: "FieldErrorText",
    type: "component",
    group: "field",
    importPath: "@dicehub/kappa/components/field",
    sourceFile: "components/field/FieldErrorText.vue",
    description: "FieldErrorText component exported by the Field module.",
  });
});

test("discovers the public fieldset compound component", () => {
  assert.deepEqual(registry.components.Fieldset, {
    name: "Fieldset",
    type: "component",
    group: "fieldset",
    importPath: "@dicehub/kappa/components/fieldset",
    sourceFile: "components/fieldset/Fieldset.vue",
    description: "Fieldset component exported by the Fieldset module.",
    parts: ["Root", "RootProvider", "Legend", "HelperText", "ErrorText", "Context"],
  });
  assert.deepEqual(registry.components.FieldsetLegend, {
    name: "FieldsetLegend",
    type: "component",
    group: "fieldset",
    importPath: "@dicehub/kappa/components/fieldset",
    sourceFile: "components/fieldset/FieldsetLegend.vue",
    description: "FieldsetLegend component exported by the Fieldset module.",
  });
});

test("discovers the public flow compound component", () => {
  assert.deepEqual(registry.components.Flow, {
    name: "Flow",
    type: "component",
    group: "flow",
    importPath: "@dicehub/kappa/components/flow",
    sourceFile: "components/flow/Flow.vue",
    description: "Flow component exported by the Flow module.",
    parts: ["Root", "Node", "Anchor", "Parallel", "List"],
  });
  assert.deepEqual(registry.components.FlowAnchor, {
    name: "FlowAnchor",
    type: "component",
    group: "flow",
    importPath: "@dicehub/kappa/components/flow",
    sourceFile: "components/flow/FlowAnchor.vue",
    description: "FlowAnchor component exported by the Flow module.",
  });
  assert.deepEqual(registry.components.FlowRoot, {
    name: "FlowRoot",
    type: "component",
    group: "flow",
    importPath: "@dicehub/kappa/components/flow",
    sourceFile: "components/flow/Flow.vue",
    description: "FlowRoot component exported by the Flow module.",
  });
});

test("discovers the public format compound component", () => {
  assert.deepEqual(registry.components.Format, {
    name: "Format",
    type: "component",
    group: "format",
    importPath: "@dicehub/kappa/components/format",
    sourceFile: "components/format/Format.vue",
    description: "Format component exported by the Format module.",
    parts: ["Root", "Byte", "Number", "RelativeTime", "Time"],
  });
  for (const [name, sourceFile] of [
    ["FormatRoot", "Format.vue"],
    ["FormatByte", "FormatByte.vue"],
    ["FormatNumber", "FormatNumber.vue"],
    ["FormatRelativeTime", "FormatRelativeTime.vue"],
    ["FormatTime", "FormatTime.vue"],
  ]) {
    assert.deepEqual(registry.components[name], {
      name,
      type: "component",
      group: "format",
      importPath: "@dicehub/kappa/components/format",
      sourceFile: `components/format/${sourceFile}`,
      description: `${name} component exported by the Format module.`,
    });
  }
});

test("discovers the public grid compound component", () => {
  assert.deepEqual(registry.components.Grid, {
    name: "Grid",
    type: "component",
    group: "grid",
    importPath: "@dicehub/kappa/components/grid",
    sourceFile: "components/grid/Grid.vue",
    description: "Grid component exported by the Grid module.",
    parts: ["Root", "Item"],
  });
  assert.deepEqual(registry.components.GridItem, {
    name: "GridItem",
    type: "component",
    group: "grid",
    importPath: "@dicehub/kappa/components/grid",
    sourceFile: "components/grid/GridItem.vue",
    description: "GridItem component exported by the Grid module.",
  });
  assert.deepEqual(registry.components.GridRoot, {
    name: "GridRoot",
    type: "component",
    group: "grid",
    importPath: "@dicehub/kappa/components/grid",
    sourceFile: "components/grid/Grid.vue",
    description: "GridRoot component exported by the Grid module.",
  });
});

test("discovers the public highlight component", () => {
  assert.deepEqual(registry.components.Highlight, {
    name: "Highlight",
    type: "component",
    group: "highlight",
    importPath: "@dicehub/kappa/components/highlight",
    sourceFile: "components/highlight/Highlight.vue",
    description: "Highlight component exported by the Highlight module.",
  });
});

test("discovers the public card compound component", () => {
  assert.deepEqual(registry.components.Card, {
    name: "Card",
    type: "component",
    group: "card",
    importPath: "@dicehub/kappa/components/card",
    sourceFile: "components/card/Card.vue",
    description: "Card component exported by the Card module.",
    parts: [
      "Root",
      "Header",
      "Title",
      "Description",
      "Action",
      "Content",
      "Footer",
      "Primary",
      "Secondary",
    ],
  });

  const sourceFiles = {
    CardAction: "CardAction.vue",
    CardContent: "CardContent.vue",
    CardDescription: "CardDescription.vue",
    CardFooter: "CardFooter.vue",
    CardHeader: "CardHeader.vue",
    CardPrimary: "CardPrimary.vue",
    CardRoot: "Card.vue",
    CardSecondary: "CardSecondary.vue",
    CardTitle: "CardTitle.vue",
  };
  for (const [name, sourceFile] of Object.entries(sourceFiles)) {
    assert.deepEqual(registry.components[name], {
      name,
      type: "component",
      group: "card",
      importPath: "@dicehub/kappa/components/card",
      sourceFile: `components/card/${sourceFile}`,
      description: `${name} component exported by the Card module.`,
    });
  }
});

test("discovers the public loader component", () => {
  assert.deepEqual(registry.components.Loader, {
    name: "Loader",
    type: "component",
    group: "loader",
    importPath: "@dicehub/kappa/components/loader",
    sourceFile: "components/loader/Loader.vue",
    description: "Loader component exported by the Loader module.",
  });
});

test("discovers the public input component", () => {
  assert.deepEqual(registry.components.Input, {
    name: "Input",
    type: "component",
    group: "input",
    importPath: "@dicehub/kappa/components/input",
    sourceFile: "components/input/Input.vue",
    description: "Input component exported by the Input module.",
  });
});

test("discovers the public input area component", () => {
  assert.deepEqual(registry.components.InputArea, {
    name: "InputArea",
    type: "component",
    group: "input-area",
    importPath: "@dicehub/kappa/components/input-area",
    sourceFile: "components/input-area/InputArea.vue",
    description: "InputArea component exported by the Input Area module.",
  });
});

test("discovers the public label component", () => {
  assert.deepEqual(registry.components.Label, {
    name: "Label",
    type: "component",
    group: "label",
    importPath: "@dicehub/kappa/components/label",
    sourceFile: "components/label/Label.vue",
    description: "Label component exported by the Label module.",
  });
});

test("discovers the public layer card compound component", () => {
  assert.deepEqual(registry.components.LayerCard, {
    name: "LayerCard",
    type: "component",
    group: "layer-card",
    importPath: "@dicehub/kappa/components/layer-card",
    sourceFile: "components/layer-card/LayerCard.vue",
    description: "LayerCard component exported by the Layer Card module.",
    parts: ["Root", "Primary", "Secondary"],
  });
  assert.deepEqual(registry.components.LayerCardPrimary, {
    name: "LayerCardPrimary",
    type: "component",
    group: "layer-card",
    importPath: "@dicehub/kappa/components/layer-card",
    sourceFile: "components/layer-card/LayerCardPrimary.vue",
    description: "LayerCardPrimary component exported by the Layer Card module.",
  });
  assert.deepEqual(registry.components.LayerCardRoot, {
    name: "LayerCardRoot",
    type: "component",
    group: "layer-card",
    importPath: "@dicehub/kappa/components/layer-card",
    sourceFile: "components/layer-card/LayerCard.vue",
    description: "LayerCardRoot component exported by the Layer Card module.",
  });
  assert.deepEqual(registry.components.LayerCardSecondary, {
    name: "LayerCardSecondary",
    type: "component",
    group: "layer-card",
    importPath: "@dicehub/kappa/components/layer-card",
    sourceFile: "components/layer-card/LayerCardSecondary.vue",
    description: "LayerCardSecondary component exported by the Layer Card module.",
  });
});

test("discovers the public link compound component", () => {
  assert.deepEqual(registry.components.Link, {
    name: "Link",
    type: "component",
    group: "link",
    importPath: "@dicehub/kappa/components/link",
    sourceFile: "components/link/Link.vue",
    description: "Link component exported by the Link module.",
    parts: ["ExternalIcon"],
  });
  assert.deepEqual(registry.components.LinkExternalIcon, {
    name: "LinkExternalIcon",
    type: "component",
    group: "link",
    importPath: "@dicehub/kappa/components/link",
    sourceFile: "components/link/LinkExternalIcon.vue",
    description: "LinkExternalIcon component exported by the Link module.",
  });
});

test("discovers the public meter component", () => {
  assert.deepEqual(registry.components.Meter, {
    name: "Meter",
    type: "component",
    group: "meter",
    importPath: "@dicehub/kappa/components/meter",
    sourceFile: "components/meter/Meter.vue",
    description: "Meter component exported by the Meter module.",
  });
});

test("discovers the public progress compound component", () => {
  assert.deepEqual(registry.components.Progress, {
    name: "Progress",
    type: "component",
    group: "progress",
    importPath: "@dicehub/kappa/components/progress",
    sourceFile: "components/progress/Progress.vue",
    description: "Progress component exported by the Progress module.",
    parts: [
      "Root",
      "RootProvider",
      "Label",
      "ValueText",
      "Track",
      "Range",
      "View",
      "Context",
    ],
  });
  assert.deepEqual(registry.components.ProgressRange, {
    name: "ProgressRange",
    type: "component",
    group: "progress",
    importPath: "@dicehub/kappa/components/progress",
    sourceFile: "components/progress/ProgressRange.vue",
    description: "ProgressRange component exported by the Progress module.",
  });
});

test("discovers the public progress circle compound component", () => {
  assert.deepEqual(registry.components.ProgressCircle, {
    name: "ProgressCircle",
    type: "component",
    group: "progress-circle",
    importPath: "@dicehub/kappa/components/progress-circle",
    sourceFile: "components/progress-circle/ProgressCircle.vue",
    description: "ProgressCircle component exported by the Progress Circle module.",
    parts: [
      "Root",
      "RootProvider",
      "Label",
      "ValueText",
      "Circle",
      "CircleTrack",
      "CircleRange",
      "View",
      "Context",
    ],
  });
  assert.deepEqual(registry.components.ProgressCircleRange, {
    name: "ProgressCircleRange",
    type: "component",
    group: "progress-circle",
    importPath: "@dicehub/kappa/components/progress-circle",
    sourceFile: "components/progress-circle/ProgressCircleRange.vue",
    description:
      "ProgressCircleRange component exported by the Progress Circle module.",
  });
});

test("discovers the public radio compound component", () => {
  assert.deepEqual(registry.components.Radio, {
    name: "Radio",
    type: "component",
    group: "radio",
    importPath: "@dicehub/kappa/components/radio",
    sourceFile: "components/radio/Radio.vue",
    description: "Radio component exported by the Radio module.",
    parts: [
      "Root",
      "RootProvider",
      "Label",
      "Indicator",
      "Item",
      "ItemControl",
      "ItemText",
      "Context",
      "ItemContext",
    ],
  });
  assert.deepEqual(registry.components.RadioItemControl, {
    name: "RadioItemControl",
    type: "component",
    group: "radio",
    importPath: "@dicehub/kappa/components/radio",
    sourceFile: "components/radio/RadioItemControl.vue",
    description: "RadioItemControl component exported by the Radio module.",
  });
});

test("discovers the public rating compound component", () => {
  assert.deepEqual(registry.components.Rating, {
    name: "Rating",
    type: "component",
    group: "rating",
    importPath: "@dicehub/kappa/components/rating",
    sourceFile: "components/rating/Rating.vue",
    description: "Rating component exported by the Rating module.",
    parts: ["Root", "RootProvider", "Label", "Control", "Item", "Context", "ItemContext"],
  });
  assert.deepEqual(registry.components.RatingItem, {
    name: "RatingItem",
    type: "component",
    group: "rating",
    importPath: "@dicehub/kappa/components/rating",
    sourceFile: "components/rating/RatingItem.vue",
    description: "RatingItem component exported by the Rating module.",
  });
});

test("discovers the public select compound component", () => {
  assert.deepEqual(registry.components.Select, {
    name: "Select",
    type: "component",
    group: "select",
    importPath: "@dicehub/kappa/components/select",
    sourceFile: "components/select/Select.vue",
    description: "Select component exported by the Select module.",
    parts: [
      "Root",
      "RootProvider",
      "Trigger",
      "ValueText",
      "Indicator",
      "ClearTrigger",
      "Control",
      "Content",
      "Label",
      "Positioner",
      "List",
      "Item",
      "Option",
      "ItemText",
      "ItemIndicator",
      "Group",
      "GroupLabel",
      "Separator",
      "HiddenSelect",
      "Context",
      "ItemContext",
    ],
  });
  assert.deepEqual(registry.components.SelectOption, {
    name: "SelectOption",
    type: "component",
    group: "select",
    importPath: "@dicehub/kappa/components/select",
    sourceFile: "components/select/SelectItem.vue",
    description: "SelectOption component exported by the Select module.",
  });
});

test("discovers the public selection list compound component", () => {
  assert.deepEqual(registry.components.SelectionList, {
    name: "SelectionList",
    type: "component",
    group: "selection-list",
    importPath: "@dicehub/kappa/components/selection-list",
    sourceFile: "components/selection-list/SelectionList.vue",
    description: "SelectionList component exported by the Selection List module.",
    parts: [
      "Root",
      "RootProvider",
      "Label",
      "Input",
      "Content",
      "Empty",
      "ItemGroup",
      "ItemGroupLabel",
      "Item",
      "ItemMedia",
      "ItemContent",
      "ItemText",
      "ItemDescription",
      "ItemMeta",
      "ItemIndicator",
      "ValueText",
      "Context",
      "ItemContext",
    ],
  });
});

test("discovers the public separator component", () => {
  assert.deepEqual(registry.components.Separator, {
    name: "Separator",
    type: "component",
    group: "separator",
    importPath: "@dicehub/kappa/components/separator",
    sourceFile: "components/separator/Separator.vue",
    description: "Separator component exported by the Separator module.",
  });
});

test("discovers the public tabs compound component", () => {
  assert.deepEqual(registry.components.Tabs, {
    name: "Tabs",
    type: "component",
    group: "tabs",
    importPath: "@dicehub/kappa/components/tabs",
    sourceFile: "components/tabs/Tabs.vue",
    description: "Tabs component exported by the Tabs module.",
    parts: ["Root", "RootProvider", "List", "Trigger", "Content", "Indicator", "Context"],
  });
  assert.deepEqual(registry.components.TabsTrigger, {
    name: "TabsTrigger",
    type: "component",
    group: "tabs",
    importPath: "@dicehub/kappa/components/tabs",
    sourceFile: "components/tabs/TabsTrigger.vue",
    description: "TabsTrigger component exported by the Tabs module.",
  });
});

test("discovers the public skeleton line component", () => {
  assert.deepEqual(registry.components.SkeletonLine, {
    name: "SkeletonLine",
    type: "component",
    group: "skeleton-line",
    importPath: "@dicehub/kappa/components/skeleton-line",
    sourceFile: "components/skeleton-line/SkeletonLine.vue",
    description: "SkeletonLine component exported by the Skeleton Line module.",
  });
});

test("discovers the public switch compound component", () => {
  assert.deepEqual(registry.components.Switch, {
    name: "Switch",
    type: "component",
    group: "switch",
    importPath: "@dicehub/kappa/components/switch",
    sourceFile: "components/switch/Switch.vue",
    description: "Switch component exported by the Switch module.",
    parts: ["Root", "RootProvider", "Control", "Thumb", "Label", "Context"],
  });
  assert.deepEqual(registry.components.SwitchThumb, {
    name: "SwitchThumb",
    type: "component",
    group: "switch",
    importPath: "@dicehub/kappa/components/switch",
    sourceFile: "components/switch/SwitchThumb.vue",
    description: "SwitchThumb component exported by the Switch module.",
  });
});

test("discovers the public text component", () => {
  assert.deepEqual(registry.components.Text, {
    name: "Text",
    type: "component",
    group: "text",
    importPath: "@dicehub/kappa/components/text",
    sourceFile: "components/text/Text.vue",
    description: "Text component exported by the Text module.",
  });
});

test("discovers the public tooltip compound component", () => {
  assert.deepEqual(registry.components.Tooltip, {
    name: "Tooltip",
    type: "component",
    group: "tooltip",
    importPath: "@dicehub/kappa/components/tooltip",
    sourceFile: "components/tooltip/Tooltip.vue",
    description: "Tooltip component exported by the Tooltip module.",
    parts: ["Root", "RootProvider", "Trigger", "Content", "Arrow", "ArrowTip", "Context"],
  });
  assert.deepEqual(registry.components.TooltipContent, {
    name: "TooltipContent",
    type: "component",
    group: "tooltip",
    importPath: "@dicehub/kappa/components/tooltip",
    sourceFile: "components/tooltip/TooltipContent.vue",
    description: "TooltipContent component exported by the Tooltip module.",
  });
});

test("discovers the public number input compound component", () => {
  assert.deepEqual(registry.components.NumberInput, {
    name: "NumberInput",
    type: "component",
    group: "number-input",
    importPath: "@dicehub/kappa/components/number-input",
    sourceFile: "components/number-input/NumberInput.vue",
    description: "NumberInput component exported by the Number Input module.",
    parts: [
      "Root",
      "RootProvider",
      "Label",
      "Control",
      "Input",
      "ValueText",
      "IncrementTrigger",
      "DecrementTrigger",
      "Scrubber",
      "ScrubbableInput",
      "Unit",
      "Context",
    ],
  });
  assert.deepEqual(registry.components.NumberInputScrubber, {
    name: "NumberInputScrubber",
    type: "component",
    group: "number-input",
    importPath: "@dicehub/kappa/components/number-input",
    sourceFile: "components/number-input/NumberInputScrubber.vue",
    description:
      "NumberInputScrubber component exported by the Number Input module.",
  });
  assert.deepEqual(registry.components.NumberInputScrubbableInput, {
    name: "NumberInputScrubbableInput",
    type: "component",
    group: "number-input",
    importPath: "@dicehub/kappa/components/number-input",
    sourceFile: "components/number-input/NumberInputScrubbableInput.vue",
    description:
      "NumberInputScrubbableInput component exported by the Number Input module.",
  });
});

test("discovers the public popover compound component", () => {
  assert.deepEqual(registry.components.Popover, {
    name: "Popover",
    type: "component",
    group: "popover",
    importPath: "@dicehub/kappa/components/popover",
    sourceFile: "components/popover/Popover.vue",
    description: "Popover component exported by the Popover module.",
    parts: [
      "Root",
      "RootProvider",
      "Trigger",
      "Anchor",
      "Positioner",
      "Content",
      "Arrow",
      "ArrowTip",
      "Title",
      "Description",
      "Indicator",
      "Close",
      "CloseTrigger",
      "Context",
    ],
  });
  assert.deepEqual(registry.components.PopoverContent, {
    name: "PopoverContent",
    type: "component",
    group: "popover",
    importPath: "@dicehub/kappa/components/popover",
    sourceFile: "components/popover/PopoverContent.vue",
    description: "PopoverContent component exported by the Popover module.",
  });
  assert.deepEqual(registry.components.PopoverClose, {
    name: "PopoverClose",
    type: "component",
    group: "popover",
    importPath: "@dicehub/kappa/components/popover",
    sourceFile: "components/popover/PopoverCloseTrigger.vue",
    description: "PopoverClose component exported by the Popover module.",
  });
});

test("discovers the public dicehub logo component", () => {
  assert.deepEqual(registry.components.DicehubLogo, {
    name: "DicehubLogo",
    type: "component",
    group: "dicehub-logo",
    importPath: "@dicehub/kappa/components/dicehub-logo",
    sourceFile: "components/dicehub-logo/DicehubLogo.vue",
    description: "DicehubLogo component exported by the Dicehub Logo module.",
  });
  assert.deepEqual(registry.components.PoweredByDicehub, {
    name: "PoweredByDicehub",
    type: "component",
    group: "dicehub-logo",
    importPath: "@dicehub/kappa/components/dicehub-logo",
    sourceFile: "components/dicehub-logo/PoweredByDicehub.vue",
    description: "PoweredByDicehub component exported by the Dicehub Logo module.",
  });
});

test("discovers the foundational public components", () => {
  assert.deepEqual(registry.components.AspectRatio, {
    name: "AspectRatio",
    type: "component",
    group: "aspect-ratio",
    importPath: "@dicehub/kappa/components/aspect-ratio",
    sourceFile: "components/aspect-ratio/AspectRatio.vue",
    description: "AspectRatio component exported by the Aspect Ratio module.",
  });
  assert.deepEqual(registry.components.Item, {
    name: "Item",
    type: "component",
    group: "item",
    importPath: "@dicehub/kappa/components/item",
    sourceFile: "components/item/Item.vue",
    description: "Item component exported by the Item module.",
    parts: [
      "Root",
      "Group",
      "Separator",
      "Media",
      "Content",
      "Title",
      "Description",
      "Actions",
      "Header",
      "Footer",
    ],
  });
  assert.deepEqual(registry.components.Toggle, {
    name: "Toggle",
    type: "component",
    group: "toggle",
    importPath: "@dicehub/kappa/components/toggle",
    sourceFile: "components/toggle/Toggle.vue",
    description: "Toggle component exported by the Toggle module.",
  });
});

test("discovers the five interactive public components", () => {
  const componentSpecs = {
    HoverCard: {
      group: "hover-card",
      title: "Hover Card",
      parts: ["Root", "RootProvider", "Trigger", "Positioner", "Content", "Arrow", "ArrowTip", "Context"],
    },
    InputGroup: {
      group: "input-group",
      title: "Input Group",
      parts: ["Root", "Addon", "Button", "Input", "Textarea", "Text"],
    },
    ScrollArea: {
      group: "scroll-area",
      title: "Scroll Area",
      parts: ["Root", "RootProvider", "Viewport", "Content", "Scrollbar", "Thumb", "Corner", "Context"],
    },
    Slider: {
      group: "slider",
      title: "Slider",
      parts: ["Root", "RootProvider", "Label", "ValueText", "Control", "Track", "Range", "Thumb", "HiddenInput", "MarkerGroup", "Marker", "DraggingIndicator", "Context"],
    },
    ToggleGroup: {
      group: "toggle-group",
      title: "Toggle Group",
      parts: ["Root", "RootProvider", "Item", "Context"],
    },
  };

  for (const [name, { group, title, parts }] of Object.entries(componentSpecs)) {
    assert.deepEqual(registry.components[name], {
      name,
      type: "component",
      group,
      importPath: `@dicehub/kappa/components/${group}`,
      sourceFile: `components/${group}/${name}.vue`,
      description: `${name} component exported by the ${title} module.`,
      parts,
    });
  }
});

test("discovers the third five public components", () => {
  const componentSpecs = {
    InputOtp: {
      group: "input-otp",
      title: "Input Otp",
      sourceFile: "InputOtp.vue",
      parts: ["Root", "RootProvider", "Control", "Input", "HiddenInput", "Label", "Context"],
    },
    Resizable: {
      group: "resizable",
      title: "Resizable",
      sourceFile: "Resizable.vue",
      parts: ["Root", "RootProvider", "Panel", "Handle", "ResizeTrigger", "ResizeTriggerIndicator", "Context"],
    },
    TableOfContents: {
      group: "table-of-contents",
      title: "Table Of Contents",
      sourceFile: "TableOfContentsRoot.vue",
      parts: ["Root", "Content", "Nav", "Title", "List", "Indicator", "Item", "Link", "Context", "RootProvider"],
    },
    Toolbar: {
      group: "toolbar",
      title: "Toolbar",
      sourceFile: "Toolbar.vue",
      parts: ["Root", "Button", "Link", "Input", "InputGroup", "Separator"],
    },
  };

  for (const [name, { group, title, sourceFile, parts }] of Object.entries(componentSpecs)) {
    assert.deepEqual(registry.components[name], {
      name,
      type: "component",
      group,
      importPath: `@dicehub/kappa/components/${group}`,
      sourceFile: `components/${group}/${sourceFile}`,
      description: `${name} component exported by the ${title} module.`,
      parts,
    });
  }

  assert.deepEqual(registry.components.SensitiveInput, {
    name: "SensitiveInput",
    type: "component",
    group: "sensitive-input",
    importPath: "@dicehub/kappa/components/sensitive-input",
    sourceFile: "components/sensitive-input/SensitiveInput.vue",
    description: "SensitiveInput component exported by the Sensitive Input module.",
  });
});

test("discovers the public presence and QR code components", () => {
  assert.deepEqual(registry.components.Presence, {
    name: "Presence",
    type: "component",
    group: "presence",
    importPath: "@dicehub/kappa/components/presence",
    sourceFile: "components/presence/Presence.vue",
    description: "Presence component exported by the Presence module.",
  });
  assert.deepEqual(registry.components.QrCode, {
    name: "QrCode",
    type: "component",
    group: "qr-code",
    importPath: "@dicehub/kappa/components/qr-code",
    sourceFile: "components/qr-code/QrCodeRoot.vue",
    description: "QrCode component exported by the Qr Code module.",
    parts: ["Root", "RootProvider", "Frame", "Pattern", "Overlay", "DownloadTrigger", "Context"],
  });
  assert.deepEqual(registry.components.QrCodeDownloadTrigger, {
    name: "QrCodeDownloadTrigger",
    type: "component",
    group: "qr-code",
    importPath: "@dicehub/kappa/components/qr-code",
    sourceFile: "components/qr-code/QrCodeDownloadTrigger.vue",
    description: "QrCodeDownloadTrigger component exported by the Qr Code module.",
  });
});

test("discovers the public steps compound component", () => {
  assert.deepEqual(registry.components.Steps, {
    name: "Steps",
    type: "component",
    group: "steps",
    importPath: "@dicehub/kappa/components/steps",
    sourceFile: "components/steps/Steps.vue",
    description: "Steps component exported by the Steps module.",
    parts: [
      "Root",
      "RootProvider",
      "List",
      "Item",
      "Trigger",
      "Indicator",
      "Separator",
      "Content",
      "CompletedContent",
      "PrevTrigger",
      "NextTrigger",
      "Progress",
      "Context",
      "ItemContext",
    ],
  });
});

test("generates deterministic search indexes", () => {
  const publicNames = [
    ...componentNames,
    "ContentLoader",
    "FilterBar",
    "PropertyList",
    "PropertyListItem",
    "PropertyListRoot",
    "PropertyListTerm",
    "PropertyListValue",
    "DragSelection",
    "ImageCropper",
    "DeleteResource",
    "FileBrowser",
    "FileBrowserRoot",
    "MessageComposer",
    "ResourcePicker",
    "LoginLayout",
    "ResourceListLayout",
    "SidebarLayout",
    "SettingsLayout",
    "SettingsSection",
    "WorkspaceSwitcher",
  ].sort((a, b) => a.localeCompare(b));
  assert.deepEqual(Object.keys(registry.components), publicNames);
  assert.deepEqual(registry.search.byName, publicNames);
  assert.deepEqual(registry.search.byGroup, {
    accordion: accordionComponentNames,
    "activity-feed": activityFeedComponentNames,
    "aspect-ratio": aspectRatioComponentNames,
    attachment: attachmentComponentNames,
    autocomplete: autocompleteComponentNames,
    avatar: avatarComponentNames,
    badge: ["Badge"],
    banner: bannerComponentNames,
    breadcrumbs: breadcrumbsComponentNames,
    button: buttonComponentNames,
    "button-group": buttonGroupComponentNames,
    card: cardComponentNames,
    checkbox: checkboxComponentNames,
    chart: chartComponentNames,
    "client-only": clientOnlyComponentNames,
    "clipboard-text": clipboardTextComponentNames,
    "code-highlighted": codeHighlightedComponentNames,
    collapsible: collapsibleComponentNames,
    "collapsible-section": collapsibleSectionComponentNames,
    "color-picker": colorPickerComponentNames,
    combobox: comboboxComponentNames,
    "command-palette": commandPaletteComponentNames,
    "context-menu": contextMenuComponentNames,
    "content-loader": ["ContentLoader"],
    "data-grid": dataGridComponentNames,
    "filter-bar": ["FilterBar"],
    "property-list": ["PropertyList", "PropertyListItem", "PropertyListRoot", "PropertyListTerm", "PropertyListValue"],
    "delete-resource": ["DeleteResource"],
    "drag-selection": ["DragSelection"],
    "file-browser": ["FileBrowser", "FileBrowserRoot"],
    "image-cropper": ["ImageCropper"],
    "message-composer": ["MessageComposer"],
    "resource-picker": ["ResourcePicker"],
    "date-picker": datePickerComponentNames,
    dialog: dialogComponentNames,
    "dialog-layout": dialogLayoutComponentNames,
    "diff-viewer": ["DiffViewer", "DiffViewerRoot"],
    "dicehub-logo": ["DicehubLogo", "PoweredByDicehub"],
    "direction-provider": ["DirectionProvider"],
    "download-trigger": ["DownloadTrigger"],
    drawer: drawerComponentNames,
    dropdown: dropdownComponentNames,
    editable: editableComponentNames,
    empty: emptyComponentNames,
    "expandable-text": expandableTextComponentNames,
    field: fieldComponentNames,
    fieldset: fieldsetComponentNames,
    "file-upload": fileUploadComponentNames,
    "floating-panel": floatingPanelComponentNames,
    flow: flowComponentNames,
    format: formatComponentNames,
    grid: gridComponentNames,
    highlight: highlightComponentNames,
    "hover-card": hoverCardComponentNames,
    "inline-copy-text": inlineCopyTextComponentNames,
    input: inputComponentNames,
    "input-area": inputAreaComponentNames,
    "input-group": inputGroupComponentNames,
    "input-otp": inputOtpComponentNames,
    item: itemComponentNames,
    kbd: kbdComponentNames,
    label: labelComponentNames,
    "layer-card": layerCardComponentNames,
    link: linkComponentNames,
    loader: loaderComponentNames,
    "login-layout": ["LoginLayout"],
    "map-view": mapViewComponentNames,
    "matrix-loader": matrixLoaderComponentNames,
    "menu-bar": menuBarComponentNames,
    meter: meterComponentNames,
    "native-select": nativeSelectComponentNames,
    "navigation-menu": navigationMenuComponentNames,
    "number-input": numberInputComponentNames,
    pagination: paginationComponentNames,
    popover: popoverComponentNames,
    presence: presenceComponentNames,
    progress: progressComponentNames,
    "progress-circle": progressCircleComponentNames,
    "qr-code": qrCodeComponentNames,
    radio: radioComponentNames,
    rating: ratingComponentNames,
    resizable: resizableComponentNames,
    "resource-list-layout": ["ResourceListLayout"],
    "scroll-area": scrollAreaComponentNames,
    select: selectComponentNames,
    "selection-list": selectionListComponentNames,
    "settings-layout": ["SettingsLayout", "SettingsSection"],
    "sensitive-input": sensitiveInputComponentNames,
    separator: separatorComponentNames,
    sidebar: sidebarComponentNames,
    "sidebar-layout": ["SidebarLayout"],
    "skeleton-line": skeletonLineComponentNames,
    slider: sliderComponentNames,
    steps: stepsComponentNames,
    switch: switchComponentNames,
    table: tableComponentNames,
    "table-of-contents": tableOfContentsComponentNames,
    tabs: tabsComponentNames,
    "tag-input": tagInputComponentNames,
    text: textComponentNames,
    timer: timerComponentNames,
    "timeseries-chart": timeseriesChartComponentNames,
    toggle: toggleComponentNames,
    "toggle-group": toggleGroupComponentNames,
    toolbar: toolbarComponentNames,
    "tree-view": treeViewComponentNames,
    tooltip: tooltipComponentNames,
    toast: toastComponentNames,
    "virtual-tree": virtualTreeComponentNames,
    "workspace-switcher": ["WorkspaceSwitcher"],
    "xy-plot": xyPlotComponentNames,
  });
  assert.deepEqual(registry.search.byType, {
    block: ["DeleteResource", "FileBrowser", "FileBrowserRoot", "LoginLayout", "MessageComposer", "ResourceListLayout", "ResourcePicker", "SettingsLayout", "SettingsSection", "SidebarLayout", "WorkspaceSwitcher"],
    component: [...componentNames, "ContentLoader", "DragSelection", "FilterBar", "ImageCropper", "PropertyList", "PropertyListItem", "PropertyListRoot", "PropertyListTerm", "PropertyListValue"].sort((a, b) => a.localeCompare(b)),
  });
});
