export const componentCompositionTrees = {
  toast: `Toaster (store + notification region)
└── Toast.Root (one per notification)
    ├── Toast.Indicator
    ├── Toast.Title
    ├── Toast.Description
    ├── Toast.ActionTrigger
    └── Toast.CloseTrigger`,

  accordion: `Accordion.Root
├── Accordion.Item
│   ├── Accordion.Trigger
│   │   └── Accordion.Indicator
│   └── Accordion.Content
└── Accordion.Item
    ├── Accordion.Trigger
    └── Accordion.Content`,

  aspectRatio: `AspectRatio <div style="aspect-ratio">
└── default slot`,

  attachment: `Attachment.Group
└── Attachment.Root
    ├── Attachment.Media
    ├── Attachment.Content
    │   ├── Attachment.Title
    │   └── Attachment.Description
    ├── Attachment.Actions
    │   └── Attachment.Action
    └── Attachment.Trigger`,

  autocomplete: `Autocomplete.Root
├── Autocomplete.Label
├── Autocomplete.InputGroup
└── Autocomplete.Content
    ├── Autocomplete.Empty
    └── Autocomplete.List
        ├── Autocomplete.Group
        │   ├── Autocomplete.GroupLabel
        │   └── Autocomplete.Item
        │       ├── Autocomplete.ItemText
        │       └── Autocomplete.ItemIndicator
        └── Autocomplete.Separator`,

  avatar: `Avatar.Root
├── Avatar.Image
├── Avatar.Fallback
└── Avatar.Badge

Avatar.Group
├── Avatar.Root
├── Avatar.Root
└── Avatar.GroupCount`,

  banner: `Banner
├── #icon
├── #default
├── #description
└── #action
    └── Banner.Action`,

  breadcrumbs: `Breadcrumbs.Root
└── Breadcrumbs.List
    ├── Breadcrumbs.Item
    │   └── Breadcrumbs.Link
    ├── Breadcrumbs.Separator
    ├── Breadcrumbs.Ellipsis
    └── Breadcrumbs.Item
        └── Breadcrumbs.Page / Breadcrumbs.Current`,

  buttonGroup: `ButtonGroup.Root
├── Button / LinkButton / native input
├── ButtonGroup.Separator
└── ButtonGroup.Text`,

  checkbox: `Checkbox.Group (optional)
└── Checkbox.Root
    ├── Checkbox.Control
    │   └── Checkbox.Indicator
    └── Checkbox.Label`,

  clientOnly: `ClientOnly (renderless)
├── #fallback (SSR and pre-mount content)
└── #default (browser-mounted content)`,

  clipboardText: `ClipboardText.Root
├── ClipboardText.Label
├── ClipboardText.Control
│   ├── ClipboardText.Input
│   └── ClipboardText.Trigger
│       └── ClipboardText.Indicator
└── ClipboardText.ValueText (alternative)`,

  code: `Code.Root <pre>
└── <code>
    └── text / highlighted <mark>

Code.Block <div>
└── Code.Root`,

  codeHighlighted: `CodeHighlighted.Provider
└── CodeHighlighted.Root`,

  collapsible: `Collapsible.Root
├── Collapsible.Trigger
│   └── Collapsible.Indicator
└── Collapsible.Content`,

  collapsibleSection: `CollapsibleSection.Root
├── CollapsibleSection.Header
│   ├── CollapsibleSection.Trigger
│   │   └── CollapsibleSection.Indicator
│   └── CollapsibleSection.Actions (optional)
└── CollapsibleSection.Content`,

  colorPicker: `ColorPicker.Root
├── ColorPicker.Label
├── ColorPicker.Control
│   ├── ColorPicker.ChannelInput
│   └── ColorPicker.Trigger
│       └── ColorPicker.ValueSwatch
├── ColorPicker.HiddenInput
└── ColorPicker.Content
    ├── ColorPicker.Area
    │   ├── ColorPicker.AreaBackground
    │   └── ColorPicker.AreaThumb
    ├── ColorPicker.ChannelSlider
    │   ├── ColorPicker.ChannelSliderTrack
    │   └── ColorPicker.ChannelSliderThumb
    └── ColorPicker.SwatchGroup
        └── ColorPicker.SwatchTrigger
            └── ColorPicker.Swatch`,

  combobox: `Combobox.Root
├── Combobox.Label
├── Combobox.TriggerInput / TriggerValue / TriggerMultipleWithInput
└── Combobox.Content
    ├── Combobox.Input (optional popup search)
    ├── Combobox.Empty
    └── Combobox.List
        ├── Combobox.Group
        │   ├── Combobox.GroupLabel
        │   └── Combobox.Item
        │       ├── Combobox.ItemText
        │       └── Combobox.ItemIndicator
        └── Combobox.Separator`,

  commandPalette: `CommandPalette.Root
└── CommandPalette.Dialog
    └── CommandPalette.Panel
        ├── CommandPalette.Input
        ├── CommandPalette.List
        │   ├── CommandPalette.Empty
        │   ├── CommandPalette.Loading
        │   └── CommandPalette.Results
        │       └── CommandPalette.Group
        │           ├── CommandPalette.GroupLabel
        │           └── CommandPalette.Items
        │               └── CommandPalette.Item
        └── CommandPalette.Footer`,

  contextMenu: `ContextMenu.Root
├── ContextMenu.Trigger (pointer and keyboard target)
└── ContextMenu.Content
    ├── ContextMenu.Group
    │   ├── ContextMenu.Label
    │   ├── ContextMenu.Item
    │   ├── ContextMenu.CheckboxItem
    │   └── ContextMenu.RadioGroup
    │       └── ContextMenu.RadioItem
    ├── ContextMenu.Separator
    └── ContextMenu.Sub
        ├── ContextMenu.SubTrigger
        └── ContextMenu.SubContent`,

  datePicker: `DatePicker.Root
├── DatePicker.Label
├── DatePicker.Control
│   ├── DatePicker.Input
│   ├── DatePicker.ClearTrigger
│   └── DatePicker.Trigger
└── DatePicker.Content
    └── DatePicker.Calendar`,

  dialog: `Dialog.Root
├── Dialog.Trigger
└── Dialog.Content
    ├── Dialog.Header
    │   ├── Dialog.Title
    │   └── Dialog.Description
    ├── Content
    ├── Dialog.Footer
    └── Dialog.Close`,

  dialogLayout: `DialogLayout.Root / DialogLayout.Alert
├── DialogLayout.Trigger
└── DialogLayout.Content
    ├── DialogLayout.Header
    │   ├── DialogLayout.Title
    │   └── DialogLayout.Description
    ├── DialogLayout.Body (only scroll region)
    └── DialogLayout.Actions
        ├── automatic dismiss action
        └── DialogLayout.Actions.Primary`,

  directionProvider: `DirectionProvider (Ark UI LocaleProvider; no DOM element)
└── default slot`,

  downloadTrigger: `DownloadTrigger <button>
├── icon / spinner (optional)
└── default slot`,

  drawer: `Drawer.Root
├── Drawer.Trigger
└── Drawer.Content
    ├── Drawer.Grabber
    │   └── Drawer.GrabberIndicator
    ├── Drawer.Header
    │   ├── Drawer.Title
    │   └── Drawer.Description
    ├── Content
    ├── Drawer.Footer
    └── Drawer.Close`,

  dropdown: `Dropdown.Root
├── Dropdown.Trigger
└── Dropdown.Content
    ├── Dropdown.Group
    │   ├── Dropdown.Label
    │   ├── Dropdown.Item
    │   ├── Dropdown.CheckboxItem
    │   └── Dropdown.RadioGroup
    │       └── Dropdown.RadioItem
    ├── Dropdown.Separator
    └── Dropdown.Sub
        ├── Dropdown.SubTrigger
        └── Dropdown.SubContent
            └── Dropdown.Item`,

  editable: `Editable.Root
├── Editable.Label
├── Editable.Area
│   ├── Editable.Input
│   └── Editable.Preview
└── Editable.Control
    ├── Editable.EditTrigger
    ├── Editable.SubmitTrigger
    └── Editable.CancelTrigger`,

  empty: `Empty.Root
├── Empty.Header
│   ├── Empty.Media
│   ├── Empty.Title
│   └── Empty.Description
└── Empty.Content`,

  field: `Field.Root
├── Field.Label
│   └── Field.RequiredIndicator
├── Field.Input / Field.Textarea / Field.Select
├── Field.HelperText
└── Field.ErrorText`,

  fieldset: `Fieldset.Root
├── Fieldset.Legend
├── related native controls
├── Fieldset.HelperText
└── Fieldset.ErrorText`,

  fileUpload: `FileUpload.Root
├── FileUpload.Label
├── FileUpload.Dropzone
│   └── FileUpload.Trigger
├── FileUpload.Context
│   └── FileUpload.ItemGroup [accepted | rejected]
│       └── FileUpload.Item [file]
│           ├── FileUpload.ItemPreview
│           │   └── FileUpload.ItemPreviewImage (optional)
│           ├── FileUpload.ItemName
│           ├── FileUpload.ItemSizeText
│           └── FileUpload.ItemDeleteTrigger
├── FileUpload.ClearTrigger (optional)
└── FileUpload.HiddenInput`,

  flow: `Flow.Root
├── Flow.Node
├── Flow.Parallel
│   ├── Flow.List
│   │   ├── Flow.Node
│   │   └── Flow.Node
│   └── Flow.Node
├── Flow.Anchor (inside a custom Flow.Node)
└── Flow.Node`,

  format: `Format.Root (Ark UI LocaleProvider; no DOM element)
├── Format.Byte
├── Format.Number
├── Format.RelativeTime
└── Format.Time`,

  grid: `Grid.Root <div | section | ul | ol>
├── Grid.Item <div | article | section | li>
└── Grid.Item <div | article | section | li>`,

  hoverCard: `HoverCard.Root
├── HoverCard.Trigger
└── HoverCard.Content
    ├── Positioner + Teleport (automatic)
    ├── HoverCard.Arrow
    │   └── HoverCard.ArrowTip
    └── interactive preview content`,

  highlight: `Highlight <span>
└── ArkHighlight
    └── <mark>matching chunks</mark>`,

  expandableText: `ExpandableText <ArkCollapsible.Root>
├── content <ArkCollapsible.Content>
│   └── prose body <div>
└── overflow trigger <ArkCollapsible.Trigger>
    ├── label
    └── indicator <svg>`,

  card: `Card.Root <div | article | section | aside | a | form>
├── Card.Header
│   ├── Card.Title
│   ├── Card.Description
│   └── Card.Action (optional)
├── Card.Content
└── Card.Footer (optional)

Card.Root (layered mode)
├── Card.Secondary (optional)
└── Card.Primary`,

  input: `Label [for="control-id"] (optional)
Input <input id="control-id">
└── native value, attributes, and events`,

  inputArea: `Field.Root (optional)
├── Field.Label
├── InputArea <textarea>
│   ├── native value, attributes, and events
│   └── Ark UI autoresize (optional)
├── Field.HelperText
└── Field.ErrorText`,

  inputGroup: `InputGroup.Root
├── InputGroup.Input / InputGroup.Textarea
├── InputGroup.Addon
│   └── InputGroup.Text
└── InputGroup.Button (optional action)`,

  inputOtp: `InputOtp.Root
├── InputOtp.Label
├── InputOtp.Control
│   ├── InputOtp.Input [index=0]
│   ├── InputOtp.Input [index=1]
│   └── InputOtp.Input [index=n]
├── InputOtp.HiddenInput
└── InputOtp.Context (optional)`,

  tagInput: `TagInput.Root
├── TagInput.Label
├── TagInput.Control
│   ├── TagInput.Context
│   │   └── TagInput.Item [value, index]
│   │       ├── TagInput.ItemPreview
│   │       │   ├── TagInput.ItemText
│   │       │   └── TagInput.ItemDeleteTrigger
│   │       └── TagInput.ItemInput
│   ├── TagInput.Input
│   └── TagInput.ClearTrigger (optional)
├── TagInput.HiddenInput (optional)
└── TagInput.ItemContext (optional)`,

  selectionList: `SelectionList.Root
├── SelectionList.Label
├── SelectionList.Input (optional filter control)
├── SelectionList.ValueText (optional selected summary)
└── SelectionList.Content
    ├── SelectionList.Empty
    ├── SelectionList.ItemGroup (optional)
    │   ├── SelectionList.ItemGroupLabel
    │   └── SelectionList.Item
    └── SelectionList.Item
        ├── SelectionList.ItemMedia (optional)
        ├── SelectionList.ItemContent
        │   ├── SelectionList.ItemText
        │   └── SelectionList.ItemDescription (optional)
        ├── SelectionList.ItemMeta (optional)
        └── SelectionList.ItemIndicator`,

  item: `Item.Group
├── Item.Root
│   ├── Item.Header (optional)
│   ├── Item.Media
│   ├── Item.Content
│   │   ├── Item.Title
│   │   └── Item.Description
│   ├── Item.Actions
│   └── Item.Footer (optional)
└── Item.Separator (optional)`,

  kbd: `Kbd <kbd>

KbdGroup <span>
├── Kbd
├── visible separator (optional)
└── Kbd`,

  label: `Label <label | span>
└── optional marker [data-slot="label-optional"] (when showOptional)`,

  layerCard: `LayerCard.Root <div | article | section | aside | a | form>
├── LayerCard.Secondary (optional)
│   └── supporting label or context
└── LayerCard.Primary
    └── raised content

LayerCard.Root (simple surface, direct content)
└── default slot`,

  link: `Link <a>
├── link text
└── Link.ExternalIcon (optional)

Link asChild (alternative)
└── RouterLink / framework link`,

  meter: `Meter <div role="meter">
├── meter-header
│   ├── meter-label
│   └── meter-value (optional)
└── meter-track
    └── meter-indicator`,

  nativeSelect: `NativeSelect.Root <span>
├── native <select>
│   ├── NativeSelect.Option
│   └── NativeSelect.OptGroup
│       └── NativeSelect.Option
└── decorative chevron <svg>`,

  numberInput: `NumberInput.Root
├── NumberInput.Label
├── NumberInput.Control
│   ├── NumberInput.DecrementTrigger
│   ├── NumberInput.Input
│   ├── NumberInput.Unit
│   └── NumberInput.IncrementTrigger
├── NumberInput.ScrubbableInput (alternative)
└── NumberInput.ValueText`,

  pagination: `Pagination.Root <nav>
├── Pagination.Controls (compact alternative)
├── Pagination.FirstTrigger
├── Pagination.PrevTrigger
├── Pagination.Context (renderless)
│   ├── Pagination.Item
│   └── Pagination.Ellipsis
├── Pagination.NextTrigger
└── Pagination.LastTrigger`,

  popover: `Popover.Root
├── Popover.Anchor (optional custom reference)
├── Popover.Trigger
└── Popover.Content
    ├── Positioner + Teleport (automatic)
    ├── Popover.Arrow
    │   └── Popover.ArrowTip
    ├── Popover.Title
    ├── Popover.Description
    ├── interactive content
    └── Popover.Close`,

  presence: `Presence <div | custom child>
└── conditionally present content`,

  progress: `Progress.Root
├── Progress.Label
├── Progress.ValueText
├── Progress.Track
│   └── Progress.Range
├── Progress.View (optional)
└── Progress.Context (optional)`,

  progressCircle: `ProgressCircle.Root
├── ProgressCircle.Label
├── ProgressCircle.ValueText
├── ProgressCircle.Circle
│   ├── ProgressCircle.CircleTrack
│   └── ProgressCircle.CircleRange
├── ProgressCircle.View (optional)
└── ProgressCircle.Context (optional)`,

  qrCode: `QrCode.Root
├── QrCode.Frame <svg>
│   ├── Background <rect> (built in)
│   └── QrCode.Pattern <path>
├── QrCode.Overlay (optional)
├── QrCode.DownloadTrigger (optional)
└── QrCode.Context (optional)`,

  radio: `Radio.Root
├── Radio.Label
├── Radio.Indicator (optional)
├── Radio.Item
│   ├── HiddenInput (automatic)
│   ├── Radio.ItemControl
│   └── Radio.ItemText
└── Radio.Item
    ├── HiddenInput (automatic)
    ├── Radio.ItemControl
    └── Radio.ItemText`,

  rating: `Rating.Root
├── Rating.Label
├── Rating.Control
│   └── Rating.Item × count (automatic)
├── HiddenInput (automatic)
└── Rating.Context (optional)`,

  floatingPanel: `FloatingPanel.Root
├── FloatingPanel.Trigger
├── FloatingPanel.Positioner + Teleport
│   └── FloatingPanel.Content
│       ├── FloatingPanel.DragTrigger
│       │   └── FloatingPanel.Header
│       │       ├── FloatingPanel.Title
│       │       └── FloatingPanel.Control
│       │           ├── FloatingPanel.StageTrigger
│       │           └── FloatingPanel.Close
│       ├── FloatingPanel.Body
│       └── FloatingPanel.ResizeTrigger × edge/corner
└── FloatingPanel.Context (optional)`,

  resizable: `Resizable.Root
├── Resizable.Panel
├── Resizable.Handle / Resizable.ResizeTrigger
│   └── Resizable.ResizeTriggerIndicator
├── Resizable.Panel
└── Resizable.Context (optional)`,

  scrollArea: `ScrollArea.Root
├── ScrollArea.Viewport
│   └── ScrollArea.Content
├── ScrollArea.Scrollbar [vertical]
│   └── ScrollArea.Thumb
├── ScrollArea.Scrollbar [horizontal] (optional)
│   └── ScrollArea.Thumb
├── ScrollArea.Corner (with both axes)
└── ScrollArea.Context (optional)`,

  select: `Select.Root
├── Select.Label
├── Select.Control
│   └── Select.Trigger
│       ├── Select.ValueText
│       └── Select.Indicator
├── Select.Positioner + Teleport
│   └── Select.Content
│       └── Select.List
│           ├── Select.Group
│           │   ├── Select.GroupLabel
│           │   └── Select.Option
│           │       ├── Select.ItemText
│           │       └── Select.ItemIndicator
│           └── Select.Separator
└── Select.HiddenSelect (automatic)`,

  sensitiveInput: `SensitiveInput <div>
├── label (optional)
├── control
│   ├── input [password | text]
│   ├── copy action
│   └── reveal / hide action
├── description / error (optional)
└── live status`,

  separator: `Separator <hr>
└── decorative or semantic separator contract`,

  slider: `Slider.Root
├── Slider.Label
├── Slider.ValueText
├── Slider.Control
│   ├── Slider.Track
│   │   └── Slider.Range
│   └── Slider.Thumb
│       └── Slider.HiddenInput
├── Slider.MarkerGroup (optional)
│   └── Slider.Marker
├── Slider.DraggingIndicator (optional)
└── Slider.Context (optional)`,

  switch: `Switch.Root
├── Switch.Control
│   └── Switch.Thumb
├── Switch.Label
└── HiddenInput (automatic)`,

  sidebar: `Sidebar.Provider
├── Sidebar.Root <nav> / Ark Drawer on mobile
│   ├── Sidebar.Header
│   │   ├── Dropdown + MenuButton (namespace, optional)
│   │   └── Sidebar.Close (mobile)
│   ├── Sidebar.Content
│   │   └── Sidebar.Group
│   │       ├── Sidebar.GroupLabel
│   │       └── Sidebar.Menu <ul>
│   │           └── Sidebar.MenuItem <li>
│   │               ├── Sidebar.MenuButton
│   │               └── Sidebar.Collapsible (optional)
│   │                   ├── Sidebar.CollapsibleTrigger
│   │                   └── Sidebar.CollapsibleContent
│   │                       └── Sidebar.MenuSub <ul>
│   ├── Sidebar.Loading (alternative to Content)
│   ├── Sidebar.SlidingViews (optional)
│   │   └── Sidebar.SlidingView → Sidebar.Content
│   ├── Sidebar.Footer
│   │   ├── Dropdown + MenuButton (profile, optional)
│   │   └── Sidebar.Trigger
│   └── Sidebar.ResizeHandle (optional, desktop)
└── application content
    └── Sidebar.Trigger`,

  dataGrid: `DataGrid.Root <div>
├── toolbar slot (optional)
│   ├── application controls
│   └── DataGrid.ColumnVisibility (optional)
├── viewport
│   └── semantic table with grid keyboard behavior
│       ├── sortable and resizable headers
│       └── standard or virtual rows
└── footer slot (optional)
    └── DataGrid.Pagination (optional)

DataGrid.Context exposes the same reactive state to custom controls.`,

  table: `Table.Root <table>
├── Table.Caption (optional)
├── Table.Header <thead>
│   └── Table.Row
│       ├── Table.Head
│       └── Table.CheckHead (optional)
├── Table.Body <tbody>
│   └── Table.Row
│       ├── Table.Cell
│       ├── Table.CheckCell (optional)
│       └── Table.ResizeHandle (inside a head, optional)
└── Table.Footer (optional)`,

  tableOfContents: `TableOfContents.Root
├── TableOfContents.Content
│   └── document headings
└── TableOfContents.Nav
    ├── TableOfContents.Title
    └── TableOfContents.List
        ├── TableOfContents.Indicator
        └── TableOfContents.Item
            └── TableOfContents.Link`,

  tabs: `Tabs.Root
├── Tabs.List
│   ├── Tabs.Trigger
│   ├── Tabs.Trigger
│   └── Tabs.Indicator (optional)
├── Tabs.Content
└── Tabs.Content`,

  steps: `Steps.Root
├── Steps.Progress (optional)
├── Steps.List
│   └── Steps.Item (one per index)
│       ├── Steps.Trigger
│       │   └── Steps.Indicator
│       └── Steps.Separator (except last item)
├── Steps.Content (one per index)
├── Steps.CompletedContent
├── Steps.PrevTrigger
└── Steps.NextTrigger`,

  text: `Text <p | span | semantic text element>
└── default slot`,

  timer: `Timer.Root
├── Timer.Area
│   ├── Timer.Item
│   ├── Timer.Separator
│   └── Timer.Item
├── Timer.Control
│   └── Timer.ActionTrigger
└── Timer.Context (optional)`,

  toggle: `Toggle <button aria-pressed>
└── icon and/or visible label`,

  toggleGroup: `ToggleGroup.Root
├── ToggleGroup.Item
├── ToggleGroup.Item
├── ToggleGroup.Item
└── ToggleGroup.Context (optional)`,

  toolbar: `Toolbar.Root
├── Toolbar.Button
├── Toolbar.Separator
├── Toolbar.Link
├── Toolbar.Input
└── Toolbar.InputGroup`,

  tooltip: `Tooltip.Root
├── Tooltip.Trigger
└── Tooltip.Content
    ├── Positioner + Teleport (automatic)
    ├── Tooltip.Arrow (default)
    │   └── Tooltip.ArrowTip
    └── short, non-interactive content`,

  treeView: `TreeView.Root
├── TreeView.Label
└── TreeView.Tree
    └── TreeView.NodeProvider (recursive)
        ├── TreeView.Branch
        │   ├── TreeView.BranchControl
        │   │   ├── TreeView.BranchTrigger
        │   │   │   └── TreeView.BranchIndicator
        │   │   └── TreeView.BranchText
        │   └── TreeView.BranchContent
        │       └── child NodeProvider parts
        └── TreeView.Item
            └── TreeView.ItemText`,
} as const;
